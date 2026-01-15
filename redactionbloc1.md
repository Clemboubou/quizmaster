# Redaction Bloc 1 - Analyse du Besoin

## Table des matieres

1. [Cahier des Charges Fonctionnel](#1-cahier-des-charges-fonctionnel)
2. [Exigences Fonctionnelles](#2-exigences-fonctionnelles)
3. [Exigences Non Fonctionnelles](#3-exigences-non-fonctionnelles)

---

# 1. Cahier des Charges Fonctionnel

## 1.1 Contexte du Projet

### Informations generales

| Element | Description |
|---------|-------------|
| **Nom du projet** | QuizMaster |
| **Type** | Application web fullstack |
| **Domaine** | Education / E-learning |
| **Cible** | Etablissements scolaires, formateurs, enseignants |

### Presentation

QuizMaster est une plateforme web permettant aux professeurs de creer des quiz interactifs et aux eleves de les passer en ligne. L'application repond a un besoin de digitalisation des evaluations dans le contexte educatif actuel.

L'application est dite "fullstack" car elle comprend :
- **Frontend** : Interface utilisateur visible (Vue.js 3)
- **Backend** : Serveur et logique metier (Node.js/Express)
- **Base de donnees** : Stockage permanent (MySQL)

### Problematique

Les enseignants ont besoin d'un outil simple pour :
- Creer rapidement des evaluations
- Partager facilement avec les eleves (via un code)
- Suivre les resultats de maniere centralisee
- Gerer la plateforme (administrateurs)

---

## 1.2 Objectifs du Projet

### Objectif principal

Permettre la creation et le passage de quiz en ligne de maniere simple et intuitive.

### Objectifs secondaires

| Objectif | Description |
|----------|-------------|
| **Suivi pedagogique** | Offrir aux professeurs un suivi des resultats detaille |
| **Accessibilite** | Rendre l'application utilisable par tous (WCAG 2.1) |
| **Monetisation** | Proposer un modele freemium (gratuit + Premium) |
| **Administration** | Permettre la gestion centralisee de la plateforme |
| **Securite** | Proteger les donnees des utilisateurs (RGPD) |

### Modele economique

| Offre | Prix | Fonctionnalites |
|-------|------|-----------------|
| **Gratuit** | 0€ | 1 quiz maximum |
| **Premium** | 9.99€ (paiement unique) | Jusqu'a 20 quiz |

---

## 1.3 Acteurs du Systeme

### Acteurs principaux

| Acteur | Description | Besoins principaux |
|--------|-------------|-------------------|
| **Professeur (prof)** | Utilisateur createur de contenu pedagogique | Creer des quiz, ajouter des questions, consulter les resultats |
| **Eleve** | Utilisateur participant aux evaluations | Rejoindre un quiz via code, repondre aux questions, voir son score |
| **Administrateur (admin)** | Gestionnaire de la plateforme | Gerer les utilisateurs, consulter les logs, voir les statistiques |

### Acteurs secondaires (systemes externes)

| Acteur | Role |
|--------|------|
| **Stripe** | Systeme de paiement securise pour le passage Premium |
| **Navigateur web** | Interface d'acces a l'application |
| **Serveur MySQL** | Stockage des donnees persistantes |

---

## 1.4 Perimetre du Projet

### Ce qui est inclus

- Inscription et connexion securisee (JWT)
- Creation, modification, suppression de quiz
- Ajout de questions QCM (4 choix) et Vrai/Faux
- Passage de quiz via code d'acces
- Calcul et enregistrement des scores
- Historique des resultats (eleves et profs)
- Paiement Stripe pour le Premium
- Interface d'administration complete
- Systeme de logs pour l'audit

### Ce qui n'est pas inclus (hors perimetre)

- Application mobile native
- Mode hors-ligne
- Export PDF des resultats
- Systeme de messagerie interne
- Gamification avancee (badges, classements)

---

# 2. Exigences Fonctionnelles

## 2.1 Module Authentification

| ID | Exigence | Priorite | Statut |
|----|----------|----------|--------|
| AUTH-01 | L'utilisateur peut s'inscrire avec email, mot de passe et role (prof/eleve) | Haute | Implemente |
| AUTH-02 | L'utilisateur peut se connecter avec email et mot de passe | Haute | Implemente |
| AUTH-03 | Le mot de passe doit respecter les regles de securite (8 caracteres, majuscule, minuscule, chiffre) | Haute | Implemente |
| AUTH-04 | L'utilisateur peut se deconnecter | Haute | Implemente |
| AUTH-05 | L'utilisateur peut consulter son profil | Moyenne | Implemente |

### Implementation technique

```
POST /api/auth/register  → Inscription
POST /api/auth/login     → Connexion
GET  /api/auth/me        → Profil
POST /api/auth/logout    → Deconnexion
```

### Regles de validation du mot de passe

- Minimum 8 caracteres
- Au moins 1 majuscule (A-Z)
- Au moins 1 minuscule (a-z)
- Au moins 1 chiffre (0-9)

---

## 2.2 Module Quiz (Professeur)

| ID | Exigence | Priorite | Statut |
|----|----------|----------|--------|
| QUIZ-01 | Le professeur peut creer un quiz avec un titre (5-100 caracteres) | Haute | Implemente |
| QUIZ-02 | Le systeme genere automatiquement un code d'acces unique (5 caracteres alphanumeriques) | Haute | Implemente |
| QUIZ-03 | Le professeur peut modifier le titre d'un quiz | Moyenne | Implemente |
| QUIZ-04 | Le professeur peut supprimer un quiz (suppression en cascade des questions et resultats) | Moyenne | Implemente |
| QUIZ-05 | Limite de quiz : 1 en gratuit, 20 en Premium | Haute | Implemente |
| QUIZ-06 | Le professeur ne peut voir/modifier que ses propres quiz | Haute | Implemente |

### Implementation technique

```
GET    /api/quizzes         → Liste des quiz du prof
GET    /api/quizzes/:id     → Detail d'un quiz
POST   /api/quizzes         → Creer un quiz
PUT    /api/quizzes/:id     → Modifier un quiz
DELETE /api/quizzes/:id     → Supprimer un quiz
```

### Logique du code d'acces

```javascript
// Generation aleatoire de 5 caracteres
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
let code = ''
for (let i = 0; i < 5; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
}
// Exemple: "XK9M2"
```

---

## 2.3 Module Questions (Professeur)

| ID | Exigence | Priorite | Statut |
|----|----------|----------|--------|
| QUEST-01 | Le professeur peut ajouter des questions de type QCM (4 choix obligatoires) | Haute | Implemente |
| QUEST-02 | Le professeur peut ajouter des questions de type Vrai/Faux (2 choix) | Haute | Implemente |
| QUEST-03 | Le professeur peut modifier une question existante | Moyenne | Implemente |
| QUEST-04 | Le professeur peut supprimer une question | Moyenne | Implemente |
| QUEST-05 | La bonne reponse doit faire partie des options proposees | Haute | Implemente |
| QUEST-06 | Le professeur ne peut modifier que les questions de ses propres quiz | Haute | Implemente |

### Implementation technique

```
GET    /api/questions/quiz/:quizId  → Liste des questions (prof)
GET    /api/questions/play/:quizId  → Questions pour jouer (sans reponse)
POST   /api/questions               → Ajouter une question
PUT    /api/questions/:id           → Modifier une question
DELETE /api/questions/:id           → Supprimer une question
```

### Structure d'une question

```json
{
    "quiz_id": 1,
    "type": "qcm",
    "question_text": "Quelle est la capitale de la France ?",
    "options": ["Londres", "Paris", "Berlin", "Madrid"],
    "correct_answer": "Paris"
}
```

---

## 2.4 Module Jeu (Eleve)

| ID | Exigence | Priorite | Statut |
|----|----------|----------|--------|
| JEU-01 | L'eleve peut rejoindre un quiz en saisissant le code d'acces (5 caracteres) | Haute | Implemente |
| JEU-02 | Les questions s'affichent une par une dans l'ordre | Haute | Implemente |
| JEU-03 | L'eleve doit selectionner une reponse avant de passer a la suivante | Haute | Implemente |
| JEU-04 | L'eleve voit son score final a la fin du quiz (nombre et pourcentage) | Haute | Implemente |
| JEU-05 | Une barre de progression indique l'avancement dans le quiz | Moyenne | Implemente |

### Implementation technique

```
GET  /api/quizzes/join/:code     → Rejoindre un quiz par code
GET  /api/questions/play/:quizId → Recuperer les questions (sans correct_answer)
POST /api/results                → Enregistrer le resultat
```

### Flux de jeu

```
1. Eleve saisit le code "XK9M2"
       ↓
2. Verification du code → Quiz trouve
       ↓
3. Chargement des questions (sans les reponses correctes)
       ↓
4. Affichage question 1/N
       ↓
5. Selection d'une reponse → Suivant
       ↓
6. ... (repeter pour chaque question)
       ↓
7. Calcul du score cote client
       ↓
8. Envoi du resultat au serveur
       ↓
9. Affichage du score final
```

---

## 2.5 Module Resultats

| ID | Exigence | Priorite | Statut |
|----|----------|----------|--------|
| RES-01 | Le resultat est enregistre en base de donnees apres chaque quiz | Haute | Implemente |
| RES-02 | Le professeur peut voir les resultats de ses quiz (email eleve, score, date) | Haute | Implemente |
| RES-03 | Le professeur peut voir le detail des reponses d'un eleve | Moyenne | Implemente |
| RES-04 | L'eleve peut voir son historique de resultats | Moyenne | Implemente |
| RES-05 | L'eleve peut revoir le detail de ses reponses (correct/incorrect) | Moyenne | Implemente |

### Implementation technique

```
POST /api/results                 → Enregistrer un resultat
GET  /api/results/me              → Historique de l'eleve
GET  /api/results/me/:id/answers  → Detail des reponses (eleve)
GET  /api/results/quiz/:quizId    → Resultats d'un quiz (prof)
GET  /api/results/:id/answers     → Detail d'un resultat (prof)
```

### Structure du resultat

```json
{
    "user_id": 5,
    "quiz_id": 1,
    "score": 8,
    "answers": [
        { "question_id": 1, "user_answer": "Paris", "is_correct": true },
        { "question_id": 2, "user_answer": "Faux", "is_correct": false }
    ]
}
```

---

## 2.6 Module Paiement

| ID | Exigence | Priorite | Statut |
|----|----------|----------|--------|
| PAY-01 | Le professeur peut passer Premium via Stripe Checkout | Haute | Implemente |
| PAY-02 | Le paiement est securise via webhook Stripe (verification signature) | Haute | Implemente |
| PAY-03 | Le statut Premium est mis a jour automatiquement apres paiement reussi | Haute | Implemente |
| PAY-04 | L'utilisateur est redirige vers une page de succes apres paiement | Moyenne | Implemente |
| PAY-05 | Les paiements sont enregistres en base de donnees | Moyenne | Implemente |

### Implementation technique

```
POST /api/payment/create-checkout  → Creer une session Stripe
POST /api/payment/webhook          → Recevoir les events Stripe
GET  /api/payment/success          → Confirmer le paiement
```

### Flux de paiement Stripe

```
1. Prof clique "Passer Premium"
       ↓
2. Backend cree une session Stripe Checkout
       ↓
3. Redirection vers la page Stripe
       ↓
4. Prof saisit ses informations de paiement
       ↓
5. Stripe traite le paiement
       ↓
6. Stripe appelle notre webhook (checkout.session.completed)
       ↓
7. Backend verifie la signature et met a jour is_premium = true
       ↓
8. Redirection vers /payment/success
```

---

## 2.7 Module Administration

| ID | Exigence | Priorite | Statut |
|----|----------|----------|--------|
| ADMIN-01 | L'admin peut voir un dashboard avec statistiques globales (users, quiz, resultats) | Haute | Implemente |
| ADMIN-02 | L'admin peut lister tous les utilisateurs avec pagination et filtres | Haute | Implemente |
| ADMIN-03 | L'admin peut modifier le role d'un utilisateur (prof/eleve/admin) | Haute | Implemente |
| ADMIN-04 | L'admin peut activer/desactiver un compte utilisateur | Moyenne | Implemente |
| ADMIN-05 | L'admin peut attribuer/retirer le statut Premium | Moyenne | Implemente |
| ADMIN-06 | L'admin peut supprimer un utilisateur (sauf lui-meme) | Haute | Implemente |
| ADMIN-07 | L'admin peut creer un nouvel utilisateur | Moyenne | Implemente |
| ADMIN-08 | L'admin peut consulter les logs systeme avec filtres (action, date, user) | Haute | Implemente |
| ADMIN-09 | Toutes les actions importantes sont enregistrees dans les logs | Haute | Implemente |
| ADMIN-10 | Un admin ne peut pas supprimer son propre compte | Haute | Implemente |

### Implementation technique

```
GET    /api/admin/dashboard        → Statistiques globales
GET    /api/admin/users            → Liste des utilisateurs
GET    /api/admin/users/:id        → Detail d'un utilisateur
POST   /api/admin/users            → Creer un utilisateur
PUT    /api/admin/users/:id        → Modifier un utilisateur
DELETE /api/admin/users/:id        → Supprimer un utilisateur
GET    /api/admin/logs             → Consulter les logs
```

### Types de logs enregistres

| Action | Description |
|--------|-------------|
| `LOGIN` | Connexion d'un utilisateur |
| `LOGOUT` | Deconnexion |
| `USER_CREATED` | Creation d'un compte |
| `USER_UPDATED` | Modification d'un compte |
| `USER_DELETED` | Suppression d'un compte |
| `ROLE_CHANGED` | Changement de role |
| `PREMIUM_GRANTED` | Attribution du Premium |
| `PREMIUM_REVOKED` | Retrait du Premium |

---

# 3. Exigences Non Fonctionnelles

## 3.1 Performance

| ID | Exigence | Critere de mesure | Statut |
|----|----------|-------------------|--------|
| PERF-01 | Temps de reponse API inferieur a 500ms | Mesure avec les tests | Implemente |
| PERF-02 | Chargement initial de la page inferieur a 3 secondes | Lighthouse | Implemente |
| PERF-03 | Build frontend optimise (code splitting, tree shaking) | Vite build | Implemente |

### Implementation

- **Vite** : Bundler rapide avec HMR instantane
- **Lazy loading** : Chargement des routes a la demande
- **Requetes preparees** : Optimisation des queries MySQL

---

## 3.2 Securite

| ID | Exigence | Implementation | Statut |
|----|----------|----------------|--------|
| SEC-01 | Mots de passe hashes avec bcrypt (10 rounds) | `bcrypt.hash(password, 10)` | Implemente |
| SEC-02 | Authentification par token JWT | `jsonwebtoken` | Implemente |
| SEC-03 | Protection contre les injections SQL | Requetes preparees avec `?` | Implemente |
| SEC-04 | Headers de securite HTTP | `helmet.js` | Implemente |
| SEC-05 | Protection CORS configuree | `cors` avec origin specifique | Implemente |
| SEC-06 | Validation des donnees entrantes | Validators custom | Implemente |
| SEC-07 | Verification des roles pour chaque route protegee | Middlewares `requireProf`, `requireAdmin` | Implemente |

### Headers Helmet configures

```javascript
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"]
        }
    }
}))
```

---

## 3.3 Accessibilite (WCAG 2.1 AA)

| ID | Exigence | Implementation | Statut |
|----|----------|----------------|--------|
| A11Y-01 | Skip link pour sauter au contenu principal | `<a href="#main" class="sr-only">` | Implemente |
| A11Y-02 | Labels associes aux champs de formulaire | `<label for="id">` | Implemente |
| A11Y-03 | Navigation au clavier possible | `tabindex`, focus visible | Implemente |
| A11Y-04 | Annonces pour lecteurs d'ecran | `aria-live="polite"` | Implemente |
| A11Y-05 | Contrastes de couleurs suffisants (4.5:1) | Palette Tailwind | Implemente |
| A11Y-06 | Textes alternatifs pour les images | `alt` attributes | Implemente |
| A11Y-07 | Formulaires accessibles avec messages d'erreur | `aria-describedby` | Implemente |

### Exemple d'implementation

```html
<!-- Skip link -->
<a href="#main" class="sr-only focus:not-sr-only">
    Aller au contenu principal
</a>

<!-- Formulaire accessible -->
<label for="email">Adresse email</label>
<input
    id="email"
    type="email"
    aria-describedby="email-error"
    aria-invalid="true"
/>
<p id="email-error" role="alert">Email invalide</p>

<!-- Annonce dynamique -->
<p aria-live="polite">Quiz sauvegarde avec succes !</p>
```

---

## 3.4 SEO (Referencement)

| ID | Exigence | Implementation | Statut |
|----|----------|----------------|--------|
| SEO-01 | Meta tags (title, description, keywords) | `index.html` + composable `useSeo` | Implemente |
| SEO-02 | Open Graph pour partage reseaux sociaux | `og:title`, `og:description`, `og:image` | Implemente |
| SEO-03 | Twitter Card | `twitter:card`, `twitter:title` | Implemente |
| SEO-04 | URL canonique | `<link rel="canonical">` | Implemente |
| SEO-05 | Structure semantique HTML | `<header>`, `<main>`, `<footer>` | Implemente |
| SEO-06 | Meta robots | `index, follow` | Implemente |

### Meta tags configures

```html
<title>QuizMaster - Creez et partagez des quiz interactifs</title>
<meta name="description" content="Plateforme de creation de quiz pour
    professeurs. QCM, Vrai/Faux, suivi des resultats." />
<meta property="og:title" content="QuizMaster" />
<meta property="og:description" content="Creez des quiz interactifs" />
<meta property="og:image" content="/og-image.png" />
```

---

## 3.5 Compatibilite

| ID | Exigence | Statut |
|----|----------|--------|
| COMPAT-01 | Compatible Chrome (dernieres versions) | Implemente |
| COMPAT-02 | Compatible Firefox (dernieres versions) | Implemente |
| COMPAT-03 | Compatible Safari (dernieres versions) | Implemente |
| COMPAT-04 | Compatible Edge (dernieres versions) | Implemente |
| COMPAT-05 | Responsive : Desktop (1920px) | Implemente |
| COMPAT-06 | Responsive : Tablette (768px) | Implemente |
| COMPAT-07 | Responsive : Mobile (375px) | Implemente |

### Implementation Tailwind responsive

```html
<!-- Mobile first avec breakpoints -->
<div class="
    grid
    grid-cols-1      /* Mobile : 1 colonne */
    md:grid-cols-2   /* Tablette : 2 colonnes */
    lg:grid-cols-3   /* Desktop : 3 colonnes */
">
```

---

## 3.6 Maintenabilite

| ID | Exigence | Implementation | Statut |
|----|----------|----------------|--------|
| MAINT-01 | Code formate uniformement | Prettier | Implemente |
| MAINT-02 | Qualite du code verifiee | ESLint | Implemente |
| MAINT-03 | Tests automatises | Vitest (199 tests) | Implemente |
| MAINT-04 | Pipeline CI/CD | GitHub Actions | Implemente |
| MAINT-05 | Documentation technique | DOCUMENTATION.md | Implemente |
| MAINT-06 | Structure de code coherente | Architecture MVC | Implemente |

### Couverture de tests

| Partie | Nombre de tests |
|--------|-----------------|
| Backend | 50 tests |
| Frontend | 149 tests |
| **Total** | **199 tests** |

---

## 3.7 Fiabilite

| ID | Exigence | Implementation | Statut |
|----|----------|----------------|--------|
| FIAB-01 | Gestion des erreurs centralisee | Middleware `error.middleware.js` | Implemente |
| FIAB-02 | Format de reponse API uniforme | `{ success, data/error }` | Implemente |
| FIAB-03 | Validation des donnees entrantes | Validators par module | Implemente |
| FIAB-04 | Cascade delete pour integrite des donnees | Foreign keys MySQL | Implemente |
| FIAB-05 | Logs des erreurs serveur | Console + table logs | Implemente |

### Format de reponse standardise

```javascript
// Succes
{
    "success": true,
    "data": { ... }
}

// Erreur
{
    "success": false,
    "error": {
        "code": "VALIDATION_ERROR",
        "message": "Le titre est requis",
        "field": "title"
    }
}
```

---

## Resume des Exigences

### Exigences Fonctionnelles

| Module | Nombre | Implementees |
|--------|--------|--------------|
| Authentification | 5 | 5 |
| Quiz | 6 | 6 |
| Questions | 6 | 6 |
| Jeu | 5 | 5 |
| Resultats | 5 | 5 |
| Paiement | 5 | 5 |
| Administration | 10 | 10 |
| **Total** | **42** | **42** |

### Exigences Non Fonctionnelles

| Categorie | Nombre | Implementees |
|-----------|--------|--------------|
| Performance | 3 | 3 |
| Securite | 7 | 7 |
| Accessibilite | 7 | 7 |
| SEO | 6 | 6 |
| Compatibilite | 7 | 7 |
| Maintenabilite | 6 | 6 |
| Fiabilite | 5 | 5 |
| **Total** | **41** | **41** |

---

**Total : 83 exigences implementees**
