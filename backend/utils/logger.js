/**
 * Service de logging pour QuizMaster
 *
 * Ce service enregistre toutes les actions importantes dans la table logs.
 * Chaque log contient :
 * - user_id : l'utilisateur qui a effectue l'action (peut etre null)
 * - action : le type d'action (LOGIN, CREATE_QUIZ, DELETE_USER, etc.)
 * - target_type : le type d'entite concernee (user, quiz, question, etc.)
 * - target_id : l'ID de l'entite concernee
 * - details : informations supplementaires en JSON
 * - ip_address : l'adresse IP du client
 * - user_agent : le navigateur/client utilise
 * - created_at : date et heure de l'action
 */

const pool = require('../config/database')

/**
 * Actions predefinies pour coherence
 */
const LOG_ACTIONS = {
    // Authentification
    LOGIN: 'LOGIN',
    LOGIN_FAILED: 'LOGIN_FAILED',
    LOGOUT: 'LOGOUT',
    REGISTER: 'REGISTER',

    // Utilisateurs (admin)
    USER_CREATED: 'USER_CREATED',
    USER_UPDATED: 'USER_UPDATED',
    USER_DELETED: 'USER_DELETED',
    USER_ACTIVATED: 'USER_ACTIVATED',
    USER_DEACTIVATED: 'USER_DEACTIVATED',
    USER_ROLE_CHANGED: 'USER_ROLE_CHANGED',
    USER_PREMIUM_GRANTED: 'USER_PREMIUM_GRANTED',
    USER_PREMIUM_REVOKED: 'USER_PREMIUM_REVOKED',

    // Quiz
    QUIZ_CREATED: 'QUIZ_CREATED',
    QUIZ_UPDATED: 'QUIZ_UPDATED',
    QUIZ_DELETED: 'QUIZ_DELETED',

    // Questions
    QUESTION_CREATED: 'QUESTION_CREATED',
    QUESTION_UPDATED: 'QUESTION_UPDATED',
    QUESTION_DELETED: 'QUESTION_DELETED',

    // Resultats
    QUIZ_PLAYED: 'QUIZ_PLAYED',

    // Paiement
    PAYMENT_INITIATED: 'PAYMENT_INITIATED',
    PAYMENT_COMPLETED: 'PAYMENT_COMPLETED',
    PAYMENT_FAILED: 'PAYMENT_FAILED',

    // Admin
    ADMIN_ACCESS: 'ADMIN_ACCESS',
    ADMIN_VIEW_LOGS: 'ADMIN_VIEW_LOGS',
    ADMIN_VIEW_USERS: 'ADMIN_VIEW_USERS'
}

/**
 * Enregistre une action dans les logs
 *
 * @param {Object} options - Options du log
 * @param {number|null} options.userId - ID de l'utilisateur (null si non connecte)
 * @param {string} options.action - Type d'action (utiliser LOG_ACTIONS)
 * @param {string|null} options.targetType - Type d'entite (user, quiz, question, etc.)
 * @param {number|null} options.targetId - ID de l'entite concernee
 * @param {Object|null} options.details - Details supplementaires
 * @param {Object} options.req - Objet request Express (pour IP et user-agent)
 */
async function log(options) {
    const {
        userId = null,
        action,
        targetType = null,
        targetId = null,
        details = null,
        req = null
    } = options

    // Extraire IP et User-Agent de la requete
    let ipAddress = null
    let userAgent = null

    if (req) {
        // Gerer les proxies (X-Forwarded-For)
        ipAddress =
            req.headers['x-forwarded-for']?.split(',')[0] || req.ip || req.connection?.remoteAddress
        userAgent = req.headers['user-agent'] || null
    }

    try {
        await pool.query(
            `INSERT INTO logs (user_id, action, target_type, target_id, details, ip_address, user_agent)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                userId,
                action,
                targetType,
                targetId,
                details ? JSON.stringify(details) : null,
                ipAddress,
                userAgent
            ]
        )
    } catch (error) {
        // Ne pas faire planter l'application si le logging echoue
        console.error('Erreur lors du logging:', error.message)
    }
}

/**
 * Recupere les logs avec pagination et filtres
 *
 * @param {Object} options - Options de filtrage
 * @param {number} options.page - Page (defaut: 1)
 * @param {number} options.limit - Nombre par page (defaut: 50)
 * @param {string|null} options.action - Filtrer par action
 * @param {number|null} options.userId - Filtrer par utilisateur
 * @param {string|null} options.targetType - Filtrer par type de cible
 * @param {string|null} options.startDate - Date de debut (YYYY-MM-DD)
 * @param {string|null} options.endDate - Date de fin (YYYY-MM-DD)
 */
async function getLogs(options = {}) {
    const {
        page = 1,
        limit = 50,
        action = null,
        userId = null,
        targetType = null,
        startDate = null,
        endDate = null
    } = options

    const offset = (page - 1) * limit
    const conditions = []
    const params = []

    if (action) {
        conditions.push('l.action = ?')
        params.push(action)
    }

    if (userId) {
        conditions.push('l.user_id = ?')
        params.push(userId)
    }

    if (targetType) {
        conditions.push('l.target_type = ?')
        params.push(targetType)
    }

    if (startDate) {
        conditions.push('l.created_at >= ?')
        params.push(startDate + ' 00:00:00')
    }

    if (endDate) {
        conditions.push('l.created_at <= ?')
        params.push(endDate + ' 23:59:59')
    }

    const whereClause = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : ''

    // Recuperer les logs avec l'email de l'utilisateur
    const [logs] = await pool.query(
        `SELECT l.*, u.email as user_email
         FROM logs l
         LEFT JOIN users u ON l.user_id = u.id
         ${whereClause}
         ORDER BY l.created_at DESC
         LIMIT ? OFFSET ?`,
        [...params, limit, offset]
    )

    // Compter le total pour la pagination
    const [countResult] = await pool.query(
        `SELECT COUNT(*) as total FROM logs l ${whereClause}`,
        params
    )

    return {
        logs,
        pagination: {
            page,
            limit,
            total: countResult[0].total,
            totalPages: Math.ceil(countResult[0].total / limit)
        }
    }
}

/**
 * Recupere les statistiques des logs
 */
async function getLogStats() {
    // Actions des dernières 24h
    const [last24h] = await pool.query(
        `SELECT action, COUNT(*) as count
         FROM logs
         WHERE created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
         GROUP BY action
         ORDER BY count DESC`
    )

    // Actions des 7 derniers jours
    const [last7days] = await pool.query(
        `SELECT DATE(created_at) as date, COUNT(*) as count
         FROM logs
         WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
         GROUP BY DATE(created_at)
         ORDER BY date ASC`
    )

    // Top utilisateurs actifs
    const [topUsers] = await pool.query(
        `SELECT l.user_id, u.email, COUNT(*) as action_count
         FROM logs l
         LEFT JOIN users u ON l.user_id = u.id
         WHERE l.user_id IS NOT NULL
         AND l.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
         GROUP BY l.user_id
         ORDER BY action_count DESC
         LIMIT 10`
    )

    // Total des logs
    const [total] = await pool.query('SELECT COUNT(*) as total FROM logs')

    return {
        last24h,
        last7days,
        topUsers,
        totalLogs: total[0].total
    }
}

module.exports = {
    log,
    getLogs,
    getLogStats,
    LOG_ACTIONS
}
