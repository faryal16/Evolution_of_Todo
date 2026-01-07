from sqlmodel import Session, select, func
from typing import List, Optional
from ..models.task import Task, TaskCreate, TaskUpdate, TaskRead, TaskPatch
from ..lib.exceptions import TaskNotFoundException, UnauthorizedAccessException
from datetime import datetime


class TaskService:
    @staticmethod
    def create_task(*, session: Session, task: TaskCreate, user_id: str) -> TaskRead:
        """
        Create a new task for a user
        """
        db_task = Task(
            title=task.title,
            description=task.description,
            completed=task.completed,
            user_id=user_id
        )
        session.add(db_task)
        session.commit()
        session.refresh(db_task)
        return TaskRead.from_orm(db_task)

    @staticmethod
    def get_task_by_id(*, session: Session, task_id: int, user_id: str) -> TaskRead:
        """
        Get a specific task by ID for a user
        """
        statement = select(Task).where(Task.id == task_id).where(Task.user_id == user_id)
        task = session.exec(statement).first()
        if not task:
            raise TaskNotFoundException(task_id=task_id, user_id=user_id)
        return TaskRead.from_orm(task)

    @staticmethod
    def get_tasks(*, session: Session, user_id: str, status: Optional[str] = None,
                  sort: Optional[str] = None, limit: int = 50, offset: int = 0) -> tuple[List[TaskRead], int]:
        """
        Get all tasks for a user with optional filtering and sorting
        """
        statement = select(Task).where(Task.user_id == user_id)

        # Apply status filter if provided
        if status and status != "all":
            if status == "completed":
                statement = statement.where(Task.completed == True)
            elif status == "pending":
                statement = statement.where(Task.completed == False)

        # Apply sorting if provided
        if sort == "title":
            statement = statement.order_by(Task.title)
        elif sort == "created":
            statement = statement.order_by(Task.created_at.desc())
        else:  # Default sort
            statement = statement.order_by(Task.created_at.desc())

        # Get total count with same filters
        count_statement = select(func.count(Task.id)).where(Task.user_id == user_id)
        if status and status != "all":
            if status == "completed":
                count_statement = count_statement.where(Task.completed == True)
            elif status == "pending":
                count_statement = count_statement.where(Task.completed == False)
        total_count = session.exec(count_statement).one()

        # Apply pagination
        statement = statement.offset(offset).limit(limit)
        tasks = session.exec(statement).all()

        task_reads = [TaskRead.from_orm(task) for task in tasks]
        return task_reads, total_count

    @staticmethod
    def update_task(*, session: Session, task_id: int, task_update: TaskUpdate, user_id: str) -> TaskRead:
        """
        Update an existing task
        """
        statement = select(Task).where(Task.id == task_id).where(Task.user_id == user_id)
        db_task = session.exec(statement).first()
        if not db_task:
            raise TaskNotFoundException(task_id=task_id, user_id=user_id)

        # Update the task with provided values
        for field, value in task_update.dict(exclude_unset=True).items():
            setattr(db_task, field, value)

        # Update the updated_at timestamp
        db_task.updated_at = datetime.utcnow()

        session.add(db_task)
        session.commit()
        session.refresh(db_task)
        return TaskRead.from_orm(db_task)

    @staticmethod
    def delete_task(*, session: Session, task_id: int, user_id: str) -> bool:
        """
        Delete a task by ID for a user
        """
        statement = select(Task).where(Task.id == task_id).where(Task.user_id == user_id)
        db_task = session.exec(statement).first()
        if not db_task:
            raise TaskNotFoundException(task_id=task_id, user_id=user_id)

        session.delete(db_task)
        session.commit()
        return True

    @staticmethod
    def toggle_task_completion(*, session: Session, task_id: int, user_id: str,
                              completed: Optional[bool] = None) -> TaskRead:
        """
        Toggle the completion status of a task
        """
        statement = select(Task).where(Task.id == task_id).where(Task.user_id == user_id)
        db_task = session.exec(statement).first()
        if not db_task:
            raise TaskNotFoundException(task_id=task_id, user_id=user_id)

        # If completed status is provided, set it; otherwise toggle
        if completed is not None:
            db_task.completed = completed
        else:
            db_task.completed = not db_task.completed

        # Update the updated_at timestamp
        db_task.updated_at = datetime.utcnow()

        session.add(db_task)
        session.commit()
        session.refresh(db_task)
        return TaskRead.from_orm(db_task)