const express = require('express')
const router = express.Router()
const paymentController = require('../controllers/payment.controller')
const { authenticateToken } = require('../middlewares/auth.middleware')
const { requireProf } = require('../middlewares/role.middleware')

// Route pour creer une session de paiement (professeur uniquement)
router.post(
    '/create-checkout',
    authenticateToken,
    requireProf,
    paymentController.createCheckoutSession
)

// Route pour verifier le succes d'un paiement (professeur uniquement)
router.get('/success', authenticateToken, requireProf, paymentController.verifyPaymentSuccess)

// Webhook Stripe (pas d'authentification, mais verification de signature Stripe)
// Note: Cette route est configuree dans server.js avec express.raw()
router.post('/webhook', paymentController.handleWebhook)

module.exports = router
