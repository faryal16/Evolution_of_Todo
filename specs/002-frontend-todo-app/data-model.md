# Data Model: Frontend - Phase II Todo Web App

## Entity: Task

**Description**: Represents a todo item with title, description, completion status, and creation date.

**Fields**:
- `id` (string/UUID): Unique identifier for the task
- `title` (string): Title of the task (required, 1-200 characters)
- `description` (string): Optional description of the task (max 1000 characters)
- `completed` (boolean): Completion status of the task (default: false)
- `createdAt` (date/time): Timestamp when the task was created
- `updatedAt` (date/time): Timestamp when the task was last updated
- `userId` (string/UUID): Reference to the user who owns this task

**Validation Rules**:
- Title must be between 1 and 200 characters
- Description must be no more than 1000 characters (optional field)
- Task must belong to an authenticated user
- Creation and update timestamps are automatically managed

**State Transitions**:
- `pending` → `completed`: When user marks task as complete
- `completed` → `pending`: When user marks task as incomplete

## Entity: User

**Description**: Represents an authenticated user of the application.

**Fields**:
- `id` (string/UUID): Unique identifier for the user
- `email` (string): User's email address (unique, required)
- `username` (string): User's display name (optional)
- `createdAt` (date/time): Timestamp when the user account was created
- `lastLoginAt` (date/time): Timestamp of last login (optional)

**Validation Rules**:
- Email must be unique and properly formatted
- Username (if provided) must be unique
- User must be authenticated to access tasks

## Entity: Authentication Session

**Description**: Represents the user's authenticated state in the application.

**Fields**:
- `token` (string): JWT or other authentication token
- `expiresAt` (date/time): Expiration time of the token
- `userId` (string/UUID): Reference to the authenticated user
- `refreshToken` (string): Token for refreshing the session (optional)

**Validation Rules**:
- Token must be valid and not expired
- Session must be associated with an existing user
- Refresh token (if used) must be properly secured

## Relationships

**User → Task (One-to-Many)**:
- One user can own many tasks
- Tasks are restricted to the authenticated user who created them
- When a user is deleted, their tasks should also be deleted

## API Data Transfer Objects (DTOs)

### TaskRequest DTO
- `title` (string): Required task title
- `description` (string): Optional task description

### TaskResponse DTO
- `id` (string): Task identifier
- `title` (string): Task title
- `description` (string): Task description
- `completed` (boolean): Completion status
- `createdAt` (string): ISO date string
- `updatedAt` (string): ISO date string
- `userId` (string): User identifier

### AuthenticationRequest DTO
- `email` (string): User's email
- `password` (string): User's password

### AuthenticationResponse DTO
- `token` (string): Authentication token
- `user` (object): User object with id and email
- `expiresAt` (string): Token expiration time

### UpdateTaskRequest DTO
- `title` (string): Updated task title (optional)
- `description` (string): Updated task description (optional)
- `completed` (boolean): Updated completion status (optional)