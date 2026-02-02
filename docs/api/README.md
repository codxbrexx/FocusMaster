# API Reference

Complete API documentation for FocusMaster backend endpoints.

**Base URL:** `http://localhost:5000/api` (development)  
**Production URL:** `https://your-production-url.vercel.app/api`

##  Table of Contents

- [Authentication](#authentication)
- [Users](#users)
- [Sessions](#sessions)
- [Tasks](#tasks)
- [Work Logs](#work-logs)
- [Analytics](#analytics)
- [Spotify](#spotify)
- [Admin](#admin)
- [Feedback](#feedback)

---

## Authentication

All protected endpoints require a JWT token in cookies or Authorization header.

### Register User
```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:** `201 Created`
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Login
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:** `200 OK`

### Google OAuth Login
```http
POST /api/auth/google
```

**Request Body:**
```json
{
  "credential": "google_id_token_here"
}
```

### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "picture": "https://example.com/avatar.jpg",
  "points": 150,
  "settings": {
    "theme": "dark",
    "focusDuration": 25,
    "shortBreakDuration": 5
  }
}
```

---

## Sessions

Manage Pomodoro sessions for tracking work and breaks.

### Create Session
```http
POST /api/sessions
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "type": "focus",
  "startTime": "2026-02-02T10:00:00Z",
  "endTime": "2026-02-02T10:25:00Z",
  "duration": 1500,
  "task": "507f1f77bcf86cd799439011",
  "mood": "focused"
}
```

**Response:** `201 Created`

### Get All Sessions
```http
GET /api/sessions?range=week
Authorization: Bearer <token>
```

**Query Parameters:**
- `range` (optional): `today` | `week` | `month`

**Response:** `200 OK`
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "type": "focus",
    "startTime": "2026-02-02T10:00:00Z",
    "endTime": "2026-02-02T10:25:00Z",
    "duration": 1500,
    "task": {
      "_id": "507f1f77bcf86cd799439012",
      "title": "Write documentation"
    },
    "mood": "focused",
    "completed": true
  }
]
```

### Get Single Session
```http
GET /api/sessions/:id
Authorization: Bearer <token>
```

**Response:** `200 OK`

### Update Session
```http
PATCH /api/sessions/:id
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "mood": "happy",
  "duration": 1800
}
```

**Response:** `200 OK`

### Delete Session
```http
DELETE /api/sessions/:id
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "message": "Session deleted successfully"
}
```

### Get Session Stats
```http
GET /api/sessions/stats
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "totalFocusTime": 18000,
  "totalSessions": 12
}
```

---

## Tasks

Manage tasks in the Kanban board.

### Create Task
```http
POST /api/tasks
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Implement feature X",
  "description": "Add new authentication flow",
  "status": "todo",
  "priority": "high",
  "tags": ["backend", "auth"],
  "estimatedPomodoros": 4
}
```

### Get All Tasks
```http
GET /api/tasks
Authorization: Bearer <token>
```

**Response:** `200 OK`

### Update Task
```http
PUT /api/tasks/:id
Authorization: Bearer <token>
```

### Delete Task
```http
DELETE /api/tasks/:id
Authorization: Bearer <token>
```

---

## Work Logs

Clock in/out for time tracking.

### Clock In
```http
POST /api/clock/start
Authorization: Bearer <token>
```

**Response:** `201 Created`
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "startTime": "2026-02-02T09:00:00Z",
  "user": "507f1f77bcf86cd799439010"
}
```

### Clock Out
```http
POST /api/clock/stop
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "breakTime": 300,
  "notes": "Productive day"
}
```

### Get Work Logs
```http
GET /api/clock/logs
Authorization: Bearer <token>
```

---

## Analytics

Get productivity analytics and statistics.

### Get Productivity Data
```http
GET /api/analytics/productivity?range=week
Authorization: Bearer <token>
```

**Query Parameters:**
- `range`: `today` | `week` | `month`

**Response:** `200 OK`
```json
{
  "totalFocusTime": 18000,
  "totalSessions": 12,
  "averageSessionDuration": 1500,
  "dailyBreakdown": [
    {
      "date": "2026-02-02",
      "focusTime": 3600,
      "sessions": 3
    }
  ]
}
```

---

## Spotify

Spotify integration for music control.

### Get Auth URL
```http
GET /api/spotify/auth-url
Authorization: Bearer <token>
```

### Callback
```http
GET /api/spotify/callback?code=<code>
```

### Get Now Playing
```http
GET /api/spotify/now-playing
Authorization: Bearer <token>
```

### Control Playback
```http
POST /api/spotify/play
POST /api/spotify/pause
POST /api/spotify/next
POST /api/spotify/previous
Authorization: Bearer <token>
```

---

## Admin

Admin panel endpoints (requires admin role).

### Get All Users
```http
GET /api/admin/users
Authorization: Bearer <admin_token>
```

### Update User Role
```http
PATCH /api/admin/users/:id/role
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "role": "admin"
}
```

### Ban User
```http
PATCH /api/admin/users/:id/ban
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "reason": "Violation of terms"
}
```

### Get Audit Logs
```http
GET /api/admin/audit-logs
Authorization: Bearer <admin_token>
```

---

## Feedback

User feedback submission.

### Submit Feedback
```http
POST /api/feedback
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "type": "bug",
  "message": "Found an issue with the timer",
  "category": "timer"
}
```

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "message": "Invalid input data"
}
```

### 401 Unauthorized
```json
{
  "message": "Not authorized, token failed"
}
```

### 403 Forbidden
```json
{
  "message": "Access denied"
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Server error"
}
```

---

## Rate Limiting

API endpoints are rate-limited to prevent abuse:
- **Guest users:** 100 requests/hour
- **Authenticated users:** 1000 requests/hour
- **Admin users:** 5000 requests/hour
