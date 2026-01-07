from fastapi import APIRouter, Depends, HTTPException, status
from ..lib.auth import get_current_user, create_access_token
from ..models import AuthRequest, SuccessResponse
from datetime import timedelta, datetime
import os

router = APIRouter()


@router.post("/signup", response_model=SuccessResponse)
def signup(auth_request: AuthRequest):
    """
    User registration endpoint
    """
    # For now, we'll create a simple token for the user
    # In a real implementation, you would validate the user data,
    # check if the user already exists, hash the password, etc.

    # Validate input
    if not auth_request.email or not auth_request.password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email and password are required"
        )

    # In a real implementation, you would create a user in the database
    # For now, we'll just return a token with the email as user ID
    user_id = auth_request.email
    token = create_access_token(data={"sub": user_id})

    # Calculate expiration time
    expire_minutes = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "15"))
    expires_at = datetime.utcnow() + timedelta(minutes=expire_minutes)

    return SuccessResponse(
        data={
            "token": token,
            "user": {"id": user_id, "email": auth_request.email, "username": auth_request.username},
            "expires_at": expires_at.isoformat()
        }
    )


@router.post("/login", response_model=SuccessResponse)
def login(auth_request: AuthRequest):
    """
    User login endpoint
    """
    # For now, we'll create a simple token for the user
    # In a real implementation, you would validate credentials against the database

    # Validate input
    if not auth_request.email or not auth_request.password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email and password are required"
        )

    # In a real implementation, you would validate the credentials
    # For now, we'll just return a token with the email as user ID
    user_id = auth_request.email
    token = create_access_token(data={"sub": user_id})

    # Calculate expiration time
    expire_minutes = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "15"))
    expires_at = datetime.utcnow() + timedelta(minutes=expire_minutes)

    return SuccessResponse(
        data={
            "token": token,
            "user": {"id": user_id, "email": auth_request.email, "username": getattr(auth_request, 'username', None)},
            "expires_at": expires_at.isoformat()
        }
    )


@router.post("/logout", response_model=SuccessResponse)
def logout(current_user: str = Depends(get_current_user)):
    """
    User logout endpoint
    """
    # In a real implementation, you would add the token to a blacklist
    # For now, we'll just return a success message
    return SuccessResponse(
        data={"message": "Successfully logged out"}
    )


@router.get("/verify")
def verify_auth_token(current_user: str = Depends(get_current_user)):
    """
    Verify if the provided token is valid
    """
    return {"user_id": current_user, "message": "Token is valid"}