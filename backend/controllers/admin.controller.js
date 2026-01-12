/**
 * Controller Admin - Gestion des utilisateurs et logs
 *
 * Ce controller fournit toutes les fonctionnalites d'administration :
 * - Dashboard avec statistiques
 * - Gestion des utilisateurs (CRUD)
 * - Consultation des logs
 */

const pool = require('../config/database')
const bcrypt = require('bcrypt')
const { successResponse, errorResponse } = require('../utils/responses')
const { log, getLogs, getLogStats, LOG_ACTIONS } = require('../utils/logger')

/**
 * GET /api/admin/dashboard
 * Recupere les statistiques du dashboard admin
 */
async function getDashboard(req, res) {
    try {
        // Logger l'acces admin
        await log({
            userId: req.user.userId,
            action: LOG_ACTIONS.ADMIN_ACCESS,
            details: { page: 'dashboard' },
            req
        })

        // Statistiques utilisateurs
        const [userStats] = await pool.query(`
            SELECT
                COUNT(*) as total,
                SUM(CASE WHEN role = 'prof' THEN 1 ELSE 0 END) as profs,
                SUM(CASE WHEN role = 'eleve' THEN 1 ELSE 0 END) as eleves,
                SUM(CASE WHEN role = 'admin' THEN 1 ELSE 0 END) as admins,
                SUM(CASE WHEN is_premium = 1 THEN 1 ELSE 0 END) as premium,
                SUM(CASE WHEN is_active = 0 THEN 1 ELSE 0 END) as inactive,
                SUM(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 ELSE 0 END) as new_this_week
            FROM users
        `)

        // Statistiques quiz
        const [quizStats] = await pool.query(`
            SELECT
                COUNT(*) as total,
                SUM(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 ELSE 0 END) as new_this_week
            FROM quizzes
        `)

        // Statistiques questions
        const [questionStats] = await pool.query(`
            SELECT COUNT(*) as total FROM questions
        `)

        // Statistiques resultats
        const [resultStats] = await pool.query(`
            SELECT
                COUNT(*) as total,
                AVG(score) as avg_score,
                SUM(CASE WHEN played_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 ELSE 0 END) as played_this_week
            FROM results
        `)

        // Statistiques paiements
        const [paymentStats] = await pool.query(`
            SELECT
                COUNT(*) as total,
                SUM(CASE WHEN status = 'completed' THEN amount ELSE 0 END) as total_revenue,
                SUM(CASE WHEN status = 'completed' AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN amount ELSE 0 END) as revenue_this_month
            FROM payments
        `)

        // Derniers logs
        const recentLogs = await getLogs({ limit: 10 })

        // Stats des logs
        const logStats = await getLogStats()

        return successResponse(res, {
            users: userStats[0],
            quizzes: quizStats[0],
            questions: questionStats[0],
            results: {
                ...resultStats[0],
                avg_score: Math.round(resultStats[0].avg_score * 100) / 100 || 0
            },
            payments: paymentStats[0],
            recentLogs: recentLogs.logs,
            logStats
        })
    } catch (error) {
        console.error('Erreur getDashboard:', error)
        return errorResponse(res, 'INTERNAL_ERROR', 'Erreur lors de la recuperation du dashboard', 500)
    }
}

/**
 * GET /api/admin/users
 * Liste tous les utilisateurs avec pagination et filtres
 */
async function getUsers(req, res) {
    try {
        const { page = 1, limit = 20, role, search, is_active } = req.query
        const offset = (parseInt(page) - 1) * parseInt(limit)

        // Logger l'acces
        await log({
            userId: req.user.userId,
            action: LOG_ACTIONS.ADMIN_VIEW_USERS,
            details: { filters: { role, search, is_active } },
            req
        })

        // Construire la requete avec filtres
        const conditions = []
        const params = []

        if (role) {
            conditions.push('role = ?')
            params.push(role)
        }

        if (search) {
            conditions.push('email LIKE ?')
            params.push(`%${search}%`)
        }

        if (is_active !== undefined) {
            conditions.push('is_active = ?')
            params.push(is_active === 'true' ? 1 : 0)
        }

        const whereClause = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : ''

        // Recuperer les utilisateurs
        const [users] = await pool.query(
            `SELECT id, email, role, is_premium, is_active, created_at
             FROM users
             ${whereClause}
             ORDER BY created_at DESC
             LIMIT ? OFFSET ?`,
            [...params, parseInt(limit), offset]
        )

        // Compter le total
        const [countResult] = await pool.query(`SELECT COUNT(*) as total FROM users ${whereClause}`, params)

        // Ajouter des stats par utilisateur
        const usersWithStats = await Promise.all(
            users.map(async user => {
                if (user.role === 'prof') {
                    const [quizCount] = await pool.query('SELECT COUNT(*) as count FROM quizzes WHERE user_id = ?', [
                        user.id
                    ])
                    return { ...user, quiz_count: quizCount[0].count }
                } else if (user.role === 'eleve') {
                    const [resultCount] = await pool.query('SELECT COUNT(*) as count FROM results WHERE user_id = ?', [
                        user.id
                    ])
                    return { ...user, result_count: resultCount[0].count }
                }
                return user
            })
        )

        return successResponse(res, {
            users: usersWithStats,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: countResult[0].total,
                totalPages: Math.ceil(countResult[0].total / parseInt(limit))
            }
        })
    } catch (error) {
        console.error('Erreur getUsers:', error)
        return errorResponse(res, 'INTERNAL_ERROR', 'Erreur lors de la recuperation des utilisateurs', 500)
    }
}

/**
 * GET /api/admin/users/:id
 * Recupere les details d'un utilisateur
 */
async function getUserById(req, res) {
    try {
        const { id } = req.params

        const [users] = await pool.query(
            `SELECT id, email, role, is_premium, is_active, created_at
             FROM users WHERE id = ?`,
            [id]
        )

        if (users.length === 0) {
            return errorResponse(res, 'NOT_FOUND', 'Utilisateur non trouve', 404)
        }

        const user = users[0]

        // Recuperer les quiz si prof
        let quizzes = []
        if (user.role === 'prof') {
            const [quizResult] = await pool.query(
                `SELECT id, title, access_code, created_at,
                    (SELECT COUNT(*) FROM questions WHERE quiz_id = quizzes.id) as question_count,
                    (SELECT COUNT(*) FROM results WHERE quiz_id = quizzes.id) as result_count
                 FROM quizzes WHERE user_id = ?
                 ORDER BY created_at DESC`,
                [id]
            )
            quizzes = quizResult
        }

        // Recuperer les resultats si eleve
        let results = []
        if (user.role === 'eleve') {
            const [resultResult] = await pool.query(
                `SELECT r.id, r.score, r.played_at, q.title as quiz_title
                 FROM results r
                 JOIN quizzes q ON r.quiz_id = q.id
                 WHERE r.user_id = ?
                 ORDER BY r.played_at DESC
                 LIMIT 20`,
                [id]
            )
            results = resultResult
        }

        // Recuperer les paiements
        const [payments] = await pool.query(
            `SELECT id, amount, status, created_at
             FROM payments WHERE user_id = ?
             ORDER BY created_at DESC`,
            [id]
        )

        // Recuperer les derniers logs de cet utilisateur
        const userLogs = await getLogs({ userId: id, limit: 20 })

        return successResponse(res, {
            user,
            quizzes,
            results,
            payments,
            logs: userLogs.logs
        })
    } catch (error) {
        console.error('Erreur getUserById:', error)
        return errorResponse(res, 'INTERNAL_ERROR', 'Erreur lors de la recuperation de l utilisateur', 500)
    }
}

/**
 * PUT /api/admin/users/:id
 * Met a jour un utilisateur
 */
async function updateUser(req, res) {
    try {
        const { id } = req.params
        const { role, is_premium, is_active } = req.body

        // Verifier que l'utilisateur existe
        const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [id])
        if (users.length === 0) {
            return errorResponse(res, 'NOT_FOUND', 'Utilisateur non trouve', 404)
        }

        const user = users[0]

        // Empecher de modifier son propre compte admin
        if (parseInt(id) === req.user.userId && role !== 'admin') {
            return errorResponse(res, 'FORBIDDEN', 'Vous ne pouvez pas retirer vos droits admin', 403)
        }

        // Construire la requete de mise a jour
        const updates = []
        const params = []
        const changes = {}

        if (role !== undefined && role !== user.role) {
            updates.push('role = ?')
            params.push(role)
            changes.role = { from: user.role, to: role }

            // Logger le changement de role
            await log({
                userId: req.user.userId,
                action: LOG_ACTIONS.USER_ROLE_CHANGED,
                targetType: 'user',
                targetId: parseInt(id),
                details: { from: user.role, to: role },
                req
            })
        }

        if (is_premium !== undefined && is_premium !== user.is_premium) {
            updates.push('is_premium = ?')
            params.push(is_premium)
            changes.is_premium = { from: user.is_premium, to: is_premium }

            // Logger le changement premium
            await log({
                userId: req.user.userId,
                action: is_premium ? LOG_ACTIONS.USER_PREMIUM_GRANTED : LOG_ACTIONS.USER_PREMIUM_REVOKED,
                targetType: 'user',
                targetId: parseInt(id),
                req
            })
        }

        if (is_active !== undefined && is_active !== user.is_active) {
            updates.push('is_active = ?')
            params.push(is_active)
            changes.is_active = { from: user.is_active, to: is_active }

            // Logger l'activation/desactivation
            await log({
                userId: req.user.userId,
                action: is_active ? LOG_ACTIONS.USER_ACTIVATED : LOG_ACTIONS.USER_DEACTIVATED,
                targetType: 'user',
                targetId: parseInt(id),
                req
            })
        }

        if (updates.length === 0) {
            return errorResponse(res, 'VALIDATION_ERROR', 'Aucune modification fournie', 400)
        }

        params.push(id)
        await pool.query(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, params)

        // Logger la mise a jour generale
        await log({
            userId: req.user.userId,
            action: LOG_ACTIONS.USER_UPDATED,
            targetType: 'user',
            targetId: parseInt(id),
            details: changes,
            req
        })

        return successResponse(res, { message: 'Utilisateur mis a jour', changes })
    } catch (error) {
        console.error('Erreur updateUser:', error)
        return errorResponse(res, 'INTERNAL_ERROR', 'Erreur lors de la mise a jour', 500)
    }
}

/**
 * DELETE /api/admin/users/:id
 * Supprime un utilisateur
 */
async function deleteUser(req, res) {
    try {
        const { id } = req.params

        // Empecher de supprimer son propre compte
        if (parseInt(id) === req.user.userId) {
            return errorResponse(res, 'FORBIDDEN', 'Vous ne pouvez pas supprimer votre propre compte', 403)
        }

        // Verifier que l'utilisateur existe
        const [users] = await pool.query('SELECT email, role FROM users WHERE id = ?', [id])
        if (users.length === 0) {
            return errorResponse(res, 'NOT_FOUND', 'Utilisateur non trouve', 404)
        }

        const user = users[0]

        // Supprimer l'utilisateur (CASCADE supprimera les quiz, resultats, etc.)
        await pool.query('DELETE FROM users WHERE id = ?', [id])

        // Logger la suppression
        await log({
            userId: req.user.userId,
            action: LOG_ACTIONS.USER_DELETED,
            targetType: 'user',
            targetId: parseInt(id),
            details: { email: user.email, role: user.role },
            req
        })

        return successResponse(res, { message: 'Utilisateur supprime' })
    } catch (error) {
        console.error('Erreur deleteUser:', error)
        return errorResponse(res, 'INTERNAL_ERROR', 'Erreur lors de la suppression', 500)
    }
}

/**
 * POST /api/admin/users
 * Cree un nouvel utilisateur (admin peut creer des comptes)
 */
async function createUser(req, res) {
    try {
        const { email, password, role } = req.body

        // Validation
        if (!email || !password || !role) {
            return errorResponse(res, 'VALIDATION_ERROR', 'Email, mot de passe et role requis', 400)
        }

        if (!['prof', 'eleve', 'admin'].includes(role)) {
            return errorResponse(res, 'VALIDATION_ERROR', 'Role invalide', 400)
        }

        // Verifier si l'email existe deja
        const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email])
        if (existing.length > 0) {
            return errorResponse(res, 'EMAIL_EXISTS', 'Cet email est deja utilise', 409)
        }

        // Hasher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10)

        // Creer l'utilisateur
        const [result] = await pool.query(
            `INSERT INTO users (email, password, role, is_premium, is_active)
             VALUES (?, ?, ?, ?, ?)`,
            [email, hashedPassword, role, role === 'admin', true]
        )

        // Logger la creation
        await log({
            userId: req.user.userId,
            action: LOG_ACTIONS.USER_CREATED,
            targetType: 'user',
            targetId: result.insertId,
            details: { email, role },
            req
        })

        return successResponse(
            res,
            {
                id: result.insertId,
                email,
                role,
                message: 'Utilisateur cree avec succes'
            },
            201
        )
    } catch (error) {
        console.error('Erreur createUser:', error)
        return errorResponse(res, 'INTERNAL_ERROR', 'Erreur lors de la creation', 500)
    }
}

/**
 * GET /api/admin/logs
 * Recupere les logs avec pagination et filtres
 */
async function getLogsController(req, res) {
    try {
        const { page = 1, limit = 50, action, user_id, target_type, start_date, end_date } = req.query

        // Logger l'acces aux logs
        await log({
            userId: req.user.userId,
            action: LOG_ACTIONS.ADMIN_VIEW_LOGS,
            details: { filters: { action, user_id, target_type, start_date, end_date } },
            req
        })

        const result = await getLogs({
            page: parseInt(page),
            limit: parseInt(limit),
            action,
            userId: user_id ? parseInt(user_id) : null,
            targetType: target_type,
            startDate: start_date,
            endDate: end_date
        })

        return successResponse(res, result)
    } catch (error) {
        console.error('Erreur getLogs:', error)
        return errorResponse(res, 'INTERNAL_ERROR', 'Erreur lors de la recuperation des logs', 500)
    }
}

/**
 * GET /api/admin/logs/stats
 * Recupere les statistiques des logs
 */
async function getLogsStats(req, res) {
    try {
        const stats = await getLogStats()
        return successResponse(res, stats)
    } catch (error) {
        console.error('Erreur getLogsStats:', error)
        return errorResponse(res, 'INTERNAL_ERROR', 'Erreur lors de la recuperation des stats', 500)
    }
}

module.exports = {
    getDashboard,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    createUser,
    getLogs: getLogsController,
    getLogsStats
}
