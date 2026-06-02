export type ExpenseStatus = 'Draft' | 'Submitted' | 'Approved' | 'Rejected' | 'Reimbursed';

export interface Category {
  categoryId: string;
  name: string;
  description?: string;
  isSystemDefault: boolean;
  isActive: boolean;
  createdByUserId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Expense {
  expenseId: string;
  ownerUserId: string;
  expenseDate: string;
  amount: number;
  currency: string;
  categoryId: string;
  merchant?: string;
  paymentMethod?: string;
  notes?: string;
  attachmentUrl?: string;
  status: ExpenseStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateExpenseRequest {
  expenseDate: string;
  amount: number;
  currency: string;
  categoryId: string;
  merchant?: string;
  paymentMethod?: string;
  notes?: string;
  attachmentUrl?: string;
}