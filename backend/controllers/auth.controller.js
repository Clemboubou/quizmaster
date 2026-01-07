const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');
const { successResponse, errorResponse } = require('../utils/responses');

/**
 * Inscription d'un nouvel utilisateur
 * POST /api/auth/register
 */
async function register(req, res) {
    try {
        const { email, password, role } = req.body;

        // Verifier si l'email existe deja
        const [existingUsers] = await pool.query(
            'SELECT id FROM users WHERE email = ?',
            [email]
        );

        if (existingUsers.length > 0) {
            return errorResponse(res, 'CONFLICT', 'Cet email est deja utilise', 409, 'email');
        }

        // Hasher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Creer l'utilisateur
        const [result] = await pool.query(
            'INSERT INTO users (email, password, role, is_premium) VALUES (?, ?, ?, ?)',
            [email, hashedPassword, role, false]
        );

        // Generer le token JWT
        const token = jwt.sign(
            { userId: result.insertId, role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        // Recuperer l'utilisateur cree
        const [users] = await pool.query(
            'SELECT id, email, role, is_premium, created_at FROM users WHERE id = ?',
            [result.insertId]
        );

        return successResponse(res, {
            user: users[0],
            token
        }, 201);

    } catch (error) {
        console.error('Erreur inscription:', error);
        return errorResponse(res, 'INTERNAL_ERROR', 'Erreur lors de l\'inscription', 500);
    }
}

/**
 * Connexion d'un utilisateur
 * POST /api/auth/login
 */
async function login(req, res) {
    try {
        const { email, password } = req.body;

        // Rechercher l'utilisateur
        const [users] = await pool.query(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        if (users.length === 0) {
            return errorResponse(res, 'AUTH_ERROR', 'Email ou mot de passe incorrect', 401);
        }

        const user = users[0];

        // Verifier le mot de passe
        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return errorResponse(res, 'AUTH_ERROR', 'Email ou mot de passe incorrect', 401);
        }

        // Generer le token JWT
        const token = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        // Retourner l'utilisateur sans le mot de passe
        const { password: _, ...userWithoutPassword } = user;

        return successResponse(res, {
            user: userWithoutPassword,
            token
        });

    } catch (error) {
        console.error('Erreur connexion:', error);
        return errorResponse(res, 'INTERNAL_ERROR', 'Erreur lors de la connexion', 500);
    }
}

/**
 * Recuperer le profil de l'utilisateur connecte
 * GET /api/auth/me
 */
async function getMe(req, res) {
    try {
        const [users] = await pool.query(
            'SELECT id, email, role, is_premium, created_at FROM users WHERE id = ?',
            [req.user.userId]
        );

        if (users.length === 0) {
            return errorResponse(res, 'NOT_FOUND', 'Utilisateur non trouve', 404);
        }

        return successResponse(res, users[0]);

    } catch (error) {
        console.error('Erreur getMe:', error);
        return errorResponse(res, 'INTERNAL_ERROR', 'Erreur lors de la recuperation du profil', 500);
    }
}

/**
 * Deconnexion (cote client principalement, on invalide rien cote serveur avec JWT)
 * POST /api/auth/logout
 */
async function logout(req, res) {
    // Avec JWT stateless, la deconnexion se fait cote client en supprimant le token
    return successResponse(res, { message: 'Deconnexion reussie' });
}

module.exports = {
    register,
    login,
    getMe,
    logout
};
