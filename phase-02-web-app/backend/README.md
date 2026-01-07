# Todo API Backend

A secure, scalable RESTful API for managing todo tasks built with FastAPI and SQLModel.

## Features

- **JWT Authentication**: Secure user authentication with JWT tokens
- **Task Management**: Full CRUD operations for tasks
- **User Isolation**: Users can only access their own tasks
- **Filtering & Sorting**: Filter tasks by status and sort by various criteria
- **Rate Limiting**: Protection against API abuse
- **Comprehensive Validation**: Input validation and error handling

## API Endpoints

### Authentication

- `GET /auth/verify` - Verify JWT token validity

### Task Management

All task endpoints are under `/api/{user_id}/` and require authentication.

- `GET /tasks` - Get all tasks for a user with optional filtering and sorting
  - Query parameters: `status` (all|pending|completed), `sort` (created|title), `limit`, `offset`
- `POST /tasks` - Create a new task
- `GET /tasks/{id}` - Get a specific task
- `PUT /tasks/{id}` - Update a specific task
- `DELETE /tasks/{id}` - Delete a specific task
- `PATCH /tasks/{id}/complete` - Toggle task completion status

### Health Check

- `GET /health` - Health check endpoint

## Configuration

The application uses environment variables for configuration:

```bash
# Database
DATABASE_URL=sqlite:///./todo_app.db  # or your PostgreSQL URL
NEON_DATABASE_URL=your_neon_db_url    # if using Neon Serverless

# JWT
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
ACCESS_TOKEN_EXPIRE_MINUTES=15

# Rate Limiting
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW=60

# CORS
ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com  # comma-separated
```

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Set up environment variables in `.env`
4. Run the application:
   ```bash
   uvicorn src.main:app --reload
   ```

## Development

To run tests:
```bash
pytest tests/
```

## Security Features

- JWT-based authentication and authorization
- User-specific data access control
- Rate limiting to prevent abuse
- Input validation and sanitization
- Proper error handling without information leakage

## Architecture

- **Models**: SQLModel-based data models in `src/models/`
- **Services**: Business logic in `src/services/`
- **API**: FastAPI routers in `src/api/`
- **Database**: SQLModel with PostgreSQL (or SQLite for development)
- **Authentication**: JWT-based using python-jose
