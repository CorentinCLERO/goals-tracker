# Backend Development

Guide for backend development with Spring Boot.

## Development Setup

### Prerequisites
- Java 17
- Maven
- Docker (for database)

### Running Locally

```bash
cd goals-tracker-back
export $(cat .env | grep -v "#" | xargs)
./mvnw spring-boot:run
```

## Testing

```bash
./mvnw test
```

## API Documentation

Swagger UI available at: http://localhost:8080/swagger-ui.html

## Next Steps

- Review [Backend Architecture](../architecture/backend.md)
- Explore [API Reference](../api/authentication.md)
