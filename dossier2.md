


## GLOSSAIRE

API REST : Interface de programmation basée sur le protocole HTTP, permettant la communication entre différentes parties d'une application selon des principes standardisés.

JWT (JSON Web Token) : Format standardisé de jeton d'authentification, signé numériquement, utilisé pour sécuriser les échanges entre le client et le serveur.

CI/CD : Ensemble de pratiques d'intégration continue (Continuous Integration) et de déploiement continu (Continuous Deployment), permettant d'automatiser les tests et la validation du code.

Middleware : Fonction intermédiaire qui s'exécute entre la réception d'une requête et l'envoi de la réponse, permettant de traiter des aspects transverses comme l'authentification ou la validation.

Webhooks : Mécanisme qui permet à un service externe comme Stripe de notifier l'application en temps réel lorsqu'un événement survient.

Accessibilité WCAG : Ensemble de normes internationales (Web Content Accessibility Guidelines) visant à rendre les applications accessibles aux personnes en situation de handicap.

Hashage bcrypt : Algorithme de hachage cryptographique utilisé pour sécuriser les mots de passe en les rendant irréversibles.

Pinia : Librairie de gestion d'état moderne pour Vue.js, successeur de Vuex, offrant une API simplifiée et plus intuitive.

Stripe : Solution de paiement en ligne certifiée PCI-DSS, utilisée pour gérer les transactions financières en toute sécurité.

Vue.js : Framework JavaScript progressif utilisé pour construire des interfaces utilisateur réactives et modulaires.

Composition API : Nouvelle API de Vue.js 3 permettant une meilleure organisation du code et réutilisation de la logique.

---

## ABRÉVIATIONS ET SIGLES

API : Application Programming Interface. CI/CD : Continuous Integration / Continuous Deployment. CRUD : Create, Read, Update, Delete. CSS : Cascading Style Sheets. JWT : JSON Web Token. MCD : Modèle Conceptuel de Données. MLD : Modèle Logique de Données. OWASP : Open Web Application Security Project. RGPD : Règlement Général sur la Protection des Données. SPA : Single Page Application. SQL : Structured Query Language. UML : Unified Modeling Language. WCAG : Web Content Accessibility Guidelines.

---

## SOMMAIRE

1. Avant-propos
2. Présentation de l'équipe projet
3. Contexte et expression de besoin
4. Analyse fonctionnelle
5. Méthodologie de projet
6. Veille technologique
7. Parties prenantes et matrice RACI
8. Planification et diagramme de Gantt
9. Analyse des risques
10. Budgétisation du projet
11. Choix technologiques
12. Architecture et modélisation
13. Modélisation PBS et WBS
14. Base de données
15. Bloc 2 - Développement Frontend
16. Bloc 3 - Développement Backend
17. Système de paiement
18. Sécurité et RGPD
19. Wireframes et maquettes
20. Accessibilité
21. Tests et qualité
22. Industrialisation et CI/CD
23. Retour d'expérience
24. Perspectives d'évolution
25. Bilans de projet
26. Conclusion
27. Bibliographie
28. Annexes

---

## AVANT-PROPOS

Le projet QuizMaster représente l'aboutissement de ma formation en développement web full stack. Ce projet m'a permis de démontrer ma maîtrise complète des compétences requises pour la certification RNCP niveau 6, en couvrant les trois blocs de compétences : analyse et conception, développement frontend, et développement backend.

QuizMaster est une plateforme web permettant aux professeurs de créer des quiz interactifs et aux élèves de les passer en ligne. Ce projet répond à un besoin réel de digitalisation des évaluations dans le contexte éducatif actuel. L'application permet aux enseignants de concevoir des questionnaires à choix multiples ou vrai/faux, de les partager via un code d'accès unique, et de suivre les résultats de leurs élèves en temps réel.

Ce dossier présente de manière exhaustive l'analyse et la conception du projet correspondant au Bloc 1, le développement de l'interface utilisateur avec Vue.js correspondant au Bloc 2, et le développement du serveur et de l'API avec Node.js/Express correspondant au Bloc 3. Cette certification représente l'aboutissement de mon apprentissage intensif et la validation de mes compétences en développement full-stack.

---

## PRÉSENTATION DE L'ÉQUIPE PROJET

Travaillant en autonomie complète sur ce projet individuel, j'ai dû mobiliser l'ensemble de mes compétences acquises durant ma formation. Cette situation m'a confronté aux défis de la polyvalence, devant assumer simultanément les rôles de concepteur, développeur frontend et backend, architecte base de données et responsable DevOps.

En tant que Développeur Full Stack et Chef de projet, j'ai pris en charge l'intégralité des responsabilités : l'analyse des besoins et la rédaction du cahier des charges, la conception de l'architecture technique et la modélisation UML, le développement de l'interface utilisateur avec Vue.js 3 et Tailwind CSS, le développement de l'API REST avec Node.js et Express, la mise en place de la base de données MySQL, l'intégration du système de paiement Stripe, la rédaction des tests automatisés, et la configuration du pipeline CI/CD avec GitHub Actions.

Les compétences mobilisées couvrent l'ensemble du spectre full stack. En frontend, j'ai utilisé Vue.js 3 avec la Composition API, Pinia pour la gestion d'état, et Tailwind CSS pour le styling. En backend, j'ai travaillé avec Node.js, Express.js, l'authentification JWT et le hashage bcrypt. Pour la base de données, j'ai conçu et implémenté un schéma MySQL avec modélisation MCD et MLD. En DevOps, j'ai configuré Git, GitHub Actions pour le CI/CD, ainsi qu'ESLint et Prettier pour la qualité du code.

---

## CONTEXTE ET EXPRESSION DE BESOIN

### Analyse du besoin initial

Le cahier des charges initial stipulait de développer une plateforme de quiz en ligne permettant aux professeurs de créer des évaluations et aux élèves de les passer. Cette formulation volontairement générale nécessitait une analyse approfondie pour identifier les véritables enjeux sous-jacents et les besoins réels des utilisateurs finaux.

Ma première démarche a consisté à déconstruire cette demande pour en extraire les composantes essentielles. Le terme plateforme implique une architecture robuste et scalable, capable d'accueillir de nombreux utilisateurs simultanément. La notion de quiz suggère un système d'évaluation interactif avec gestion des questions, des réponses et des résultats. Le contexte professeurs et élèves impose des contraintes spécifiques en termes de sécurité, de gestion des rôles et d'expérience utilisateur adaptée à chaque profil.

### Reformulation structurée

Après cette analyse, j'ai reformulé le besoin de manière plus précise et actionnable. La question Qui concerne trois types d'utilisateurs : les professeurs qui sont créateurs de contenu pédagogique, les élèves qui sont participants aux évaluations, et les administrateurs qui gèrent la plateforme. La question Quoi définit une application web de quiz en ligne avec un système de questions QCM et Vrai/Faux, un suivi des résultats, et une interface d'administration. La question Pourquoi répond aux objectifs de digitaliser les évaluations, faciliter le suivi pédagogique, et offrir une solution accessible. La question Comment se traduit par une interface web responsive, des codes d'accès pour rejoindre les quiz, et un stockage des résultats en base de données. La question Combien établit un modèle freemium avec 1 quiz gratuit et 20 quiz pour 9,99 euros en version Premium.

### Objectifs SMART

J'ai structuré mes objectifs selon la méthode SMART pour garantir leur réalisme et leur mesurabilité.

[TODO: Insérer image SMART.png]

Le premier objectif concerne la gestion des quiz. De manière spécifique, il s'agit de permettre aux professeurs de créer des quiz avec questions QCM et Vrai/Faux. L'aspect mesurable fixe un maximum de 1 quiz gratuit et 20 quiz premium. L'objectif est atteignable car les technologies sont maîtrisées, notamment Vue.js, Express et MySQL. Il est réaliste car il s'agit de fonctionnalités CRUD standard. Temporellement, la livraison est prévue pour la certification RNCP.

Le deuxième objectif porte sur la sécurité des données. Spécifiquement, il vise à sécuriser l'authentification et les données utilisateurs. De manière mesurable, cela signifie zéro mot de passe en clair et 100% des routes protégées. C'est atteignable car bcrypt et JWT sont des standards de l'industrie. C'est réaliste car l'implémentation est classique et documentée. Temporellement, cette sécurité est mise en place dès le début du développement.

Le troisième objectif concerne l'accessibilité. Spécifiquement, il s'agit de rendre l'application accessible aux personnes en situation de handicap. L'aspect mesurable vise la conformité WCAG 2.1 niveau AA. C'est atteignable par l'implémentation progressive des critères. C'est réaliste car les critères prioritaires sont implémentés en premier. Temporellement, la conformité doit être assurée avant la livraison finale.

---

## ANALYSE FONCTIONNELLE

### Identification des acteurs

L'analyse fonctionnelle a révélé trois acteurs principaux interagissant avec la plateforme. Le professeur est l'utilisateur créateur de contenu qui peut créer des quiz, gérer les questions et consulter les résultats de ses élèves. L'élève est l'utilisateur consommateur qui peut rejoindre un quiz via un code d'accès, répondre aux questions et voir son score. L'administrateur est le gestionnaire de la plateforme qui peut gérer les utilisateurs, consulter les logs système et voir les statistiques globales. Le système Stripe intervient comme acteur externe pour gérer les paiements Premium.

### Bête à Cornes

Le diagramme Bête à Cornes permet d'identifier à qui rend service le système, sur quoi il agit et dans quel but. QuizMaster rend service aux professeurs, aux élèves et aux administrateurs. Il agit sur les évaluations éducatives sous forme de quiz, QCM et Vrai/Faux. Son but est de permettre aux professeurs de créer des évaluations interactives et aux élèves de les passer en ligne de manière simple et engageante.

[TODO: Insérer image bete a corne.png]

### Diagramme Pieuvre

Le diagramme Pieuvre identifie les fonctions principales et les contraintes du système. La fonction principale FP1 permet au professeur de créer et gérer des quiz. Les fonctions contraintes sont : FC1 permettre à l'élève de passer les quiz, FC2 stocker les données de manière persistante dans MySQL, FC3 gérer les paiements sécurisés via Stripe, FC4 être accessible via navigateur web, et FC5 respecter la réglementation RGPD.

[TODO: Insérer image diagramme pieuvre.png]

### Exigences fonctionnelles

Le module Authentification permet à l'utilisateur de s'inscrire avec email, mot de passe et rôle. Il peut se connecter avec ses identifiants. Le mot de passe doit respecter les règles de sécurité avec minimum 8 caractères, une majuscule, une minuscule et un chiffre. L'utilisateur peut se déconnecter et consulter son profil.

Le module Quiz pour le professeur permet de créer un quiz avec un titre de 5 à 100 caractères. Le système génère automatiquement un code d'accès unique de 5 caractères. Le professeur peut modifier le titre d'un quiz et supprimer un quiz avec suppression en cascade des questions et résultats associés. La limite est fixée à 1 quiz en version gratuite et 20 quiz en version Premium. Le professeur ne peut voir et modifier que ses propres quiz.

Le module Questions permet au professeur d'ajouter des questions QCM avec 4 choix de réponse et des questions Vrai/Faux avec 2 choix. Il peut modifier et supprimer une question existante. La bonne réponse doit obligatoirement faire partie des options proposées.

Le module Jeu permet à l'élève de rejoindre un quiz via le code d'accès. Les questions s'affichent une par une avec une barre de progression. L'élève doit sélectionner une réponse avant de passer à la question suivante. À la fin, il voit son score final en nombre de bonnes réponses et en pourcentage.

Le module Résultats enregistre automatiquement le résultat en base après chaque quiz. Le professeur peut voir les résultats de ses quiz avec le détail des réponses de chaque élève. L'élève peut consulter son historique de résultats.

Le module Paiement permet au professeur de passer en version Premium via Stripe Checkout. Le paiement est sécurisé par webhook Stripe avec vérification de signature. Le statut Premium est mis à jour automatiquement après confirmation du paiement.

Le module Administration permet à l'administrateur de voir un dashboard avec les statistiques globales. Il peut lister tous les utilisateurs avec pagination, modifier le rôle d'un utilisateur, activer ou désactiver un compte, attribuer ou retirer le statut Premium, supprimer un utilisateur sauf lui-même, créer un nouvel utilisateur, et consulter les logs système.

### Exigences non fonctionnelles

En termes de performance, le temps de réponse de l'API doit être inférieur à 500ms grâce à des requêtes optimisées et des index MySQL. Pour la sécurité, les mots de passe sont hashés avec bcrypt 10 rounds et l'authentification est stateless via JWT avec expiration. L'accessibilité vise le niveau WCAG 2.1 AA avec skip link, attributs ARIA et focus visible. Le SEO est assuré par des meta tags et Open Graph via un composable useSeo. La compatibilité couvre les navigateurs modernes Chrome, Firefox, Safari et Edge. Le design est responsive pour desktop, tablette et mobile grâce aux breakpoints Tailwind CSS.

---

## MÉTHODOLOGIE DE PROJET

### Adaptation de la méthode Agile Scrum

Pour structurer mon travail en solo, j'ai adapté la méthodologie Scrum à ma situation particulière. J'ai organisé mon projet en sprints de deux semaines. Chaque sprint débutait par une session de Sprint Planning où je définissais les objectifs et les user stories à traiter. Les Daily Standups se matérialisaient par des points quotidiens consignés dans mon journal de bord, me permettant de suivre ma progression et d'identifier rapidement les blocages. Les Sprint Reviews prenaient la forme de démonstrations aux formateurs, validant l'avancement fonctionnel. Les Rétrospectives m'ont permis d'identifier et de corriger mes axes d'amélioration.

### Product Backlog

Le backlog produit a été structuré en user stories priorisées. La première user story de priorité haute stipule qu'en tant que professeur je veux créer un quiz pour évaluer mes élèves. La deuxième permet au professeur d'ajouter des questions à son quiz. La troisième de priorité haute permet à l'élève de rejoindre un quiz via un code d'accès. La quatrième permet à l'élève de voir son score à la fin du quiz. La cinquième de priorité moyenne permet au professeur de voir les résultats de ses quiz. La sixième permet au professeur de passer en version Premium pour créer plus de quiz. La septième de priorité haute permet à l'administrateur de gérer les utilisateurs de la plateforme.

### Definition of Done

Une user story est considérée comme terminée quand le code est écrit et fonctionnel, les tests unitaires passent, une code review a été effectuée, la documentation est mise à jour, et ESLint et Prettier valident le code sans erreur.

---

## VEILLE TECHNOLOGIQUE

### Méthodologie de veille structurée

Ma veille technologique s'est organisée autour de plusieurs sources complémentaires consultées selon une fréquence définie. La documentation officielle de Vue.js et Node.js constituait ma référence quotidienne pour les aspects techniques. Les newsletters spécialisées comme JavaScript Weekly m'apportaient hebdomadairement une vision des évolutions de l'écosystème. Les blogs techniques sur Dev.to, consultés quotidiennement, m'offraient des retours d'expérience pratiques. GitHub Trending me permettait de découvrir les repositories populaires et les nouvelles tendances. Le site OWASP était consulté mensuellement pour les aspects sécurité. MDN Web Docs servait de référence au besoin pour les standards web.

### Technologies identifiées et adoptées

Cette veille m'a conduit à adopter Vue.js 3 avec la Composition API plutôt que l'Options API. Les avantages identifiés sont une meilleure organisation du code, une réutilisabilité via les composables, un meilleur support TypeScript, et une syntaxe script setup plus concise.

J'ai choisi Pinia comme alternative moderne à Vuex pour la gestion d'état. Pinia offre une syntaxe simple et directe contrairement aux mutations et actions verbose de Vuex. Le support TypeScript est natif dans Pinia. Les DevTools sont supportés dans les deux cas mais Pinia est plus léger. Pinia est devenu le nouveau standard officiel pour Vue 3.

Ma veille sur la sécurité Node.js m'a permis d'implémenter Helmet.js pour les headers de sécurité HTTP, bcrypt pour le hashage des mots de passe, JWT pour l'authentification stateless, et les requêtes préparées pour la prévention des injections SQL.

---

## PARTIES PRENANTES ET MATRICE RACI

### Gestion des parties prenantes

Bien que travaillant seul, j'ai établi une matrice RACI pour clarifier les responsabilités avec mes encadrants pédagogiques. Cette matrice définit les rôles Responsible pour celui qui réalise la tâche, Accountable pour celui qui valide et approuve, Consulted pour celui qui est consulté pour avis, et Informed pour celui qui est informé des résultats.

Pour la rédaction du cahier des charges, je suis Responsible et Accountable, le formateur est Consulted, et le jury est Informed. Pour la modélisation UML et la conception de la base de données, la répartition est identique. Pour le développement frontend et backend ainsi que les tests unitaires, je suis Responsible et Accountable, le formateur est Informed, et le jury est Informed. Pour la documentation, je suis Responsible et Accountable, le formateur est Consulted, et le jury est Informed. Pour la validation finale, je suis Informed, le formateur est Consulted, et le jury est Accountable.

Cette clarification a facilité la communication et évité les malentendus sur les attentes respectives.

---

## PLANIFICATION ET DIAGRAMME DE GANTT

### Planning prévisionnel

Le diagramme de Gantt prévisionnel structure le projet en plusieurs phases. La phase d'analyse et conception s'étend sur les deux premières semaines. Le développement backend couvre les semaines 3 à 5. Le développement frontend se déroule en parallèle des semaines 4 à 6. L'intégration de Stripe est réalisée en semaine 6. Les tests et corrections occupent la semaine 7. La documentation est finalisée durant les semaines 7 et 8.

Cette planification intègre des marges de sécurité pour absorber les imprévus, particulièrement importants dans un projet solo où l'absence de redondance des compétences augmente les risques de blocage.

[TODO: Insérer le diagramme de Gantt - Créer avec GanttProject, MS Project ou en ligne]

---

## ANALYSE DES RISQUES

### Identification et mitigation des risques

L'analyse des risques a révélé plusieurs points de vigilance critiques.

Le risque R1 de retard de développement présente une probabilité moyenne et un impact élevé, résultant en une criticité haute. La mitigation passe par un planning avec marge et une priorisation sur le MVP.

Le risque R2 de faille de sécurité a une probabilité faible mais un impact critique, donnant une criticité haute. La mitigation s'appuie sur l'audit OWASP, l'utilisation de bcrypt, JWT et les requêtes préparées.

Le risque R3 d'échec de l'intégration Stripe a une probabilité faible et un impact élevé, soit une criticité moyenne. La mitigation repose sur la documentation Stripe et l'utilisation du mode test.

Le risque R4 de problème de performance de la base de données a une probabilité faible et un impact moyen, donc une criticité faible. La mitigation utilise des index et des requêtes optimisées.

Le risque R5 d'incompatibilité entre navigateurs a une probabilité faible et un impact moyen. La mitigation passe par des tests multi-navigateurs et l'utilisation de Tailwind CSS.

Le risque R6 de perte de données a une probabilité faible mais un impact critique, résultant en une criticité moyenne. La mitigation repose sur Git et des sauvegardes régulières.

Le risque R7 de non-conformité RGPD a une probabilité moyenne et un impact élevé, soit une criticité haute. La mitigation passe par la minimisation des données et le recueil du consentement.

Le risque R8 d'accessibilité insuffisante a une probabilité moyenne et un impact moyen, donnant une criticité moyenne. La mitigation s'appuie sur les tests WCAG et un audit accessibilité.

Les actions préventives pour le risque R1 incluent la définition d'un MVP et un backlog priorisé. Les actions correctives prévoient le report des fonctionnalités secondaires. Pour le risque R2, les actions préventives sont la revue de code et les bonnes pratiques, avec comme action corrective un patch immédiat et un audit sécurité. Pour le risque R7, les actions préventives comprennent une checklist RGPD et une documentation, avec comme action corrective la mise en conformité.

[TODO: Insérer une matrice des risques visuelle Probabilité x Impact]

---

## BUDGÉTISATION DU PROJET

### Estimation du temps de travail

L'analyse budgétaire valorise le coût de développement sur la base des heures estimées et des taux horaires moyens du marché pour un développeur junior/intermédiaire en France.

L'analyse et la conception représentent 40 heures à 45 euros de l'heure, soit 1800 euros. Le développement backend représente 80 heures à 50 euros de l'heure, soit 4000 euros. Le développement frontend représente 80 heures à 45 euros de l'heure, soit 3600 euros. Les tests et l'assurance qualité représentent 30 heures à 40 euros de l'heure, soit 1200 euros. Le DevOps et CI/CD représentent 20 heures à 55 euros de l'heure, soit 1100 euros. La documentation représente 30 heures à 35 euros de l'heure, soit 1050 euros. Le total s'élève à 280 heures pour un coût de développement de 12750 euros.

### Coût de l'infrastructure

L'hébergement sur un VPS chez OVH ou DigitalOcean représente un coût mensuel de 10 à 20 euros, soit 120 à 240 euros par an. Le nom de domaine coûte 10 à 15 euros par an. Le certificat SSL est gratuit grâce à Let's Encrypt. La base de données est incluse dans le VPS. Le total de l'infrastructure s'élève à environ 15 euros par mois, soit 150 euros par an.

### Récapitulatif budgétaire

Le poste développement sur 280 heures représente 12750 euros. Le poste infrastructure sur 1 an représente 150 euros. Le total du projet s'élève à 12900 euros.

---

## CHOIX TECHNOLOGIQUES

### Analyse comparative frontend

Mon analyse comparative des frameworks frontend a porté sur trois solutions majeures. Vue.js 3 offrait une courbe d'apprentissage optimale avec une excellente documentation et un écosystème mature. React 18 proposait les meilleures performances et la plus large communauté, mais avec une complexité accrue. Angular 15 apportait une structure enterprise robuste au prix d'une courbe d'apprentissage plus raide.

J'ai choisi Vue.js 3 pour son équilibre optimal entre simplicité d'apprentissage et puissance, particulièrement adapté au contexte d'un projet solo. De plus, Vue.js était imposé par la formation, ce qui renforce ce choix. La Composition API offrait la flexibilité nécessaire pour des composants complexes tout en maintenant une lisibilité excellente. L'écosystème Vue, avec Pinia pour le state management et Vue Router pour la navigation, formait un ensemble cohérent et bien documenté.

### Architecture technique retenue

L'architecture frontend s'appuie sur Vue.js 3 avec Composition API pour la logique des composants, Pinia pour la gestion d'état centralisée, Vue Router pour le routing SPA, Axios pour les appels API avec intercepteurs, Tailwind CSS pour le styling utility-first, et Vite comme build tool pour des performances de développement optimales.

Le backend repose sur Node.js avec Express pour l'API REST, imposé par la formation. JWT assure l'authentification stateless et scalable. Bcrypt sécurise le hashage des mots de passe. Helmet ajoute automatiquement les headers de sécurité HTTP. Stripe gère les paiements avec une API excellente et des webhooks fiables.

La couche données utilise MySQL, imposé par la formation, comme système de gestion de base de données relationnelle parfaitement adapté aux besoins du projet.

Les outils de développement comprennent ESLint pour la qualité du code et la détection d'erreurs, Prettier pour le formatage automatique et la cohérence, Vitest pour les tests rapides compatible avec Vite et l'API Jest, et GitHub Actions pour le CI/CD gratuit et intégré à GitHub.

---

## ARCHITECTURE ET MODÉLISATION

### Architecture en couches

L'architecture logicielle suit le pattern de séparation des responsabilités en trois couches distinctes selon le modèle 3-tiers.

La couche Présentation correspond au frontend et gère l'interface utilisateur et l'expérience interactive. Elle est implémentée avec Vue.js 3, les stores Pinia, Vue Router, les services Axios, et le styling Tailwind CSS. Les composants sont organisés en views pour les pages et components pour les éléments réutilisables.

La couche Métier correspond au backend et expose les endpoints sécurisés via l'API REST. Elle orchestre les appels métier avec Express.js, gère l'authentification via JWT et bcrypt, et intègre le paiement Stripe. L'architecture suit le pattern MVC avec des routes, controllers, middlewares et validators séparés.

La couche Données gère la persistance avec MySQL. Elle comprend les tables users, quizzes, questions, results, answers, payments et logs. Les relations sont définies par des clés étrangères avec CASCADE pour la suppression.

[TODO: Insérer schéma de l'architecture 3-tiers]

### Modélisation UML

J'ai élaboré une suite complète de diagrammes UML pour formaliser l'architecture fonctionnelle.

Les diagrammes de cas d'utilisation présentent les trois acteurs principaux et leurs cas d'utilisation respectifs. Le professeur peut créer un quiz, ajouter des questions, modifier un quiz, supprimer un quiz, voir les résultats, et passer en Premium. L'élève peut rejoindre un quiz via un code, répondre aux questions, voir son score, et consulter son historique. L'administrateur peut voir le dashboard, gérer les utilisateurs, et consulter les logs.

[TODO: Insérer image CUprofesseur.png]
[TODO: Insérer image CUeleve.png]
[TODO: Insérer image CUadmin.png]

Le diagramme de classes modélise les entités principales avec leurs attributs, méthodes et relations. La classe User centralise les informations d'authentification avec id, email, password, role, is_premium, is_active et created_at. Elle possède les méthodes register, login, logout et getProfile. Quiz contient id, user_id, title, access_code et created_at avec les méthodes create, update, delete et generateCode. Un User possède plusieurs Quiz. Question contient id, quiz_id, type, question_text, options et correct_answer. Un Quiz contient plusieurs Questions. Result contient id, user_id, quiz_id, score et played_at. Un Quiz génère plusieurs Results. Answer contient id, result_id, question_id, user_answer et is_correct. Un Result contient plusieurs Answers. Payment contient id, user_id, stripe_session_id, amount, status et created_at. Un User effectue plusieurs Payments. Log contient id, user_id, action, target_type, target_id, details, ip_address et created_at.

[TODO: Insérer image diagramme de classe.png]

Les diagrammes de séquence détaillent les flux critiques. Le processus de connexion commence quand l'utilisateur saisit son email et mot de passe dans le frontend. Le frontend envoie une requête POST à l'endpoint /api/auth/login du backend. Le backend interroge la base MySQL pour récupérer l'utilisateur. Il compare le mot de passe avec bcrypt. Si valide, il génère un token JWT et le renvoie au frontend. Le frontend stocke le token dans localStorage et redirige vers le dashboard.

[TODO: Insérer image diagsequenceauthentification.png]

Le processus de jeu d'un quiz commence quand l'élève saisit le code d'accès. Le frontend appelle GET /api/quizzes/join/:code. Le backend récupère le quiz et le renvoie. Le frontend appelle GET /api/questions/play/:quizId pour obtenir les questions sans les réponses correctes. L'élève répond à chaque question. À la fin, le frontend envoie POST /api/results avec le quiz_id, le score et les réponses. Le backend enregistre le résultat et les réponses en base. Le frontend affiche le score final.

[TODO: Insérer image diagsequencequiz.png]
[TODO: Insérer image diagsequencestripe.png]

Les diagrammes d'activité décrivent les processus de création d'un quiz et de passage d'un quiz.

[TODO: Insérer image Creer un quiz diagramme diagramme d'activite.png]
[TODO: Insérer image diagramme d'activite jouer un quiz.png]

Le diagramme de flux de données illustre les échanges d'informations entre les différentes couches du système.

[TODO: Insérer image Diagramme de flux de donnee.png]

---

## MODÉLISATION PBS ET WBS

### PBS - Product Breakdown Structure

La décomposition PBS organise le produit QuizMaster en modules cohérents. Le module Authentification gère l'inscription, la connexion, la déconnexion et la gestion des sessions JWT. Le module Quiz englobe la création, l'édition, la suppression et le partage via code d'accès. Le module Questions gère l'ajout, la modification et la suppression des questions QCM et Vrai/Faux. Le module Jeu permet le passage des quiz avec affichage des questions, sélection des réponses et calcul du score. Le module Résultats enregistre et affiche les scores et les détails des réponses. Le module Paiement intègre Stripe pour le passage en Premium. Le module Administration fournit le dashboard, la gestion des utilisateurs et la consultation des logs.

[TODO: Insérer image PBS.png]

### WBS - Work Breakdown Structure

La WBS détaille les tâches nécessaires pour chaque module. Chaque tâche est estimée et assignée à un sprint spécifique. Cette décomposition granulaire facilite le suivi de progression et l'identification précoce des retards potentiels. Les tâches couvrent l'analyse, la conception, le développement, les tests et la documentation pour chaque module.

[TODO: Insérer image WBS.png]

---

## BASE DE DONNÉES

### Conception du modèle de données

Le modèle conceptuel de données MCD structure l'information autour de sept entités principales interconnectées. L'entité User centralise les informations d'identité et d'authentification. Quiz et Question modélisent le contenu pédagogique. Result et Answer enregistrent les interactions des élèves. Payment gère les transactions Premium. Log capture les actions pour l'audit.

[TODO: Insérer image MCD.png]

Le modèle logique MLD traduit ces concepts en tables relationnelles optimisées. Les index sont positionnés sur les clés étrangères et les colonnes fréquemment interrogées. Les contraintes d'intégrité référentielle garantissent la cohérence des données avec ON DELETE CASCADE pour la suppression en cascade.

[TODO: Insérer image MLD.png]

### Structure des tables

La table users contient les champs id en clé primaire auto-incrémentée, email en varchar 255 unique et non null, password en varchar 255 non null pour le hash bcrypt, role en enum avec les valeurs prof, eleve et admin, is_premium en boolean avec défaut false, is_active en boolean avec défaut true, et created_at en timestamp avec défaut à la date courante.

La table quizzes contient id en clé primaire, user_id en clé étrangère vers users avec cascade, title en varchar 100 non null, access_code en varchar 5 unique non null, et created_at en timestamp.

La table questions contient id en clé primaire, quiz_id en clé étrangère vers quizzes avec cascade, type en enum qcm ou vf, question_text en text non null, options en JSON non null, et correct_answer en varchar 255 non null.

La table results contient id en clé primaire, user_id en clé étrangère vers users avec cascade, quiz_id en clé étrangère vers quizzes avec cascade, score en int non null, et played_at en timestamp.

La table answers contient id en clé primaire, result_id en clé étrangère vers results avec cascade, question_id en clé étrangère vers questions avec cascade, user_answer en varchar 255 non null, et is_correct en boolean non null.

La table payments contient id en clé primaire, user_id en clé étrangère vers users avec cascade, stripe_session_id en varchar 255 non null, amount en decimal 10,2 non null, status en varchar 50 avec défaut pending, et created_at en timestamp.

La table logs contient id en clé primaire, user_id en clé étrangère vers users avec set null, action en varchar 100 non null, target_type en varchar 50 nullable, target_id en int nullable, details en JSON nullable, ip_address en varchar 45 nullable, user_agent en text nullable, et created_at en timestamp.

---

## BLOC 2 - DÉVELOPPEMENT FRONTEND

### Architecture frontend

L'architecture frontend s'organise selon une structure claire et modulaire. Le dossier src contient l'ensemble du code source. Le sous-dossier assets contient les fichiers statiques comme le CSS. Le sous-dossier components contient les composants Vue réutilisables comme Navbar, QuizCard, QuestionForm, QuestionDisplay et ScoreDisplay. Le sous-dossier views contient les pages de l'application comme HomeView, AuthView, DashboardView, CreateQuizView, PlayQuizView, PaymentView et AdminDashboardView. Le sous-dossier router contient la configuration des routes. Le sous-dossier stores contient la gestion d'état Pinia avec auth.js et quiz.js. Le sous-dossier services contient les appels API avec api.js et admin.js. Le sous-dossier composables contient la logique réutilisable comme useSeo.js. App.vue est le composant racine et main.js le point d'entrée. À la racine se trouvent index.html, vite.config.js et tailwind.config.js.

### Composition API et composants

Les composants Vue utilisent la Composition API avec la syntaxe script setup. Cette approche moderne permet une meilleure organisation du code en regroupant la logique par fonctionnalité plutôt que par type d'option. Les refs gèrent l'état local réactif. Les computed calculent des valeurs dérivées. Les fonctions implémentent la logique métier. Le hook onMounted exécute du code au montage du composant.

### Gestion d'état avec Pinia

Le store d'authentification centralise l'état utilisateur. Il contient les refs user et token, ce dernier étant initialisé depuis localStorage. Les getters computed isAuthenticated, isProf, isEleve, isAdmin et isPremium dérivent des informations de l'utilisateur. Les actions login, register, fetchUser et logout gèrent le cycle de vie de l'authentification. Le token est persisté dans localStorage pour maintenir la session.

Le store quiz gère l'état des quiz. Il contient les refs quizzes, currentQuiz, questions et results. Les actions fetchQuizzes, createQuiz, joinQuiz, fetchQuestionsForPlay et submitResult interagissent avec l'API backend.

### Service API avec Axios

Le service API configure Axios avec une baseURL pointant vers le backend. Un intercepteur de requête ajoute automatiquement le token JWT dans le header Authorization. Un intercepteur de réponse gère les erreurs 401 en supprimant le token et en redirigeant vers la page d'authentification.

### Routing et guards

Vue Router configure les routes de l'application avec createWebHistory pour un routing propre sans hash. Les routes protégées utilisent la meta requiresAuth. Les routes à accès restreint utilisent la meta role. Le guard beforeEach vérifie l'authentification et le rôle avant chaque navigation, redirigeant vers /auth ou /dashboard si nécessaire.

### Styling avec Tailwind CSS

Tailwind CSS est configuré avec les chemins vers index.html et les fichiers Vue et JS dans src. Le thème est étendu avec des couleurs personnalisées primary. Les classes utility-first permettent un développement rapide et un design responsive grâce aux breakpoints md et lg pour les grilles.

### Extraits de code Frontend

Les captures suivantes illustrent les implémentations clés du frontend.

[TODO: Insérer capture CODE_07_auth_store.png - Store Pinia authentification avec state, getters et actions (frontend/src/stores/auth.js)]

[TODO: Insérer capture CODE_08_api_interceptors.png - Service API Axios avec intercepteurs pour token JWT et gestion erreurs 401 (frontend/src/services/api.js)]

[TODO: Insérer capture CODE_09_router_guards.png - Guards de navigation Vue Router avec vérification authentification et rôle (frontend/src/router/index.js)]

---

## BLOC 3 - DÉVELOPPEMENT BACKEND

### Architecture backend

L'architecture backend suit le pattern MVC avec une séparation claire des responsabilités. Le dossier config contient database.js pour la configuration MySQL, stripe.js pour la configuration Stripe, et swagger.js pour la documentation API. Le dossier controllers contient les controllers auth, quiz, question, result, payment et admin. Le dossier middlewares contient auth.middleware.js, role.middleware.js, validation.middleware.js et error.middleware.js. Le dossier routes contient les fichiers de routes pour chaque module. Le dossier validators contient les validateurs pour auth, quiz et question. Le dossier utils contient response.js et logger.js. Le dossier tests contient les fichiers de tests. Le fichier server.js est le point d'entrée.

### API REST - Endpoints

L'API expose des endpoints REST organisés par module. Le module authentification propose POST /api/auth/register pour l'inscription sans authentification requise, POST /api/auth/login pour la connexion sans authentification, GET /api/auth/me pour le profil avec authentification, et POST /api/auth/logout pour la déconnexion avec authentification.

Le module quiz propose GET /api/quizzes pour lister ses quiz avec authentification et rôle professeur, GET /api/quizzes/:id pour le détail avec authentification et rôle professeur, POST /api/quizzes pour créer avec authentification et rôle professeur, PUT /api/quizzes/:id pour modifier avec authentification et rôle professeur, DELETE /api/quizzes/:id pour supprimer avec authentification et rôle professeur, et GET /api/quizzes/join/:code pour rejoindre avec authentification pour tous les rôles.

Le module questions propose des endpoints similaires pour la gestion des questions par le professeur et GET /api/questions/play/:quizId pour récupérer les questions sans les réponses pour le jeu.

Le module résultats propose POST /api/results pour enregistrer un résultat avec authentification rôle élève, GET /api/results/me pour ses résultats avec authentification rôle élève, et GET /api/results/quiz/:quizId pour les résultats d'un quiz avec authentification rôle professeur.

Le module administration propose GET /api/admin/dashboard pour les statistiques, GET /api/admin/users pour lister les utilisateurs avec pagination, les endpoints CRUD pour les utilisateurs, et GET /api/admin/logs pour les logs, tous avec authentification et rôle admin.

### Format de réponse standardisé

Toutes les réponses suivent un format JSON standardisé. En cas de succès, la réponse contient success à true et data avec les données. En cas d'erreur, la réponse contient success à false et error avec code, message et éventuellement field pour les erreurs de validation.

### Middlewares

Le middleware d'authentification extrait le token du header Authorization, vérifie sa validité avec JWT, et attache l'utilisateur décodé à la requête. Il renvoie une erreur 401 si le token est absent et 403 s'il est invalide.

Les middlewares de rôle requireProf et requireAdmin vérifient que l'utilisateur authentifié possède le rôle requis, renvoyant une erreur 403 dans le cas contraire.

### Controllers

Les controllers implémentent la logique métier. Le controller quiz gère la création avec vérification de la limite selon le statut premium, génération d'un code d'accès unique, et insertion en base. Les réponses utilisent les helpers successResponse et errorResponse pour maintenir la cohérence du format.

### Extraits de code Backend

Les captures suivantes illustrent les implémentations clés du backend.

[TODO: Insérer capture CODE_01_auth_middleware.png - Middleware d'authentification JWT avec vérification et décodage du token (backend/middlewares/auth.middleware.js)]

[TODO: Insérer capture CODE_02_auth_controller_login.png - Fonction login avec vérification bcrypt et génération token JWT (backend/controllers/auth.controller.js, lignes 59-96)]

[TODO: Insérer capture CODE_03_auth_validator.png - Validation mot de passe sécurisé avec regex majuscule, minuscule, chiffre (backend/validators/auth.validator.js, lignes 27-66)]

[TODO: Insérer capture CODE_04_quiz_routes.png - Chaîne de middlewares Express : authenticateToken, requireProf, validateQuiz (backend/routes/quiz.routes.js)]

---

## SYSTÈME DE PAIEMENT

### Intégration Stripe

Le flux de paiement se déroule en plusieurs étapes. Le professeur clique sur Passer Premium dans l'interface. Le backend crée une session Stripe Checkout avec les détails du produit, le prix de 9,99 euros, et les URLs de succès et d'annulation. Le frontend redirige vers la page Stripe. Le professeur saisit ses informations de paiement. Stripe traite le paiement. Stripe appelle notre webhook avec l'événement checkout.session.completed. Le backend vérifie la signature du webhook et met à jour is_premium à true. Le frontend redirige vers la page de succès.

La création de session Checkout utilise stripe.checkout.sessions.create avec les payment_method_types card, les line_items avec le prix en centimes, le mode payment, les URLs de redirection, et les metadata contenant le userId pour l'identifier dans le webhook.

La gestion du webhook vérifie d'abord la signature avec stripe.webhooks.constructEvent. Si l'événement est checkout.session.completed, le backend récupère le userId depuis les metadata, met à jour le statut premium de l'utilisateur en base, et enregistre le paiement dans la table payments. Le webhook répond avec received true.

### Extraits de code Stripe

Les captures suivantes illustrent l'implémentation de l'intégration Stripe.

[TODO: Insérer capture CODE_05_stripe_checkout.png - Création session Stripe Checkout avec metadata userId (backend/controllers/payment.controller.js, lignes 9-55)]

[TODO: Insérer capture CODE_06_stripe_webhook.png - Gestion webhook avec vérification signature et mise à jour premium (backend/controllers/payment.controller.js, lignes 61-96)]

---

## SÉCURITÉ ET RGPD

### Mesures de sécurité implémentées

Le hashage des mots de passe utilise bcrypt avec 10 rounds de salt. À l'inscription, le mot de passe est hashé avant stockage. À la connexion, bcrypt.compare vérifie la correspondance sans jamais déchiffrer le hash.

La validation des mots de passe impose un minimum de 8 caractères, au moins une majuscule, au moins une minuscule, et au moins un chiffre.

Les headers de sécurité sont ajoutés automatiquement par Helmet avec une configuration CSP définissant les sources autorisées pour les scripts, styles et images.

La protection CORS limite les origines autorisées à l'URL du frontend configurée dans les variables d'environnement.

Les requêtes préparées préviennent les injections SQL en utilisant des placeholders avec le tableau de valeurs plutôt que la concaténation de chaînes.

### Conformité RGPD

Les données personnelles collectées sont l'email pour l'identification sur base du consentement, le mot de passe hashé pour l'authentification, le rôle pour différencier professeur et élève, les résultats de quiz pour le suivi pédagogique sur base de l'intérêt légitime, et les données de paiement pour le traitement Premium sur base de l'exécution du contrat. La durée de conservation est la durée du compte sauf pour les données de paiement conservées 10 ans pour raison légale.

Les droits des utilisateurs sont implémentés. Le droit d'accès est assuré par GET /api/auth/me. Le droit de suppression utilise CASCADE DELETE. Les droits de rectification et de portabilité sont à implémenter.

La minimisation des données est respectée car seules les données nécessaires sont collectées. Il n'y a pas de nom, prénom ou adresse car non requis par l'application.

---

## WIREFRAMES ET MAQUETTES

### Approche de conception UI/UX

L'approche mobile-first guide la conception des interfaces, reconnaissant que de nombreux utilisateurs accèdent aux applications depuis leurs smartphones. Les wireframes basse fidélité établissent la structure informationnelle et les flux de navigation avant le développement.

La maquette de la page d'accueil présente un header avec navigation, une hero section avec call-to-action, une présentation des fonctionnalités, et un footer.

[TODO: Insérer le wireframe de la page d'accueil - Créer avec Figma, Balsamiq ou draw.io]

La maquette du dashboard professeur présente une liste des quiz sous forme de cartes, un bouton Créer un quiz, des statistiques résumées, et une navigation latérale.

[TODO: Insérer le wireframe du dashboard professeur]

La maquette de création de quiz présente un formulaire pour le titre, une liste des questions ajoutées, un bouton pour ajouter une question, et un modal d'ajout de question.

[TODO: Insérer le wireframe de création de quiz]

La maquette de la page de jeu pour l'élève présente une barre de progression, la question affichée, les options de réponse sous forme de boutons, et un bouton valider.

[TODO: Insérer le wireframe de la page de jeu]

La maquette de la page de résultats présente le score en grand avec le pourcentage, un feedback visuel par la couleur, et un bouton retour.

[TODO: Insérer le wireframe de la page de résultats]

La maquette de la page de paiement présente une comparaison Gratuit versus Premium, les avantages Premium listés, un bouton Passer Premium, et la redirection vers Stripe Checkout.

[TODO: Insérer le wireframe de la page de paiement]

---

## ACCESSIBILITÉ

### Conformité WCAG 2.1 AA

L'accessibilité constitue une priorité dès la conception. Un skip link permet d'aller directement au contenu principal, caché visuellement mais accessible au clavier et aux lecteurs d'écran.

Les labels de formulaires sont explicitement associés aux champs via l'attribut for. Les champs en erreur utilisent aria-describedby pour lier le message d'erreur et aria-invalid pour indiquer l'état invalide.

La navigation au clavier fonctionne sur tous les éléments interactifs avec un ordre de tabulation logique et un focus visible grâce aux classes Tailwind.

Les annonces dynamiques utilisent aria-live polite pour informer les utilisateurs de lecteurs d'écran des changements sans les interrompre.

Les contrastes de couleurs respectent le ratio minimum 4.5:1 pour le texte normal grâce à la palette Tailwind configurée.

Les textes alternatifs sont fournis pour toutes les images fonctionnelles via l'attribut alt.

Les barres de progression utilisent role progressbar avec aria-valuenow, aria-valuemin, aria-valuemax et aria-label pour être accessibles.

### Extraits de code Accessibilité

Les captures suivantes illustrent l'implémentation concrète de l'accessibilité WCAG dans le composant QuestionDisplay.

[TODO: Insérer capture CODE_10_a11y_progressbar.png - Barre de progression accessible avec role progressbar et attributs ARIA (frontend/src/components/QuestionDisplay.vue, lignes 54-73)]

[TODO: Insérer capture CODE_11_a11y_radiogroup.png - Options de réponse avec role radiogroup, aria-checked et raccourcis clavier 1-4/A-D (frontend/src/components/QuestionDisplay.vue, lignes 90-123)]

---

## TESTS ET QUALITÉ

### Stratégie de tests

La stratégie de tests couvre le backend et le frontend avec une approche comprehensive.

Les tests backend utilisent Vitest et Supertest. Le fichier auth.test.js contient 13 tests couvrant l'inscription, la connexion et le profil. Le fichier quiz.test.js contient 15 tests pour le CRUD quiz, les limites et les codes. Le fichier question.test.js contient 13 tests pour le CRUD questions et la validation. Le fichier result.test.js contient 9 tests pour les scores et résultats. Le total backend est de 50 tests.

Les tests frontend utilisent Vitest et Vue Test Utils. Le fichier validators.test.js contient 28 tests pour la validation email, password et titre. Le fichier auth.store.test.js contient 18 tests pour le store authentification. Le fichier quiz.store.test.js contient 22 tests pour le store quiz. Le fichier Navbar.test.js contient 14 tests pour la barre de navigation. Le fichier ScoreDisplay.test.js contient 18 tests pour l'affichage du score. Le fichier QuestionDisplay.test.js contient 16 tests pour les questions et options. Le fichier QuizCard.test.js contient 12 tests pour la carte quiz. Le total frontend est de 149 tests.

Le total général s'élève à 199 tests couvrant l'ensemble de l'application.

Les tests d'intégration API vérifient les endpoints avec des requêtes HTTP réelles. Un test d'inscription vérifie qu'un nouvel utilisateur peut s'inscrire et reçoit un token. Un test de doublon vérifie qu'un email déjà utilisé retourne une erreur 409 CONFLICT.

Les tests de composants Vue montent les composants avec des props et vérifient le rendu et les émissions d'événements. Un test de ScoreDisplay vérifie que le score s'affiche correctement, qu'un score parfait affiche le message adéquat, et que le clic sur le bouton émet l'événement back.

---

## INDUSTRIALISATION ET CI/CD

### Configuration ESLint

La configuration ESLint backend définit l'environnement node et es2021 avec vitest-globals. Elle étend eslint recommended. Les règles incluent no-unused-vars en warning avec ignore des paramètres commençant par underscore, no-console en warning, et eqeqeq en error pour toujours utiliser l'égalité stricte.

La configuration ESLint frontend définit l'environnement browser et es2021 avec vitest-globals. Elle étend eslint recommended et plugin vue vue3-recommended. Les règles additionnelles désactivent vue multi-word-component-names et vue max-attributes-per-line.

### Configuration Prettier

Prettier est configuré sans point-virgule, avec des guillemets simples, une tabulation de 4 espaces, sans virgule trailing, une largeur de ligne de 100 caractères, et des fins de ligne lf.

### Pipeline CI/CD

Le pipeline GitHub Actions s'exécute sur push et pull request vers les branches main et develop. Le job backend s'exécute sur ubuntu-latest dans le répertoire backend. Il checkout le code, installe Node.js 20, installe les dépendances avec npm ci, vérifie le formatage, exécute le lint, et lance les tests. Le job frontend suit la même structure avec en plus l'étape de build.

### Scripts npm

Les scripts backend comprennent npm start pour démarrer le serveur, npm run dev pour le mode développement avec nodemon, npm test pour les tests, npm run lint pour ESLint, et npm run format pour Prettier.

Les scripts frontend comprennent npm run dev pour le serveur de développement Vite, npm run build pour le build production, npm test pour les tests, npm run lint pour ESLint, et npm run format pour Prettier.

---

## RETOUR D'EXPÉRIENCE

### Défis techniques surmontés

La gestion des tokens JWT a représenté un défi initial. La compréhension de l'équilibre entre sécurité avec une expiration courte et expérience utilisateur avec une session persistante m'a permis d'implémenter un système robuste. La solution inclut un access token avec expiration, un stockage sécurisé dans localStorage, et des intercepteurs Axios pour la gestion automatique.

L'intégration du système de paiement Stripe a nécessité une compréhension approfondie. Les sessions Checkout offrent une expérience sécurisée sans manipuler directement les données de carte. Les webhooks permettent la synchronisation des états de paiement. La vérification de signature garantit l'authenticité des notifications.

L'implémentation de l'accessibilité WCAG a enrichi ma compréhension du développement inclusif. La navigation au clavier doit fonctionner partout. Les lecteurs d'écran nécessitent une structure sémantique. Les contrastes et le focus visible améliorent l'expérience pour tous.

### Apprentissages majeurs

L'architecture modulaire avec séparation des responsabilités facilite grandement la maintenance et l'évolution du code. L'investissement dans les tests automatisés est rentable pour détecter les régressions avant la production. La sécurité doit être intégrée dès la conception car chaque décision technique a des implications sécuritaires. La documentation technique clarifie la pensée et facilite la collaboration.

### Évolution des compétences

Ce projet m'a permis de passer d'exercices académiques à la réalisation d'une application complète. J'ai développé le frontend avec Vue.js 3 et la Composition API pour une interface moderne et réactive. Le backend avec Node.js et Express m'a permis de construire une API REST sécurisée. La base de données relationnelle avec MySQL m'a appris la modélisation et l'optimisation des requêtes. Le DevOps avec CI/CD m'a initié à l'automatisation des processus de qualité.

---

## PERSPECTIVES D'ÉVOLUTION

### Fonctionnalités futures

Plusieurs évolutions sont envisagées pour enrichir la plateforme. Un timer par question de priorité haute permettrait de limiter le temps de réponse. Un mode temps réel de priorité moyenne synchroniserait les quiz pour des sessions multi-joueurs. Une fonctionnalité d'import/export de priorité moyenne permettrait de gérer les questions depuis Excel ou CSV. Des analytics avancés de priorité basse fourniraient des statistiques détaillées. Une application mobile de priorité basse pourrait être développée avec React Native ou Flutter.

### Améliorations techniques

TypeScript apporterait un typage statique pour plus de robustesse. Nuxt 3 permettrait le Server-Side Rendering pour un meilleur SEO. Redis servirait de cache pour améliorer les performances. Les tests E2E avec Playwright valideraient les parcours utilisateur complets.

---

## BILANS DE PROJET

### Bilan technique

Les objectifs techniques ont été atteints. L'application est fonctionnelle avec frontend, backend et base de données opérationnels. L'authentification est sécurisée avec JWT et bcrypt implémentés. La gestion des quiz est complète avec le CRUD et la limite freemium. Le système de paiement fonctionne avec l'intégration Stripe. L'interface admin est opérationnelle avec le dashboard et la gestion des utilisateurs. Les tests automatisés totalisent 199 tests dont 50 backend et 149 frontend. Le CI/CD est configuré avec GitHub Actions. L'accessibilité respecte WCAG 2.1 AA.

Les métriques finales montrent environ 3500 lignes de code frontend, environ 2000 lignes de code backend, 199 tests, plus de 25 endpoints API, plus de 15 composants Vue, et une couverture fonctionnelle de 100% du MVP.

### Bilan organisationnel

Le respect du planning est à évaluer. La phase d'analyse prévue sur 2 semaines, le backend sur 3 semaines, le frontend sur 3 semaines, les tests sur 1 semaine, et la documentation sur 2 semaines doivent être comparés au réel pour analyser les écarts.

Les difficultés rencontrées et leurs solutions incluent la compréhension de JWT résolue par documentation, tutoriels et tests. L'intégration des webhooks Stripe a été résolue par le mode test et des logs détaillés. L'accessibilité WCAG a nécessité un audit manuel et des outils automatisés. La gestion d'état Pinia a demandé une migration depuis une approche locale.

### Bilan personnel

Les compétences acquises comprennent la maîtrise de Vue.js 3 et de la Composition API, la conception d'API REST sécurisées, l'intégration de systèmes de paiement, la méthodologie de tests automatisés, et la documentation technique professionnelle.

Les axes d'amélioration identifiés sont l'approfondissement de TypeScript pour plus de robustesse, l'exploration des tests E2E avec Playwright, et l'amélioration des connaissances en DevOps notamment Docker et Kubernetes.

---

## CONCLUSION

QuizMaster représente l'aboutissement de ma formation en développement web full stack. Ce projet m'a permis de démontrer ma maîtrise des trois blocs de compétences du référentiel RNCP niveau 6.

Pour le Bloc 1 Analyse et Conception, j'ai réalisé un cahier des charges fonctionnel complet, une modélisation UML avec cas d'utilisation, classes et séquences, une architecture technique justifiée, et une base de données relationnelle normalisée.

Pour le Bloc 2 Développement Frontend, j'ai développé une interface moderne avec Vue.js 3 et Composition API, une gestion d'état avec Pinia, un design responsive avec Tailwind CSS, et une accessibilité conforme WCAG 2.1 AA.

Pour le Bloc 3 Développement Backend, j'ai créé une API REST sécurisée avec Express.js, une authentification JWT robuste, une intégration Stripe pour les paiements, et des tests automatisés totalisant 199 tests.

Les métriques techniques attestent de la qualité du projet avec 199 tests passants dont 50 backend et 149 frontend, un CI/CD fonctionnel avec GitHub Actions, une sécurité assurée par bcrypt, JWT, Helmet et requêtes préparées, et une accessibilité avec skip link, ARIA et focus visible.

Ce projet m'a préparé à intégrer une équipe technique professionnelle en me confrontant aux réalités du métier : gestion de projet, choix technologiques, sécurité, tests et documentation.

---

## BIBLIOGRAPHIE

### Documentation officielle

Vue.js Team. Vue.js 3 Guide. https://vuejs.org/guide/

Node.js Foundation. Node.js Documentation. https://nodejs.org/docs/

Express.js. Express Guide. https://expressjs.com/

Stripe. Stripe API Documentation. https://stripe.com/docs

### Standards et spécifications

W3C. Web Content Accessibility Guidelines WCAG 2.1. https://www.w3.org/WAI/WCAG21/

OWASP Foundation. OWASP Top Ten. https://owasp.org/Top10/

IETF. RFC 7519 JSON Web Token JWT. https://tools.ietf.org/html/rfc7519

### Ressources techniques

MDN Web Docs. Web APIs. https://developer.mozilla.org/

Tailwind CSS. Documentation. https://tailwindcss.com/docs

Pinia. Pinia Documentation. https://pinia.vuejs.org/

---

## ANNEXES

### Annexe A - Diagrammes d'analyse

A.1 : Bête à cornes - bete a corne.png
A.2 : Diagramme Pieuvre - diagramme pieuvre.png
A.3 : Objectifs SMART - SMART.png

### Annexe B - Diagrammes UML

B.1 : Cas d'utilisation Professeur - CUprofesseur.png
B.2 : Cas d'utilisation Élève - CUeleve.png
B.3 : Cas d'utilisation Admin - CUadmin.png
B.4 : Diagramme de classes - diagramme de classe.png
B.5 : Séquence Authentification - diagsequenceauthentification.png
B.6 : Séquence Quiz - diagsequencequiz.png
B.7 : Séquence Stripe - diagsequencestripe.png
B.8 : Activité Créer quiz - Creer un quiz diagramme diagramme d'activite.png
B.9 : Activité Jouer quiz - diagramme d'activite jouer un quiz.png
B.10 : Flux de données - Diagramme de flux de donnee.png

### Annexe C - Modélisation projet

C.1 : PBS - PBS.png
C.2 : WBS - WBS.png

### Annexe D - Base de données

D.1 : MCD - MCD.png
D.2 : MLD - MLD.png

### Annexe E - Wireframes

[TODO: Ajouter les 6 wireframes une fois créés]

### Annexe F - Captures d'écran

[TODO: Ajouter des captures d'écran de l'application fonctionnelle]

### Annexe G - Extraits de code

G.1 : Middleware d'authentification JWT - CODE_01_auth_middleware.png
G.2 : Fonction de connexion avec bcrypt - CODE_02_auth_controller_login.png
G.3 : Validation mot de passe sécurisé - CODE_03_auth_validator.png
G.4 : Chaîne de middlewares Express - CODE_04_quiz_routes.png
G.5 : Création session Stripe Checkout - CODE_05_stripe_checkout.png
G.6 : Gestion webhook Stripe - CODE_06_stripe_webhook.png
G.7 : Store Pinia authentification - CODE_07_auth_store.png
G.8 : Service API avec intercepteurs Axios - CODE_08_api_interceptors.png
G.9 : Guards de navigation Vue Router - CODE_09_router_guards.png
G.10 : Barre de progression accessible WCAG - CODE_10_a11y_progressbar.png
G.11 : RadioGroup accessible avec raccourcis clavier - CODE_11_a11y_radiogroup.png

---

## DÉCLARATION SUR L'HONNEUR

Je soussigné [Votre Nom], certifie sur l'honneur que le présent dossier de validation a été rédigé personnellement, que les éléments présentés correspondent à mes réalisations effectives, que les sources consultées sont correctement citées et référencées, que le code source présenté est issu de mes développements, et que les métriques et résultats sont authentiques et vérifiables.

J'atteste avoir pris connaissance du règlement de la certification et m'engage à respecter les principes d'intégrité académique et professionnelle.

Fait à [Ville], le [Date]

Signature : [Votre Nom]
