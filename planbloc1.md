# Plan de Travail - Bloc 1 : Analyser et Concevoir

## Objectif
Completer toute la documentation du Bloc 1 pour le projet QuizMaster.

---

## JOUR 1 - Analyse du Besoin

### Matin
- [ ] Rediger le **cahier des charges fonctionnel**
  - Contexte du projet
  - Objectifs (principal, secondaires)
  - Acteurs du systeme (prof, eleve, admin, Stripe)

- [ ] Lister les **exigences fonctionnelles**
  - Module Authentification (AUTH-01 a AUTH-04)
  - Module Quiz (QUIZ-01 a QUIZ-05)
  - Module Questions (QUEST-01 a QUEST-04)

### Apres-midi
- [ ] Completer les **exigences fonctionnelles**
  - Module Jeu (JEU-01 a JEU-04)
  - Module Resultats (RES-01 a RES-03)
  - Module Paiement (PAY-01 a PAY-03)
  - Module Administration (ADMIN-01 a ADMIN-10)

- [ ] Rediger les **exigences non fonctionnelles**
  - Performance, Securite, Accessibilite, SEO, Compatibilite

### Livrable J1
```
Bloc1.md - Sections 1.1 et 1.2 completees
```

---

## JOUR 2 - Outils de Modelisation

### Matin
- [ ] Creer la **Bete a cornes**
  - A qui rend-il service ?
  - Sur quoi agit-il ?
  - Dans quel but ?

- [ ] Creer le **Diagramme Pieuvre**
  - Identifier les elements exterieurs
  - Definir FP (fonction principale)
  - Definir FC (fonctions contraintes)

### Apres-midi
- [ ] Rediger l'**analyse SMART** des objectifs
  - Objectif 1 : Gestion des Quiz
  - Objectif 2 : Securite des donnees
  - Objectif 3 : Accessibilite
  - Objectif 4 : Monetisation
  - Objectif 5 : Administration

- [ ] (Optionnel) Matrice SWOT du projet

### Livrable J2
```
Bloc1.md - Section 2 completee (Outils de Modelisation)
```

---

## JOUR 3 - Modelisation UML

### Matin
- [ ] Creer le **Diagramme de Cas d'Utilisation**
  - Acteurs : Prof, Eleve, Admin, Stripe
  - Cas d'utilisation par acteur
  - Relations include/extend si necessaire

- [ ] Creer le **Diagramme de Classes**
  - Classes : User, Quiz, Question, Result, Answer, Payment, Log
  - Attributs et methodes
  - Relations et cardinalites

### Apres-midi
- [ ] Creer les **Diagrammes de Sequence**
  - Sequence 1 : Connexion utilisateur
  - Sequence 2 : Jouer un quiz
  - Sequence 3 : Paiement Stripe

- [ ] Creer les **Diagrammes d'Activite**
  - Activite 1 : Creer un quiz
  - Activite 2 : Jouer un quiz

### Livrable J3
```
Bloc1.md - Section 3 completee (Modelisation UML)
Fichiers images si crees avec un outil (draw.io, PlantUML)
```

---

## JOUR 4 - Base de Donnees et Architecture

### Matin
- [ ] Creer le **MCD** (Modele Conceptuel de Donnees)
  - Entites et attributs
  - Associations et cardinalites
  - Schema visuel

- [ ] Creer le **MLD** (Modele Logique de Donnees)
  - Transformation MCD → MLD
  - Cles primaires et etrangeres
  - Types de donnees

### Apres-midi
- [ ] Rediger le **Dictionnaire de Donnees**
  - Table users
  - Table quizzes
  - Table questions
  - Table results
  - Table answers
  - Table payments
  - Table logs

- [ ] Documenter l'**Architecture technique**
  - Architecture 3-tiers
  - Choix technologiques justifies
  - Pattern MVC backend

### Livrable J4
```
Bloc1.md - Sections 4 et 5 completees
Script SQL de creation (si pas deja fait)
```

---

## JOUR 5 - Planification, Risques et Conformite

### Matin
- [ ] Creer le **PBS** (Product Breakdown Structure)
  - Decomposition du produit en composants

- [ ] Creer le **WBS** (Work Breakdown Structure)
  - Decomposition du travail en taches
  - Lots de travail identifies

- [ ] (Optionnel) Creer un **Diagramme de Gantt**
  - Timeline du projet
  - Dependances entre taches

### Apres-midi
- [ ] Rediger l'**Analyse des Risques**
  - Identification des risques (R1 a R8)
  - Matrice Probabilite/Impact
  - Plan de mitigation

- [ ] Documenter la **Conformite RGPD**
  - Donnees personnelles collectees
  - Mesures de protection
  - Droits des utilisateurs

- [ ] Rediger la section **Veille Technologique**
  - Sources consultees
  - Technologies surveillees

- [ ] (Optionnel) Section **Methodologie Agile**
  - Framework Scrum utilise
  - User Stories

### Livrable J5
```
Bloc1.md - Sections 6, 7, 8, 9, 10 completees
Document Bloc1.md COMPLET et pret pour le jury
```

---

## Resume du Planning

| Jour | Theme | Sections Bloc1.md |
|------|-------|-------------------|
| **J1** | Analyse du Besoin | 1.1, 1.2 |
| **J2** | Outils de Modelisation | 2.1, 2.2, 2.3 |
| **J3** | Modelisation UML | 3.1 a 3.7 |
| **J4** | BDD et Architecture | 4, 5 |
| **J5** | Planification et Conformite | 6, 7, 8, 9, 10 |

---

## Checklist Finale

Avant de considerer le Bloc 1 comme termine :

- [ ] Cahier des charges complet
- [ ] Bete a cornes + Pieuvre
- [ ] Objectifs SMART
- [ ] Diagramme de cas d'utilisation
- [ ] Diagramme de classes
- [ ] Au moins 2 diagrammes de sequence
- [ ] Au moins 1 diagramme d'activite
- [ ] MCD complet
- [ ] MLD complet
- [ ] Dictionnaire de donnees
- [ ] Architecture documentee
- [ ] PBS et WBS
- [ ] Analyse des risques
- [ ] Conformite RGPD
- [ ] Veille technologique

---

## Conseils

1. **Commencer par le plus important** : Cahier des charges et UML sont prioritaires

2. **Utiliser des outils** :
   - draw.io (gratuit) pour les diagrammes
   - PlantUML pour generer depuis du code
   - dbdiagram.io pour MCD/MLD

3. **Ne pas inventer** : Baser tout sur le code reel de QuizMaster

4. **Relire Bloc1.md existant** : Une grande partie est deja faite !

5. **Preparer des reponses** : Le jury posera des questions sur ces documents
