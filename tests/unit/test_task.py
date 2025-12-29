import pytest
from src.models.task import Task


class TestTask:
    """Unit tests for the Task class."""

    def test_create_task_success(self):
        """Test creating a task successfully."""
        task = Task(id=1, title="Test Title", description="Test Description", completed=False)

        assert task.id == 1
        assert task.title == "Test Title"
        assert task.description == "Test Description"
        assert task.completed is False

    def test_create_task_defaults(self):
        """Test creating a task with default values."""
        task = Task(id=1, title="Test Title")

        assert task.id == 1
        assert task.title == "Test Title"
        assert task.description == ""
        assert task.completed is False

    def test_create_task_empty_title(self):
        """Test creating a task with an empty title raises ValueError."""
        with pytest.raises(ValueError, match="Title must not be empty"):
            Task(id=1, title="", description="Test Description")

    def test_create_task_whitespace_only_title(self):
        """Test creating a task with whitespace-only title raises ValueError."""
        with pytest.raises(ValueError, match="Title must not be empty"):
            Task(id=1, title="   ", description="Test Description")

    def test_create_task_long_title(self):
        """Test creating a task with a title exceeding 200 characters."""
        long_title = "x" * 201
        with pytest.raises(ValueError, match="Title must be between 1-200 characters"):
            Task(id=1, title=long_title, description="Test Description")

    def test_create_task_long_description(self):
        """Test creating a task with a description exceeding 1000 characters."""
        long_description = "x" * 1001
        with pytest.raises(ValueError, match="Description must be limited to 1000 characters"):
            Task(id=1, title="Test Title", description=long_description)

    def test_mark_complete(self):
        """Test marking a task as complete."""
        task = Task(id=1, title="Test Title")
        assert task.completed is False

        task.mark_complete()
        assert task.completed is True

    def test_mark_incomplete(self):
        """Test marking a task as incomplete."""
        task = Task(id=1, title="Test Title", completed=True)
        assert task.completed is True

        task.mark_incomplete()
        assert task.completed is False

    def test_str_representation(self):
        """Test string representation of a task."""
        task = Task(id=1, title="Test Title", description="Test Description", completed=True)
        str_repr = str(task)

        assert "1 | Test Title | Test Description | Complete" in str_repr

    def test_repr_representation(self):
        """Test developer-friendly representation of a task."""
        task = Task(id=1, title="Test Title", description="Test Description", completed=True)
        repr_str = repr(task)

        assert "Task(id=1, title='Test Title', description='Test Description', completed=True)" in repr_str

    def test_to_dict(self):
        """Test converting task to dictionary."""
        task = Task(id=1, title="Test Title", description="Test Description", completed=True)
        task_dict = task.to_dict()

        assert task_dict["id"] == 1
        assert task_dict["title"] == "Test Title"
        assert task_dict["description"] == "Test Description"
        assert task_dict["completed"] is True
        assert "created_at" in task_dict