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
11. [SEO et Referencement](#11-seo-et-referencement)
12. [Accessibilite (a11y)](#12-accessibilite-a11y)
13. [Installation et lancement](#13-installation-et-lancement)
14. [Administration](#14-administration)

---

## 1. Presentation du projet

### Qu'est-ce que QuizMaster ?

QuizMaster est une application web permettant aux professeurs de creer des quiz interactifs et aux eleves de les passer en ligne. C'est une application "fullstack", c'est-a-dire qu'elle comprend :

- **Un frontend** : l'interface visible par l'utilisateur (ce qu'on voit dans le navigateur)
- **Un backend** : le serveur qui gere la logique metier et les donnees (invisible pour l'utilisateur)
- **Une base de donnees** : le stockage permanent des informations (utilisateurs, quiz, resultats)

### Les trois types d'utilisateurs

1. **Professeur (prof)** : peut creer des quiz, ajouter des questions, voir les resultats des eleves
2. **Eleve** : peut rejoindre un quiz via un code, repondre aux questions, voir son historique
3. **Administrateur (admin)** : peut gerer tous les utilisateurs, voir les statistiques, consulter les logs systeme

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

### Pourquoi industrialiser un projet ?

L'**industrialisation** d'un projet consiste a mettre en place des outils pour automatiser et standardiser le developpement. Sans industrialisation, on rencontre ces problemes :

| Probleme | Consequence |
|----------|-------------|
| Code mal formate | Difficile a lire, merge conflicts inutiles |
| Pas de verification automatique | Bugs decouverts trop tard en production |
| Styles de code differents | Code incoherent, difficile a maintenir |
| Tests manuels | Oublis, regressions non detectees |
| Pas de validation avant merge | Code casse pousse sur main |

L'industrialisation resout ces problemes en automatisant :
- **Formatage** : Prettier formate le code automatiquement
- **Verification** : ESLint detecte les erreurs avant execution
- **Tests** : Vitest execute les tests a chaque push
- **Integration** : GitHub Actions valide tout avant merge

### Ce que nous avons mis en place

#### Fichiers crees

| Fichier | Role | Pourquoi necessaire |
|---------|------|---------------------|
| `backend/.eslintrc.json` | Config ESLint backend | Detecter erreurs JS cote serveur |
| `backend/.prettierrc` | Config Prettier backend | Formatage uniforme (indent 4) |
| `backend/.prettierignore` | Fichiers a ignorer | Eviter de formater node_modules |
| `frontend/.eslintrc.json` | Config ESLint frontend | Detecter erreurs JS + Vue |
| `frontend/.prettierrc` | Config Prettier frontend | Formatage uniforme (indent 2) |
| `frontend/.prettierignore` | Fichiers a ignorer | Eviter de formater dist/ |
| `.editorconfig` | Config editeurs | Coherence VS Code, WebStorm, etc. |
| `.github/workflows/ci.yml` | Pipeline CI/CD | Automatiser verification a chaque push |

#### Dependances ajoutees

**Backend** (`package.json`) :
```json
"devDependencies": {
  "eslint": "^8.56.0",
  "eslint-plugin-vitest-globals": "^1.5.0",
  "prettier": "^3.2.0"
}
```

**Frontend** (`package.json`) :
```json
"devDependencies": {
  "eslint": "^8.56.0",
  "eslint-plugin-vue": "^9.20.0",
  "eslint-plugin-vitest-globals": "^1.5.0",
  "prettier": "^3.2.0"
}
```

#### Scripts npm ajoutes

Dans les deux `package.json`, j'ai ajoute ces scripts :

```json
"scripts": {
  "lint": "eslint .",
  "lint:fix": "eslint . --fix",
  "format": "prettier --write .",
  "format:check": "prettier --check ."
}
```

### ESLint - Linter JavaScript

**ESLint** est un outil qui analyse le code JavaScript pour trouver des erreurs et des problemes de style. C'est comme un correcteur orthographique pour le code.

#### Pourquoi utiliser ESLint ?

1. **Detecte les erreurs** avant l'execution (variables non definies, imports manquants)
2. **Enforce un style** coherent dans toute l'equipe
3. **Previent les bugs** courants (comparaisons faibles `==` au lieu de `===`)

#### Probleme rencontre : Conflit ESLint / Prettier

Lors de la mise en place, nous avons rencontre un **conflit entre ESLint et Prettier** :

```
# ESLint voulait des single quotes
"quotes": ["error", "single"]

# Mais Prettier reformatait parfois en double quotes
# Resultat : boucle infinie de corrections
```

**Symptome** : Apres `npm run lint:fix`, Prettier rechangeait le formatage, puis ESLint se plaignait a nouveau.

**Solution** : Laisser Prettier gerer TOUT le formatage et desactiver les regles de formatage dans ESLint. C'est la bonne pratique recommandee :

> "Use Prettier for formatting, ESLint for code quality"

#### Configuration Backend finale (`.eslintrc.json`)

```json
{
  "env": {
    "node": true,
    "es2021": true,
    "vitest-globals/env": true
  },
  "extends": ["eslint:recommended"],
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "plugins": ["vitest-globals"],
  "rules": {
    "no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
    "no-console": "warn",
    "eqeqeq": ["error", "always"]
  },
  "ignorePatterns": ["node_modules/", "coverage/"]
}
```

**Explication des choix :**

| Regle | Valeur | Pourquoi |
|-------|--------|----------|
| `no-unused-vars` | warn | Avertit sans bloquer (utile en dev) |
| `argsIgnorePattern: ^_` | - | Ignore les params prefixes par `_` (convention) |
| `no-console` | warn | Rappelle de supprimer les console.log |
| `eqeqeq` | error | Force `===` pour eviter les bugs de coercition |

**Regles volontairement absentes** (gerees par Prettier) :
- `indent` - Prettier gere l'indentation
- `quotes` - Prettier gere les guillemets
- `semi` - Prettier gere les points-virgules
- `comma-dangle` - Prettier gere les virgules

#### Configuration Frontend finale (`.eslintrc.json`)

```json
{
  "env": {
    "browser": true,
    "es2021": true,
    "node": true,
    "vitest-globals/env": true
  },
  "extends": ["eslint:recommended", "plugin:vue/vue3-recommended"],
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "plugins": ["vue", "vitest-globals"],
  "rules": {
    "no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
    "no-console": "warn",
    "eqeqeq": ["error", "always"],
    "vue/multi-word-component-names": "off",
    "vue/singleline-html-element-content-newline": "off",
    "vue/max-attributes-per-line": "off",
    "vue/html-self-closing": "off"
  },
  "ignorePatterns": ["node_modules/", "dist/", "coverage/"]
}
```

**Regles Vue desactivees et pourquoi :**

| Regle | Pourquoi desactivee |
|-------|---------------------|
| `vue/multi-word-component-names` | Nos composants comme `Navbar` sont valides |
| `vue/max-attributes-per-line` | Conflit avec Prettier qui gere ca |
| `vue/html-self-closing` | Conflit avec Prettier |
| `vue/singleline-html-element-content-newline` | Conflit avec Prettier |

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

### Problemes rencontres et solutions

Lors de la mise en place du CI/CD, nous avons rencontre plusieurs problemes qu'il a fallu resoudre.

#### Probleme 1 : package-lock.json desynchronise

**Erreur GitHub Actions :**
```
npm error `npm ci` can only install packages when your package.json
and package-lock.json are in sync.
npm error Missing: eslint@8.57.1 from lock file
npm error Missing: prettier@3.7.4 from lock file
```

**Explication** : La commande `npm ci` (utilisee en CI) exige que le `package-lock.json` soit parfaitement synchronise avec `package.json`. Comme nous avions ajoute ESLint et Prettier dans `package.json` mais pas reinstalle les dependances, le lock file etait obsolete.

**Solution** :
```bash
cd backend && npm install
cd ../frontend && npm install
git add package-lock.json
git commit -m "fix: update package-lock.json"
git push
```

**Lecon apprise** : Toujours faire `npm install` apres avoir modifie `package.json`, puis committer le `package-lock.json`.

#### Probleme 2 : Fichiers non formates

**Erreur GitHub Actions :**
```
[warn] src/components/Navbar.vue
[warn] src/stores/quiz.js
[warn] Code style issues found in 25 files.
Error: Process completed with exit code 1.
```

**Explication** : Les fichiers existants n'avaient jamais ete formates avec Prettier. Le CI verifiait le formatage avec `npm run format:check` qui echoue si des fichiers ne sont pas conformes.

**Solution** :
```bash
cd frontend && npm run format
cd ../backend && npm run format
git add .
git commit -m "style: format all files with Prettier"
git push
```

**Lecon apprise** : Apres avoir configure Prettier, toujours formater tous les fichiers existants avant de push.

#### Probleme 3 : Conflit ESLint / Prettier sur les quotes

**Erreur** :
```
src/stores/quiz.js
  189:59  error  Strings must use singlequote  quotes

# Apres npm run lint:fix, Prettier remet des double quotes
# Boucle infinie !
```

**Explication** : ESLint avait la regle `"quotes": ["error", "single"]` et Prettier avait `"singleQuote": true`. Mais dans certains cas (template literals, JSON), Prettier utilisait quand meme des double quotes, ce qui faisait echouer ESLint.

**Solution** : Supprimer les regles de formatage d'ESLint et laisser Prettier tout gerer :

```json
// AVANT (conflits)
"rules": {
  "quotes": ["error", "single"],
  "semi": ["error", "never"],
  "indent": ["error", 2]
}

// APRES (pas de conflits)
"rules": {
  "eqeqeq": ["error", "always"],
  "no-unused-vars": ["warn"]
}
```

**Lecon apprise** : ESLint = qualite du code, Prettier = formatage. Ne jamais melanger.

#### Probleme 4 : Regles Vue trop strictes

**Erreur** :
```
vue/max-attributes-per-line - 'placeholder' should be on a new line
vue/html-self-closing - Require self-closing on HTML elements
```

**Explication** : Le plugin `eslint-plugin-vue` avec `vue3-recommended` active des regles tres strictes sur le formatage HTML. Ces regles entraient en conflit avec Prettier.

**Solution** : Desactiver les regles Vue qui concernent le formatage :

```json
"rules": {
  "vue/max-attributes-per-line": "off",
  "vue/html-self-closing": "off",
  "vue/singleline-html-element-content-newline": "off"
}
```

### Resultat final

Apres resolution de tous les problemes, le pipeline CI/CD passe avec succes :

```
✅ CI/CD Pipeline - Success (37s)
   ├── ✅ Backend CI (15s)
   │   ├── ✅ Install dependencies
   │   ├── ✅ Check formatting (Prettier)
   │   ├── ✅ Lint code (ESLint) - 4 warnings
   │   └── ✅ Run tests - 50 passed
   │
   └── ✅ Frontend CI (22s)
       ├── ✅ Install dependencies
       ├── ✅ Check formatting (Prettier)
       ├── ✅ Lint code (ESLint) - 5 warnings
       ├── ✅ Run tests - 149 passed
       └── ✅ Build application
```

**Warnings restants (acceptables)** :

| Warning | Fichier | Explication |
|---------|---------|-------------|
| `'_' is assigned but never used` | auth.test.js | Convention pour ignorer des valeurs |
| `'router' is assigned but never used` | DashboardView.vue | Prepare pour usage futur |
| `Unexpected console statement` | PlayQuizView.vue | console.log de debug |
| `'vi' is defined but never used` | tests/*.js | Import pour usage potentiel |

Ces warnings sont en `warn` (pas `error`) donc ils n'empechent pas le build. Ils servent de rappels pour le developpeur.

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

## 11. SEO et Referencement

### Qu'est-ce que le SEO ?

Le **SEO** (Search Engine Optimization) ou **referencement naturel** est l'ensemble des techniques permettant d'ameliorer la visibilite d'un site web dans les resultats des moteurs de recherche (Google, Bing, etc.).

**Pourquoi c'est important ?**

| Sans SEO | Avec SEO |
|----------|----------|
| Site invisible sur Google | Site bien positionne |
| Peu de trafic organique | Trafic gratuit et qualifie |
| Dependance a la publicite | Visibilite durable |
| Partage social basique | Apercu riche sur les reseaux |

### Ce que nous avons implemente

#### 1. Meta tags dans `index.html`

Les **meta tags** sont des balises HTML invisibles qui donnent des informations aux moteurs de recherche.

```html
<!-- TITRE : Ce qui apparait dans l'onglet et les resultats Google -->
<!-- CRITIQUE : 50-60 caracteres max, contient les mots-cles principaux -->
<title>QuizMaster - Creez et partagez des quiz interactifs</title>

<!-- DESCRIPTION : Texte sous le titre dans Google -->
<!-- CRITIQUE : 150-160 caracteres, incite au clic -->
<meta name="description" content="QuizMaster permet aux professeurs de
creer des quiz interactifs (QCM, Vrai/Faux) et aux eleves de les passer
en ligne. Gratuit et simple d'utilisation." />

<!-- MOTS-CLES : Moins important aujourd'hui mais utile -->
<meta name="keywords" content="quiz, qcm, education, professeur, eleve" />

<!-- ROBOTS : Instructions pour l'indexation -->
<!-- index = indexer la page, follow = suivre les liens -->
<meta name="robots" content="index, follow" />

<!-- CANONICAL : URL officielle (evite le contenu duplique) -->
<link rel="canonical" href="https://quizmaster.app/" />
```

**Pourquoi ces choix ?**

| Meta tag | Role | Impact SEO |
|----------|------|------------|
| `<title>` | Titre dans Google | CRITIQUE - 1er facteur de clic |
| `description` | Resume dans Google | IMPORTANT - 2e facteur de clic |
| `keywords` | Mots-cles | FAIBLE - Google ne l'utilise plus |
| `robots` | Controle indexation | IMPORTANT - evite pages privees |
| `canonical` | URL unique | IMPORTANT - evite penalites |

#### 2. Open Graph (partage reseaux sociaux)

Les balises **Open Graph** controlent l'apercu quand quelqu'un partage le lien sur Facebook, LinkedIn, etc.

```html
<!-- Type de contenu -->
<meta property="og:type" content="website" />

<!-- URL partagee -->
<meta property="og:url" content="https://quizmaster.app/" />

<!-- Titre de l'apercu (peut differer du <title>) -->
<meta property="og:title" content="QuizMaster - Creez des quiz interactifs" />

<!-- Description de l'apercu -->
<meta property="og:description" content="Plateforme de creation de quiz..." />

<!-- Image de l'apercu (1200x630 pixels recommandes) -->
<meta property="og:image" content="https://quizmaster.app/og-image.png" />

<!-- Langue -->
<meta property="og:locale" content="fr_FR" />
```

**Resultat visuel sur Facebook :**
```
┌─────────────────────────────────────┐
│  [Image og-image.png]               │
│                                     │
│  QuizMaster - Creez des quiz...     │
│  Plateforme de creation de quiz...  │
│  quizmaster.app                     │
└─────────────────────────────────────┘
```

#### 3. Twitter Card

Meme principe que Open Graph mais pour Twitter/X :

```html
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="QuizMaster - Quiz interactifs" />
<meta name="twitter:description" content="Creez des quiz..." />
<meta name="twitter:image" content="https://quizmaster.app/og-image.png" />
```

#### 4. CSR vs SSR : Comprendre le rendu des pages

Avant d'expliquer notre solution SEO, il faut comprendre les deux types de rendu web.

##### CSR - Client-Side Rendering (Rendu cote client)

```
┌─────────────────────────────────────────────────────────────────┐
│                         CSR - Comment ca marche                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. Navigateur demande la page                                   │
│     GET https://quizmaster.app/                                  │
│                        │                                         │
│                        ▼                                         │
│  2. Serveur renvoie un HTML VIDE + JavaScript                    │
│     <html>                                                       │
│       <body>                                                     │
│         <div id="app"></div>  ← Vide !                          │
│         <script src="app.js"></script>                          │
│       </body>                                                    │
│     </html>                                                      │
│                        │                                         │
│                        ▼                                         │
│  3. JavaScript s'execute dans le NAVIGATEUR                      │
│     → Appelle l'API                                              │
│     → Construit le HTML                                          │
│     → Affiche le contenu                                         │
│                                                                  │
│  PROBLEME SEO : Google voit le HTML vide au debut !              │
└─────────────────────────────────────────────────────────────────┘
```

**C'est ce que fait Vue.js par defaut (notre cas).**

| Avantages CSR | Inconvenients CSR |
|---------------|-------------------|
| Navigation rapide entre pages | Premier chargement lent |
| Moins de charge serveur | SEO plus difficile |
| Experience interactive | Contenu invisible sans JS |
| Deploiement simple (fichiers statiques) | Meta tags statiques |

##### SSR - Server-Side Rendering (Rendu cote serveur)

```
┌─────────────────────────────────────────────────────────────────┐
│                         SSR - Comment ca marche                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. Navigateur demande la page                                   │
│     GET https://quizmaster.app/                                  │
│                        │                                         │
│                        ▼                                         │
│  2. SERVEUR execute JavaScript et construit le HTML              │
│     → Appelle l'API                                              │
│     → Genere le HTML complet                                     │
│                        │                                         │
│                        ▼                                         │
│  3. Serveur renvoie le HTML COMPLET                              │
│     <html>                                                       │
│       <head>                                                     │
│         <title>QuizMaster - Accueil</title>                     │
│         <meta name="description" content="...">                 │
│       </head>                                                    │
│       <body>                                                     │
│         <div id="app">                                           │
│           <h1>Bienvenue sur QuizMaster</h1>  ← Deja la !        │
│           <p>Contenu complet...</p>                             │
│         </div>                                                   │
│       </body>                                                    │
│     </html>                                                      │
│                                                                  │
│  AVANTAGE SEO : Google voit tout le contenu immediatement !      │
└─────────────────────────────────────────────────────────────────┘
```

**C'est ce que font Nuxt.js (Vue) ou Next.js (React).**

| Avantages SSR | Inconvenients SSR |
|---------------|-------------------|
| SEO optimal | Configuration plus complexe |
| Premier affichage rapide | Necessite un serveur Node.js |
| Meta tags dynamiques natifs | Plus de charge serveur |
| Contenu visible sans JS | Deploiement plus complexe |

##### Comparaison visuelle

```
                    CSR (Vue.js)              SSR (Nuxt.js)
                    ─────────────             ─────────────
Serveur             Fichiers statiques        Serveur Node.js
                           │                         │
                           ▼                         ▼
HTML initial        <div id="app"></div>      <div id="app">
                    (vide)                      <h1>Contenu</h1>
                                                <p>Complet</p>
                                              </div>
                           │                         │
                           ▼                         ▼
Google voit         Page vide                 Page complete
                    (puis JS s'execute)       (immediatement)
                           │                         │
                           ▼                         ▼
SEO                 Difficile                 Optimal
```

##### Pourquoi nous avons choisi CSR (Vue.js simple)

| Critere | Notre choix | Raison |
|---------|-------------|--------|
| Simplicite | ✅ CSR | Pas besoin de serveur Node.js en prod |
| Deploiement | ✅ CSR | Fichiers statiques sur n'importe quel hebergeur |
| Cout | ✅ CSR | Hebergement gratuit possible (Netlify, Vercel) |
| SEO | ⚠️ Compromis | Contourne avec `useSeo` composable |

**Notre solution** : Utiliser CSR avec un composable qui met a jour dynamiquement les meta tags. Ce n'est pas aussi bon que SSR pour le SEO, mais c'est suffisant pour notre application.

##### Alternatives SSR pour Vue.js

Si le SEO etait critique (blog, e-commerce), on utiliserait :

| Framework | Description |
|-----------|-------------|
| **Nuxt.js** | Framework SSR pour Vue.js |
| **Vite SSR** | Plugin SSR pour Vite |
| **Quasar SSR** | Mode SSR de Quasar |

```javascript
// Exemple avec Nuxt.js (SSR)
// pages/index.vue
export default {
  head() {
    return {
      title: 'QuizMaster - Accueil',
      meta: [
        { name: 'description', content: '...' }
      ]
    }
  }
}
// → Le serveur genere le HTML avec les meta tags
```

#### 5. Composable `useSeo` pour les meta dynamiques (notre solution CSR)

**Le probleme des SPA (Single Page Application) :**

Vue.js est une SPA en mode CSR : il n'y a qu'un seul fichier HTML charge une fois. Les meta tags ne changent pas quand on navigue entre les pages. Resultat : toutes les pages ont le meme titre dans Google.

**La solution : `useSeo` composable**

J'ai cree un composable Vue qui met a jour dynamiquement les meta tags :

```javascript
// src/composables/useSeo.js

export function useSeo(options = {}) {
  // Mettre a jour le titre
  document.title = options.title

  // Mettre a jour la meta description
  updateMetaTag('name', 'description', options.description)

  // Mettre a jour Open Graph
  updateMetaTag('property', 'og:title', options.title)
  updateMetaTag('property', 'og:description', options.description)

  // Mettre a jour Twitter Card
  updateMetaTag('name', 'twitter:title', options.title)
  updateMetaTag('name', 'twitter:description', options.description)
}

// Presets pour chaque page
export const seoPresets = {
  home: {
    title: 'QuizMaster - Creez et partagez des quiz interactifs',
    description: 'Plateforme gratuite pour creer des quiz educatifs...'
  },
  auth: {
    title: 'Connexion - QuizMaster',
    description: 'Connectez-vous ou creez un compte QuizMaster...'
  },
  dashboard: {
    title: 'Tableau de bord - QuizMaster',
    description: 'Gerez vos quiz, consultez vos resultats...'
  }
  // ...
}
```

**Utilisation dans les vues :**

```javascript
// src/views/HomeView.vue
import { useSeo, seoPresets } from '../composables/useSeo'

// Appele au chargement de la page
useSeo(seoPresets.home)
```

**Resultat :** Chaque page a son propre titre et description.

#### 6. HTML Semantique

Le **HTML semantique** utilise des balises qui decrivent le contenu, pas juste sa presentation.

```html
<!-- AVANT (non semantique) -->
<div class="header">...</div>
<div class="content">...</div>
<div class="footer">...</div>

<!-- APRES (semantique) -->
<header>...</header>
<main>...</main>
<footer>...</footer>
```

**Balises semantiques utilisees :**

| Balise | Role | Pourquoi |
|--------|------|----------|
| `<main>` | Contenu principal | 1 seul par page, aide les lecteurs d'ecran |
| `<section>` | Section thematique | Structure logique du contenu |
| `<article>` | Contenu autonome | Peut etre extrait et reste comprehensible |
| `<nav>` | Navigation | Identifie les menus |
| `<header>` | En-tete | Logo, titre, navigation principale |
| `<footer>` | Pied de page | Liens, copyright |

**Attributs ARIA ajoutes :**

```html
<!-- Lier une section a son titre -->
<section aria-labelledby="features-title">
  <h2 id="features-title">Fonctionnalites</h2>
</section>

<!-- Annoncer les erreurs aux lecteurs d'ecran -->
<p role="alert" v-if="error">{{ error }}</p>

<!-- Cacher les emojis decoratifs -->
<span aria-hidden="true">📝</span>

<!-- Label invisible pour les inputs -->
<label for="email" class="sr-only">Email</label>
<input id="email" type="email" />
```

#### 7. Fichier `robots.txt`

Le fichier `robots.txt` donne des instructions aux robots d'indexation.

```
# robots.txt
User-agent: *        # Tous les robots

Allow: /             # Indexer la page d'accueil
Allow: /auth         # Indexer la page de connexion

Disallow: /dashboard # NE PAS indexer (prive)
Disallow: /play      # NE PAS indexer (necessite code)
Disallow: /payment   # NE PAS indexer (paiement)
Disallow: /api/      # NE PAS indexer (API)

Sitemap: https://quizmaster.app/sitemap.xml
```

**Pourquoi exclure certaines pages ?**

| Page | Raison de l'exclusion |
|------|----------------------|
| `/dashboard` | Contenu prive, necessite authentification |
| `/play` | Necessite un code de quiz |
| `/payment` | Page de paiement, pas utile dans Google |
| `/api/` | Endpoints techniques, pas pour les humains |

#### 8. Fichier `sitemap.xml`

Le **sitemap** liste toutes les pages publiques avec leur importance.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

  <!-- Page d'accueil - Priorite maximale -->
  <url>
    <loc>https://quizmaster.app/</loc>
    <lastmod>2024-01-01</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>

  <!-- Page d'authentification -->
  <url>
    <loc>https://quizmaster.app/auth</loc>
    <lastmod>2024-01-01</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>

</urlset>
```

**Explications des balises :**

| Balise | Valeur | Signification |
|--------|--------|---------------|
| `<loc>` | URL | Adresse de la page |
| `<lastmod>` | Date | Derniere modification |
| `<changefreq>` | weekly | Frequence de mise a jour |
| `<priority>` | 0.0-1.0 | Importance relative |

### Fichiers crees pour le SEO

| Fichier | Emplacement | Role |
|---------|-------------|------|
| `index.html` | `frontend/` | Meta tags statiques |
| `useSeo.js` | `frontend/src/composables/` | Meta tags dynamiques |
| `robots.txt` | `frontend/public/` | Instructions robots |
| `sitemap.xml` | `frontend/public/` | Plan du site |

### Vues modifiees

Chaque vue importe maintenant le composable SEO :

```javascript
// Toutes les vues
import { useSeo, seoPresets } from '../composables/useSeo'
useSeo(seoPresets.nomDeLaPage)
```

| Vue | Titre SEO |
|-----|-----------|
| HomeView | "QuizMaster - Creez et partagez des quiz interactifs" |
| AuthView | "Connexion - QuizMaster" |
| DashboardView | "Tableau de bord - QuizMaster" |
| CreateQuizView | "Creer un quiz - QuizMaster" |
| PlayQuizView | "Jouer - QuizMaster" |
| PaymentView | "Passer Premium - QuizMaster" |

### Outils de verification SEO

Pour verifier que le SEO est bien configure :

| Outil | URL | Ce qu'il verifie |
|-------|-----|------------------|
| Google Search Console | search.google.com/search-console | Indexation, erreurs |
| PageSpeed Insights | pagespeed.web.dev | Performance, SEO |
| Meta Tags Preview | metatags.io | Apercu Open Graph |
| Twitter Card Validator | cards-dev.twitter.com/validator | Apercu Twitter |

---

## 12. Accessibilite (a11y)

### Qu'est-ce que l'accessibilite web ?

L'**accessibilite web** (souvent abregee **a11y** car il y a 11 lettres entre le "a" et le "y" de "accessibility") consiste a rendre les sites web utilisables par tous, y compris les personnes en situation de handicap.

**Les differents types de handicaps concernes :**

| Type de handicap | Exemple | Solution d'accessibilite |
|-----------------|---------|--------------------------|
| Visuel | Aveugles, malvoyants | Lecteurs d'ecran, contraste eleve |
| Moteur | Difficulte a utiliser une souris | Navigation clavier complete |
| Auditif | Sourds, malentendants | Sous-titres, transcriptions |
| Cognitif | Dyslexie, TDAH | Contenu clair, structure logique |

### Pourquoi c'est important ?

| Raison | Impact |
|--------|--------|
| **Ethique** | Tout le monde a droit d'acceder a l'information |
| **Legal** | RGAA en France, WCAG internationalement (obligatoire pour les sites publics) |
| **SEO** | Google favorise les sites accessibles |
| **UX** | Ameliore l'experience pour TOUS les utilisateurs |
| **Business** | 15% de la population mondiale a un handicap |

### Les standards : WCAG 2.1

Les **WCAG** (Web Content Accessibility Guidelines) sont les standards internationaux d'accessibilite. Ils definissent 3 niveaux :

| Niveau | Description | Obligation |
|--------|-------------|------------|
| **A** | Minimum vital | Obligatoire |
| **AA** | Standard recommande | Exige par le RGAA |
| **AAA** | Excellence | Optionnel |

**Les 4 principes WCAG (POUR) :**

1. **Perceptible** : Le contenu doit etre perceptible par tous (texte alternatif, contrastes)
2. **Operable** : L'interface doit etre utilisable (navigation clavier, pas de temps limite)
3. **Understandable** : Le contenu doit etre comprehensible (langage clair, erreurs explicites)
4. **Robust** : Le code doit etre compatible avec les technologies d'assistance

### Ce que nous avons implemente

#### 1. Skip Link (Lien d'evitement)

**Critere WCAG : 2.4.1 - Bypass Blocks (Niveau A)**

Le **skip link** est un lien invisible qui apparait quand on appuie sur Tab. Il permet aux utilisateurs de clavier de sauter directement au contenu principal sans naviguer a travers le menu.

**Pourquoi c'est necessaire ?**

Imaginez un utilisateur aveugle : a chaque changement de page, il devrait ecouter et naviguer a travers TOUT le menu de navigation avant d'atteindre le contenu. Avec 10 liens dans le menu, ca fait 10 pressions sur Tab a chaque page !

**Implementation dans `App.vue` :**

```vue
<template>
  <div class="min-h-screen bg-gray-50">
    <!--
      SKIP LINK : Premier element focusable
      - sr-only : Cache visuellement mais accessible aux lecteurs d'ecran
      - focus:not-sr-only : Apparait quand il recoit le focus
      - Lien vers #main-content
    -->
    <a
      href="#main-content"
      class="sr-only focus:not-sr-only focus:absolute focus:top-0
             focus:left-0 focus:z-50 focus:bg-primary-600 focus:text-white
             focus:px-4 focus:py-2 focus:text-lg focus:font-semibold"
    >
      Aller au contenu principal
    </a>

    <Navbar />

    <!--
      MAIN : Cible du skip link
      - id="main-content" : Correspond au href du skip link
      - tabindex="-1" : Permet de recevoir le focus programmatiquement
    -->
    <main id="main-content" tabindex="-1" class="focus:outline-none">
      <RouterView />
    </main>
  </div>
</template>
```

**Comment le tester ?**
1. Ouvrir l'application dans le navigateur
2. Appuyer sur Tab immediatement
3. Le lien "Aller au contenu principal" apparait en haut a gauche
4. Appuyer sur Entree pour sauter au contenu

#### 2. Focus Visible (Indicateur de focus)

**Critere WCAG : 2.4.7 - Focus Visible (Niveau AA)**

Les utilisateurs de clavier doivent TOUJOURS voir quel element est selectionne. C'est l'equivalent visuel du survol de souris.

**Pourquoi c'est critique ?**

Sans indicateur de focus visible, un utilisateur de clavier ne sait pas ou il se trouve dans la page. C'est comme naviguer a l'aveugle.

**Configuration Tailwind (`tailwind.config.js`) :**

```javascript
export default {
  theme: {
    extend: {
      // Ring de focus plus visible
      ringWidth: {
        DEFAULT: '3px'  // Plus epais que les 2px par defaut
      },
      ringOffsetWidth: {
        DEFAULT: '2px'  // Espace entre l'element et le ring
      }
    }
  }
}
```

**Classes Tailwind utilisees :**

```html
<!-- Bouton avec focus visible -->
<button class="focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:outline-none">
  Cliquer
</button>

<!-- Input avec focus visible -->
<input class="focus:ring-2 focus:ring-primary-500 focus:outline-none" />
```

**Resultat visuel :**

```
┌──────────────────────┐
│      [Bouton]        │  ← Etat normal
└──────────────────────┘

┌──────────────────────┐
│  ┌──[Bouton]───┐     │  ← Etat focus : anneau bleu de 3px
│  │             │     │
│  └─────────────┘     │
└──────────────────────┘
```

#### 3. Labels accessibles pour les formulaires

**Critere WCAG : 1.3.1 - Info and Relationships (Niveau A)**
**Critere WCAG : 3.3.2 - Labels or Instructions (Niveau A)**

Chaque champ de formulaire doit etre associe a un label qui decrit sa fonction.

**Pourquoi c'est important ?**

Un lecteur d'ecran annonce le label quand l'utilisateur arrive sur un champ. Sans label, il dit juste "champ de texte" ce qui n'aide pas.

**Implementation dans `AuthView.vue` :**

```vue
<template>
  <form aria-label="Formulaire d'authentification">
    <!--
      CHAMP EMAIL : Liaison label-input via for/id
      - for="auth-email" correspond a id="auth-email"
      - aria-describedby pointe vers l'id du message d'erreur
      - aria-invalid indique si le champ est en erreur
    -->
    <div>
      <label for="auth-email" class="block text-sm font-medium">
        Email
      </label>
      <input
        id="auth-email"
        v-model="email"
        type="email"
        autocomplete="email"
        :aria-describedby="emailError ? 'email-error' : undefined"
        :aria-invalid="!!emailError"
      />
      <p
        v-if="emailError"
        id="email-error"
        role="alert"
        class="error-text"
      >
        {{ emailError }}
      </p>
    </div>

    <!--
      GROUPE RADIO : Utiliser fieldset/legend
      - fieldset groupe semantiquement les radios
      - legend donne un titre au groupe
    -->
    <fieldset>
      <legend>Je suis</legend>
      <div role="radiogroup">
        <label for="role-eleve">
          <input id="role-eleve" type="radio" name="role" value="eleve" />
          Eleve
        </label>
        <label for="role-prof">
          <input id="role-prof" type="radio" name="role" value="prof" />
          Professeur
        </label>
      </div>
    </fieldset>
  </form>
</template>
```

**Attributs ARIA utilises :**

| Attribut | Role | Exemple |
|----------|------|---------|
| `aria-label` | Label invisible | `aria-label="Fermer"` |
| `aria-labelledby` | Reference un element visible | `aria-labelledby="title-id"` |
| `aria-describedby` | Description supplementaire | `aria-describedby="error-id"` |
| `aria-invalid` | Indique une erreur | `aria-invalid="true"` |

#### 4. Navigation clavier complete

**Critere WCAG : 2.1.1 - Keyboard (Niveau A)**

Toutes les fonctionnalites doivent etre utilisables au clavier, sans souris.

**Raccourcis implementes dans `QuestionDisplay.vue` :**

```vue
<template>
  <div class="space-y-3" role="radiogroup">
    <button
      v-for="(option, index) in options"
      :key="index"
      type="button"
      role="radio"
      :aria-checked="selectedAnswer === option"
      @click="selectedAnswer = option"
      @keydown.1="options[0] && (selectedAnswer = options[0])"
      @keydown.2="options[1] && (selectedAnswer = options[1])"
      @keydown.3="options[2] && (selectedAnswer = options[2])"
      @keydown.4="options[3] && (selectedAnswer = options[3])"
      @keydown.a="options[0] && (selectedAnswer = options[0])"
      @keydown.b="options[1] && (selectedAnswer = options[1])"
      @keydown.c="options[2] && (selectedAnswer = options[2])"
      @keydown.d="options[3] && (selectedAnswer = options[3])"
    >
      {{ String.fromCharCode(65 + index) }}. {{ option }}
    </button>
  </div>
</template>
```

**Touches disponibles :**

| Touche | Action |
|--------|--------|
| Tab | Naviguer entre les elements |
| Entree | Activer un bouton/lien |
| Espace | Cocher une case, activer un bouton |
| 1, 2, 3, 4 | Selectionner option 1, 2, 3 ou 4 |
| A, B, C, D | Selectionner option A, B, C ou D |
| Echap | Fermer une modale |

#### 5. ARIA Live Regions (Annonces dynamiques)

**Critere WCAG : 4.1.3 - Status Messages (Niveau AA)**

Les contenus qui changent dynamiquement doivent etre annonces aux lecteurs d'ecran.

**Les valeurs de `aria-live` :**

| Valeur | Comportement | Usage |
|--------|--------------|-------|
| `off` | Pas d'annonce | Par defaut |
| `polite` | Annonce quand l'utilisateur est inactif | Mises a jour non urgentes |
| `assertive` | Interrompt immediatement | Erreurs, alertes critiques |

**Implementation dans les composants :**

```vue
<!-- Message d'erreur : annonce immediate -->
<p v-if="error" role="alert" aria-live="assertive">
  {{ error }}
</p>

<!-- Changement de question : annonce polie -->
<h2 aria-live="polite">
  {{ question.question_text }}
</h2>

<!-- Score final : annonce du resultat -->
<div role="status" aria-live="polite">
  <span class="sr-only">
    Vous avez obtenu {{ score }} bonnes reponses sur {{ total }}
  </span>
</div>
```

**Le role="alert" :**

C'est equivalent a `aria-live="assertive"` + `aria-atomic="true"`. Ideal pour les messages d'erreur qui doivent etre annonces immediatement.

#### 6. Barre de progression accessible

**Critere WCAG : 1.3.1 - Info and Relationships (Niveau A)**

Les barres de progression doivent indiquer leur valeur aux technologies d'assistance.

**Implementation dans `QuestionDisplay.vue` :**

```vue
<div
  role="progressbar"
  :aria-valuenow="questionNumber"
  :aria-valuemin="1"
  :aria-valuemax="totalQuestions"
  :aria-label="`Progression : question ${questionNumber} sur ${totalQuestions}`"
>
  <div
    class="bg-primary-600 h-2 rounded-full"
    :style="{ width: `${(questionNumber / totalQuestions) * 100}%` }"
    aria-hidden="true"
  ></div>
</div>
```

**Attributs ARIA pour progressbar :**

| Attribut | Role | Valeur |
|----------|------|--------|
| `role="progressbar"` | Identifie comme barre de progression | - |
| `aria-valuenow` | Valeur actuelle | 3 |
| `aria-valuemin` | Valeur minimum | 1 |
| `aria-valuemax` | Valeur maximum | 10 |
| `aria-label` | Description | "Question 3 sur 10" |

#### 7. Elements decoratifs caches

**Critere WCAG : 1.1.1 - Non-text Content (Niveau A)**

Les elements purement decoratifs (emojis, icones) doivent etre caches des lecteurs d'ecran.

**Implementation dans `ScoreDisplay.vue` :**

```vue
<!-- Emoji decoratif : cache aux lecteurs d'ecran -->
<div aria-hidden="true">🏆</div>

<!-- Score affiche visuellement -->
<div aria-hidden="true">8 / 10</div>
<div aria-hidden="true">80% de reussite</div>

<!-- Version pour lecteurs d'ecran -->
<span class="sr-only">
  Vous avez obtenu 8 bonnes reponses sur 10 questions,
  soit 80 pourcent de reussite.
</span>
```

**La classe `sr-only` (Screen Reader Only) :**

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}
```

Cette classe cache visuellement l'element tout en le gardant accessible aux lecteurs d'ecran. L'inverse de `aria-hidden="true"`.

### Fichiers modifies pour l'accessibilite

| Fichier | Modifications |
|---------|---------------|
| `App.vue` | Skip link, id sur main |
| `tailwind.config.js` | Ring de focus personnalise |
| `AuthView.vue` | Labels, fieldset, aria-invalid |
| `CreateQuizView.vue` | Labels, aria-describedby |
| `QuestionForm.vue` | Labels, fieldset, role="radiogroup" |
| `QuestionDisplay.vue` | Navigation clavier, progressbar, aria-live |
| `ScoreDisplay.vue` | role="status", sr-only, aria-hidden |
| `HomeView.vue` | HTML semantique, ARIA labelledby |

### Comment tester l'accessibilite ?

#### 1. Tests clavier

1. Debrancher la souris
2. Utiliser uniquement Tab, Entree, Espace, fleches
3. Verifier que TOUT est accessible

**Checklist clavier :**

- [ ] Skip link apparait au premier Tab
- [ ] Tous les liens/boutons sont focusables
- [ ] L'ordre de focus est logique
- [ ] Le focus est toujours visible
- [ ] Les formulaires sont remplissables

#### 2. Tests avec lecteur d'ecran

| Outil | Plateforme | Gratuit |
|-------|------------|---------|
| NVDA | Windows | Oui |
| VoiceOver | Mac/iOS | Integre |
| TalkBack | Android | Integre |

**Commandes NVDA basiques :**

| Touche | Action |
|--------|--------|
| Ctrl | Arreter la lecture |
| H | Titre suivant |
| F | Formulaire suivant |
| Tab | Element focusable suivant |

#### 3. Outils automatiques

| Outil | Type | Ce qu'il detecte |
|-------|------|------------------|
| axe DevTools | Extension Chrome | Problemes WCAG |
| WAVE | Extension Chrome | Erreurs visuelles |
| Lighthouse | Chrome DevTools | Score accessibilite |
| eslint-plugin-jsx-a11y | ESLint | Erreurs dans le code |

**Exemple avec Lighthouse :**

1. Ouvrir Chrome DevTools (F12)
2. Onglet "Lighthouse"
3. Cocher "Accessibility"
4. Cliquer "Analyze page load"
5. Voir le score et les recommandations

#### 4. Tests de contraste

Les contrastes de couleur doivent respecter ces ratios minimums :

| Type de texte | Ratio minimum | Niveau WCAG |
|---------------|---------------|-------------|
| Texte normal | 4.5:1 | AA |
| Grand texte (18px+) | 3:1 | AA |
| Elements graphiques | 3:1 | AA |

**Outils de verification :**

- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Colour Contrast Analyser](https://www.tpgi.com/color-contrast-checker/)

### Resume des criteres WCAG implementes

| Critere | Niveau | Description | Implementation |
|---------|--------|-------------|----------------|
| 1.1.1 | A | Alternatives textuelles | aria-hidden sur decoratif |
| 1.3.1 | A | Information et relations | Labels, fieldset, ARIA |
| 2.1.1 | A | Clavier | Navigation complete |
| 2.4.1 | A | Bypass blocks | Skip link |
| 2.4.7 | AA | Focus visible | Ring personnalise |
| 3.3.2 | A | Labels ou instructions | for/id, aria-label |
| 4.1.3 | AA | Messages de statut | aria-live, role="alert" |

### Ressources pour approfondir

| Ressource | URL | Description |
|-----------|-----|-------------|
| WCAG 2.1 | w3.org/WAI/WCAG21/quickref | Reference officielle |
| MDN Accessibility | developer.mozilla.org/en-US/docs/Web/Accessibility | Guide Mozilla |
| A11Y Project | a11yproject.com | Checklist et articles |
| WebAIM | webaim.org | Articles et outils |
| RGAA | accessibilite.numerique.gouv.fr | Standard francais |

---

## 13. Installation et lancement

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

## 14. Administration

### Fonctionnalites admin

Le systeme d'administration permet de :

- **Dashboard** : statistiques globales (utilisateurs, quiz, parties, revenus)
- **Gestion des utilisateurs** : liste, recherche, modification, suppression
- **Logs systeme** : suivi de toutes les actions avec date, heure, IP, utilisateur

### Creation d'un compte admin

```bash
cd backend
node scripts/create-admin.js admin@quizmaster.com MotDePasseSecure123!
```

Ou via la migration SQL :
```sql
-- Executer d'abord backend/database/migration_admin.sql
-- Puis creer l'admin manuellement avec bcrypt
```

### Endpoints API Admin

| Methode | Endpoint | Description |
|---------|----------|-------------|
| GET | /api/admin/dashboard | Statistiques du dashboard |
| GET | /api/admin/users | Liste des utilisateurs (pagination, filtres) |
| POST | /api/admin/users | Creer un utilisateur |
| GET | /api/admin/users/:id | Details d'un utilisateur |
| PUT | /api/admin/users/:id | Modifier un utilisateur |
| DELETE | /api/admin/users/:id | Supprimer un utilisateur |
| GET | /api/admin/logs | Liste des logs (pagination, filtres) |
| GET | /api/admin/logs/stats | Statistiques des logs |

### Structure du systeme de logs

Chaque action importante est enregistree dans la table `logs` :

```sql
CREATE TABLE logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,                    -- Utilisateur qui a fait l'action
    action VARCHAR(100) NOT NULL,        -- Type d'action (LOGIN, QUIZ_CREATED, etc.)
    target_type VARCHAR(50) NULL,        -- Type d'entite concernee (user, quiz, etc.)
    target_id INT NULL,                  -- ID de l'entite concernee
    details JSON NULL,                   -- Informations supplementaires
    ip_address VARCHAR(45) NULL,         -- Adresse IP du client
    user_agent TEXT NULL,                -- Navigateur/client utilise
    created_at TIMESTAMP DEFAULT NOW()
);
```

### Actions loguees

| Action | Description |
|--------|-------------|
| LOGIN | Connexion reussie |
| LOGIN_FAILED | Tentative de connexion echouee |
| REGISTER | Inscription d'un nouvel utilisateur |
| QUIZ_CREATED | Creation d'un quiz |
| QUIZ_DELETED | Suppression d'un quiz |
| USER_CREATED | Creation d'un utilisateur (par admin) |
| USER_UPDATED | Modification d'un utilisateur |
| USER_DELETED | Suppression d'un utilisateur |
| USER_ROLE_CHANGED | Changement de role |
| USER_PREMIUM_GRANTED | Attribution du statut premium |
| USER_DEACTIVATED | Desactivation d'un compte |
| PAYMENT_COMPLETED | Paiement reussi |

### Securite admin

- Middleware `requireAdmin` : verifie que l'utilisateur est authentifie et a le role `admin`
- Un admin ne peut pas supprimer son propre compte
- Un admin ne peut pas retirer son propre role admin
- Toutes les actions admin sont loguees

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
- ✅ Tests frontend (149 tests avec Vitest + Vue Test Utils)
- ✅ SEO complet (meta tags, Open Graph, sitemap, robots.txt)
- ✅ HTML semantique et ARIA

### Accessibilite (a11y)
- ✅ Skip link (lien d'evitement)
- ✅ Focus visible sur tous les elements interactifs
- ✅ Labels accessibles sur tous les formulaires
- ✅ Navigation clavier complete (Tab, Entree, raccourcis 1-4/A-D)
- ✅ ARIA live regions (annonces dynamiques)
- ✅ Barres de progression accessibles (role="progressbar")
- ✅ Elements decoratifs caches (aria-hidden)
- ✅ Criteres WCAG 2.1 niveau A et AA implementes

### Industrialisation
- ✅ ESLint pour la qualite du code (backend + frontend)
- ✅ Prettier pour le formatage automatique
- ✅ EditorConfig pour la coherence entre editeurs
- ✅ GitHub Actions CI/CD (lint, format, tests, build)

### Administration
- ✅ Dashboard admin avec statistiques
- ✅ Gestion complete des utilisateurs (CRUD)
- ✅ Systeme de logs avec date/heure/IP
- ✅ Role admin avec middleware de protection

### Points d'amelioration possibles
- Rate limiting pour la securite
- Tests automatises d'accessibilite (axe-core)
- Notifications email
