import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';

import { CreateExpenseRequest, Expense, Category } from '../models/expense.models';
import { AuditLogService } from './audit-log.service';
import { AuthService } from './auth.service';
import { CurrencyService } from './currency.service';
import { MOCK_CATEGORIES } from './mock-seed';

const EXPENSES_KEY = 'expense-tracker.expenses';
const CATEGORIES_KEY = 'expense-tracker.categories';

@Injectable({ providedIn: 'root' })
export class ExpenseService {
  public constructor(
    private readonly authService: AuthService,
    private readonly auditLogService: AuditLogService,
    private readonly currencyService: CurrencyService
  ) {
    this.seedCategoriesIfMissing();
  }

  public listCategories(): Observable<Category[]> {
    const categories = this.getCategories().filter((category) => category.isActive);
    return of(categories);
  }

  public createExpense(request: CreateExpenseRequest): Observable<Expense> {
    if (!request.expenseDate || !request.amount || !request.currency || !request.categoryId) {
      return throwError(() => new Error('Missing required fields: date, amount, currency, category.'));
    }

    if (request.amount <= 0) {
      return throwError(() => new Error('Amount must be positive.'));
    }

    if (!this.currencyService.isSupportedCurrency(request.currency)) {
      return throwError(() => new Error('Currency is invalid or unsupported.'));
    }

    const categoryExists = this.getCategories().some((category) => category.categoryId === request.categoryId && category.isActive);
    if (!categoryExists) {
      return throwError(() => new Error('Category is invalid or inactive.'));
    }

    const user = this.authService.getCurrentUser();
    if (!user) {
      return throwError(() => new Error('Active session is required to create an expense.'));
    }

    const now = new Date().toISOString();
    const expense: Expense = {
      expenseId: `exp-${crypto.randomUUID()}`,
      ownerUserId: user.userId,
      expenseDate: request.expenseDate,
      amount: request.amount,
      currency: request.currency,
      categoryId: request.categoryId,
      merchant: request.merchant?.trim() || undefined,
      paymentMethod: request.paymentMethod?.trim() || undefined,
      notes: request.notes?.trim() || undefined,
      attachmentUrl: request.attachmentUrl?.trim() || undefined,
      status: 'Draft',
      createdAt: now,
      updatedAt: now
    };

    const expenses = this.getExpenses();
    expenses.push(expense);
    localStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses));

    this.auditLogService.appendLog({
      eventType: 'BusinessAction',
      actorUserId: user.userId,
      actorRole: user.role,
      entityType: 'Expense',
      entityId: expense.expenseId,
      action: 'CreateExpenseDraft',
      metadata: `Expense created in Draft for amount ${expense.amount} ${expense.currency}`
    });

    return of(expense);
  }

  private seedCategoriesIfMissing(): void {
    const raw = localStorage.getItem(CATEGORIES_KEY);
    if (raw) {
      return;
    }

    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(MOCK_CATEGORIES));
  }

  private getExpenses(): Expense[] {
    const raw = localStorage.getItem(EXPENSES_KEY);
    if (!raw) {
      return [];
    }

    try {
      return JSON.parse(raw) as Expense[];
    } catch {
      return [];
    }
  }

  private getCategories(): Category[] {
    const raw = localStorage.getItem(CATEGORIES_KEY);
    if (!raw) {
      return [];
    }

    try {
      return JSON.parse(raw) as Category[];
    } catch {
      return [];
    }
  }
}