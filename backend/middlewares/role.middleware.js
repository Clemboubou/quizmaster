const { errorResponse } = require('../utils/responses');

/**
 * Middleware de verification du role professeur
 */
function requireProf(req, res, next) {
    if (req.user.role !== 'prof') {
        return errorResponse(res, 'FORBIDDEN', 'Acces reserve aux professeurs', 403);
    }
    next();
}

/**
 * Middleware de verification du role eleve
 */
function requireEleve(req, res, next) {
    if (req.user.role !== 'eleve') {
        return errorResponse(res, 'FORBIDDEN', 'Acces reserve aux eleves', 403);
    }
    next();
}

module.exports = {
    requireProf,
    requireEleve
};
