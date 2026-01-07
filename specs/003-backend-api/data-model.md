# Data Model: Backend - Phase II Todo Web App

## Overview
This document outlines the database schema and data models for the Todo Web App backend API. The models will be implemented using SQLModel to provide type safety and validation.

## Database Schema

### Users Table (handled by Better Auth)
- `id` (string) - Primary key, unique user identifier from Better Auth
- `email` (string) - User's email address
- `created_at` (timestamp) - Account creation date
- `updated_at` (timestamp) - Last account update

*Note: User management is primarily handled by Better Auth, but we may need to reference user IDs in our task model.*

### Tasks Table
- `id` (integer) - Primary key, auto-incrementing
- `user_id` (string) - Foreign key referencing user.id, cannot be null
- `title` (string) - Task title, required field (max 200 characters)
- `description` (text) - Task description, optional field (max 1000 characters)
- `completed` (boolean) - Task completion status, default false
- `created_at` (timestamp) - Task creation date, default now()
- `updated_at` (timestamp) - Last update date, auto-updating

## SQLModel Definitions

### Task Model
```python
from sqlmodel import SQLModel, Field, Relationship
from typing import Optional
from datetime import datetime

class TaskBase(SQLModel):
    title: str = Field(min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: bool = Field(default=False)

class Task(TaskBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(foreign_key="user.id")
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
```

## Relationships
- One User to Many Tasks (one-to-many)
- Tasks are always associated with a specific user
- Each task belongs to exactly one user

## Indexes
- Index on `user_id` for efficient filtering by user
- Index on `completed` for efficient status filtering
- Composite index on `user_id` and `completed` for combined filtering
- Index on `created_at` for sorting operations

## Constraints
- `title` field is required (not null) with length between 1-200 characters
- `user_id` is required and references the users table
- `completed` defaults to False
- `created_at` defaults to current timestamp
- Foreign key constraint ensures referential integrity with users table