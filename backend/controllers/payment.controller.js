const stripe = require('../config/stripe')
const pool = require('../config/database')
const { successResponse, errorResponse } = require('../utils/responses')

/**
 * Creer une session de paiement Stripe
 * POST /api/payments/create-checkout
 */
async function createCheckoutSession(req, res) {
    try {
        const userId = req.user.userId

        // Verifier si l'utilisateur est deja premium
        const [users] = await pool.query('SELECT is_premium FROM users WHERE id = ?', [userId])

        if (users[0].is_premium) {
            return errorResponse(res, 'CONFLICT', 'Vous etes deja premium', 409)
        }

        // Creer la session Stripe Checkout
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: process.env.STRIPE_PRICE_ID,
                    quantity: 1
                }
            ],
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/payment`,
            metadata: {
                user_id: userId.toString()
            }
        })

        // Enregistrer le paiement en attente
        await pool.query(
            'INSERT INTO payments (user_id, stripe_session_id, amount, status) VALUES (?, ?, ?, ?)',
            [userId, session.id, 9.99, 'pending']
        )

        return successResponse(res, {
            checkout_url: session.url
        })
    } catch (error) {
        console.error('Erreur createCheckoutSession:', error)
        return errorResponse(
            res,
            'INTERNAL_ERROR',
            'Erreur lors de la creation de la session de paiement',
            500
        )
    }
}

/**
 * Webhook Stripe pour recevoir les evenements de paiement
 * POST /api/payments/webhook
 */
async function handleWebhook(req, res) {
    const sig = req.headers['stripe-signature']

    let event

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET)
    } catch (err) {
        console.error('Erreur verification webhook:', err.message)
        return res.status(400).send(`Webhook Error: ${err.message}`)
    }

    // Traiter l'evenement
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object
        const userId = session.metadata.user_id

        try {
            // Mettre a jour le statut du paiement
            await pool.query('UPDATE payments SET status = ? WHERE stripe_session_id = ?', [
                'completed',
                session.id
            ])

            // Passer l'utilisateur en premium
            await pool.query('UPDATE users SET is_premium = ? WHERE id = ?', [true, userId])

            console.log(`Utilisateur ${userId} est maintenant premium`)
        } catch (error) {
            console.error('Erreur mise a jour premium:', error)
        }
    }

    // Repondre a Stripe
    res.status(200).json({ received: true })
}

/**
 * Verifier si un paiement a reussi
 * GET /api/payments/success
 */
async function verifyPaymentSuccess(req, res) {
    try {
        const { session_id } = req.query

        if (!session_id) {
            return errorResponse(res, 'VALIDATION_ERROR', 'Session ID manquant', 400)
        }

        // Verifier le paiement dans la base de donnees
        const [payments] = await pool.query(
            'SELECT * FROM payments WHERE stripe_session_id = ? AND user_id = ?',
            [session_id, req.user.userId]
        )

        if (payments.length === 0) {
            return errorResponse(res, 'NOT_FOUND', 'Paiement non trouve', 404)
        }

        const payment = payments[0]

        // Recuperer le statut utilisateur mis a jour
        const [users] = await pool.query('SELECT is_premium FROM users WHERE id = ?', [
            req.user.userId
        ])

        return successResponse(res, {
            status: payment.status,
            is_premium: users[0].is_premium
        })
    } catch (error) {
        console.error('Erreur verifyPaymentSuccess:', error)
        return errorResponse(
            res,
            'INTERNAL_ERROR',
            'Erreur lors de la verification du paiement',
            500
        )
    }
}

module.exports = {
    createCheckoutSession,
    handleWebhook,
    verifyPaymentSuccess
}
