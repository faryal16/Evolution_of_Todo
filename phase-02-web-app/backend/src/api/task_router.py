from fastapi import APIRouter, Depends, Query, Request
from slowapi import Limiter
from slowapi.util import get_remote_address
from sqlmodel import Session
from typing import List, Optional
from ..database.database import get_session
from ..models.task import TaskCreate, TaskRead, TaskUpdate, TaskPatch
from ..services.task_service import TaskService
from ..lib.auth import get_current_user
from ..models import SuccessResponse, ErrorResponse

# Initialize rate limiter
limiter = Limiter(key_func=get_remote_address)

router = APIRouter()


@router.get("/tasks", response_model=SuccessResponse)
@limiter.limit("100/minute")  # Rate limit for getting tasks (T043)
def get_tasks(
    request: Request,  # Needed for rate limiting
    status: Optional[str] = Query(None, regex="^(all|pending|completed)$"),
    sort: Optional[str] = Query(None, regex="^(created|title)$"),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    current_user: str = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Get all tasks for a user with optional filtering and sorting
    """
    tasks, total = TaskService.get_tasks(
        session=session,
        user_id=current_user,
        status=status,
        sort=sort,
        limit=limit,
        offset=offset
    )

    return SuccessResponse(
        data={
            "tasks": [task.dict() for task in tasks],
            "total": total,
            "limit": limit,
            "offset": offset
        }
    )


@router.post("/tasks", response_model=SuccessResponse, status_code=201)
@limiter.limit("50/minute")  # Rate limit for creating tasks (T043)
def create_task(
    request: Request,  # Needed for rate limiting
    task: TaskCreate,
    current_user: str = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Create a new task for the user
    """
    created_task = TaskService.create_task(
        session=session,
        task=task,
        user_id=current_user
    )

    return SuccessResponse(data=created_task.dict())


@router.get("/tasks/{id}", response_model=SuccessResponse)
@limiter.limit("100/minute")  # Rate limit for getting a specific task (T043)
def get_task(
    request: Request,  # Needed for rate limiting
    id: int,
    current_user: str = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Get a specific task by ID
    """
    task = TaskService.get_task_by_id(
        session=session,
        task_id=id,
        user_id=current_user
    )

    return SuccessResponse(data=task.dict())


@router.put("/tasks/{id}", response_model=SuccessResponse)
@limiter.limit("30/minute")  # Rate limit for updating tasks (T043)
def update_task(
    request: Request,  # Needed for rate limiting
    id: int,
    task_update: TaskUpdate,
    current_user: str = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Update a specific task by ID
    """
    updated_task = TaskService.update_task(
        session=session,
        task_id=id,
        task_update=task_update,
        user_id=current_user
    )

    return SuccessResponse(data=updated_task.dict())


@router.delete("/tasks/{id}", response_model=SuccessResponse)
@limiter.limit("30/minute")  # Rate limit for deleting tasks (T043)
def delete_task(
    request: Request,  # Needed for rate limiting
    id: int,
    current_user: str = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Delete a specific task by ID
    """
    TaskService.delete_task(
        session=session,
        task_id=id,
        user_id=current_user
    )

    return SuccessResponse(message="Task deleted successfully")


from fastapi import Body

@router.patch("/tasks/{id}/complete", response_model=SuccessResponse)
@limiter.limit("50/minute")  # Rate limit for toggling task completion (T043)
def toggle_task_completion(
    request: Request,  # Needed for rate limiting
    id: int,
    task_patch: TaskPatch = Body(None),
    current_user: str = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Toggle the completion status of a task
    """
    # Handle the case where no body is provided (just toggle)
    completed_status = None
    if task_patch is not None:
        completed_status = task_patch.completed

    updated_task = TaskService.toggle_task_completion(
        session=session,
        task_id=id,
        user_id=current_user,
        completed=completed_status
    )

    return SuccessResponse(data=updated_task.dict())