/**
 * Routes Admin - Gestion des utilisateurs et logs
 *
 * Toutes ces routes necessitent une authentification admin
 */

const express = require('express')
const router = express.Router()
const { authenticateToken } = require('../middlewares/auth.middleware')
const { requireAdmin } = require('../middlewares/role.middleware')
const adminController = require('../controllers/admin.controller')

// Toutes les routes admin necessitent authentification + role admin
router.use(authenticateToken)
router.use(requireAdmin)

/**
 * @swagger
 * /api/admin/dashboard:
 *   get:
 *     summary: Recupere les statistiques du dashboard admin
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistiques du dashboard
 *       403:
 *         description: Acces refuse (non admin)
 */
router.get('/dashboard', adminController.getDashboard)

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Liste tous les utilisateurs
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Numero de page
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Nombre par page
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [prof, eleve, admin]
 *         description: Filtrer par role
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Rechercher par email
 *       - in: query
 *         name: is_active
 *         schema:
 *           type: boolean
 *         description: Filtrer par statut actif
 *     responses:
 *       200:
 *         description: Liste des utilisateurs avec pagination
 */
router.get('/users', adminController.getUsers)

/**
 * @swagger
 * /api/admin/users:
 *   post:
 *     summary: Cree un nouvel utilisateur
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - role
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [prof, eleve, admin]
 *     responses:
 *       201:
 *         description: Utilisateur cree
 *       409:
 *         description: Email deja utilise
 */
router.post('/users', adminController.createUser)

/**
 * @swagger
 * /api/admin/users/{id}:
 *   get:
 *     summary: Recupere les details d'un utilisateur
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Details de l'utilisateur
 *       404:
 *         description: Utilisateur non trouve
 */
router.get('/users/:id', adminController.getUserById)

/**
 * @swagger
 * /api/admin/users/{id}:
 *   put:
 *     summary: Met a jour un utilisateur
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [prof, eleve, admin]
 *               is_premium:
 *                 type: boolean
 *               is_active:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Utilisateur mis a jour
 *       403:
 *         description: Impossible de modifier son propre role admin
 *       404:
 *         description: Utilisateur non trouve
 */
router.put('/users/:id', adminController.updateUser)

/**
 * @swagger
 * /api/admin/users/{id}:
 *   delete:
 *     summary: Supprime un utilisateur
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Utilisateur supprime
 *       403:
 *         description: Impossible de supprimer son propre compte
 *       404:
 *         description: Utilisateur non trouve
 */
router.delete('/users/:id', adminController.deleteUser)

/**
 * @swagger
 * /api/admin/logs:
 *   get:
 *     summary: Recupere les logs systeme
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: action
 *         schema:
 *           type: string
 *         description: Filtrer par type d'action
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: integer
 *         description: Filtrer par utilisateur
 *       - in: query
 *         name: target_type
 *         schema:
 *           type: string
 *         description: Filtrer par type de cible
 *       - in: query
 *         name: start_date
 *         schema:
 *           type: string
 *           format: date
 *         description: Date de debut (YYYY-MM-DD)
 *       - in: query
 *         name: end_date
 *         schema:
 *           type: string
 *           format: date
 *         description: Date de fin (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Liste des logs avec pagination
 */
router.get('/logs', adminController.getLogs)

/**
 * @swagger
 * /api/admin/logs/stats:
 *   get:
 *     summary: Recupere les statistiques des logs
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistiques des logs
 */
router.get('/logs/stats', adminController.getLogsStats)

module.exports = router
