# ExpenseTracker - Application Entity Model Document

## 1. Document Control
- Document Name: Application Entity Model Document
- Product: ExpenseTracker Web Application
- Version: 1.0
- Date: May 29, 2026
- Related Reference: docs/ExpenseTracker-Product-Specification.md

## 2. Modeling Objectives
- Define core business entities for the current product scope.
- Establish field definitions, constraints, and lifecycle rules.
- Clarify relationships for frontend state design and API contracts.
- Ensure model readiness for transition from json-server mock to real backend.

## 3. Domain Overview
The ExpenseTracker domain centers around user-managed expenses, budget controls, categorization, workflow status transitions, and auditable user/system actions.

Primary bounded contexts:
- Identity and Access
- Expense Management
- Budgeting
- Notifications
- Audit and Logging
- User Preferences

## 4. Entity Catalogue

### 4.1 User
Purpose:
- Represents an authenticated application identity.

Key attributes:
- userId (unique identifier)
- fullName
- email
- passwordHash reference (mock-safe representation)
- role (User, Manager, Admin)
- isEmailVerified
- status (Active, Suspended)
- createdAt
- updatedAt
- lastLoginAt

Rules:
- Email must be unique.
- Role controls authorization footprint.

### 4.2 Session
Purpose:
- Represents a signed-in session context.

Key attributes:
- sessionId
- userId
- accessToken (simulated)
- issuedAt
- expiresAt
- isActive
- deviceInfo (optional)

Rules:
- One or more active sessions may be policy-defined.
- Expired session cannot access protected resources.

### 4.3 Expense
Purpose:
- Core financial transaction recorded by user.

Key attributes:
- expenseId
- ownerUserId
- expenseDate
- amount
- currency
- categoryId
- merchant (optional)
- paymentMethod (optional)
- notes (optional)
- attachmentUrl (optional)
- status (Draft, Submitted, Approved, Rejected, Reimbursed)
- submittedAt (optional)
- approvedAt (optional)
- approvedByUserId (optional)
- rejectedAt (optional)
- rejectedByUserId (optional)
- rejectionReason (optional)
- reimbursedAt (optional)
- createdAt
- updatedAt

Rules:
- amount must be positive.
- categoryId must refer to active category.
- Edit/delete restrictions depend on status and role.

### 4.4 Category
Purpose:
- Classifies expenses into budget and analytics groups.

Key attributes:
- categoryId
- name
- description (optional)
- isSystemDefault
- isActive
- createdByUserId
- createdAt
- updatedAt

Rules:
- Category name uniqueness can be scoped by tenant or system.
- Deactivation preferred over hard delete.

### 4.5 Tag
Purpose:
- Adds flexible cross-cutting labels for filtering and grouping.

Key attributes:
- tagId
- name
- colorCode (optional)
- createdByUserId
- createdAt
- updatedAt

Rules:
- Tag names should be unique by owner/scope.

### 4.6 ExpenseTag (Associative Entity)
Purpose:
- Many-to-many relation between Expense and Tag.

Key attributes:
- expenseId
- tagId
- assignedAt
- assignedByUserId

Rules:
- Composite uniqueness on expenseId + tagId.

### 4.7 Budget
Purpose:
- Defines spending limits for a period.

Key attributes:
- budgetId
- ownerScope (user/team/global)
- ownerRefId
- month
- year
- totalBudgetAmount
- currency
- thresholdRules reference
- createdByUserId
- createdAt
- updatedAt

Rules:
- One active budget definition per scope and period.

### 4.8 CategoryBudget
Purpose:
- Category-level allocations within a budget period.

Key attributes:
- categoryBudgetId
- budgetId
- categoryId
- allocatedAmount
- thresholdRules override (optional)

Rules:
- Sum of category allocations may be constrained by total budget policy.

### 4.9 ThresholdRule
Purpose:
- Defines budget alert percentages.

Key attributes:
- thresholdRuleId
- ownerType (Budget or CategoryBudget)
- ownerId
- warningPercent
- criticalPercent
- isActive

Rules:
- Percent values must be in valid range.
- warningPercent must be less than or equal to criticalPercent.

### 4.10 Notification
Purpose:
- Represents user-visible event alerts.

Key attributes:
- notificationId
- recipientUserId
- type (workflow, budget, security, system)
- title
- message
- priority
- isRead
- createdAt
- readAt (optional)
- sourceEntityType (optional)
- sourceEntityId (optional)

Rules:
- Read state transitions must record readAt.

### 4.11 NotificationPreference
Purpose:
- Stores per-user notification channel and event settings.

Key attributes:
- preferenceId
- userId
- eventType
- inAppEnabled
- emailEnabled
- updatedAt

Rules:
- Unique setting per userId + eventType.

### 4.12 AuditLog
Purpose:
- Captures traceable activity for security and business auditability.

Key attributes:
- auditLogId
- eventType
- actorUserId
- actorRole
- entityType
- entityId
- action
- correlationId
- eventTimestamp
- metadata summary

Rules:
- Sensitive data must not be stored in clear text.
- CorrelationId required for traceability.

### 4.13 AppSetting
Purpose:
- Stores configurable application-level options.

Key attributes:
- settingId
- key
- value
- scope (global/role/user)
- scopeRefId (optional)
- updatedByUserId
- updatedAt

## 5. Relationship Model (Cardinality)
- User 1..* Session
- User 1..* Expense (owner)
- User 1..* Category (created by)
- Expense *..1 Category
- Expense *..* Tag (via ExpenseTag)
- User 1..* Budget (by scope policy)
- Budget 1..* CategoryBudget
- Category 1..* CategoryBudget
- User 1..* Notification
- User 1..* NotificationPreference
- User 1..* AuditLog (actor)

## 6. Lifecycle and State Models

### 6.1 Expense Status Lifecycle
- Draft
- Submitted
- Approved or Rejected
- Reimbursed (optional terminal)

Allowed transitions:
- Draft to Submitted
- Submitted to Approved
- Submitted to Rejected
- Approved to Reimbursed

### 6.2 Notification State Lifecycle
- Unread
- Read

### 6.3 Session Lifecycle
- Issued
- Active
- Expired or Revoked

## 7. Data Ownership and Multi-Role Access Rules
- End User:
  - Own profile, preferences, and own expense records.
- Manager:
  - Approval actions and visibility based on assigned policy scope.
- Admin:
  - Full management for users, categories, settings, and audit review.

## 8. Validation Rules Summary
- Required fields enforced on create for mandatory entities.
- Referential integrity on all foreign-key-like references.
- Immutable audit event timestamp once written.
- Soft delete/deactivation preferred for master entities.

## 9. Storage and Persistence Notes (Mock Phase)
- json-server stores entities as resource collections.
- IDs should be stable and unique for deterministic UI behavior.
- Timestamps should be generated consistently in UTC format.

## 10. Future Evolution Readiness
- Keep identifiers globally unique.
- Keep event taxonomy in AuditLog stable for analytics continuity.
- Prepare model extension points for reports/export when phase scope changes.
