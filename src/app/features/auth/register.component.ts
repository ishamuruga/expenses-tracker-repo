import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
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
      <div class="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div class="page-card p-6 sm:p-8">
          <p class="eyebrow">FR-01.1</p>
          <h1 class="section-title mt-4">Create an account and verify email in one guided flow</h1>
          <p class="section-copy mt-4">
            This screen mirrors the product requirement for user registration with email verification. Since this is a mock-backed build, the verification token is shown directly after registration.
          </p>

          <div class="mt-8 space-y-4">
            <div class="metric-card">
              <p class="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Step 1</p>
              <p class="mt-3 text-lg font-extrabold text-slate-900">Submit registration details</p>
              <p class="mt-2 text-sm leading-6 text-slate-600">A unique email is required and password length is validated.</p>
            </div>
            <div class="metric-card">
              <p class="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Step 2</p>
              <p class="mt-3 text-lg font-extrabold text-slate-900">Enter the verification token</p>
              <p class="mt-2 text-sm leading-6 text-slate-600">Once verified, the user is allowed to sign in from the login screen.</p>
            </div>
          </div>
        </div>

        <mat-card>
          <mat-card-content class="space-y-8 p-6 sm:p-8">
            <div>
              <p class="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Registration</p>
              <h2 class="mt-3 text-3xl font-extrabold tracking-tight text-slate-900">User Registration</h2>
            </div>

            <form class="grid gap-4 md:grid-cols-2" [formGroup]="registerForm" (ngSubmit)="onRegister()">
              <mat-form-field appearance="outline" class="md:col-span-2">
                <mat-label>Full Name</mat-label>
                <input matInput formControlName="fullName" />
              </mat-form-field>

              <mat-form-field appearance="outline" class="md:col-span-2">
                <mat-label>Email</mat-label>
                <input matInput type="email" formControlName="email" />
              </mat-form-field>

              <mat-form-field appearance="outline" class="md:col-span-2">
                <mat-label>Password</mat-label>
                <input matInput type="password" formControlName="password" />
              </mat-form-field>

              <div class="md:col-span-2">
                <button mat-flat-button color="primary" type="submit" class="!rounded-full !px-6 !py-3" [disabled]="registerForm.invalid">
                  Register
                </button>
              </div>
            </form>

            <div *ngIf="verificationToken" class="rounded-3xl border border-amber-300 bg-amber-50 px-5 py-4 text-sm text-amber-950">
              <p class="font-semibold">Mock verification token generated</p>
              <p class="mt-2 break-all text-base font-extrabold tracking-[0.2em]">{{ verificationToken }}</p>
            </div>

            <div class="border-t border-slate-200 pt-8">
              <p class="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Verification</p>
              <form class="mt-4 grid gap-4 md:grid-cols-2" [formGroup]="verifyForm" (ngSubmit)="onVerify()">
                <mat-form-field appearance="outline" class="md:col-span-2">
                  <mat-label>Verification Email</mat-label>
                  <input matInput type="email" formControlName="email" />
                </mat-form-field>

                <mat-form-field appearance="outline" class="md:col-span-2">
                  <mat-label>Verification Token</mat-label>
                  <input matInput formControlName="token" />
                </mat-form-field>

                <div class="md:col-span-2">
                  <button mat-stroked-button color="primary" type="submit" class="!rounded-full !px-6 !py-3" [disabled]="verifyForm.invalid">
                    Verify Email
                  </button>
                </div>
              </form>
            </div>

            <div *ngIf="message" class="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {{ message }}
            </div>
            <div *ngIf="errorMessage" class="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {{ errorMessage }}
            </div>

            <p class="text-sm text-slate-600">
              Already verified?
              <a routerLink="/login" class="font-semibold text-teal-700">Go to login</a>
            </p>
          </mat-card-content>
        </mat-card>
      </div>
    </section>
  `
})
export class RegisterComponent {
  public readonly registerForm = this.formBuilder.nonNullable.group({
    fullName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });

  public readonly verifyForm = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    token: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
  });

  public verificationToken = '';
  public message = '';
  public errorMessage = '';

  public constructor(
    private readonly formBuilder: FormBuilder,
    private readonly authService: AuthService
  ) {}

  public onRegister(): void {
    if (this.registerForm.invalid) {
      return;
    }

    this.errorMessage = '';
    this.message = '';

    const payload = this.registerForm.getRawValue();
    this.authService.register(payload).subscribe({
      next: (result) => {
        this.verificationToken = result.verificationToken;
        this.verifyForm.patchValue({ email: payload.email });
        this.message = 'Registration successful. Verify email to complete FR-01.1 flow.';
      },
      error: (error: Error) => {
        this.errorMessage = error.message;
      }
    });
  }

  public onVerify(): void {
    if (this.verifyForm.invalid) {
      return;
    }

    this.errorMessage = '';

    const { email, token } = this.verifyForm.getRawValue();
    this.authService.verifyEmail(email, token).subscribe({
      next: () => {
        this.message = 'Email verification completed. You can now sign in.';
      },
      error: (error: Error) => {
        this.errorMessage = error.message;
      }
    });
  }
}
