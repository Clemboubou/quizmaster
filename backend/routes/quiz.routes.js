const express = require('express')
const router = express.Router()
const quizController = require('../controllers/quiz.controller')
const { authenticateToken } = require('../middlewares/auth.middleware')
const { requireProf, requireEleve } = require('../middlewares/role.middleware')
const { validateQuiz } = require('../validators/quiz.validator')

// Route pour rejoindre un quiz (eleves)
router.get('/join/:code', authenticateToken, requireEleve, quizController.joinQuiz)

// Routes professeur
router.get('/', authenticateToken, requireProf, quizController.getQuizzes)
router.get('/:id', authenticateToken, requireProf, quizController.getQuizById)
router.post('/', authenticateToken, requireProf, validateQuiz, quizController.createQuiz)
router.put('/:id', authenticateToken, requireProf, validateQuiz, quizController.updateQuiz)
router.delete('/:id', authenticateToken, requireProf, quizController.deleteQuiz)

module.exports = router
