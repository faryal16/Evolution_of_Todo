from datetime import datetime
from typing import Optional


class Task:
    """
    Represents a todo item with unique ID, title, description, and completion status
    """

    def __init__(self, id: int, title: str, description: str = "", completed: bool = False):
        """
        Initialize a Task instance.

        Args:
            id: Unique identifier for the task
            title: Title of the task (required)
            description: Optional description of the task
            completed: Status indicating whether the task is completed (default: False)
        """
        if not title or not title.strip():
            raise ValueError("Title must not be empty")

        if len(title) > 200:
            raise ValueError("Title must be between 1-200 characters")

        if len(description) > 1000:
            raise ValueError("Description must be limited to 1000 characters")

        self.id = id
        self.title = title.strip()
        self.description = description
        self.completed = completed
        self.created_at = datetime.now()

    def __str__(self) -> str:
        """String representation of the task."""
        status = "Complete" if self.completed else "Pending"
        return f"{self.id} | {self.title} | {self.description} | {status}"

    def __repr__(self) -> str:
        """Developer-friendly representation of the task."""
        return f"Task(id={self.id}, title='{self.title}', description='{self.description}', completed={self.completed})"

    def to_dict(self) -> dict:
        """Convert task to dictionary representation."""
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "completed": self.completed,
            "created_at": self.created_at.isoformat()
        }

    def mark_complete(self):
        """Mark the task as complete."""
        self.completed = True

    def mark_incomplete(self):
        """Mark the task as incomplete."""
        self.completed = False