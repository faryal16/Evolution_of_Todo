import pytest
from src.services.todo_service import TodoService
from src.models.task import Task


class TestTodoService:
    """Unit tests for the TodoService class."""

    def setup_method(self):
        """Set up a fresh TodoService instance for each test."""
        self.service = TodoService()

    def test_add_task_success(self):
        """Test adding a task successfully."""
        task = self.service.add_task("Test Title", "Test Description")

        assert task.id == 1
        assert task.title == "Test Title"
        assert task.description == "Test Description"
        assert task.completed is False
        assert len(self.service.get_all_tasks()) == 1

    def test_add_task_without_description(self):
        """Test adding a task with only a title."""
        task = self.service.add_task("Test Title")

        assert task.id == 1
        assert task.title == "Test Title"
        assert task.description == ""
        assert task.completed is False

    def test_add_task_empty_title(self):
        """Test adding a task with an empty title raises ValueError."""
        with pytest.raises(ValueError, match="Title must not be empty"):
            self.service.add_task("")

    def test_add_task_long_title(self):
        """Test adding a task with a title exceeding 200 characters."""
        long_title = "x" * 201
        with pytest.raises(ValueError, match="Title must be between 1-200 characters"):
            self.service.add_task(long_title)

    def test_get_all_tasks_empty(self):
        """Test getting all tasks when none exist."""
        tasks = self.service.get_all_tasks()

        assert len(tasks) == 0

    def test_get_all_tasks_with_tasks(self):
        """Test getting all tasks when some exist."""
        self.service.add_task("Task 1", "Description 1")
        self.service.add_task("Task 2", "Description 2")

        tasks = self.service.get_all_tasks()

        assert len(tasks) == 2
        assert tasks[0].title == "Task 1"
        assert tasks[1].title == "Task 2"

    def test_get_task_by_id_found(self):
        """Test getting a task by its ID when it exists."""
        task = self.service.add_task("Test Title", "Test Description")
        found_task = self.service.get_task_by_id(task.id)

        assert found_task is not None
        assert found_task.id == task.id
        assert found_task.title == task.title

    def test_get_task_by_id_not_found(self):
        """Test getting a task by its ID when it doesn't exist."""
        found_task = self.service.get_task_by_id(999)

        assert found_task is None

    def test_update_task_success(self):
        """Test updating a task successfully."""
        task = self.service.add_task("Original Title", "Original Description")
        success = self.service.update_task(task.id, "New Title", "New Description")

        assert success is True
        updated_task = self.service.get_task_by_id(task.id)
        assert updated_task.title == "New Title"
        assert updated_task.description == "New Description"

    def test_update_task_partial(self):
        """Test updating only title or description."""
        task = self.service.add_task("Original Title", "Original Description")

        # Update only title
        success = self.service.update_task(task.id, title="New Title")
        assert success is True
        updated_task = self.service.get_task_by_id(task.id)
        assert updated_task.title == "New Title"
        assert updated_task.description == "Original Description"

        # Update only description
        success = self.service.update_task(task.id, description="New Description")
        assert success is True
        updated_task = self.service.get_task_by_id(task.id)
        assert updated_task.title == "New Title"
        assert updated_task.description == "New Description"

    def test_update_task_not_found(self):
        """Test updating a task that doesn't exist."""
        success = self.service.update_task(999, "New Title")

        assert success is False

    def test_mark_task_complete(self):
        """Test marking a task as complete."""
        task = self.service.add_task("Test Title", "Test Description")
        assert task.completed is False

        success = self.service.mark_task_complete(task.id)
        assert success is True

        updated_task = self.service.get_task_by_id(task.id)
        assert updated_task.completed is True

    def test_mark_task_incomplete(self):
        """Test marking a task as incomplete."""
        task = self.service.add_task("Test Title", "Test Description")
        # First mark complete
        self.service.mark_task_complete(task.id)

        # Get the updated task to check its state
        task = self.service.get_task_by_id(task.id)
        assert task.completed is True

        success = self.service.mark_task_incomplete(task.id)
        assert success is True

        updated_task = self.service.get_task_by_id(task.id)
        assert updated_task.completed is False

    def test_delete_task_success(self):
        """Test deleting a task successfully."""
        task = self.service.add_task("Test Title", "Test Description")
        assert len(self.service.get_all_tasks()) == 1

        success = self.service.delete_task(task.id)
        assert success is True
        assert len(self.service.get_all_tasks()) == 0

    def test_delete_task_not_found(self):
        """Test deleting a task that doesn't exist."""
        success = self.service.delete_task(999)

        assert success is False

    def test_unique_id_generation(self):
        """Test that tasks get unique IDs."""
        task1 = self.service.add_task("Title 1", "Description 1")
        task2 = self.service.add_task("Title 2", "Description 2")
        task3 = self.service.add_task("Title 3", "Description 3")

        assert task1.id == 1
        assert task2.id == 2
        assert task3.id == 3