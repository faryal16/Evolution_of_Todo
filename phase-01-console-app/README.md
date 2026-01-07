# Todo In-Memory Python Console App

A command-line todo application that stores tasks in memory only. The application provides 5 core features: Add Task, View Tasks, Update Task, Delete Task, and Mark Complete/Incomplete. Features rich color formatting and a user-friendly interface.

## Features

- **Add Task**: Add new tasks with title and description
- **View Tasks**: List all tasks with ID, title, description, and status
- **Update Task**: Modify title or description by task ID
- **Delete Task**: Remove tasks by ID
- **Mark Complete/Incomplete**: Toggle task completion status
- **Rich Formatting**: Colorful interface with tables and panels for better user experience

## Prerequisites

- Python 3.13+
- UV package manager (for dependency management)

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   uv sync
   ```

   Or if using pip:
   ```bash
   pip install -e .
   ```

## Usage

Run the application:

```bash
cd phase-01-console-app
```

```bash
python -m src.cli.todo_app
```

Or if installed as a package:

```bash
todo-app
```

### Menu Options

1. **Add Task**: Enter title and description to create a new task
2. **View Tasks**: Display all tasks with their details
3. **Update Task**: Modify existing task by ID
4. **Delete Task**: Remove task by ID
5. **Mark Complete/Incomplete**: Toggle completion status by ID
6. **Exit**: Quit the application

## Important Notes

- All data is stored in memory only and will be lost when the application exits
- Task IDs are automatically assigned and unique within a session
- Title must be 1-200 characters
- Description can be up to 1000 characters

## Development

To run tests:

```bash
pytest
```

To run tests with coverage:

```bash
pytest --cov=src
```

## Architecture

The application follows a clean architecture with separation of concerns:

- `src/models/task.py`: Task data model
- `src/services/todo_service.py`: Business logic for task operations
- `src/cli/todo_app.py`: Command-line interface
- `tests/`: Unit and integration tests

## Limitations

- Data is not persisted (in-memory only)
- Single-user application
- No synchronization across sessions