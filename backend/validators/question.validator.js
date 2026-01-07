const { errorResponse } = require('../utils/responses');

/**
 * Valide les donnees de creation/modification de question
 */
function validateQuestion(req, res, next) {
    const { quiz_id, type, question_text, options, correct_answer } = req.body;

    // Quiz ID requis
    if (!quiz_id) {
        return errorResponse(res, 'VALIDATION_ERROR', 'L\'identifiant du quiz est requis', 400, 'quiz_id');
    }

    // Type requis et valide
    if (!type) {
        return errorResponse(res, 'VALIDATION_ERROR', 'Le type de question est requis', 400, 'type');
    }
    if (!['qcm', 'vf'].includes(type)) {
        return errorResponse(res, 'VALIDATION_ERROR', 'Le type doit etre "qcm" ou "vf"', 400, 'type');
    }

    // Texte de la question
    if (!question_text) {
        return errorResponse(res, 'VALIDATION_ERROR', 'Le texte de la question est requis', 400, 'question_text');
    }
    if (question_text.length < 10) {
        return errorResponse(res, 'VALIDATION_ERROR', 'Le texte de la question doit contenir au moins 10 caracteres', 400, 'question_text');
    }
    if (question_text.length > 500) {
        return errorResponse(res, 'VALIDATION_ERROR', 'Le texte de la question ne doit pas depasser 500 caracteres', 400, 'question_text');
    }

    // Options requises et format valide
    if (!options) {
        return errorResponse(res, 'VALIDATION_ERROR', 'Les options sont requises', 400, 'options');
    }
    if (!Array.isArray(options)) {
        return errorResponse(res, 'VALIDATION_ERROR', 'Les options doivent etre un tableau', 400, 'options');
    }

    // Verification du nombre d'options selon le type
    if (type === 'qcm' && options.length !== 4) {
        return errorResponse(res, 'VALIDATION_ERROR', 'Un QCM doit avoir exactement 4 options', 400, 'options');
    }
    if (type === 'vf' && options.length !== 2) {
        return errorResponse(res, 'VALIDATION_ERROR', 'Une question Vrai/Faux doit avoir exactement 2 options', 400, 'options');
    }

    // Reponse correcte requise et presente dans les options
    if (!correct_answer) {
        return errorResponse(res, 'VALIDATION_ERROR', 'La reponse correcte est requise', 400, 'correct_answer');
    }
    if (!options.includes(correct_answer)) {
        return errorResponse(res, 'VALIDATION_ERROR', 'La reponse correcte doit etre presente dans les options', 400, 'correct_answer');
    }

    next();
}

module.exports = {
    validateQuestion
};
