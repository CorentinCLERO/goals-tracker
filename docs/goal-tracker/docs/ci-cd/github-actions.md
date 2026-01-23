# GitHub Actions CI/CD

Goals Tracker uses GitHub Actions for continuous integration and deployment.

## CI/CD Overview

```
┌──────────────────────────────────────────────────────────┐
│                    GitHub Actions                        │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  Push/PR → Test → Build → Docker → Push → Deploy       │
│                                                          │
│  ┌─────────┐   ┌───────┐   ┌────────┐   ┌──────────┐  │
│  │  Test   │ → │ Build │ → │ Docker │ → │  Deploy  │  │
│  │ Backend │   │Frontend│   │ Images │   │  Render  │  │
│  │Frontend │   │Backend│   │        │   │          │  │
│  └─────────┘   └───────┘   └────────┘   └──────────┘  │
└──────────────────────────────────────────────────────────┘
```

## Workflow Configuration

Located at `.github/workflows/ci.yml`:

```yaml
name: Build, Test and Push Docker Images

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main
      - develop

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up JDK 17
        uses: actions/setup-java@v4
        with:
          distribution: temurin
          java-version: 17
          cache: maven

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: npm
          cache-dependency-path: goals-tracker-front/package-lock.json

      - name: Install frontend dependencies
        run: |
          cd goals-tracker-front
          npm ci

      - name: Run frontend linter
        run: |
          cd goals-tracker-front
          npm run lint

      - name: Build frontend app
        run: |
          cd goals-tracker-front
          npm run build

      - name: Run backend tests
        run: |
          cd goals-tracker-back
          ./mvnw -B test

  build-and-push:
    if: github.ref == 'refs/heads/main'
    needs: test
    runs-on: ubuntu-latest
    environment: githubaction
    
    strategy:
      matrix:
        service: [back, front]
        include:
          - service: back
            build_path: goals-tracker-back
            image_name: goals-tracker-back
            dockerfile: Dockerfile
          - service: front
            build_path: goals-tracker-front
            image_name: goals-tracker-front
            dockerfile: Dockerfile

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Get commit hash
        id: vars
        run: echo "sha_short=$(git rev-parse --short HEAD)" >> $GITHUB_OUTPUT

      - name: Log in to Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.USERNAME }}
          password: ${{ secrets.PASSWORD }}

      - name: Build and tag Docker image
        run: |
          cd ${{ matrix.build_path }}
          docker build -f ${{ matrix.dockerfile }} \
            -t ${{ secrets.USERNAME }}/${{ matrix.image_name }}:latest \
            -t ${{ secrets.USERNAME }}/${{ matrix.image_name }}:${{ steps.vars.outputs.sha_short }} .

      - name: Push Docker images
        run: |
          docker push ${{ secrets.USERNAME }}/${{ matrix.image_name }}:latest
          docker push ${{ secrets.USERNAME }}/${{ matrix.image_name }}:${{ steps.vars.outputs.sha_short }}

      - name: Trigger Render deploy
        env:
          RENDER_SERVICE_ID_BACKEND: ${{ secrets.RENDER_SERVICE_ID_BACKEND }}
          RENDER_API_TOKEN: ${{ secrets.RENDER_API_TOKEN }}
        run: |
          curl -X POST "https://api.render.com/v1/services/${RENDER_SERVICE_ID_BACKEND}/deploys" \
            -H "Authorization: Bearer ${RENDER_API_TOKEN}" \
            -H "Accept: application/json"
```

## Workflow Breakdown

### 1. Triggers

The workflow runs on:

- **Push to main**: Full CI/CD pipeline (test → build → deploy)
- **Pull Request to main/develop**: Tests only (no deployment)

```yaml
on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main
      - develop
```

### 2. Test Job

Runs tests and builds for both frontend and backend.

#### Setup Steps

**Checkout Code:**
```yaml
- name: Checkout code
  uses: actions/checkout@v4
```

**Setup Java 17:**
```yaml
- name: Set up JDK 17
  uses: actions/setup-java@v4
  with:
    distribution: temurin
    java-version: 17
    cache: maven
```

**Setup Node.js:**
```yaml
- name: Set up Node.js
  uses: actions/setup-node@v4
  with:
    node-version: 18
    cache: npm
    cache-dependency-path: goals-tracker-front/package-lock.json
```

#### Frontend Tests

```yaml
- name: Install frontend dependencies
  run: |
    cd goals-tracker-front
    npm ci

- name: Run frontend linter
  run: |
    cd goals-tracker-front
    npm run lint

- name: Build frontend app
  run: |
    cd goals-tracker-front
    npm run build
```

#### Backend Tests

```yaml
- name: Run backend tests
  run: |
    cd goals-tracker-back
    ./mvnw -B test
```

The `-B` flag runs Maven in batch mode (non-interactive).

### 3. Build and Push Job

Builds Docker images and pushes to Docker Hub (main branch only).

#### Conditional Execution

```yaml
if: github.ref == 'refs/heads/main'
needs: test
```

Only runs:
- On the `main` branch
- After `test` job succeeds

#### Matrix Strategy

Build both services in parallel:

```yaml
strategy:
  matrix:
    service: [back, front]
    include:
      - service: back
        build_path: goals-tracker-back
        image_name: goals-tracker-back
      - service: front
        build_path: goals-tracker-front
        image_name: goals-tracker-front
```

#### Docker Operations

**Login to Docker Hub:**
```yaml
- name: Log in to Docker Hub
  uses: docker/login-action@v3
  with:
    username: ${{ secrets.USERNAME }}
    password: ${{ secrets.PASSWORD }}
```

**Build Image with Tags:**
```yaml
- name: Build and tag Docker image
  run: |
    cd ${{ matrix.build_path }}
    docker build -f ${{ matrix.dockerfile }} \
      -t ${{ secrets.USERNAME }}/${{ matrix.image_name }}:latest \
      -t ${{ secrets.USERNAME }}/${{ matrix.image_name }}:${{ steps.vars.outputs.sha_short }} .
```

Creates two tags:
- `latest` - Always points to most recent build
- `{commit-sha}` - Specific version for rollbacks

**Push Images:**
```yaml
- name: Push Docker images
  run: |
    docker push ${{ secrets.USERNAME }}/${{ matrix.image_name }}:latest
    docker push ${{ secrets.USERNAME }}/${{ matrix.image_name }}:${{ steps.vars.outputs.sha_short }}
```

### 4. Deployment

Triggers deployment on Render platform:

```yaml
- name: Trigger Render deploy
  env:
    RENDER_SERVICE_ID_BACKEND: ${{ secrets.RENDER_SERVICE_ID_BACKEND }}
    RENDER_API_TOKEN: ${{ secrets.RENDER_API_TOKEN }}
  run: |
    curl -X POST "https://api.render.com/v1/services/${RENDER_SERVICE_ID_BACKEND}/deploys" \
      -H "Authorization: Bearer ${RENDER_API_TOKEN}" \
      -H "Accept: application/json"
```

## GitHub Secrets

Required secrets in repository settings:

| Secret | Description | Example |
|--------|-------------|---------|
| `USERNAME` | Docker Hub username | `myusername` |
| `PASSWORD` | Docker Hub access token | `dckr_pat_...` |
| `RENDER_API_TOKEN` | Render API token | `rnd_...` |
| `RENDER_SERVICE_ID_BACKEND` | Render service ID | `srv-xxx...` |

### Setting Up Secrets

1. Go to repository **Settings**
2. Navigate to **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add each secret

## Workflow Status

### View Workflow Runs

GitHub → Actions tab shows:
- **All workflow runs**
- **Status** (success/failure/in progress)
- **Duration**
- **Triggered by** (user/event)

### Status Badge

Add to README.md:

```markdown
![CI/CD](https://github.com/username/goals-tracker/actions/workflows/ci.yml/badge.svg)
```

Result: ![Build Status](https://img.shields.io/badge/build-passing-brightgreen)

## Workflow Optimization

### Caching

**Maven Cache:**
```yaml
- uses: actions/setup-java@v4
  with:
    cache: maven
```

**NPM Cache:**
```yaml
- uses: actions/setup-node@v4
  with:
    cache: npm
    cache-dependency-path: goals-tracker-front/package-lock.json
```

Benefits:
- Faster builds (2-3x speedup)
- Reduced network usage
- Lower costs for private repos

### Parallel Execution

**Matrix builds** run in parallel:
```yaml
strategy:
  matrix:
    service: [back, front]
```

Both Docker images build simultaneously.

### Concurrency Control

Prevent multiple deployments:

```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
```

## Testing Locally

### Act - Run GitHub Actions Locally

Install Act:
```bash
# macOS
brew install act

# Linux
curl https://raw.githubusercontent.com/nektos/act/master/install.sh | sudo bash
```

Run workflow:
```bash
# List available actions
act -l

# Run the workflow
act -j test

# Run with secrets
act -j test --secret-file .secrets
```

### Manual Testing

Test individual steps:

**Backend tests:**
```bash
cd goals-tracker-back
./mvnw test
```

**Frontend linting:**
```bash
cd goals-tracker-front
npm run lint
```

**Docker build:**
```bash
cd goals-tracker-back
docker build -t test-backend .

cd ../goals-tracker-front
docker build -t test-frontend .
```

## Troubleshooting

### Build Failures

**Check logs:**
- Click on failed workflow
- Review each step's output
- Look for error messages

**Common issues:**

1. **Test failures**: Fix failing tests locally first
2. **Linting errors**: Run `npm run lint` locally
3. **Docker build fails**: Test Dockerfile locally
4. **Push rejected**: Check Docker Hub credentials

### Deployment Failures

**Check Render logs:**
- Visit Render dashboard
- Check deployment logs
- Verify environment variables

**Rollback:**
```bash
# Deploy previous version
docker push username/goals-tracker-back:previous-commit-sha
```

### Workflow Not Triggering

**Verify triggers:**
- Check branch name matches workflow
- Ensure workflow file is in `.github/workflows/`
- Check workflow syntax with `yamllint`

**Re-run workflow:**
- GitHub → Actions → Select workflow → Re-run jobs

## Advanced Features

### Environment Protection

```yaml
environment:
  name: production
  url: https://goals-tracker.onrender.com
```

Requires manual approval before deployment.

### Notifications

**Slack notification:**
```yaml
- name: Notify Slack
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
  if: always()
```

**Email notification:**
Configure in GitHub repository settings.

### Scheduled Workflows

Run tests nightly:

```yaml
on:
  schedule:
    - cron: '0 2 * * *'  # 2 AM daily
```

## Best Practices

1. **Keep workflows fast** - Use caching, parallel jobs
2. **Fail fast** - Run tests before expensive builds
3. **Use matrix builds** - Build multiple configurations in parallel
4. **Version everything** - Tag Docker images with commit SHA
5. **Secure secrets** - Never commit secrets, use GitHub Secrets
6. **Monitor workflows** - Set up notifications for failures
7. **Test locally** - Use Act to test workflows before pushing

## Next Steps

- Explore [Deployment Guide](deployment.md)
- Learn about [Docker Setup](../development/docker.md)
- Review [Backend Development](../development/backend.md)
