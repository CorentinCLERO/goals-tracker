# Quick Start Guide

Get up and running with Goals Tracker in minutes!

## Launch the Application

### Using Docker Compose (Recommended)

```bash
cd goals-tracker
docker compose up --build
```

Wait for all services to start (approximately 1-2 minutes).

### Using Local Development

Terminal 1 - Database:
```bash
docker compose up db
```

Terminal 2 - Backend:
```bash
cd goals-tracker-back
export $(cat .env | grep -v "#" | xargs)
./mvnw spring-boot:run
```

Terminal 3 - Frontend:
```bash
cd goals-tracker-front
npm install
npm run dev
```

## Access the Application

- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **API Documentation**: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
- **Backend API**: [http://localhost:8080/api](http://localhost:8080/api)

## First Steps

### 1. Create an Account

1. Open http://localhost:5173
2. Click on "Sign Up"
3. Fill in your details:
   - Username
   - Email
   - Password
4. Click "Create Account"

### 2. Log In

1. Use your credentials to log in
2. You'll be redirected to the dashboard

### 3. Create Your First Goal

1. Navigate to "Goals" section
2. Click "New Goal"
3. Fill in the details:
   - **Title**: e.g., "Learn Spanish"
   - **Description**: Brief description of your goal
   - **Priority**: Low, Medium, or High
   - **Category**: Health, Career, Finance, Personal, etc.
   - **Due Date**: Set a deadline
4. Click "Create Goal"

### 4. Add Steps to Your Goal

1. Open your newly created goal
2. Click "Add Step"
3. Enter step details:
   - **Title**: e.g., "Complete Duolingo Level 1"
   - **Due Date** (optional)
4. Mark steps as complete as you progress

### 5. Create a Habit

1. Navigate to "Habits" section
2. Click "New Habit"
3. Configure your habit:
   - **Name**: e.g., "Morning Meditation"
   - **Description**: What you want to do
   - **Frequency**: Daily or X times per week
   - **Category**: Choose a category
4. Click "Create Habit"

### 6. Track Your Habits

1. View your habits on the dashboard
2. Click the checkbox to mark a habit complete for today
3. Watch your streak grow!

### 7. Monitor Progress

1. Visit the Dashboard to see:
   - Active goals
   - Today's habits
   - Completion statistics
   - Current streaks
   - Progress charts

## Common Tasks

### View Goal Details
```
Dashboard → Goals → Click on a goal
```

### Complete a Habit for Today
```
Dashboard → Habits → Check the box
```

### Update Goal Status
```
Goals → Select Goal → Edit → Change Status
```

### View Statistics
```
Dashboard → View Stats Section
```

## API Testing with Swagger

1. Open http://localhost:8080/swagger-ui.html
2. Click "Authorize" button
3. Login through the auth endpoints
4. Copy the JWT token from the response
5. Click "Authorize" and paste: `Bearer YOUR_TOKEN`
6. Test any API endpoint

### Example: Create a Goal via API

1. Go to "Goals" section in Swagger
2. Click on `POST /api/goals`
3. Click "Try it out"
4. Enter request body:
```json
{
  "title": "Read 12 Books This Year",
  "description": "Read one book per month",
  "priority": "MEDIUM",
  "category": "Personal",
  "dueDate": "2026-12-31"
}
```
5. Click "Execute"

## Development Workflow

### Make Changes to Backend

1. Edit Java files in `goals-tracker-back/src/`
2. Spring Boot DevTools will auto-reload
3. Test changes via Swagger or frontend

### Make Changes to Frontend

1. Edit React files in `goals-tracker-front/src/`
2. Vite HMR will auto-reload the browser
3. Check console for any errors

### Run Tests

Backend:
```bash
cd goals-tracker-back
./mvnw test
```

Frontend:
```bash
cd goals-tracker-front
npm run lint
npm run build
```

## Stopping the Application

### Docker Compose
```bash
docker compose down
```

### Local Development
Press `Ctrl+C` in each terminal running a service.

## Reset and Start Fresh

To clear all data and start over:

```bash
docker compose down -v
docker compose up --build
```

This removes all volumes including the database data.

## Next Steps

- Explore the [Backend Architecture](../architecture/backend.md)
- Learn about [Frontend Development](../development/frontend.md)
- Understand the [CI/CD Pipeline](../ci-cd/github-actions.md)
- Read the [API Reference](../api/authentication.md)
