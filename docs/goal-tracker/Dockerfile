# Stage 1: Build the documentation
FROM python:3.11-slim AS builder

WORKDIR /docs

# Install MkDocs and Material theme
RUN pip install --no-cache-dir mkdocs mkdocs-material

# Copy documentation files
COPY mkdocs.yml .
COPY docs ./docs

# Build static site
RUN mkdocs build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy built documentation from builder
COPY --from=builder /docs/site /usr/share/nginx/html

# Copy custom nginx config (optional)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
