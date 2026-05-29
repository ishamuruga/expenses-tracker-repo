# ExpenseTracker - Coding Standards Guidelines (TypeScript and Angular)

## 1. Document Control
- Document Name: Coding Standards Guidelines
- Product: ExpenseTracker Web Application
- Version: 1.0
- Date: May 29, 2026
- Related References:
  - docs/ExpenseTracker-Product-Specification.md
  - docs/design/Architecture-Document.md
  - docs/design/API-Contract-Document.md
  - docs/design/Application-Entity-Model-Document.md
  - docs/design/UI-UX-Design-Document.md

## 2. Purpose and Scope
This guideline defines mandatory coding standards for the ExpenseTracker Angular codebase.
It applies to:
- TypeScript source code
- Angular modules/components/services/guards/interceptors
- NgRx store/effects/selectors/actions/reducers
- RxJS usage patterns
- Angular Material and Tailwind-based UI implementation

## 3. Core Engineering Principles
- Readability over cleverness.
- Predictable behavior over implicit behavior.
- Strong typing and compile-time safety first.
- Single responsibility per file/class/function.
- Keep business logic out of templates.
- Favor pure functions and immutable state transformations.
- Security, accessibility, and performance are not optional.

## 4. Baseline Tooling Rules
- TypeScript strict mode must be enabled.
- ESLint rules must pass with zero errors.
- Prettier formatting must be applied consistently.
- Build must run without warnings caused by project code.
- No use of disabled lint rules without documented rationale.

## 5. TypeScript Standards

### 5.1 Typing and Type Safety
- Do not use any, except in explicitly documented boundary cases.
- Prefer unknown over any when type is not yet known.
- Always define explicit return types for exported functions and methods.
- Use union types and discriminated unions for state/event modeling.
- Use readonly for immutable inputs and state structures where applicable.

### 5.2 Interfaces, Types, and Enums
- Use interface for object contracts that may be extended.
- Use type for composition, unions, and mapped types.
- Prefer string literal unions over numeric enums for UI/domain states.
- Use const assertions for static configuration maps.

### 5.3 Naming Conventions
- Classes: PascalCase.
- Interfaces and type aliases: PascalCase.
- Variables/functions/methods: camelCase.
- Constants: UPPER_SNAKE_CASE only for true global constants.
- File names: kebab-case with Angular suffix conventions.

### 5.4 Function Design
- Keep functions focused and short.
- Avoid more than three levels of nesting.
- Prefer early return for guard conditions.
- Avoid hidden side effects in utility functions.

### 5.5 Error Handling
- Throw typed or well-structured errors, not raw strings.
- Convert HTTP and runtime errors into user-safe error messages.
- Never swallow errors silently.
- Log operational context with correlation ID when available.

### 5.6 Imports and Dependency Boundaries
- Group imports in this order:
  - Angular and framework imports
  - Third-party imports
  - App-level absolute imports
  - Relative imports
- Do not use deep imports into feature internals from other features.
- Prevent circular dependencies between modules/features.

## 6. Angular Standards

### 6.1 Project and Module Structure
- Organize by feature domain, not by technical type alone.
- Each feature owns its routes, components, state, and services.
- Shared module should contain only reusable generic assets.
- Core module should host singleton services and global interceptors.

### 6.2 Component Design
- Use standalone or module-based approach consistently across the project.
- Keep container and presentational responsibilities separated.
- Prefer OnPush change detection for feature components.
- Avoid heavy data transformation in components; move to selectors or facade layer.

### 6.3 Template Rules
- Keep templates declarative and simple.
- Avoid calling complex methods directly in templates.
- Use async pipe for observable subscriptions in templates.
- Avoid duplicate conditional logic; centralize view state in component/view model.

### 6.4 Forms and Validation
- Prefer reactive forms for complex flows.
- Keep validation rules centralized and reusable.
- Display validation messages consistently.
- Never trust client-side validation alone for business policy integrity.

### 6.5 Routing and Guards
- Route modules must be lazy loaded for large feature areas.
- Protect authenticated routes via auth guard.
- Protect restricted routes via role guard.
- Avoid role checks scattered across components when route-level guards can enforce them.

### 6.6 Services and HTTP
- Services should encapsulate HTTP and mapping logic.
- Do not call HttpClient directly from components.
- Use interceptors for auth headers, correlation IDs, and common error handling.
- Keep endpoint paths centralized in API configuration constants.

## 7. RxJS Standards

### 7.1 Observable Usage
- Prefer observable streams end-to-end over converting to promises.
- Avoid manual subscribe in components when async pipe is feasible.
- When manual subscribe is required, ensure deterministic teardown.

### 7.2 Operator Practices
- Prefer switchMap for request-canceling flows like search.
- Prefer concatMap for ordered command execution.
- Prefer exhaustMap for login/submit actions that must not run concurrently.
- Use catchError in effect/service boundaries, not scattered deeply.

### 7.3 Memory and Lifecycle
- Ensure all component-level subscriptions are cleaned up.
- Avoid nested subscriptions; compose streams with operators.
- Keep streams cold/hot behavior explicit and documented when non-trivial.

## 8. NgRx Standards

### 8.1 Store Design
- Define feature keys consistently.
- Normalize collection state using NgRx Entity where suitable.
- Keep store serializable and deterministic.
- Never store derived view data that can be computed via selectors.

### 8.2 Actions
- Action names should follow clear event semantics.
- Keep action payload minimal and typed.
- Separate command intent from success/failure outcomes.

### 8.3 Reducers
- Reducers must be pure and immutable.
- No side effects in reducer logic.
- Keep reducer branches simple and predictable.

### 8.4 Effects
- Effects handle side effects, IO, and orchestration.
- Each effect should have a single focused responsibility.
- Effects must map backend errors into typed failure actions.
- Do not perform UI rendering logic inside effects.

### 8.5 Selectors
- Prefer small composable selectors.
- Use memoized selectors for expensive projections.
- Keep selectors pure and synchronous.

### 8.6 Facade Pattern
- Use feature facades to shield components from store internals.
- Expose view-ready observables from facades.
- Components should dispatch through facades, not directly through store in complex flows.

## 9. UI Implementation Standards (Material and Tailwind)
- Use Angular Material for accessible interaction primitives.
- Use Tailwind for layout, spacing, responsive utilities, and minor visual refinements.
- Avoid excessive style overrides that fight Material defaults.
- Maintain consistent spacing and typography scales across pages.
- Ensure responsive behavior is validated at mobile/tablet/desktop breakpoints.

## 10. Logging and Audit Coding Rules
- Log key business and security events consistently with event type taxonomy.
- Include actor, entity, action, timestamp, and correlation ID where available.
- Never log sensitive payloads in clear text (passwords, reset tokens, secrets).
- Distinguish between audit logs and operational debug logs.

## 11. Security Coding Rules
- Treat all external data as untrusted input.
- Sanitize or encode values bound into dynamic UI contexts.
- Enforce role checks at route and feature action boundaries.
- Avoid storing long-lived sensitive session values in insecure browser storage patterns.
- Do not embed secrets or environment-sensitive values in source files.

## 12. Accessibility Coding Rules
- All interactive elements must be keyboard accessible.
- Ensure labels and aria attributes are present for form controls and icon-only buttons.
- Maintain semantic HTML structure and heading hierarchy.
- Ensure color contrast and focus indicators meet accessibility expectations.

## 13. Testing Standards
- Unit tests required for:
  - Reducers/selectors
  - Effects with success and failure paths
  - Services with HTTP interaction behavior
  - Complex components and validators
- Add integration tests for major user flows:
  - Login
  - Expense create/edit/submit
  - Approval actions
  - Budget threshold alert behavior
- Bug fixes should include regression tests when applicable.

## 14. Performance Standards
- Use OnPush and trackBy for list-heavy screens.
- Avoid repeated expensive computations in templates.
- Debounce high-frequency inputs (search/filter fields).
- Paginate or virtualize large expense lists.

## 15. Documentation and Commenting Rules
- Prefer self-explanatory code over verbose comments.
- Add comments only when intent is non-obvious.
- Public interfaces and complex business rules should include concise documentation.
- Keep architectural decisions documented in design artifacts when standards evolve.

## 16. Git and Pull Request Standards
- Use focused commits by concern.
- Pull requests must include:
  - Scope summary
  - Screens or behavior impact
  - Test evidence
  - Risks and rollback notes if needed
- Do not mix refactors with feature behavior changes unless justified.

## 17. Definition of Done (Code Quality Gate)
A change is complete only when:
- Type checks pass.
- Lint checks pass.
- Tests pass for impacted areas.
- Accessibility expectations are validated for changed UI.
- Security and logging rules in this guideline are satisfied.
- Design docs are updated if behavior/architecture changed.

## 18. Governance and Updates
- This guideline is mandatory for all contributors.
- Any exception must be approved and documented in the relevant pull request.
- Guideline revisions should be versioned with change summary and effective date.
