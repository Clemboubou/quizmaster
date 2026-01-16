# Étapes de Développement - QuizMaster

Ce document retrace toutes les étapes de développement du projet QuizMaster, de la conception à la mise en production.

---

## Phase 1 : Conception et Planification

### Étape 1.1 : Analyse du besoin

J'ai commencé par analyser le cahier des charges et identifier les besoins :

- **Objectif** : Créer une application web permettant aux professeurs de créer des quiz et aux élèves de les passer
- **Utilisateurs** : 3 types (professeur, élève, administrateur)
- **Modèle économique** : Freemium (1 quiz gratuit, 20 quiz avec abonnement premium à 9.99€)
- **Contraintes** : Application fullstack avec authentification sécurisée

### Étape 1.2 : Choix des technologies

J'ai sélectionné les technologies en fonction des besoins :

**Backend :**
- Node.js + Express.js → Framework web JavaScript côté serveur
- MySQL → Base de données relationnelle pour les données structurées
- JWT → Authentification stateless
- bcrypt → Hashage sécurisé des mots de passe
- Stripe → Solution de paiement reconnue

**Frontend :**
- Vue.js 3 → Framework réactif avec Composition API
- Pinia → Gestion d'état globale
- Vue Router → Navigation SPA
- Axios → Client HTTP
- Tailwind CSS → Framework CSS utilitaire

### Étape 1.3 : Conception de la base de données (MCD/MLD)

J'ai conçu le Modèle Conceptuel de Données avec 7 entités :

```
USERS ──1,n──< QUIZZES ──1,n──< QUESTIONS
   │                │
   │                └──1,n──< RESULTS ──1,n──< ANSWERS
   │
   └──1,n──< PAYMENTS
   │
   └──0,n──< LOGS
```

**Relations identifiées :**
- Un utilisateur peut créer plusieurs quiz (1,n)
- Un quiz contient plusieurs questions (1,n)
- Un utilisateur peut avoir plusieurs résultats (1,n)
- Un résultat contient plusieurs réponses détaillées (1,n)
- Un utilisateur peut avoir plusieurs paiements (1,n)

---

## Phase 2 : Mise en place de l'environnement

### Étape 2.1 : Création de la structure du projet

J'ai créé la structure de dossiers du projet :

```bash
mkdir quizmaster
cd quizmaster
mkdir backend frontend
```

### Étape 2.2 : Initialisation du backend

```bash
cd backend
npm init -y
```

J'ai installé les dépendances nécessaires :

```bash
npm install express mysql2 bcrypt jsonwebtoken dotenv cors helmet
npm install swagger-ui-express swagger-jsdoc stripe
npm install --save-dev vitest supertest nodemon eslint prettier
```

J'ai créé le fichier `package.json` avec les scripts :

```json
{
  "scripts": {
    "dev": "nodemon server.js",
    "start": "node server.js",
    "test": "vitest run",
    "lint": "eslint .",
    "format": "prettier --write ."
  }
}
```

### Étape 2.3 : Configuration des variables d'environnement

J'ai créé le fichier `.env` pour stocker les secrets :

```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=quizmaster
JWT_SECRET=ma_cle_secrete_jwt
JWT_EXPIRES_IN=24h
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
STRIPE_PRICE_ID=price_xxx
FRONTEND_URL=http://localhost:5173
```

### Étape 2.4 : Initialisation du frontend

```bash
cd ../frontend
npm create vite@latest . -- --template vue
npm install
npm install pinia vue-router axios
npm install -D tailwindcss postcss autoprefixer vitest @vue/test-utils jsdom
npx tailwindcss init -p
```

---

## Phase 3 : Développement de la Base de Données

### Étape 3.1 : Création du script SQL d'initialisation

J'ai créé le fichier `backend/database/init.sql` :

```sql
CREATE DATABASE IF NOT EXISTS quizmaster;
USE quizmaster;

-- Table users
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('prof', 'eleve', 'admin') NOT NULL,
    is_premium BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table quizzes
CREATE TABLE quizzes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(100) NOT NULL,
    access_code VARCHAR(5) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Table questions
CREATE TABLE questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    quiz_id INT NOT NULL,
    type ENUM('qcm', 'vf') NOT NULL,
    question_text TEXT NOT NULL,
    options JSON NOT NULL,
    correct_answer VARCHAR(255) NOT NULL,
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
);

-- Table results
CREATE TABLE results (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    quiz_id INT NOT NULL,
    score INT NOT NULL,
    played_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
);

-- Table answers
CREATE TABLE answers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    result_id INT NOT NULL,
    question_id INT NOT NULL,
    user_answer VARCHAR(255) NOT NULL,
    is_correct BOOLEAN NOT NULL,
    FOREIGN KEY (result_id) REFERENCES results(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);

-- Table payments
CREATE TABLE payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    stripe_session_id VARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Table logs (audit trail)
CREATE TABLE logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    action VARCHAR(100) NOT NULL,
    target_type VARCHAR(50) NULL,
    target_id INT NULL,
    details JSON NULL,
    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);
```

### Étape 3.2 : Ajout des index pour les performances

```sql
CREATE INDEX idx_quizzes_user ON quizzes(user_id);
CREATE INDEX idx_quizzes_code ON quizzes(access_code);
CREATE INDEX idx_questions_quiz ON questions(quiz_id);
CREATE INDEX idx_results_user ON results(user_id);
CREATE INDEX idx_results_quiz ON results(quiz_id);
CREATE INDEX idx_logs_user ON logs(user_id);
CREATE INDEX idx_logs_action ON logs(action);
CREATE INDEX idx_logs_created ON logs(created_at);
```

### Étape 3.3 : Configuration de la connexion MySQL

J'ai créé le fichier `backend/config/database.js` :

```javascript
const mysql = require('mysql2/promise')

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})

module.exports = pool
```

J'ai utilisé un **pool de connexions** pour optimiser les performances et éviter de créer une nouvelle connexion à chaque requête.

---

## Phase 4 : Développement du Backend - Structure de base

### Étape 4.1 : Création du serveur Express

J'ai créé le fichier `backend/server.js` :

```javascript
require('dotenv').config()

const express = require('express')
const helmet = require('helmet')
const cors = require('cors')

const app = express()
const PORT = process.env.PORT || 3000

// Middleware de sécurité
app.use(helmet())

// Configuration CORS
app.use(cors({
    origin: process.env.FRONTEND_URL
}))

// Parser JSON
app.use(express.json())

// Route de santé
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`)
})

module.exports = app
```

### Étape 4.2 : Création des utilitaires de réponse

J'ai créé `backend/utils/responses.js` pour standardiser toutes les réponses API :

```javascript
function successResponse(res, data, statusCode = 200) {
    return res.status(statusCode).json({
        success: true,
        data
    })
}

function errorResponse(res, code, message, statusCode = 400, field = null) {
    const error = { code, message }
    if (field) error.field = field

    return res.status(statusCode).json({
        success: false,
        error
    })
}

module.exports = { successResponse, errorResponse }
```

### Étape 4.3 : Création du middleware de gestion d'erreurs

J'ai créé `backend/middlewares/error.middleware.js` :

```javascript
function errorHandler(err, req, res, next) {
    console.error(err.stack)

    return res.status(500).json({
        success: false,
        error: {
            code: 'SERVER_ERROR',
            message: 'Erreur interne du serveur'
        }
    })
}

module.exports = { errorHandler }
```

---

## Phase 5 : Développement du Backend - Authentification

### Étape 5.1 : Création du validateur d'authentification

J'ai créé `backend/validators/auth.validator.js` :

```javascript
function validateRegister(req, res, next) {
    const { email, password, role } = req.body

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email || !emailRegex.test(email)) {
        return errorResponse(res, 'VALIDATION_ERROR', 'Email invalide', 400, 'email')
    }

    // Validation password (8+ chars, maj, min, chiffre)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
    if (!password || !passwordRegex.test(password)) {
        return errorResponse(res, 'VALIDATION_ERROR',
            'Le mot de passe doit contenir 8 caractères, une majuscule, une minuscule et un chiffre',
            400, 'password')
    }

    // Validation role
    if (!role || !['prof', 'eleve'].includes(role)) {
        return errorResponse(res, 'VALIDATION_ERROR', 'Rôle invalide', 400, 'role')
    }

    next()
}

module.exports = { validateRegister, validateLogin }
```

### Étape 5.2 : Création du contrôleur d'authentification

J'ai créé `backend/controllers/auth.controller.js` :

```javascript
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const pool = require('../config/database')
const { successResponse, errorResponse } = require('../utils/responses')

async function register(req, res) {
    const { email, password, role } = req.body

    try {
        // Vérifier si l'email existe déjà
        const [existing] = await pool.query(
            'SELECT id FROM users WHERE email = ?',
            [email]
        )

        if (existing.length > 0) {
            return errorResponse(res, 'EMAIL_EXISTS', 'Cet email est déjà utilisé', 409)
        }

        // Hasher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10)

        // Insérer l'utilisateur
        const [result] = await pool.query(
            'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
            [email, hashedPassword, role]
        )

        // Générer le token JWT
        const token = jwt.sign(
            { userId: result.insertId, role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        )

        return successResponse(res, {
            token,
            user: { id: result.insertId, email, role, is_premium: false }
        }, 201)

    } catch (error) {
        console.error(error)
        return errorResponse(res, 'SERVER_ERROR', 'Erreur serveur', 500)
    }
}

async function login(req, res) {
    const { email, password } = req.body

    try {
        // Récupérer l'utilisateur
        const [users] = await pool.query(
            'SELECT * FROM users WHERE email = ?',
            [email]
        )

        if (users.length === 0) {
            return errorResponse(res, 'AUTH_ERROR', 'Email ou mot de passe incorrect', 401)
        }

        const user = users[0]

        // Vérifier le mot de passe
        const validPassword = await bcrypt.compare(password, user.password)
        if (!validPassword) {
            return errorResponse(res, 'AUTH_ERROR', 'Email ou mot de passe incorrect', 401)
        }

        // Générer le token
        const token = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        )

        return successResponse(res, {
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                is_premium: user.is_premium
            }
        })

    } catch (error) {
        console.error(error)
        return errorResponse(res, 'SERVER_ERROR', 'Erreur serveur', 500)
    }
}

module.exports = { register, login, getMe }
```

### Étape 5.3 : Création du middleware d'authentification JWT

J'ai créé `backend/middlewares/auth.middleware.js` :

```javascript
const jwt = require('jsonwebtoken')
const { errorResponse } = require('../utils/responses')

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1] // Format: "Bearer TOKEN"

    if (!token) {
        return errorResponse(res, 'AUTH_ERROR', "Token d'authentification manquant", 401)
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()
    } catch (error) {
        return errorResponse(res, 'AUTH_ERROR', 'Token invalide ou expiré', 401)
    }
}

module.exports = { authenticateToken }
```

### Étape 5.4 : Création du middleware de vérification des rôles

J'ai créé `backend/middlewares/role.middleware.js` :

```javascript
const { errorResponse } = require('../utils/responses')

function requireProf(req, res, next) {
    if (req.user.role !== 'prof' && req.user.role !== 'admin') {
        return errorResponse(res, 'FORBIDDEN', 'Accès réservé aux professeurs', 403)
    }
    next()
}

function requireEleve(req, res, next) {
    if (req.user.role !== 'eleve') {
        return errorResponse(res, 'FORBIDDEN', 'Accès réservé aux élèves', 403)
    }
    next()
}

function requireAdmin(req, res, next) {
    if (req.user.role !== 'admin') {
        return errorResponse(res, 'FORBIDDEN', 'Accès réservé aux administrateurs', 403)
    }
    next()
}

module.exports = { requireProf, requireEleve, requireAdmin }
```

### Étape 5.5 : Création des routes d'authentification

J'ai créé `backend/routes/auth.routes.js` :

```javascript
const express = require('express')
const router = express.Router()
const { register, login, getMe } = require('../controllers/auth.controller')
const { validateRegister, validateLogin } = require('../validators/auth.validator')
const { authenticateToken } = require('../middlewares/auth.middleware')

router.post('/register', validateRegister, register)
router.post('/login', validateLogin, login)
router.get('/me', authenticateToken, getMe)

module.exports = router
```

---

## Phase 6 : Développement du Backend - Gestion des Quiz

### Étape 6.1 : Création de l'utilitaire de génération de code

J'ai créé `backend/utils/generateCode.js` :

```javascript
function generateAccessCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let code = ''
    for (let i = 0; i < 5; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return code
}

module.exports = { generateAccessCode }
```

### Étape 6.2 : Création du contrôleur Quiz

J'ai créé `backend/controllers/quiz.controller.js` avec les fonctions CRUD :

```javascript
const pool = require('../config/database')
const { successResponse, errorResponse } = require('../utils/responses')
const { generateAccessCode } = require('../utils/generateCode')

// Créer un quiz
async function createQuiz(req, res) {
    const { title } = req.body
    const userId = req.user.userId

    try {
        // Vérifier la limite de quiz (1 gratuit, 20 premium)
        const [user] = await pool.query('SELECT is_premium FROM users WHERE id = ?', [userId])
        const [quizzes] = await pool.query('SELECT COUNT(*) as count FROM quizzes WHERE user_id = ?', [userId])

        const limit = user[0].is_premium ? 20 : 1
        if (quizzes[0].count >= limit) {
            return errorResponse(res, 'QUIZ_LIMIT',
                `Limite de ${limit} quiz atteinte. Passez en premium pour créer plus de quiz.`, 403)
        }

        // Générer un code unique
        let accessCode
        let codeExists = true
        while (codeExists) {
            accessCode = generateAccessCode()
            const [existing] = await pool.query('SELECT id FROM quizzes WHERE access_code = ?', [accessCode])
            codeExists = existing.length > 0
        }

        // Créer le quiz
        const [result] = await pool.query(
            'INSERT INTO quizzes (user_id, title, access_code) VALUES (?, ?, ?)',
            [userId, title, accessCode]
        )

        return successResponse(res, {
            id: result.insertId,
            title,
            access_code: accessCode
        }, 201)

    } catch (error) {
        console.error(error)
        return errorResponse(res, 'SERVER_ERROR', 'Erreur serveur', 500)
    }
}

// Récupérer les quiz d'un professeur
async function getMyQuizzes(req, res) {
    const userId = req.user.userId

    try {
        const [quizzes] = await pool.query(
            `SELECT q.*, COUNT(qu.id) as question_count
             FROM quizzes q
             LEFT JOIN questions qu ON q.id = qu.quiz_id
             WHERE q.user_id = ?
             GROUP BY q.id
             ORDER BY q.created_at DESC`,
            [userId]
        )

        return successResponse(res, quizzes)
    } catch (error) {
        console.error(error)
        return errorResponse(res, 'SERVER_ERROR', 'Erreur serveur', 500)
    }
}

// Rejoindre un quiz par code
async function joinQuiz(req, res) {
    const { code } = req.params

    try {
        const [quizzes] = await pool.query(
            `SELECT q.id, q.title, q.access_code, COUNT(qu.id) as question_count
             FROM quizzes q
             LEFT JOIN questions qu ON q.id = qu.quiz_id
             WHERE q.access_code = ?
             GROUP BY q.id`,
            [code.toUpperCase()]
        )

        if (quizzes.length === 0) {
            return errorResponse(res, 'NOT_FOUND', 'Quiz non trouvé', 404)
        }

        return successResponse(res, quizzes[0])
    } catch (error) {
        console.error(error)
        return errorResponse(res, 'SERVER_ERROR', 'Erreur serveur', 500)
    }
}

module.exports = { createQuiz, getMyQuizzes, getQuiz, updateQuiz, deleteQuiz, joinQuiz }
```

### Étape 6.3 : Création des routes Quiz

J'ai créé `backend/routes/quiz.routes.js` :

```javascript
const express = require('express')
const router = express.Router()
const { authenticateToken } = require('../middlewares/auth.middleware')
const { requireProf } = require('../middlewares/role.middleware')
const quizController = require('../controllers/quiz.controller')

router.get('/', authenticateToken, requireProf, quizController.getMyQuizzes)
router.get('/:id', authenticateToken, requireProf, quizController.getQuiz)
router.post('/', authenticateToken, requireProf, quizController.createQuiz)
router.put('/:id', authenticateToken, requireProf, quizController.updateQuiz)
router.delete('/:id', authenticateToken, requireProf, quizController.deleteQuiz)
router.get('/join/:code', quizController.joinQuiz)

module.exports = router
```

---

## Phase 7 : Développement du Backend - Questions et Résultats

### Étape 7.1 : Création du contrôleur Question

J'ai créé `backend/controllers/question.controller.js` :

```javascript
// Créer une question
async function createQuestion(req, res) {
    const { quiz_id, type, question_text, options, correct_answer } = req.body

    // Validation du type
    if (!['qcm', 'vf'].includes(type)) {
        return errorResponse(res, 'VALIDATION_ERROR', 'Type invalide', 400)
    }

    // Validation des options selon le type
    if (type === 'qcm' && options.length !== 4) {
        return errorResponse(res, 'VALIDATION_ERROR', 'Un QCM doit avoir 4 options', 400)
    }
    if (type === 'vf' && options.length !== 2) {
        return errorResponse(res, 'VALIDATION_ERROR', 'Un Vrai/Faux doit avoir 2 options', 400)
    }

    // Vérifier que correct_answer est dans options
    if (!options.includes(correct_answer)) {
        return errorResponse(res, 'VALIDATION_ERROR',
            'La réponse correcte doit être dans les options', 400)
    }

    // Insérer la question
    const [result] = await pool.query(
        'INSERT INTO questions (quiz_id, type, question_text, options, correct_answer) VALUES (?, ?, ?, ?, ?)',
        [quiz_id, type, question_text, JSON.stringify(options), correct_answer]
    )

    return successResponse(res, { id: result.insertId }, 201)
}

// Récupérer les questions pour jouer (sans les réponses)
async function getQuestionsForPlay(req, res) {
    const { quizId } = req.params

    const [questions] = await pool.query(
        'SELECT id, type, question_text, options FROM questions WHERE quiz_id = ?',
        [quizId]
    )

    // Parser le JSON des options
    const parsed = questions.map(q => ({
        ...q,
        options: JSON.parse(q.options)
    }))

    return successResponse(res, parsed)
}
```

### Étape 7.2 : Création du contrôleur Result

J'ai créé `backend/controllers/result.controller.js` :

```javascript
// Soumettre un résultat
async function submitResult(req, res) {
    const { quiz_id, score, answers } = req.body
    const userId = req.user.userId

    const connection = await pool.getConnection()

    try {
        await connection.beginTransaction()

        // Créer le résultat
        const [result] = await connection.query(
            'INSERT INTO results (user_id, quiz_id, score) VALUES (?, ?, ?)',
            [userId, quiz_id, score]
        )

        const resultId = result.insertId

        // Insérer les réponses détaillées
        for (const answer of answers) {
            await connection.query(
                'INSERT INTO answers (result_id, question_id, user_answer, is_correct) VALUES (?, ?, ?, ?)',
                [resultId, answer.question_id, answer.user_answer, answer.is_correct]
            )
        }

        await connection.commit()

        return successResponse(res, { id: resultId, score }, 201)

    } catch (error) {
        await connection.rollback()
        throw error
    } finally {
        connection.release()
    }
}
```

J'ai utilisé une **transaction SQL** pour garantir que le résultat et toutes les réponses sont enregistrés ensemble (atomicité).

---

## Phase 8 : Développement du Backend - Paiement Stripe

### Étape 8.1 : Configuration de Stripe

J'ai créé `backend/config/stripe.js` :

```javascript
const Stripe = require('stripe')

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

module.exports = stripe
```

### Étape 8.2 : Création du contrôleur Payment

J'ai créé `backend/controllers/payment.controller.js` :

```javascript
const stripe = require('../config/stripe')
const pool = require('../config/database')

// Créer une session de paiement
async function createCheckoutSession(req, res) {
    const userId = req.user.userId

    try {
        // Créer la session Stripe Checkout
        const session = await stripe.checkout.sessions.create({
            mode: 'payment',
            payment_method_types: ['card'],
            line_items: [{
                price: process.env.STRIPE_PRICE_ID,
                quantity: 1
            }],
            success_url: `${process.env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/payment`,
            metadata: { userId: userId.toString() }
        })

        // Enregistrer le paiement en pending
        await pool.query(
            'INSERT INTO payments (user_id, stripe_session_id, amount, status) VALUES (?, ?, ?, ?)',
            [userId, session.id, 9.99, 'pending']
        )

        return successResponse(res, { url: session.url })

    } catch (error) {
        console.error(error)
        return errorResponse(res, 'PAYMENT_ERROR', 'Erreur lors de la création du paiement', 500)
    }
}

// Webhook Stripe
async function handleWebhook(req, res) {
    const sig = req.headers['stripe-signature']

    let event
    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        )
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`)
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object
        const userId = session.metadata.userId

        // Mettre à jour le paiement et l'utilisateur
        await pool.query(
            'UPDATE payments SET status = ? WHERE stripe_session_id = ?',
            ['completed', session.id]
        )

        await pool.query(
            'UPDATE users SET is_premium = TRUE WHERE id = ?',
            [userId]
        )
    }

    res.json({ received: true })
}
```

### Étape 8.3 : Configuration spéciale pour le webhook

Dans `server.js`, j'ai ajouté une gestion spéciale car le webhook Stripe nécessite le body brut :

```javascript
// Le webhook Stripe a besoin du body raw
app.use((req, res, next) => {
    if (req.originalUrl === '/api/payments/webhook') {
        next()
    } else {
        express.json()(req, res, next)
    }
})

app.use('/api/payments/webhook', express.raw({ type: 'application/json' }))
```

---

## Phase 9 : Développement du Backend - Administration

### Étape 9.1 : Création du système de logs

J'ai créé `backend/utils/logger.js` :

```javascript
const pool = require('../config/database')

async function logAction(userId, action, targetType, targetId, details, req) {
    try {
        await pool.query(
            `INSERT INTO logs (user_id, action, target_type, target_id, details, ip_address, user_agent)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                userId,
                action,
                targetType,
                targetId,
                JSON.stringify(details),
                req?.ip || null,
                req?.headers['user-agent'] || null
            ]
        )
    } catch (error) {
        console.error('Erreur de logging:', error)
    }
}

module.exports = { logAction }
```

### Étape 9.2 : Création du contrôleur Admin

J'ai créé `backend/controllers/admin.controller.js` :

```javascript
// Dashboard avec statistiques
async function getDashboard(req, res) {
    const [stats] = await pool.query(`
        SELECT
            (SELECT COUNT(*) FROM users WHERE role = 'prof') as total_profs,
            (SELECT COUNT(*) FROM users WHERE role = 'eleve') as total_eleves,
            (SELECT COUNT(*) FROM users WHERE is_premium = TRUE) as total_premium,
            (SELECT COUNT(*) FROM quizzes) as total_quizzes,
            (SELECT COUNT(*) FROM questions) as total_questions,
            (SELECT COUNT(*) FROM results) as total_results
    `)

    return successResponse(res, stats[0])
}

// Liste des utilisateurs avec pagination et filtres
async function getUsers(req, res) {
    const { page = 1, limit = 10, role, search } = req.query
    const offset = (page - 1) * limit

    let query = 'SELECT id, email, role, is_premium, is_active, created_at FROM users WHERE 1=1'
    const params = []

    if (role) {
        query += ' AND role = ?'
        params.push(role)
    }

    if (search) {
        query += ' AND email LIKE ?'
        params.push(`%${search}%`)
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?'
    params.push(parseInt(limit), offset)

    const [users] = await pool.query(query, params)

    return successResponse(res, { users, page: parseInt(page), limit: parseInt(limit) })
}
```

---

## Phase 10 : Développement du Frontend - Structure de base

### Étape 10.1 : Configuration du point d'entrée

J'ai créé `frontend/src/main.js` :

```javascript
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/styles.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
```

### Étape 10.2 : Configuration du client API Axios

J'ai créé `frontend/src/services/api.js` :

```javascript
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Intercepteur pour ajouter le token
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// Intercepteur pour gérer les erreurs 401
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/auth'
    }
    return Promise.reject(error)
  }
)

export default api
```

### Étape 10.3 : Configuration du routeur avec guards

J'ai créé `frontend/src/router/index.js` :

```javascript
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
  { path: '/', name: 'home', component: () => import('../views/HomeView.vue') },
  { path: '/auth', name: 'auth', component: () => import('../views/AuthView.vue'), meta: { guest: true } },
  { path: '/dashboard', name: 'dashboard', component: () => import('../views/DashboardView.vue'), meta: { requiresAuth: true } },
  { path: '/create-quiz', name: 'create-quiz', component: () => import('../views/CreateQuizView.vue'), meta: { requiresAuth: true, role: 'prof' } },
  { path: '/play', name: 'play', component: () => import('../views/PlayQuizView.vue') },
  { path: '/payment', name: 'payment', component: () => import('../views/PaymentView.vue'), meta: { requiresAuth: true, role: 'prof' } },
  { path: '/payment/success', name: 'payment-success', component: () => import('../views/PaymentSuccessView.vue'), meta: { requiresAuth: true, role: 'prof' } },
  { path: '/admin', name: 'admin', component: () => import('../views/AdminDashboardView.vue'), meta: { requiresAuth: true, role: 'admin' } }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return next({ name: 'auth' })
  }

  if (to.meta.guest && authStore.isAuthenticated) {
    return next({ name: 'dashboard' })
  }

  if (to.meta.role && authStore.user?.role !== to.meta.role) {
    return next({ name: 'dashboard' })
  }

  next()
})

export default router
```

---

## Phase 11 : Développement du Frontend - Stores Pinia

### Étape 11.1 : Création du store d'authentification

J'ai créé `frontend/src/stores/auth.js` :

```javascript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../services/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('token'))

  const isAuthenticated = computed(() => !!token.value)
  const isProf = computed(() => user.value?.role === 'prof')
  const isEleve = computed(() => user.value?.role === 'eleve')
  const isAdmin = computed(() => user.value?.role === 'admin')
  const isPremium = computed(() => user.value?.is_premium)

  async function register(email, password, role) {
    const response = await api.post('/auth/register', { email, password, role })
    token.value = response.data.data.token
    user.value = response.data.data.user
    localStorage.setItem('token', token.value)
  }

  async function login(email, password) {
    const response = await api.post('/auth/login', { email, password })
    token.value = response.data.data.token
    user.value = response.data.data.user
    localStorage.setItem('token', token.value)
  }

  async function fetchUser() {
    if (!token.value) return
    try {
      const response = await api.get('/auth/me')
      user.value = response.data.data
    } catch {
      logout()
    }
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
  }

  return { user, token, isAuthenticated, isProf, isEleve, isAdmin, isPremium, register, login, fetchUser, logout }
})
```

### Étape 11.2 : Création du store Quiz

J'ai créé `frontend/src/stores/quiz.js` avec toutes les actions CRUD et la gestion des résultats.

---

## Phase 12 : Développement du Frontend - Composants

### Étape 12.1 : Création des composants réutilisables

J'ai créé plusieurs composants :

**Navbar.vue** - Barre de navigation avec boutons conditionnels selon l'état d'authentification

**QuizCard.vue** - Carte d'affichage d'un quiz avec code d'accès et actions

**QuestionDisplay.vue** - Affichage d'une question avec accessibilité (raccourcis clavier, ARIA)

**QuestionForm.vue** - Formulaire de création de question (QCM ou Vrai/Faux)

**ScoreDisplay.vue** - Affichage du score final

### Étape 12.2 : Implémentation de l'accessibilité

Dans `QuestionDisplay.vue`, j'ai ajouté :

```javascript
// Raccourcis clavier pour répondre rapidement
function handleKeydown(event) {
  const key = event.key.toLowerCase()

  // Touches 1-4 ou A-D pour sélectionner
  const keyMap = { '1': 0, '2': 1, '3': 2, '4': 3, 'a': 0, 'b': 1, 'c': 2, 'd': 3 }

  if (key in keyMap && keyMap[key] < props.question.options.length) {
    selectAnswer(props.question.options[keyMap[key]])
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})
```

### Étape 12.3 : Skip link pour l'accessibilité

Dans `App.vue`, j'ai ajouté un lien d'évitement :

```html
<template>
  <a href="#main-content" class="skip-link">
    Aller au contenu principal
  </a>
  <Navbar />
  <main id="main-content">
    <RouterView />
  </main>
</template>

<style>
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: #000;
  color: #fff;
  padding: 8px;
  z-index: 100;
}
.skip-link:focus {
  top: 0;
}
</style>
```

---

## Phase 13 : Développement du Frontend - Vues

### Étape 13.1 : Page d'accueil (HomeView.vue)

- Section hero avec titre et description
- Formulaire pour rejoindre un quiz par code
- Section fonctionnalités

### Étape 13.2 : Page d'authentification (AuthView.vue)

- Formulaire de connexion/inscription
- Validation des champs en temps réel
- Sélection du rôle (professeur/élève)

### Étape 13.3 : Dashboard (DashboardView.vue)

- Liste des quiz créés (professeur)
- Historique des résultats (élève)
- Actions : éditer, supprimer, voir résultats

### Étape 13.4 : Création de quiz (CreateQuizView.vue)

- Création du titre du quiz
- Ajout/modification/suppression de questions
- Support des types QCM et Vrai/Faux

### Étape 13.5 : Jouer un quiz (PlayQuizView.vue)

- Affichage progressif des questions
- Sélection des réponses
- Calcul et soumission du score
- Affichage du résultat final

---

## Phase 14 : SEO et Optimisation

### Étape 14.1 : Création du composable useSeo

J'ai créé `frontend/src/composables/useSeo.js` pour gérer dynamiquement les meta tags :

```javascript
export function useSeo({ title, description, image, url }) {
  // Mettre à jour le titre
  document.title = title

  // Mettre à jour la meta description
  updateMeta('description', description)

  // Open Graph (Facebook, LinkedIn)
  updateMeta('og:title', title)
  updateMeta('og:description', description)
  updateMeta('og:image', image)
  updateMeta('og:url', url)

  // Twitter Card
  updateMeta('twitter:title', title)
  updateMeta('twitter:description', description)
  updateMeta('twitter:image', image)
}
```

---

## Phase 15 : Documentation API avec Swagger

### Étape 15.1 : Configuration de Swagger

J'ai créé `backend/config/swagger.js` :

```javascript
const swaggerJsdoc = require('swagger-jsdoc')

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'QuizMaster API',
      version: '1.0.0',
      description: 'API REST pour QuizMaster'
    },
    servers: [{ url: '/api' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./routes/*.js']
}

module.exports = swaggerJsdoc(options)
```

### Étape 15.2 : Documentation des routes

Dans chaque fichier de routes, j'ai ajouté des commentaires JSDoc :

```javascript
/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Inscription d'un nouvel utilisateur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [prof, eleve]
 *     responses:
 *       201:
 *         description: Utilisateur créé
 */
```

---

## Phase 16 : Tests automatisés

### Étape 16.1 : Configuration de Vitest (Backend)

J'ai créé `backend/vitest.config.js` :

```javascript
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      reporter: ['text', 'json', 'html']
    }
  }
})
```

### Étape 16.2 : Tests d'intégration API

J'ai créé des tests pour chaque module :

```javascript
// backend/tests/auth.test.js
import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../server'

describe('Auth API', () => {
  it('POST /api/auth/register - devrait créer un utilisateur', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        password: 'Password123',
        role: 'eleve'
      })

    expect(res.status).toBe(201)
    expect(res.body.success).toBe(true)
    expect(res.body.data.token).toBeDefined()
  })

  it('POST /api/auth/login - devrait retourner 401 pour mauvais mot de passe', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'wrongpassword'
      })

    expect(res.status).toBe(401)
    expect(res.body.success).toBe(false)
  })
})
```

### Étape 16.3 : Tests unitaires Frontend

J'ai créé des tests pour les stores et composants :

```javascript
// frontend/src/tests/validators.test.js
import { describe, it, expect } from 'vitest'
import { validateEmail, validatePassword } from '../utils/validators'

describe('Validators', () => {
  it('validateEmail - devrait accepter un email valide', () => {
    expect(validateEmail('test@example.com')).toBe(true)
  })

  it('validateEmail - devrait rejeter un email invalide', () => {
    expect(validateEmail('invalid')).toBe(false)
  })

  it('validatePassword - devrait accepter un mot de passe valide', () => {
    expect(validatePassword('Password123')).toBe(true)
  })
})
```

---

## Phase 17 : Industrialisation (CI/CD)

### Étape 17.1 : Configuration ESLint et Prettier

J'ai créé `.eslintrc.json` et `.prettierrc` dans les deux projets pour garantir la qualité du code.

### Étape 17.2 : Pipeline CI/CD GitHub Actions

J'ai créé `.github/workflows/ci.yml` :

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - name: Install dependencies
        run: cd backend && npm ci
      - name: Run linter
        run: cd backend && npm run lint
      - name: Run tests
        run: cd backend && npm test

  test-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - name: Install dependencies
        run: cd frontend && npm ci
      - name: Run linter
        run: cd frontend && npm run lint
      - name: Run tests
        run: cd frontend && npm test
      - name: Build
        run: cd frontend && npm run build
```

---

## Phase 18 : Finalisation

### Étape 18.1 : Vérification de la conformité RGPD

- Mot de passe hashé avec bcrypt (10 rounds)
- Pas de stockage de données sensibles en clair
- Suppression en cascade des données utilisateur
- Logs d'audit pour traçabilité

### Étape 18.2 : Vérification de l'accessibilité WCAG

- Skip link pour navigation clavier
- Labels explicites sur tous les formulaires
- Attributs ARIA appropriés
- Raccourcis clavier pour les quiz
- Contrastes de couleurs suffisants

### Étape 18.3 : Documentation finale

- Documentation technique complète (DOCUMENTATION.md)
- Documentation Swagger interactive (/api-docs)
- Fichier README avec instructions d'installation

---

## Résumé des fichiers créés

### Backend (19 fichiers principaux)

| Fichier | Description |
|---------|-------------|
| `server.js` | Point d'entrée du serveur Express |
| `config/database.js` | Pool de connexion MySQL |
| `config/stripe.js` | Configuration Stripe |
| `config/swagger.js` | Configuration Swagger |
| `controllers/auth.controller.js` | Logique d'authentification |
| `controllers/quiz.controller.js` | Logique CRUD quiz |
| `controllers/question.controller.js` | Logique CRUD questions |
| `controllers/result.controller.js` | Logique des résultats |
| `controllers/payment.controller.js` | Logique paiement Stripe |
| `controllers/admin.controller.js` | Logique administration |
| `routes/auth.routes.js` | Routes authentification |
| `routes/quiz.routes.js` | Routes quiz |
| `routes/question.routes.js` | Routes questions |
| `routes/result.routes.js` | Routes résultats |
| `routes/payment.routes.js` | Routes paiement |
| `routes/admin.routes.js` | Routes administration |
| `middlewares/auth.middleware.js` | Vérification JWT |
| `middlewares/role.middleware.js` | Vérification des rôles |
| `utils/responses.js` | Helpers de réponse API |
| `utils/logger.js` | Système de logs |
| `utils/generateCode.js` | Génération de codes |
| `database/init.sql` | Script création BDD |

### Frontend (15 fichiers principaux)

| Fichier | Description |
|---------|-------------|
| `main.js` | Point d'entrée Vue |
| `App.vue` | Composant racine |
| `router/index.js` | Configuration routeur |
| `stores/auth.js` | Store authentification |
| `stores/quiz.js` | Store quiz |
| `services/api.js` | Client Axios |
| `services/admin.js` | Service admin |
| `views/HomeView.vue` | Page d'accueil |
| `views/AuthView.vue` | Page connexion |
| `views/DashboardView.vue` | Tableau de bord |
| `views/CreateQuizView.vue` | Création quiz |
| `views/PlayQuizView.vue` | Jouer quiz |
| `views/PaymentView.vue` | Page paiement |
| `views/AdminDashboardView.vue` | Dashboard admin |
| `components/Navbar.vue` | Barre navigation |
| `components/QuizCard.vue` | Carte quiz |
| `components/QuestionDisplay.vue` | Affichage question |
| `composables/useSeo.js` | Gestion SEO |

---

## Conclusion

Le développement de QuizMaster a suivi une méthodologie structurée :

1. **Conception** : Analyse du besoin, choix technologiques, modélisation BDD
2. **Backend d'abord** : API REST complète avec authentification, validation, tests
3. **Frontend ensuite** : Interface Vue.js connectée à l'API
4. **Transverse** : Sécurité, accessibilité, SEO, documentation
5. **Industrialisation** : CI/CD, linting, tests automatisés

Cette approche a permis de construire une application robuste, sécurisée et maintenable.
