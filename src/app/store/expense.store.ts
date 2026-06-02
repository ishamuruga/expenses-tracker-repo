import { createAction, createFeatureSelector, createReducer, createSelector, on, props } from '@ngrx/store';

import { Expense } from '../core/models/expense.models';

export interface ExpenseState {
  readonly items: readonly Expense[];
  readonly creating: boolean;
  readonly error: string | null;
}

export const initialExpenseState: ExpenseState = {
  items: [],
  creating: false,
  error: null
};

export const createExpenseStarted = createAction('[Expense] Create Started');
export const createExpenseSuccess = createAction('[Expense] Create Success', props<{ expense: Expense }>());
export const createExpenseFailure = createAction('[Expense] Create Failure', props<{ error: string }>());

export const expenseReducer = createReducer(
  initialExpenseState,
  on(createExpenseStarted, (state): ExpenseState => ({ ...state, creating: true, error: null })),
  on(createExpenseSuccess, (state, { expense }): ExpenseState => ({
    ...state,
    creating: false,
    items: [...state.items, expense],
    error: null
  })),
  on(createExpenseFailure, (state, { error }): ExpenseState => ({
    ...state,
    creating: false,
    error
  }))
);

const selectExpenseState = createFeatureSelector<ExpenseState>('expense');

export const selectCreatingExpense = createSelector(selectExpenseState, (state) => state.creating);
export const selectExpenseError = createSelector(selectExpenseState, (state) => state.error);