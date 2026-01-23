# Architecture Overview

This document provides a high-level overview of the Goals Tracker application architecture.

## System Architecture

Goals Tracker follows a modern three-tier architecture:

```
┌─────────────────────────────────────────────────────────────┐
│                        User/Browser                         │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTPS
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                     Frontend Layer                          │
│              React 19.2 + TypeScript + Vite                 │
│                      Port: 5173                             │
└──────────────────────────┬──────────────────────────────────┘
                           │ REST API (JSON)
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                     Backend Layer                           │
│            Java 17 + Spring Boot 4 + JWT Auth               │
│                      Port: 8080                             │
└──────────────────────────┬──────────────────────────────────┘
                           │ JDBC
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                   Database Layer                            │
│                PostgreSQL 14 + Flyway                       │
│                      Port: 5432                             │
└─────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend
- **React 19.2** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS
- **shadcn/ui** - Component library
- **Axios** - HTTP client

### Backend
- **Java 17** - Programming language
- **Spring Boot 4** - Application framework
- **Spring Security** - Authentication & authorization
- **Spring Data JPA** - Database access
- **JWT** (jjwt 0.12.3) - Token-based auth
- **Flyway** - Database migrations
- **Maven** - Build tool
- **SpringDoc OpenAPI** - API documentation

### Database
- **PostgreSQL 14** - Relational database
- **Flyway** - Schema versioning

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **GitHub Actions** - CI/CD pipeline
- **Render** - Cloud hosting
- **MkDocs** - Documentation

## Data Flow

### Authentication Flow

```
1. User submits credentials
   ↓
2. Frontend → POST /api/auth/login
   ↓
3. Backend validates credentials
   ↓
4. Backend generates JWT token
   ↓
5. Frontend stores token (localStorage)
   ↓
6. Frontend includes token in subsequent requests
   ↓
7. Backend validates token for each request
```

### Goal Management Flow

```
1. User creates goal
   ↓
2. Frontend → POST /api/goals (with JWT)
   ↓
3. Backend validates token
   ↓
4. Backend validates request data
   ↓
5. Backend saves to database
   ↓
6. Database returns saved entity
   ↓
7. Backend returns response
   ↓
8. Frontend updates UI
```

## Key Components

### Frontend Components

```
┌────────────────────────────────────────┐
│            Application                 │
├────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────────────┐   │
│  │  Router  │  │  Auth Context    │   │
│  └────┬─────┘  └────────┬─────────┘   │
│       │                 │              │
│  ┌────▼─────────────────▼─────────┐   │
│  │         Pages/Views            │   │
│  │  - Dashboard                   │   │
│  │  - Goals                       │   │
│  │  - Habits                      │   │
│  │  - Profile                     │   │
│  └────────────┬───────────────────┘   │
│               │                        │
│  ┌────────────▼───────────────────┐   │
│  │    Feature Components          │   │
│  │  - GoalList, GoalCard          │   │
│  │  - HabitList, HabitTracker     │   │
│  └────────────┬───────────────────┘   │
│               │                        │
│  ┌────────────▼───────────────────┐   │
│  │      API Services              │   │
│  │  - goalService                 │   │
│  │  - habitService                │   │
│  │  - authService                 │   │
│  └────────────────────────────────┘   │
└────────────────────────────────────────┘
```

### Backend Components

```
┌────────────────────────────────────────┐
│        Spring Boot Application         │
├────────────────────────────────────────┤
│  ┌──────────────────────────────────┐  │
│  │      Security Filter Chain       │  │
│  │  - CORS Filter                   │  │
│  │  - JWT Authentication Filter     │  │
│  └──────────────┬───────────────────┘  │
│                 │                       │
│  ┌──────────────▼───────────────────┐  │
│  │        REST Controllers          │  │
│  │  - AuthController                │  │
│  │  - GoalController                │  │
│  │  - HabitController               │  │
│  └──────────────┬───────────────────┘  │
│                 │                       │
│  ┌──────────────▼───────────────────┐  │
│  │          Services                │  │
│  │  - Business Logic                │  │
│  │  - Validation                    │  │
│  │  - Calculations                  │  │
│  └──────────────┬───────────────────┘  │
│                 │                       │
│  ┌──────────────▼───────────────────┐  │
│  │       Repositories               │  │
│  │  - Spring Data JPA               │  │
│  │  - Custom Queries                │  │
│  └──────────────┬───────────────────┘  │
│                 │                       │
│  ┌──────────────▼───────────────────┐  │
│  │           Database               │  │
│  │  - PostgreSQL via JDBC           │  │
│  └──────────────────────────────────┘  │
└────────────────────────────────────────┘
```

## Domain Model

### Core Entities

**User**
- Unique identifier
- Authentication credentials
- Profile information
- Relationships: Goals, Habits

**Goal**
- Title, description
- Priority (Low, Medium, High)
- Status (In Progress, Completed, Abandoned)
- Dates (start, due)
- Progress calculation
- Relationships: User, Steps

**GoalStep**
- Title
- Completion status
- Relationships: Goal

**Habit**
- Name, description
- Frequency (Daily, Weekly)
- Active status
- Streak tracking
- Relationships: User, Logs

**HabitLog**
- Date
- Completion status
- Relationships: Habit

### Entity Relationships

```
┌─────────┐
│  User   │
└────┬────┘
     │ 1
     │
     │ N
┌────▼────┐         ┌──────────┐
│  Goal   │─────────│ GoalStep │
└────┬────┘ 1     N └──────────┘
     │
     │ 1
     │
     │ N
┌────▼────┐         ┌──────────┐
│  Habit  │─────────│ HabitLog │
└─────────┘ 1     N └──────────┘
```

## Security Architecture

### Authentication

- **JWT-based** stateless authentication
- **Token expiration** for security
- **Password hashing** with BCrypt
- **Refresh mechanism** (optional)

### Authorization

- **Role-based** access control (future)
- **User isolation** - users only access their own data
- **API endpoint** protection

### Security Measures

```
┌────────────────────────────────────────┐
│        Security Layers                 │
├────────────────────────────────────────┤
│ 1. HTTPS (Transport Security)          │
│ 2. CORS Configuration                  │
│ 3. JWT Token Validation                │
│ 4. Input Validation & Sanitization     │
│ 5. SQL Injection Prevention (JPA)      │
│ 6. XSS Protection                      │
│ 7. CSRF Protection (disabled for API)  │
└────────────────────────────────────────┘
```

## Deployment Architecture

### Development

```
┌─────────────────────────────────────┐
│        Local Machine                │
│                                     │
│  Docker Compose                     │
│  ├── PostgreSQL Container           │
│  ├── Backend Container              │
│  └── Frontend Container             │
└─────────────────────────────────────┘
```

### Production (Render)

```
┌─────────────────────────────────────┐
│           Render Platform           │
│                                     │
│  ├── Backend Service                │
│  │   └── Docker Container           │
│  │                                  │
│  ├── Frontend Service               │
│  │   └── Docker Container           │
│  │                                  │
│  └── PostgreSQL Database            │
│      └── Managed Instance           │
└─────────────────────────────────────┘
```

## Scalability Considerations

### Horizontal Scaling

- **Stateless backend** - can run multiple instances
- **Load balancer** - distribute traffic
- **Database connection pooling** - HikariCP

### Vertical Scaling

- **Increase container resources**
- **Database optimization** - indexes, query optimization
- **Caching layer** (Redis - future)

### Performance Optimization

- **Database indexing** on frequently queried columns
- **Lazy loading** for relationships
- **Pagination** for large datasets
- **Frontend code splitting**
- **Asset optimization** (minification, compression)

## Monitoring & Observability

### Application Monitoring

- **Spring Boot Actuator** - health checks, metrics
- **Logs** - structured logging
- **Error tracking** (future: Sentry)

### Infrastructure Monitoring

- **Docker stats** - resource usage
- **Database metrics** - query performance
- **Uptime monitoring** (Render dashboard)

## Development Workflow

```
1. Local Development
   ├── Feature branch
   ├── Code changes
   └── Local testing
   
2. Pull Request
   ├── GitHub Actions runs tests
   ├── Code review
   └── Approval
   
3. Merge to Main
   ├── CI runs full test suite
   ├── Build Docker images
   ├── Push to Docker Hub
   └── Deploy to Render
   
4. Production
   └── Application live
```

## Future Enhancements

### Planned Features
- Email notifications
- Social features (sharing goals)
- Advanced analytics
- Mobile app (React Native)
- Reminder system

### Technical Improvements
- Redis caching
- GraphQL API option
- Microservices architecture
- Kubernetes deployment
- Enhanced monitoring (Prometheus/Grafana)

## Next Steps

- Explore [Backend Architecture](backend.md) in detail
- Learn about [Frontend Architecture](frontend.md)
- Understand [Database Schema](database.md)
- Review [CI/CD Pipeline](../ci-cd/github-actions.md)
