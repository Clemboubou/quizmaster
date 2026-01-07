const express = require('express');
const router = express.Router();
const resultController = require('../controllers/result.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { requireProf, requireEleve } = require('../middlewares/role.middleware');

// Route eleve pour enregistrer un score
router.post('/', authenticateToken, requireEleve, resultController.createResult);

// Route eleve pour voir ses propres resultats
router.get('/me', authenticateToken, requireEleve, resultController.getMyResults);

// Route professeur pour voir les resultats d'un quiz
router.get('/quiz/:quizId', authenticateToken, requireProf, resultController.getResultsByQuiz);

module.exports = router;
