from typing import List, Optional
from src.models.task import Task


class TodoService:
    """
    Core business logic for task operations using in-memory storage only.
    """

    def __init__(self):
        """Initialize the TodoService with an empty task list and ID counter."""
        self._tasks: List[Task] = []
        self._next_id = 1

    def add_task(self, title: str, description: str = "") -> Task:
        """
        Create a new task with a unique ID and store it in memory.

        Args:
            title: Title of the task (required)
            description: Optional description of the task

        Returns:
            The created Task object with assigned ID

        Raises:
            ValueError: If title is empty or exceeds length limits
        """
        task = Task(id=self._next_id, title=title, description=description)
        self._tasks.append(task)
        self._next_id += 1
        return task

    def get_all_tasks(self) -> List[Task]:
        """
        Get all tasks from memory.

        Returns:
            List of all tasks in memory
        """
        return self._tasks.copy()  # Return a copy to prevent external modification

    def get_task_by_id(self, task_id: int) -> Optional[Task]:
        """
        Get a specific task by its ID.

        Args:
            task_id: ID of the task to retrieve

        Returns:
            Task object if found, None otherwise
        """
        for task in self._tasks:
            if task.id == task_id:
                return task
        return None

    def update_task(self, task_id: int, title: Optional[str] = None, description: Optional[str] = None) -> bool:
        """
        Update an existing task's title or description.

        Args:
            task_id: ID of the task to update
            title: New title (optional)
            description: New description (optional)

        Returns:
            True if task was updated, False if task was not found
        """
        task = self.get_task_by_id(task_id)
        if task is None:
            return False

        if title is not None:
            task.title = title
        if description is not None:
            task.description = description

        return True

    def mark_task_complete(self, task_id: int) -> bool:
        """
        Mark a task as complete.

        Args:
            task_id: ID of the task to mark complete

        Returns:
            True if task was marked complete, False if task was not found
        """
        task = self.get_task_by_id(task_id)
        if task is None:
            return False

        task.mark_complete()
        return True

    def mark_task_incomplete(self, task_id: int) -> bool:
        """
        Mark a task as incomplete.

        Args:
            task_id: ID of the task to mark incomplete

        Returns:
            True if task was marked incomplete, False if task was not found
        """
        task = self.get_task_by_id(task_id)
        if task is None:
            return False

        task.mark_incomplete()
        return True

    def delete_task(self, task_id: int) -> bool:
        """
        Delete a task by its ID.

        Args:
            task_id: ID of the task to delete

        Returns:
            True if task was deleted, False if task was not found
        """
        task = self.get_task_by_id(task_id)
        if task is None:
            return False

        self._tasks.remove(task)
        return True

    def get_next_id(self) -> int:
        """
        Get the next available ID for a new task.

        Returns:
            The next ID that will be assigned to a new task
        """
        return self._next_id