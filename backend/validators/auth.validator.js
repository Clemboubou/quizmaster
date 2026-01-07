const { errorResponse } = require('../utils/responses');

/**
 * Valide les donnees d'inscription
 */
function validateRegister(req, res, next) {
    const { email, password, role } = req.body;

    // Email requis et format valide
    if (!email) {
        return errorResponse(res, 'VALIDATION_ERROR', 'L\'email est requis', 400, 'email');
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return errorResponse(res, 'VALIDATION_ERROR', 'Format d\'email invalide', 400, 'email');
    }
    if (email.length > 255) {
        return errorResponse(res, 'VALIDATION_ERROR', 'L\'email ne doit pas depasser 255 caracteres', 400, 'email');
    }

    // Password requis et regles de securite
    if (!password) {
        return errorResponse(res, 'VALIDATION_ERROR', 'Le mot de passe est requis', 400, 'password');
    }
    if (password.length < 8) {
        return errorResponse(res, 'VALIDATION_ERROR', 'Le mot de passe doit contenir au moins 8 caracteres', 400, 'password');
    }
    if (!/[A-Z]/.test(password)) {
        return errorResponse(res, 'VALIDATION_ERROR', 'Le mot de passe doit contenir au moins une majuscule', 400, 'password');
    }
    if (!/[a-z]/.test(password)) {
        return errorResponse(res, 'VALIDATION_ERROR', 'Le mot de passe doit contenir au moins une minuscule', 400, 'password');
    }
    if (!/[0-9]/.test(password)) {
        return errorResponse(res, 'VALIDATION_ERROR', 'Le mot de passe doit contenir au moins un chiffre', 400, 'password');
    }

    // Role requis et valide
    if (!role) {
        return errorResponse(res, 'VALIDATION_ERROR', 'Le role est requis', 400, 'role');
    }
    if (!['prof', 'eleve'].includes(role)) {
        return errorResponse(res, 'VALIDATION_ERROR', 'Le role doit etre "prof" ou "eleve"', 400, 'role');
    }

    next();
}

/**
 * Valide les donnees de connexion
 */
function validateLogin(req, res, next) {
    const { email, password } = req.body;

    if (!email) {
        return errorResponse(res, 'VALIDATION_ERROR', 'L\'email est requis', 400, 'email');
    }
    if (!password) {
        return errorResponse(res, 'VALIDATION_ERROR', 'Le mot de passe est requis', 400, 'password');
    }

    next();
}

module.exports = {
    validateRegister,
    validateLogin
};
