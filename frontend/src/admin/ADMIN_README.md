# Admin Dashboard Architecture

This directory (`src/admin`) contains the complete source code for the Focus Master Admin Panel. It is designed as a modular, secure, and "Dark Glass" themed operational console.

## 1. Directory Structure

- **`components/`**: Reusable UI atoms and layout blocks.
    - `layout/`: The main `AdminShell` and sidebar logic.
    - `guards/`: Security wrappers like `RequirePermission`.
    - `ui/`: Generic admin UI components (e.g., `ConfirmationModal`).
- **`config/`**: Static configuration.
    - `permissions.ts`: The source of truth for Roles and Permissions.
- **`context/`**: Global state providers.
    - `AdminAuthContext`: Handles RBAC logic (`can()`).
    - `AuditLogContext`: Stores immutable history of actions.
    - `LivePresenceContext`: Manages real-time session simulation.
- **`features/`**: Domain-specific logic groupings.
    - `users/`: User management (View & Action panels).
    - `audit/`: Audit log tables and logic.
    - `live/`: Real-time user tracking tables.
    - `health/`: System monitoring widgets.
- **`hooks/`**: Data fetching logic.
    - `useAdminMetrics`: Abstracted dashboard data fetching.
- **`pages/`**: Route-level page components.

## 2. Security & RBAC

We use a granular **Permission-Based Access Control** system, not just simple roles.

### Definitions (`config/permissions.ts`)
- **Permissions**: Atomic abilities (e.g., `MANAGE_USERS`, `VIEW_AUDIT_LOGS`).
- **Roles**: Groupings of permissions (e.g., `Admin`, `Moderator`).

### Usage
To protect a component or route, wrap it:

```tsx
<RequirePermission permission="MANAGE_SYSTEM">
  <DeleteButton />
</RequirePermission>
```

To conditionally render logic:

```tsx
const { can } = useAdminAuth();
if (can('VIEW_SENSITIVE_DATA')) { ... }
```

## 3. Read vs Write Boundaries

To prevent accidental data loss, we enforce strict UI boundaries:
1.  **View Panels**: Read-only data (e.g., `UserViewPanel`).
2.  **Action Panels**: Mutating actions (e.g., `UserActionPanel`).
3.  **Confirmation**: All destructive actions MUST use `ConfirmationModal`.

## 4. Audit Logging

Every destructive action is automatically logged.
- **Trigger**: calling `logAction(...)` from `AuditLogContext`.
- **View**: Visible in `/admin/audit`.

## 5. Theming

- **Theme**: Uses `hsl(var(--card) / 0.6)` for card backgrounds to match the main dashboard.
- **Scrollbars**: Custom thin scrollbars (`custom-scrollbar`) for all internal lists.
- **Sidebar**: Toggle logic matches main app (Top position, `PanelLeft` icons).
- **Icons**: Lucide React for everything. `Shield` is the admin badge.
