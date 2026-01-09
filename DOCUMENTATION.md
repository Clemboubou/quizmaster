# Documentation Technique - QuizMaster

## Table des matieres

1. [Presentation du projet](#1-presentation-du-projet)
2. [Technologies utilisees](#2-technologies-utilisees)
3. [Architecture du projet](#3-architecture-du-projet)
4. [Base de donnees](#4-base-de-donnees)
5. [Backend - API REST](#5-backend---api-rest)
6. [Frontend - Interface utilisateur](#6-frontend---interface-utilisateur)
7. [Authentification et securite](#7-authentification-et-securite)
8. [Fonctionnalites implementees](#8-fonctionnalites-implementees)
9. [Tests](#9-tests)
10. [Industrialisation (ESLint, Prettier, CI/CD)](#10-industrialisation-eslint-prettier-cicd)
11. [Installation et lancement](#11-installation-et-lancement)

---

## 1. Presentation du projet

### Qu'est-ce que QuizMaster ?

QuizMaster est une application web permettant aux professeurs de creer des quiz interactifs et aux eleves de les passer en ligne. C'est une application "fullstack", c'est-a-dire qu'elle comprend :

- **Un frontend** : l'interface visible par l'utilisateur (ce qu'on voit dans le navigateur)
- **Un backend** : le serveur qui gere la logique metier et les donnees (invisible pour l'utilisateur)
- **Une base de donnees** : le stockage permanent des informations (utilisateurs, quiz, resultats)

### Les deux types d'utilisateurs

1. **Professeur (prof)** : peut creer des quiz, ajouter des questions, voir les resultats des eleves
2. **Eleve** : peut rejoindre un quiz via un code, repondre aux questions, voir son historique

### Le modele economique

- **Gratuit** : le professeur peut creer 1 quiz maximum
- **Premium (9.99€)** : le professeur peut creer jusqu'a 20 quiz

---

## 2. Technologies utilisees

### Backend

| Technologie | Role | Pourquoi ce choix ? |
|-------------|------|---------------------|
| **Node.js** | Environnement d'execution JavaScript | Permet d'utiliser JavaScript cote serveur, langage deja connu cote frontend |
| **Express.js** | Framework web | Simplifie la creation d'API REST, gestion des routes et middlewares |
| **MySQL** | Base de donnees relationnelle | Donnees structurees (utilisateurs, quiz, questions), relations entre tables |
| **JWT** | Authentification | Tokens securises pour identifier les utilisateurs sans stocker de session |
| **bcrypt** | Hashage de mots de passe | Securise les mots de passe en les rendant illisibles en base |
| **Stripe** | Paiement en ligne | Solution de paiement securisee et reconnue |
| **Helmet** | Securite HTTP | Ajoute des headers de securite automatiquement |
| **CORS** | Securite cross-origin | Permet au frontend de communiquer avec le backend |

### Frontend

| Technologie | Role | Pourquoi ce choix ? |
|-------------|------|---------------------|
| **Vue.js 3** | Framework JavaScript | Reactif, composants reutilisables, Composition API moderne |
| **Vite** | Bundler/Serveur de dev | Tres rapide, configuration simple |
| **Vue Router** | Navigation | Gestion des pages et des routes protegees |
| **Pinia** | Gestion d'etat | Stocke les donnees partagees entre composants (utilisateur, quiz) |
| **Axios** | Client HTTP | Simplifie les appels API avec intercepteurs |
| **Tailwind CSS** | Framework CSS | Classes utilitaires, design rapide et coherent |

### Outils de developpement

| Outil | Role |
|-------|------|
| **Vitest** | Framework de tests unitaires et d'integration |
| **Supertest** | Tests d'API HTTP |
| **Swagger** | Documentation interactive de l'API |
| **XAMPP** | Serveur MySQL local (via phpMyAdmin) |

---

## 3. Architecture du projet

### Structure des dossiers

```
quizmaster/
├── .github/
│   └── workflows/
│       └── ci.yml              # Pipeline CI/CD GitHub Actions
│
├── backend/                    # Code serveur
│   ├── config/                 # Configuration (BDD, Stripe, Swagger)
│   ├── controllers/            # Logique metier des routes
│   ├── middlewares/            # Fonctions intermediaires (auth, roles)
│   ├── routes/                 # Definition des endpoints API
│   ├── validators/             # Validation des donnees entrantes
│   ├── utils/                  # Fonctions utilitaires
│   ├── database/               # Scripts SQL
│   ├── tests/                  # Tests automatises
│   ├── server.js               # Point d'entree du serveur
│   ├── package.json            # Dependances Node.js
│   ├── .env                    # Variables d'environnement (secrets)
│   ├── .eslintrc.json          # Configuration ESLint
│   ├── .prettierrc             # Configuration Prettier
│   └── .prettierignore         # Fichiers ignores par Prettier
│
├── frontend/                   # Code client
│   ├── src/
│   │   ├── assets/             # Fichiers statiques (CSS)
│   │   ├── components/         # Composants Vue reutilisables
│   │   ├── views/              # Pages de l'application
│   │   ├── router/             # Configuration des routes
│   │   ├── stores/             # Gestion d'etat (Pinia)
│   │   ├── services/           # Appels API (Axios)
│   │   ├── utils/              # Fonctions utilitaires
│   │   ├── tests/              # Tests frontend (Vitest)
│   │   ├── App.vue             # Composant racine
│   │   └── main.js             # Point d'entree
│   ├── index.html              # Page HTML principale
│   ├── package.json            # Dependances
│   ├── vite.config.js          # Configuration Vite + Vitest
│   ├── tailwind.config.js      # Configuration Tailwind
│   ├── .eslintrc.json          # Configuration ESLint
│   ├── .prettierrc             # Configuration Prettier
│   └── .prettierignore         # Fichiers ignores par Prettier
│
├── .editorconfig               # Configuration editeurs
└── DOCUMENTATION.md            # Ce fichier
```

### Architecture MVC simplifiee

Le backend suit une architecture inspiree du pattern **MVC** (Model-View-Controller) :

```
Requete HTTP → Route → Controller → Base de donnees
                                  ↓
Reponse JSON ← Controller ← Donnees
```

1. **Routes** : definissent les URLs disponibles (ex: `/api/quizzes`)
2. **Controllers** : contiennent la logique metier (creer un quiz, verifier les droits)
3. **Middlewares** : s'executent avant le controller (verifier le token JWT)
4. **Base de donnees** : stocke les donnees de maniere permanente

---

## 4. Base de donnees

### Schema relationnel

J'ai concu la base de donnees avec 5 tables principales reliees entre elles :

```
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│    users     │       │   quizzes    │       │  questions   │
├──────────────┤       ├──────────────┤       ├──────────────┤
│ id (PK)      │←──┐   │ id (PK)      │←──┐   │ id (PK)      │
│ email        │   │   │ user_id (FK) │───┘   │ quiz_id (FK) │───┐
│ password     │   │   │ title        │       │ type         │   │
│ role         │   │   │ access_code  │       │ question_text│   │
│ is_premium   │   │   │ created_at   │       │ options      │   │
│ created_at   │   │   └──────────────┘       │ correct_answer│  │
└──────────────┘   │                          └──────────────┘   │
                   │                                             │
┌──────────────┐   │   ┌──────────────┐                         │
│   results    │   │   │   answers    │                         │
├──────────────┤   │   ├──────────────┤                         │
│ id (PK)      │←──┼───│ result_id(FK)│                         │
│ user_id (FK) │───┘   │ question_id  │─────────────────────────┘
│ quiz_id (FK) │       │ user_answer  │
│ score        │       │ is_correct   │
│ played_at    │       └──────────────┘
└──────────────┘

┌──────────────┐
│   payments   │
├──────────────┤
│ id (PK)      │
│ user_id (FK) │
│ stripe_id    │
│ amount       │
│ status       │
└──────────────┘
```

### Explication des tables

#### Table `users` (Utilisateurs)
Stocke tous les utilisateurs de l'application.

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | INT | Identifiant unique auto-incremente (cle primaire) |
| `email` | VARCHAR(255) | Email unique de l'utilisateur |
| `password` | VARCHAR(255) | Mot de passe hashe avec bcrypt |
| `role` | ENUM('prof', 'eleve') | Type d'utilisateur |
| `is_premium` | BOOLEAN | Si le prof a paye (defaut: false) |
| `created_at` | TIMESTAMP | Date de creation du compte |

#### Table `quizzes` (Quiz)
Stocke les quiz crees par les professeurs.

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | INT | Identifiant unique |
| `user_id` | INT | Reference vers le professeur createur (cle etrangere) |
| `title` | VARCHAR(100) | Titre du quiz (5-100 caracteres) |
| `access_code` | VARCHAR(5) | Code unique pour rejoindre (ex: "ABCD1") |
| `created_at` | TIMESTAMP | Date de creation |

#### Table `questions` (Questions)
Stocke les questions de chaque quiz.

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | INT | Identifiant unique |
| `quiz_id` | INT | Reference vers le quiz parent |
| `type` | ENUM('qcm', 'vf') | QCM (4 choix) ou Vrai/Faux |
| `question_text` | TEXT | Enonce de la question |
| `options` | JSON | Tableau des reponses possibles |
| `correct_answer` | VARCHAR(255) | La bonne reponse |

#### Table `results` (Resultats)
Stocke le score de chaque participation.

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | INT | Identifiant unique |
| `user_id` | INT | Reference vers l'eleve |
| `quiz_id` | INT | Reference vers le quiz |
| `score` | INT | Nombre de bonnes reponses |
| `played_at` | TIMESTAMP | Date de participation |

#### Table `answers` (Reponses detaillees)
Stocke chaque reponse donnee par l'eleve.

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | INT | Identifiant unique |
| `result_id` | INT | Reference vers le resultat |
| `question_id` | INT | Reference vers la question |
| `user_answer` | VARCHAR(255) | Reponse donnee par l'eleve |
| `is_correct` | BOOLEAN | Si la reponse etait correcte |

### Script de creation

Le fichier `backend/database/init.sql` contient les commandes SQL pour creer toutes les tables :

```sql
CREATE DATABASE IF NOT EXISTS quizmaster;
USE quizmaster;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('prof', 'eleve') NOT NULL,
    is_premium BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ... (autres tables)
```

### Cles etrangeres et CASCADE

J'ai utilise des **cles etrangeres** avec `ON DELETE CASCADE` pour maintenir l'integrite des donnees :

- Si on supprime un utilisateur → ses quiz, resultats et paiements sont supprimes automatiquement
- Si on supprime un quiz → ses questions et resultats sont supprimes
- Si on supprime un resultat → ses reponses detaillees sont supprimees

---

## 5. Backend - API REST

### Qu'est-ce qu'une API REST ?

Une **API REST** (Representational State Transfer) est une interface qui permet a differentes applications de communiquer via le protocole HTTP. Elle utilise :

- **Des URLs** pour identifier les ressources (ex: `/api/quizzes`)
- **Des methodes HTTP** pour les actions :
  - `GET` : lire des donnees
  - `POST` : creer des donnees
  - `PUT` : modifier des donnees
  - `DELETE` : supprimer des donnees
- **Du JSON** pour echanger les donnees

### Structure d'une reponse API

Toutes mes reponses API suivent le meme format :

```json
// Succes
{
  "success": true,
  "data": { ... }
}

// Erreur
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Quiz non trouve"
  }
}
```

### Liste des endpoints

#### Authentification (`/api/auth`)

| Methode | URL | Description | Auth requise |
|---------|-----|-------------|--------------|
| POST | `/register` | Creer un compte | Non |
| POST | `/login` | Se connecter | Non |
| GET | `/me` | Recuperer mon profil | Oui |
| POST | `/logout` | Se deconnecter | Oui |

#### Quiz (`/api/quizzes`)

| Methode | URL | Description | Auth requise | Role |
|---------|-----|-------------|--------------|------|
| GET | `/` | Lister mes quiz | Oui | Prof |
| GET | `/:id` | Voir un quiz | Oui | Prof |
| POST | `/` | Creer un quiz | Oui | Prof |
| PUT | `/:id` | Modifier un quiz | Oui | Prof |
| DELETE | `/:id` | Supprimer un quiz | Oui | Prof |
| GET | `/join/:code` | Rejoindre un quiz | Oui | Eleve |

#### Questions (`/api/questions`)

| Methode | URL | Description | Auth requise | Role |
|---------|-----|-------------|--------------|------|
| GET | `/quiz/:quizId` | Lister les questions (prof) | Oui | Prof |
| GET | `/play/:quizId` | Lister les questions (jouer) | Oui | Tous |
| POST | `/` | Ajouter une question | Oui | Prof |
| PUT | `/:id` | Modifier une question | Oui | Prof |
| DELETE | `/:id` | Supprimer une question | Oui | Prof |

#### Resultats (`/api/results`)

| Methode | URL | Description | Auth requise | Role |
|---------|-----|-------------|--------------|------|
| POST | `/` | Enregistrer un score | Oui | Eleve |
| GET | `/me` | Voir mes resultats | Oui | Eleve |
| GET | `/me/:id/answers` | Voir mes reponses detaillees | Oui | Eleve |
| GET | `/quiz/:quizId` | Resultats d'un quiz | Oui | Prof |
| GET | `/:id/answers` | Reponses d'un eleve | Oui | Prof |

#### Paiement (`/api/payment`)

| Methode | URL | Description | Auth requise |
|---------|-----|-------------|--------------|
| POST | `/create-checkout` | Creer une session Stripe | Oui |
| POST | `/webhook` | Recevoir les events Stripe | Non |
| GET | `/success` | Confirmer le paiement | Oui |

### Exemple de controller

Voici comment fonctionne le controller de creation de quiz (`controllers/quiz.controller.js`) :

```javascript
async function createQuiz(req, res) {
    try {
        // 1. Recuperer les donnees de la requete
        const { title } = req.body;
        const userId = req.user.userId; // Vient du middleware d'auth

        // 2. Verifier les limites (gratuit vs premium)
        const [user] = await pool.query(
            'SELECT is_premium FROM users WHERE id = ?',
            [userId]
        );

        const [existingQuizzes] = await pool.query(
            'SELECT COUNT(*) as count FROM quizzes WHERE user_id = ?',
            [userId]
        );

        const limit = user[0].is_premium ? 20 : 1;
        if (existingQuizzes[0].count >= limit) {
            return errorResponse(res, 'LIMIT_REACHED',
                'Limite de quiz atteinte', 403);
        }

        // 3. Generer un code d'acces unique
        const accessCode = generateAccessCode(); // Ex: "XK9M2"

        // 4. Inserer en base de donnees
        const [result] = await pool.query(
            'INSERT INTO quizzes (user_id, title, access_code) VALUES (?, ?, ?)',
            [userId, title, accessCode]
        );

        // 5. Retourner le quiz cree
        return successResponse(res, {
            id: result.insertId,
            title,
            access_code: accessCode
        }, 201);

    } catch (error) {
        console.error('Erreur createQuiz:', error);
        return errorResponse(res, 'INTERNAL_ERROR',
            'Erreur lors de la creation', 500);
    }
}
```

### Middlewares

Les **middlewares** sont des fonctions qui s'executent avant le controller. Ils permettent de factoriser du code commun.

#### Middleware d'authentification (`middlewares/auth.middleware.js`)

Verifie que l'utilisateur a un token JWT valide :

```javascript
function authenticateToken(req, res, next) {
    // 1. Recuperer le token du header "Authorization: Bearer xxx"
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            error: { code: 'UNAUTHORIZED', message: 'Token requis' }
        });
    }

    // 2. Verifier et decoder le token
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({
                success: false,
                error: { code: 'FORBIDDEN', message: 'Token invalide' }
            });
        }

        // 3. Ajouter les infos utilisateur a la requete
        req.user = user; // { userId: 1, email: "...", role: "prof" }
        next(); // Passer au middleware/controller suivant
    });
}
```

#### Middleware de role (`middlewares/role.middleware.js`)

Verifie que l'utilisateur a le bon role :

```javascript
function requireProf(req, res, next) {
    if (req.user.role !== 'prof') {
        return res.status(403).json({
            success: false,
            error: { code: 'FORBIDDEN', message: 'Acces reserve aux professeurs' }
        });
    }
    next();
}
```

### Chaine de middlewares

Les routes utilisent plusieurs middlewares en chaine :

```javascript
// Route protegee pour les professeurs uniquement
router.post('/',
    authenticateToken,  // 1. Verifier le token
    requireProf,        // 2. Verifier le role "prof"
    validateQuiz,       // 3. Valider les donnees
    quizController.createQuiz  // 4. Executer la logique
);
```

---

## 6. Frontend - Interface utilisateur

### Architecture Vue.js

Vue.js est un framework **reactif** : quand les donnees changent, l'interface se met a jour automatiquement.

#### Composants

Un composant Vue est un fichier `.vue` qui contient 3 parties :

```vue
<script setup>
// Logique JavaScript (Composition API)
import { ref, computed } from 'vue'

const count = ref(0) // Variable reactive
const doubled = computed(() => count.value * 2) // Valeur calculee

function increment() {
    count.value++
}
</script>

<template>
  <!-- HTML avec syntaxe Vue -->
  <div>
    <p>Compteur: {{ count }}</p>
    <p>Double: {{ doubled }}</p>
    <button @click="increment">+1</button>
  </div>
</template>

<style scoped>
/* CSS limite a ce composant */
button {
    background: blue;
}
</style>
```

### Composants crees

| Composant | Fichier | Role |
|-----------|---------|------|
| `Navbar` | `components/Navbar.vue` | Barre de navigation (logo, liens, deconnexion) |
| `QuizCard` | `components/QuizCard.vue` | Carte affichant un quiz (titre, code, actions) |
| `QuestionForm` | `components/QuestionForm.vue` | Formulaire de creation/edition de question |
| `QuestionDisplay` | `components/QuestionDisplay.vue` | Affichage d'une question pour l'eleve |
| `ScoreDisplay` | `components/ScoreDisplay.vue` | Affichage du score final |

### Pages (Views)

| Page | Fichier | URL | Description |
|------|---------|-----|-------------|
| Accueil | `HomeView.vue` | `/` | Page d'accueil avec formulaire pour rejoindre |
| Authentification | `AuthView.vue` | `/auth` | Connexion et inscription |
| Tableau de bord | `DashboardView.vue` | `/dashboard` | Liste des quiz (prof) ou resultats (eleve) |
| Creation quiz | `CreateQuizView.vue` | `/create-quiz` | Creation et edition de quiz |
| Jouer | `PlayQuizView.vue` | `/play` | Interface de jeu pour l'eleve |
| Paiement | `PaymentView.vue` | `/payment` | Page de passage Premium |
| Succes paiement | `PaymentSuccessView.vue` | `/payment/success` | Confirmation apres paiement |

### Routeur (Vue Router)

Le routeur gere la navigation entre les pages. J'ai configure des **guards** pour proteger certaines routes :

```javascript
const routes = [
  {
    path: '/dashboard',
    component: DashboardView,
    meta: { requiresAuth: true } // Necessite d'etre connecte
  },
  {
    path: '/create-quiz',
    component: CreateQuizView,
    meta: { requiresAuth: true, role: 'prof' } // Seulement les profs
  }
]

// Guard de navigation
router.beforeEach((to, from, next) => {
    const authStore = useAuthStore()

    // Verifier l'authentification
    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        return next('/auth') // Rediriger vers login
    }

    // Verifier le role
    if (to.meta.role && authStore.user?.role !== to.meta.role) {
        return next('/dashboard') // Rediriger
    }

    next() // Continuer
})
```

### Stores (Pinia)

Pinia est la solution officielle pour gerer l'**etat global** de l'application. C'est un endroit centralise pour stocker des donnees partagees entre composants.

#### Store d'authentification (`stores/auth.js`)

```javascript
export const useAuthStore = defineStore('auth', () => {
    // State (donnees)
    const user = ref(null)
    const token = ref(localStorage.getItem('token'))

    // Getters (valeurs calculees)
    const isAuthenticated = computed(() => !!token.value)
    const isProf = computed(() => user.value?.role === 'prof')
    const isEleve = computed(() => user.value?.role === 'eleve')
    const isPremium = computed(() => user.value?.is_premium)

    // Actions (fonctions)
    async function login(email, password) {
        const response = await api.post('/auth/login', { email, password })
        token.value = response.data.data.token
        localStorage.setItem('token', token.value)
        await fetchUser()
    }

    async function logout() {
        token.value = null
        user.value = null
        localStorage.removeItem('token')
    }

    return { user, token, isAuthenticated, isProf, login, logout, ... }
})
```

#### Store des quiz (`stores/quiz.js`)

Gere les quiz, questions et resultats :

```javascript
export const useQuizStore = defineStore('quiz', () => {
    const quizzes = ref([])      // Liste des quiz du prof
    const currentQuiz = ref(null) // Quiz en cours de jeu
    const questions = ref([])     // Questions du quiz actuel
    const results = ref([])       // Resultats de l'eleve

    async function fetchQuizzes() { ... }
    async function createQuiz(title) { ... }
    async function joinQuiz(code) { ... }
    async function submitResult(quizId, score, answers) { ... }
    // ...
})
```

### Service API (Axios)

Axios est configure avec des **intercepteurs** pour ajouter automatiquement le token JWT :

```javascript
// services/api.js
import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:3000/api'
})

// Intercepteur de requete
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// Intercepteur de reponse (gestion des erreurs 401)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token')
            window.location.href = '/auth'
        }
        return Promise.reject(error)
    }
)

export default api
```

### Tailwind CSS

Tailwind est un framework CSS **utility-first** : on compose des classes pour styler les elements.

```html
<!-- Avant (CSS classique) -->
<button class="btn-primary">Cliquer</button>
<style>
.btn-primary {
    background-color: #3B82F6;
    color: white;
    padding: 8px 16px;
    border-radius: 8px;
}
</style>

<!-- Avec Tailwind -->
<button class="bg-blue-500 text-white px-4 py-2 rounded-lg">Cliquer</button>
```

J'ai configure une palette de couleurs personnalisee dans `tailwind.config.js` :

```javascript
module.exports = {
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#eff6ff',
                    500: '#3b82f6',
                    600: '#2563eb',
                    // ...
                }
            }
        }
    }
}
```

---

## 7. Authentification et securite

### Fonctionnement de JWT

**JWT (JSON Web Token)** est un standard pour creer des tokens d'authentification. Un token JWT contient 3 parties :

```
eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiLi4uIn0.signature
|______ Header ______|_______ Payload _________|___ Signature ___|
```

1. **Header** : algorithme de signature (HS256)
2. **Payload** : donnees (userId, email, role, expiration)
3. **Signature** : verification que le token n'a pas ete modifie

### Processus de connexion

```
1. L'utilisateur envoie email + mot de passe
   ↓
2. Le serveur verifie le mot de passe avec bcrypt
   ↓
3. Si OK, le serveur cree un token JWT signe
   ↓
4. Le token est renvoye au frontend
   ↓
5. Le frontend stocke le token dans localStorage
   ↓
6. A chaque requete, le token est envoye dans le header
   ↓
7. Le serveur verifie le token avant de traiter la requete
```

### Hashage des mots de passe

Les mots de passe ne sont **jamais stockes en clair**. J'utilise **bcrypt** qui :

1. Ajoute un "salt" (donnees aleatoires) au mot de passe
2. Applique un algorithme de hashage couteux (10 rounds)
3. Produit un hash irreversible

```javascript
// A l'inscription
const hashedPassword = await bcrypt.hash(password, 10)
// Resultat: "$2b$10$N9qo8uLOickgx2ZMRZoMy..."

// A la connexion
const isValid = await bcrypt.compare(password, hashedPassword)
// Retourne true ou false
```

### Validation des mots de passe

Le mot de passe doit respecter ces regles :
- Minimum 8 caracteres
- Au moins 1 majuscule
- Au moins 1 minuscule
- Au moins 1 chiffre

```javascript
function validatePassword(password) {
    if (password.length < 8)
        return { valid: false, message: 'Minimum 8 caracteres' }
    if (!/[A-Z]/.test(password))
        return { valid: false, message: 'Une majuscule requise' }
    if (!/[a-z]/.test(password))
        return { valid: false, message: 'Une minuscule requise' }
    if (!/[0-9]/.test(password))
        return { valid: false, message: 'Un chiffre requis' }
    return { valid: true }
}
```

### Securite HTTP avec Helmet

Helmet ajoute automatiquement des headers de securite :

```javascript
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"]
        }
    }
}))
```

Headers ajoutes :
- `X-Content-Type-Options: nosniff` - Empeche le sniffing MIME
- `X-Frame-Options: DENY` - Empeche l'inclusion en iframe
- `X-XSS-Protection: 1` - Protection XSS basique
- `Strict-Transport-Security` - Force HTTPS

### CORS

**CORS** (Cross-Origin Resource Sharing) controle quels domaines peuvent appeler l'API :

```javascript
app.use(cors({
    origin: process.env.FRONTEND_URL, // http://localhost:5173
    credentials: true
}))
```

---

## 8. Fonctionnalites implementees

### Pour les professeurs

#### Gestion des quiz
- **Creer un quiz** : titre de 5-100 caracteres, generation automatique d'un code a 5 caracteres
- **Modifier un quiz** : changer le titre
- **Supprimer un quiz** : supprime aussi les questions et resultats associes
- **Limite** : 1 quiz en gratuit, 20 en premium

#### Gestion des questions
- **Ajouter une question** : QCM (4 choix) ou Vrai/Faux
- **Modifier une question** : changer le texte, les options, la bonne reponse
- **Supprimer une question**
- **Interface intuitive** : cliquer sur une option pour la marquer comme correcte (vert), les autres passent en rouge

#### Consultation des resultats
- **Liste des participants** : email et score de chaque eleve
- **Reponses detaillees** : voir chaque question avec la reponse de l'eleve, correcte (vert) ou incorrecte (rouge) avec la bonne reponse

### Pour les eleves

#### Rejoindre un quiz
- **Saisir le code** : 5 caracteres alphanumeriques
- **Jouer** : repondre aux questions une par une
- **Score final** : affichage du resultat avec pourcentage

#### Historique
- **Mes resultats** : liste de tous les quiz passes avec score et date
- **Revoir mes erreurs** : cliquer sur un resultat pour voir le detail de chaque question

### Systeme de paiement

#### Integration Stripe
1. Le prof clique sur "Passer Premium"
2. Une session Stripe Checkout est creee
3. Redirection vers la page de paiement Stripe
4. Apres paiement, Stripe appelle notre webhook
5. Le compte est mis a jour en premium
6. Redirection vers la page de succes

---

## 9. Tests

### Pourquoi tester ?

Les tests automatises permettent de :
- Verifier que le code fonctionne correctement
- Detecter les regressions (bugs introduits par des modifications)
- Documenter le comportement attendu
- Refactorer en confiance

### Types de tests realises

#### Tests d'integration API
Testent les endpoints de bout en bout avec une base de donnees mockee.

```javascript
describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
        const response = await request(app)
            .post('/api/auth/register')
            .send({
                email: 'test@test.com',
                password: 'Password123',
                role: 'prof'
            })

        expect(response.status).toBe(201)
        expect(response.body.success).toBe(true)
        expect(response.body.data).toHaveProperty('token')
    })

    it('should reject duplicate email', async () => {
        // Premier enregistrement
        await request(app).post('/api/auth/register').send({...})

        // Deuxieme avec meme email
        const response = await request(app)
            .post('/api/auth/register')
            .send({ email: 'test@test.com', ... })

        expect(response.status).toBe(409)
        expect(response.body.error.code).toBe('EMAIL_EXISTS')
    })
})
```

### Tests Backend realises

| Fichier | Nombre | Description |
|---------|--------|-------------|
| `tests/auth.test.js` | 13 tests | Inscription, connexion, profil |
| `tests/quiz.test.js` | 15 tests | CRUD quiz, limites, codes |
| `tests/question.test.js` | 13 tests | CRUD questions, validation |
| `tests/result.test.js` | 9 tests | Scores, resultats |
| **Total Backend** | **50 tests** | |

### Lancer les tests backend

```bash
cd backend
npm test
```

---

### Tests Frontend (Vitest + Vue Test Utils)

Le frontend est egalement teste avec **Vitest** (framework de test compatible Vite) et **Vue Test Utils** (utilitaire officiel pour tester les composants Vue).

#### Configuration de Vitest

La configuration se trouve dans `vite.config.js` :

```javascript
export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,           // Permet d'utiliser describe, it, expect sans import
    environment: 'jsdom',    // Simule un navigateur pour les tests de composants
    setupFiles: ['./src/tests/setup.js']  // Configuration globale
  }
})
```

Le fichier `setup.js` configure les mocks globaux (localStorage, window.location) :

```javascript
import { vi } from 'vitest'

// Mock de localStorage
const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn()
}
Object.defineProperty(window, 'localStorage', { value: localStorageMock })

// Reset les mocks avant chaque test
beforeEach(() => {
    vi.clearAllMocks()
})
```

#### Types de tests frontend

##### 1. Tests unitaires des utilitaires

Testent les fonctions pures comme les validateurs :

```javascript
// validators.test.js
describe('validateEmail', () => {
    it('devrait accepter un email valide', () => {
        expect(validateEmail('test@example.com')).toBe(true)
    })

    it('devrait rejeter un email sans @', () => {
        expect(validateEmail('testexample.com')).toBe(false)
    })
})

describe('validatePassword', () => {
    it('devrait accepter un mot de passe valide', () => {
        expect(validatePassword('Password123')).toBe(true)
    })

    it('devrait rejeter un mot de passe trop court', () => {
        expect(validatePassword('Pass1')).toBe(false)
    })
})
```

##### 2. Tests des stores Pinia

Testent la gestion d'etat avec des mocks d'API :

```javascript
// auth.store.test.js
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '../stores/auth'

// Mock du module API
vi.mock('../services/api', () => ({
    default: {
        post: vi.fn(),
        get: vi.fn()
    }
}))

describe('Auth Store', () => {
    let store

    beforeEach(() => {
        setActivePinia(createPinia())
        store = useAuthStore()
    })

    describe('Action login', () => {
        it('devrait stocker le token apres login reussi', async () => {
            api.post.mockResolvedValue({
                data: {
                    data: {
                        token: 'jwt-token-123',
                        user: { id: 1, email: 'test@test.com' }
                    }
                }
            })

            await store.login('test@test.com', 'Password123')

            expect(store.token).toBe('jwt-token-123')
            expect(store.isAuthenticated).toBe(true)
        })
    })

    describe('Action logout', () => {
        it('devrait reinitialiser le state', () => {
            store.token = 'some-token'
            store.user = { id: 1 }

            store.logout()

            expect(store.token).toBeNull()
            expect(store.user).toBeNull()
        })
    })
})
```

##### 3. Tests des composants Vue

Testent le rendu et les interactions avec Vue Test Utils :

```javascript
// ScoreDisplay.test.js
import { mount } from '@vue/test-utils'
import ScoreDisplay from '../components/ScoreDisplay.vue'

describe('ScoreDisplay', () => {
    it('devrait afficher le score correctement', () => {
        const wrapper = mount(ScoreDisplay, {
            props: { score: 8, total: 10 }
        })

        expect(wrapper.text()).toContain('8 / 10')
        expect(wrapper.text()).toContain('80%')
    })

    it('devrait afficher "Parfait !" pour 100%', () => {
        const wrapper = mount(ScoreDisplay, {
            props: { score: 10, total: 10 }
        })

        expect(wrapper.text()).toContain('Parfait !')
    })

    it('devrait emettre "back" au clic sur le bouton', async () => {
        const wrapper = mount(ScoreDisplay, {
            props: { score: 5, total: 10 }
        })

        await wrapper.find('button').trigger('click')

        expect(wrapper.emitted('back')).toBeTruthy()
    })
})
```

```javascript
// QuestionDisplay.test.js
describe('QuestionDisplay', () => {
    it('devrait afficher toutes les options', () => {
        const wrapper = mount(QuestionDisplay, {
            props: {
                question: {
                    question_text: 'Capitale de la France ?',
                    options: ['Londres', 'Paris', 'Berlin', 'Madrid']
                },
                questionNumber: 1,
                totalQuestions: 10
            }
        })

        expect(wrapper.text()).toContain('Paris')
        expect(wrapper.text()).toContain('A.')
        expect(wrapper.text()).toContain('B.')
    })

    it('devrait emettre la reponse selectionnee', async () => {
        const wrapper = mount(QuestionDisplay, { ... })

        // Selectionner une option
        const options = wrapper.findAll('button')
        await options[1].trigger('click')

        // Soumettre
        await wrapper.find('.btn-primary').trigger('click')

        expect(wrapper.emitted('answer')[0]).toEqual(['Paris'])
    })
})
```

#### Tests Frontend realises

| Fichier | Nombre | Description |
|---------|--------|-------------|
| `tests/validators.test.js` | 28 tests | Validation email, password, titre, question |
| `tests/auth.store.test.js` | 18 tests | Store authentification (login, logout, getters) |
| `tests/quiz.store.test.js` | 22 tests | Store quiz (CRUD, questions, resultats) |
| `tests/components/Navbar.test.js` | 14 tests | Barre de navigation, deconnexion |
| `tests/components/ScoreDisplay.test.js` | 18 tests | Affichage score, messages, progression |
| `tests/components/QuestionDisplay.test.js` | 16 tests | Questions, options, soumission |
| `tests/components/QuizCard.test.js` | 12 tests | Carte quiz, code, actions |
| **Total Frontend** | **128 tests** | |

#### Lancer les tests frontend

```bash
cd frontend
npm test          # Lance tous les tests une fois
npm run test:watch # Lance les tests en mode watch (relance auto)
```

#### Couverture de code

Pour generer un rapport de couverture :

```bash
npm test -- --coverage
```

---

### Resume des tests

| Partie | Framework | Nombre de tests |
|--------|-----------|-----------------|
| Backend | Vitest + Supertest | 50 tests |
| Frontend | Vitest + Vue Test Utils | 128 tests |
| **Total** | | **178 tests** |

---

## 10. Industrialisation (ESLint, Prettier, CI/CD)

L'**industrialisation** d'un projet consiste a mettre en place des outils pour automatiser et standardiser le developpement. Cela permet de :

- Garantir une **qualite de code** constante
- **Detecter les erreurs** avant la production
- **Automatiser les tests** et le deploiement
- Faciliter le **travail en equipe**

### ESLint - Linter JavaScript

**ESLint** est un outil qui analyse le code JavaScript pour trouver des erreurs et des problemes de style. C'est comme un correcteur orthographique pour le code.

#### Pourquoi utiliser ESLint ?

1. **Detecte les erreurs** avant l'execution (variables non definies, imports manquants)
2. **Enforce un style** coherent dans toute l'equipe
3. **Previent les bugs** courants (comparaisons faibles, variables non utilisees)

#### Configuration Backend (`.eslintrc.json`)

```json
{
  "env": {
    "node": true,
    "es2021": true,
    "vitest-globals/env": true
  },
  "extends": ["eslint:recommended"],
  "rules": {
    "indent": ["error", 4],
    "quotes": ["error", "single"],
    "semi": ["error", "never"],
    "no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
    "eqeqeq": ["error", "always"],
    "no-trailing-spaces": "error"
  }
}
```

**Explication des regles :**

| Regle | Description |
|-------|-------------|
| `indent: 4` | Indentation de 4 espaces |
| `quotes: single` | Utiliser les apostrophes `'` |
| `semi: never` | Pas de point-virgule a la fin |
| `eqeqeq: always` | Toujours utiliser `===` au lieu de `==` |
| `no-unused-vars` | Avertit si une variable n'est pas utilisee |

#### Configuration Frontend (`.eslintrc.json`)

Le frontend utilise le plugin **eslint-plugin-vue** pour analyser les fichiers `.vue` :

```json
{
  "extends": [
    "eslint:recommended",
    "plugin:vue/vue3-recommended"
  ],
  "rules": {
    "indent": ["error", 2],
    "vue/multi-word-component-names": "off",
    "vue/html-indent": ["error", 2],
    "vue/max-attributes-per-line": ["error", {
      "singleline": 3,
      "multiline": 1
    }]
  }
}
```

#### Commandes ESLint

```bash
# Verifier le code (backend ou frontend)
npm run lint

# Corriger automatiquement les erreurs
npm run lint:fix
```

### Prettier - Formateur de code

**Prettier** est un formateur de code automatique. Contrairement a ESLint qui verifie, Prettier **reformate** le code pour qu'il soit toujours coherent.

#### Pourquoi utiliser Prettier ?

1. **Fin des debats** sur le style de code (tabs vs espaces, etc.)
2. **Formatage automatique** a la sauvegarde
3. **Code lisible** et homogene dans tout le projet

#### Configuration (`.prettierrc`)

```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 4,
  "useTabs": false,
  "trailingComma": "none",
  "printWidth": 100,
  "bracketSpacing": true,
  "arrowParens": "avoid",
  "endOfLine": "lf"
}
```

**Explication des options :**

| Option | Valeur | Description |
|--------|--------|-------------|
| `semi` | false | Pas de point-virgule |
| `singleQuote` | true | Apostrophes au lieu de guillemets |
| `tabWidth` | 4 (backend) / 2 (frontend) | Taille de l'indentation |
| `trailingComma` | none | Pas de virgule finale |
| `printWidth` | 100 | Longueur max d'une ligne |
| `endOfLine` | lf | Style Unix pour les fins de ligne |

#### Commandes Prettier

```bash
# Formater tous les fichiers
npm run format

# Verifier le formatage (sans modifier)
npm run format:check
```

### EditorConfig

Le fichier `.editorconfig` assure une configuration coherente entre differents editeurs (VS Code, WebStorm, etc.) :

```ini
root = true

[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true
indent_style = space

[backend/**/*.js]
indent_size = 4

[frontend/**/*.{js,vue,css}]
indent_size = 2
```

### GitHub Actions - CI/CD

**GitHub Actions** permet d'automatiser des workflows (series de taches) qui s'executent sur les serveurs de GitHub. C'est ce qu'on appelle **CI/CD** :

- **CI (Continuous Integration)** : Verifier automatiquement le code a chaque push
- **CD (Continuous Deployment)** : Deployer automatiquement apres validation

#### Notre workflow CI (`.github/workflows/ci.yml`)

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, master, develop]
  pull_request:
    branches: [main, master, develop]

jobs:
  # Job Backend
  backend:
    name: Backend CI
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./backend

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Check formatting (Prettier)
        run: npm run format:check

      - name: Lint code (ESLint)
        run: npm run lint

      - name: Run tests
        run: npm test

  # Job Frontend
  frontend:
    name: Frontend CI
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./frontend

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Check formatting (Prettier)
        run: npm run format:check

      - name: Lint code (ESLint)
        run: npm run lint

      - name: Run tests
        run: npm test

      - name: Build application
        run: npm run build

      - name: Upload build artifacts
        uses: actions/upload-artifact@v4
        with:
          name: frontend-build
          path: ./frontend/dist
```

#### Explication du workflow

1. **Declencheur** (`on`) : Le workflow s'execute sur :
   - Chaque `push` sur main, master ou develop
   - Chaque `pull_request` vers ces branches

2. **Jobs** : Deux jobs independants qui s'executent en parallele :
   - `backend` : Verifie le code serveur
   - `frontend` : Verifie le code client

3. **Steps** (etapes) de chaque job :
   - `checkout` : Recupere le code du repository
   - `setup-node` : Installe Node.js v20
   - `npm ci` : Installe les dependances (plus rapide que `npm install`)
   - `format:check` : Verifie le formatage Prettier
   - `lint` : Verifie les regles ESLint
   - `test` : Execute les tests automatises
   - `build` : Compile le frontend (seulement pour frontend)

4. **Artifacts** : Le build du frontend est sauvegarde pendant 7 jours

#### Visualisation sur GitHub

Apres un push, vous verrez dans l'onglet "Actions" :

```
✅ CI/CD Pipeline
   ├── ✅ Backend CI
   │   ├── ✅ Checkout repository
   │   ├── ✅ Setup Node.js
   │   ├── ✅ Install dependencies
   │   ├── ✅ Check formatting (Prettier)
   │   ├── ✅ Lint code (ESLint)
   │   └── ✅ Run tests
   │
   └── ✅ Frontend CI
       ├── ✅ Checkout repository
       ├── ✅ Setup Node.js
       ├── ✅ Install dependencies
       ├── ✅ Check formatting (Prettier)
       ├── ✅ Lint code (ESLint)
       ├── ✅ Run tests
       ├── ✅ Build application
       └── ✅ Upload build artifacts
```

Si une etape echoue (ex: test qui ne passe pas), le workflow s'arrete et affiche une croix rouge.

#### Avantages du CI/CD

| Avantage | Description |
|----------|-------------|
| **Detection precoce** | Les bugs sont detectes avant d'etre merges |
| **Qualite garantie** | Impossible de merger du code qui ne passe pas les tests |
| **Automatisation** | Plus besoin de lancer les tests manuellement |
| **Historique** | Chaque execution est tracee et consultable |
| **Collaboration** | Tout le monde suit les memes standards |

### Scripts npm disponibles

#### Backend

```bash
npm start        # Demarre le serveur en production
npm run dev      # Demarre avec rechargement automatique (nodemon)
npm test         # Lance les tests Vitest
npm run lint     # Verifie le code avec ESLint
npm run lint:fix # Corrige automatiquement
npm run format   # Formate avec Prettier
npm run format:check # Verifie le formatage
```

#### Frontend

```bash
npm run dev      # Serveur de developpement Vite
npm run build    # Build de production
npm run preview  # Previsualise le build
npm test         # Lance les tests Vitest
npm run lint     # Verifie le code avec ESLint
npm run lint:fix # Corrige automatiquement
npm run format   # Formate avec Prettier
npm run format:check # Verifie le formatage
```

### Deployer sur GitHub et tester le CI/CD

Voici les etapes pour publier le projet sur GitHub et voir le pipeline CI/CD en action.

#### Etape 1 : Creer un repository GitHub

1. Aller sur https://github.com
2. Cliquer sur **"New repository"** (bouton vert)
3. Nommer le repository (ex: `quizmaster`)
4. Laisser **Public** ou choisir **Private**
5. **Ne pas** cocher "Add a README" (on en a deja un)
6. Cliquer sur **"Create repository"**

#### Etape 2 : Initialiser Git en local

Ouvrir un terminal dans le dossier `quizmaster` :

```bash
cd C:\Users\Cleme\Desktop\Squeez\quizmaster

# Initialiser le repository Git
git init

# Ajouter tous les fichiers
git add .

# Creer le premier commit
git commit -m "Initial commit - QuizMaster avec CI/CD"
```

#### Etape 3 : Connecter a GitHub

Copier l'URL du repository GitHub (ex: `https://github.com/ton-username/quizmaster.git`) puis :

```bash
# Ajouter le remote (remplacer par ton URL)
git remote add origin https://github.com/ton-username/quizmaster.git

# Renommer la branche en "main"
git branch -M main

# Pousser le code vers GitHub
git push -u origin main
```

**Note** : Si c'est la premiere fois, GitHub te demandera de t'authentifier.

#### Etape 4 : Voir le pipeline CI/CD

1. Aller sur ton repository GitHub
2. Cliquer sur l'onglet **"Actions"**
3. Tu verras le workflow **"CI/CD Pipeline"** en cours d'execution

```
🟡 CI/CD Pipeline (running...)
   ├── 🟡 Backend CI
   └── 🟡 Frontend CI
```

Apres quelques minutes :

```
✅ CI/CD Pipeline (success)
   ├── ✅ Backend CI (2m 30s)
   └── ✅ Frontend CI (3m 15s)
```

#### Etape 5 : En cas d'echec

Si le pipeline echoue (croix rouge), clique dessus pour voir les details :

```
❌ CI/CD Pipeline (failed)
   ├── ✅ Backend CI
   └── ❌ Frontend CI
       └── ❌ Lint code (ESLint)
           → Error: 'unused-var' is defined but never used
```

Pour corriger :
1. Lire le message d'erreur
2. Corriger le code en local
3. Commit et push a nouveau :

```bash
git add .
git commit -m "Fix: correction erreur ESLint"
git push
```

Le pipeline se relancera automatiquement.

#### Fichier .gitignore

Avant de push, assure-toi d'avoir un fichier `.gitignore` a la racine pour ne pas envoyer les fichiers sensibles :

```
# Dependencies
node_modules/

# Environment variables (SECRETS!)
.env

# Build output
dist/

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db

# Logs
*.log

# Coverage
coverage/
```

#### Conseils pour le workflow Git

| Action | Commande |
|--------|----------|
| Voir le statut | `git status` |
| Voir les modifications | `git diff` |
| Ajouter un fichier | `git add fichier.js` |
| Ajouter tout | `git add .` |
| Creer un commit | `git commit -m "message"` |
| Pousser vers GitHub | `git push` |
| Recuperer les modifications | `git pull` |
| Voir l'historique | `git log --oneline` |

#### Bonnes pratiques de commit

Utiliser des messages clairs et descriptifs :

```bash
# Bon
git commit -m "feat: ajout validation email"
git commit -m "fix: correction bug connexion"
git commit -m "docs: mise a jour README"
git commit -m "test: ajout tests QuizCard"

# Mauvais
git commit -m "update"
git commit -m "fix"
git commit -m "wip"
```

Prefixes courants :
- `feat:` nouvelle fonctionnalite
- `fix:` correction de bug
- `docs:` documentation
- `test:` ajout/modification de tests
- `refactor:` refactorisation du code
- `style:` formatage (pas de changement de logique)

---

## 11. Installation et lancement

### Prerequis

- **Node.js** v18+ : https://nodejs.org
- **XAMPP** (pour MySQL) : https://www.apachefriends.org
- **Git** (optionnel) : https://git-scm.com

### Installation

#### 1. Cloner ou telecharger le projet

```bash
cd C:\Users\Cleme\Desktop\Squeez
```

#### 2. Configurer la base de donnees

1. Lancer XAMPP et demarrer MySQL
2. Ouvrir phpMyAdmin (http://localhost/phpmyadmin)
3. Executer le script `backend/database/init.sql`

#### 3. Configurer le backend

```bash
cd quizmaster/backend
npm install
```

Creer le fichier `.env` :
```
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=quizmaster
JWT_SECRET=votre_cle_secrete_jwt
JWT_EXPIRES_IN=7d
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
FRONTEND_URL=http://localhost:5173
```

#### 4. Configurer le frontend

```bash
cd ../frontend
npm install
```

### Lancement

#### Terminal 1 - Backend
```bash
cd quizmaster/backend
npm start
```
→ Serveur demarre sur http://localhost:3000

#### Terminal 2 - Frontend
```bash
cd quizmaster/frontend
npm run dev
```
→ Application disponible sur http://localhost:5173

### URLs utiles

| URL | Description |
|-----|-------------|
| http://localhost:5173 | Application frontend |
| http://localhost:3000/api | API backend |
| http://localhost:3000/api-docs | Documentation Swagger |
| http://localhost/phpmyadmin | Administration MySQL |

---

## Conclusion

Ce projet QuizMaster couvre les competences suivantes :

### Backend (Bloc 3)
- ✅ Base de donnees relationnelle MySQL avec relations
- ✅ API REST securisee avec Node.js/Express
- ✅ Authentification JWT et hashage bcrypt
- ✅ Integration paiement Stripe
- ✅ Tests automatises (50 tests)
- ✅ Validation des donnees
- ✅ Gestion des erreurs

### Frontend (Bloc 2)
- ✅ Framework Vue.js 3 avec Composition API
- ✅ Gestion d'etat avec Pinia
- ✅ Routage avec Vue Router et guards
- ✅ Consommation d'API securisee avec Axios
- ✅ Interface responsive avec Tailwind CSS
- ✅ Formulaires avec validation
- ✅ Tests frontend (128 tests avec Vitest + Vue Test Utils)

### Industrialisation
- ✅ ESLint pour la qualite du code (backend + frontend)
- ✅ Prettier pour le formatage automatique
- ✅ EditorConfig pour la coherence entre editeurs
- ✅ GitHub Actions CI/CD (lint, format, tests, build)

### Points d'amelioration possibles
- Accessibilite (ARIA, navigation clavier)
- SEO (meta tags, sitemap)
- Docker pour le deploiement
- Rate limiting pour la securite
