const jwt = require('jsonwebtoken');
const { errorResponse } = require('../utils/responses');

/**
 * Middleware de verification du token JWT
 */
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"

    if (!token) {
        return errorResponse(res, 'AUTH_ERROR', 'Token d\'authentification manquant', 401);
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return errorResponse(res, 'AUTH_ERROR', 'Token invalide ou expire', 401);
    }
}

module.exports = {
    authenticateToken
};
