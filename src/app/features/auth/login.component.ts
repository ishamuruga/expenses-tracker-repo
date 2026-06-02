import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Store } from '@ngrx/store';

import { AuthService } from '../../core/services/auth.service';
import { loginFailure, loginSuccess } from '../../store/auth.store';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  template: `
    <section class="app-container py-6 sm:py-10">
      <div class="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-stretch">
        <div class="page-card relative overflow-hidden">
          <div class="absolute right-0 top-0 h-40 w-40 translate-x-8 -translate-y-8 rounded-full bg-amber-300/30 blur-3xl"></div>
          <div class="absolute bottom-0 left-0 h-48 w-48 -translate-x-10 translate-y-10 rounded-full bg-teal-500/20 blur-3xl"></div>

          <div class="relative p-5 sm:p-8">
            <p class="eyebrow">Secure Access</p>
            <h1 class="section-title mt-4">Sign in to continue your expense workflow</h1>
            <p class="section-copy mt-4 max-w-xl">
              The current build uses mock authentication, protected routes, and browser-backed session persistence
              so you can validate the FR-01.1 and FR-02.1 journeys without a backend.
            </p>

            <div class="mt-8 grid gap-4 sm:grid-cols-2">
              <div class="metric-card">
                <p class="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Flow status</p>
                <p class="mt-3 text-xl font-extrabold text-slate-900">Registration + verification</p>
                <p class="mt-2 text-sm text-slate-600">Users must verify email before login is allowed.</p>
              </div>
              <div class="metric-card">
                <p class="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Mock account</p>
                <p class="mt-3 break-all text-base font-bold text-slate-900">user1&#64;expensetracker.local</p>
                <p class="mt-2 text-sm text-slate-600">Password: User&#64;123</p>
              </div>
            </div>
          </div>
        </div>

        <mat-card class="overflow-hidden">
          <mat-card-content class="p-6 sm:p-8">
            <div class="mb-6">
              <p class="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Welcome back</p>
              <h2 class="mt-3 text-3xl font-extrabold tracking-tight text-slate-900">Sign In</h2>
              <p class="mt-2 text-sm leading-6 text-slate-600">Use your verified account to access expense entry.</p>
            </div>

            <form class="space-y-4" [formGroup]="form" (ngSubmit)="onSubmit()">
              <mat-form-field appearance="outline" class="w-full">
                <mat-label>Email</mat-label>
                <input matInput type="email" formControlName="email" />
              </mat-form-field>

              <mat-form-field appearance="outline" class="w-full">
                <mat-label>Password</mat-label>
                <input matInput type="password" formControlName="password" />
              </mat-form-field>

              <div *ngIf="errorMessage" class="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {{ errorMessage }}
              </div>

              <button
                mat-flat-button
                color="primary"
                class="!mt-2 !w-full !rounded-full !px-6 !py-3"
                type="submit"
                [disabled]="form.invalid"
              >
                Login
              </button>
            </form>

            <div class="mt-6 rounded-3xl bg-slate-100/80 p-4">
              <p class="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Need an account</p>
              <p class="mt-2 text-sm leading-6 text-slate-600">
                New users can complete the mock registration and verification flow before signing in.
              </p>
              <a routerLink="/register" class="mt-4 inline-flex text-sm font-semibold text-teal-700">
                Register and verify email
              </a>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </section>
  `
})
export class LoginComponent {
  public readonly form = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  public errorMessage = '';

  public constructor(
    private readonly formBuilder: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly store: Store
  ) {}

  public onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    const { email, password } = this.form.getRawValue();
    this.authService.login(email, password).subscribe({
      next: (result) => {
        this.store.dispatch(loginSuccess({ payload: result }));
        this.errorMessage = '';
        void this.router.navigate(['/expenses/create']);
      },
      error: (error: Error) => {
        this.errorMessage = error.message;
        this.store.dispatch(loginFailure({ error: error.message }));
      }
    });
  }
}
