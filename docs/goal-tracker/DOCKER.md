# Dockerized Documentation

The Goals Tracker documentation has been dockerized for easy deployment.

## Quick Start

### Build and Run with Docker

```bash
# From the docs/goal-tracker directory
cd docs/goal-tracker

# Build the image
docker build -t goals-tracker-docs .

# Run the container
docker run -d -p 8001:80 --name goals-tracker-docs goals-tracker-docs
```

Documentation will be available at: **http://localhost:8001**

### Run with Docker Compose

From the project root:

```bash
# Start just the docs service
docker compose up goals-tracker-docs

# Or start all services including docs
docker compose up
```

Documentation will be available at: **http://localhost:8001**

## Dockerfile Overview

The Dockerfile uses a multi-stage build:

### Stage 1: Builder
- Uses Python 3.11 slim
- Installs MkDocs and Material theme
- Builds static site with `mkdocs build`

### Stage 2: Runtime
- Uses Nginx Alpine (lightweight)
- Serves the built static files
- Only ~65MB final image size

## Nginx Configuration

Custom nginx.conf includes:
- **Gzip compression** for faster loading
- **Cache headers** for static assets (1 year)
- **Security headers** (X-Frame-Options, X-Content-Type-Options, XSS Protection)
- **404 handling**

## Docker Commands

### Start container
```bash
docker run -d -p 8001:80 --name goals-tracker-docs goals-tracker-docs
```

### Stop container
```bash
docker stop goals-tracker-docs
```

### Remove container
```bash
docker rm goals-tracker-docs
```

### View logs
```bash
docker logs goals-tracker-docs
```

### Access container shell
```bash
docker exec -it goals-tracker-docs sh
```

## Deployment Options

### 1. Docker Hub

Push to Docker Hub for easy deployment:

```bash
# Tag the image
docker tag goals-tracker-docs yourusername/goals-tracker-docs:latest

# Push to Docker Hub
docker push yourusername/goals-tracker-docs:latest

# Run on any server
docker run -d -p 80:80 yourusername/goals-tracker-docs:latest
```

### 2. Render / Railway / Fly.io

Deploy using the Dockerfile:

1. Push code to GitHub
2. Connect your deployment platform to the repository
3. Set build context to `docs/goal-tracker`
4. Platform will automatically detect and use the Dockerfile

### 3. GitHub Pages (Alternative)

For a free static hosting option:

```bash
cd docs/goal-tracker
mkdocs gh-deploy
```

This builds and deploys to GitHub Pages automatically.

### 4. Nginx / Apache Server

Copy the built site to your web server:

```bash
# Build locally
mkdocs build

# Copy to server
scp -r site/* user@yourserver:/var/www/html/docs/
```

## Environment Variables

Currently, the docs don't require environment variables. If needed in the future:

```bash
docker run -d -p 8001:80 \
  -e VARIABLE_NAME=value \
  goals-tracker-docs
```

## Health Check

The container includes a health check:

```bash
# Check container health
docker inspect --format='{{.State.Health.Status}}' goals-tracker-docs
```

Expected output: `healthy`

## Customization

### Change Port

```bash
# Run on different port
docker run -d -p 9000:80 goals-tracker-docs
```

### Custom Nginx Config

Edit `nginx.conf` and rebuild:

```bash
# Modify nginx.conf
nano nginx.conf

# Rebuild
docker build -t goals-tracker-docs .
```

### Add SSL/HTTPS

Use a reverse proxy (Traefik, Caddy, or nginx-proxy) for SSL:

```yaml
# docker-compose.yml with Traefik example
services:
  goals-tracker-docs:
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.docs.rule=Host(`docs.yourdomain.com`)"
      - "traefik.http.routers.docs.tls=true"
      - "traefik.http.routers.docs.tls.certresolver=letsencrypt"
```

## CI/CD Integration

### GitHub Actions

Add to your workflow to build and push docs:

```yaml
- name: Build and push docs
  run: |
    cd docs/goal-tracker
    docker build -t ${{ secrets.DOCKER_USERNAME }}/goals-tracker-docs:latest .
    docker push ${{ secrets.DOCKER_USERNAME }}/goals-tracker-docs:latest
```

### Auto-rebuild on changes

The Dockerfile copies all docs files. Any change triggers a rebuild with Docker's layer caching.

## Troubleshooting

### Container won't start

```bash
# Check logs
docker logs goals-tracker-docs

# Verify image exists
docker images | grep docs
```

### Port already in use

```bash
# Find what's using the port
lsof -i :8001

# Use different port
docker run -d -p 8002:80 goals-tracker-docs
```

### Can't access documentation

```bash
# Check container is running
docker ps | grep docs

# Check port mapping
docker port goals-tracker-docs

# Test from container
docker exec goals-tracker-docs wget -O- http://localhost/
```

## Image Size Optimization

Current optimizations:
- ✅ Multi-stage build (only runtime files in final image)
- ✅ Alpine base (~5MB vs ~100MB for standard Linux)
- ✅ No build tools in final image
- ✅ `.dockerignore` excludes unnecessary files

Final image size: **~65MB**

## Security

Built-in security features:
- Non-root nginx user (Alpine nginx default)
- Security headers in nginx.conf
- No exposed secrets or credentials
- Read-only filesystem compatible

## Performance

- **Gzip compression** reduces transfer size by ~70%
- **Static file caching** (1 year for assets)
- **Nginx** is highly optimized for static content
- **Small image size** for fast deployments

## Next Steps

- Deploy to your chosen platform
- Set up custom domain (if needed)
- Configure SSL/HTTPS
- Add to CI/CD pipeline
- Monitor with health checks
