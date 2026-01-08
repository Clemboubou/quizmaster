const pool = require('../config/database');
const { successResponse, errorResponse } = require('../utils/responses');

/**
 * Enregistrer un score (pour les eleves)
 * POST /api/results
 */
async function createResult(req, res) {
    try {
        const { quiz_id, score, answers } = req.body;
        const userId = req.user.userId;

        // Valider le score
        if (typeof score !== 'number' || score < 0) {
            return errorResponse(res, 'VALIDATION_ERROR', 'Le score doit etre un entier positif ou nul', 400, 'score');
        }

        // Verifier que le quiz existe
        const [quizzes] = await pool.query(
            'SELECT * FROM quizzes WHERE id = ?',
            [quiz_id]
        );

        if (quizzes.length === 0) {
            return errorResponse(res, 'NOT_FOUND', 'Quiz non trouve', 404);
        }

        // Enregistrer le resultat
        const [result] = await pool.query(
            'INSERT INTO results (user_id, quiz_id, score) VALUES (?, ?, ?)',
            [userId, quiz_id, score]
        );

        const resultId = result.insertId;

        // Enregistrer les reponses detaillees si fournies
        if (answers && Array.isArray(answers)) {
            for (const answer of answers) {
                await pool.query(
                    'INSERT INTO answers (result_id, question_id, user_answer, is_correct) VALUES (?, ?, ?, ?)',
                    [resultId, answer.question_id, answer.user_answer, answer.is_correct]
                );
            }
        }

        // Recuperer le resultat cree
        const [results] = await pool.query(
            'SELECT * FROM results WHERE id = ?',
            [resultId]
        );

        return successResponse(res, results[0], 201);

    } catch (error) {
        console.error('Erreur createResult:', error);
        return errorResponse(res, 'INTERNAL_ERROR', 'Erreur lors de l\'enregistrement du score', 500);
    }
}

/**
 * Recuperer les resultats d'un quiz (pour les professeurs)
 * GET /api/results/quiz/:quizId
 */
async function getResultsByQuiz(req, res) {
    try {
        const { quizId } = req.params;

        // Verifier que le quiz appartient au professeur
        const [quizzes] = await pool.query(
            'SELECT * FROM quizzes WHERE id = ? AND user_id = ?',
            [quizId, req.user.userId]
        );

        if (quizzes.length === 0) {
            return errorResponse(res, 'NOT_FOUND', 'Quiz non trouve', 404);
        }

        // Recuperer les resultats avec les infos des eleves
        const [results] = await pool.query(
            `SELECT r.id, r.score, r.played_at, u.email as student_email
             FROM results r
             JOIN users u ON r.user_id = u.id
             WHERE r.quiz_id = ?
             ORDER BY r.played_at DESC`,
            [quizId]
        );

        return successResponse(res, results);

    } catch (error) {
        console.error('Erreur getResultsByQuiz:', error);
        return errorResponse(res, 'INTERNAL_ERROR', 'Erreur lors de la recuperation des resultats', 500);
    }
}

/**
 * Recuperer mes resultats (pour les eleves)
 * GET /api/results/me
 */
async function getMyResults(req, res) {
    try {
        const [results] = await pool.query(
            `SELECT r.id, r.score, r.played_at, q.title as quiz_title,
                    (SELECT COUNT(*) FROM questions WHERE quiz_id = r.quiz_id) as total_questions
             FROM results r
             JOIN quizzes q ON r.quiz_id = q.id
             WHERE r.user_id = ?
             ORDER BY r.played_at DESC`,
            [req.user.userId]
        );

        return successResponse(res, results);

    } catch (error) {
        console.error('Erreur getMyResults:', error);
        return errorResponse(res, 'INTERNAL_ERROR', 'Erreur lors de la recuperation des resultats', 500);
    }
}

/**
 * Recuperer les reponses detaillees d'un resultat (pour profs)
 * GET /api/results/:resultId/answers
 */
async function getResultAnswers(req, res) {
    try {
        const { resultId } = req.params;

        // Recuperer le resultat avec le quiz
        const [results] = await pool.query(
            `SELECT r.*, q.user_id as quiz_owner_id
             FROM results r
             JOIN quizzes q ON r.quiz_id = q.id
             WHERE r.id = ?`,
            [resultId]
        );

        if (results.length === 0) {
            return errorResponse(res, 'NOT_FOUND', 'Resultat non trouve', 404);
        }

        // Verifier que le prof est le proprietaire du quiz
        if (results[0].quiz_owner_id !== req.user.userId) {
            return errorResponse(res, 'FORBIDDEN', 'Acces non autorise', 403);
        }

        // Recuperer les reponses avec les questions
        const [answers] = await pool.query(
            `SELECT a.*, q.question_text, q.correct_answer, q.options
             FROM answers a
             JOIN questions q ON a.question_id = q.id
             WHERE a.result_id = ?`,
            [resultId]
        );

        // Parser les options JSON
        const parsedAnswers = answers.map(a => ({
            ...a,
            options: typeof a.options === 'string' ? JSON.parse(a.options) : a.options
        }));

        return successResponse(res, parsedAnswers);

    } catch (error) {
        console.error('Erreur getResultAnswers:', error);
        return errorResponse(res, 'INTERNAL_ERROR', 'Erreur lors de la recuperation des reponses', 500);
    }
}

/**
 * Recuperer les reponses detaillees de mon resultat (pour eleves)
 * GET /api/results/me/:resultId/answers
 */
async function getMyResultAnswers(req, res) {
    try {
        const { resultId } = req.params;

        // Recuperer le resultat
        const [results] = await pool.query(
            'SELECT * FROM results WHERE id = ? AND user_id = ?',
            [resultId, req.user.userId]
        );

        if (results.length === 0) {
            return errorResponse(res, 'NOT_FOUND', 'Resultat non trouve', 404);
        }

        // Recuperer les reponses avec les questions
        const [answers] = await pool.query(
            `SELECT a.*, q.question_text, q.correct_answer, q.options
             FROM answers a
             JOIN questions q ON a.question_id = q.id
             WHERE a.result_id = ?`,
            [resultId]
        );

        // Parser les options JSON
        const parsedAnswers = answers.map(a => ({
            ...a,
            options: typeof a.options === 'string' ? JSON.parse(a.options) : a.options
        }));

        return successResponse(res, parsedAnswers);

    } catch (error) {
        console.error('Erreur getMyResultAnswers:', error);
        return errorResponse(res, 'INTERNAL_ERROR', 'Erreur lors de la recuperation des reponses', 500);
    }
}

module.exports = {
    createResult,
    getResultsByQuiz,
    getMyResults,
    getResultAnswers,
    getMyResultAnswers
};
