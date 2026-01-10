# Questions / Reponses - Preparation Jury

## Table des matieres

1. [Questions Backend (Bloc 3)](#questions-backend-bloc-3)
2. [Questions Frontend (Bloc 2)](#questions-frontend-bloc-2)
3. [Questions Transversales](#questions-transversales)
4. [Questions Pieges Classiques](#questions-pieges-classiques)

---

# Questions Backend (Bloc 3)

## Architecture et API

### Q: Pourquoi avoir choisi une architecture REST plutot que GraphQL ?

**Reponse:**
- REST est plus simple a implementer et a comprendre pour une application CRUD classique
- GraphQL serait over-engineering pour notre cas d'usage
- REST est mieux supporte par les outils (Swagger, Postman)
- Notre application n'a pas de requetes complexes necessitant GraphQL
- Plus facile a cacher (HTTP caching natif)

### Q: Expliquez la structure de vos reponses API

**Reponse:**
```json
// Succes
{ "success": true, "data": { ... } }

// Erreur
{ "success": false, "error": { "code": "NOT_FOUND", "message": "Quiz non trouve" } }
```
- **Coherence** : Meme format partout, facile a parser cote client
- **Code d'erreur** : Permet au frontend de reagir differemment selon l'erreur
- **Message** : Affichable directement a l'utilisateur

### Q: Qu'est-ce qu'un middleware ? Donnez un exemple

**Reponse:**
Un middleware est une fonction qui s'execute ENTRE la reception de la requete et le controller. Elle peut :
- Modifier la requete (ajouter des donnees)
- Bloquer la requete (erreur 401/403)
- Logger des informations

**Exemple concret dans mon code (`auth.middleware.js`):**
```javascript
function authenticateToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1]

    if (!token) {
        return res.status(401).json({ error: 'Token manquant' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded  // Ajoute l'utilisateur a la requete
    next()  // Passe au middleware/controller suivant
}
```

### Q: Pourquoi utiliser des variables d'environnement (.env) ?

**Reponse:**
- **Securite** : Les secrets (JWT_SECRET, STRIPE_KEY) ne sont pas dans le code
- **Flexibilite** : Differentes configs pour dev/prod sans changer le code
- **Git** : Le .env est dans .gitignore, jamais commite
- **Standard** : Pratique universelle, package `dotenv`

---

## Base de donnees

### Q: Expliquez vos relations entre tables

**Reponse:**
```
users (1) ──── (N) quizzes : Un prof peut avoir plusieurs quiz
quizzes (1) ──── (N) questions : Un quiz a plusieurs questions
quizzes (1) ──── (N) results : Un quiz peut etre joue plusieurs fois
users (1) ──── (N) results : Un eleve peut jouer plusieurs quiz
results (1) ──── (N) answers : Un resultat contient plusieurs reponses
```

### Q: Qu'est-ce que ON DELETE CASCADE et pourquoi l'utiliser ?

**Reponse:**
Quand on supprime un enregistrement parent, tous les enfants sont supprimes automatiquement.

**Exemple:** Si je supprime un quiz :
- Toutes ses questions sont supprimees
- Tous ses resultats sont supprimes
- Toutes les reponses de ces resultats sont supprimees

**Avantage:** Pas de donnees orphelines en base, integrite garantie.

### Q: Pourquoi stocker les options en JSON ?

**Reponse:**
```sql
options JSON -- ["Paris", "Londres", "Berlin", "Madrid"]
```
- **Flexibilite** : Nombre d'options variable (2 pour V/F, 4 pour QCM)
- **Simplicite** : Une seule colonne au lieu de 4 colonnes option1, option2...
- **MySQL 5.7+** : Support natif du JSON avec fonctions de requete

---

## Authentification et Securite

### Q: Comment fonctionne JWT ? Expliquez le flux complet

**Reponse:**

**1. Connexion:**
```
Client: POST /api/auth/login { email, password }
Serveur: Verifie password avec bcrypt.compare()
Serveur: Genere token = jwt.sign({ userId, role }, SECRET, { expiresIn: '7d' })
Serveur: Retourne { token: "eyJhbG..." }
Client: Stocke dans localStorage
```

**2. Requetes authentifiees:**
```
Client: GET /api/quizzes + Header "Authorization: Bearer eyJhbG..."
Serveur: jwt.verify(token, SECRET) → { userId: 1, role: 'prof' }
Serveur: req.user = decoded
Serveur: Traite la requete avec l'identite de l'utilisateur
```

**3. Structure du token:**
```
eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjF9.signature
[Header base64].[Payload base64].[Signature]
```

### Q: Pourquoi JWT plutot que les sessions ?

**Reponse:**
| JWT | Sessions |
|-----|----------|
| Stateless (pas de stockage serveur) | Stockage en memoire/Redis |
| Scalable (multi-serveurs facile) | Sticky sessions necessaires |
| Mobile-friendly | Cookies problematiques sur mobile |
| Auto-expire | Gestion manuelle de l'expiration |

### Q: Comment securisez-vous les mots de passe ?

**Reponse:**
```javascript
// Inscription : hashage avec bcrypt (10 rounds)
const hashedPassword = await bcrypt.hash(password, 10)
// Resultat: "$2b$10$N9qo8uLOickgx2ZMRZoMyeG..."

// Connexion : comparaison securisee
const isValid = await bcrypt.compare(password, hashedPassword)
```

**Pourquoi bcrypt ?**
- **Salt automatique** : Chaque hash est unique meme pour le meme mot de passe
- **Lent volontairement** : 10 rounds = ~100ms, rend le brute-force impossible
- **Irreversible** : Impossible de retrouver le mot de passe original

### Q: A quoi sert Helmet ?

**Reponse:**
Helmet ajoute des headers HTTP de securite automatiquement :
- `X-Content-Type-Options: nosniff` : Empeche le sniffing MIME
- `X-Frame-Options: DENY` : Bloque l'iframe (clickjacking)
- `Strict-Transport-Security` : Force HTTPS
- `Content-Security-Policy` : Limite les sources de scripts

---

## Stripe et Paiement

### Q: Expliquez le flux de paiement Stripe

**Reponse:**
```
1. Client clique "Passer Premium"
2. Frontend appelle POST /api/payment/create-checkout
3. Backend cree une session Stripe Checkout
4. Backend retourne l'URL de paiement Stripe
5. Client est redirige vers Stripe (page securisee)
6. Client paie sur Stripe
7. Stripe appelle notre webhook POST /api/payment/webhook
8. Webhook verifie la signature et met a jour is_premium = true
9. Client est redirige vers /payment/success
```

### Q: Pourquoi utiliser un webhook plutot que verifier apres redirect ?

**Reponse:**
- **Fiabilite** : Le client peut fermer son navigateur, le webhook arrive quand meme
- **Securite** : Le webhook est signe par Stripe, impossible a falsifier
- **Asynchrone** : Le paiement peut prendre du temps (3D Secure)

---

# Questions Frontend (Bloc 2)

## Vue.js

### Q: Qu'est-ce que la Composition API ? Pourquoi l'utiliser ?

**Reponse:**
La Composition API est la nouvelle facon d'ecrire des composants Vue 3 avec `<script setup>`.

**Avantages vs Options API:**
- **Logique regroupee** : Code organise par fonctionnalite, pas par type
- **Reutilisable** : Facile d'extraire en composables
- **TypeScript** : Meilleure inference de types
- **Moins verbeux** : Pas besoin de `this.`, `methods:`, `computed:`

**Exemple:**
```javascript
// Composition API
const count = ref(0)
const doubled = computed(() => count.value * 2)
function increment() { count.value++ }

// vs Options API
export default {
  data() { return { count: 0 } },
  computed: { doubled() { return this.count * 2 } },
  methods: { increment() { this.count++ } }
}
```

### Q: Quelle est la difference entre ref() et reactive() ?

**Reponse:**
```javascript
// ref : pour les valeurs primitives
const count = ref(0)
count.value++  // Necessite .value

// reactive : pour les objets
const user = reactive({ name: 'Jean', age: 25 })
user.age++  // Pas de .value
```

**Conseil:** Utiliser `ref()` par defaut, plus previsible.

### Q: Qu'est-ce qu'un composable ?

**Reponse:**
Un composable est une fonction qui encapsule de la logique reactive reutilisable.

**Exemple dans mon code (`useSeo.js`):**
```javascript
export function useSeo(options) {
  document.title = options.title
  updateMetaTag('description', options.description)
}

// Utilisation dans une vue
import { useSeo, seoPresets } from '../composables/useSeo'
useSeo(seoPresets.home)
```

---

## Pinia

### Q: Pourquoi Pinia plutot que Vuex ?

**Reponse:**
- **Plus simple** : Pas de mutations, actions directes
- **TypeScript natif** : Inference complete
- **Composition API** : S'integre naturellement
- **DevTools** : Meilleur support
- **Officiel** : Recommande par l'equipe Vue

### Q: Expliquez la structure de votre store auth

**Reponse:**
```javascript
export const useAuthStore = defineStore('auth', () => {
  // STATE : donnees reactives
  const user = ref(null)
  const token = ref(localStorage.getItem('token'))

  // GETTERS : valeurs calculees
  const isAuthenticated = computed(() => !!token.value)
  const isProf = computed(() => user.value?.role === 'prof')

  // ACTIONS : fonctions qui modifient le state
  async function login(email, password) {
    const response = await api.post('/auth/login', { email, password })
    token.value = response.data.data.token
    localStorage.setItem('token', token.value)
  }

  return { user, token, isAuthenticated, isProf, login }
})
```

---

## Vue Router

### Q: Qu'est-ce qu'un guard de navigation ?

**Reponse:**
Un guard est une fonction qui s'execute AVANT d'entrer sur une route. Il peut :
- Autoriser la navigation
- Rediriger vers une autre page
- Annuler la navigation

**Exemple dans mon code:**
```javascript
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  // Route protegee mais pas connecte
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return next('/auth')  // Redirect vers login
  }

  // Route prof mais user est eleve
  if (to.meta.role === 'prof' && !authStore.isProf) {
    return next('/dashboard')  // Redirect
  }

  next()  // OK, continuer
})
```

---

## SEO

### Q: Pourquoi le SEO est difficile avec une SPA ?

**Reponse:**
Une SPA (Single Page Application) en mode CSR (Client-Side Rendering) :
1. Serveur envoie un HTML quasi-vide `<div id="app"></div>`
2. JavaScript construit le contenu dans le navigateur
3. Google voit la page vide au depart

**Solution implementee:** Composable `useSeo` qui met a jour dynamiquement les meta tags.

**Alternative pour SEO optimal:** Nuxt.js (SSR)

### Q: Qu'est-ce que l'Open Graph ?

**Reponse:**
Open Graph sont des meta tags pour controler l'apercu quand le lien est partage sur les reseaux sociaux.

```html
<meta property="og:title" content="QuizMaster" />
<meta property="og:description" content="Creez des quiz..." />
<meta property="og:image" content="https://quizmaster.app/preview.png" />
```

**Resultat sur Facebook/LinkedIn:** Apercu avec titre, description et image.

---

## Accessibilite

### Q: Qu'est-ce que WCAG ?

**Reponse:**
WCAG = Web Content Accessibility Guidelines. Standards internationaux pour l'accessibilite web.

**3 niveaux:**
- **A** : Minimum vital (obligatoire)
- **AA** : Standard recommande (exige par le RGAA en France)
- **AAA** : Excellence (optionnel)

**4 principes (POUR):**
1. **Perceptible** : Contenu accessible a tous
2. **Operable** : Interface utilisable au clavier
3. **Understandable** : Contenu comprehensible
4. **Robust** : Compatible avec les technologies d'assistance

### Q: A quoi sert un skip link ?

**Reponse:**
Le skip link permet aux utilisateurs de clavier de sauter directement au contenu principal, sans naviguer a travers tout le menu.

```html
<a href="#main-content" class="sr-only focus:not-sr-only">
  Aller au contenu principal
</a>
```

**Critere WCAG:** 2.4.1 - Bypass Blocks (Niveau A)

### Q: Expliquez aria-live

**Reponse:**
`aria-live` annonce aux lecteurs d'ecran quand le contenu change dynamiquement.

```html
<!-- Annonce immediate (erreurs) -->
<p aria-live="assertive">Mot de passe incorrect</p>

<!-- Annonce quand l'utilisateur est inactif -->
<p aria-live="polite">Quiz sauvegarde</p>
```

---

# Questions Transversales

## Tests

### Q: Pourquoi tester ? Quels types de tests avez-vous ?

**Reponse:**
**Pourquoi:**
- Detecter les bugs avant production
- Documenter le comportement attendu
- Refactorer en confiance
- Detecter les regressions

**Mes tests:**
| Type | Outil | Nombre |
|------|-------|--------|
| Tests API (integration) | Vitest + Supertest | 50 |
| Tests composants Vue | Vitest + Vue Test Utils | 81 |
| Tests unitaires (validators) | Vitest | 39 |
| **Total** | | **178** |

### Q: Quelle est la difference entre mock et stub ?

**Reponse:**
- **Mock** : Simule un objet complet, verifie les appels
- **Stub** : Remplace une fonction avec une valeur fixe

```javascript
// Mock : verifie que api.post a ete appele
vi.mock('../services/api')
api.post.mockResolvedValue({ data: { token: 'xxx' } })
expect(api.post).toHaveBeenCalledWith('/auth/login', { email, password })

// Stub : remplace localStorage
const localStorageMock = { getItem: () => 'token', setItem: vi.fn() }
```

---

## CI/CD

### Q: Expliquez votre pipeline CI/CD

**Reponse:**
```yaml
# Declencheurs
on: push/pull_request sur main/develop

# Jobs paralleles
jobs:
  backend:
    - npm ci          # Install dependencies
    - npm run lint    # Verifier ESLint
    - npm run format:check  # Verifier Prettier
    - npm test        # 50 tests

  frontend:
    - npm ci
    - npm run lint
    - npm run format:check
    - npm test        # 149 tests
    - npm run build   # Build production
```

**Avantages:**
- Detection precoce des bugs
- Code standardise
- Impossible de merger du code casse

### Q: Difference entre ESLint et Prettier ?

**Reponse:**
| ESLint | Prettier |
|--------|----------|
| Qualite du code | Formatage |
| Detecte les erreurs logiques | Indentation, quotes, virgules |
| `no-unused-vars`, `eqeqeq` | Tabs vs spaces |
| Configure avec des regles | Opinion forte, peu configurable |

**Bonne pratique:** ESLint pour la qualite, Prettier pour le formatage. Ne jamais melanger.

---

# Questions Pieges Classiques

### Q: Quelle est la difference entre == et === ?

**Reponse:**
- `==` : Comparaison avec coercion de type (DANGEREUX)
- `===` : Comparaison stricte (TOUJOURS utiliser)

```javascript
"5" == 5   // true (coercion)
"5" === 5  // false (types differents)

null == undefined  // true
null === undefined // false
```

### Q: Qu'est-ce que async/await ?

**Reponse:**
Syntaxe moderne pour gerer les operations asynchrones (promesses).

```javascript
// Avec .then()
api.post('/login', data)
  .then(response => { token = response.data.token })
  .catch(error => { console.error(error) })

// Avec async/await (plus lisible)
async function login() {
  try {
    const response = await api.post('/login', data)
    token = response.data.token
  } catch (error) {
    console.error(error)
  }
}
```

### Q: Expliquez le CORS

**Reponse:**
CORS = Cross-Origin Resource Sharing. Securite navigateur qui bloque les requetes vers un domaine different.

**Probleme:** Frontend sur `localhost:5173`, API sur `localhost:3000` = origines differentes.

**Solution Backend:**
```javascript
app.use(cors({
  origin: 'http://localhost:5173',  // Autorise le frontend
  credentials: true
}))
```

### Q: Qu'est-ce que le localStorage ? Limites ?

**Reponse:**
Stockage cle-valeur persistant dans le navigateur.

```javascript
localStorage.setItem('token', 'xxx')
localStorage.getItem('token')
localStorage.removeItem('token')
```

**Limites:**
- ~5MB max
- Synchrone (bloque le thread)
- Pas securise (accessible via JS, XSS)
- Pas de date d'expiration

---

## Conseils pour le Jury

1. **Ne pas inventer** : Si tu ne sais pas, dis "Je ne sais pas mais je peux chercher"
2. **Donner des exemples concrets** : Reference ton code
3. **Expliquer le POURQUOI** : Pas juste le QUOI
4. **Avouer les limites** : "J'aurais pu faire X mais j'ai choisi Y parce que..."
5. **Montrer la documentation** : Prouve que tu comprends ce que tu as fait
