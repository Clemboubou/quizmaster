# Guide Debutant - QuizMaster

Ce guide explique les concepts de base utilises dans le projet QuizMaster.

---

## Sommaire

1. [Les Blocs de Competences](#les-blocs-de-competences)
2. [JavaScript - Les bases](#javascript---les-bases)
3. [Node.js et Express](#nodejs-et-express)
4. [API REST](#api-rest)
5. [Base de donnees MySQL](#base-de-donnees-mysql)
6. [JWT - Authentification](#jwt---authentification)
7. [Vue.js - Le frontend](#vuejs---le-frontend)
8. [Pinia - Gestion d'etat](#pinia---gestion-detat)
9. [CI/CD et outils](#cicd-et-outils)

---

# Les Blocs de Competences

## C'est quoi les "Blocs" ?

Le titre RNCP de **Developpeur Web Fullstack** est divise en **3 blocs de competences**. Chaque bloc represente un domaine de competences que tu dois maitriser.

```
┌─────────────────────────────────────────────────────────────┐
│                    TITRE RNCP                               │
│              Developpeur Web Fullstack                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│   │   BLOC 1    │  │   BLOC 2    │  │   BLOC 3    │        │
│   │  Analyser   │  │  Frontend   │  │  Backend    │        │
│   │  Concevoir  │  │  (Vue.js)   │  │  (Node.js)  │        │
│   └─────────────┘  └─────────────┘  └─────────────┘        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Bloc 1 - Analyser et Concevoir

**En resume :** Tout ce qu'on fait AVANT de coder.

### Ce que ca couvre :

| Element | C'est quoi ? |
|---------|--------------|
| **Cahier des charges** | Liste de ce que l'application doit faire |
| **UML** | Dessins pour expliquer le fonctionnement |
| **MCD/MLD** | Schema de la base de donnees |
| **Architecture** | Comment les pieces s'assemblent |
| **RGPD** | Protection des donnees personnelles |

### Exemples dans QuizMaster :

```
- "Un prof peut creer des quiz" → Exigence fonctionnelle
- Diagramme de cas d'utilisation → Qui fait quoi
- Schema users → quizzes → questions → MCD
- Vue.js + Express + MySQL → Architecture 3-tiers
```

### Outils de modelisation :

**Bete a cornes** = Repond a 3 questions sur le produit :
```
┌─────────────────────────┐
│ A qui ca sert ?         │  → Profs, Eleves, Admins
│ Sur quoi ca agit ?      │  → Les evaluations (quiz)
│ Dans quel but ?         │  → Digitaliser les evaluations
└─────────────────────────┘
```

**Diagramme pieuvre** = Montre les interactions avec l'exterieur :
```
Eleve ←→ QuizMaster ←→ Base de donnees
              ↕
           Stripe (paiement)
```

**SMART** = Objectifs bien definis :
- **S**pecifique : "Creer des quiz QCM"
- **M**esurable : "Maximum 20 quiz en premium"
- **A**tteignable : Technologies maitrisees
- **R**ealiste : Fonctionnalites standards
- **T**emporel : Livraison pour la certification

---

## Bloc 2 - Developper le Frontend

**En resume :** Tout ce que l'utilisateur VOIT et avec quoi il interagit.

### Ce que ca couvre :

| Element | C'est quoi ? |
|---------|--------------|
| **HTML/CSS** | Structure et style des pages |
| **JavaScript** | Logique et interactivite |
| **Vue.js** | Framework pour creer l'interface |
| **Responsive** | S'adapte a tous les ecrans |
| **Accessibilite** | Utilisable par tous (handicap) |
| **SEO** | Visible sur Google |

### Dans QuizMaster :

```
frontend/
├── views/          ← Les pages (Home, Dashboard, Quiz...)
├── components/     ← Morceaux reutilisables (Navbar, QuizCard...)
├── stores/         ← Donnees partagees (Pinia)
├── services/       ← Communication avec l'API
└── composables/    ← Logique reutilisable (useSeo)
```

### Technologies utilisees :

| Techno | Role |
|--------|------|
| **Vue.js 3** | Framework principal |
| **Pinia** | Gestion d'etat (donnees partagees) |
| **Vue Router** | Navigation entre pages |
| **Tailwind CSS** | Styles CSS utilitaires |
| **Axios** | Requetes vers l'API |

### Accessibilite (WCAG) :

```html
<!-- Skip link : sauter au contenu -->
<a href="#main" class="sr-only">Aller au contenu</a>

<!-- Labels accessibles -->
<label for="email">Email</label>
<input id="email" type="email" />

<!-- Annonces pour lecteurs d'ecran -->
<p aria-live="polite">Quiz sauvegarde !</p>
```

---

## Bloc 3 - Developper le Backend

**En resume :** Tout ce qui se passe cote SERVEUR (invisible pour l'utilisateur).

### Ce que ca couvre :

| Element | C'est quoi ? |
|---------|--------------|
| **API REST** | Points d'entree pour le frontend |
| **Base de donnees** | Stockage des donnees (MySQL) |
| **Authentification** | Connexion securisee (JWT) |
| **Securite** | Protection contre les attaques |
| **Tests** | Verification du fonctionnement |

### Dans QuizMaster :

```
backend/
├── routes/         ← Definition des endpoints
├── controllers/    ← Logique metier
├── middlewares/    ← Fonctions intermediaires (auth, validation)
├── validators/     ← Verification des donnees
├── config/         ← Configuration (DB, JWT...)
└── tests/          ← Tests automatises
```

### Architecture d'une requete :

```
Requete du frontend
        ↓
   [ Routes ]         → Quel endpoint ?
        ↓
   [ Middlewares ]    → Token valide ? Role autorise ?
        ↓
   [ Controller ]     → Logique metier
        ↓
   [ Database ]       → Lecture/ecriture MySQL
        ↓
   Reponse JSON
```

### Securite implementee :

| Mesure | Pourquoi |
|--------|----------|
| **bcrypt** | Hash les mots de passe |
| **JWT** | Authentification sans session |
| **Helmet** | Headers de securite HTTP |
| **Requetes preparees** | Empeche injection SQL |
| **CORS** | Controle qui peut appeler l'API |

---

## Resume des 3 Blocs

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  BLOC 1          BLOC 2              BLOC 3                 │
│  Concevoir  →    Afficher       →    Traiter                │
│                                                             │
│  ┌─────────┐    ┌───────────┐       ┌───────────┐          │
│  │ Cahier  │    │  Vue.js   │       │  Express  │          │
│  │ des     │───►│  Pinia    │◄─────►│  MySQL    │          │
│  │ charges │    │  Tailwind │  API  │  JWT      │          │
│  │ UML     │    │           │       │           │          │
│  └─────────┘    └───────────┘       └───────────┘          │
│                                                             │
│  "Quoi faire"   "Comment         "Comment                   │
│                  l'afficher"      le traiter"               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Documents par bloc :

| Bloc | Documents |
|------|-----------|
| **Bloc 1** | Bloc1.md, DOCUMENTATION.md (architecture) |
| **Bloc 2** | Code frontend/, composables, tests composants |
| **Bloc 3** | Code backend/, API, tests API, QuestRep.md |

---

# JavaScript - Les bases

## Variables

```javascript
// const = valeur qui ne change jamais
const nom = 'QuizMaster'

// let = valeur qui peut changer
let score = 0
score = 10  // OK

// Erreur : on ne peut pas reassigner const
const age = 25
age = 26  // ERREUR!
```

## Fonctions

```javascript
// Fonction classique
function direBonjour(prenom) {
    return 'Bonjour ' + prenom
}

// Fonction flechee (arrow function) - meme chose, plus court
const direBonjour = (prenom) => {
    return 'Bonjour ' + prenom
}

// Version ultra-courte si une seule ligne
const direBonjour = (prenom) => 'Bonjour ' + prenom
```

## Objets

```javascript
// Un objet = une "fiche" avec des proprietes
const utilisateur = {
    email: 'jean@test.com',
    age: 25,
    role: 'prof'
}

// Acceder aux proprietes
utilisateur.email      // 'jean@test.com'
utilisateur['age']     // 25
```

## Tableaux

```javascript
// Un tableau = une liste
const fruits = ['pomme', 'banane', 'orange']

fruits[0]         // 'pomme' (premier element)
fruits.length     // 3 (nombre d'elements)
fruits.push('kiwi')  // Ajouter a la fin
```

## async/await

```javascript
// Quand une operation prend du temps (requete API, lecture fichier)
// on utilise async/await pour "attendre" le resultat

async function recupererQuiz() {
    // await = "attends que ca finisse"
    const reponse = await fetch('/api/quizzes')
    const data = await reponse.json()
    return data
}
```

**Sans await**, le code continuerait sans attendre la reponse.

---

# Node.js et Express

## Node.js

**Node.js** = Permet d'executer du JavaScript hors du navigateur (sur un serveur).

```
Avant Node.js : JavaScript = seulement dans le navigateur
Avec Node.js  : JavaScript = aussi sur le serveur
```

## Express

**Express** = Un framework pour creer des serveurs web facilement avec Node.js.

```javascript
const express = require('express')
const app = express()

// Creer une route
app.get('/bonjour', (req, res) => {
    res.send('Bonjour!')
})

// Demarrer le serveur sur le port 3000
app.listen(3000)
```

## Middleware

Un **middleware** = une fonction qui s'execute entre la requete et la reponse.

```
Requete → [Middleware 1] → [Middleware 2] → Controller → Reponse
```

```javascript
// Exemple : verifier si l'utilisateur est connecte
function verifierConnexion(req, res, next) {
    if (!req.headers.token) {
        return res.status(401).send('Non connecte')
    }
    next()  // Passer au suivant
}

// Utilisation : ce middleware s'execute AVANT le controller
app.get('/quiz', verifierConnexion, (req, res) => {
    res.send('Liste des quiz')
})
```

---

# API REST

## C'est quoi une API ?

**API** = Interface pour que deux programmes communiquent.

```
Frontend (Vue.js)  ←→  API  ←→  Backend (Express)  ←→  Base de donnees
```

Le frontend envoie des requetes, l'API repond avec des donnees.

## Les methodes HTTP

| Methode | Action | Exemple |
|---------|--------|---------|
| **GET** | Lire/Recuperer | Voir la liste des quiz |
| **POST** | Creer | Creer un nouveau quiz |
| **PUT** | Modifier tout | Modifier un quiz entier |
| **PATCH** | Modifier partie | Modifier juste le titre |
| **DELETE** | Supprimer | Supprimer un quiz |

## Exemple concret

```
GET    /api/quizzes       → Recuperer tous les quiz
GET    /api/quizzes/5     → Recuperer le quiz numero 5
POST   /api/quizzes       → Creer un quiz
PUT    /api/quizzes/5     → Modifier le quiz 5
DELETE /api/quizzes/5     → Supprimer le quiz 5
```

## Codes HTTP

| Code | Signification |
|------|---------------|
| **200** | OK - Ca a marche |
| **201** | Created - Cree avec succes |
| **400** | Bad Request - Donnees invalides |
| **401** | Unauthorized - Non connecte |
| **403** | Forbidden - Pas le droit |
| **404** | Not Found - N'existe pas |
| **500** | Server Error - Bug serveur |

## Format des reponses

Notre API repond toujours avec ce format :

```javascript
// Succes
{ "success": true, "data": { ... } }

// Erreur
{ "success": false, "error": { "code": "NOT_FOUND", "message": "Quiz non trouve" } }
```

---

# Base de donnees MySQL

## C'est quoi ?

Une **base de donnees** = un endroit pour stocker des donnees de facon organisee.

**MySQL** = Un type de base de donnees relationnelle (avec des tables).

## Les tables

Une **table** = comme un tableau Excel.

```
Table "users" :
+----+------------------+----------+
| id | email            | role     |
+----+------------------+----------+
| 1  | jean@test.com    | prof     |
| 2  | marie@test.com   | eleve    |
| 3  | admin@test.com   | admin    |
+----+------------------+----------+
```

## Les relations

Les tables sont **liees** entre elles :

```
users (1) ────── (N) quizzes
  Un prof peut avoir plusieurs quiz

quizzes (1) ────── (N) questions
  Un quiz a plusieurs questions
```

## Requetes SQL de base

```sql
-- Recuperer tous les utilisateurs
SELECT * FROM users

-- Recuperer un utilisateur par email
SELECT * FROM users WHERE email = 'jean@test.com'

-- Creer un utilisateur
INSERT INTO users (email, password, role) VALUES ('test@test.com', 'xxx', 'prof')

-- Modifier un utilisateur
UPDATE users SET role = 'admin' WHERE id = 1

-- Supprimer un utilisateur
DELETE FROM users WHERE id = 1
```

---

# JWT - Authentification

## C'est quoi JWT ?

**JWT** (JSON Web Token) = Un "badge" qui prouve que vous etes connecte.

## Le flux

```
1. Connexion
   Client: "Je suis jean@test.com, mot de passe 1234"
   Serveur: "OK, voici ton badge (token)"

2. Requetes suivantes
   Client: "Je veux mes quiz" + montre le badge
   Serveur: "Badge valide, voici tes quiz"
```

## Structure du token

```
eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjF9.signature
        [1]                  [2]            [3]

[1] Header    : type de token
[2] Payload   : donnees (userId, role...)
[3] Signature : preuve que c'est authentique
```

## Pourquoi c'est securise ?

- Le token est **signe** avec une cle secrete
- Si quelqu'un modifie le token, la signature ne correspond plus
- Le serveur detecte la fraude et refuse

## Stockage

```javascript
// Le frontend stocke le token dans localStorage
localStorage.setItem('token', 'eyJhbG...')

// Et l'envoie dans chaque requete
headers: { 'Authorization': 'Bearer eyJhbG...' }
```

---

# Vue.js - Le frontend

## C'est quoi Vue.js ?

**Vue.js** = Un framework pour creer des interfaces web interactives.

## Un composant Vue

```vue
<script setup>
// 1. LOGIQUE (JavaScript)
import { ref } from 'vue'

const compteur = ref(0)

function incrementer() {
    compteur.value++
}
</script>

<template>
<!-- 2. AFFICHAGE (HTML) -->
<div>
    <p>Compteur : {{ compteur }}</p>
    <button @click="incrementer">+1</button>
</div>
</template>

<style>
/* 3. STYLE (CSS) */
button { background: blue; }
</style>
```

## ref() - Reactivite

```javascript
import { ref } from 'vue'

// ref() rend une valeur "reactive"
// = Quand elle change, l'affichage se met a jour automatiquement
const nom = ref('Jean')

nom.value = 'Marie'  // L'ecran affiche "Marie" instantanement
```

## Directives Vue

```html
<!-- Afficher une variable -->
<p>{{ nom }}</p>

<!-- Condition -->
<p v-if="connecte">Bienvenue!</p>
<p v-else>Connectez-vous</p>

<!-- Boucle -->
<li v-for="quiz in quizzes" :key="quiz.id">
    {{ quiz.title }}
</li>

<!-- Evenement -->
<button @click="supprimer">Supprimer</button>

<!-- Liaison bidirectionnelle (formulaire) -->
<input v-model="email" />
```

## Props - Communication parent → enfant

```vue
<!-- Parent -->
<QuizCard :quiz="monQuiz" />

<!-- Enfant (QuizCard.vue) -->
<script setup>
const props = defineProps({
    quiz: Object
})
</script>

<template>
<div>{{ props.quiz.title }}</div>
</template>
```

## Emit - Communication enfant → parent

```vue
<!-- Enfant -->
<script setup>
const emit = defineEmits(['supprimer'])

function handleClick() {
    emit('supprimer', quizId)
}
</script>

<!-- Parent -->
<QuizCard @supprimer="supprimerQuiz" />
```

---

# Pinia - Gestion d'etat

## C'est quoi ?

**Pinia** = Un endroit centralise pour stocker des donnees partagees entre composants.

## Pourquoi ?

```
Sans Pinia :
  Composant A → passe donnees → Composant B → passe → Composant C
  (complique si beaucoup de composants)

Avec Pinia :
  Store central ← tous les composants lisent/modifient ici
```

## Un store simple

```javascript
// stores/auth.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
    // STATE = les donnees
    const user = ref(null)
    const token = ref(null)

    // GETTERS = valeurs calculees
    const isConnected = computed(() => !!token.value)

    // ACTIONS = fonctions pour modifier
    function login(userData, userToken) {
        user.value = userData
        token.value = userToken
    }

    function logout() {
        user.value = null
        token.value = null
    }

    return { user, token, isConnected, login, logout }
})
```

## Utilisation dans un composant

```vue
<script setup>
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()

// Lire
console.log(authStore.user)
console.log(authStore.isConnected)

// Modifier
authStore.login(user, token)
authStore.logout()
</script>
```

---

# CI/CD et outils

## Pipeline CI/CD

Une **pipeline CI/CD** = Un robot qui verifie automatiquement votre code.

```
git push
    ↓
GitHub Actions demarre
    ↓
1. Verifie le formatage (Prettier)
2. Verifie les erreurs (ESLint)
3. Lance les tests
4. Compile le projet
    ↓
Tout vert → OK pour merger
Rouge → Corriger avant
```

## Prettier - Formatage

**Prettier** = Reformate le code automatiquement pour qu'il soit uniforme.

```javascript
// Avant (mal formate)
function hello(name){console.log("Bonjour "+name)}

// Apres Prettier
function hello(name) {
    console.log('Bonjour ' + name)
}
```

**Commande** : `npm run format`

## ESLint - Qualite

**ESLint** = Detecte les erreurs et mauvaises pratiques.

```javascript
// ESLint detecte ces problemes :

const x = 5
x = 10  // Erreur : const ne peut pas changer

if (age == 18)  // Warning : utiliser === pas ==

const data = fetch()  // Variable jamais utilisee
```

**Commande** : `npm run lint`

## Difference Prettier vs ESLint

```
PRETTIER = Apparence
  - Indentation
  - Guillemets
  - Espaces

ESLint = Logique
  - Variables non utilisees
  - Erreurs de syntaxe
  - Bonnes pratiques
```

## Les Tests

**Tests** = Du code qui verifie que votre code marche.

```javascript
// Fonction a tester
function additionner(a, b) {
    return a + b
}

// Test
test('2 + 3 = 5', () => {
    expect(additionner(2, 3)).toBe(5)
})
```

**Commande** : `npm test`

---

# Resume des commandes

## Backend

```bash
cd backend
npm install        # Installer les dependances
npm run dev        # Lancer en mode dev
npm test           # Lancer les tests
npm run lint       # Verifier ESLint
npm run format     # Formater avec Prettier
```

## Frontend

```bash
cd frontend
npm install        # Installer les dependances
npm run dev        # Lancer en mode dev
npm test           # Lancer les tests
npm run lint       # Verifier ESLint
npm run format     # Formater avec Prettier
npm run build      # Compiler pour production
```

---

# Glossaire rapide

| Terme | Definition simple |
|-------|-------------------|
| **API** | Interface pour communiquer entre programmes |
| **Backend** | La partie serveur (invisible) |
| **Frontend** | La partie visible (interface) |
| **JWT** | Badge de connexion |
| **Middleware** | Fonction intermediaire |
| **REST** | Style d'API avec GET, POST, PUT, DELETE |
| **SPA** | Application sur une seule page |
| **Store** | Stockage centralise de donnees |
| **Token** | Cle d'authentification |
| **Webhook** | Appel automatique d'API quand un evenement se produit |
