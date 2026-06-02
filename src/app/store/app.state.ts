import { ActionReducerMap } from '@ngrx/store';

import { AuthState, authReducer } from './auth.store';
import { ExpenseState, expenseReducer } from './expense.store';

export interface AppState {
  readonly auth: AuthState;
  readonly expense: ExpenseState;
}

export const reducers: ActionReducerMap<AppState> = {
  auth: authReducer,
  expense: expenseReducer
};
