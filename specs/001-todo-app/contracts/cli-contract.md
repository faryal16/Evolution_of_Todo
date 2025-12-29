# CLI Contract: Todo In-Memory Python Console App

## Overview
This document defines the command-line interface contract for the Todo In-Memory Python Console App.

## CLI Interface Definition

### Main Application Entry Point
```
python -m src.cli.todo_app
```

### Available Commands (Interactive Menu)
1. **Add Task**
   - Command: Option 1 from main menu
   - Input: Title (required), Description (optional)
   - Output: Success message with task ID or error message
   - Error cases: Empty title, system full (too many tasks)

2. **View Tasks**
   - Command: Option 2 from main menu
   - Input: None
   - Output: Formatted list of all tasks with ID, title, description, and status
   - Error cases: No tasks exist

3. **Update Task**
   - Command: Option 3 from main menu
   - Input: Task ID, new title (optional), new description (optional)
   - Output: Success message or error message
   - Error cases: Invalid task ID, task not found

4. **Delete Task**
   - Command: Option 4 from main menu
   - Input: Task ID
   - Output: Success confirmation or error message
   - Error cases: Invalid task ID, task not found

5. **Mark Complete/Incomplete**
   - Command: Option 5 from main menu
   - Input: Task ID, status (complete/incomplete)
   - Output: Success message or error message
   - Error cases: Invalid task ID, task not found

6. **Exit**
   - Command: Option 6 from main menu
   - Input: None
   - Output: Graceful application shutdown

### Expected Input Formats
- Task ID: Positive integer
- Title: String of 1-200 characters
- Description: String of 0-1000 characters

### Expected Output Format
- Success messages: "Task [ID] [action] successfully"
- Error messages: "Error: [description of issue]"
- Task list format:
  ```
  ID | Title | Description | Status
  ---|-------|-------------|--------
  1  | Task 1| Description | Pending/Complete
  ```

## Error Handling Contract
- Invalid inputs result in user-friendly error messages
- Non-existent task IDs return appropriate error messages
- System limits (max tasks) return clear error messages
- All errors allow user to continue using the application

## Validation Rules
- All inputs are validated before processing
- Task IDs are validated to exist before operations
- Title and description length constraints are enforced
- Empty titles are rejected

## State Management
- All tasks exist in memory only
- Application state is lost on exit
- No persistent storage operations are performed