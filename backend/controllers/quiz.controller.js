const pool = require('../config/database');
const generateCode = require('../utils/generateCode');
const { successResponse, errorResponse } = require('../utils/responses');

/**
 * Recuperer tous les quiz du professeur connecte
 * GET /api/quizzes
 */
async function getQuizzes(req, res) {
    try {
        const [quizzes] = await pool.query(
            'SELECT * FROM quizzes WHERE user_id = ? ORDER BY created_at DESC',
            [req.user.userId]
        );

        return successResponse(res, quizzes);

    } catch (error) {
        console.error('Erreur getQuizzes:', error);
        return errorResponse(res, 'INTERNAL_ERROR', 'Erreur lors de la recuperation des quiz', 500);
    }
}

/**
 * Recuperer un quiz par son ID
 * GET /api/quizzes/:id
 */
async function getQuizById(req, res) {
    try {
        const { id } = req.params;

        const [quizzes] = await pool.query(
            'SELECT * FROM quizzes WHERE id = ? AND user_id = ?',
            [id, req.user.userId]
        );

        if (quizzes.length === 0) {
            return errorResponse(res, 'NOT_FOUND', 'Quiz non trouve', 404);
        }

        return successResponse(res, quizzes[0]);

    } catch (error) {
        console.error('Erreur getQuizById:', error);
        return errorResponse(res, 'INTERNAL_ERROR', 'Erreur lors de la recuperation du quiz', 500);
    }
}

/**
 * Creer un nouveau quiz
 * POST /api/quizzes
 */
async function createQuiz(req, res) {
    try {
        const { title } = req.body;
        const userId = req.user.userId;

        // Verifier le statut premium et la limite de quiz
        const [users] = await pool.query(
            'SELECT is_premium FROM users WHERE id = ?',
            [userId]
        );

        const isPremium = users[0].is_premium;
        const maxQuizzes = isPremium ? 20 : 1;

        // Compter les quiz existants
        const [countResult] = await pool.query(
            'SELECT COUNT(*) as count FROM quizzes WHERE user_id = ?',
            [userId]
        );

        if (countResult[0].count >= maxQuizzes) {
            return errorResponse(
                res,
                'FORBIDDEN',
                `Limite de quiz atteinte (${maxQuizzes} quiz maximum)`,
                403
            );
        }

        // Generer un code d'acces unique
        let accessCode;
        let codeExists = true;

        while (codeExists) {
            accessCode = generateCode();
            const [existing] = await pool.query(
                'SELECT id FROM quizzes WHERE access_code = ?',
                [accessCode]
            );
            codeExists = existing.length > 0;
        }

        // Creer le quiz
        const [result] = await pool.query(
            'INSERT INTO quizzes (user_id, title, access_code) VALUES (?, ?, ?)',
            [userId, title, accessCode]
        );

        // Recuperer le quiz cree
        const [quizzes] = await pool.query(
            'SELECT * FROM quizzes WHERE id = ?',
            [result.insertId]
        );

        return successResponse(res, quizzes[0], 201);

    } catch (error) {
        console.error('Erreur createQuiz:', error);
        return errorResponse(res, 'INTERNAL_ERROR', 'Erreur lors de la creation du quiz', 500);
    }
}

/**
 * Modifier un quiz
 * PUT /api/quizzes/:id
 */
async function updateQuiz(req, res) {
    try {
        const { id } = req.params;
        const { title } = req.body;

        // Verifier que le quiz appartient au professeur
        const [quizzes] = await pool.query(
            'SELECT * FROM quizzes WHERE id = ? AND user_id = ?',
            [id, req.user.userId]
        );

        if (quizzes.length === 0) {
            return errorResponse(res, 'NOT_FOUND', 'Quiz non trouve', 404);
        }

        // Mettre a jour le quiz
        await pool.query(
            'UPDATE quizzes SET title = ? WHERE id = ?',
            [title, id]
        );

        // Recuperer le quiz mis a jour
        const [updatedQuizzes] = await pool.query(
            'SELECT * FROM quizzes WHERE id = ?',
            [id]
        );

        return successResponse(res, updatedQuizzes[0]);

    } catch (error) {
        console.error('Erreur updateQuiz:', error);
        return errorResponse(res, 'INTERNAL_ERROR', 'Erreur lors de la modification du quiz', 500);
    }
}

/**
 * Supprimer un quiz
 * DELETE /api/quizzes/:id
 */
async function deleteQuiz(req, res) {
    try {
        const { id } = req.params;

        // Verifier que le quiz appartient au professeur
        const [quizzes] = await pool.query(
            'SELECT * FROM quizzes WHERE id = ? AND user_id = ?',
            [id, req.user.userId]
        );

        if (quizzes.length === 0) {
            return errorResponse(res, 'NOT_FOUND', 'Quiz non trouve', 404);
        }

        // Supprimer le quiz (les questions et resultats seront supprimes en cascade)
        await pool.query('DELETE FROM quizzes WHERE id = ?', [id]);

        return res.status(204).send();

    } catch (error) {
        console.error('Erreur deleteQuiz:', error);
        return errorResponse(res, 'INTERNAL_ERROR', 'Erreur lors de la suppression du quiz', 500);
    }
}

/**
 * Rejoindre un quiz par son code d'acces (pour les eleves)
 * GET /api/quizzes/join/:code
 */
async function joinQuiz(req, res) {
    try {
        const { code } = req.params;

        // Rechercher le quiz par son code
        const [quizzes] = await pool.query(
            'SELECT id, title, access_code, created_at FROM quizzes WHERE access_code = ?',
            [code.toUpperCase()]
        );

        if (quizzes.length === 0) {
            return errorResponse(res, 'NOT_FOUND', 'Quiz non trouve avec ce code', 404);
        }

        const quiz = quizzes[0];

        // Recuperer les questions du quiz (sans la reponse correcte pour les eleves)
        const [questions] = await pool.query(
            'SELECT id, type, question_text, options FROM questions WHERE quiz_id = ?',
            [quiz.id]
        );

        return successResponse(res, {
            ...quiz,
            questions
        });

    } catch (error) {
        console.error('Erreur joinQuiz:', error);
        return errorResponse(res, 'INTERNAL_ERROR', 'Erreur lors de la recherche du quiz', 500);
    }
}

module.exports = {
    getQuizzes,
    getQuizById,
    createQuiz,
    updateQuiz,
    deleteQuiz,
    joinQuiz
};
