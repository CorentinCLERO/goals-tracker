# Database Schema

PostgreSQL database schema for Goals Tracker application.

## Database Configuration

- **Database**: PostgreSQL 14
- **Migrations**: Flyway
- **Connection Pool**: HikariCP (Spring Boot default)
- **ORM**: Hibernate (via Spring Data JPA)

## Schema Overview

```sql
users
  ├── goals
  │   └── goal_steps
  └── habits
      └── habit_logs
```

## Tables

### users

Stores user account information.

```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
```

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGSERIAL | PRIMARY KEY | Auto-incrementing ID |
| username | VARCHAR(50) | UNIQUE, NOT NULL | Unique username |
| email | VARCHAR(100) | UNIQUE, NOT NULL | User email |
| password | VARCHAR(255) | NOT NULL | BCrypt hashed password |
| created_at | TIMESTAMP | DEFAULT NOW | Account creation date |
| updated_at | TIMESTAMP | DEFAULT NOW | Last update date |

### goals

Stores user goals with progress tracking.

```sql
CREATE TABLE goals (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    priority VARCHAR(20) DEFAULT 'MEDIUM',
    status VARCHAR(20) DEFAULT 'IN_PROGRESS',
    category VARCHAR(50),
    start_date DATE,
    due_date DATE,
    progress INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_goals_user_id ON goals(user_id);
CREATE INDEX idx_goals_status ON goals(status);
CREATE INDEX idx_goals_due_date ON goals(due_date);
```

## Database Backup

### Manual Backup
```bash
docker compose exec db pg_dump -U user goals_tracker_db > backup.sql
```

### Restore
```bash
docker compose exec -T db psql -U user goals_tracker_db < backup.sql
```

## Next Steps

- Review [Backend Architecture](backend.md)
- Explore [API Reference](../api/authentication.md)
