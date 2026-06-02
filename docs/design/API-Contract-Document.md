# ExpenseTracker - API Contract Document (json-server)

## 1. Document Control
- Document Name: API Contract Document
- Product: ExpenseTracker Web Application
- Version: 1.1
- Date: June 2, 2026
- API Style: REST-like mock APIs via json-server
- Related Reference: docs/ExpenseTracker-Product-Specification.md

## 2. API Context and Constraints
- This contract is for mock backend behavior only.
- No real backend business logic is present in this phase.
- Authorization and token handling are simulated for UI workflow validation.
- Reports and export APIs are intentionally excluded from this version.

## 3. Base Settings
- Base URL (example for local): /api
- Content Type: application/json
- Time Format: ISO 8601 in UTC
- Currency representation: ISO currency code with decimal amount

## 4. Common Request Headers
- Authorization: Bearer token (simulated)
- X-Correlation-Id: unique ID per request chain
- X-User-Role: optional role simulation header in mock setup

## 5. Common Response Pattern
Success responses include:
- resource data or collection
- metadata where applicable (pagination, timestamps)

Error responses include:
- errorCode
- message
- correlationId
- optional details array for validation issues

## 6. Resource Collections
- users
- sessions
- expenses
- categories
- currencies
- exchangeRates
- tags
- budgets
- notifications
- auditLogs
- settings

## 7. Authentication and Session Endpoints

### 7.1 Register User
- Method: POST
- Path: /auth/register
- Request fields:
  - email (required)
  - password (required)
  - fullName (required)
- Response:
  - userId
  - verificationStatus
  - createdAt
- Validation:
  - unique email
  - password policy check

### 7.2 Verify Email
- Method: POST
- Path: /auth/verify-email
- Request fields:
  - email
  - verificationToken
- Response:
  - verificationStatus
  - verifiedAt

### 7.3 Login
- Method: POST
- Path: /auth/login
- Request fields:
  - email
  - password
- Response:
  - accessToken (simulated)
  - tokenType
  - expiresAt
  - user profile summary

### 7.4 Logout
- Method: POST
- Path: /auth/logout
- Request fields:
  - sessionId
- Response:
  - status
  - loggedOutAt

### 7.5 Forgot Password
- Method: POST
- Path: /auth/forgot-password
- Request fields:
  - email
- Response:
  - status
  - requestAcceptedAt

### 7.6 Reset Password
- Method: POST
- Path: /auth/reset-password
- Request fields:
  - resetToken
  - newPassword
- Response:
  - status
  - updatedAt

## 8. User and Settings Endpoints

### 8.1 Get Current User Profile
- Method: GET
- Path: /users/me
- Response fields:
  - userId
  - fullName
  - email
  - role
  - locale
  - timezone
  - preferredCurrency

### 8.2 Update Current User Profile
- Method: PATCH
- Path: /users/me
- Request fields:
  - fullName (optional)
  - locale (optional)
  - timezone (optional)
  - preferredCurrency (optional)
- Response:
  - updated profile object

### 8.3 Get User Preferences
- Method: GET
- Path: /settings/preferences
- Response fields (applicable subset for current phase):
  - notificationPreferences
  - defaultExpenseFields
  - dashboardWidgetPreferences
  - baseCurrency

### 8.4 Update User Preferences
- Method: PATCH
- Path: /settings/preferences
- Request fields:
  - notificationPreferences
  - defaultExpenseFields
  - dashboardWidgetPreferences
  - baseCurrency (optional)

### 8.5 List Supported Currencies
- Method: GET
- Path: /currencies
- Response fields:
  - code
  - name
  - symbol
  - isActive

### 8.6 List Exchange Rates
- Method: GET
- Path: /exchangeRates
- Query parameters:
  - baseCurrency (optional, default USD for mock phase)
- Response fields:
  - baseCurrency
  - quoteCurrency
  - rate
  - updatedAt

## 9. Expense Endpoints

### 9.1 Create Expense
- Method: POST
- Path: /expenses
- Request fields:
  - expenseDate (required)
  - amount (required)
  - currency (required)
  - categoryId (required)
  - merchant (optional)
  - paymentMethod (optional)
  - notes (optional)
  - attachmentUrl (optional)
  - tags (optional list)
  - status (default Draft)
- Validation notes:
  - currency must be an active value from /currencies
- Response:
  - created expense object with identifiers and audit timestamps

### 9.2 List Expenses
- Method: GET
- Path: /expenses
- Query parameters:
  - page
  - pageSize
  - sortBy
  - sortOrder
  - fromDate
  - toDate
  - minAmount
  - maxAmount
  - categoryId
  - tag
  - status
  - search
- Response:
  - list of expense items
  - pagination metadata

### 9.3 Get Expense by ID
- Method: GET
- Path: /expenses/{expenseId}

### 9.4 Update Expense
- Method: PATCH
- Path: /expenses/{expenseId}
- Rule:
  - Editable while status is Draft.
  - Restricted fields after submission.

### 9.5 Delete Expense
- Method: DELETE
- Path: /expenses/{expenseId}
- Rule:
  - Allowed for Draft expenses by owner/admin policy.

### 9.6 Submit Expense
- Method: POST
- Path: /expenses/{expenseId}/submit
- Response:
  - status set to Submitted
  - submittedAt timestamp

### 9.7 Approve Expense
- Method: POST
- Path: /expenses/{expenseId}/approve
- Access:
  - Manager/Admin only
- Response:
  - status set to Approved
  - approvedBy and approvedAt

### 9.8 Reject Expense
- Method: POST
- Path: /expenses/{expenseId}/reject
- Access:
  - Manager/Admin only
- Request fields:
  - rejectionReason
- Response:
  - status set to Rejected
  - rejectedBy and rejectedAt

### 9.9 Mark Reimbursed (Optional workflow state)
- Method: POST
- Path: /expenses/{expenseId}/reimburse
- Response:
  - status set to Reimbursed
  - reimbursedAt

## 10. Category and Tag Endpoints

### 10.1 List Categories
- Method: GET
- Path: /categories

### 10.2 Create Category
- Method: POST
- Path: /categories
- Request fields:
  - name
  - description (optional)
  - isActive

### 10.3 Update Category
- Method: PATCH
- Path: /categories/{categoryId}

### 10.4 Delete/Deactivate Category
- Method: PATCH
- Path: /categories/{categoryId}
- Rule:
  - Prefer deactivation over hard delete.

### 10.5 List Tags
- Method: GET
- Path: /tags

### 10.6 Create Tag
- Method: POST
- Path: /tags

## 11. Budget Endpoints

### 11.1 List Budgets
- Method: GET
- Path: /budgets
- Query parameters:
  - month
  - year
  - categoryId (optional)

### 11.2 Create Budget
- Method: POST
- Path: /budgets
- Request fields:
  - month
  - year
  - totalBudgetAmount
  - categoryBudgets (optional list)
  - thresholdRules

### 11.3 Update Budget
- Method: PATCH
- Path: /budgets/{budgetId}

### 11.4 Budget Consumption Summary
- Method: GET
- Path: /budgets/{budgetId}/consumption
- Response fields:
  - totalSpent
  - remainingBudget
  - percentageUsed
  - thresholdBreaches

## 12. Dashboard Endpoints

### 12.1 Dashboard Summary
- Method: GET
- Path: /dashboard/summary
- Query parameters:
  - fromDate
  - toDate

### 12.2 Spending Trend
- Method: GET
- Path: /dashboard/trends
- Query parameters:
  - interval (daily/weekly/monthly)
  - fromDate
  - toDate

### 12.3 Category Distribution
- Method: GET
- Path: /dashboard/category-distribution

### 12.4 Top Merchants
- Method: GET
- Path: /dashboard/top-merchants

## 13. Notification Endpoints

### 13.1 List Notifications
- Method: GET
- Path: /notifications
- Query parameters:
  - status
  - category
  - page
  - pageSize

### 13.2 Mark Notification Read
- Method: PATCH
- Path: /notifications/{notificationId}
- Request fields:
  - isRead

### 13.3 Update Notification Preferences
- Method: PATCH
- Path: /settings/notifications

## 14. Audit and Logging Endpoints

### 14.1 Create Audit Log Entry
- Method: POST
- Path: /auditLogs
- Request fields:
  - eventType
  - actorUserId
  - actorRole
  - entityType
  - entityId
  - action
  - beforeSnapshotRef (optional)
  - afterSnapshotRef (optional)
  - correlationId
  - timestamp

### 14.2 List Audit Logs
- Method: GET
- Path: /auditLogs
- Query parameters:
  - eventType
  - actorUserId
  - fromDate
  - toDate
  - page
  - pageSize

## 15. Authorization Matrix (Endpoint-Level)
- Public:
  - /auth/register
  - /auth/login
  - /auth/forgot-password
  - /auth/reset-password
  - /auth/verify-email
- User:
  - own profile/settings
  - own expenses and dashboard views
- Manager:
  - user privileges plus approve/reject actions and team visibility where configured
- Admin:
  - full access including categories, policy settings, and audit review

## 16. Validation and Business Rules
- Expense amount must be greater than zero.
- Expense date cannot be invalid future date (policy configurable).
- Category must be active for new expenses.
- Expense currency must be active in supported currencies.
- Base currency preference must be an active supported currency.
- Status transitions must follow defined workflow.
- Budget thresholds must be between 1 and 100.

## 17. Non-Contracted APIs in This Phase
Explicitly excluded:
- Report generation endpoints.
- Export endpoints (CSV/PDF).
- Bank import and OCR endpoints.
- External ERP/accounting integration endpoints.

## 18. Versioning and Evolution Strategy
- Current version label: v1-mock.
- Maintain backward compatibility for core expense endpoints while introducing real backend.
- Reserve future route namespace for production service transition without breaking UI consumers.
