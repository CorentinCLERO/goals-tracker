# Goals API

CRUD operations for goals management.

## List Goals

**GET** `/api/goals`

Get all goals for authenticated user.

### Response (200 OK)

```json
[
  {
    "id": 1,
    "title": "Learn Spanish",
    "description": "Become fluent in Spanish",
    "priority": "HIGH",
    "status": "IN_PROGRESS",
    "category": "Personal",
    "dueDate": "2026-12-31",
    "progress": 45,
    "createdAt": "2026-01-01T10:00:00",
    "updatedAt": "2026-01-23T08:00:00"
  }
]
```

## Create Goal

**POST** `/api/goals`

Create a new goal.

### Request Body

```json
{
  "title": "Learn Spanish",
  "description": "Become fluent in Spanish",
  "priority": "HIGH",
  "category": "Personal",
  "dueDate": "2026-12-31"
}
```

### Response (201 Created)

```json
{
  "id": 1,
  "title": "Learn Spanish",
  "description": "Become fluent in Spanish",
  "priority": "HIGH",
  "status": "IN_PROGRESS",
  "category": "Personal",
  "dueDate": "2026-12-31",
  "progress": 0
}
```

## Get Goal

**GET** `/api/goals/{id}`

Get a specific goal by ID.

## Update Goal

**PUT** `/api/goals/{id}`

Update an existing goal.

## Delete Goal

**DELETE** `/api/goals/{id}`

Delete a goal.

### Response (204 No Content)

## Next Steps

- Review [Habits API](habits.md)
- Check [Authentication API](authentication.md)
