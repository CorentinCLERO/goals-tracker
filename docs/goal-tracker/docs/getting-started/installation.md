# Installation Guide

This guide will help you set up the Goals Tracker application on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Java 17** or higher ([Download](https://adoptium.net/))
- **Node.js 18** or higher ([Download](https://nodejs.org/))
- **Docker** and **Docker Compose** ([Download](https://www.docker.com/))
- **Git** ([Download](https://git-scm.com/))

### Optional
- **Maven 3.6+** (included via Maven Wrapper in the project)
- **PostgreSQL 14** (if running without Docker)

## Clone the Repository

```bash
git clone https://github.com/CorentinCLERO/goals-tracker.git
cd goals-tracker
```

## Environment Setup

### Backend Environment Variables

1. Navigate to the backend directory:
```bash
cd goals-tracker-back
```

2. Copy the example environment file:
```bash
cp .env.example .env
```

3. Edit the `.env` file with your configuration:
```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=user
DATABASE_PASSWORD=password
DATABASE_NAME=goals_tracker_db
JWT_SECRET=your-secret-key-here
JWT_EXPIRATION=86400000
```

### Frontend Environment Variables

1. Navigate to the frontend directory:
```bash
cd ../goals-tracker-front
```

2. Copy the example environment file:
```bash
cp .env.example .env
```

3. Edit the `.env` file:
```env
VITE_API_URL=http://localhost:8080/api
```

## Installation Methods

Choose one of the following installation methods:

### Method 1: Docker Compose (Recommended)

This is the easiest way to get started. It will set up all services (backend, frontend, database) automatically.

```bash
# From the project root directory
docker compose up --build
```

The services will be available at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080
- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **PostgreSQL**: localhost:5432

To stop the services:
```bash
docker compose down
```

To reset the database (delete all data):
```bash
docker compose down -v
```

### Method 2: Local Development (Without Docker)

#### Start PostgreSQL Database

You can either use Docker for just the database:

```bash
docker compose up db
```

Or install and configure PostgreSQL locally.

#### Backend Setup

```bash
cd goals-tracker-back

# Export environment variables (Linux/Mac)
export $(cat .env | grep -v "#" | xargs)

# For Windows PowerShell
Get-Content .env | ForEach-Object {
    if ($_ -match '^([^#].*)=(.*)$') {
        Set-Item -Path "env:$($matches[1])" -Value $matches[2]
    }
}

# Install dependencies and run
./mvnw clean install
./mvnw spring-boot:run
```

The backend will start on http://localhost:8080

#### Frontend Setup

```bash
cd goals-tracker-front

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will start on http://localhost:5173

## Verify Installation

1. **Check Frontend**:
   Open http://localhost:5173 in your browser

2. **Check API Documentation**:
   Open http://localhost:8080/swagger-ui.html in your browser

## Troubleshooting

### Port Already in Use

If you get a "port already in use" error:

- **Port 8080**: Change backend port in `application.properties` or stop the conflicting service
- **Port 5173**: Change frontend port in `vite.config.ts` or stop the conflicting service
- **Port 5432**: Change PostgreSQL port in `docker-compose.yml` or stop the conflicting service

### Database Connection Issues

- Ensure PostgreSQL is running
- Check database credentials in `.env` files
- Verify the database exists: `goals_tracker_db`

### Permission Denied (Maven Wrapper)

```bash
chmod +x mvnw
```

### Docker Issues

- Ensure Docker daemon is running
- Check Docker resources (memory, CPU)
- Try: `docker compose down -v && docker compose up --build`

## Next Steps

Once installation is complete, proceed to the [Quick Start Guide](quick-start.md) to learn how to use the application.
