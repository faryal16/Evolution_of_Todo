# Feature Specification: Backend - Phase II Todo Web App

**Feature Branch**: `003-backend-api`
**Created**: 2026-01-04
**Status**: Draft
**Input**: User description: "# Feature Spec: Backend - Phase II Todo Web App

## Purpose
Implement a secure, scalable RESTful API using FastAPI and SQLModel for Phase II of the Todo app. Backend must integrate with Better Auth JWT authentication and Neon Serverless PostgreSQL database.

## User Stories
- As a backend, I can validate JWT tokens sent from frontend
- As a backend, I can perform CRUD operations on tasks associated only with the authenticated user
- As a backend, I can filter and sort tasks
- As a backend, I enforce task ownership for all operations
- As a backend, I return appropriate HTTP status codes (200, 201, 401, 404, 400)

## Acceptance Criteria

### Authentication
- Verify JWT token from Authorization header
- Extract user ID from token
- Reject requests with missing/invalid/expired tokens (401 Unauthorized)
- Ensure each endpoint only returns/updates/deletes tasks for the authenticated user

### Task CRUD Endpoints
- `GET /api/{user_id}/tasks` → List all tasks for user
  - Optional query: status=all|pending|completed
  - Optional sort: created|title|due_date
- `POST /api/{user_id}/tasks` → Create task
  - Title required, description optional
- `GET /api/{user_id}/tasks/{id}` → Get task details
- `PUT /api/{user_id}/tasks/{id}` → Update task
- `DELETE /api/{user_id}/tasks/{id}` → Delete task
- `PATCH /api/{user_id}/tasks/{id}/complete` → Toggle completion

### Database
- `tasks` table:
  - `id: integer PK`
  - `user_id: string FK -> users.id`
  - `title: string not null`
  - `description: text nullable`
  - `completed: boolean default fals"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Secure Task Management (Priority: P1)

As a user, I want to securely manage my tasks through the backend API so that I can create, read, update, and delete my tasks while ensuring that I can only access my own tasks.

**Why this priority**: This is the core functionality of the todo app - users need to be able to manage their tasks securely with proper authentication and authorization.

**Independent Test**: Can be fully tested by creating a task with authentication, retrieving it, updating it, and deleting it, while ensuring that another user cannot access this task.

**Acceptance Scenarios**:

1. **Given** a user is authenticated with a valid JWT token, **When** they create a task, **Then** the task is saved to the database with their user ID and they receive a 201 Created response
2. **Given** a user is authenticated with a valid JWT token, **When** they request their tasks, **Then** they only receive tasks associated with their user ID

---

### User Story 2 - JWT Token Validation (Priority: P2)

As a system administrator, I want the backend to validate JWT tokens so that unauthorized users cannot access the API endpoints.

**Why this priority**: Security is paramount - we must ensure that only authenticated users with valid tokens can access the API.

**Independent Test**: Can be tested by making requests with valid tokens, invalid tokens, expired tokens, and no tokens to ensure proper validation and appropriate HTTP status codes are returned.

**Acceptance Scenarios**:

1. **Given** a request with a valid JWT token in the Authorization header, **When** the request is made to any protected endpoint, **Then** the request is processed and returns 200 OK
2. **Given** a request with an invalid or expired JWT token, **When** the request is made to any protected endpoint, **Then** the request is rejected with a 401 Unauthorized response

---

### User Story 3 - Task Filtering and Sorting (Priority: P3)

As a user, I want to filter and sort my tasks so that I can better organize and find specific tasks.

**Why this priority**: This enhances the user experience by providing better organization capabilities for managing multiple tasks.

**Independent Test**: Can be tested by creating multiple tasks with different statuses and dates, then filtering and sorting them using query parameters.

**Acceptance Scenarios**:

1. **Given** a user has multiple tasks with different statuses, **When** they request tasks with status filter, **Then** only tasks matching the specified status (all|pending|completed) are returned
2. **Given** a user has multiple tasks, **When** they request tasks with sort parameter, **Then** tasks are returned sorted by the specified field (created|title|due_date)

---

### Edge Cases

- What happens when a user tries to access another user's task?
- How does the system handle requests with malformed JWT tokens?
- What happens when the database is temporarily unavailable?
- How does the system handle requests with missing required fields?
- What happens when a user tries to update a task that doesn't exist?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST validate JWT tokens from the Authorization header before processing any request
- **FR-002**: System MUST extract user ID from the validated JWT token for authorization purposes
- **FR-003**: System MUST only allow users to access tasks associated with their own user ID
- **FR-004**: System MUST return appropriate HTTP status codes (200, 201, 401, 404, 400) based on request outcomes
- **FR-005**: System MUST support CRUD operations on tasks through RESTful endpoints
- **FR-006**: System MUST support filtering tasks by status (all|pending|completed) as a query parameter
- **FR-007**: System MUST support sorting tasks by created date, title, or due_date as a query parameter
- **FR-008**: System MUST store task data in a PostgreSQL database with proper relationships
- **FR-009**: System MUST require title for task creation but description should be optional
- **FR-010**: System MUST support toggling task completion status through a dedicated endpoint

### Key Entities *(include if feature involves data)*

- **Task**: Represents a user's task with attributes: id (unique identifier), user_id (foreign key to user), title (required string), description (optional text), completed (boolean with default false), created (timestamp)
- **User**: Represents an authenticated user with attributes: id (unique identifier), authentication data handled by Better Auth system

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can successfully create, read, update, and delete their tasks with 99% success rate
- **SC-002**: System rejects unauthorized requests with appropriate 401 status codes 100% of the time
- **SC-003**: Task filtering and sorting operations return results within 2 seconds for up to 1000 tasks per user
- **SC-004**: System maintains 99.9% uptime under normal load conditions