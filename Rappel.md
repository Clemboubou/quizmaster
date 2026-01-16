# AIDE-MÉMOIRE PRÉSENTATION JURY - QuizMaster

> Ce document contient toutes les explications des concepts techniques de ton projet. Lis-le pour bien te préparer avant de passer devant le jury.

---

## 1. TECHNOLOGIES FRONTEND

### Vue.js 3

Vue.js est un framework JavaScript qui permet de créer des interfaces utilisateur interactives. C'est ce qu'on appelle un framework "progressif" car on peut l'utiliser pour une petite partie d'un site ou pour construire une application complète.

Dans ton projet, Vue.js gère tout ce que l'utilisateur voit : les pages, les formulaires d'inscription et de connexion, l'affichage des quiz, les boutons, etc. Quand l'utilisateur clique sur quelque chose ou remplit un formulaire, Vue.js met à jour l'interface sans recharger la page.

Tu as choisi Vue.js parce qu'il est simple à apprendre, qu'il a une excellente documentation, et qu'il était imposé par ta formation. C'est un bon compromis entre la simplicité et la puissance.

### Composition API

La Composition API est la nouvelle façon d'écrire du code Vue.js depuis la version 3. Avant, on utilisait l'Options API où on séparait le code en sections : `data()` pour les variables, `methods` pour les fonctions, `computed` pour les calculs, etc. Le problème c'est que la logique d'une même fonctionnalité était éparpillée.

Avec la Composition API, on regroupe tout ce qui concerne une fonctionnalité au même endroit. On utilise la syntaxe `<script setup>` qui est plus concise et plus lisible.

Par exemple, au lieu d'écrire :
```javascript
export default {
  data() { return { score: 0 } },
  computed: { pourcentage() { return this.score * 100 / this.total } }
}
```

On écrit simplement :
```javascript
const score = ref(0)
const pourcentage = computed(() => score.value * 100 / total)
```

### ref() et computed()

Ce sont les deux fonctions de base de la Composition API.

**ref()** crée une variable réactive. "Réactive" signifie que quand la valeur change, l'interface se met à jour automatiquement. Si tu as `const score = ref(0)` et que tu fais `score.value = 10`, l'écran affichera automatiquement 10 au lieu de 0.

**computed()** crée une valeur calculée. C'est comme une variable qui se recalcule automatiquement quand ses dépendances changent. Si tu as `const pourcentage = computed(() => score.value * 100 / total)`, le pourcentage sera recalculé à chaque fois que le score change, sans que tu aies besoin de le faire manuellement.

### Pinia

Pinia est une bibliothèque de gestion d'état pour Vue.js. Elle permet de partager des données entre tous les composants de l'application.

Imagine que tu as besoin de savoir si l'utilisateur est connecté dans plusieurs pages différentes (la navbar, le dashboard, la page de paiement...). Sans Pinia, il faudrait passer cette information de composant en composant, ce qui devient vite compliqué.

Avec Pinia, tu crées un "store" qui contient les données partagées. N'importe quel composant peut y accéder. Dans ton projet, tu as deux stores :
- `auth.js` qui stocke l'utilisateur connecté et son token
- `quiz.js` qui stocke la liste des quiz et les résultats

Pinia remplace Vuex qui était l'ancienne solution. Pinia est plus simple à utiliser et c'est maintenant la solution officielle recommandée pour Vue 3.

### Vue Router

Vue Router est le système de navigation de Vue.js. Il permet d'associer des URLs à des composants Vue.

Quand l'utilisateur va sur `/dashboard`, Vue Router affiche le composant DashboardView. Quand il va sur `/auth`, il affiche AuthView. Tout ça sans recharger la page, c'est ce qu'on appelle une Single Page Application (SPA).

Tu configures les routes dans un fichier `router/index.js` où tu définis quelle URL affiche quel composant.

### Navigation Guards

Les guards sont des contrôles qui s'exécutent avant d'accéder à une page. Ils permettent de protéger certaines routes.

Dans ton projet, tu as un guard `beforeEach` qui vérifie avant chaque navigation :
1. Est-ce que la route nécessite d'être connecté ? (meta `requiresAuth`)
2. Est-ce que l'utilisateur est connecté ?
3. Est-ce que l'utilisateur a le bon rôle ? (prof, eleve, admin)

Si les conditions ne sont pas remplies, l'utilisateur est redirigé vers la page de connexion ou le dashboard.

### Axios

Axios est une bibliothèque JavaScript pour faire des requêtes HTTP. C'est ce qui permet au frontend de communiquer avec le backend.

Quand tu veux récupérer la liste des quiz, tu fais `axios.get('/api/quizzes')`. Quand tu veux créer un quiz, tu fais `axios.post('/api/quizzes', { title: 'Mon quiz' })`. Axios gère les requêtes de façon simple et retourne des promesses qu'on peut utiliser avec async/await.

### Intercepteurs Axios

Les intercepteurs sont du code qui s'exécute automatiquement à chaque requête ou réponse.

Dans ton projet, tu as deux intercepteurs :
1. **Intercepteur de requête** : Avant chaque requête, il ajoute automatiquement le token JWT dans le header `Authorization`. Comme ça, tu n'as pas besoin de le faire manuellement à chaque appel API.

2. **Intercepteur de réponse** : Si le serveur répond avec une erreur 401 (non authentifié), l'intercepteur supprime le token du localStorage et redirige vers la page de connexion.

### Tailwind CSS

Tailwind CSS est un framework CSS qui fonctionne avec des classes utilitaires. Au lieu d'écrire du CSS personnalisé, tu utilises des classes prédéfinies directement dans le HTML.

Par exemple, `class="bg-blue-500 text-white p-4 rounded"` donne un élément avec un fond bleu, du texte blanc, du padding et des coins arrondis. C'est très rapide pour développer et ça évite d'avoir des fichiers CSS énormes.

Tailwind inclut aussi un système de breakpoints pour le responsive : `md:grid-cols-2` signifie "2 colonnes sur écran moyen et plus".

### Vite

Vite est un outil de build moderne pour les applications web. Il remplace Webpack qui était plus lent.

Pendant le développement, Vite démarre instantanément et recharge la page automatiquement quand tu modifies le code (Hot Module Replacement). Pour la production, il compile et optimise tout le code en fichiers statiques.

Tu l'utilises avec `npm run dev` pour développer et `npm run build` pour créer la version de production.

---

## 2. TECHNOLOGIES BACKEND

### Node.js

Node.js est un environnement d'exécution qui permet de faire tourner du JavaScript côté serveur. Avant Node.js, JavaScript ne pouvait s'exécuter que dans le navigateur.

L'avantage principal c'est d'utiliser le même langage (JavaScript) pour le frontend et le backend. Ça simplifie le développement et permet de partager du code entre les deux.

Node.js est non-bloquant et asynchrone, ce qui le rend performant pour gérer beaucoup de connexions simultanées.

### Express.js

Express.js est un framework minimaliste pour Node.js qui facilite la création d'APIs web. Il fournit des outils pour gérer les routes, les requêtes HTTP, et les middlewares.

Avec Express, tu définis des routes comme :
```javascript
app.get('/api/quizzes', (req, res) => { /* récupérer les quiz */ })
app.post('/api/quizzes', (req, res) => { /* créer un quiz */ })
```

C'est simple, flexible, et c'est le framework le plus utilisé avec Node.js.

### API REST

REST (Representational State Transfer) est une façon standard de concevoir des APIs web. Les APIs REST utilisent les verbes HTTP pour définir les actions :

- **GET** : Récupérer des données (lecture)
- **POST** : Créer une nouvelle ressource
- **PUT** : Modifier une ressource existante
- **DELETE** : Supprimer une ressource

Les URLs représentent des ressources : `/api/quizzes` pour les quiz, `/api/users` pour les utilisateurs. C'est une convention que tout le monde comprend.

### Endpoint

Un endpoint est une URL spécifique de l'API qui effectue une action précise. Chaque endpoint a une méthode HTTP et un chemin.

Exemples dans ton projet :
- `POST /api/auth/register` : Créer un compte
- `POST /api/auth/login` : Se connecter
- `GET /api/quizzes` : Récupérer ses quiz
- `POST /api/quizzes` : Créer un quiz
- `DELETE /api/quizzes/:id` : Supprimer un quiz

### Middleware

Un middleware est une fonction qui s'exécute entre la réception de la requête et l'envoi de la réponse. Les middlewares s'enchaînent les uns après les autres.

Dans ton projet, quand une requête arrive sur `POST /api/quizzes`, elle passe par :
1. `authenticateToken` : Vérifie que le token JWT est valide
2. `requireProf` : Vérifie que l'utilisateur est un professeur
3. `validateQuiz` : Vérifie que les données du quiz sont correctes
4. Le controller : Crée le quiz en base de données

Si un middleware échoue, la requête s'arrête et renvoie une erreur.

### Controller

Le controller est la fonction qui traite réellement la requête une fois que tous les middlewares sont passés. Il contient la logique métier.

Par exemple, le controller `createQuiz` :
1. Vérifie que le professeur n'a pas dépassé sa limite de quiz
2. Génère un code d'accès unique
3. Insère le quiz en base de données
4. Renvoie le quiz créé

### Pattern MVC

MVC signifie Model-View-Controller. C'est une façon d'organiser le code en séparant les responsabilités :

- **Model** : Les données et la base de données
- **View** : L'interface utilisateur (dans ton cas, c'est le frontend Vue.js)
- **Controller** : La logique métier qui fait le lien entre les deux

Cette séparation rend le code plus maintenable et plus facile à tester.

---

## 3. SÉCURITÉ

### JWT (JSON Web Token)

JWT est un format de token d'authentification. C'est une chaîne de caractères qui prouve que l'utilisateur est connecté.

Le flux d'authentification fonctionne comme ça :
1. L'utilisateur se connecte avec son email et mot de passe
2. Le serveur vérifie les identifiants
3. Si c'est bon, le serveur génère un JWT contenant l'id de l'utilisateur et son rôle
4. Le frontend stocke ce JWT dans localStorage
5. À chaque requête suivante, le frontend envoie le JWT dans le header
6. Le serveur vérifie le JWT et sait qui fait la requête

Un JWT est composé de trois parties séparées par des points :
- **Header** : Le type de token et l'algorithme de signature
- **Payload** : Les données (userId, role, date d'expiration)
- **Signature** : La preuve que le token n'a pas été modifié

L'avantage du JWT c'est qu'il est "stateless" : le serveur n'a pas besoin de stocker les sessions, tout est dans le token.

### bcrypt

bcrypt est un algorithme de hashage conçu spécialement pour les mots de passe. Le hashage transforme le mot de passe en une chaîne illisible qu'on ne peut pas inverser.

À l'inscription :
```javascript
const hash = await bcrypt.hash("motdepasse123", 10)
// hash = "$2b$10$N9qo8uLOickgx2ZMRZoMy..." (stocké en base)
```

À la connexion :
```javascript
const match = await bcrypt.compare("motdepasse123", hash)
// match = true ou false
```

Le "10" c'est le nombre de rounds de hashage. Plus c'est élevé, plus c'est lent à calculer, donc plus c'est sécurisé contre les attaques par force brute. 10 est un bon compromis.

### Hash vs Chiffrement

C'est important de comprendre la différence :

- **Hash** : Transformation irréversible. On ne peut jamais retrouver le mot de passe original à partir du hash. C'est ce qu'on veut pour les mots de passe.

- **Chiffrement** : Transformation réversible avec une clé. On peut déchiffrer pour retrouver l'original. C'est utile pour les données qu'on doit relire (comme les messages).

Pour les mots de passe, on utilise toujours le hash car même si la base de données est piratée, les mots de passe restent illisibles.

### Salt

Le salt est une chaîne aléatoire ajoutée au mot de passe avant le hashage. bcrypt le fait automatiquement.

Sans salt, deux utilisateurs avec le même mot de passe auraient le même hash, ce qui permet des attaques par dictionnaire. Avec le salt, chaque hash est unique même pour des mots de passe identiques.

### Helmet.js

Helmet est un middleware Express qui ajoute automatiquement des headers HTTP de sécurité :

- **Content-Security-Policy** : Limite les sources de scripts, styles, images
- **X-Frame-Options** : Empêche le site d'être affiché dans une iframe (protection clickjacking)
- **X-Content-Type-Options** : Empêche le navigateur de deviner le type de fichier
- **Et d'autres...**

C'est une ligne de code qui ajoute plusieurs couches de protection.

### CORS

CORS (Cross-Origin Resource Sharing) contrôle quels domaines peuvent appeler ton API.

Par défaut, un navigateur bloque les requêtes vers un domaine différent. Si ton frontend est sur `localhost:5173` et ton backend sur `localhost:3000`, le navigateur bloquerait les requêtes.

Avec CORS, tu configures le backend pour autoriser les requêtes venant de ton frontend :
```javascript
app.use(cors({ origin: 'http://localhost:5173' }))
```

C'est une protection contre les sites malveillants qui essaieraient d'utiliser ton API.

### Injection SQL

L'injection SQL est une attaque où un hacker insère du code SQL malveillant dans les données.

Exemple dangereux :
```javascript
const query = "SELECT * FROM users WHERE email = '" + email + "'"
// Si email = "' OR 1=1 --", la requête devient :
// SELECT * FROM users WHERE email = '' OR 1=1 --'
// Ça retourne tous les utilisateurs !
```

La solution c'est d'utiliser des requêtes préparées avec des placeholders :
```javascript
db.query("SELECT * FROM users WHERE email = ?", [email])
```

Le `?` est remplacé par la valeur de façon sécurisée, sans possibilité d'injection.

---

## 4. BASE DE DONNÉES

### MySQL

MySQL est un système de gestion de base de données relationnelle. "Relationnelle" signifie que les données sont organisées en tables avec des relations entre elles.

C'est une des bases de données les plus utilisées au monde. Elle est gratuite, performante, et bien documentée. Elle était imposée par ta formation.

### Tables

Une table est comme un tableau Excel avec des lignes et des colonnes. Chaque ligne est un enregistrement (un utilisateur, un quiz...), chaque colonne est un champ (email, titre...).

Dans ton projet, tu as 7 tables :
- **users** : Les utilisateurs (email, password, role, is_premium...)
- **quizzes** : Les quiz (title, access_code, user_id...)
- **questions** : Les questions (type, question_text, options, correct_answer...)
- **results** : Les résultats des quiz (score, played_at...)
- **answers** : Les réponses détaillées de chaque question
- **payments** : Les paiements Stripe
- **logs** : Les actions pour l'audit

### Clé primaire (PRIMARY KEY)

La clé primaire est l'identifiant unique de chaque ligne dans une table. Généralement c'est un champ `id` auto-incrémenté.

Chaque quiz a un `id` unique (1, 2, 3...). Ça permet de l'identifier sans ambiguïté et de créer des relations avec d'autres tables.

### Clé étrangère (FOREIGN KEY)

Une clé étrangère crée un lien entre deux tables. C'est un champ qui référence la clé primaire d'une autre table.

Dans la table `quizzes`, le champ `user_id` est une clé étrangère qui pointe vers `id` dans la table `users`. Ça signifie que chaque quiz appartient à un utilisateur.

### CASCADE DELETE

Quand tu supprimes un enregistrement, que faire des enregistrements liés ? CASCADE DELETE les supprime automatiquement.

Si tu supprimes un utilisateur, tous ses quiz sont supprimés. Si tu supprimes un quiz, toutes ses questions et résultats sont supprimés. C'est défini dans la structure de la base avec `ON DELETE CASCADE`.

### Index

Un index est une structure qui accélère les recherches sur une colonne. C'est comme l'index d'un livre qui te permet de trouver rapidement une page.

Sans index, MySQL doit parcourir toute la table pour trouver un email. Avec un index sur `email`, il trouve directement. Les clés primaires et les colonnes `UNIQUE` ont automatiquement un index.

### MCD (Modèle Conceptuel de Données)

Le MCD est un schéma qui montre les entités (objets) et leurs relations de façon abstraite, sans se soucier de la technique.

Par exemple : "Un User possède plusieurs Quiz", "Un Quiz contient plusieurs Questions", "Un Result appartient à un User et à un Quiz".

C'est la première étape de la conception de la base de données.

### MLD (Modèle Logique de Données)

Le MLD traduit le MCD en structure technique : les tables, les colonnes, les types de données, les clés primaires et étrangères.

C'est ce qui permet ensuite d'écrire le script SQL pour créer la base de données.

---

## 5. PAIEMENT STRIPE

### Stripe

Stripe est une plateforme de paiement en ligne utilisée par des millions d'entreprises. Elle est certifiée PCI-DSS, ce qui signifie qu'elle respecte les normes de sécurité les plus strictes pour les paiements.

L'avantage de Stripe c'est qu'on ne manipule jamais les données de carte bancaire. Tout est géré par Stripe, ce qui évite les risques de sécurité et les obligations légales.

### Stripe Checkout

Stripe Checkout est une page de paiement hébergée par Stripe. Au lieu de créer ton propre formulaire de carte bancaire, tu rediriges l'utilisateur vers cette page sécurisée.

Le flux dans ton projet :
1. Le professeur clique sur "Passer Premium"
2. Ton backend crée une session Checkout avec l'API Stripe
3. L'utilisateur est redirigé vers la page Stripe
4. Il saisit ses informations de carte
5. Stripe traite le paiement
6. L'utilisateur est redirigé vers ta page de succès

### Webhook

Un webhook est une URL de ton backend que Stripe appelle automatiquement quand un événement se produit (paiement réussi, échoué, remboursé...).

C'est plus fiable que d'attendre le retour de l'utilisateur car :
- L'utilisateur peut fermer son navigateur avant le retour
- Quelqu'un pourrait simuler un retour réussi

Quand Stripe appelle ton webhook avec l'événement `checkout.session.completed`, tu sais que le paiement est vraiment validé et tu peux mettre à jour `is_premium = true`.

### Signature webhook

Stripe signe chaque appel webhook avec une clé secrète. Ton backend vérifie cette signature pour s'assurer que la requête vient bien de Stripe.

Sans cette vérification, n'importe qui pourrait appeler ton webhook et prétendre qu'un paiement a réussi. La signature garantit l'authenticité.

```javascript
const event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
```

---

## 6. ACCESSIBILITÉ (WCAG)

### WCAG

WCAG (Web Content Accessibility Guidelines) est un ensemble de recommandations internationales pour rendre les sites web accessibles aux personnes en situation de handicap : malvoyants, aveugles, daltoniens, personnes avec un handicap moteur, etc.

Il y a trois niveaux : A (minimum), AA (recommandé), AAA (optimal). Tu vises le niveau AA qui est le standard demandé par la plupart des réglementations.

### Skip Link

Le skip link est un lien caché visuellement mais accessible au clavier et aux lecteurs d'écran. Il permet de sauter directement au contenu principal.

Pour un utilisateur de lecteur d'écran, sans skip link, il devrait écouter tout le menu de navigation à chaque page. Avec le skip link, il peut aller directement au contenu.

```html
<a href="#main-content" class="sr-only focus:not-sr-only">
  Aller au contenu principal
</a>
```

### Attributs ARIA

ARIA (Accessible Rich Internet Applications) est un ensemble d'attributs HTML qui donnent des informations aux technologies d'assistance.

- **aria-label** : Donne un nom accessible à un élément
- **aria-describedby** : Lie un élément à sa description (ex: message d'erreur)
- **aria-invalid** : Indique qu'un champ est en erreur
- **aria-live** : Annonce les changements dynamiques
- **role** : Définit le rôle d'un élément (progressbar, button, etc.)

Dans ton projet, les barres de progression utilisent `role="progressbar"` avec `aria-valuenow`, `aria-valuemin`, `aria-valuemax` pour être compréhensibles par les lecteurs d'écran.

### Focus visible

Quand on navigue au clavier avec Tab, l'élément actif doit avoir un indicateur visuel (généralement un contour). Sans ça, impossible de savoir où on est.

Tailwind CSS fournit des classes comme `focus:ring-2 focus:ring-blue-500` pour styliser le focus.

### Contraste

Le contraste est la différence de luminosité entre le texte et le fond. Un contraste insuffisant rend le texte difficile à lire pour les personnes malvoyantes ou dans certaines conditions (soleil sur l'écran).

WCAG niveau AA demande un ratio minimum de 4.5:1 pour le texte normal et 3:1 pour le texte large.

---

## 7. TESTS

### Vitest

Vitest est un framework de tests JavaScript ultra-rapide, conçu pour fonctionner avec Vite. Il a la même syntaxe que Jest (le framework le plus connu) mais est beaucoup plus rapide.

Tu l'utilises pour écrire des tests qui vérifient automatiquement que ton code fonctionne correctement.

### Test unitaire

Un test unitaire vérifie une fonction ou un composant de façon isolée, sans dépendances externes.

Exemple : tester que la fonction `validateEmail("test@mail.com")` retourne `true` et que `validateEmail("invalid")` retourne `false`.

L'objectif est de tester chaque petite partie du code séparément.

### Test d'intégration

Un test d'intégration vérifie que plusieurs parties du système fonctionnent ensemble.

Exemple : tester que l'endpoint `POST /api/auth/register` crée bien un utilisateur en base de données, hashe le mot de passe, et retourne un token JWT.

On teste le flux complet, pas juste une fonction.

### Supertest

Supertest est une bibliothèque pour tester les APIs HTTP. Elle permet d'envoyer des requêtes à ton serveur Express et de vérifier les réponses.

```javascript
const response = await request(app)
  .post('/api/auth/login')
  .send({ email: 'test@mail.com', password: 'Password123' })

expect(response.status).toBe(200)
expect(response.body.data.token).toBeDefined()
```

### Vue Test Utils

Vue Test Utils est la bibliothèque officielle pour tester les composants Vue. Elle permet de "monter" un composant, simuler des interactions, et vérifier le rendu.

```javascript
const wrapper = mount(ScoreDisplay, { props: { score: 8, total: 10 } })
expect(wrapper.text()).toContain('80%')
```

### Mock

Un mock est un faux objet qui simule le comportement d'une dépendance. Ça permet de tester du code sans avoir besoin de la vraie base de données ou de la vraie API.

Par exemple, tu peux mocker Axios pour qu'il retourne des données prédéfinies au lieu de faire une vraie requête HTTP.

---

## 8. CI/CD

### CI (Continuous Integration)

L'intégration continue signifie que chaque fois que tu push du code, des vérifications automatiques s'exécutent : tests, lint, formatage, build.

Si quelque chose échoue, tu es alerté immédiatement. Ça évite d'introduire des bugs ou du code de mauvaise qualité.

### CD (Continuous Deployment)

Le déploiement continu signifie que si toutes les vérifications passent, le code est automatiquement déployé en production.

Dans ton projet, tu as configuré le CI mais pas le CD (pas de déploiement automatique).

### GitHub Actions

GitHub Actions est le système CI/CD intégré à GitHub. Tu définis un fichier YAML (`.github/workflows/ci.yml`) qui décrit les étapes à exécuter.

Dans ton projet, à chaque push :
1. Checkout du code
2. Installation de Node.js
3. Installation des dépendances (`npm ci`)
4. Vérification du formatage
5. Exécution du lint (ESLint)
6. Exécution des tests

Si une étape échoue, le pipeline s'arrête et tu vois une croix rouge sur GitHub.

### ESLint

ESLint est un outil qui analyse ton code JavaScript pour détecter les erreurs et les mauvaises pratiques.

Il peut signaler :
- Les variables non utilisées
- L'utilisation de `==` au lieu de `===`
- Les imports manquants
- Et beaucoup d'autres problèmes

Tu le configures avec un fichier `.eslintrc.js` pour définir les règles à appliquer.

### Prettier

Prettier est un formateur de code automatique. Il reformate ton code pour qu'il suive un style cohérent : indentation, guillemets simples ou doubles, points-virgules, etc.

Ça évite les débats sur le style de code et garantit que tout le code a la même apparence.

---

## 9. MÉTHODOLOGIE PROJET

### Agile / Scrum

Scrum est une méthodologie de gestion de projet "agile". Au lieu de tout planifier à l'avance et développer pendant des mois, on travaille par petits cycles appelés "sprints" (généralement 2 semaines).

À chaque sprint :
1. **Sprint Planning** : On choisit les tâches à faire
2. **Daily Standup** : Point quotidien sur l'avancement
3. **Sprint Review** : Démonstration de ce qui a été fait
4. **Rétrospective** : Analyse de ce qui a bien/mal fonctionné

L'avantage c'est qu'on peut s'adapter aux changements et livrer régulièrement des fonctionnalités.

### User Story

Une user story décrit une fonctionnalité du point de vue de l'utilisateur. Elle suit le format :

"En tant que [rôle], je veux [action] pour [bénéfice]."

Exemples :
- "En tant que professeur, je veux créer un quiz pour évaluer mes élèves."
- "En tant qu'élève, je veux rejoindre un quiz via un code pour participer à l'évaluation."

Ça permet de se concentrer sur la valeur pour l'utilisateur plutôt que sur les détails techniques.

### Backlog

Le backlog est la liste de toutes les user stories à réaliser, classées par priorité. Les plus importantes sont en haut.

À chaque sprint, on prend les stories en haut du backlog et on les développe.

### MVP (Minimum Viable Product)

Le MVP est la version minimale du produit qui apporte de la valeur. On développe d'abord les fonctionnalités essentielles, puis on améliore ensuite.

Pour QuizMaster, le MVP c'est : créer un compte, créer des quiz, ajouter des questions, passer les quiz, voir les résultats. Le paiement Stripe et l'interface admin sont des ajouts.

### RACI

RACI est une matrice qui clarifie les responsabilités pour chaque tâche :

- **R**esponsible : Qui fait le travail
- **A**ccountable : Qui valide et approuve
- **C**onsulted : Qui est consulté pour avis
- **I**nformed : Qui est informé du résultat

Même sur un projet solo, c'est utile pour clarifier les interactions avec les formateurs et le jury.

### SMART

SMART est une méthode pour définir des objectifs clairs :

- **S**pécifique : Précis et bien défini
- **M**esurable : On peut vérifier s'il est atteint
- **A**tteignable : Réaliste avec les moyens disponibles
- **R**éaliste : Cohérent avec le contexte
- **T**emporel : Avec une échéance

Exemple : "Permettre aux professeurs de créer jusqu'à 20 quiz avant la date de certification" est SMART.

---

## 10. DIAGRAMMES UML

### UML

UML (Unified Modeling Language) est un langage de modélisation graphique. Il permet de représenter visuellement l'architecture d'un système avec différents types de diagrammes.

### Diagramme de cas d'utilisation

Il montre les acteurs (utilisateurs) et ce qu'ils peuvent faire avec le système.

Dans ton projet :
- Professeur : Créer quiz, Ajouter questions, Voir résultats, Passer Premium
- Élève : Rejoindre quiz, Répondre, Voir son score
- Admin : Gérer utilisateurs, Voir statistiques, Consulter logs

### Diagramme de classes

Il montre les entités du système avec leurs attributs, leurs méthodes, et leurs relations.

Par exemple : User (email, password) —possède→ Quiz (title, code) —contient→ Question (text, options)

### Diagramme de séquence

Il montre les échanges entre les composants dans le temps, de haut en bas.

Exemple pour la connexion :
1. User saisit email/password
2. Frontend envoie POST /api/auth/login
3. Backend vérifie en base
4. Backend génère JWT
5. Frontend stocke le token
6. Frontend redirige vers dashboard

### Diagramme d'activité

Il montre les étapes d'un processus comme un flowchart, avec des conditions et des boucles.

Exemple pour jouer un quiz : Saisir code → Quiz existe ? → Oui → Afficher question → Répondre → Dernière question ? → Non → Question suivante / Oui → Afficher score

### Bête à Cornes

Un diagramme simple qui répond à trois questions :
- À qui rend service le système ?
- Sur quoi agit-il ?
- Dans quel but ?

### Diagramme Pieuvre

Il montre la fonction principale (FP) et les fonctions contraintes (FC) du système, avec les éléments externes impliqués.

---

## 11. RGPD

### RGPD

Le RGPD (Règlement Général sur la Protection des Données) est la loi européenne qui protège les données personnelles des utilisateurs. Toute application qui collecte des données de citoyens européens doit s'y conformer.

### Données personnelles

Une donnée personnelle est toute information qui permet d'identifier une personne : nom, email, adresse IP, etc.

Dans ton projet, tu collectes : l'email (pour l'identification) et les résultats de quiz (pour le suivi pédagogique).

### Bases légales

Pour collecter des données, tu dois avoir une base légale :
- **Consentement** : L'utilisateur accepte (inscription)
- **Exécution d'un contrat** : Nécessaire pour le service (paiement)
- **Intérêt légitime** : Besoin justifié (résultats pour le suivi)

### Droits des utilisateurs

Le RGPD donne des droits aux utilisateurs :
- **Droit d'accès** : Voir ses données → `GET /api/auth/me`
- **Droit de suppression** : Supprimer son compte → CASCADE DELETE
- **Droit de rectification** : Modifier ses données
- **Droit de portabilité** : Récupérer ses données dans un format standard

### Minimisation des données

Tu ne dois collecter que les données strictement nécessaires. Dans ton projet, tu ne demandes pas le nom, le prénom ou l'adresse car ce n'est pas nécessaire pour le fonctionnement de l'application.

---

## 12. TERMES DIVERS

### SPA (Single Page Application)

Une SPA est une application web qui ne recharge jamais la page. La navigation est gérée par JavaScript qui modifie le contenu dynamiquement.

Avantages : navigation fluide, expérience utilisateur proche d'une application native.

### LocalStorage

Le localStorage est un espace de stockage dans le navigateur (environ 5 Mo). Les données persistent même après la fermeture du navigateur.

Tu l'utilises pour stocker le token JWT afin que l'utilisateur reste connecté.

### JSON

JSON (JavaScript Object Notation) est un format de données texte, facile à lire et à écrire.

```json
{ "name": "Mon Quiz", "questions": 10, "premium": false }
```

C'est le format standard pour les échanges entre frontend et backend.

### Freemium

Un modèle économique où le service de base est gratuit mais les fonctionnalités avancées sont payantes.

Dans ton projet : 1 quiz gratuit, jusqu'à 20 quiz avec Premium (9,99€).

### Stateless

"Sans état". Le serveur ne garde pas d'information entre les requêtes. Chaque requête contient tout ce qui est nécessaire (le token JWT).

Avantage : le serveur peut être répliqué facilement car il n'y a pas de session à partager.

### Composable

Dans Vue.js, un composable est une fonction réutilisable qui encapsule de la logique avec la Composition API.

Dans ton projet, `useSeo()` est un composable qui gère les meta tags pour le SEO.

---

## 13. CODES HTTP À CONNAÎTRE

| Code | Nom | Quand l'utiliser |
|------|-----|------------------|
| 200 | OK | Requête réussie |
| 201 | Created | Ressource créée avec succès |
| 400 | Bad Request | Données invalides envoyées par le client |
| 401 | Unauthorized | Non authentifié (pas de token ou token invalide) |
| 403 | Forbidden | Authentifié mais pas autorisé (mauvais rôle) |
| 404 | Not Found | Ressource non trouvée |
| 409 | Conflict | Conflit (email déjà utilisé) |
| 500 | Internal Server Error | Erreur côté serveur |

---

## 14. QUESTIONS PROBABLES DU JURY

### "Pourquoi avez-vous choisi Vue.js plutôt que React ?"

Vue.js offre une courbe d'apprentissage plus douce avec une documentation excellente. L'écosystème est cohérent avec Pinia et Vue Router qui s'intègrent parfaitement. De plus, Vue.js était imposé par la formation, ce qui renforce ce choix. Pour un projet solo, la simplicité de Vue permet d'être productif rapidement.

### "Expliquez-moi comment fonctionne l'authentification"

L'utilisateur s'inscrit en fournissant email, mot de passe et rôle. Le mot de passe est hashé avec bcrypt (10 rounds) avant d'être stocké en base. À la connexion, bcrypt.compare vérifie si le mot de passe correspond au hash. Si oui, le serveur génère un token JWT contenant l'id et le rôle de l'utilisateur. Ce token est stocké dans localStorage côté client. À chaque requête API, un intercepteur Axios ajoute le token dans le header Authorization. Côté serveur, le middleware authenticateToken vérifie la validité du token avant d'autoriser l'accès aux routes protégées.

### "Comment sécurisez-vous l'application ?"

Plusieurs couches de sécurité sont implémentées :
- Les mots de passe sont hashés avec bcrypt, jamais stockés en clair
- L'authentification utilise JWT avec une durée d'expiration
- Les requêtes SQL utilisent des requêtes préparées pour éviter les injections
- Helmet.js ajoute des headers de sécurité HTTP
- CORS limite les origines autorisées à appeler l'API
- La validation des entrées côté serveur vérifie toutes les données

### "Qu'est-ce qu'un middleware ?"

Un middleware est une fonction qui s'exécute entre la réception de la requête et l'envoi de la réponse. Les middlewares s'enchaînent comme des couches. Par exemple, pour créer un quiz, la requête passe d'abord par authenticateToken qui vérifie le JWT, puis requireProf qui vérifie le rôle, puis validateQuiz qui vérifie les données, et enfin le controller qui crée le quiz. Si un middleware échoue, la chaîne s'arrête.

### "Comment fonctionne l'intégration Stripe ?"

Quand le professeur clique sur "Passer Premium", le backend crée une session Stripe Checkout avec les détails du produit et le prix. L'utilisateur est redirigé vers la page de paiement hébergée par Stripe. Après le paiement, Stripe appelle notre webhook avec l'événement checkout.session.completed. Le backend vérifie la signature de la requête pour s'assurer qu'elle vient bien de Stripe, puis met à jour is_premium à true et enregistre le paiement en base.

### "Quelle est la différence entre MCD et MLD ?"

Le MCD (Modèle Conceptuel de Données) est un schéma abstrait qui montre les entités et leurs relations sans détails techniques. Par exemple : "Un User possède plusieurs Quiz". Le MLD (Modèle Logique de Données) traduit ce concept en structure technique avec les tables, colonnes, types de données, clés primaires et étrangères. C'est le MLD qui permet d'écrire le script SQL de création de la base.

### "Pourquoi avoir mis en place des tests automatisés ?"

Les tests automatisés permettent de détecter les bugs avant qu'ils n'arrivent en production. Quand on modifie du code, les tests vérifient qu'on n'a rien cassé (régression). Ils servent aussi de documentation car ils montrent comment le code doit fonctionner. Sur le long terme, c'est un gain de temps car on évite les bugs difficiles à trouver.

### "Qu'est-ce que le CI/CD ?"

CI (Continuous Integration) signifie qu'à chaque push de code, des vérifications automatiques s'exécutent : lint, formatage, tests. Si quelque chose échoue, on est alerté immédiatement. CD (Continuous Deployment) signifie que si tout passe, le code est automatiquement déployé. Dans mon projet, j'ai configuré le CI avec GitHub Actions : à chaque push, le pipeline installe les dépendances, vérifie le formatage, exécute ESLint, et lance les tests.

---

## 15. CHIFFRES CLÉS À RETENIR

- **199 tests** au total (50 backend + 149 frontend)
- **25+ endpoints** API REST
- **15+ composants** Vue.js
- **7 tables** en base de données (users, quizzes, questions, results, answers, payments, logs)
- **3 rôles** utilisateurs : prof, élève, admin
- **bcrypt 10 rounds** pour le hashage des mots de passe
- **WCAG 2.1 niveau AA** pour l'accessibilité
- **9,99€** pour le Premium (jusqu'à 20 quiz)
- **1 quiz** en version gratuite
- **5 caractères** pour le code d'accès aux quiz
