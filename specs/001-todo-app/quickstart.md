# Quickstart Guide: Todo In-Memory Python Console App

## Overview
This guide provides quick instructions for setting up and using the Todo In-Memory Python Console App.

## Prerequisites
- Python 3.13+ installed
- UV package manager (for dependency management)
- Windows users: WSL 2 (as per project constitution)

## Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd <repository-name>
```

### 2. Install Dependencies
```bash
uv sync
```

### 3. Run the Application
```bash
python -m src.cli.todo_app
```

## Basic Usage

### Adding a Task
```bash
# Run the application and select option 1, or use:
python -c "from src.cli.todo_app import main; main()" # Then follow prompts
```

### Viewing All Tasks
- Run the application and select option 2 to see all tasks with their ID, title, description, and status.

### Updating a Task
- Run the application and select option 3, then provide the task ID and new details.

### Deleting a Task
- Run the application and select option 4, then provide the task ID to delete.

### Marking Complete/Incomplete
- Run the application and select option 5, then provide the task ID and desired status.

## Example Workflow
1. Start the application: `python -m src.cli.todo_app`
2. Add a task: Select option 1, enter title and description
3. View tasks: Select option 2 to see your tasks
4. Mark a task complete: Select option 5, enter task ID
5. Exit: Select option 6 to quit the application

## Development
To run tests:
```bash
pytest
```

To run tests with coverage:
```bash
pytest --cov=src
```

## Troubleshooting
- If you get a Python version error, ensure you're using Python 3.13+
- If dependencies are missing, run `uv sync` again
- For Windows users experiencing issues, ensure you're running in WSL 2