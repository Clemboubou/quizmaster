const pool = require('../config/database');
const { successResponse, errorResponse } = require('../utils/responses');

/**
 * Enregistrer un score (pour les eleves)
 * POST /api/results
 */
async function createResult(req, res) {
    try {
        const { quiz_id, score } = req.body;
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

        // Recuperer le resultat cree
        const [results] = await pool.query(
            'SELECT * FROM results WHERE id = ?',
            [result.insertId]
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
            `SELECT r.id, r.score, r.played_at, q.title as quiz_title
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

module.exports = {
    createResult,
    getResultsByQuiz,
    getMyResults
};
