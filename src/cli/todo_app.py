#!/usr/bin/env python3
"""
Main CLI interface and user interaction for the Todo In-Memory Python Console App.
"""

from src.services.todo_service import TodoService
from src.models.task import Task
from rich.console import Console
from rich.table import Table
from rich.prompt import Prompt
from rich.panel import Panel
from rich.text import Text
from rich import print
import sys


class TodoApp:
    """
    Main CLI application class that handles user interaction.
    """

    def __init__(self):
        """Initialize the TodoApp with a TodoService instance."""
        self.service = TodoService()
        self.console = Console()

    def display_menu(self):
        """Display the main menu options to the user."""
        self.console.print("\n[bold blue]=== Todo App Menu ===[/bold blue]")
        self.console.print("[green]1.[/green] Add Task")
        self.console.print("[green]2.[/green] View Tasks")
        self.console.print("[green]3.[/green] Update Task")
        self.console.print("[green]4.[/green] Delete Task")
        self.console.print("[green]5.[/green] Mark Complete/Incomplete")
        self.console.print("[green]6.[/green] Exit")
        self.console.print("[bold blue]=====================[/bold blue]")

    def get_user_choice(self) -> str:
        """
        Get user choice from the menu.

        Returns:
            The user's menu choice as a string
        """
        try:
            choice = Prompt.ask("[bold yellow]Enter your choice (1-6)[/bold yellow]", default="").strip()
            return choice
        except (EOFError, KeyboardInterrupt):
            self.console.print("\n[red]Exiting application...[/red]")
            sys.exit(0)

    def handle_add_task(self):
        """Handle the add task functionality."""
        self.console.print(Panel("[bold cyan]Add New Task[/bold cyan]"))

        title = Prompt.ask("Enter task title").strip()

        if not title:
            self.console.print("[red]Error: Title cannot be empty[/red]")
            return

        description = Prompt.ask("Enter task description (optional)", default="")

        try:
            task = self.service.add_task(title, description)
            self.console.print(f"[green]Task {task.id} added successfully![/green]")
        except ValueError as e:
            self.console.print(f"[red]Error: {e}[/red]")

    def handle_view_tasks(self):
        """Handle the view tasks functionality."""
        self.console.print(Panel("[bold cyan]All Tasks[/bold cyan]"))
        tasks = self.service.get_all_tasks()

        if not tasks:
            self.console.print("[yellow]No tasks found[/yellow]")
            return

        table = Table(title="Your Tasks", title_style="bold magenta")
        table.add_column("ID", style="dim", width=5)
        table.add_column("Title", style="cyan", min_width=15)
        table.add_column("Description", style="green", min_width=20)
        table.add_column("Status", style="bold", min_width=10)

        for task in tasks:
            status = "[green]Complete[/green]" if task.completed else "[red]Pending[/red]"
            title = task.title[:20] + "..." if len(task.title) > 20 else task.title
            desc = task.description[:30] + "..." if len(task.description) > 30 else task.description
            table.add_row(str(task.id), title, desc, status)

        self.console.print(table)

    def handle_update_task(self):
        """Handle the update task functionality."""
        self.console.print(Panel("[bold cyan]Update Task[/bold cyan]"))

        try:
            task_id_input = Prompt.ask("Enter task ID to update")
            task_id = int(task_id_input)
        except ValueError:
            self.console.print("[red]Error: Invalid task ID format[/red]")
            return

        # Check if task exists
        task = self.service.get_task_by_id(task_id)
        if not task:
            self.console.print(f"[red]Error: Task with ID {task_id} not found[/red]")
            return

        self.console.print(f"[bold]Current task:[/bold] {task.title}")
        new_title = Prompt.ask(f"Enter new title (or press Enter to keep '{task.title}')", default="").strip()
        new_description = Prompt.ask("Enter new description (or press Enter to keep current)", default="").strip()

        # Use current values if user didn't provide new ones
        title_to_update = new_title if new_title else None
        description_to_update = new_description if new_description else None

        if title_to_update is None and description_to_update == "":
            # Special case: if user enters empty string for description, we want to update it
            description_to_update = task.description  # Keep current description
        elif description_to_update == "":
            # If user just pressed Enter for description, don't update it
            description_to_update = None

        success = self.service.update_task(task_id, title_to_update, description_to_update)
        if success:
            self.console.print(f"[green]Task {task_id} updated successfully![/green]")
        else:
            self.console.print(f"[red]Error: Failed to update task {task_id}[/red]")

    def handle_delete_task(self):
        """Handle the delete task functionality."""
        self.console.print(Panel("[bold cyan]Delete Task[/bold cyan]"))

        try:
            task_id_input = Prompt.ask("Enter task ID to delete")
            task_id = int(task_id_input)
        except ValueError:
            self.console.print("[red]Error: Invalid task ID format[/red]")
            return

        success = self.service.delete_task(task_id)
        if success:
            self.console.print(f"[green]Task {task_id} deleted successfully![/green]")
        else:
            self.console.print(f"[red]Error: Task with ID {task_id} not found[/red]")

    def handle_mark_task(self):
        """Handle the mark task complete/incomplete functionality."""
        self.console.print(Panel("[bold cyan]Mark Task Status[/bold cyan]"))

        try:
            task_id_input = Prompt.ask("Enter task ID")
            task_id = int(task_id_input)
        except ValueError:
            self.console.print("[red]Error: Invalid task ID format[/red]")
            return

        # Check if task exists
        task = self.service.get_task_by_id(task_id)
        if not task:
            self.console.print(f"[red]Error: Task with ID {task_id} not found[/red]")
            return

        current_status = "[green]Complete[/green]" if task.completed else "[red]Pending[/red]"
        self.console.print(f"[bold]Current status:[/bold] {current_status}")

        status_choice = Prompt.ask("Mark as (c)omplete or (i)ncomplete? (c/i)", choices=["c", "i", "C", "I"], default="i").strip().lower()

        if status_choice == 'c':
            success = self.service.mark_task_complete(task_id)
            if success:
                self.console.print(f"[green]Task {task_id} marked as complete![/green]")
            else:
                self.console.print(f"[red]Error: Failed to mark task {task_id} as complete[/red]")
        elif status_choice == 'i':
            success = self.service.mark_task_incomplete(task_id)
            if success:
                self.console.print(f"[green]Task {task_id} marked as incomplete![/green]")
            else:
                self.console.print(f"[red]Error: Failed to mark task {task_id} as incomplete[/red]")
        else:
            self.console.print("[red]Error: Invalid choice. Please enter 'c' for complete or 'i' for incomplete[/red]")

    def run(self):
        """Main application loop."""
        self.console.print(Panel("[bold green]Welcome to the Todo App![/bold green]"))
        self.console.print("[yellow]This application stores tasks in memory only (data will be lost when exiting).[/yellow]")

        while True:
            self.display_menu()
            choice = self.get_user_choice()

            if choice == '1':
                self.handle_add_task()
            elif choice == '2':
                self.handle_view_tasks()
            elif choice == '3':
                self.handle_update_task()
            elif choice == '4':
                self.handle_delete_task()
            elif choice == '5':
                self.handle_mark_task()
            elif choice == '6':
                self.console.print("[bold green]Goodbye![/bold green]")
                break
            else:
                self.console.print("[red]Invalid choice. Please enter a number between 1-6.[/red]")


def main():
    """Entry point for the application."""
    app = TodoApp()
    app.run()


if __name__ == "__main__":
    main()