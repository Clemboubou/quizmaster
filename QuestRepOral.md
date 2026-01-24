# Questions / Réponses pour l'Oral - Soutenance QuizMaster

## Table des matières

1. [Questions par slide](#questions-par-slide)
2. [Questions pièges techniques](#questions-pièges-techniques)
3. [Questions pièges sur tes choix](#questions-pièges-sur-tes-choix)
4. [Questions sur ce que tu n'as PAS fait](#questions-sur-ce-que-tu-nas-pas-fait)
5. [Questions personnelles / parcours](#questions-personnelles--parcours)
6. [Questions de mise en situation](#questions-de-mise-en-situation)
7. [Anti-sèche finale](#anti-sèche-finale)

---

# QUESTIONS PAR SLIDE

## SLIDE 2 – Introduction

**Pourquoi ce projet ?**
> "Ce projet couvre toutes les compétences du référentiel : authentification, CRUD, base de données relationnelle, sécurité, tests et paiement en ligne. C'est un projet complet et concret qui répond à un vrai besoin."

**C'est quoi une reconversion ?**
> "C'est un changement de métier. Je viens d'un autre domaine et j'ai décidé de me former au développement web pour en faire mon nouveau métier."

**Pourquoi le domaine de l'éducation ?**
> "C'est un domaine qui me parle et qui a un vrai besoin de digitalisation. Les quiz en ligne permettent aux profs de gagner du temps et aux élèves d'apprendre de façon plus interactive."

---

## SLIDE 3 – Technologies utilisées

**Pourquoi Vue et pas React ?**
> "Vue est la technologie que j'ai apprise en formation. Elle est très bien documentée, notamment en français. React est sur ma liste d'apprentissage."

**Pourquoi pas TypeScript ?**
> "Je voulais d'abord bien maîtriser JavaScript. TypeScript apporte de la sécurité de typage, mais aussi de la complexité. C'est prévu pour une version future."

**C'est quoi Pinia ?**
> "C'est un gestionnaire d'état global. C'est comme un tableau blanc partagé : toutes les pages peuvent accéder aux mêmes données, comme l'utilisateur connecté."

**Pourquoi Tailwind et pas Bootstrap ?**
> "Tailwind est plus flexible et plus moderne. Il permet de créer un design unique sans être limité par des composants prédéfinis. J'ai plus de contrôle sur le rendu."

---

## SLIDE 4 – Architecture globale

**C'est quoi une API ?**
> "C'est une interface qui permet à deux logiciels de communiquer. Comme un serveur au restaurant : je passe ma commande, il va en cuisine et me ramène mon plat."

**Pourquoi séparer frontend et backend ?**
> "Pour la maintenabilité. Je peux modifier le frontend sans toucher au backend. Et pour la sécurité : le frontend ne doit jamais accéder directement à la base de données."

**C'est quoi une architecture 3-tiers ?**
> "C'est la séparation en 3 couches : présentation (frontend), logique métier (backend), et données (base de données). Chaque couche a sa responsabilité."

---

## SLIDE 5 – Organisation du code frontend

**C'est quoi un composant ?**
> "C'est un morceau d'interface réutilisable. Plutôt que de recopier le code d'une carte de quiz 10 fois, je crée un composant QuizCard et je l'utilise 10 fois."

**Différence entre views et components ?**
> "Les views sont des pages complètes liées à une URL. Les components sont des morceaux réutilisables qu'on peut mettre dans plusieurs pages."

**C'est quoi la Composition API ?**
> "C'est la nouvelle façon d'écrire des composants Vue 3. Le code est regroupé par fonctionnalité plutôt que par type (data, methods, computed). C'est plus lisible."

---

## SLIDE 6 – Gestion de l'utilisateur connecté

**Pourquoi localStorage et pas cookies ?**
> "C'est plus simple à implémenter pour une SPA. Je sais que les cookies HttpOnly seraient plus sécurisés car inaccessibles par JavaScript, mais je ne maîtrise pas encore cette implémentation."

**C'est quoi un token JWT ?**
> "C'est comme un bracelet de festival. Il contient mon id et mon rôle, signé par le serveur. On ne peut pas le modifier sans la clé secrète."

**C'est quoi XSS ?**
> "Cross-Site Scripting. Une attaque où du JavaScript malveillant est injecté dans la page. Helmet limite ce risque via Content-Security-Policy."

**Le token est-il chiffré ?**
> "Non, il est encodé en base64, pas chiffré. N'importe qui peut lire son contenu. Mais il est SIGNÉ, donc on ne peut pas le modifier sans invalider la signature."

---

## SLIDE 7 – Protection des pages

**Et si quelqu'un modifie le localStorage ?**
> "Il pourrait voir la page frontend, mais il ne pourrait rien faire. Chaque requête API vérifie le token côté serveur. Un faux token serait rejeté avec une erreur 401."

**C'est sécurisé côté frontend ?**
> "La sécurité frontend, c'est de l'UX, pas de la vraie sécurité. La vraie protection est toujours côté backend avec les middlewares."

**Que se passe-t-il si le token expire pendant la navigation ?**
> "L'utilisateur reçoit une erreur 401 et est redirigé vers la page de connexion. Mon intercepteur Axios gère ça automatiquement."

---

## SLIDE 8 – Design et accessibilité

**C'est quoi WCAG ?**
> "Web Content Accessibility Guidelines. Ce sont les normes internationales pour rendre un site accessible aux personnes handicapées. J'ai visé le niveau AA."

**C'est quoi mobile-first ?**
> "Je développe d'abord pour mobile, puis j'adapte pour les écrans plus grands avec des media queries. C'est plus efficace que l'inverse."

**Tu as testé avec un lecteur d'écran ?**
> "Non, par manque de temps et de matériel. C'est une amélioration prévue. J'ai quand même mis des labels et des attributs ARIA sur les éléments importants."

---

## SLIDE 9 – Tests frontend

**Pourquoi autant de tests ?**
> "Pour apprendre les bonnes pratiques. En entreprise, les tests sont obligatoires. 199 tests, c'est inhabituel pour un projet junior, mais ça m'a permis de détecter des bugs tôt."

**C'est quoi un test unitaire ?**
> "Un test qui vérifie une petite partie du code de manière isolée, comme une fonction de validation ou un composant."

**C'est quoi un mock ?**
> "C'est un faux objet qui simule le comportement d'une dépendance. Par exemple, je mock Axios pour ne pas faire de vraies requêtes HTTP pendant les tests."

**Tu testes quoi exactement ?**
> "Les validateurs (email, mot de passe), les stores Pinia (connexion, déconnexion), et les composants Vue (affichage, événements)."

---

## SLIDE 11 – Base de données

**C'est quoi une clé étrangère ?**
> "C'est une colonne qui pointe vers une autre table. Par exemple, quiz.user_id pointe vers users.id. Ça crée une relation entre les tables."

**Pourquoi MySQL et pas MongoDB ?**
> "Mes données sont relationnelles : un user a des quiz, un quiz a des questions. MySQL gère ça avec des clés étrangères. MongoDB serait mieux pour des données flexibles sans relations."

**C'est quoi CASCADE DELETE ?**
> "Quand je supprime un utilisateur, tous ses quiz, questions et résultats sont supprimés automatiquement. Comme supprimer un dossier supprime les fichiers dedans."

**Pourquoi pas un ORM comme Sequelize ?**
> "J'ai voulu comprendre le SQL directement avant d'utiliser une abstraction. En entreprise, un ORM serait pertinent pour la productivité."

**C'est quoi un index ?**
> "C'est une structure qui accélère les recherches sur une colonne. J'ai des index sur les clés étrangères pour optimiser les jointures."

---

## SLIDE 12 – Structure de l'API

**C'est quoi REST ?**
> "C'est un style d'architecture pour les API qui utilise les verbes HTTP (GET, POST, PUT, DELETE) et des URLs qui représentent des ressources."

**Pourquoi standardiser les réponses ?**
> "Le frontend sait toujours à quoi s'attendre. Il vérifie success, puis affiche data ou error. Pas de surprise."

**C'est quoi un endpoint ?**
> "C'est une URL spécifique de l'API qui effectue une action. Par exemple, POST /api/auth/login pour se connecter."

**Différence entre PUT et PATCH ?**
> "PUT remplace toute la ressource, PATCH modifie partiellement. J'utilise PUT pour simplifier, mais PATCH serait plus correct pour des modifications partielles."

---

## SLIDE 13 – Sécurité

**C'est quoi une injection SQL ?**
> "C'est quand un attaquant met du code SQL dans un champ de formulaire. Les requêtes préparées échappent les données automatiquement."

**C'est quoi bcrypt ?**
> "Un algorithme de hashage pour les mots de passe. On ne peut pas retrouver le mot de passe original. Pour vérifier, on re-hashe et on compare."

**C'est quoi le salt ?**
> "Une chaîne aléatoire ajoutée au mot de passe avant le hashage. Ça fait que deux mots de passe identiques ont des hashs différents."

**Ton app est-elle sécurisée ?**
> "Les bases sont solides : bcrypt, requêtes préparées, JWT, Helmet. Pour la production, il faudrait ajouter HTTPS, rate limiting et cookies HttpOnly."

**C'est quoi CORS ?**
> "Cross-Origin Resource Sharing. Ça contrôle quels domaines peuvent appeler mon API. J'autorise seulement mon frontend."

---

## SLIDE 14 – Middlewares

**C'est quoi next() ?**
> "C'est la fonction qui passe au middleware suivant. Si je ne l'appelle pas, la requête s'arrête là."

**Différence entre 401 et 403 ?**
> "401 Unauthorized = pas authentifié (pas de token). 403 Forbidden = authentifié mais pas autorisé (mauvais rôle)."

**L'ordre des middlewares est important ?**
> "Oui ! D'abord authenticateToken (vérifier qu'on est connecté), puis requireProf (vérifier le rôle). L'inverse ne marcherait pas."

---

## SLIDE 15 – Paiement Stripe

**C'est quoi un webhook ?**
> "C'est une URL que Stripe appelle automatiquement quand un événement se produit. Comme un livreur qui te prévient quand il arrive."

**Pourquoi vérifier la signature ?**
> "Pour être sûr que le webhook vient de Stripe. Sans ça, n'importe qui pourrait simuler un paiement réussi en appelant mon URL."

**Et si le webhook échoue ?**
> "Stripe réessaie automatiquement pendant 72 heures. Mais je n'ai pas implémenté de logs pour tracer les erreurs."

**Pourquoi Stripe et pas PayPal ?**
> "Stripe a une meilleure documentation, une API plus moderne, et le mode test est très pratique pour développer."

**Tu gères les remboursements ?**
> "Non, ce n'est pas dans le MVP. En production, il faudrait ajouter cette fonctionnalité via l'API Stripe."

---

## SLIDE 16 – Tests backend

**C'est quoi un test d'intégration ?**
> "Un test qui vérifie plusieurs composants ensemble. Mes tests API appellent vraiment les routes et vérifient les réponses complètes."

**Tu testes les erreurs aussi ?**
> "Oui, je vérifie qu'un email invalide retourne 400, qu'un utilisateur non connecté retourne 401, etc."

**Comment tu testes sans vraie base de données ?**
> "J'utilise une base de données de test qui est vidée avant chaque test. Comme ça, les tests sont indépendants."

---

## SLIDE 17 – CI/CD

**C'est quoi CI/CD ?**
> "CI = Continuous Integration : vérifications automatiques à chaque push. CD = Continuous Deployment : déploiement automatique. J'ai fait le CI."

**Pourquoi npm ci et pas npm install ?**
> "npm ci est plus rapide et utilise exactement les versions du package-lock.json. C'est recommandé pour le CI."

**Si les tests échouent, que se passe-t-il ?**
> "Le pipeline s'arrête et je suis notifié. Le code ne peut pas être mergé tant que les tests ne passent pas."

---

# QUESTIONS PIÈGES TECHNIQUES

## JavaScript / Node.js

**Différence entre == et === ?**
> "== compare avec conversion de type (dangereux). === compare strictement sans conversion. Toujours utiliser ===."

**Différence entre let, const et var ?**
> "var a un scope de fonction et peut être redéclaré (à éviter). let a un scope de bloc. const ne peut pas être réassigné. J'utilise const par défaut."

**C'est quoi async/await ?**
> "C'est une façon d'écrire du code asynchrone de manière lisible. await attend qu'une promesse se résolve avant de continuer."

**C'est quoi une promesse ?**
> "C'est un objet qui représente une valeur qui sera disponible plus tard. Elle peut être résolue (succès) ou rejetée (erreur)."

**C'est quoi le event loop ?**
> "C'est le mécanisme qui permet à Node.js de gérer plusieurs opérations en même temps malgré le fait qu'il soit single-threaded. Honnêtement, je ne maîtrise pas tous les détails."

---

## Vue.js

**Différence entre ref() et reactive() ?**
> "ref() pour les valeurs primitives (nécessite .value), reactive() pour les objets. J'utilise ref() par défaut car c'est plus prévisible."

**C'est quoi le cycle de vie d'un composant ?**
> "Les différentes étapes : création, montage, mise à jour, destruction. J'utilise surtout onMounted() pour charger des données au démarrage."

**C'est quoi v-model ?**
> "C'est une directive qui crée une liaison bidirectionnelle entre un input et une variable. Quand l'un change, l'autre aussi."

**Différence entre computed et watch ?**
> "computed recalcule automatiquement quand ses dépendances changent. watch permet d'exécuter du code quand une valeur change. computed pour les valeurs dérivées, watch pour les effets de bord."

---

## Base de données

**C'est quoi ACID ?**
> "Atomicité, Cohérence, Isolation, Durabilité. Ce sont les propriétés d'une transaction fiable. MySQL les garantit."

**C'est quoi une transaction ?**
> "Un ensemble d'opérations qui doivent toutes réussir ou toutes échouer. Si une échoue, on annule tout (rollback)."

**C'est quoi la normalisation ?**
> "C'est organiser les données pour éviter la redondance. Par exemple, je ne stocke pas le nom du prof dans chaque quiz, je stocke juste user_id."

**Différence entre INNER JOIN et LEFT JOIN ?**
> "INNER JOIN retourne seulement les lignes qui ont une correspondance. LEFT JOIN retourne tout de la table de gauche, même sans correspondance."

---

## Sécurité

**C'est quoi CSRF ?**
> "Cross-Site Request Forgery. Une attaque où un site malveillant fait des requêtes à ton nom. Avec JWT en header, je suis naturellement protégé car le token n'est pas envoyé automatiquement comme un cookie."

**C'est quoi HTTPS ?**
> "HTTP + chiffrement SSL/TLS. Les données sont chiffrées entre le client et le serveur. Obligatoire en production."

**C'est quoi le OWASP Top 10 ?**
> "La liste des 10 vulnérabilités web les plus critiques. J'ai protégé contre l'injection SQL et XSS, mais il y en a d'autres que je n'ai pas traitées."

**Tu stockes des données sensibles ?**
> "Juste l'email et le mot de passe hashé. Pas de données vraiment sensibles comme des numéros de carte bancaire — Stripe gère ça."

---

# QUESTIONS PIÈGES SUR TES CHOIX

**Pourquoi 10 rounds pour bcrypt et pas plus ?**
> "C'est le standard recommandé. Plus de rounds = plus sécurisé mais plus lent. 10 est un bon équilibre pour une application web."

**Ton JWT expire au bout de combien de temps ?**
> "C'est configuré dans le .env avec JWT_EXPIRES_IN. En général 1h ou 24h. Je ne me souviens pas de la valeur exacte."

**Pourquoi tu n'utilises pas de refresh token ?**
> "Par simplicité pour le MVP. Le refresh token permettrait de renouveler le token sans se reconnecter. C'est prévu pour la V2."

**Pourquoi tu n'as pas de table admin séparée ?**
> "Les admins sont juste des utilisateurs avec role='admin'. Pas besoin d'une table séparée pour ça."

**Pourquoi access_code et pas juste l'id du quiz ?**
> "Pour que ce soit plus facile à partager. Un code comme 'ABC123' est plus simple à communiquer qu'un id numérique."

**Pourquoi limiter à 1 quiz gratuit et 20 premium ?**
> "C'est un choix arbitraire pour montrer le modèle freemium. Les vraies limites seraient définies par le product owner."

---

# QUESTIONS SUR CE QUE TU N'AS PAS FAIT

**Pourquoi pas de tests E2E ?**
> "Par manque de temps. Les tests E2E avec Cypress ou Playwright testeraient le parcours utilisateur complet. C'est prévu pour la V2."

**Pourquoi pas de Docker ?**
> "Je n'ai pas encore appris Docker. XAMPP était suffisant pour le développement local. Docker serait utile pour avoir le même environnement partout."

**Pourquoi pas de déploiement en production ?**
> "Le déploiement n'était pas demandé dans le cahier des charges. Je sais que je pourrais déployer sur Vercel/Railway, mais je ne l'ai pas encore fait."

**Pourquoi pas de WebSockets pour le temps réel ?**
> "C'est hors du périmètre MVP. Le temps réel serait utile pour un mode multijoueur. C'est prévu pour la V2."

**Pourquoi pas de timer sur les questions ?**
> "C'est une fonctionnalité que j'aurais aimé ajouter. Elle est prévue pour une version future."

**Pourquoi pas de mode sombre ?**
> "Par manque de temps. Tailwind CSS le supporte bien avec la classe dark:. C'est prévu."

**Pourquoi pas d'export des résultats en CSV/Excel ?**
> "C'est une bonne idée que je n'ai pas eu le temps d'implémenter. Ce serait utile pour les profs."

---

# QUESTIONS PERSONNELLES / PARCOURS

**Pourquoi le développement web ?**
> "J'aime créer des choses concrètes. Le développement web permet de voir immédiatement le résultat de son travail."

**Qu'est-ce qui t'a le plus plu dans ce projet ?**
> "Voir l'application fonctionner de bout en bout. Partir de rien et arriver à quelque chose qu'on peut vraiment utiliser."

**Qu'est-ce qui t'a le plus frustré ?**
> "Les bugs qui prennent des heures à trouver pour une erreur toute bête. Ça m'a appris à mieux lire les messages d'erreur."

**Quelle est ta plus grande difficulté technique ?**
> "Les webhooks Stripe. Comprendre le flux asynchrone et la vérification de signature m'a pris du temps."

**Comment tu t'es organisé pour travailler seul ?**
> "J'ai découpé le projet en étapes : d'abord la BDD, puis l'auth, puis les quiz, puis les tests. Une fonctionnalité à la fois."

**Comment tu gères le stress ?**
> "Je prends du recul, je fais une pause, et je reviens avec un regard frais. Souvent le bug devient évident après."

**Tu préfères le frontend ou le backend ?**
> "J'aime les deux, mais je suis peut-être plus à l'aise côté backend car la logique est plus claire."

**Où tu te vois dans 2 ans ?**
> "Développeur full stack en entreprise, avec plus d'expérience sur les technologies avancées comme TypeScript et les tests E2E."

---

# QUESTIONS DE MISE EN SITUATION

**Un utilisateur te dit que l'app est lente. Que fais-tu ?**
> "D'abord j'identifie le problème : est-ce le frontend, le backend, ou la BDD ? J'utiliserais les DevTools (onglet Network) pour voir quelle requête est lente. Ensuite j'optimiserais : ajout d'index SQL, mise en cache, pagination..."

**Un bug est signalé en production. Comment tu procèdes ?**
> "D'abord je reproduis le bug en local. Ensuite je lis les logs pour comprendre l'erreur. Je corrige, j'écris un test pour éviter la régression, et je déploie."

**Un prof te dit qu'il ne peut pas créer de quiz. Que vérifies-tu ?**
> "Est-il connecté ? A-t-il le bon rôle (prof) ? A-t-il atteint sa limite (1 gratuit ou 20 premium) ? Je vérifierais dans la BDD et les logs."

**Le paiement Stripe ne passe pas. Comment tu débugues ?**
> "Je vérifie le dashboard Stripe pour voir si le paiement est arrivé. Je regarde les logs de mon webhook. Je vérifie que la signature est correcte."

**Un élève a joué un quiz mais son score n'apparaît pas. Que fais-tu ?**
> "Je vérifie en BDD si le result a été enregistré. Je vérifie les logs de la requête POST /api/results. Peut-être une erreur de validation ou de connexion."

**Comment tu ajouterais une nouvelle fonctionnalité (ex: timer) ?**
> "D'abord je modifie la BDD (ajouter une colonne time_limit). Puis l'API (valider et retourner le timer). Puis le frontend (afficher un compte à rebours). Enfin des tests."

---

# QUESTIONS BONUS - CULTURE TECH

**C'est quoi le versioning sémantique ?**
> "C'est MAJOR.MINOR.PATCH (ex: 2.1.0). MAJOR = changements incompatibles, MINOR = nouvelles fonctionnalités compatibles, PATCH = corrections de bugs."

**C'est quoi Git Flow ?**
> "C'est une convention pour organiser les branches : main pour la production, develop pour le développement, feature/* pour les fonctionnalités."

**C'est quoi une PR / Pull Request ?**
> "C'est une demande de fusion de code. Quelqu'un review le code avant de l'intégrer dans la branche principale."

**C'est quoi le TDD ?**
> "Test-Driven Development. On écrit les tests AVANT le code. Je ne l'ai pas pratiqué sur ce projet, mais je connais le principe."

**C'est quoi une API GraphQL ?**
> "C'est une alternative à REST où le client demande exactement les données qu'il veut. Plus flexible mais plus complexe à mettre en place."

---

# ANTI-SÈCHE FINALE

## Chiffres à retenir

- **199 tests** (149 frontend + 50 backend)
- **6 tables** en BDD (users, quizzes, questions, results, answers, payments)
- **2 rôles** : prof, élève (+ admin)
- **9.99€** le Premium
- **bcrypt 10 rounds**
- **1 quiz** gratuit, **20** premium

## Ma stack

- **Frontend** : Vue.js 3, Pinia, Tailwind CSS, Axios, Vue Router
- **Backend** : Node.js, Express.js, JWT, bcrypt, Helmet
- **BDD** : MySQL
- **Tests** : Vitest, Vue Test Utils, Supertest
- **CI/CD** : GitHub Actions

## Ce que j'ai fait

- Authentification JWT
- CRUD complet (quiz, questions, résultats)
- Paiement Stripe avec webhooks
- 199 tests automatisés
- CI/CD avec GitHub Actions
- Accessibilité WCAG 2.1 AA
- Design responsive mobile-first

## Ce que je n'ai PAS fait

- HTTPS (en local seulement)
- Rate limiting
- Refresh tokens
- Cookies HttpOnly
- Tests E2E
- Docker
- Déploiement production

## Phrases de secours

> "Je ne maîtrise pas encore ce sujet, c'est sur ma liste d'apprentissage."

> "J'ai suivi la documentation et ça fonctionne, mais je ne connais pas tous les détails."

> "C'est une bonne question, je n'ai pas exploré cette partie."

> "C'est une limite que j'ai identifiée. En production, je ferais différemment."

## Fichiers à montrer si demandé

| Concept | Fichier |
|---------|---------|
| Réponses standardisées | `backend/utils/responses.js` |
| Middleware auth | `backend/middlewares/auth.middleware.js` |
| Middleware rôle | `backend/middlewares/role.middleware.js` |
| Webhook Stripe | `backend/controllers/payment.controller.js` |
| Store auth | `frontend/src/stores/auth.js` |
| Test composant | `frontend/src/tests/components/ScoreDisplay.test.js` |
| Guard de route | `frontend/src/router/index.js` |
| Config sécurité | `backend/server.js` (Helmet, CORS) |
