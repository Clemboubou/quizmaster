const express = require('express');
const router = express.Router();
const questionController = require('../controllers/question.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { requireProf } = require('../middlewares/role.middleware');
const { validateQuestion } = require('../validators/question.validator');

// Route pour jouer - accessible aux eleves (sans les reponses correctes)
router.get('/play/:quizId', authenticateToken, questionController.getQuestionsForPlay);

// Routes professeurs
router.get('/quiz/:quizId', authenticateToken, requireProf, questionController.getQuestionsByQuiz);
router.post('/', authenticateToken, requireProf, validateQuestion, questionController.createQuestion);
router.put('/:id', authenticateToken, requireProf, validateQuestion, questionController.updateQuestion);
router.delete('/:id', authenticateToken, requireProf, questionController.deleteQuestion);

module.exports = router;
