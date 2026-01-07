const { errorResponse } = require('../utils/responses');

/**
 * Valide les donnees de creation/modification de quiz
 */
function validateQuiz(req, res, next) {
    const { title } = req.body;

    if (!title) {
        return errorResponse(res, 'VALIDATION_ERROR', 'Le titre est requis', 400, 'title');
    }
    if (title.length < 3) {
        return errorResponse(res, 'VALIDATION_ERROR', 'Le titre doit contenir au moins 3 caracteres', 400, 'title');
    }
    if (title.length > 100) {
        return errorResponse(res, 'VALIDATION_ERROR', 'Le titre ne doit pas depasser 100 caracteres', 400, 'title');
    }

    next();
}

module.exports = {
    validateQuiz
};
