# Docker Setup

This guide explains how to use Docker to run the Goals Tracker application.

## Docker Architecture

The application consists of three main services:

```
┌─────────────────────────────────────────────┐
│            Docker Compose                   │
├─────────────────────────────────────────────┤
│  ┌───────────────┐  ┌──────────────────┐   │
│  │   Frontend    │  │     Backend      │   │
│  │  React:5173   │  │  Spring:8080     │   │
│  └───────┬───────┘  └────────┬─────────┘   │
│          │                    │             │
│          └──────────┬─────────┘             │
│                     │                       │
│          ┌──────────▼──────────┐            │
│          │     PostgreSQL      │            │
│          │       :5432         │            │
│          └─────────────────────┘            │
└─────────────────────────────────────────────┘
```

## Docker Compose Configuration

### docker-compose.yml

```yaml
services:
  db:
    image: postgres:14
    restart: always
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: goals_tracker_db
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U user"]
      interval: 10s
      timeout: 5s
      retries: 5

  goals-tracker-backend:
    build:
      context: ./goals-tracker-back
      dockerfile: Dockerfile
    restart: always
    environment:
      DATABASE_HOST: db
      DATABASE_PORT: 5432
      DATABASE_USER: user
      DATABASE_PASSWORD: password
      DATABASE_NAME: goals_tracker_db
      JWT_SECRET: your-secret-key-change-in-production
      JWT_EXPIRATION: 86400000
    ports:
      - "8080:8080"
    depends_on:
      db:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/actuator/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  goals-tracker-front:
    build:
      context: ./goals-tracker-front
      dockerfile: Dockerfile
    restart: always
    environment:
      VITE_API_URL: http://localhost:8080
    ports:
      - "5173:5173"
    depends_on:
      - goals-tracker-backend

volumes:
  pgdata:
```

## Backend Dockerfile

Located at `goals-tracker-back/Dockerfile`:

```dockerfile
# Multi-stage build for optimized image size

# Stage 1: Build
FROM maven:3.9-eclipse-temurin-17 AS build

WORKDIR /app

# Copy dependency files first (layer caching)
COPY pom.xml .
COPY .mvn .mvn
COPY mvnw .

# Download dependencies
RUN ./mvnw dependency:go-offline -B

# Copy source code
COPY src ./src

# Build the application (skip tests for faster builds)
RUN ./mvnw clean package -DskipTests

# Stage 2: Runtime
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Copy the JAR from build stage
COPY --from=build /app/target/*.jar app.jar

# Create non-root user
RUN addgroup -g 1001 -S appuser && \
    adduser -u 1001 -S appuser -G appuser

USER appuser

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/actuator/health || exit 1

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
```

### Build Optimization

**Layer Caching**: Dependencies are cached separately from source code
**Multi-stage Build**: Only runtime dependencies in final image
**Alpine Base**: Smaller image size (~150MB vs ~400MB)
**Non-root User**: Security best practice

## Frontend Dockerfile

Located at `goals-tracker-front/Dockerfile`:

```dockerfile
# Stage 1: Build
FROM node:18-alpine AS build

WORKDIR /app

# Copy dependency files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Production with Nginx
FROM nginx:alpine

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx config (optional)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### Alternative: Development Mode

For development with hot reload:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]
```

## Docker Commands

### Basic Operations

**Start all services:**
```bash
docker compose up
```

**Start with rebuild:**
```bash
docker compose up --build
```

**Start in detached mode (background):**
```bash
docker compose up -d
```

**Stop all services:**
```bash
docker compose down
```

**Stop and remove volumes (deletes data):**
```bash
docker compose down -v
```

### Individual Services

**Start only database:**
```bash
docker compose up db
```

**Start backend and its dependencies:**
```bash
docker compose up goals-tracker-backend
```

**Rebuild a specific service:**
```bash
docker compose up --build goals-tracker-backend
```

### Viewing Logs

**View all logs:**
```bash
docker compose logs
```

**Follow logs (live):**
```bash
docker compose logs -f
```

**View logs for specific service:**
```bash
docker compose logs goals-tracker-backend
docker compose logs goals-tracker-front
docker compose logs db
```

**View last 100 lines:**
```bash
docker compose logs --tail=100
```

### Container Management

**List running containers:**
```bash
docker compose ps
```

**Execute command in container:**
```bash
docker compose exec goals-tracker-backend bash
docker compose exec db psql -U user -d goals_tracker_db
```

**Restart a service:**
```bash
docker compose restart goals-tracker-backend
```

**Stop a specific service:**
```bash
docker compose stop goals-tracker-backend
```

**Start a stopped service:**
```bash
docker compose start goals-tracker-backend
```

## Volume Management

### Database Persistence

Data is persisted in a Docker volume named `pgdata`.

**List volumes:**
```bash
docker volume ls
```

**Inspect volume:**
```bash
docker volume inspect goals-tracker_pgdata
```

**Backup database:**
```bash
docker compose exec db pg_dump -U user goals_tracker_db > backup.sql
```

**Restore database:**
```bash
docker compose exec -T db psql -U user goals_tracker_db < backup.sql
```

## Networking

### Service Communication

Services communicate using service names as hostnames:

- Backend → Database: `db:5432`
- Frontend → Backend: `goals-tracker-backend:8080`

### Port Mapping

| Service | Internal Port | External Port | Access |
|---------|--------------|---------------|--------|
| Frontend | 5173 or 80 | 5173 | http://localhost:5173 |
| Backend | 8080 | 8080 | http://localhost:8080 |
| Database | 5432 | 5432 | localhost:5432 |

## Environment Variables

### Production Configuration

Create a `.env` file in the project root:

```env
# Database
POSTGRES_USER=prod_user
POSTGRES_PASSWORD=strong_password_here
POSTGRES_DB=goals_tracker_prod

# Backend
JWT_SECRET=very-long-secret-key-for-production
JWT_EXPIRATION=86400000

# Frontend
VITE_API_URL=https://api.yourdomain.com
```

Use in docker-compose:

```yaml
services:
  db:
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
```

## Health Checks

### Backend Health Check

```bash
curl http://localhost:8080/actuator/health
```

Expected response:
```json
{
  "status": "UP",
  "components": {
    "db": {
      "status": "UP"
    }
  }
}
```

### Database Health Check

```bash
docker compose exec db pg_isready -U user
```

### Container Health Status

```bash
docker compose ps
```

Look for "healthy" status.

## Troubleshooting

### Container Won't Start

**Check logs:**
```bash
docker compose logs service-name
```

**Check if port is already in use:**
```bash
# Linux/Mac
lsof -i :8080
lsof -i :5173
lsof -i :5432

# Windows
netstat -ano | findstr :8080
```

### Database Connection Issues

**Verify database is running:**
```bash
docker compose ps db
```

**Test connection:**
```bash
docker compose exec db psql -U user -d goals_tracker_db -c "SELECT 1"
```

**Check backend environment variables:**
```bash
docker compose exec goals-tracker-backend env | grep DATABASE
```

### Backend Won't Connect to Database

**Wait for database to be ready:**
- Add health checks to docker-compose.yml
- Backend should wait for `db` service to be healthy

**Check network:**
```bash
docker network ls
docker network inspect goals-tracker_default
```

### Out of Memory

**Increase Docker memory:**
- Docker Desktop → Settings → Resources → Memory

**Optimize Java heap:**
```dockerfile
ENTRYPOINT ["java", "-Xmx512m", "-Xms256m", "-jar", "app.jar"]
```

### Slow Builds

**Use build cache:**
```bash
docker compose build --parallel
```

**Prune unused images:**
```bash
docker system prune -a
```

## Performance Optimization

### Build Cache

Layer order matters - frequently changing files should be copied last:

```dockerfile
# Good - dependencies cached separately
COPY package.json package-lock.json ./
RUN npm ci
COPY . .

# Bad - cache invalidated on any file change
COPY . .
RUN npm ci
```

### Image Size

**Use alpine images:**
```dockerfile
FROM node:18-alpine  # ~150MB
# vs
FROM node:18         # ~1GB
```

**Multi-stage builds:**
```dockerfile
FROM maven:3.9 AS build
# ... build steps

FROM eclipse-temurin:17-jre-alpine
COPY --from=build /app/target/*.jar app.jar
```

### Resource Limits

```yaml
services:
  goals-tracker-backend:
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 512M
```

## Production Considerations

### Security

- **Use secrets** for sensitive data (not environment variables)
- **Don't expose database port** in production
- **Use HTTPS** with reverse proxy (nginx)
- **Regular security updates** for base images

### Monitoring

Add monitoring tools:

```yaml
services:
  prometheus:
    image: prom/prometheus
    # ... configuration
  
  grafana:
    image: grafana/grafana
    # ... configuration
```

### Scaling

Scale services horizontally:

```bash
docker compose up --scale goals-tracker-backend=3
```

Add load balancer (nginx, traefik) for distribution.

## Next Steps

- Learn about [CI/CD Pipeline](../ci-cd/github-actions.md)
- Explore [Backend Development](backend.md)
- Check [Deployment Guide](../ci-cd/deployment.md)
