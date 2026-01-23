# Habits API

CRUD operations and tracking for habits.

## List Habits

**GET** `/api/habits`

Get all habits for authenticated user.

### Response (200 OK)

```json
[
  {
    "id": 1,
    "name": "Morning Meditation",
    "description": "Meditate for 10 minutes",
    "frequency": "DAILY",
    "category": "Health",
    "startDate": "2026-01-01",
    "active": true,
    "currentStreak": 7,
    "bestStreak": 15
  }
]
```

## Create Habit

**POST** `/api/habits`

Create a new habit.

### Request Body

```json
{
  "name": "Morning Meditation",
  "description": "Meditate for 10 minutes",
  "frequency": "DAILY",
  "category": "Health",
  "startDate": "2026-01-01"
}
```

### Response (201 Created)

```json
{
  "id": 1,
  "name": "Morning Meditation",
  "description": "Meditate for 10 minutes",
  "frequency": "DAILY",
  "category": "Health",
  "startDate": "2026-01-01",
  "active": true,
  "currentStreak": 0,
  "bestStreak": 0
}
```

## Log Habit Completion

**POST** `/api/habits/{id}/log`

Mark habit as completed for a specific date.

### Request Body

```json
{
  "date": "2026-01-23",
  "completed": true
}
```

### Response (200 OK)

```json
{
  "id": 1,
  "habitId": 1,
  "date": "2026-01-23",
  "completed": true,
  "completedAt": "2026-01-23T08:30:00"
}
```

## Get Habit Statistics

**GET** `/api/habits/{id}/stats`

Get statistics for a habit.

### Response (200 OK)

```json
{
  "habitId": 1,
  "totalDays": 30,
  "completedDays": 25,
  "completionRate": 83.33,
  "currentStreak": 7,
  "bestStreak": 15
}
```

## Next Steps

- Review [Goals API](goals.md)
- Check [Authentication API](authentication.md)
