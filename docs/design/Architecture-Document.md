# ExpenseTracker - Architecture Document

## 1. Document Control
- Document Name: Architecture Document
- Product: ExpenseTracker Web Application
- Version: 1.0
- Date: May 29, 2026
- Related Reference: docs/ExpenseTracker-Product-Specification.md

## 2. Architecture Goals
- Deliver a responsive, maintainable single-page web application.
- Support secure authentication and role-aware authorization in the UI.
- Provide robust logging and audit event visibility in a frontend-only setup.
- Keep architecture extensible for a future real backend without major UI rewrite.

## 3. Technology Stack
- Frontend Framework: Angular 17
- Runtime/Tooling: Node.js 22.x
- Styling and Responsiveness: TailwindCSS
- Component System: Angular Material (Material UI)
- State Management: NgRx (Store, Effects, Entity, Selectors)
- Reactive Programming: RxJS
- Mock Backend: json-server
- Optional Local Persistence: browser localStorage/sessionStorage for auth/session simulation and user preferences

## 4. Scope Alignment
In scope:
- Authentication and role access (simulated using mock endpoints and token/session model).
- Expense lifecycle management.
- Categories, tags, budgets, dashboard, filters, notifications, profile/settings.
- Standard logging and auditability (frontend event logging with mock persistence).

Out of scope for this release:
- Reports and export (CSV/PDF).
- External banking integrations, OCR, ERP integration, reimbursement payout.
- Native mobile apps, offline sync conflict resolution, advanced AI fraud detection.

## 5. High-Level Architecture Style
- Architecture Pattern: Layered frontend architecture with feature-based modularization.
- Data Flow Model: Unidirectional state flow via NgRx.
- Integration Style: REST-style HTTP calls to json-server resources.
- UI Composition: Smart container components and presentational components.

## 6. Logical Architecture

### 6.1 Presentation Layer
Responsibilities:
- Angular route-driven screens.
- Angular Material based reusable UI components.
- Tailwind utility classes for responsive layout and spacing.

Key modules:
- Auth module
- Dashboard module
- Expenses module
- Budgets module
- Categories/Tags module
- Notifications module
- Profile/Settings module
- Admin module
- Shared module (layout, pipes, directives, reusable controls)

### 6.2 State Layer (NgRx)
Responsibilities:
- Centralized app state and feature state management.
- Side effects for API interactions and async workflows.
- Memoized selectors for performant rendering.

Recommended slices:
- authState
- expenseState
- categoryState
- budgetState
- dashboardState
- notificationState
- userPreferenceState
- auditLogState
- uiState (loading, errors, filter panels, dialogs)

### 6.3 Service and Integration Layer
Responsibilities:
- HTTP communication with json-server.
- Request/response mapping to domain view models.
- Error mapping and retry policies where applicable.
- Correlation ID propagation for logging.

Service groups:
- AuthService
- ExpenseService
- CategoryService
- BudgetService
- NotificationService
- UserService
- AuditLogService

### 6.4 Mock Data Layer
Responsibilities:
- json-server data source with domain collections.
- Simulated latency and basic failure scenarios for testing UX behavior.
- Mock role model and token/session simulation.

## 7. Deployment View (Current State)
- Client: Angular SPA hosted as static assets.
- Mock API: json-server process on local/dev environment.
- No dedicated backend business service in current phase.

Environment profiles:
- local: Angular dev server + local json-server.
- test/demo: static frontend build + hosted mock API.

## 8. Component and Module Architecture

### 8.1 Core Module
- App bootstrap and global providers.
- HTTP interceptors.
- Global error handler.
- Route guard wiring.

### 8.2 Feature Modules
- Self-contained by business domain.
- Each feature has routes, components, facades, selectors, effects, services, and model definitions.

### 8.3 Shared and UI Modules
- Shared form controls and validators.
- Reusable table/filter components.
- Theming and common layout primitives.

## 9. Routing and Navigation Architecture
- Public routes: login, register, forgot-password, reset-password.
- Protected routes: dashboard, expenses, budgets, categories, notifications, profile.
- Role-protected routes: admin, manager approvals.
- Route guards:
  - Auth guard to enforce active session.
  - Role guard to enforce access policy.
- Lazy loading for major feature routes to optimize initial load.

## 10. Authentication and Authorization Architecture
- Authentication mode: token-based session simulation through mock API.
- Session persistence: short-lived session representation in browser storage with expiration metadata.
- Authorization model: RBAC (User, Manager, Admin).
- UI behavior:
  - Hide non-authorized actions and navigation entries.
  - Block direct route access using guards.
- Security controls (frontend scope):
  - Auto logout on session expiry.
  - Reset flow with token validity checks.
  - Sensitive data masking in UI logs.

## 11. Logging and Auditability Architecture
- Logging categories:
  - Authentication logs
  - Authorization and admin-change logs
  - Business action logs (expense lifecycle events)
  - Operational logs (API errors/perf warnings)
  - Security logs (failed access attempts)
- Correlation strategy:
  - Generate request correlation ID per user action chain.
- Log sink strategy (current phase):
  - In-memory and json-server persisted logs for audit review.
- Retention strategy:
  - Configurable retention policy in mock environment for realistic behavior.

## 12. Error Handling and Resilience
- Error classes:
  - Validation errors
  - Authorization/authentication errors
  - Not found and conflict errors
  - Generic service faults
- UX strategy:
  - Inline field validation messages.
  - Action-level toasts for successful/failed operations.
  - Global fallback error page for non-recoverable states.
- Resilience:
  - Retry only for transient read operations.
  - No silent failures for create/update/delete actions.

## 13. Performance and Scalability Considerations
- OnPush change detection for heavy list views.
- Selector memoization for dashboard and filtered grids.
- Virtual scroll/pagination for large expense sets.
- Debounced search and filter operations.
- Batched mock requests where useful for summary cards.

## 14. Security Considerations (Frontend and Mock Context)
- Input validation at form and state transition layers.
- Route and action-level authorization checks.
- Avoid storing sensitive values in plain text logs.
- Session timeout and inactivity handling.
- CSP and secure headers to be configured at hosting layer.

## 15. Observability and Monitoring (Current Phase)
- Track key client-side metrics:
  - API response times
  - Error rate by endpoint
  - Login failure count
  - Navigation latency
- Provide admin-facing log viewer in application scope.

## 16. Future Backend Readiness
Design decisions to minimize rework when backend is introduced:
- Keep API contracts stable and versioned.
- Keep domain models backend-agnostic.
- Encapsulate all HTTP access behind services/facades.
- Keep auth logic abstracted from storage strategy.

## 17. Architecture Decisions Summary
- Use Angular 17 feature modules and lazy loading for maintainability and performance.
- Use NgRx for predictable state and audit-friendly transitions.
- Use RxJS for async orchestration and cancellation-safe UX flows.
- Use Material + Tailwind together for speed, consistency, and responsive flexibility.
- Use json-server as a temporary backend substitute, while preserving backend-ready boundaries.

## 18. Non-Goals
- No production-grade identity provider integration in this phase.
- No production-grade distributed logging pipeline in this phase.
- No report/export subsystem in this phase.
