---
description: "Task list for Todo In-Memory Python Console App implementation"
---

# Tasks: Todo In-Memory Python Console App

**Input**: Design documents from `/specs/001-todo-app/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests included as per project requirements and constitution.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- Paths shown below assume single project as per plan.md structure

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Create project structure per implementation plan
- [X] T002 Initialize Python project with pyproject.toml
- [X] T003 [P] Create directory structure (src/models/, src/services/, src/cli/, tests/unit/, tests/integration/)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T004 Create Task data model in src/models/task.py
- [X] T005 Create in-memory task storage in src/services/todo_service.py
- [X] T006 [P] Create basic CLI interface structure in src/cli/todo_app.py
- [X] T007 Create basic test infrastructure with pytest
- [X] T008 Implement unique ID generation for tasks

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Add New Tasks (Priority: P1) 🎯 MVP

**Goal**: Enable users to add tasks with title and description, which are stored in memory with unique IDs

**Independent Test**: The application allows users to add tasks with title and description, which are stored in memory and can be retrieved. This provides core value of capturing tasks.

### Implementation for User Story 1

- [X] T009 [P] [US1] Implement Task validation rules in src/models/task.py
- [X] T010 [US1] Implement add_task method in src/services/todo_service.py
- [X] T011 [US1] Implement add task CLI command in src/cli/todo_app.py
- [X] T012 [US1] Add input validation for title and description
- [X] T013 [US1] Add error handling for empty titles
- [X] T014 [US1] Test user story 1 functionality manually

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - View All Tasks (Priority: P1)

**Goal**: Enable users to see all tasks with their ID, title, description, and completion status in a clear, user-friendly format

**Independent Test**: The application displays all tasks with their ID, title, description, and completion status in a clear, user-friendly format. This provides value by showing all tasks at once.

### Implementation for User Story 2

- [X] T015 [P] [US2] Implement get_all_tasks method in src/services/todo_service.py
- [X] T016 [US2] Implement view tasks CLI command in src/cli/todo_app.py
- [X] T017 [US2] Format task display according to CLI contract
- [X] T018 [US2] Handle case when no tasks exist
- [X] T019 [US2] Test user story 2 functionality manually

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Mark Tasks Complete/Incomplete (Priority: P2)

**Goal**: Enable users to toggle the completion status of tasks by ID, which updates the status in memory

**Independent Test**: The application allows users to toggle the completion status of tasks by ID, which updates the status in memory. This provides value by tracking task completion.

### Implementation for User Story 3

- [X] T020 [P] [US3] Implement mark_task_complete method in src/services/todo_service.py
- [X] T021 [P] [US3] Implement mark_task_incomplete method in src/services/todo_service.py
- [X] T022 [US3] Implement toggle task status CLI command in src/cli/todo_app.py
- [X] T023 [US3] Add validation for task existence
- [X] T024 [US3] Test user story 3 functionality manually

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: User Story 4 - Update Task Details (Priority: P3)

**Goal**: Enable users to update the title or description of existing tasks by ID

**Independent Test**: The application allows users to update the title or description of existing tasks by ID. This provides value by allowing task refinement.

### Implementation for User Story 4

- [X] T025 [P] [US4] Implement update_task method in src/services/todo_service.py
- [X] T026 [US4] Implement update task CLI command in src/cli/todo_app.py
- [X] T027 [US4] Add validation for task existence and input formats
- [X] T028 [US4] Test user story 4 functionality manually

---

## Phase 7: User Story 5 - Delete Tasks (Priority: P3)

**Goal**: Enable users to remove tasks by ID from memory

**Independent Test**: The application allows users to remove tasks by ID from memory. This provides value by allowing list management.

### Implementation for User Story 5

- [X] T029 [P] [US5] Implement delete_task method in src/services/todo_service.py
- [X] T030 [US5] Implement delete task CLI command in src/cli/todo_app.py
- [X] T031 [US5] Add validation for task existence
- [X] T032 [US5] Handle case when all tasks are deleted
- [X] T033 [US5] Test user story 5 functionality manually

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T034 [P] Add comprehensive error handling across all CLI commands
- [X] T035 [P] Implement input sanitization for all user inputs
- [X] T036 [P] Add validation for task ID format and existence in all operations
- [X] T037 [P] Add proper error messages for all failure scenarios
- [X] T038 [P] Implement graceful handling of edge cases (empty titles, long descriptions, etc.)
- [X] T039 [P] Add help text and usage instructions to CLI
- [X] T040 [P] Create README.md with usage instructions
- [X] T041 [P] Create basic unit tests for all service methods
- [X] T042 [P] Create integration tests for CLI functionality
- [X] T043 Run quickstart validation

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should be independently testable
- **User Story 4 (P4)**: Can start after Foundational (Phase 2) - May integrate with previous stories but should be independently testable
- **User Story 5 (P5)**: Can start after Foundational (Phase 2) - May integrate with previous stories but should be independently testable

### Within Each User Story

- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all parallel tasks for User Story 1 together:
Task: "Implement Task validation rules in src/models/task.py"
Task: "Implement add_task method in src/services/todo_service.py"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Add User Story 4 → Test independently → Deploy/Demo
6. Add User Story 5 → Test independently → Deploy/Demo
7. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
   - Developer D: User Story 4
   - Developer E: User Story 5
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence