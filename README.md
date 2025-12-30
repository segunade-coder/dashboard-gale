# Project Admin Dashboard (Next.js)

## Overview

This project is a small admin dashboard built with **Next.js (App
Router)** and **TypeScript** to manage hierarchical data structures:
**Projects → Tasks → Subtasks**.\
It demonstrates nested state management, cascading updates, and basic
CRUD operations using local state (no backend).

The focus of this exercise is **code structure, state management, and
handling complexity**, rather than visual polish.

------------------------------------------------------------------------

## Architecture

The application follows a simple and intentional architecture:

-   **App Router (`app/page.tsx`)**\
    Used as the main dashboard entry point to keep routing minimal and
    focused.
-   **Component-based UI structure**\
    Projects, tasks, and subtasks are rendered as nested components to
    reflect the data hierarchy clearly.
-   **Single global store**\
    All project-related state and logic live in one Zustand store to
    keep business logic centralized and easy to reason about.

This structure makes the data flow predictable and avoids unnecessary
abstraction for a small-to-medium sized application.

------------------------------------------------------------------------

## State Management Choice

I chose **Zustand** for state management because:

-   It provides a **minimal API** with very low boilerplate.
-   State updates are **explicit and easy to trace**, especially for
    nested data.
-   It avoids the complexity of reducers or excessive context providers.
-   It scales well for local-only state without introducing unnecessary
    dependencies.

All CRUD operations and cascading status logic are handled inside the
store.\
This keeps UI components mostly declarative and focused on rendering.

------------------------------------------------------------------------

## Cascading Status Logic

Status updates are designed to cascade upward:

-   **Subtask updates** can affect the parent task's status.
-   **Task updates** can affect the project's status.
-   A parent is marked:
    -   `completed` when all children are completed
    -   `in-progress` when at least one child is active
    -   `pending` when empty or not yet started

This logic is centralized in the store to ensure consistency and avoid
duplicated checks across components.

------------------------------------------------------------------------

## Performance Considerations

Although the dataset is small, the following considerations were
applied:

-   **Immutable updates** using array mapping to ensure predictable
    re-renders.
-   **Scoped updates** to only the affected project/task/subtask.
-   Zustand's selector-based updates prevent unnecessary re-renders of
    unrelated components.
-   UI components are kept lightweight and free of heavy computations.

For larger datasets, memoization and list virtualization would be
considered.

------------------------------------------------------------------------

## Styling Approach

-   Basic styling was implemented using **shadcn/ui** and utility-first
    CSS.
-   Status indicators use color coding to clearly differentiate:
    -   Pending
    -   In Progress
    -   Completed

The styling is intentionally simple to keep the focus on logic and
structure.

------------------------------------------------------------------------

## What I Would Improve With More Time

With additional time, I would:

-   Add **inline editing** for titles and descriptions.
-   Introduce **optimistic UI patterns** for better UX.
-   Split the store into smaller slices if the domain grows.
-   Add **unit tests** for cascading status logic.
-   Implement accessibility improvements and keyboard navigation.
-   Persist state using local storage or a backend API.

------------------------------------------------------------------------

## Conclusion

This project demonstrates a clear approach to handling nested data,
state updates, and UI interaction in a modern React/Next.js
application.\
The emphasis is on maintainability, clarity, and correctness rather than
feature overload.
