# Data Model: Todo In-Memory Python Console App

## Overview
This document defines the data models for the Todo In-Memory Python Console App based on the feature specification.

## Entities

### Task
**Description**: Represents a todo item with unique ID, title, description, and completion status

**Fields**:
- `id` (int): Unique identifier for the task, assigned automatically when created
- `title` (str): Title of the task, required field with minimum length validation
- `description` (str): Optional description of the task, can be empty
- `completed` (bool): Status indicating whether the task is completed (default: False)
- `created_at` (datetime): Timestamp when the task was created (for potential future use)

**Validation Rules**:
- Title must not be empty or None
- Title must be between 1-200 characters
- Description can be empty but limited to 1000 characters if provided
- ID must be unique within the application session
- ID is auto-generated as sequential integer starting from 1

**State Transitions**:
- `pending` → `completed`: When user marks task as complete
- `completed` → `pending`: When user marks task as incomplete

### Task List
**Description**: Collection of tasks stored in memory during application runtime

**Operations**:
- Add task: Creates new task with unique ID
- Get all tasks: Returns list of all tasks
- Get task by ID: Returns specific task or None if not found
- Update task: Modifies title or description of existing task
- Mark complete: Sets completion status to True
- Mark incomplete: Sets completion status to False
- Delete task: Removes task from the collection

**Constraints**:
- All tasks exist only in memory
- Task collection is lost when application terminates
- Maximum recommended size: 1000 tasks (for performance)

## Relationships
- Task List contains multiple Task entities
- Each Task has a unique ID within the Task List

## Data Validation
- Input validation occurs at the service layer
- All user inputs are sanitized before creating/updating tasks
- Invalid operations (e.g., accessing non-existent task ID) return appropriate error responses