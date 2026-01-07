from sqlmodel import SQLModel, Field, create_engine
from typing import Optional
from datetime import datetime


class TaskBase(SQLModel):
    title: str = Field(min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: bool = Field(default=False)


class Task(TaskBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str  # Store user ID as string (email) directly, no foreign key
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class TaskRead(TaskBase):
    id: int
    user_id: str
    created_at: datetime
    updated_at: datetime


class TaskCreate(TaskBase):
    title: str = Field(min_length=1, max_length=200)


class TaskUpdate(SQLModel):
    title: Optional[str] = Field(default=None, min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: Optional[bool] = None


class TaskPatch(SQLModel):
    completed: Optional[bool] = None

    class Config:
        extra = "forbid"  # Prevent extra fields in the request