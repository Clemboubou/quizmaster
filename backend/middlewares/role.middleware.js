const { errorResponse } = require('../utils/responses')

/**
 * Middleware de verification du role professeur
 */
function requireProf(req, res, next) {
    if (req.user.role !== 'prof' && req.user.role !== 'admin') {
        return errorResponse(res, 'FORBIDDEN', 'Acces reserve aux professeurs', 403)
    }
    next()
}

/**
 * Middleware de verification du role eleve
 */
function requireEleve(req, res, next) {
    if (req.user.role !== 'eleve') {
        return errorResponse(res, 'FORBIDDEN', 'Acces reserve aux eleves', 403)
    }
    next()
}

/**
 * Middleware de verification du role administrateur
 * Seuls les admins peuvent acceder aux routes protegees par ce middleware
 */
function requireAdmin(req, res, next) {
    if (req.user.role !== 'admin') {
        return errorResponse(res, 'FORBIDDEN', 'Acces reserve aux administrateurs', 403)
    }
    next()
}

module.exports = {
    requireProf,
    requireEleve,
    requireAdmin
}
