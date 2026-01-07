import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel, create_engine
from sqlmodel.pool import StaticPool
from unittest.mock import patch
from datetime import datetime, timedelta
import jwt

from src.main import app
from src.database.database import get_session
from src.lib.auth import JWT_SECRET, ALGORITHM
from src.models.task import TaskCreate


@pytest.fixture(name="engine")
def engine_fixture():
    engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    SQLModel.metadata.create_all(bind=engine)
    return engine


@pytest.fixture(name="session")
def session_fixture(engine):
    with Session(engine) as session:
        yield session


@pytest.fixture(name="client")
def client_fixture(engine, session):
    def get_session_override():
        return session

    app.dependency_overrides[get_session] = get_session_override
    client = TestClient(app)
    yield client
    app.dependency_overrides.clear()


def create_test_token(user_id: str) -> str:
    """Helper function to create a valid JWT token for testing"""
    payload = {
        "sub": user_id,
        "exp": datetime.utcnow() + timedelta(hours=1)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=ALGORITHM)


def test_comprehensive_task_lifecycle(client, session):
    """
    Test the complete task lifecycle: create, read, update, toggle completion, delete (T047)
    """
    user_id = "test_user_123"
    token = create_test_token(user_id)

    # 1. Create a task
    task_data = {
        "title": "Test Task",
        "description": "This is a test task",
        "completed": False
    }

    response = client.post(
        f"/api/{user_id}/tasks",
        json=task_data,
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 201
    created_task = response.json()["data"]
    assert created_task["title"] == "Test Task"
    assert created_task["description"] == "This is a test task"
    assert created_task["completed"] is False
    task_id = created_task["id"]

    # 2. Get the specific task
    response = client.get(
        f"/api/{user_id}/tasks/{task_id}",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    retrieved_task = response.json()["data"]
    assert retrieved_task["id"] == task_id
    assert retrieved_task["title"] == "Test Task"

    # 3. Get all tasks for the user
    response = client.get(
        f"/api/{user_id}/tasks",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    data = response.json()["data"]
    tasks = data["tasks"]
    assert len(tasks) == 1
    assert tasks[0]["id"] == task_id

    # 4. Update the task
    update_data = {
        "title": "Updated Test Task",
        "description": "This is an updated test task",
        "completed": True
    }

    response = client.put(
        f"/api/{user_id}/tasks/{task_id}",
        json=update_data,
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    updated_task = response.json()["data"]
    assert updated_task["title"] == "Updated Test Task"
    assert updated_task["completed"] is True

    # 5. Toggle completion status back to False
    response = client.patch(
        f"/api/{user_id}/tasks/{task_id}/complete",
        json={"completed": False},
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    toggled_task = response.json()["data"]
    assert toggled_task["completed"] is False

    # 6. Delete the task
    response = client.delete(
        f"/api/{user_id}/tasks/{task_id}",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200

    # 7. Verify the task is deleted
    response = client.get(
        f"/api/{user_id}/tasks/{task_id}",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 404


def test_task_validation(client, session):
    """
    Test input validation for task creation and updates (T040)
    """
    user_id = "test_user_123"
    token = create_test_token(user_id)

    # Test creating task with empty title (should fail validation)
    invalid_task_data = {
        "title": "",  # Empty title should fail
        "description": "This is a test task"
    }

    response = client.post(
        f"/api/{user_id}/tasks",
        json=invalid_task_data,
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 422  # Validation error

    # Test creating task with title that's too long (should fail validation)
    too_long_title = "A" * 201  # Max length is 200
    invalid_task_data = {
        "title": too_long_title,
        "description": "This is a test task"
    }

    response = client.post(
        f"/api/{user_id}/tasks",
        json=invalid_task_data,
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 422  # Validation error

    # Test creating task with description that's too long (should fail validation)
    too_long_description = "A" * 1001  # Max length is 1000
    invalid_task_data = {
        "title": "Valid Title",
        "description": too_long_description
    }

    response = client.post(
        f"/api/{user_id}/tasks",
        json=invalid_task_data,
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 422  # Validation error

    # Test valid task creation
    valid_task_data = {
        "title": "Valid Task Title",
        "description": "Valid task description"
    }

    response = client.post(
        f"/api/{user_id}/tasks",
        json=valid_task_data,
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 201


def test_task_filtering_and_sorting(client, session):
    """
    Test task filtering and sorting functionality (T034, T035)
    """
    user_id = "test_user_123"
    token = create_test_token(user_id)

    # Create multiple tasks with different statuses
    tasks_data = [
        {"title": "Task 1", "description": "Pending task", "completed": False},
        {"title": "Task 2", "description": "Completed task", "completed": True},
        {"title": "Task 3", "description": "Another pending task", "completed": False},
    ]

    # Create tasks
    created_tasks = []
    for task_data in tasks_data:
        response = client.post(
            f"/api/{user_id}/tasks",
            json=task_data,
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == 201
        created_tasks.append(response.json()["data"])

    # Test filtering by status: pending
    response = client.get(
        f"/api/{user_id}/tasks?status=pending",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    data = response.json()["data"]
    pending_tasks = data["tasks"]
    assert len(pending_tasks) == 2  # Should have 2 pending tasks
    for task in pending_tasks:
        assert task["completed"] is False

    # Test filtering by status: completed
    response = client.get(
        f"/api/{user_id}/tasks?status=completed",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    data = response.json()["data"]
    completed_tasks = data["tasks"]
    assert len(completed_tasks) == 1  # Should have 1 completed task
    assert completed_tasks[0]["completed"] is True

    # Test filtering by status: all
    response = client.get(
        f"/api/{user_id}/tasks?status=all",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    data = response.json()["data"]
    all_tasks = data["tasks"]
    assert len(all_tasks) == 3  # Should have all 3 tasks

    # Test sorting by title
    response = client.get(
        f"/api/{user_id}/tasks?sort=title",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    data = response.json()["data"]
    sorted_tasks = data["tasks"]
    titles = [task["title"] for task in sorted_tasks]
    assert titles == sorted(titles)  # Should be in alphabetical order


def test_error_handling(client, session):
    """
    Test comprehensive error handling (T044)
    """
    user_id = "test_user_123"
    token = create_test_token(user_id)

    # Test accessing non-existent task
    response = client.get(
        f"/api/{user_id}/tasks/999999",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 404

    # Test updating non-existent task
    update_data = {"title": "Updated Title"}
    response = client.put(
        f"/api/{user_id}/tasks/999999",
        json=update_data,
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 404

    # Test deleting non-existent task
    response = client.delete(
        f"/api/{user_id}/tasks/999999",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 404

    # Test with invalid token
    response = client.get(
        f"/api/{user_id}/tasks",
        headers={"Authorization": "Bearer invalid_token"}
    )
    assert response.status_code == 401

    # Test with no token
    response = client.get(f"/api/{user_id}/tasks")
    assert response.status_code == 401


def test_health_endpoint(client, session):
    """
    Test health check endpoint (should not require authentication)
    """
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] == "todo-api"