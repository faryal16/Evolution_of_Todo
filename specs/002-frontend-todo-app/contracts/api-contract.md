# API Contract: Frontend - Phase II Todo Web App

## Authentication Endpoints

### POST /api/auth/signup
**Description**: Create a new user account

**Request**:
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "username": "optional_username"
}
```

**Response (201 Created)**:
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "username": "optional_username"
  },
  "expiresAt": "2026-01-05T10:00:00Z"
}
```

**Response (400 Bad Request)**:
```json
{
  "error": "Validation error message",
  "details": ["email required", "password must be at least 8 characters"]
}
```

**Response (409 Conflict)**:
```json
{
  "error": "User already exists"
}
```

### POST /api/auth/login
**Description**: Authenticate user and return token

**Request**:
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (200 OK)**:
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "username": "optional_username"
  },
  "expiresAt": "2026-01-05T10:00:00Z"
}
```

**Response (401 Unauthorized)**:
```json
{
  "error": "Invalid credentials"
}
```

### POST /api/auth/logout
**Description**: Logout user and invalidate token

**Headers**:
```
Authorization: Bearer {token}
```

**Response (200 OK)**:
```json
{
  "message": "Successfully logged out"
}
```

## Task Management Endpoints

### GET /api/tasks
**Description**: Get all tasks for the authenticated user

**Headers**:
```
Authorization: Bearer {token}
```

**Query Parameters**:
- `status` (optional): "all", "pending", "completed" (default: "all")
- `sort` (optional): "created", "updated", "title" (default: "created")

**Response (200 OK)**:
```json
{
  "tasks": [
    {
      "id": "task_id",
      "title": "Task title",
      "description": "Task description",
      "completed": false,
      "createdAt": "2026-01-04T10:00:00Z",
      "updatedAt": "2026-01-04T10:00:00Z",
      "userId": "user_id"
    }
  ]
}
```

**Response (401 Unauthorized)**:
```json
{
  "error": "Authentication required"
}
```

### POST /api/tasks
**Description**: Create a new task

**Headers**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request**:
```json
{
  "title": "New task title",
  "description": "Optional task description"
}
```

**Response (201 Created)**:
```json
{
  "id": "new_task_id",
  "title": "New task title",
  "description": "Optional task description",
  "completed": false,
  "createdAt": "2026-01-04T10:00:00Z",
  "updatedAt": "2026-01-04T10:00:00Z",
  "userId": "user_id"
}
```

**Response (400 Bad Request)**:
```json
{
  "error": "Validation error",
  "details": ["title is required", "title must be between 1 and 200 characters"]
}
```

### PUT /api/tasks/{id}
**Description**: Update an existing task

**Headers**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request**:
```json
{
  "title": "Updated task title",
  "description": "Updated task description",
  "completed": true
}
```

**Response (200 OK)**:
```json
{
  "id": "task_id",
  "title": "Updated task title",
  "description": "Updated task description",
  "completed": true,
  "createdAt": "2026-01-04T10:00:00Z",
  "updatedAt": "2026-01-04T11:00:00Z",
  "userId": "user_id"
}
```

### PATCH /api/tasks/{id}
**Description**: Partially update a task (for toggling completion status)

**Headers**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request**:
```json
{
  "completed": true
}
```

**Response (200 OK)**:
```json
{
  "id": "task_id",
  "title": "Task title",
  "description": "Task description",
  "completed": true,
  "createdAt": "2026-01-04T10:00:00Z",
  "updatedAt": "2026-01-04T11:00:00Z",
  "userId": "user_id"
}
```

### DELETE /api/tasks/{id}
**Description**: Delete a task

**Headers**:
```
Authorization: Bearer {token}
```

**Response (200 OK)**:
```json
{
  "message": "Task deleted successfully"
}
```

**Response (404 Not Found)**:
```json
{
  "error": "Task not found"
}
```

## Error Response Format

All error responses follow this format:

```json
{
  "error": "Human-readable error message",
  "code": "ERROR_CODE",
  "timestamp": "2026-01-04T10:00:00Z",
  "path": "/api/endpoint/path"
}
```

## Authentication Requirements

- All task-related endpoints require authentication via Bearer token
- Authentication tokens should be included in the Authorization header
- If a token is expired or invalid, the API will return 401 Unauthorized
- When receiving 401, the frontend should redirect to the login page

## Rate Limiting

- API endpoints are subject to rate limiting (e.g., 100 requests per minute per user)
- When rate limit is exceeded, API returns 429 Too Many Requests
- Frontend should implement appropriate retry logic with exponential backoff