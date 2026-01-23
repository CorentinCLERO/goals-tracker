# Goals Tracker Documentation

![Docker](https://img.shields.io/badge/docker-ready-green) 
![Java](https://img.shields.io/badge/Java-17-orange?logo=openjdk) 
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4-brightgreen?logo=springboot) 
![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react) 
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14-336791?logo=postgresql)

## Welcome

Welcome to the **Goals Tracker** documentation. This application helps you manage personal and professional goals, track habits, and visualize progress with gamification features.

## What is Goals Tracker?

Goals Tracker is a comprehensive web application designed to help users:

- 📝 **Create and manage goals** with detailed tracking
- 🎯 **Break down goals into actionable steps**
- 🔄 **Build and maintain daily/weekly habits**
- 📊 **Visualize progress** with analytics and dashboards
- 🏆 **Stay motivated** through gamification (streaks, achievements)

## Technology Stack

### Backend
- **Java 17** with **Spring Boot 4**
- **Spring Security** with JWT authentication
- **PostgreSQL** database
- **Flyway** migrations
- **Maven** build tool

### Frontend
- **React 19.2** with **TypeScript**
- **Vite** build tool
- **React Router** for navigation
- **shadcn/ui** component library

### DevOps
- **Docker** & **Docker Compose** for containerization
- **GitHub Actions** for CI/CD
- **MkDocs** for documentation

## Quick Links

- [Installation Guide](getting-started/installation.md)
- [Quick Start](getting-started/quick-start.md)
- [Backend Documentation](architecture/backend.md)
- [Frontend Documentation](architecture/frontend.md)
- [CI/CD Pipeline](ci-cd/github-actions.md)

## Project Structure

```
goals-tracker/
├── goals-tracker-back/     # Spring Boot backend
├── goals-tracker-front/    # React frontend
├── docs/                   # MkDocs documentation
├── .github/workflows/      # GitHub Actions
└── docker-compose.yml      # Docker services
```

## Getting Started

To get started with Goals Tracker, check out the [Installation Guide](getting-started/installation.md) for detailed setup instructions.
