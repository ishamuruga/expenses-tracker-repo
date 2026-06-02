import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatButtonModule],
  template: `
    <section class="grid gap-6 lg:grid-cols-[1.35fr_0.95fr]">
      <mat-card class="overflow-hidden">
        <mat-card-content class="p-0">
          <div class="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div>
              <p class="eyebrow">MVP Workspace</p>
              <h2 class="section-title mt-4">Track essential expense intake without backend dependencies</h2>
              <p class="section-copy mt-4 max-w-2xl">
                This implementation is intentionally scoped to FR-01.1 and FR-02.1. Users can register,
                verify email, sign in with mock credentials, and create draft expenses with required fields.
              </p>

              <div class="mt-6 flex flex-col gap-3 sm:flex-row">
                <a mat-flat-button color="primary" routerLink="/expenses/create" class="!rounded-full !px-6 !py-3">
                  Open Draft Expense Form
                </a>
                <a mat-stroked-button color="primary" routerLink="/register" class="!rounded-full !px-6 !py-3">
                  Register New User
                </a>
              </div>
            </div>

            <div class="grid gap-3">
              <div class="metric-card">
                <p class="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Implemented FR</p>
                <p class="mt-3 text-3xl font-extrabold text-slate-900">2</p>
                <p class="mt-2 text-sm text-slate-600">Registration and create-expense workflows only.</p>
              </div>
              <div class="metric-card">
                <p class="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Entry mode</p>
                <p class="mt-3 text-xl font-bold text-slate-900">Draft-first</p>
                <p class="mt-2 text-sm text-slate-600">Expenses are saved in Draft to match the lifecycle design.</p>
              </div>
            </div>
          </div>
        </mat-card-content>
      </mat-card>

      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
        <mat-card>
          <mat-card-content class="space-y-3 p-6">
            <p class="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Included now</p>
            <h3 class="text-xl font-extrabold text-slate-900">Current feature slice</h3>
            <ul class="space-y-2 text-sm leading-6 text-slate-600">
              <li>Mock registration with six-digit verification token</li>
              <li>Mock login with protected route access</li>
              <li>Responsive expense creation form</li>
              <li>Category seed data and audit log persistence</li>
            </ul>
          </mat-card-content>
        </mat-card>

        <mat-card>
          <mat-card-content class="space-y-3 p-6">
            <p class="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Mock access</p>
            <h3 class="text-xl font-extrabold text-slate-900">Demo credentials</h3>
            <p class="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700">
              user1&#64;expensetracker.local / User&#64;123
            </p>
          </mat-card-content>
        </mat-card>
      </div>
    </section>
  `
})
export class DashboardComponent {}
