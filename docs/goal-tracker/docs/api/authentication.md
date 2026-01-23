# Authentication API

JWT-based authentication endpoints.

## Register

**POST** `/api/auth/register`

Register a new user account.

### Request Body

```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

### Response (201 Created)

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

## Login

**POST** `/api/auth/login`

Authenticate and receive JWT token.

### Request Body

```json
{
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

### Response (200 OK)

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

## Using the Token

Include JWT token in Authorization header for authenticated requests:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Next Steps

- Review [Goals API](goals.md)
- Explore [Habits API](habits.md)
