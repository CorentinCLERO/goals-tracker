![Docker](https://img.shields.io/badge/docker-ready-green) ![Java](https://img.shields.io/badge/Java-17-orange?logo=openjdk) ![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4-brightgreen?logo=springboot) ![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14-336791?logo=postgresql) [![Build and Deploy](https://github.com/CorentinCLERO/goals-tracker/actions/workflows/ci.yml/badge.svg)](https://github.com/CorentinCLERO/goals-tracker/actions/workflows/ci.yml) [![Website shields.io](https://img.shields.io/website-up-down-green-red/http/shields.io.svg)](https://goals-tracker-xtkv.onrender.com)

# Goals-tracker
A web application to manage personal/professional goals and recurring habits. Users can define goals, break them down into actionable steps, build daily/weekly habits, and track progress over time with basic analytics and gamification-oriented indicators (e.g., streaks).

## 1) Project Overview

### 1.1 General Description
This project aims to build a web application for **goal and habit management** that enables users to:
- create and manage **goals** (personal or professional),
- split each goal into **concrete steps**,
- create **recurring habits** (daily/weekly),
- **track progress** with clear visual history and dashboard views,
- stay motivated through **gamification mechanics** and progress visualization.

### 1.2 Context
Personal development and habit formation are key factors in both personal and professional success. This application helps users structure ambitions, follow daily progress, and sustain motivation through gamification-inspired mechanics and data visualization.

### 1.3 Learning Objectives
Through this project, the team will:
- design an application with **two distinct main domains** (Goals vs Habits),
- implement **time-based tracking** (daily/weekly),
- create **data visualizations** (stats, charts),
- handle **recurring events** (habits),
- develop **gamification mechanics** (streaks, points, badges),
- work with **temporal data** and progress computations,
- set up **Docker** and **CI/CD**,
- use **Git** and **GitHub Projects** effectively.


## 2) Checklist - Projet 5 jours

### Jour 1 : Introduction, Git/GitHub et planification

#### Matin (9h10 - 12h40)
- [x] Assister à la présentation générale du cours et des objectifs
- [x] Écouter la présentation des 4 projets proposés
- [x] Découvrir les outils modernes (Docker, CI/CD, GitHub Projects)
- [x] Participer aux questions-réponses
- [x] Former le groupe (3 à 5 étudiants)
- [x] S'inscrire sur le Framacalc
- [x] Choisir le projet du groupe
- [x] Créer le dépôt GitHub
- [x] Ajouter les collaborateurs au dépôt
- [x] Créer la structure de dossiers (docs/, src/, tests/, .github/)
- [x] Créer le fichier .gitignore adapté
- [x] Créer le fichier README.md initial
- [x] Cloner le dépôt en local
- [x] Réviser les bonnes pratiques Git (commits, branches, pull requests)

#### Après-midi (13h40 - 17h10)
- [x] Analyser les exigences du projet en groupe
- [x] Faire un brainstorming sur les technologies
- [x] Définir les fonctionnalités principales et prioriser (MVP)
- [x] Créer un nouveau projet dans GitHub Projects
- [x] Configurer les colonnes (À faire, En cours, En révision, Terminé)
- [x] Créer les issues pour chaque fonctionnalité/tâche
- [x] Attribuer les issues aux membres du groupe
- [x] Ajouter les labels (bug, enhancement, documentation, etc.)
- [x] Définir les milestones pour chaque jour
- [x] Rédiger le README.md complet avec :
  - [x] Description détaillée du projet
  - [x] Fonctionnalités principales prévues
  - [x] Technologies choisies (stack technique)
  - [x] Structure du projet
  - [x] Instructions d'installation (à compléter)
- [x] Élaborer un planning détaillé pour les 5 jours
- [x] Faire le premier commit collectif (chaque membre commit au moins une fois)

---

### Jour 2 : Conception et conteneurisation avec Docker

#### Matin (9h10 - 12h40)

##### Backend
- [x] Concevoir l'architecture du serveur
- [x] Définir les routes API et les données échangées
- [x] Modéliser les endpoints (CRUD, authentification, etc.)
- [x] Documenter les API (format des requêtes/réponses)

##### Frontend
- [x] Réaliser une maquette de l'interface utilisateur (Figma, Pencil, papier)
- [x] Organiser les composants UI
- [x] Définir le parcours utilisateur (user flow)

##### Base de données
- [x] Modéliser les données (schéma entité-relation ou modèle de documents)
- [x] Créer le schéma initial de la base de données
- [x] Définir les relations entre les entités

##### GitHub Projects
- [x] Mettre à jour GitHub Projects avec les issues détaillées

#### Après-midi (13h40 - 17h10)

##### Docker - Concepts
- [x] Assister à la présentation de Docker
- [x] Comprendre les concepts (images, conteneurs, volumes)
- [x] Installer et configurer Docker localement

##### Dockerfile et docker-compose
- [x] Créer le Dockerfile pour le backend
- [x] Choisir l'image de base appropriée
- [x] Configurer les dépendances
- [x] Exposer les ports
- [x] Créer le fichier docker-compose.yml
- [x] Configurer les services (backend, frontend, base de données)
- [x] Configurer les volumes pour la persistance
- [x] Configurer les réseaux entre conteneurs

##### Tests et documentation
- [x] Lancer l'environnement avec `docker-compose up`
- [x] Vérifier la communication entre les services
- [x] Résoudre les premiers problèmes de configuration
- [x] Ajouter les instructions Docker dans le README.md
- [x] Faire les commits et synchroniser via Git

---

### Jour 3 : Développement des fonctionnalités principales

#### Matin (9h10 - 12h40)

##### Configuration
- [x] Configurer les environnements de développement avec Docker

##### Backend
- [x] Initialiser le serveur backend
- [x] Implémenter les routes de base
- [x] Configurer la connexion à la base de données
- [x] Mettre en place la structure du projet (MVC, services, etc.)
- [x] Implémenter les premières API CRUD

##### Frontend
- [x] Initialiser le projet frontend
- [x] Créer la page d'accueil
- [x] Mettre en place le routing
- [x] Créer les composants de base

##### Git et tests
- [x] Utiliser les feature branches pour chaque fonctionnalité
- [x] Faire des commits réguliers avec messages explicites
- [x] Tester la connexion entre frontend et backend via API

#### Après-midi (13h40 - 17h10)

##### Backend
- [x] Poursuivre l'implémentation des API principales
- [x] Ajouter la gestion des erreurs
- [x] Valider les données d'entrée
- [x] Ajouter des tests unitaires de base pour les routes critiques

##### Frontend
- [x] Développer les pages principales
- [x] Intégrer les appels API
- [x] Gérer les états de l'application
- [x] Ajouter la gestion des erreurs côté client

##### Bonnes pratiques Git
- [x] Créer des pull requests pour fusionner les branches
- [x] Faire la revue de code entre membres
- [x] Résoudre les conflits éventuels

##### Suivi et tests
- [x] Mettre à jour GitHub Projects (déplacer les issues)
- [x] Faire des tests d'intégration de base

---

### Jour 4 : Développement avancé et CI/CD

#### Matin (9h10 - 12h40)

##### Backend
- [x] Implémenter les fonctionnalités avancées (authentification, autorisation, etc.)
- [x] Optimiser les requêtes base de données
- [x] Ajouter des tests unitaires supplémentaires
- [x] Documenter les API (Swagger/OpenAPI si possible)

##### Frontend
- [x] Développer les fonctionnalités interactives
- [x] Améliorer l'interface utilisateur (UX/UI)
- [x] Ajouter les validations côté client
- [x] Gérer les cas d'erreur et messages utilisateur

##### Tests et débogage
- [ ] Faire des tests d'intégration entre backend et frontend
- [ ] Déboguer les problèmes identifiés

#### Après-midi (13h40 - 17h10)

##### CI/CD - Concepts
- [x] Assister à la présentation du CI/CD
- [x] Comprendre les concepts (intégration continue, déploiement continu)
- [x] Découvrir GitHub Actions

##### GitHub Actions - Configuration
- [x] Créer le dossier .github/workflows/
- [x] Configurer un fichier YAML pour le CI
- [x] Configurer le déclenchement sur push et pull request

##### Pipeline - Étapes
- [x] Ajouter le checkout du code
- [x] Ajouter l'installation des dépendances
- [x] Ajouter le linting du code (ESLint, Pylint, etc.)
- [x] Ajouter l'exécution des tests unitaires
- [x] Ajouter le build de l'application
- [x] Ajouter le build des images Docker

##### Badges et vérification
- [x] Configurer les badges GitHub
- [x] Ajouter le badge de statut CI dans le README.md
- [x] Vérifier le bon fonctionnement du workflow

##### Tests et optimisation
- [x] Vérifier que tous les tests passent
- [x] Résoudre les erreurs dans le workflow
- [x] Optimiser les temps d'exécution
- [x] Faire des commits et pull requests avec passage des tests CI

---

### Jour 5 : Finalisation, tests et présentation

#### Matin (9h10 - 12h40)

##### Tests finaux
- [ ] Faire des tests fonctionnels complets
- [ ] Faire des tests de bout en bout (E2E) si possible
- [ ] Tester la compatibilité navigateurs
- [ ] Tester le responsive design
- [ ] Résoudre les derniers bugs

##### Optimisation
- [ ] Améliorer les performances
- [ ] Nettoyer le code (refactoring si nécessaire)
- [ ] Valider le respect des bonnes pratiques

##### Documentation finale
- [ ] Finaliser le README.md avec :
  - [ ] Instructions complètes pour exécuter le projet
  - [ ] Documentation des API développées
  - [ ] Guide d'utilisation de l'application
  - [ ] Captures d'écran de l'interface
- [ ] Ajouter un fichier CONTRIBUTING.md
- [ ] Ajouter la documentation technique dans docs/

##### Vérification finale
- [ ] Tester le démarrage complet avec `docker-compose up`
- [ ] Vérifier que tous les workflows CI passent
- [ ] Tester sur une machine vierge si possible

#### Après-midi (13h40 - 17h10)
- [ ] Préparer la présentation du projet
- [ ] Faire la démonstration du projet
- [ ] Présenter les défis rencontrés et les solutions apportées
- [ ] Recueillir les retours


---

## 3) MVP — Minimum Required Features (Mandatory)

The MVP (Minimum Viable Product) represents the essential features that must be implemented.

### 3.1 User Management
- [x] **Sign up and login**: secure authentication
- [ ] **User profile**: view and update personal information

### 3.2 Goals Management (CRUD)
- [ ] Create a goal with:
  - Title (**required**)
  - Description
  - Start date
  - Due date (deadline)
  - Priority: `Low`, `Medium`, `High`
  - Status: `In Progress`, `Completed`, `Abandoned`
  - Category (e.g., Health, Career, Finance, Personal)
- [ ] List goals:
  - View all goals
  - Filter by status and priority
  - Sort by due date
- [ ] View a goal:
  - Full details including progress
- [ ] Update a goal:
  - Edit all fields
- [ ] Mark as completed:
  - Change status to `Completed`
- [ ] Delete a goal

### 3.3 Goal Steps
- [ ] Create steps to break down a goal:
  - Step title
  - Due date (optional)
  - Status: `To Do`, `Completed`
- [ ] Mark a step as completed
- [ ] Compute progress:
  - percentage based on completed steps
- [ ] Update / delete steps

### 3.4 Habits Management (CRUD)
- [ ] Create a habit with:
  - Name (**required**)
  - Description
  - Frequency:
    - Daily
    - Weekly (X times per week)
  - Category
  - Start date
- [ ] List habits:
  - view all active habits
- [ ] Update a habit
- [ ] Archive a habit:
  - pause or stop

### 3.5 Habit Tracking
- [ ] Daily/weekly tracking:
  - calendar or grid view to mark days
  - `check` button to mark a habit as completed for today
  - visual history of completed days
- [ ] Streak calculation (consecutive completion):
  - current streak
  - best streak
- [ ] Completion rate:
  - percentage of completed days over a given period

### 3.6 Dashboard
- [ ] Overview of goals in progress
- [ ] Overview of today’s habits
- [ ] Basic stats:
  - number of completed goals
  - longest streak
  - habits completed today

### 3.7 User Interface
- [ ] Responsive UI (mobile, tablet, desktop)
- [ ] Clear navigation between goals and habits
- [ ] Visual feedback for completions (animations, colors)
- [ ] Motivational messages


## 4) Technology Stack (Full)

### Backend
- **Java + Spring Boot**
- **Spring Security** (authentication)
- **REST API**
- Build tool: **Maven**

### Frontend
- **React**
- **TypeScript**
- Routing: **React Router**
- UI library: *shadcn*

### Database
- **PostgreSQL**
- Migrations: **Flyway**

### Documentation
- **MkDocs**

### DevOps
- **Docker** (services: backend, database, frontend)
- **GitHub Actions** (CI/CD)
  - lint/test/build
  - build Docker images
  - deployment

## 5) Project Structure (Proposed)

Monorepo structure:

```
.
├── goals-tracker-back/      # Spring Boot app
│   ├── src/
│   ├── pom.xml
│   ├── docker/
│   └── README.md
├── goals-tracker-front/     # React + TypeScript app
│   ├── src/
│   ├── package.json
│   ├── docker/
│   └── README.md
├── docs/                    # MkDocs documentation
│   ├── index.md
│   ├── mkdocs.yml
│   └── assets/
├── .github/
│   └── workflows/           # GitHub Actions workflows
├── docker-compose.yml
└── README.md
```

## 6) Installation & Setup (to be completed progressively)

### 5.1 Prerequisites
- **Java**
- **Node.js**
- **Docker** + **Docker Compose**
- **PostgreSQL** (if running outside Docker)

### 5.2 Environment Variables (example)
All `.env` are in the different files, we have to use .env.exemple as .env:


### 5.3 Run with Docker (recommended)
Commands (to finalize once `docker-compose.yml` is in place):

- Start:
  - `docker compose up --build`
- Stop:
  - `docker compose down`
- Reset DB (deletes data):
  - `docker compose down -v`

### 5.4 Run locally (without Docker)
#### Backend
- Go to `backend/`
- Run (to confirm):
  - `./mvn spring-boot:run`

#### Frontend
- Go to `frontend/`
- Install dependencies:
  - `npm install`
- Start dev server:
  - `npm run dev`

### 5.5 Documentation (MkDocs)
- Go to `docs/`
- Install MkDocs (method to define)
- Serve locally:
  - `mkdocs serve`
- Build static docs:
  - `mkdocs build`
