# API Contract: Task Management Endpoints

## Overview
This document defines the API contracts for the task management endpoints in the Todo Web App backend.

## Base URL
`http://localhost:8000/api` (or configured base URL)

## Authentication
All endpoints (except authentication endpoints) require a valid JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

## Common Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "details": { ... } // Optional details
}
```

## Endpoints

### 1. List Tasks
- **Endpoint**: `GET /{user_id}/tasks`
- **Description**: Retrieve all tasks for a specific user with optional filtering and sorting
- **Path Parameters**:
  - `user_id` (string): The ID of the user whose tasks to retrieve
- **Query Parameters**:
  - `status` (optional): Filter by status - "all", "pending", "completed" (default: "all")
  - `sort` (optional): Sort by field - "created", "title", "due_date" (default: "created")
  - `limit` (optional): Number of tasks to return (default: 50, max: 100)
  - `offset` (optional): Number of tasks to skip for pagination (default: 0)
- **Headers**:
  - `Authorization: Bearer <jwt_token>`
- **Success Response**:
  - Status: `200 OK`
  - Body:
    ```json
    {
      "success": true,
      "data": {
        "tasks": [
          {
            "id": 1,
            "user_id": "user123",
            "title": "Task title",
            "description": "Task description",
            "completed": false,
            "created_at": "2023-01-01T10:00:00Z",
            "updated_at": "2023-01-01T10:00:00Z"
          }
        ],
        "total": 1,
        "limit": 50,
        "offset": 0
      }
    }
    ```
- **Error Responses**:
  - `401 Unauthorized`: Invalid or missing JWT token
  - `400 Bad Request`: Invalid query parameters

### 2. Create Task
- **Endpoint**: `POST /{user_id}/tasks`
- **Description**: Create a new task for the specified user
- **Path Parameters**:
  - `user_id` (string): The ID of the user creating the task
- **Headers**:
  - `Authorization: Bearer <jwt_token>`
  - `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "title": "Task title",
    "description": "Optional task description"
  }
  ```
- **Success Response**:
  - Status: `201 Created`
  - Body:
    ```json
    {
      "success": true,
      "data": {
        "id": 1,
        "user_id": "user123",
        "title": "Task title",
        "description": "Optional task description",
        "completed": false,
        "created_at": "2023-01-01T10:00:00Z",
        "updated_at": "2023-01-01T10:00:00Z"
      }
    }
    ```
- **Error Responses**:
  - `401 Unauthorized`: Invalid or missing JWT token
  - `400 Bad Request`: Missing required fields or invalid data

### 3. Get Task
- **Endpoint**: `GET /{user_id}/tasks/{id}`
- **Description**: Retrieve a specific task by ID
- **Path Parameters**:
  - `user_id` (string): The ID of the user
  - `id` (integer): The ID of the task
- **Headers**:
  - `Authorization: Bearer <jwt_token>`
- **Success Response**:
  - Status: `200 OK`
  - Body:
    ```json
    {
      "success": true,
      "data": {
        "id": 1,
        "user_id": "user123",
        "title": "Task title",
        "description": "Task description",
        "completed": false,
        "created_at": "2023-01-01T10:00:00Z",
        "updated_at": "2023-01-01T10:00:00Z"
      }
    }
    ```
- **Error Responses**:
  - `401 Unauthorized`: Invalid or missing JWT token
  - `404 Not Found`: Task not found

### 4. Update Task
- **Endpoint**: `PUT /{user_id}/tasks/{id}`
- **Description**: Update an existing task
- **Path Parameters**:
  - `user_id` (string): The ID of the user
  - `id` (integer): The ID of the task
- **Headers**:
  - `Authorization: Bearer <jwt_token>`
  - `Content-Type: application/json`
- **Request Body** (all fields optional):
  ```json
  {
    "title": "Updated task title",
    "description": "Updated task description",
    "completed": true
  }
  ```
- **Success Response**:
  - Status: `200 OK`
  - Body:
    ```json
    {
      "success": true,
      "data": {
        "id": 1,
        "user_id": "user123",
        "title": "Updated task title",
        "description": "Updated task description",
        "completed": true,
        "created_at": "2023-01-01T10:00:00Z",
        "updated_at": "2023-01-02T15:30:00Z"
      }
    }
    ```
- **Error Responses**:
  - `401 Unauthorized`: Invalid or missing JWT token
  - `400 Bad Request`: Invalid data provided
  - `404 Not Found`: Task not found

### 5. Delete Task
- **Endpoint**: `DELETE /{user_id}/tasks/{id}`
- **Description**: Delete a specific task
- **Path Parameters**:
  - `user_id` (string): The ID of the user
  - `id` (integer): The ID of the task
- **Headers**:
  - `Authorization: Bearer <jwt_token>`
- **Success Response**:
  - Status: `200 OK`
  - Body:
    ```json
    {
      "success": true,
      "message": "Task deleted successfully"
    }
    ```
- **Error Responses**:
  - `401 Unauthorized`: Invalid or missing JWT token
  - `404 Not Found`: Task not found

### 6. Toggle Task Completion
- **Endpoint**: `PATCH /{user_id}/tasks/{id}/complete`
- **Description**: Toggle the completion status of a task
- **Path Parameters**:
  - `user_id` (string): The ID of the user
  - `id` (integer): The ID of the task
- **Headers**:
  - `Authorization: Bearer <jwt_token>`
- **Request Body** (optional):
  ```json
  {
    "completed": true // If provided, sets the status to this value; otherwise toggles
  }
  ```
- **Success Response**:
  - Status: `200 OK`
  - Body:
    ```json
    {
      "success": true,
      "data": {
        "id": 1,
        "user_id": "user123",
        "title": "Task title",
        "description": "Task description",
        "completed": true,
        "created_at": "2023-01-01T10:00:00Z",
        "updated_at": "2023-01-02T15:30:00Z"
      }
    }
    ```
- **Error Responses**:
  - `401 Unauthorized`: Invalid or missing JWT token
  - `404 Not Found`: Task not found

## HTTP Status Codes
- `200 OK`: Request successful
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request parameters or body
- `401 Unauthorized`: Missing or invalid authentication token
- `404 Not Found`: Requested resource not found
- `500 Internal Server Error`: Server error occurred