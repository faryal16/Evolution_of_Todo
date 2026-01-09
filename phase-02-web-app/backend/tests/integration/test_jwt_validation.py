import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session
from unittest.mock import patch
import jwt
from datetime import datetime, timedelta

from src.main import app
from src.lib.auth import create_access_token, verify_token


def test_valid_jwt_token_access(client: TestClient):
    """
    Test accessing protected endpoints with valid JWT tokens (T026).
    """
    # Create a valid token for testing
    user_id = "test_user_123"
    valid_token = create_access_token(data={"sub": user_id})

    # Test accessing a protected endpoint with valid token
    response = client.get(
        "/api/tasks",
        headers={"Authorization": f"Bearer {valid_token}"}
    )
    # This should return 200 (OK) or 404 (not found) but not 401 (unauthorized)
    # 404 is expected if no tasks exist, but it means authentication passed
    assert response.status_code in [200, 404]


def test_invalid_jwt_token_access(client: TestClient):
    """
    Test accessing protected endpoints with invalid JWT tokens (T027).
    """
    user_id = "test_user_123"
    invalid_token = "invalid_token_string"

    # Test accessing a protected endpoint with invalid token
    response = client.get(
        "/api/tasks",
        headers={"Authorization": f"Bearer {invalid_token}"}
    )
    # Should return 401 Unauthorized
    assert response.status_code == 401
    assert "detail" in response.json()


def test_missing_jwt_token_access(client: TestClient):
    """
    Test accessing protected endpoints without JWT token (T027).
    """
    user_id = "test_user_123"

    # Test accessing a protected endpoint without token
    response = client.get(
        "/api/tasks"
        # No Authorization header
    )
    # Should return 401 Unauthorized
    assert response.status_code == 401
    assert "detail" in response.json()


def test_expired_jwt_token_access(client: TestClient):
    """
    Test accessing protected endpoints with expired JWT tokens.
    """
    user_id = "test_user_123"
    # Create an expired token manually (set to expire in the past)
    expired_payload = {
        "sub": user_id,
        "exp": datetime.utcnow() - timedelta(minutes=10)  # Expired 10 minutes ago
    }
    from src.lib.auth import JWT_SECRET, ALGORITHM
    expired_token = jwt.encode(expired_payload, JWT_SECRET, algorithm=ALGORITHM)

    # Test accessing a protected endpoint with expired token
    response = client.get(
        "/api/tasks",
        headers={"Authorization": f"Bearer {expired_token}"}
    )
    # Should return 401 Unauthorized for expired token
    assert response.status_code == 401
    assert "detail" in response.json()


@pytest.fixture(name="client")
def client_fixture():
    client = TestClient(app)
    yield client