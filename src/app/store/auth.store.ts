import { createAction, createFeatureSelector, createReducer, createSelector, on, props } from '@ngrx/store';

import { AuthResult } from '../core/models/auth.models';

export interface AuthState {
  readonly isAuthenticated: boolean;
  readonly currentUserName: string | null;
  readonly currentUserRole: string | null;
  readonly error: string | null;
}

export const initialAuthState: AuthState = {
  isAuthenticated: false,
  currentUserName: null,
  currentUserRole: null,
  error: null
};

export const loginSuccess = createAction('[Auth] Login Success', props<{ payload: AuthResult }>());
export const loginFailure = createAction('[Auth] Login Failure', props<{ error: string }>());
export const logout = createAction('[Auth] Logout');

export const authReducer = createReducer(
  initialAuthState,
  on(loginSuccess, (state, { payload }): AuthState => ({
    ...state,
    isAuthenticated: true,
    currentUserName: payload.user.fullName,
    currentUserRole: payload.user.role,
    error: null
  })),
  on(loginFailure, (state, { error }): AuthState => ({
    ...state,
    isAuthenticated: false,
    currentUserName: null,
    currentUserRole: null,
    error
  })),
  on(logout, (): AuthState => ({ ...initialAuthState }))
);

const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectIsAuthenticated = createSelector(selectAuthState, (state) => state.isAuthenticated);
export const selectCurrentUserName = createSelector(selectAuthState, (state) => state.currentUserName);
export const selectAuthError = createSelector(selectAuthState, (state) => state.error);