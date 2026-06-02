import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { Store } from '@ngrx/store';

import { AuthService } from '../../core/services/auth.service';
import { logout } from '../../store/auth.store';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, MatButtonModule],
  template: `
    <div class="app-shell">
      <header class="app-container sticky top-0 z-20 pt-4 sm:pt-6">
        <div class="glass-panel rounded-[28px] px-4 py-4 sm:px-6">
          <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div class="flex items-start gap-4">
              <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-700 text-lg font-extrabold text-white shadow-lg shadow-teal-900/20">
                ET
              </div>
              <div>
                <p class="eyebrow">Expense Tracker</p>
                <h1 class="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">Fast entry, clean audit trail</h1>
                <p class="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                  Current scope includes registration with email verification and responsive draft expense entry.
                </p>
              </div>
            </div>

            <div class="flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
              <a
                mat-stroked-button
                color="primary"
                routerLink="/dashboard"
                class="!rounded-full !border-teal-700/20 !px-5 !py-2"
              >
                Dashboard
              </a>
              <a
                mat-flat-button
                color="primary"
                routerLink="/expenses/create"
                class="!rounded-full !px-5 !py-2"
              >
                Create Expense
              </a>
              <button
                mat-stroked-button
                type="button"
                (click)="onLogout()"
                class="!rounded-full !border-slate-300 !px-5 !py-2"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main class="app-container pb-10 pt-6 sm:pt-8">
        <router-outlet />
      </main>
    </div>
  `
})
export class AppLayoutComponent {
  public constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly store: Store
  ) {}

  public onLogout(): void {
    this.authService.logout();
    this.store.dispatch(logout());
    void this.router.navigate(['/login']);
  }
}
