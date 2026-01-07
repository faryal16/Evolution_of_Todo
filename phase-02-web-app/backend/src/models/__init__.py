from sqlmodel import SQLModel
from typing import Optional
from datetime import datetime
from pydantic import BaseModel


class AuthRequest(BaseModel):
    """Request model for authentication"""
    email: str
    password: str
    username: Optional[str] = None


class AuthResponse(BaseModel):
    """Response model for authentication"""
    token: str
    user: dict  # Contains user information like id, email
    expires_at: float  # Expiration timestamp


class BaseResponse(BaseModel):
    """Base response model for API responses"""
    success: bool
    message: Optional[str] = None


class SuccessResponse(BaseResponse):
    """Success response with optional data"""
    success: bool = True
    data: Optional[dict] = None


class ErrorResponse(BaseResponse):
    """Error response with optional details"""
    success: bool = False
    error: str
    details: Optional[dict] = None