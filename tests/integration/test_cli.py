import pytest
from unittest.mock import patch, Mock
from src.cli.todo_app import TodoApp
from src.services.todo_service import TodoService


class TestCLIIntegration:
    """Integration tests for the CLI functionality."""

    def setup_method(self):
        """Set up a fresh TodoApp instance for each test."""
        self.app = TodoApp()

    @patch('builtins.input', side_effect=['Test Title', 'Test Description'])
    @patch('builtins.print')
    def test_handle_add_task_success(self, mock_print, mock_input):
        """Test adding a task through the CLI interface."""
        initial_count = len(self.app.service.get_all_tasks())

        self.app.handle_add_task()

        tasks = self.app.service.get_all_tasks()
        assert len(tasks) == initial_count + 1
        if len(tasks) > initial_count:
            assert tasks[-1].title == "Test Title"
            assert tasks[-1].description == "Test Description"

    @patch('builtins.input', side_effect=['', 'Test Description'])
    @patch('builtins.print')
    def test_handle_add_task_empty_title(self, mock_print, mock_input):
        """Test adding a task with empty title through the CLI."""
        initial_count = len(self.app.service.get_all_tasks())

        self.app.handle_add_task()

        tasks = self.app.service.get_all_tasks()
        assert len(tasks) == initial_count  # No task should be added

    @patch('builtins.input', side_effect=['Test Title', ''])
    @patch('builtins.print')
    def test_handle_add_task_no_description(self, mock_print, mock_input):
        """Test adding a task without description through the CLI."""
        initial_count = len(self.app.service.get_all_tasks())

        self.app.handle_add_task()

        tasks = self.app.service.get_all_tasks()
        assert len(tasks) == initial_count + 1
        if len(tasks) > initial_count:
            assert tasks[-1].title == "Test Title"
            assert tasks[-1].description == ""

    @patch('builtins.input', side_effect=['Test Title', 'Test Description'])
    def test_add_and_view_tasks(self, mock_input):
        """Test adding a task and then viewing it."""
        # Add a task
        with patch('builtins.print'):
            self.app.handle_add_task()

        # Capture view tasks output
        tasks = self.app.service.get_all_tasks()
        assert len(tasks) == 1
        assert tasks[0].title == "Test Title"

    @patch('builtins.input', side_effect=['1'])
    @patch('builtins.print')
    def test_handle_view_tasks_empty(self, mock_print, mock_input):
        """Test viewing tasks when no tasks exist."""
        self.app.handle_view_tasks()
        # The method should handle this case gracefully

    @patch('builtins.input', side_effect=['1', 'Updated Title', 'Updated Description'])
    @patch('builtins.print')
    def test_handle_update_task(self, mock_print, mock_input):
        """Test updating a task through the CLI."""
        # First add a task
        task = self.app.service.add_task("Original Title", "Original Description")

        # Mock input for update task
        with patch('builtins.input', side_effect=[str(task.id), 'Updated Title', 'Updated Description']):
            self.app.handle_update_task()

        # Check if task was updated
        updated_task = self.app.service.get_task_by_id(task.id)
        assert updated_task is not None
        assert updated_task.title == "Updated Title"
        assert updated_task.description == "Updated Description"

    @patch('builtins.input', side_effect=['1'])
    @patch('builtins.print')
    def test_handle_delete_task(self, mock_print, mock_input):
        """Test deleting a task through the CLI."""
        # First add a task
        task = self.app.service.add_task("Test Title", "Test Description")
        initial_count = len(self.app.service.get_all_tasks())

        # Mock input for delete task
        with patch('builtins.input', side_effect=[str(task.id)]):
            self.app.handle_delete_task()

        # Check if task was deleted
        final_count = len(self.app.service.get_all_tasks())
        assert final_count == initial_count - 1

        # Verify task no longer exists
        deleted_task = self.app.service.get_task_by_id(task.id)
        assert deleted_task is None

    @patch('builtins.input', side_effect=['1', 'c'])
    @patch('builtins.print')
    def test_handle_mark_task_complete(self, mock_print, mock_input):
        """Test marking a task as complete through the CLI."""
        # First add a task
        task = self.app.service.add_task("Test Title", "Test Description")
        assert task.completed is False

        # Mock input for mark task
        with patch('builtins.input', side_effect=[str(task.id), 'c']):
            self.app.handle_mark_task()

        # Check if task was marked complete
        updated_task = self.app.service.get_task_by_id(task.id)
        assert updated_task is not None
        assert updated_task.completed is True

    @patch('builtins.input', side_effect=['1', 'i'])
    @patch('builtins.print')
    def test_handle_mark_task_incomplete(self, mock_print, mock_input):
        """Test marking a task as incomplete through the CLI."""
        # First add and complete a task
        task = self.app.service.add_task("Test Title", "Test Description")
        self.app.service.mark_task_complete(task.id)

        task = self.app.service.get_task_by_id(task.id)
        assert task.completed is True

        # Mock input for mark task
        with patch('builtins.input', side_effect=[str(task.id), 'i']):
            self.app.handle_mark_task()

        # Check if task was marked incomplete
        updated_task = self.app.service.get_task_by_id(task.id)
        assert updated_task is not None
        assert updated_task.completed is False

    def test_full_workflow(self):
        """Test a complete workflow of adding, viewing, updating, and deleting tasks."""
        service = TodoService()

        # Add tasks
        task1 = service.add_task("Task 1", "Description 1")
        task2 = service.add_task("Task 2", "Description 2")

        # Verify tasks were added
        all_tasks = service.get_all_tasks()
        assert len(all_tasks) == 2

        # Update a task
        success = service.update_task(task1.id, "Updated Task 1", "Updated Description 1")
        assert success is True

        # Verify update
        updated_task = service.get_task_by_id(task1.id)
        assert updated_task.title == "Updated Task 1"

        # Mark task as complete
        success = service.mark_task_complete(task1.id)
        assert success is True

        updated_task = service.get_task_by_id(task1.id)
        assert updated_task.completed is True

        # Delete a task
        success = service.delete_task(task2.id)
        assert success is True

        # Verify deletion
        all_tasks = service.get_all_tasks()
        assert len(all_tasks) == 1