# Quickstart Guide: Backend - Phase II Todo Web App

## Prerequisites
- Python 3.11 or higher
- PostgreSQL database (Neon Serverless recommended)
- Better Auth account for JWT authentication
- pip package manager

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd <repository-name>
```

### 2. Create Virtual Environment
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Environment Configuration
Create a `.env` file based on the `.env.example`:
```bash
cp .env.example .env
```

Configure the following environment variables:
- `DATABASE_URL`: PostgreSQL connection string (e.g., `postgresql://user:password@host:port/dbname`)
- `JWT_SECRET`: Secret key for JWT token verification
- `BETTER_AUTH_SECRET`: Secret from Better Auth
- `NEON_DATABASE_URL`: If using Neon Serverless

### 5. Database Setup
Run database migrations:
```bash
alembic revision --autogenerate -m "Initial migration"
alembic upgrade head
```

## Running the Application

### Development
```bash
uvicorn src.main:app --reload --port 8000
```

### Production
```bash
gunicorn src.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

## API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/signup` - User registration

### Task Management
- `GET /api/{user_id}/tasks` - List tasks with optional query parameters:
  - `status`: all|pending|completed
  - `sort`: created|title|due_date
- `POST /api/{user_id}/tasks` - Create a new task (title required, description optional)
- `GET /api/{user_id}/tasks/{id}` - Get specific task details
- `PUT /api/{user_id}/tasks/{id}` - Update task details
- `DELETE /api/{user_id}/tasks/{id}` - Delete a task
- `PATCH /api/{user_id}/tasks/{id}/complete` - Toggle task completion status

## Authentication
All task endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

## Example Usage

### Create a Task
```bash
curl -X POST http://localhost:8000/api/user123/tasks \
  -H "Authorization: Bearer <jwt_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Sample Task",
    "description": "This is a sample task"
  }'
```

### Get All Tasks for User
```bash
curl -X GET "http://localhost:8000/api/user123/tasks?status=pending&sort=created" \
  -H "Authorization: Bearer <jwt_token>"
```

## Testing
Run unit tests:
```bash
pytest tests/unit/
```

Run integration tests:
```bash
pytest tests/integration/
```

Run all tests:
```bash
pytest
```

## Environment Variables
- `DATABASE_URL`: Database connection string
- `JWT_SECRET`: Secret for JWT token signing/verification
- `BETTER_AUTH_SECRET`: Better Auth secret
- `DEBUG`: Set to "True" for debug mode (default: False)
- `TESTING`: Set to "True" when running tests (default: False)