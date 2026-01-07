---
id: 1
title: "Frontend Todo Web App Spec"
stage: "spec"
date_iso: "2026-01-04"
surface: "agent"
model: "claude-haiku-4-5-20251001"
feature: "frontend-todo-app"
branch: "002-frontend-todo-app"
user: "user"
command: "/sp.specify"
labels: ["spec", "frontend", "todo-app", "authentication"]
links:
  spec: "D:/HACKTHON_II/specs/002-frontend-todo-app/spec.md"
  ticket: null
  adr: null
  pr: null
files_yaml:
  - "D:/HACKTHON_II/specs/002-frontend-todo-app/spec.md"
  - "D:/HACKTHON_II/specs/002-frontend-todo-app/checklists/requirements.md"
tests_yaml: []
---

# PHR: Frontend Todo Web App Spec

## Prompt Text

```
# Feature Spec: Frontend - Phase II Todo Web App

## Purpose
Implement a responsive, interactive frontend for the Phase II Todo app using Next.js 16+ (App Router), TypeScript, and Tailwind CSS. The frontend will communicate with the FastAPI backend via RESTful API endpoints and handle authentication using Better Auth with JWT.

## User Stories
- As a user, I can sign up and log in using Better Auth
- As a user, I can create a new task
- As a user, I can view my tasks (all/pending/completed)
- As a user, I can update or delete a task
- As a user, I can mark a task complete/incomplete
- As a user, I can only see my own tasks
- As a user, I get redirected to login if my JWT expires or is invalid

## Acceptance Criteria

### Authentication
- Use Better Auth library with JWT plugin enabled
- Store JWT token in browser (localStorage or secure cookie)
- Attach JWT token in Authorization header for every API request
- Redirect unauthenticated users to login page

### Task CRUD
- Task list displays:
  - Title, Description, Completion Status, Created Date
  - Filter options (all, pending, completed)
- Task creation form validates:
  - Title required (1–200 chars)
  - Description optional (max 1000 chars)
- Tasks can be updated inline or via edit modal
- Completion toggle button updates backend immediately
- Deletion confirms before API call

### UI/UX
- Use responsive Tailwind CSS layouts
- Mobile-first, desktop-friendly
- Component-based structure:
  - `/components/TaskCard.tsx` - Single task item
  - `/components/TaskList.tsx` - List of tasks
  - `/components/TaskForm.tsx` - Create/Edit form
- Pages:
  - `/app/login` - Login page
  - `/app/signup` - Signup page
  - `/app/tasks` - Task dashboard
- Use server components where possible, client components for interactive UI

### API Integration
- Central API client: `/lib/api.ts`
- Methods:
  - `getTasks(status?: string, sort?: string)`
  - `createTask(title, description)`
  - `updateTask(id, title, description)`
  - `deleteTask(id)`
  - `toggleComplete(id)`

### Error Handling
- Show toast messages for success/error
- Redirect to login if 401 Unauthorized received
- Retry logic for network errors

## References
- Backend API spec: @specs/api/rest-endpoints.md
- Authentication spec: @specs/features/authentication.md
```

## Response Text

Created a comprehensive specification for the Frontend - Phase II Todo Web App, including user scenarios, functional requirements, and success criteria. The specification was refined to remove implementation-specific details to focus on user value and business needs. A quality checklist was also created and validated.
