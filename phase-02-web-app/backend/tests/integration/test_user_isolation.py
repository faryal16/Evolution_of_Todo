import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel, create_engine
from sqlmodel.pool import StaticPool
from unittest.mock import patch
from typing import Generator
from datetime import datetime

from src.main import app
from src.database.database import get_session
from src.models.task import Task, TaskCreate


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


def test_user_isolation_task_access(client: TestClient, session: Session):
    """
    Test that users can only access their own tasks (T021).
    """
    # Mock JWT tokens for two different users
    user1_token = "mock_user1_token"
    user2_token = "mock_user2_token"
    user1_id = "user1"
    user2_id = "user2"

    # Create tasks for user1
    task1_data = {
        "title": "User 1 Task",
        "description": "Task belonging to user 1"
    }

    # Create tasks for user2
    task2_data = {
        "title": "User 2 Task",
        "description": "Task belonging to user 2"
    }

    with patch("src.lib.auth.get_current_user", return_value=user1_id):
        # Create a task as user1
        response = client.post(
            "/api/tasks",
            json=task1_data,
            headers={"Authorization": f"Bearer {user1_token}"}
        )
        assert response.status_code == 201
        user1_task = response.json()["data"]
        task1_id = user1_task["id"]

    with patch("src.lib.auth.get_current_user", return_value=user2_id):
        # Create a task as user2
        response = client.post(
            "/api/tasks",
            json=task2_data,
            headers={"Authorization": f"Bearer {user2_token}"}
        )
        assert response.status_code == 201
        user2_task = response.json()["data"]
        task2_id = user2_task["id"]

    # Verify user1 can access their own task
    with patch("src.lib.auth.get_current_user", return_value=user1_id):
        response = client.get(
            f"/api/tasks/{task1_id}",
            headers={"Authorization": f"Bearer {user1_token}"}
        )
        assert response.status_code == 200
        assert response.json()["data"]["id"] == task1_id

    # Verify user1 cannot access user2's task (will result in 404 since task exists for user2 but not for user1)
    with patch("src.lib.auth.get_current_user", return_value=user1_id):
        response = client.get(
            f"/api/tasks/{task2_id}",
            headers={"Authorization": f"Bearer {user1_token}"}
        )
        assert response.status_code in [401, 404]  # Unauthorized or Not Found

    # Verify user2 can access their own task
    with patch("src.lib.auth.get_current_user", return_value=user2_id):
        response = client.get(
            f"/api/tasks/{task2_id}",
            headers={"Authorization": f"Bearer {user2_token}"}
        )
        assert response.status_code == 200
        assert response.json()["data"]["id"] == task2_id

    # Verify user2 cannot access user1's task (will result in 404 since task exists for user1 but not for user2)
    with patch("src.lib.auth.get_current_user", return_value=user2_id):
        response = client.get(
            f"/api/tasks/{task1_id}",
            headers={"Authorization": f"Bearer {user2_token}"}
        )
        assert response.status_code in [401, 404]  # Unauthorized or Not Found


def test_user_isolation_task_list(client: TestClient, session: Session):
    """
    Test that users can only see their own tasks in the list endpoint (T021).
    """
    user1_token = "mock_user1_token"
    user2_token = "mock_user2_token"
    user1_id = "user1"
    user2_id = "user2"

    # Create tasks for both users
    task1_data = {"title": "User 1 Task", "description": "Task for user 1"}
    task2_data = {"title": "User 2 Task", "description": "Task for user 2"}

    with patch("src.lib.auth.get_current_user", return_value=user1_id):
        response = client.post(
            "/api/tasks",
            json=task1_data,
            headers={"Authorization": f"Bearer {user1_token}"}
        )
        assert response.status_code == 201

    with patch("src.lib.auth.get_current_user", return_value=user2_id):
        response = client.post(
            "/api/tasks",
            json=task2_data,
            headers={"Authorization": f"Bearer {user2_token}"}
        )
        assert response.status_code == 201

    # Verify user1 only sees their own task
    with patch("src.lib.auth.get_current_user", return_value=user1_id):
        response = client.get(
            "/api/tasks",
            headers={"Authorization": f"Bearer {user1_token}"}
        )
        assert response.status_code == 200
        data = response.json()["data"]
        tasks = data["tasks"]
        assert len(tasks) == 1
        assert tasks[0]["title"] == "User 1 Task"

    # Verify user2 only sees their own task
    with patch("src.lib.auth.get_current_user", return_value=user2_id):
        response = client.get(
            "/api/tasks",
            headers={"Authorization": f"Bearer {user2_token}"}
        )
        assert response.status_code == 200
        data = response.json()["data"]
        tasks = data["tasks"]
        assert len(tasks) == 1
        assert tasks[0]["title"] == "User 2 Task"