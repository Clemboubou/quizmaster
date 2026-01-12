# BLOC 1 - Analyser et Concevoir une Application Informatique

## Table des matieres

1. [Analyse du Besoin](#1-analyse-du-besoin)
2. [Outils de Modelisation](#2-outils-de-modelisation)
3. [Modelisation UML](#3-modelisation-uml)
4. [Architecture et Choix Technologiques](#4-architecture-et-choix-technologiques)
5. [Base de Donnees - MCD/MLD](#5-base-de-donnees---mcdmld)
6. [Planification - WBS/PBS](#6-planification---wbspbs)
7. [Analyse des Risques](#7-analyse-des-risques)
8. [Conformite RGPD](#8-conformite-rgpd)
9. [Veille Technologique](#9-veille-technologique)
10. [Methodologie Agile](#10-methodologie-agile)

---

# 1. Analyse du Besoin

## 1.1 Cahier des Charges Fonctionnel

### Contexte du projet

**Nom du projet :** QuizMaster
**Type :** Application web fullstack
**Domaine :** Education / E-learning

### Presentation generale

QuizMaster est une plateforme web permettant aux professeurs de creer des quiz interactifs et aux eleves de les passer en ligne. L'application repond a un besoin de digitalisation des evaluations dans le contexte educatif.

### Objectifs du projet

| Objectif | Description |
|----------|-------------|
| **Principal** | Permettre la creation et le passage de quiz en ligne |
| **Secondaire** | Offrir un suivi des resultats pour les professeurs |
| **Commercial** | Monetiser via un modele freemium (Premium a 9.99€) |

### Acteurs du systeme

| Acteur | Description | Besoins |
|--------|-------------|---------|
| **Professeur** | Utilisateur createur de contenu | Creer des quiz, gerer les questions, voir les resultats |
| **Eleve** | Utilisateur consommateur | Rejoindre un quiz, repondre aux questions, voir son score |
| **Administrateur** | Gestionnaire de la plateforme | Gerer les utilisateurs, consulter les logs, voir les statistiques |
| **Systeme Stripe** | Systeme externe | Gerer les paiements Premium |

### Exigences fonctionnelles

#### Module Authentification
| ID | Exigence | Priorite |
|----|----------|----------|
| AUTH-01 | L'utilisateur peut s'inscrire avec email/mot de passe | Haute |
| AUTH-02 | L'utilisateur peut se connecter | Haute |
| AUTH-03 | Le mot de passe doit etre securise (8 chars, maj, min, chiffre) | Haute |
| AUTH-04 | L'utilisateur peut se deconnecter | Haute |

#### Module Quiz (Professeur)
| ID | Exigence | Priorite |
|----|----------|----------|
| QUIZ-01 | Le professeur peut creer un quiz avec un titre | Haute |
| QUIZ-02 | Le systeme genere un code d'acces unique (5 caracteres) | Haute |
| QUIZ-03 | Le professeur peut modifier le titre d'un quiz | Moyenne |
| QUIZ-04 | Le professeur peut supprimer un quiz | Moyenne |
| QUIZ-05 | Limite de 1 quiz en gratuit, 20 en Premium | Haute |

#### Module Questions (Professeur)
| ID | Exigence | Priorite |
|----|----------|----------|
| QUEST-01 | Le professeur peut ajouter des questions QCM (4 choix) | Haute |
| QUEST-02 | Le professeur peut ajouter des questions Vrai/Faux | Haute |
| QUEST-03 | Le professeur peut modifier une question | Moyenne |
| QUEST-04 | Le professeur peut supprimer une question | Moyenne |

#### Module Jeu (Eleve)
| ID | Exigence | Priorite |
|----|----------|----------|
| JEU-01 | L'eleve peut rejoindre un quiz via le code d'acces | Haute |
| JEU-02 | Les questions s'affichent une par une | Haute |
| JEU-03 | L'eleve voit son score a la fin | Haute |
| JEU-04 | Le resultat est enregistre en base | Haute |

#### Module Resultats
| ID | Exigence | Priorite |
|----|----------|----------|
| RES-01 | Le professeur voit les resultats de ses quiz | Haute |
| RES-02 | Le professeur voit le detail des reponses | Moyenne |
| RES-03 | L'eleve voit son historique de resultats | Moyenne |

#### Module Paiement
| ID | Exigence | Priorite |
|----|----------|----------|
| PAY-01 | Le professeur peut passer Premium via Stripe | Haute |
| PAY-02 | Le paiement est securise (webhook Stripe) | Haute |
| PAY-03 | Le statut Premium est mis a jour automatiquement | Haute |

#### Module Administration
| ID | Exigence | Priorite |
|----|----------|----------|
| ADMIN-01 | L'admin peut voir un dashboard avec statistiques globales | Haute |
| ADMIN-02 | L'admin peut lister tous les utilisateurs avec pagination | Haute |
| ADMIN-03 | L'admin peut modifier le role d'un utilisateur | Haute |
| ADMIN-04 | L'admin peut activer/desactiver un compte | Moyenne |
| ADMIN-05 | L'admin peut attribuer/retirer le statut Premium | Moyenne |
| ADMIN-06 | L'admin peut supprimer un utilisateur | Haute |
| ADMIN-07 | L'admin peut creer un nouvel utilisateur | Moyenne |
| ADMIN-08 | L'admin peut consulter les logs systeme avec filtres | Haute |
| ADMIN-09 | Toutes les actions importantes sont loguees | Haute |
| ADMIN-10 | Un admin ne peut pas supprimer son propre compte | Haute |

### Exigences non fonctionnelles

| Categorie | Exigence |
|-----------|----------|
| **Performance** | Temps de reponse API < 500ms |
| **Securite** | Mots de passe hashes (bcrypt), JWT pour auth |
| **Accessibilite** | WCAG 2.1 niveau AA |
| **SEO** | Meta tags, Open Graph, sitemap |
| **Compatibilite** | Chrome, Firefox, Safari, Edge (dernières versions) |
| **Responsive** | Desktop, tablette, mobile |

### Contraintes techniques

| Contrainte | Justification |
|------------|---------------|
| Frontend en Vue.js 3 | Imposé par le contexte de formation |
| Backend en Node.js/Express | Imposé par le contexte de formation |
| Base de données MySQL | Imposé par le contexte de formation |
| Hébergement XAMPP local | Environnement de développement |

---

## 1.2 Reformulation du Besoin Client

### Expression initiale du besoin
> "Je veux une application qui permet aux professeurs de créer des quiz et aux élèves de les passer en ligne."

### Reformulation structurée

**QUI ?**
- Professeurs (créateurs de contenu)
- Élèves (participants aux quiz)
- Administrateurs (gestionnaires de la plateforme)

**QUOI ?**
- Application web de quiz en ligne
- Système de questions QCM et Vrai/Faux
- Suivi des résultats
- Interface d'administration avec logs et statistiques

**POURQUOI ?**
- Digitaliser les évaluations
- Faciliter le suivi pédagogique
- Offrir une solution accessible
- Permettre la gestion et le monitoring de la plateforme

**COMMENT ?**
- Interface web responsive
- Codes d'accès pour rejoindre les quiz
- Stockage des résultats en base de données

**COMBIEN ?**
- Modèle freemium : 1 quiz gratuit, 20 quiz à 9.99€

---

# 2. Outils de Modelisation

## 2.1 Bete a Cornes

La bête à cornes répond à 3 questions fondamentales sur le produit.

```
                    ┌───────────────────────────────────────┐
                    │         A QUI REND-IL SERVICE ?       │
                    │                                       │
                    │  ┌───────────┐ ┌─────────┐ ┌───────┐  │
                    │  │Professeurs│ │ Eleves  │ │Admins │  │
                    │  └─────┬─────┘ └────┬────┘ └───┬───┘  │
                    └────────│────────────│──────────│──────┘
                             │            │
                             ▼            ▼
┌─────────────────────────────────────────────────────────────────┐
│                                                                  │
│                        ┌─────────────┐                          │
│                        │             │                          │
│                        │  QUIZMASTER │                          │
│                        │             │                          │
│                        └─────────────┘                          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                             │            │
                             ▼            ▼
                    ┌─────────────────────────────┐
                    │      SUR QUOI AGIT-IL ?     │
                    │                             │
                    │  ┌───────────────────────┐  │
                    │  │ Evaluations educatives │  │
                    │  │ (Quiz, QCM, Vrai/Faux) │  │
                    │  └───────────────────────┘  │
                    └─────────────────────────────┘
                                  │
                                  ▼
                    ┌─────────────────────────────┐
                    │     DANS QUEL BUT ?         │
                    │                             │
                    │ Permettre aux professeurs   │
                    │ de creer des evaluations    │
                    │ interactives et aux eleves  │
                    │ de les passer en ligne avec │
                    │ un suivi des resultats      │
                    └─────────────────────────────┘
```

### Reponses de la Bete a Cornes

| Question | Reponse |
|----------|---------|
| **A qui rend-il service ?** | Aux professeurs, eleves et administrateurs |
| **Sur quoi agit-il ?** | Sur les evaluations educatives (quiz interactifs) et la gestion de la plateforme |
| **Dans quel but ?** | Digitaliser et simplifier les evaluations avec suivi et permettre l'administration |

---

## 2.2 Diagramme Pieuvre (Analyse Fonctionnelle)

```
                              ┌─────────────┐
                              │ Professeur  │
                              └──────┬──────┘
                                     │ FP1
                                     ▼
┌─────────────┐    FC1    ┌─────────────────────┐    FC2    ┌─────────────┐
│   Eleve     │◄─────────►│                     │◄─────────►│   MySQL     │
└─────────────┘           │     QUIZMASTER      │           └─────────────┘
                          │                     │
┌─────────────┐    FC3    │                     │    FC4    ┌─────────────┐
│   Stripe    │◄─────────►│                     │◄─────────►│  Navigateur │
└─────────────┘           └─────────────────────┘           └─────────────┘
                                     │
                                     │ FC5
                                     ▼
                              ┌─────────────┐
                              │    RGPD     │
                              └─────────────┘
                                     ▲
                                     │ FC6
                              ┌──────┴──────┐
                              │    Admin    │
                              └─────────────┘
```

### Fonctions du systeme

| Fonction | Type | Description |
|----------|------|-------------|
| **FP1** | Principale | Permettre au professeur de creer et gerer des quiz |
| **FC1** | Contrainte | Permettre a l'eleve de passer les quiz |
| **FC2** | Contrainte | Stocker les donnees de maniere persistante |
| **FC3** | Contrainte | Gerer les paiements securises |
| **FC4** | Contrainte | Etre accessible via navigateur web |
| **FC5** | Contrainte | Respecter la reglementation RGPD |
| **FC6** | Contrainte | Permettre a l'admin de gerer la plateforme (users, logs) |

---

## 2.3 Analyse SMART des Objectifs

L'analyse SMART permet de definir des objectifs clairs et mesurables.

### Objectif 1 : Gestion des Quiz

| Critere | Application |
|---------|-------------|
| **S**pecifique | Permettre aux professeurs de creer des quiz avec questions QCM et V/F |
| **M**esurable | Maximum 1 quiz gratuit, 20 quiz premium |
| **A**tteignable | Technologies maitrisees (Vue.js, Express, MySQL) |
| **R**ealiste | Fonctionnalites CRUD standard |
| **T**emporel | Livraison pour la certification RNCP |

### Objectif 2 : Securite des donnees

| Critere | Application |
|---------|-------------|
| **S**pecifique | Securiser l'authentification et les donnees utilisateurs |
| **M**esurable | 0 mot de passe en clair, 100% des routes protegees |
| **A**tteignable | bcrypt + JWT = standards de l'industrie |
| **R**ealiste | Implementation classique et documentee |
| **T**emporel | Des le debut du developpement |

### Objectif 3 : Accessibilite

| Critere | Application |
|---------|-------------|
| **S**pecifique | Rendre l'application accessible aux personnes handicapees |
| **M**esurable | Conformite WCAG 2.1 niveau AA |
| **A**tteignable | Implementation progressive des criteres |
| **R**ealiste | Criteres prioritaires implementes |
| **T**emporel | Avant la livraison finale |

### Objectif 4 : Monetisation

| Critere | Application |
|---------|-------------|
| **S**pecifique | Proposer un abonnement Premium via Stripe |
| **M**esurable | Prix fixe de 9.99€, passage de 1 a 20 quiz |
| **A**tteignable | API Stripe bien documentee |
| **R**ealiste | Modele freemium eprouve |
| **T**emporel | Fonctionnel pour la demonstration |

### Objectif 5 : Administration

| Critere | Application |
|---------|-------------|
| **S**pecifique | Permettre aux admins de gerer les utilisateurs et consulter les logs |
| **M**esurable | CRUD complet sur les users, logs avec date/heure/IP |
| **A**tteignable | Endpoints API standards, interface Vue.js |
| **R**ealiste | Dashboard admin classique avec statistiques |
| **T**emporel | Fonctionnel pour la demonstration finale |

---

# 3. Modelisation UML

## 3.1 Diagramme de Cas d'Utilisation

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              SYSTEME QUIZMASTER                              │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                                                                      │    │
│  │    ┌──────────────┐          ┌──────────────┐                       │    │
│  │    │ S'inscrire   │          │ Se connecter │                       │    │
│  │    └──────┬───────┘          └───────┬──────┘                       │    │
│  │           │                          │                              │    │
│  │           │    ┌─────────────────────┘                              │    │
│  │           │    │                                                    │    │
│  │           ▼    ▼                                                    │    │
│  │                                                                      │    │
│  │    ┌──────────────┐     ┌──────────────┐     ┌──────────────┐       │    │
│  │    │ Creer quiz   │────►│Ajouter       │     │ Voir         │       │    │
│  │    └──────────────┘     │questions     │     │ resultats    │       │    │
│  │           │             └──────────────┘     └──────────────┘       │    │
│  │           │                    │                    ▲               │    │
│  │           │                    │                    │               │    │
│  │           ▼                    ▼                    │               │    │
│  │    ┌──────────────┐     ┌──────────────┐           │               │    │
│  │    │Modifier quiz │     │Modifier      │           │               │    │
│  │    └──────────────┘     │question      │           │               │    │
│  │           │             └──────────────┘           │               │    │
│  │           ▼                                        │               │    │
│  │    ┌──────────────┐                               │               │    │
│  │    │Supprimer quiz│                               │               │    │
│  │    └──────────────┘                               │               │    │
│  │                                                    │               │    │
│  │    ┌──────────────┐                               │               │    │
│  │    │Passer Premium│                               │               │    │
│  │    └──────────────┘                               │               │    │
│  │                                                                      │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│         ▲                                                    ▲               │
│         │                                                    │               │
│    ┌────┴────┐                                          ┌────┴────┐         │
│    │         │                                          │         │         │
│    │  PROF   │                                          │  ELEVE  │         │
│    │         │                                          │         │         │
│    └─────────┘                                          └─────────┘         │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                                                                      │    │
│  │    ┌──────────────┐     ┌──────────────┐     ┌──────────────┐       │    │
│  │    │Rejoindre quiz│────►│Repondre aux  │────►│Voir son score│       │    │
│  │    │(via code)    │     │questions     │     │              │       │    │
│  │    └──────────────┘     └──────────────┘     └──────────────┘       │    │
│  │                                                                      │    │
│  │    ┌──────────────┐                                                  │    │
│  │    │Voir son      │                                                  │    │
│  │    │historique    │                                                  │    │
│  │    └──────────────┘                                                  │    │
│  │                                                                      │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                         CAS D'UTILISATION ADMIN                      │    │
│  │                                                                      │    │
│  │    ┌──────────────┐     ┌──────────────┐     ┌──────────────┐       │    │
│  │    │Voir dashboard│     │Gerer         │     │Consulter     │       │    │
│  │    │statistiques  │     │utilisateurs  │     │les logs      │       │    │
│  │    └──────────────┘     └──────────────┘     └──────────────┘       │    │
│  │                               │                                      │    │
│  │                               ▼                                      │    │
│  │                   ┌─────────────────────────┐                        │    │
│  │                   │ - Lister utilisateurs   │                        │    │
│  │                   │ - Modifier role         │                        │    │
│  │                   │ - Activer/Desactiver    │                        │    │
│  │                   │ - Attribuer Premium     │                        │    │
│  │                   │ - Supprimer utilisateur │                        │    │
│  │                   │ - Creer utilisateur     │                        │    │
│  │                   └─────────────────────────┘                        │    │
│  │                                                                      │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                          ▲                                   │
│                                          │                                   │
│                                     ┌────┴────┐                              │
│                                     │  ADMIN  │                              │
│                                     └─────────┘                              │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

                                      │
                                      │
                                      ▼
                               ┌─────────────┐
                               │   STRIPE    │
                               │  (Systeme   │
                               │  externe)   │
                               └─────────────┘
```

### Description des cas d'utilisation

| Acteur | Cas d'utilisation | Description |
|--------|-------------------|-------------|
| Prof | S'inscrire | Creer un compte avec role "prof" |
| Prof | Se connecter | S'authentifier pour acceder au dashboard |
| Prof | Creer quiz | Creer un nouveau quiz avec titre |
| Prof | Ajouter questions | Ajouter QCM ou V/F au quiz |
| Prof | Modifier quiz/question | Editer le contenu existant |
| Prof | Supprimer quiz | Supprimer un quiz et ses questions |
| Prof | Voir resultats | Consulter les scores des eleves |
| Prof | Passer Premium | Payer 9.99€ via Stripe |
| Eleve | S'inscrire | Creer un compte avec role "eleve" |
| Eleve | Se connecter | S'authentifier |
| Eleve | Rejoindre quiz | Entrer le code a 5 caracteres |
| Eleve | Repondre questions | Selectionner les reponses |
| Eleve | Voir son score | Affichage du resultat final |
| Eleve | Voir historique | Consulter ses anciens resultats |
| Admin | Voir dashboard | Consulter les statistiques globales |
| Admin | Lister utilisateurs | Voir tous les comptes avec filtres |
| Admin | Modifier utilisateur | Changer role, premium, actif |
| Admin | Supprimer utilisateur | Supprimer un compte (sauf le sien) |
| Admin | Creer utilisateur | Creer un nouveau compte |
| Admin | Consulter logs | Voir l'historique des actions systeme |

---

## 3.2 Diagramme de Classes

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           DIAGRAMME DE CLASSES                               │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────┐
│         User            │
├─────────────────────────┤
│ - id: int               │
│ - email: string         │
│ - password: string      │
│ - role: enum(prof,eleve)│
│ - is_premium: boolean   │
│ - created_at: datetime  │
├─────────────────────────┤
│ + register()            │
│ + login()               │
│ + logout()              │
│ + getProfile()          │
└───────────┬─────────────┘
            │
            │ 1
            │
            │ possede
            │
            │ *
            ▼
┌─────────────────────────┐         ┌─────────────────────────┐
│         Quiz            │         │       Question          │
├─────────────────────────┤         ├─────────────────────────┤
│ - id: int               │ 1     * │ - id: int               │
│ - user_id: int (FK)     │────────►│ - quiz_id: int (FK)     │
│ - title: string         │contient │ - type: enum(qcm,vf)    │
│ - access_code: string   │         │ - question_text: string │
│ - created_at: datetime  │         │ - options: JSON         │
├─────────────────────────┤         │ - correct_answer: string│
│ + create()              │         ├─────────────────────────┤
│ + update()              │         │ + create()              │
│ + delete()              │         │ + update()              │
│ + generateCode()        │         │ + delete()              │
│ + getQuestions()        │         │ + validate()            │
└───────────┬─────────────┘         └─────────────────────────┘
            │
            │ 1
            │
            │ a des
            │
            │ *
            ▼
┌─────────────────────────┐         ┌─────────────────────────┐
│        Result           │         │        Answer           │
├─────────────────────────┤         ├─────────────────────────┤
│ - id: int               │ 1     * │ - id: int               │
│ - user_id: int (FK)     │────────►│ - result_id: int (FK)   │
│ - quiz_id: int (FK)     │contient │ - question_id: int (FK) │
│ - score: int            │         │ - user_answer: string   │
│ - played_at: datetime   │         │ - is_correct: boolean   │
├─────────────────────────┤         ├─────────────────────────┤
│ + create()              │         │ + create()              │
│ + getDetails()          │         │ + check()               │
└─────────────────────────┘         └─────────────────────────┘


┌─────────────────────────┐
│       Payment           │
├─────────────────────────┤
│ - id: int               │
│ - user_id: int (FK)     │
│ - stripe_session_id: str│
│ - amount: decimal       │
│ - status: string        │
│ - created_at: datetime  │
├─────────────────────────┤
│ + createCheckout()      │
│ + handleWebhook()       │
│ + confirmPayment()      │
└─────────────────────────┘
```

### Relations entre classes

| Relation | Cardinalite | Description |
|----------|-------------|-------------|
| User → Quiz | 1:N | Un professeur peut creer plusieurs quiz |
| Quiz → Question | 1:N | Un quiz contient plusieurs questions |
| Quiz → Result | 1:N | Un quiz peut avoir plusieurs resultats |
| User → Result | 1:N | Un eleve peut avoir plusieurs resultats |
| Result → Answer | 1:N | Un resultat contient plusieurs reponses |
| User → Payment | 1:N | Un utilisateur peut avoir plusieurs paiements |

---

## 3.3 Diagramme de Sequence - Connexion

```
┌─────────┐          ┌─────────┐          ┌─────────┐          ┌─────────┐
│  User   │          │ Frontend│          │ Backend │          │  MySQL  │
│(Browser)│          │ (Vue.js)│          │(Express)│          │         │
└────┬────┘          └────┬────┘          └────┬────┘          └────┬────┘
     │                    │                    │                    │
     │ 1. Saisit email    │                    │                    │
     │    et password     │                    │                    │
     │───────────────────►│                    │                    │
     │                    │                    │                    │
     │                    │ 2. POST /api/auth/login               │
     │                    │    {email, password}                   │
     │                    │───────────────────►│                    │
     │                    │                    │                    │
     │                    │                    │ 3. SELECT * FROM users
     │                    │                    │    WHERE email = ?  │
     │                    │                    │───────────────────►│
     │                    │                    │                    │
     │                    │                    │ 4. Retourne user   │
     │                    │                    │◄───────────────────│
     │                    │                    │                    │
     │                    │                    │ 5. bcrypt.compare()│
     │                    │                    │    (verifie mdp)   │
     │                    │                    │                    │
     │                    │                    │ 6. jwt.sign()      │
     │                    │                    │    (genere token)  │
     │                    │                    │                    │
     │                    │ 7. 200 OK          │                    │
     │                    │    {token, user}   │                    │
     │                    │◄───────────────────│                    │
     │                    │                    │                    │
     │                    │ 8. localStorage    │                    │
     │                    │    .setItem(token) │                    │
     │                    │                    │                    │
     │                    │ 9. store.user = user                   │
     │                    │                    │                    │
     │ 10. Redirect vers  │                    │                    │
     │     /dashboard     │                    │                    │
     │◄───────────────────│                    │                    │
     │                    │                    │                    │
```

---

## 3.4 Diagramme de Sequence - Jouer un Quiz

```
┌─────────┐          ┌─────────┐          ┌─────────┐          ┌─────────┐
│  Eleve  │          │ Frontend│          │ Backend │          │  MySQL  │
└────┬────┘          └────┬────┘          └────┬────┘          └────┬────┘
     │                    │                    │                    │
     │ 1. Saisit code     │                    │                    │
     │    "ABC12"         │                    │                    │
     │───────────────────►│                    │                    │
     │                    │                    │                    │
     │                    │ 2. GET /api/quizzes/join/ABC12         │
     │                    │───────────────────►│                    │
     │                    │                    │                    │
     │                    │                    │ 3. SELECT * FROM quizzes
     │                    │                    │    WHERE access_code = ?
     │                    │                    │───────────────────►│
     │                    │                    │                    │
     │                    │                    │◄───────────────────│
     │                    │                    │                    │
     │                    │ 4. 200 OK {quiz}   │                    │
     │                    │◄───────────────────│                    │
     │                    │                    │                    │
     │                    │ 5. GET /api/questions/play/:quizId     │
     │                    │───────────────────►│                    │
     │                    │                    │                    │
     │                    │                    │ 6. SELECT * FROM questions
     │                    │                    │    (sans correct_answer)
     │                    │                    │───────────────────►│
     │                    │                    │                    │
     │                    │ 7. 200 OK          │◄───────────────────│
     │                    │    {questions}     │                    │
     │                    │◄───────────────────│                    │
     │                    │                    │                    │
     │ 8. Affiche Q1      │                    │                    │
     │◄───────────────────│                    │                    │
     │                    │                    │                    │
     │ 9. Repond a chaque │                    │                    │
     │    question        │                    │                    │
     │───────────────────►│                    │                    │
     │        ...         │                    │                    │
     │                    │                    │                    │
     │                    │ 10. POST /api/results                  │
     │                    │     {quiz_id, score, answers}          │
     │                    │───────────────────►│                    │
     │                    │                    │                    │
     │                    │                    │ 11. INSERT INTO results
     │                    │                    │     INSERT INTO answers
     │                    │                    │───────────────────►│
     │                    │                    │                    │
     │                    │ 12. 201 Created    │◄───────────────────│
     │                    │◄───────────────────│                    │
     │                    │                    │                    │
     │ 13. Affiche score  │                    │                    │
     │     "8/10 - 80%"   │                    │                    │
     │◄───────────────────│                    │                    │
```

---

## 3.5 Diagramme de Sequence - Paiement Stripe

```
┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐
│  Prof   │     │ Frontend│     │ Backend │     │  Stripe │     │  MySQL  │
└────┬────┘     └────┬────┘     └────┬────┘     └────┬────┘     └────┬────┘
     │               │               │               │               │
     │ 1. Clique     │               │               │               │
     │   "Premium"   │               │               │               │
     │──────────────►│               │               │               │
     │               │               │               │               │
     │               │ 2. POST /api/payment/create-checkout         │
     │               │──────────────►│               │               │
     │               │               │               │               │
     │               │               │ 3. stripe.checkout           │
     │               │               │    .sessions.create()        │
     │               │               │──────────────►│               │
     │               │               │               │               │
     │               │               │ 4. Session URL│               │
     │               │               │◄──────────────│               │
     │               │               │               │               │
     │               │ 5. 200 OK     │               │               │
     │               │    {url}      │               │               │
     │               │◄──────────────│               │               │
     │               │               │               │               │
     │ 6. Redirect   │               │               │               │
     │    vers Stripe│               │               │               │
     │◄──────────────│               │               │               │
     │               │               │               │               │
     │ 7. Paie sur Stripe            │               │               │
     │──────────────────────────────────────────────►│               │
     │               │               │               │               │
     │               │               │ 8. POST /webhook              │
     │               │               │    (checkout.session.completed)
     │               │               │◄──────────────│               │
     │               │               │               │               │
     │               │               │ 9. Verifie signature          │
     │               │               │    Stripe                     │
     │               │               │               │               │
     │               │               │ 10. UPDATE users              │
     │               │               │     SET is_premium = true     │
     │               │               │──────────────────────────────►│
     │               │               │               │               │
     │               │               │ 11. INSERT payments           │
     │               │               │──────────────────────────────►│
     │               │               │               │               │
     │               │               │ 12. 200 OK    │               │
     │               │               │──────────────►│               │
     │               │               │               │               │
     │ 13. Redirect  │               │               │               │
     │    /payment/success           │               │               │
     │◄──────────────────────────────────────────────│               │
     │               │               │               │               │
```

---

## 3.6 Diagramme d'Activite - Creer un Quiz

```
                              ┌─────────────┐
                              │   DEBUT     │
                              └──────┬──────┘
                                     │
                                     ▼
                              ┌─────────────┐
                              │ Professeur  │
                              │ authentifie?│
                              └──────┬──────┘
                                     │
                          ┌──────────┴──────────┐
                          │                     │
                         Non                   Oui
                          │                     │
                          ▼                     ▼
                   ┌─────────────┐      ┌─────────────┐
                   │ Redirect    │      │ Verifier    │
                   │ vers /auth  │      │ limite quiz │
                   └─────────────┘      └──────┬──────┘
                                               │
                                    ┌──────────┴──────────┐
                                    │                     │
                              Limite atteinte       Limite OK
                                    │                     │
                                    ▼                     ▼
                             ┌─────────────┐      ┌─────────────┐
                             │ Proposer    │      │ Afficher    │
                             │ Premium     │      │ formulaire  │
                             └─────────────┘      └──────┬──────┘
                                                         │
                                                         ▼
                                                  ┌─────────────┐
                                                  │ Saisir      │
                                                  │ titre       │
                                                  └──────┬──────┘
                                                         │
                                                         ▼
                                                  ┌─────────────┐
                                                  │ Titre valide│
                                                  │ (5-100 car)?│
                                                  └──────┬──────┘
                                                         │
                                              ┌──────────┴──────────┐
                                              │                     │
                                             Non                   Oui
                                              │                     │
                                              ▼                     ▼
                                       ┌─────────────┐      ┌─────────────┐
                                       │ Afficher    │      │ Generer     │
                                       │ erreur      │      │ code acces  │
                                       └──────┬──────┘      └──────┬──────┘
                                              │                     │
                                              │                     ▼
                                              │              ┌─────────────┐
                                              │              │ INSERT quiz │
                                              │              │ en BDD      │
                                              │              └──────┬──────┘
                                              │                     │
                                              │                     ▼
                                              │              ┌─────────────┐
                                              │              │ Afficher    │
                                              │              │ quiz cree   │
                                              │              └──────┬──────┘
                                              │                     │
                                              └─────────┬───────────┘
                                                        │
                                                        ▼
                                                 ┌─────────────┐
                                                 │    FIN      │
                                                 └─────────────┘
```

---

## 3.7 Diagramme d'Activite - Jouer un Quiz

```
                              ┌─────────────┐
                              │   DEBUT     │
                              └──────┬──────┘
                                     │
                                     ▼
                              ┌─────────────┐
                              │ Saisir code │
                              │ d'acces     │
                              └──────┬──────┘
                                     │
                                     ▼
                              ┌─────────────┐
                              │ Code valide?│
                              └──────┬──────┘
                                     │
                          ┌──────────┴──────────┐
                          │                     │
                         Non                   Oui
                          │                     │
                          ▼                     ▼
                   ┌─────────────┐      ┌─────────────┐
                   │ Afficher    │      │ Charger     │
                   │ "Code       │      │ questions   │
                   │ invalide"   │      └──────┬──────┘
                   └──────┬──────┘             │
                          │                    ▼
                          │             ┌─────────────┐
                          │             │ Afficher    │
                          │             │ question N  │
                          │             └──────┬──────┘
                          │                    │
                          │                    ▼
                          │             ┌─────────────┐
                          │             │ Selectionner│
                          │             │ reponse     │
                          │             └──────┬──────┘
                          │                    │
                          │                    ▼
                          │             ┌─────────────┐
                          │             │ Valider     │
                          │             │ reponse     │
                          │             └──────┬──────┘
                          │                    │
                          │                    ▼
                          │             ┌─────────────┐
                          │             │ Calculer    │
                          │             │ si correct  │
                          │             └──────┬──────┘
                          │                    │
                          │                    ▼
                          │             ┌─────────────┐
                          │             │ Derniere    │
                          │             │ question?   │
                          │             └──────┬──────┘
                          │                    │
                          │         ┌──────────┴──────────┐
                          │         │                     │
                          │        Non                   Oui
                          │         │                     │
                          │         │                     ▼
                          │         │             ┌─────────────┐
                          │         │             │ Enregistrer │
                          │         │             │ resultat    │
                          │         │             └──────┬──────┘
                          │         │                    │
                          │         │                    ▼
                          │         │             ┌─────────────┐
                          │         │             │ Afficher    │
                          │         └────────────►│ score final │
                          │                       └──────┬──────┘
                          │                              │
                          └──────────────┬───────────────┘
                                         │
                                         ▼
                                  ┌─────────────┐
                                  │    FIN      │
                                  └─────────────┘
```

---

# 4. Architecture et Choix Technologiques

## 4.1 Architecture Globale

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           ARCHITECTURE 3-TIERS                               │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                              COUCHE PRESENTATION                             │
│                                 (Frontend)                                   │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                           Vue.js 3                                   │    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐            │    │
│  │  │  Views   │  │Components│  │  Stores  │  │ Services │            │    │
│  │  │ (pages) │  │(reutilis)│  │ (Pinia)  │  │ (Axios)  │            │    │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘            │    │
│  │                                                                      │    │
│  │  Router: Vue Router | Style: Tailwind CSS | Build: Vite            │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                    │                                         │
│                                    │ HTTP/REST (JSON)                       │
│                                    ▼                                         │
└─────────────────────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────────────────────┐
│                              COUCHE METIER                                   │
│                               (Backend)                                      │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                          Express.js                                  │    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐            │    │
│  │  │  Routes  │  │Middleware│  │Controller│  │Validators│            │    │
│  │  │          │  │(auth,role│  │ (logic)  │  │ (valid.) │            │    │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘            │    │
│  │                                                                      │    │
│  │  Auth: JWT + bcrypt | Security: Helmet + CORS | Payment: Stripe    │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                    │                                         │
│                                    │ SQL (mysql2)                           │
│                                    ▼                                         │
└─────────────────────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────────────────────┐
│                              COUCHE DONNEES                                  │
│                              (Database)                                      │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                            MySQL                                     │    │
│  │                                                                      │    │
│  │    users | quizzes | questions | results | answers | payments       │    │
│  │                                                                      │    │
│  │  Hebergement: XAMPP (local) | Relations: Foreign Keys + CASCADE    │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 4.2 Choix Technologiques Justifies

### Frontend

| Technologie | Alternative consideree | Pourquoi ce choix |
|-------------|------------------------|-------------------|
| **Vue.js 3** | React, Angular | Impose par la formation. Courbe d'apprentissage douce, Composition API moderne |
| **Pinia** | Vuex, Redux | Successeur officiel de Vuex, plus simple, meilleur TypeScript |
| **Vue Router** | - | Solution officielle Vue, guards de navigation |
| **Axios** | Fetch API | Intercepteurs, gestion d'erreurs, plus ergonomique |
| **Tailwind CSS** | Bootstrap, CSS pur | Utility-first, rapide, personnalisable, responsive natif |
| **Vite** | Webpack, Vue CLI | Tres rapide (ESBuild), config minimale, HMR instantane |

### Backend

| Technologie | Alternative consideree | Pourquoi ce choix |
|-------------|------------------------|-------------------|
| **Node.js** | PHP, Python, Java | Impose par la formation. JavaScript partout (front + back) |
| **Express.js** | Fastify, Koa, NestJS | Standard de facto, grande communaute, middlewares |
| **MySQL** | PostgreSQL, MongoDB | Impose par la formation. Relationnel = adapte aux relations user/quiz |
| **JWT** | Sessions, OAuth | Stateless, scalable, standard industrie |
| **bcrypt** | Argon2, scrypt | Standard, bien supporte, securise |
| **Stripe** | PayPal, Mollie | API excellente, docs claires, webhooks fiables |
| **Helmet** | Configuration manuelle | Securite HTTP automatique, best practices |

### Outils de developpement

| Outil | Justification |
|-------|---------------|
| **ESLint** | Qualite du code, detection erreurs |
| **Prettier** | Formatage automatique, coherence |
| **Vitest** | Tests rapides, compatible Vite, API Jest |
| **GitHub Actions** | CI/CD gratuit, integre a GitHub |
| **XAMPP** | Environnement local MySQL simple |

## 4.3 Pattern Architecture Backend

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      PATTERN MVC SIMPLIFIE (Backend)                         │
└─────────────────────────────────────────────────────────────────────────────┘

                    Requete HTTP
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              ROUTES                                          │
│                     (Definition des endpoints)                               │
│                                                                              │
│   router.post('/quizzes', authenticateToken, requireProf, createQuiz)       │
└────────────────────────────────────┬────────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            MIDDLEWARES                                       │
│                    (Fonctions intermediaires)                                │
│                                                                              │
│   authenticateToken → requireProf → validateQuiz                            │
│   (verifie JWT)      (verifie role)  (valide donnees)                       │
└────────────────────────────────────┬────────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           CONTROLLERS                                        │
│                       (Logique metier)                                       │
│                                                                              │
│   async function createQuiz(req, res) {                                     │
│       // Logique: verifier limite, generer code, inserer en BDD             │
│   }                                                                          │
└────────────────────────────────────┬────────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            DATABASE                                          │
│                         (Acces donnees)                                      │
│                                                                              │
│   pool.query('INSERT INTO quizzes (title, user_id) VALUES (?, ?)', [...])  │
└─────────────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
                              Reponse JSON
```

---

# 5. Base de Donnees - MCD/MLD

## 5.1 Modele Conceptuel de Donnees (MCD)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     MODELE CONCEPTUEL DE DONNEES (MCD)                       │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────┐                                      ┌──────────────┐
│    USER      │                                      │   PAYMENT    │
├──────────────┤                                      ├──────────────┤
│ #id          │                                      │ #id          │
│ email        │                                      │ stripe_id    │
│ password     │              1,1         0,n         │ amount       │
│ role         │◄────────────────────────────────────►│ status       │
│ is_premium   │            effectue                  │ created_at   │
│ created_at   │                                      └──────────────┘
└──────┬───────┘
       │
       │ 1,1
       │
       │ cree (si prof)
       │
       │ 0,n
       ▼
┌──────────────┐         1,n              0,n         ┌──────────────┐
│    QUIZ      │◄────────────────────────────────────►│   QUESTION   │
├──────────────┤           contient                   ├──────────────┤
│ #id          │                                      │ #id          │
│ title        │                                      │ type         │
│ access_code  │                                      │ question_text│
│ created_at   │                                      │ options      │
└──────┬───────┘                                      │ correct_ans  │
       │                                              └──────────────┘
       │ 1,1
       │
       │ genere
       │
       │ 0,n
       ▼
┌──────────────┐         1,n              0,n         ┌──────────────┐
│   RESULT     │◄────────────────────────────────────►│    ANSWER    │
├──────────────┤           contient                   ├──────────────┤
│ #id          │                                      │ #id          │
│ score        │                                      │ user_answer  │
│ played_at    │                                      │ is_correct   │
└──────────────┘                                      └──────────────┘
       ▲
       │
       │ 0,n
       │
       │ obtient (si eleve)
       │
       │ 1,1
       │
┌──────┴───────┐
│    USER      │
│   (eleve)    │
└──────────────┘

              ┌──────────────┐
              │     LOG      │
              ├──────────────┤
              │ #id          │
              │ action       │
              │ target_type  │
              │ target_id    │
              │ details      │
              │ ip_address   │
              │ user_agent   │
              │ created_at   │
              └──────┬───────┘
                     │
                     │ 0,n
                     │
                     │ genere
                     │
                     │ 0,1
                     ▼
              ┌──────────────┐
              │    USER      │
              └──────────────┘
```

### Cardinalites expliquees

| Relation | Cardinalite | Explication |
|----------|-------------|-------------|
| User → Quiz | 1,1 - 0,n | Un user (prof) cree 0 a n quiz. Un quiz appartient a 1 seul user |
| Quiz → Question | 1,1 - 0,n | Un quiz contient 0 a n questions. Une question appartient a 1 quiz |
| Quiz → Result | 1,1 - 0,n | Un quiz genere 0 a n resultats. Un resultat concerne 1 quiz |
| User → Result | 1,1 - 0,n | Un user (eleve) a 0 a n resultats. Un resultat appartient a 1 user |
| Result → Answer | 1,1 - 0,n | Un resultat contient 0 a n reponses. Une reponse appartient a 1 resultat |
| User → Payment | 1,1 - 0,n | Un user a 0 a n paiements. Un paiement appartient a 1 user |
| User → Log | 0,1 - 0,n | Un user genere 0 a n logs. Un log peut avoir 0 ou 1 user (nullable) |

---

## 5.2 Modele Logique de Donnees (MLD)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     MODELE LOGIQUE DE DONNEES (MLD)                          │
└─────────────────────────────────────────────────────────────────────────────┘

users (
    #id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('prof', 'eleve', 'admin') NOT NULL,
    is_premium BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

quizzes (
    #id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,                    -- FK → users.id
    title VARCHAR(100) NOT NULL,
    access_code VARCHAR(5) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
)

questions (
    #id INT PRIMARY KEY AUTO_INCREMENT,
    quiz_id INT NOT NULL,                    -- FK → quizzes.id
    type ENUM('qcm', 'vf') NOT NULL,
    question_text TEXT NOT NULL,
    options JSON NOT NULL,
    correct_answer VARCHAR(255) NOT NULL,
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
)

results (
    #id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,                    -- FK → users.id
    quiz_id INT NOT NULL,                    -- FK → quizzes.id
    score INT NOT NULL,
    played_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
)

answers (
    #id INT PRIMARY KEY AUTO_INCREMENT,
    result_id INT NOT NULL,                  -- FK → results.id
    question_id INT NOT NULL,                -- FK → questions.id
    user_answer VARCHAR(255) NOT NULL,
    is_correct BOOLEAN NOT NULL,
    FOREIGN KEY (result_id) REFERENCES results(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
)

payments (
    #id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,                    -- FK → users.id
    stripe_session_id VARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
)

logs (
    #id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NULL,                        -- FK → users.id (nullable)
    action VARCHAR(100) NOT NULL,
    target_type VARCHAR(50) NULL,
    target_id INT NULL,
    details JSON NULL,
    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
)
```

---

## 5.3 Schema Relationnel (Notation textuelle)

```
USERS (#id, email, password, role, is_premium, is_active, created_at)
QUIZZES (#id, title, access_code, created_at, user_id*)
QUESTIONS (#id, type, question_text, options, correct_answer, quiz_id*)
RESULTS (#id, score, played_at, user_id*, quiz_id*)
ANSWERS (#id, user_answer, is_correct, result_id*, question_id*)
PAYMENTS (#id, stripe_session_id, amount, status, created_at, user_id*)
LOGS (#id, action, target_type, target_id, details, ip_address, user_agent, created_at, user_id*)

Legende:
# = cle primaire
* = cle etrangere
```

---

## 5.4 Dictionnaire de Donnees

### Table USERS

| Attribut | Type | Taille | Contraintes | Description |
|----------|------|--------|-------------|-------------|
| id | INT | - | PK, AUTO_INCREMENT | Identifiant unique |
| email | VARCHAR | 255 | UNIQUE, NOT NULL | Email de connexion |
| password | VARCHAR | 255 | NOT NULL | Hash bcrypt du mot de passe |
| role | ENUM | - | NOT NULL | 'prof', 'eleve' ou 'admin' |
| is_premium | BOOLEAN | - | DEFAULT FALSE | Statut premium |
| is_active | BOOLEAN | - | DEFAULT TRUE | Compte actif ou desactive |
| created_at | TIMESTAMP | - | DEFAULT NOW | Date creation compte |

### Table QUIZZES

| Attribut | Type | Taille | Contraintes | Description |
|----------|------|--------|-------------|-------------|
| id | INT | - | PK, AUTO_INCREMENT | Identifiant unique |
| user_id | INT | - | FK, NOT NULL | Reference vers users |
| title | VARCHAR | 100 | NOT NULL | Titre du quiz (5-100 car) |
| access_code | VARCHAR | 5 | UNIQUE, NOT NULL | Code pour rejoindre |
| created_at | TIMESTAMP | - | DEFAULT NOW | Date creation quiz |

### Table QUESTIONS

| Attribut | Type | Taille | Contraintes | Description |
|----------|------|--------|-------------|-------------|
| id | INT | - | PK, AUTO_INCREMENT | Identifiant unique |
| quiz_id | INT | - | FK, NOT NULL | Reference vers quizzes |
| type | ENUM | - | NOT NULL | 'qcm' ou 'vf' |
| question_text | TEXT | - | NOT NULL | Enonce de la question |
| options | JSON | - | NOT NULL | ["opt1", "opt2", ...] |
| correct_answer | VARCHAR | 255 | NOT NULL | Bonne reponse |

### Table RESULTS

| Attribut | Type | Taille | Contraintes | Description |
|----------|------|--------|-------------|-------------|
| id | INT | - | PK, AUTO_INCREMENT | Identifiant unique |
| user_id | INT | - | FK, NOT NULL | Reference vers users (eleve) |
| quiz_id | INT | - | FK, NOT NULL | Reference vers quizzes |
| score | INT | - | NOT NULL | Nombre bonnes reponses |
| played_at | TIMESTAMP | - | DEFAULT NOW | Date du passage |

### Table ANSWERS

| Attribut | Type | Taille | Contraintes | Description |
|----------|------|--------|-------------|-------------|
| id | INT | - | PK, AUTO_INCREMENT | Identifiant unique |
| result_id | INT | - | FK, NOT NULL | Reference vers results |
| question_id | INT | - | FK, NOT NULL | Reference vers questions |
| user_answer | VARCHAR | 255 | NOT NULL | Reponse donnee |
| is_correct | BOOLEAN | - | NOT NULL | Etait-ce correct ? |

### Table PAYMENTS

| Attribut | Type | Taille | Contraintes | Description |
|----------|------|--------|-------------|-------------|
| id | INT | - | PK, AUTO_INCREMENT | Identifiant unique |
| user_id | INT | - | FK, NOT NULL | Reference vers users |
| stripe_session_id | VARCHAR | 255 | NOT NULL | ID session Stripe |
| amount | DECIMAL | 10,2 | NOT NULL | Montant en euros |
| status | VARCHAR | 50 | DEFAULT 'pending' | Statut paiement |
| created_at | TIMESTAMP | - | DEFAULT NOW | Date paiement |

### Table LOGS

| Attribut | Type | Taille | Contraintes | Description |
|----------|------|--------|-------------|-------------|
| id | INT | - | PK, AUTO_INCREMENT | Identifiant unique |
| user_id | INT | - | FK, NULL | Reference vers users (nullable) |
| action | VARCHAR | 100 | NOT NULL | Type d'action (LOGIN, USER_DELETED, etc.) |
| target_type | VARCHAR | 50 | NULL | Type d'entite concernee (user, quiz) |
| target_id | INT | - | NULL | ID de l'entite concernee |
| details | JSON | - | NULL | Informations supplementaires |
| ip_address | VARCHAR | 45 | NULL | Adresse IP du client |
| user_agent | TEXT | - | NULL | Navigateur/client utilise |
| created_at | TIMESTAMP | - | DEFAULT NOW | Date et heure de l'action |

---

# 6. Planification - WBS/PBS

## 6.1 PBS - Product Breakdown Structure

Le PBS decompose le produit en ses composants.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              QUIZMASTER                                      │
│                         (Application Web)                                    │
└────────────────────────────────────┬────────────────────────────────────────┘
                                     │
          ┌──────────────────────────┼──────────────────────────┐
          │                          │                          │
          ▼                          ▼                          ▼
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│    FRONTEND     │       │     BACKEND     │       │    DATABASE     │
│    (Vue.js)     │       │   (Express.js)  │       │    (MySQL)      │
└────────┬────────┘       └────────┬────────┘       └────────┬────────┘
         │                         │                         │
    ┌────┴────┐               ┌────┴────┐               ┌────┴────┐
    │         │               │         │               │         │
    ▼         ▼               ▼         ▼               ▼         ▼
┌───────┐ ┌───────┐     ┌───────┐ ┌───────┐     ┌───────┐ ┌───────┐
│ Views │ │Compo- │     │Routes │ │Middle-│     │Tables │ │Rela-  │
│       │ │nents  │     │       │ │wares  │     │       │ │tions  │
└───┬───┘ └───┬───┘     └───┬───┘ └───┬───┘     └───┬───┘ └───────┘
    │         │             │         │             │
    ▼         ▼             ▼         ▼             ▼
┌───────┐ ┌───────┐   ┌───────┐ ┌───────┐   ┌───────────────────┐
│- Home │ │-Navbar│   │- Auth │ │- Auth │   │- users            │
│- Auth │ │-Quiz  │   │- Quiz │ │- Role │   │- quizzes          │
│- Dash │ │ Card  │   │- Quest│ │- Valid│   │- questions        │
│- Quiz │ │-Quest │   │- Reslt│ │       │   │- results          │
│- Play │ │ Form  │   │- Pay  │ │       │   │- answers          │
│- Pay  │ │-Score │   │       │ │       │   │- payments         │
└───────┘ └───────┘   └───────┘ └───────┘   └───────────────────┘
```

---

## 6.2 WBS - Work Breakdown Structure

Le WBS decompose le travail en taches.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        PROJET QUIZMASTER                                     │
│                            (WBS)                                             │
└────────────────────────────────────┬────────────────────────────────────────┘
                                     │
    ┌────────────────┬───────────────┼───────────────┬────────────────┐
    │                │               │               │                │
    ▼                ▼               ▼               ▼                ▼
┌────────┐    ┌────────┐      ┌────────┐      ┌────────┐      ┌────────┐
│1.ANAL- │    │2.CONCEP│      │3.DEVEL-│      │4.TESTS │      │5.DEPLOY│
│YSE     │    │TION    │      │OPPEMENT│      │        │      │        │
└───┬────┘    └───┬────┘      └───┬────┘      └───┬────┘      └───┬────┘
    │             │               │               │               │
    ▼             ▼               ▼               ▼               ▼
┌────────┐  ┌────────┐      ┌────────┐      ┌────────┐      ┌────────┐
│1.1 CDC │  │2.1 UML │      │3.1 BDD │      │4.1 Unit│      │5.1 Build│
│        │  │        │      │        │      │        │      │        │
│1.2 Bete│  │2.2 MCD │      │3.2 API │      │4.2 Intg│      │5.2 CI/CD│
│a cornes│  │  /MLD  │      │        │      │        │      │        │
│        │  │        │      │3.3 Front│     │4.3 E2E │      │5.3 Docs │
│1.3 SMAR│  │2.3 Arch│      │        │      │        │      │        │
└────────┘  └────────┘      └────────┘      └────────┘      └────────┘
```

### Detail des lots de travail

| ID | Lot | Taches |
|----|-----|--------|
| **1** | **Analyse** | |
| 1.1 | Cahier des charges | Redaction CDC, exigences fonctionnelles |
| 1.2 | Outils modelisation | Bete a cornes, diagramme pieuvre |
| 1.3 | Objectifs SMART | Definition objectifs mesurables |
| **2** | **Conception** | |
| 2.1 | Modelisation UML | Use cases, classes, sequences, activites |
| 2.2 | Base de donnees | MCD, MLD, dictionnaire donnees |
| 2.3 | Architecture | Choix techno, patterns |
| **3** | **Developpement** | |
| 3.1 | Base de donnees | Creation tables MySQL |
| 3.2 | API Backend | Routes, controllers, middlewares |
| 3.3 | Frontend | Vues, composants, stores |
| **4** | **Tests** | |
| 4.1 | Tests unitaires | Validators, utils |
| 4.2 | Tests integration | API endpoints |
| 4.3 | Tests E2E | Parcours utilisateur |
| **5** | **Deploiement** | |
| 5.1 | Build | Build production |
| 5.2 | CI/CD | Pipeline GitHub Actions |
| 5.3 | Documentation | DOCUMENTATION.md, README |

---

# 7. Analyse des Risques

## 7.1 Matrice des Risques

| ID | Risque | Probabilite | Impact | Criticite | Mitigation |
|----|--------|-------------|--------|-----------|------------|
| R1 | Faille de securite (injection SQL) | Moyenne | Critique | **HAUTE** | Requetes preparees, validation inputs |
| R2 | Vol de tokens JWT | Faible | Critique | MOYENNE | HTTPS, expiration courte, refresh token |
| R3 | Mots de passe compromis | Faible | Critique | MOYENNE | bcrypt 10 rounds, politique mdp forte |
| R4 | Indisponibilite Stripe | Faible | Haute | MOYENNE | Gestion erreurs, retry, logs |
| R5 | Surcharge serveur | Faible | Moyenne | FAIBLE | Rate limiting (a implementer) |
| R6 | Perte de donnees | Faible | Critique | MOYENNE | Backups BDD reguliers |
| R7 | Incompatibilite navigateur | Moyenne | Faible | FAIBLE | Tests multi-navigateurs |
| R8 | Probleme accessibilite | Moyenne | Moyenne | MOYENNE | Tests WCAG, outils automatises |

## 7.2 Matrice Probabilite / Impact

```
                        IMPACT
              Faible    Moyen    Haut    Critique
           ┌─────────┬─────────┬─────────┬─────────┐
   Haute   │         │         │         │         │
           ├─────────┼─────────┼─────────┼─────────┤
Probabilite│         │   R8    │         │   R1    │
   Moyenne ├─────────┼─────────┼─────────┼─────────┤
           │   R7    │         │   R4    │  R2,R3  │
   Faible  │         │   R5    │         │   R6    │
           └─────────┴─────────┴─────────┴─────────┘
```

## 7.3 Plan de mitigation

### R1 - Injection SQL (CRITIQUE)

**Risque:** Un attaquant injecte du SQL malveillant via les inputs.

**Mitigation implementee:**
```javascript
// MAUVAIS - Vulnerable
pool.query(`SELECT * FROM users WHERE email = '${email}'`)

// BON - Requete preparee
pool.query('SELECT * FROM users WHERE email = ?', [email])
```

### R2/R3 - Securite authentification

**Mitigation implementee:**
- Hashage bcrypt avec 10 rounds
- JWT avec expiration (7 jours)
- Validation mot de passe (8 car, maj, min, chiffre)
- Helmet pour headers securite

### R8 - Accessibilite

**Mitigation implementee:**
- Skip link
- Labels accessibles
- ARIA attributes
- Focus visible
- Tests Lighthouse

---

# 8. Conformite RGPD

## 8.1 Donnees personnelles collectees

| Donnee | Base legale | Finalite | Duree conservation |
|--------|-------------|----------|-------------------|
| **Email** | Consentement (inscription) | Identification, connexion | Duree du compte |
| **Mot de passe** | Consentement | Authentification | Duree du compte (hashe) |
| **Role** | Consentement | Differencier prof/eleve | Duree du compte |
| **Resultats quiz** | Interet legitime | Suivi pedagogique | Duree du compte |
| **Donnees paiement** | Execution contrat | Traitement Premium | 10 ans (legal) |

## 8.2 Mesures de protection

### Minimisation des donnees
- Seules les donnees necessaires sont collectees
- Pas de nom, prenom, adresse (non requis)

### Securisation
| Mesure | Implementation |
|--------|----------------|
| Hashage mot de passe | bcrypt 10 rounds |
| Chiffrement transport | HTTPS (en production) |
| Tokens securises | JWT avec secret |
| Headers securite | Helmet.js |

### Droits des utilisateurs

| Droit RGPD | Implementation |
|------------|----------------|
| **Acces** | GET /api/auth/me (voir son profil) |
| **Rectification** | A implementer (modification email) |
| **Suppression** | CASCADE DELETE (supprime toutes les donnees) |
| **Portabilite** | A implementer (export JSON) |

## 8.3 Conformite technique

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         FLUX DES DONNEES PERSONNELLES                        │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────┐     HTTPS      ┌──────────┐     SQL        ┌──────────┐
│          │   (chiffre)    │          │   (prepare)    │          │
│  CLIENT  │───────────────►│  SERVEUR │───────────────►│  MySQL   │
│          │                │          │                │          │
│ - Email  │                │ - Valid. │                │ - Hash   │
│ - MDP    │                │ - bcrypt │                │ - Chiffre│
│          │                │ - JWT    │                │          │
└──────────┘                └──────────┘                └──────────┘

MESURES:
✓ Donnees chiffrees en transit (HTTPS)
✓ Mots de passe hashes (bcrypt)
✓ Requetes preparees (anti-injection)
✓ Tokens expires (7 jours)
✓ Headers securite (Helmet)
```

---

# 9. Veille Technologique

## 9.1 Veille realisee

### Vue.js 3 et Composition API

| Source | Type | Enseignement |
|--------|------|--------------|
| vuejs.org | Documentation officielle | Migration Options API → Composition API |
| Vue Mastery | Cours video | Patterns avances (composables) |
| GitHub Vue | Repository | Roadmap, nouvelles features |

**Choix influence:** Utilisation de `<script setup>` et composables (`useSeo`).

### Accessibilite Web (WCAG 2.1)

| Source | Type | Enseignement |
|--------|------|--------------|
| w3.org/WAI | Standard officiel | Criteres WCAG 2.1 AA |
| a11yproject.com | Communaute | Checklist pratique |
| MDN Web Docs | Documentation | Implementation ARIA |

**Choix influence:** Skip link, aria-live, role="progressbar", focus visible.

### Securite Node.js

| Source | Type | Enseignement |
|--------|------|--------------|
| OWASP | Organisation | Top 10 vulnerabilites |
| Node.js Best Practices | GitHub | Patterns securite |
| npm audit | Outil | Vulnerabilites dependances |

**Choix influence:** Helmet, bcrypt, JWT, requetes preparees.

## 9.2 Technologies surveillees

| Technologie | Interet | Statut |
|-------------|---------|--------|
| **Nuxt 3** | SSR pour meilleur SEO | A considerer pour v2 |
| **Prisma** | ORM moderne | Simplifierait les requetes |
| **tRPC** | API typee end-to-end | Alternative a REST |
| **Playwright** | Tests E2E | Pour tests navigateur |

## 9.3 Sources de veille

| Source | URL | Frequence |
|--------|-----|-----------|
| Vue.js Blog | blog.vuejs.org | Hebdomadaire |
| Node Weekly | nodeweekly.com | Hebdomadaire |
| Dev.to | dev.to/t/vue | Quotidienne |
| GitHub Trending | github.com/trending | Quotidienne |
| Twitter/X | @vuejs, @nodejs | Quotidienne |

---

# 10. Methodologie Agile

## 10.1 Framework Scrum - Theorie

### Roles Scrum

| Role | Responsabilite |
|------|----------------|
| **Product Owner** | Definit les priorites, gere le backlog |
| **Scrum Master** | Facilite, elimine les obstacles |
| **Equipe Dev** | Realise les increments |

### Evenements Scrum

| Evenement | Duree | Objectif |
|-----------|-------|----------|
| **Sprint** | 2-4 semaines | Periode de travail |
| **Sprint Planning** | 4h/sprint | Planifier le sprint |
| **Daily Scrum** | 15 min/jour | Synchronisation equipe |
| **Sprint Review** | 2h/sprint | Presenter l'increment |
| **Retrospective** | 1h30/sprint | Ameliorer le processus |

### Artefacts Scrum

| Artefact | Description |
|----------|-------------|
| **Product Backlog** | Liste priorisee des fonctionnalites |
| **Sprint Backlog** | Taches du sprint en cours |
| **Increment** | Produit potentiellement livrable |

---

## 10.2 Application au projet

### Product Backlog (exemple)

| ID | User Story | Priorite | Points |
|----|------------|----------|--------|
| US1 | En tant que prof, je veux creer un quiz | Haute | 5 |
| US2 | En tant que prof, je veux ajouter des questions | Haute | 8 |
| US3 | En tant qu'eleve, je veux rejoindre un quiz | Haute | 5 |
| US4 | En tant qu'eleve, je veux voir mon score | Haute | 3 |
| US5 | En tant que prof, je veux voir les resultats | Moyenne | 5 |
| US6 | En tant que prof, je veux passer Premium | Moyenne | 8 |
| US7 | En tant qu'eleve, je veux voir mon historique | Basse | 3 |

### Definition of Done (DoD)

Une User Story est "Done" quand :
- [ ] Code ecrit et fonctionnel
- [ ] Tests unitaires passes
- [ ] Code review effectuee
- [ ] Documentation mise a jour
- [ ] Deploye en environnement de test

---

# INFORMATIONS MANQUANTES

Les sections suivantes necessitent des informations que je n'ai pas :

## Methodologie Agile - Donnees reelles

Pour completer cette section, j'ai besoin de :

1. **Historique des sprints**
   - Dates de debut/fin de chaque sprint
   - User stories realisees par sprint
   - Points realises vs prevus

2. **Velocite**
   - Points completes par sprint
   - Graphique de velocite

3. **Burndown chart**
   - Donnees jour par jour

**Question:** As-tu travaille en sprints ? Si oui, peux-tu me donner les dates et ce qui a ete fait a chaque sprint ?

---

## Diagramme de Gantt

Pour creer un Gantt realiste, j'ai besoin de :

1. **Date de debut du projet**
2. **Date de fin (livraison)**
3. **Duree reelle de chaque phase** :
   - Analyse : X jours
   - Conception : X jours
   - Dev Backend : X jours
   - Dev Frontend : X jours
   - Tests : X jours
   - Documentation : X jours

**Question:** Quand as-tu commence et fini le projet ? Combien de temps pour chaque partie ?

---

## Matrice RACI

Pour creer une RACI, j'ai besoin de savoir :

1. **Equipe du projet**
   - Travail solo ou en equipe ?
   - Si equipe : qui a fait quoi ?

2. **Parties prenantes**
   - Tuteur/formateur ?
   - Client fictif ?

**Question:** As-tu travaille seul ou en equipe ? Qui etaient les parties prenantes ?

---

## Note sur les 20 tables

Tu as mentionne "20 tables MySQL" dans les exigences. Le projet QuizMaster en a **6 tables** :
- users, quizzes, questions, results, answers, payments

Si tu as besoin de 20 tables pour la certification, il faudrait :
- Soit etendre le projet avec de nouvelles fonctionnalites
- Soit clarifier si c'est une exigence reelle

**Question:** Les 20 tables sont-elles obligatoires ou etait-ce un exemple ?
