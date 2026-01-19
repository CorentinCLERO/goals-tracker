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

## 2) MVP — Minimum Required Features (Mandatory)

The MVP (Minimum Viable Product) represents the essential features that must be implemented.

### 2.1 User Management
- **Sign up and login**: secure authentication
- **User profile**: view and update personal information

### 2.2 Goals Management (CRUD)
- Create a goal with:
  - Title (**required**)
  - Description
  - Start date
  - Due date (deadline)
  - Priority: `Low`, `Medium`, `High`
  - Status: `In Progress`, `Completed`, `Abandoned`
  - Category (e.g., Health, Career, Finance, Personal)
- List goals:
  - View all goals
  - Filter by status and priority
  - Sort by due date
- View a goal:
  - Full details including progress
- Update a goal:
  - Edit all fields
- Mark as completed:
  - Change status to `Completed`
- Delete a goal

### 2.3 Goal Steps
- Create steps to break down a goal:
  - Step title
  - Due date (optional)
  - Status: `To Do`, `Completed`
- Mark a step as completed
- Compute progress:
  - percentage based on completed steps
- Update / delete steps

### 2.4 Habits Management (CRUD)
- Create a habit with:
  - Name (**required**)
  - Description
  - Frequency:
    - Daily
    - Weekly (X times per week)
  - Category
  - Start date
- List habits:
  - view all active habits
- Update a habit
- Archive a habit:
  - pause or stop

### 2.5 Habit Tracking
- Daily/weekly tracking:
  - calendar or grid view to mark days
  - `check` button to mark a habit as completed for today
  - visual history of completed days
- Streak calculation (consecutive completion):
  - current streak
  - best streak
- Completion rate:
  - percentage of completed days over a given period

### 2.6 Dashboard
- Overview of goals in progress
- Overview of today’s habits
- Basic stats:
  - number of completed goals
  - longest streak
  - habits completed today

### 2.7 User Interface
- Responsive UI (mobile, tablet, desktop)
- Clear navigation between goals and habits
- Visual feedback for completions (animations, colors)
- Motivational messages

## 3) Technology Stack (Full)

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

## 4) Project Structure (Proposed)

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

## 5) Installation & Setup (to be completed progressively)

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
