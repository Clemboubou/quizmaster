const pool = require('../config/database');
const { successResponse, errorResponse } = require('../utils/responses');

/**
 * Recuperer les questions pour jouer (eleves)
 * GET /api/questions/play/:quizId
 */
async function getQuestionsForPlay(req, res) {
    try {
        const { quizId } = req.params;

        // Verifier que le quiz existe
        const [quizzes] = await pool.query(
            'SELECT * FROM quizzes WHERE id = ?',
            [quizId]
        );

        if (quizzes.length === 0) {
            return errorResponse(res, 'NOT_FOUND', 'Quiz non trouve', 404);
        }

        // Recuperer les questions
        const [questions] = await pool.query(
            'SELECT * FROM questions WHERE quiz_id = ?',
            [quizId]
        );

        // Parser les options JSON pour chaque question
        const parsedQuestions = questions.map(q => ({
            ...q,
            options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options
        }));

        return successResponse(res, parsedQuestions);

    } catch (error) {
        console.error('Erreur getQuestionsForPlay:', error);
        return errorResponse(res, 'INTERNAL_ERROR', 'Erreur lors de la recuperation des questions', 500);
    }
}

/**
 * Recuperer toutes les questions d'un quiz
 * GET /api/questions/quiz/:quizId
 */
async function getQuestionsByQuiz(req, res) {
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

        // Recuperer les questions
        const [questions] = await pool.query(
            'SELECT * FROM questions WHERE quiz_id = ?',
            [quizId]
        );

        return successResponse(res, questions);

    } catch (error) {
        console.error('Erreur getQuestionsByQuiz:', error);
        return errorResponse(res, 'INTERNAL_ERROR', 'Erreur lors de la recuperation des questions', 500);
    }
}

/**
 * Ajouter une question a un quiz
 * POST /api/questions
 */
async function createQuestion(req, res) {
    try {
        const { quiz_id, type, question_text, options, correct_answer } = req.body;

        // Verifier que le quiz existe
        const [quizzes] = await pool.query(
            'SELECT * FROM quizzes WHERE id = ?',
            [quiz_id]
        );

        if (quizzes.length === 0) {
            return errorResponse(res, 'NOT_FOUND', 'Quiz non trouve', 404);
        }

        // Verifier que le quiz appartient au professeur
        if (quizzes[0].user_id !== req.user.userId) {
            return errorResponse(res, 'FORBIDDEN', 'Vous n\'etes pas autorise a modifier ce quiz', 403);
        }

        // Creer la question
        const [result] = await pool.query(
            'INSERT INTO questions (quiz_id, type, question_text, options, correct_answer) VALUES (?, ?, ?, ?, ?)',
            [quiz_id, type, question_text, JSON.stringify(options), correct_answer]
        );

        // Recuperer la question creee
        const [questions] = await pool.query(
            'SELECT * FROM questions WHERE id = ?',
            [result.insertId]
        );

        // Parser les options JSON
        const question = questions[0];
        question.options = JSON.parse(question.options);

        return successResponse(res, question, 201);

    } catch (error) {
        console.error('Erreur createQuestion:', error);
        return errorResponse(res, 'INTERNAL_ERROR', 'Erreur lors de la creation de la question', 500);
    }
}

/**
 * Modifier une question
 * PUT /api/questions/:id
 */
async function updateQuestion(req, res) {
    try {
        const { id } = req.params;
        const { type, question_text, options, correct_answer } = req.body;

        // Recuperer la question avec son quiz
        const [questions] = await pool.query(
            `SELECT q.*, qz.user_id as quiz_owner_id
             FROM questions q
             JOIN quizzes qz ON q.quiz_id = qz.id
             WHERE q.id = ?`,
            [id]
        );

        if (questions.length === 0) {
            return errorResponse(res, 'NOT_FOUND', 'Question non trouvee', 404);
        }

        // Verifier que le quiz appartient au professeur
        if (questions[0].quiz_owner_id !== req.user.userId) {
            return errorResponse(res, 'FORBIDDEN', 'Vous n\'etes pas autorise a modifier cette question', 403);
        }

        // Mettre a jour la question
        await pool.query(
            'UPDATE questions SET type = ?, question_text = ?, options = ?, correct_answer = ? WHERE id = ?',
            [type, question_text, JSON.stringify(options), correct_answer, id]
        );

        // Recuperer la question mise a jour
        const [updatedQuestions] = await pool.query(
            'SELECT * FROM questions WHERE id = ?',
            [id]
        );

        const question = updatedQuestions[0];
        question.options = JSON.parse(question.options);

        return successResponse(res, question);

    } catch (error) {
        console.error('Erreur updateQuestion:', error);
        return errorResponse(res, 'INTERNAL_ERROR', 'Erreur lors de la modification de la question', 500);
    }
}

/**
 * Supprimer une question
 * DELETE /api/questions/:id
 */
async function deleteQuestion(req, res) {
    try {
        const { id } = req.params;

        // Recuperer la question avec son quiz
        const [questions] = await pool.query(
            `SELECT q.*, qz.user_id as quiz_owner_id
             FROM questions q
             JOIN quizzes qz ON q.quiz_id = qz.id
             WHERE q.id = ?`,
            [id]
        );

        if (questions.length === 0) {
            return errorResponse(res, 'NOT_FOUND', 'Question non trouvee', 404);
        }

        // Verifier que le quiz appartient au professeur
        if (questions[0].quiz_owner_id !== req.user.userId) {
            return errorResponse(res, 'FORBIDDEN', 'Vous n\'etes pas autorise a supprimer cette question', 403);
        }

        // Supprimer la question
        await pool.query('DELETE FROM questions WHERE id = ?', [id]);

        return res.status(204).send();

    } catch (error) {
        console.error('Erreur deleteQuestion:', error);
        return errorResponse(res, 'INTERNAL_ERROR', 'Erreur lors de la suppression de la question', 500);
    }
}

module.exports = {
    getQuestionsForPlay,
    getQuestionsByQuiz,
    createQuestion,
    updateQuestion,
    deleteQuestion
};
