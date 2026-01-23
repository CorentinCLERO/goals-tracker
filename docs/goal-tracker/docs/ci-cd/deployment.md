# Deployment Guide

This guide covers deployment strategies for Goals Tracker.

## Render Deployment

Goals Tracker is deployed on Render platform.

### Services

1. **Backend Service** - Spring Boot application
2. **Frontend Service** - React application  
3. **PostgreSQL Database** - Managed database

### Deployment Process

1. Code pushed to `main` branch
2. GitHub Actions runs tests
3. Docker images built and pushed to Docker Hub
4. Render pulls new images and deploys

### Environment Variables

Configure in Render dashboard:
- `DATABASE_HOST`
- `DATABASE_PORT`
- `DATABASE_USER`
- `DATABASE_PASSWORD`
- `DATABASE_NAME`
- `JWT_SECRET`
- `JWT_EXPIRATION`

### Manual Deployment

Trigger deployment via Render dashboard or API:

```bash
curl -X POST "https://api.render.com/v1/services/SERVICE_ID/deploys" \
  -H "Authorization: Bearer YOUR_API_TOKEN"
```

## Next Steps

- Review [GitHub Actions](github-actions.md)
- Learn about [Docker Setup](../development/docker.md)
