require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

const { errorHandler } = require('./middlewares/error.middleware');

// Import des routes
const authRoutes = require('./routes/auth.routes');
const quizRoutes = require('./routes/quiz.routes');
const questionRoutes = require('./routes/question.routes');
const resultRoutes = require('./routes/result.routes');
const paymentRoutes = require('./routes/payment.routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware Helmet pour la securite (avec config pour Swagger)
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:"],
        },
    },
}));

// Configuration CORS
app.use(cors({
    origin: process.env.FRONTEND_URL
}));

// Middleware pour parser le JSON
// Note: Le webhook Stripe a besoin du body raw, donc on exclut cette route
app.use((req, res, next) => {
    if (req.originalUrl === '/api/payments/webhook') {
        next();
    } else {
        express.json()(req, res, next);
    }
});

// Middleware pour le webhook Stripe (body raw)
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));

// Routes API
app.use('/api/auth', authRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/results', resultRoutes);
app.use('/api/payments', paymentRoutes);

// Route de sante
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Documentation Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Middleware de gestion des erreurs
app.use(errorHandler);

// Demarrage du serveur
app.listen(PORT, () => {
    console.log(`Serveur QuizMaster demarre sur le port ${PORT}`);
    console.log(`API disponible sur http://localhost:${PORT}/api`);
    console.log(`Documentation Swagger sur http://localhost:${PORT}/api-docs`);
});

module.exports = app;
