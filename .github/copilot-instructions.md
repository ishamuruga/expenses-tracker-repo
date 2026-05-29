# Copilot Instructions - ExpenseTracker

## Project Context
This workspace contains the ExpenseTracker web application planning artifacts.
All implementation guidance must align with the product specification and design documents listed below.

## Source-of-Truth Documents
- Product Specification: docs/ExpenseTracker-Product-Specification.md
- Architecture: docs/design/Architecture-Document.md
- API Contract: docs/design/API-Contract-Document.md
- Application Entity Model: docs/design/Application-Entity-Model-Document.md
- UI/UX Design: docs/design/UI-UX-Design-Document.md
- Coding Standards: docs/design/Coding-Standards-Guidelines-Angular-Typescript.md

## Mandatory Technology Stack
- Angular 17
- Node.js 22.x
- TailwindCSS (responsive styling)
- Angular Material (UI components)
- NgRx (state management)
- RxJS (reactive programming)
- json-server for mocked backend services
- No real backend implementation in current phase

## Scope Guardrails
- Follow in-scope features from the Product Specification.
- Treat Reports and Export as out-of-scope in the current phase.
- Do not introduce backend-only capabilities unless explicitly requested in a future scope change.

## Implementation Rules for Copilot
- Before proposing or generating any code, verify alignment with all source-of-truth documents.
- Keep architecture and module boundaries consistent with the Architecture Document.
- Keep API usage and payloads consistent with the API Contract Document.
- Keep data models and relationships consistent with the Application Entity Model Document.
- Keep user flows and responsive behavior consistent with the UI/UX Design Document.
- Enforce all TypeScript and Angular conventions from the Coding Standards document.

## Quality and Compliance
- Favor strict typing, readable code, and maintainable feature structure.
- Ensure role-based access behavior and logging/auditability expectations are preserved.
- Preserve accessibility and responsiveness expectations across all UI changes.

## Conflict Resolution
If there is a conflict between documents, apply this precedence:
1. docs/ExpenseTracker-Product-Specification.md
2. docs/design/Architecture-Document.md
3. docs/design/API-Contract-Document.md
4. docs/design/Application-Entity-Model-Document.md
5. docs/design/UI-UX-Design-Document.md
6. docs/design/Coding-Standards-Guidelines-Angular-Typescript.md

If ambiguity remains, request clarification before implementing.
