# Rappel - Concepts Cles QuizMaster

## Table des matieres

1. [Architecture Globale](#architecture-globale)
2. [Backend Express.js](#backend-expressjs)
3. [Frontend Vue.js](#frontend-vuejs)
4. [Securite](#securite)
5. [Base de Donnees](#base-de-donnees)
6. [SEO et Accessibilite](#seo-et-accessibilite)
7. [Industrialisation](#industrialisation)
8. [Fichiers Cles](#fichiers-cles)

---

# Architecture Globale

```
┌─────────────────────────────────────────────────────────────────┐
│                        ARCHITECTURE                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   FRONTEND (Vue.js)          BACKEND (Express)        DATABASE   │
│   localhost:5173             localhost:3000           MySQL      │
│                                                                  │
│   ┌──────────┐              ┌──────────────┐        ┌────────┐  │
│   │  Vue.js  │  ─── API ──> │   Express    │ ─────> │  MySQL │  │
│   │  Pinia   │  <── JSON ── │   REST API   │ <───── │        │  │
│   │  Router  │              │   JWT Auth   │        │ 6 tables│  │
│   └──────────┘              └──────────────┘        └────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Flux d'une requete

```
1. User clique sur "Creer Quiz"
2. Vue Component appelle store.createQuiz()
3. Store appelle api.post('/api/quizzes')
4. Axios ajoute le header Authorization: Bearer TOKEN
5. Express recoit la requete
6. Middleware authenticateToken verifie le JWT
7. Middleware requireProf verifie le role
8. Controller createQuiz execute la logique
9. MySQL execute INSERT INTO quizzes
10. Response JSON retourne au frontend
11. Store met a jour son state
12. Vue re-rend le composant
```

---

# Backend Express.js

## Structure des dossiers

```
backend/
├── server.js           # Point d'entree
├── config/
│   ├── database.js     # Connexion MySQL (pool)
│   └── stripe.js       # Config Stripe
├── routes/
│   ├── auth.routes.js  # /api/auth/*
│   ├── quiz.routes.js  # /api/quizzes/*
│   └── ...
├── controllers/        # Logique metier
├── middlewares/
│   ├── auth.middleware.js    # Verifie JWT
│   └── role.middleware.js    # Verifie role
├── validators/         # Validation des donnees
└── utils/
    └── responses.js    # Format reponses standard
```

## Chaine de middlewares

```javascript
router.post('/quizzes',
  authenticateToken,   // 1. Verifie token JWT → 401 si invalide
  requireProf,         // 2. Verifie role prof → 403 si eleve
  validateQuiz,        // 3. Valide les donnees → 400 si invalide
  quizController.create // 4. Execute la logique
)
```

## Format reponses API

```javascript
// SUCCES
{
  "success": true,
  "data": { "id": 1, "title": "Mon Quiz" }
}

// ERREUR
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Le titre doit faire 5-100 caracteres",
    "field": "title"
  }
}
```

## Codes HTTP importants

| Code | Signification | Quand l'utiliser |
|------|---------------|------------------|
| 200 | OK | GET, PUT reussi |
| 201 | Created | POST reussi (creation) |
| 400 | Bad Request | Validation echouee |
| 401 | Unauthorized | Token manquant/invalide |
| 403 | Forbidden | Pas le bon role/droits |
| 404 | Not Found | Ressource inexistante |
| 409 | Conflict | Email deja utilise |
| 500 | Server Error | Bug serveur |

---

# Frontend Vue.js

## Structure des dossiers

```
frontend/src/
├── main.js             # Point d'entree
├── App.vue             # Composant racine
├── router/
│   └── index.js        # Routes + guards
├── stores/
│   ├── auth.js         # State authentification
│   └── quiz.js         # State quiz/questions
├── services/
│   └── api.js          # Config Axios + intercepteurs
├── views/              # Pages (routes)
├── components/         # Composants reutilisables
├── composables/        # Logique reutilisable
│   └── useSeo.js       # SEO dynamique
└── utils/
    └── validators.js   # Fonctions validation
```

## Composition API - Syntaxe

```vue
<script setup>
import { ref, computed, onMounted } from 'vue'

// STATE REACTIF
const count = ref(0)           // Primitif → .value obligatoire
const user = ref(null)         // Objet aussi en ref

// COMPUTED (valeur calculee)
const doubled = computed(() => count.value * 2)

// METHODES
function increment() {
  count.value++
}

// LIFECYCLE
onMounted(() => {
  console.log('Composant monte')
})
</script>

<template>
  <div>
    <p>{{ count }}</p>           <!-- Pas de .value dans template -->
    <p>{{ doubled }}</p>
    <button @click="increment">+1</button>
  </div>
</template>
```

## Pinia Store

```javascript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  // STATE
  const token = ref(localStorage.getItem('token'))
  const user = ref(null)

  // GETTERS
  const isAuthenticated = computed(() => !!token.value)
  const isProf = computed(() => user.value?.role === 'prof')

  // ACTIONS
  async function login(email, password) {
    const response = await api.post('/auth/login', { email, password })
    token.value = response.data.data.token
    user.value = response.data.data.user
    localStorage.setItem('token', token.value)
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
  }

  return { token, user, isAuthenticated, isProf, login, logout }
})
```

## Router Guards

```javascript
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  // Route protegee ?
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return next('/auth')
  }

  // Role specifique ?
  if (to.meta.role && to.meta.role !== authStore.user?.role) {
    return next('/dashboard')
  }

  next()
})
```

## Axios Intercepteurs

```javascript
// Ajoute le token a chaque requete
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Gere les erreurs 401
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
```

---

# Securite

## JWT (JSON Web Token)

```
Structure: HEADER.PAYLOAD.SIGNATURE
eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjF9.signature
```

**Creation (login):**
```javascript
const token = jwt.sign(
  { userId: user.id, role: user.role },  // Payload
  process.env.JWT_SECRET,                 // Secret
  { expiresIn: '7d' }                    // Expiration
)
```

**Verification (middleware):**
```javascript
const decoded = jwt.verify(token, process.env.JWT_SECRET)
// decoded = { userId: 1, role: 'prof', iat: ..., exp: ... }
```

## bcrypt (hashage mot de passe)

```javascript
// HASHAGE (inscription)
const hash = await bcrypt.hash(password, 10)
// "Password123" → "$2b$10$N9qo8uLOickgx2ZMRZoMy..."

// VERIFICATION (connexion)
const isValid = await bcrypt.compare(password, hash)
// true ou false
```

**Pourquoi bcrypt ?**
- Salt automatique (hash different meme pour meme password)
- Lent (10 rounds ≈ 100ms) → brute-force impossible
- Irreversible

## Helmet (headers securite)

```javascript
app.use(helmet())
// Ajoute automatiquement:
// X-Content-Type-Options: nosniff
// X-Frame-Options: DENY
// Strict-Transport-Security: ...
```

## CORS

```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL,  // http://localhost:5173
  credentials: true
}))
```

---

# Base de Donnees

## Schema relationnel

```
users (id, email, password, role, is_premium, created_at)
  │
  ├──< quizzes (id, user_id, title, access_code, created_at)
  │       │
  │       ├──< questions (id, quiz_id, type, question_text, options, correct_answer)
  │       │
  │       └──< results (id, user_id, quiz_id, score, played_at)
  │               │
  │               └──< answers (id, result_id, question_id, user_answer, is_correct)
  │
  └──< payments (id, user_id, stripe_session_id, amount, status, created_at)
```

## Relations

| Relation | Type | Explication |
|----------|------|-------------|
| users → quizzes | 1:N | Un prof a plusieurs quiz |
| quizzes → questions | 1:N | Un quiz a plusieurs questions |
| quizzes → results | 1:N | Un quiz peut etre joue plusieurs fois |
| users → results | 1:N | Un eleve a plusieurs resultats |
| results → answers | 1:N | Un resultat a plusieurs reponses |

## CASCADE

```sql
ON DELETE CASCADE
-- Si on supprime un quiz:
-- → Ses questions sont supprimees
-- → Ses resultats sont supprimes
-- → Les reponses de ces resultats sont supprimees
```

---

# SEO et Accessibilite

## SEO - Meta tags essentiels

```html
<!-- Titre (50-60 caracteres) -->
<title>QuizMaster - Creez des quiz interactifs</title>

<!-- Description (150-160 caracteres) -->
<meta name="description" content="Plateforme gratuite..." />

<!-- Open Graph (Facebook, LinkedIn) -->
<meta property="og:title" content="QuizMaster" />
<meta property="og:description" content="..." />
<meta property="og:image" content="https://..." />

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
```

## Composable useSeo

```javascript
export function useSeo(options) {
  document.title = options.title
  updateMetaTag('name', 'description', options.description)
  updateMetaTag('property', 'og:title', options.title)
}

// Utilisation
useSeo(seoPresets.home)
```

## Accessibilite - Elements cles

| Element | Critere WCAG | Implementation |
|---------|--------------|----------------|
| Skip link | 2.4.1 (A) | `<a href="#main-content" class="sr-only focus:not-sr-only">` |
| Focus visible | 2.4.7 (AA) | `focus:ring-2 focus:ring-primary-500` |
| Labels | 1.3.1 (A) | `<label for="email">` + `<input id="email">` |
| ARIA live | 4.1.3 (AA) | `<p role="alert" aria-live="assertive">` |
| Progressbar | 1.3.1 (A) | `role="progressbar" aria-valuenow="3"` |

## Classes utilitaires

```html
<!-- Cache visuellement, visible lecteur d'ecran -->
<span class="sr-only">Description pour lecteur d'ecran</span>

<!-- Visible seulement au focus clavier -->
<a class="sr-only focus:not-sr-only">Skip to content</a>

<!-- Cache aux lecteurs d'ecran (decoratif) -->
<span aria-hidden="true">🏆</span>
```

---

# Industrialisation

## ESLint (qualite code)

```json
// .eslintrc.json
{
  "rules": {
    "no-unused-vars": "warn",      // Variable non utilisee
    "no-console": "warn",          // console.log
    "eqeqeq": "error"              // === obligatoire
  }
}
```

**Commandes:**
```bash
npm run lint        # Verifier
npm run lint:fix    # Corriger auto
```

## Prettier (formatage)

```json
// .prettierrc
{
  "semi": false,           // Pas de ;
  "singleQuote": true,     // 'quote' pas "quote"
  "tabWidth": 2            // 2 espaces
}
```

**Commandes:**
```bash
npm run format        # Formater
npm run format:check  # Verifier
```

## GitHub Actions CI/CD

```yaml
# Declencheur
on: push, pull_request

# Jobs paralleles
jobs:
  backend:
    steps:
      - npm ci           # Install
      - npm run lint     # ESLint
      - npm run format:check  # Prettier
      - npm test         # Tests

  frontend:
    steps:
      - npm ci
      - npm run lint
      - npm run format:check
      - npm test
      - npm run build    # Build prod
```

---

# Fichiers Cles

## Backend

| Fichier | Role |
|---------|------|
| `server.js` | Point d'entree, config Express |
| `config/database.js` | Pool MySQL |
| `middlewares/auth.middleware.js` | Verification JWT |
| `controllers/auth.controller.js` | Login, register, getMe |
| `controllers/quiz.controller.js` | CRUD quiz |
| `routes/*.js` | Definition des endpoints |

## Frontend

| Fichier | Role |
|---------|------|
| `main.js` | Point d'entree, init Pinia/Router |
| `App.vue` | Layout principal, skip link |
| `router/index.js` | Routes + guards |
| `stores/auth.js` | State auth, login/logout |
| `stores/quiz.js` | State quiz, questions, results |
| `services/api.js` | Config Axios, intercepteurs |
| `composables/useSeo.js` | SEO dynamique |

## Config

| Fichier | Role |
|---------|------|
| `.env` | Variables d'environnement (secrets) |
| `.eslintrc.json` | Regles ESLint |
| `.prettierrc` | Config formatage |
| `tailwind.config.js` | Config Tailwind + focus |
| `.github/workflows/ci.yml` | Pipeline CI/CD |

---

# Commandes Utiles

## Backend
```bash
cd backend
npm start        # Production
npm run dev      # Dev (nodemon)
npm test         # Tests (50)
npm run lint     # ESLint
npm run format   # Prettier
```

## Frontend
```bash
cd frontend
npm run dev      # Dev server :5173
npm run build    # Build prod
npm test         # Tests (149)
npm run lint     # ESLint
npm run format   # Prettier
```

---

# Chiffres Cles a Retenir

| Element | Valeur |
|---------|--------|
| Tests backend | 50 |
| Tests frontend | 149 |
| Tests total | **178** |
| Tables MySQL | 6 |
| Endpoints API | ~20 |
| Composants Vue | 5 |
| Vues (pages) | 7 |
| Lignes documentation | ~2900 |
