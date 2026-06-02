import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { startWith } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Store } from '@ngrx/store';

import { CurrencyDefinition } from '../../core/models/currency.models';
import { Category } from '../../core/models/expense.models';
import { CurrencyService } from '../../core/services/currency.service';
import { ExpenseService } from '../../core/services/expense.service';
import { createExpenseFailure, createExpenseStarted, createExpenseSuccess } from '../../store/expense.store';

@Component({
  selector: 'app-expense-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  template: `
    <section class="grid gap-6 xl:grid-cols-[0.88fr_1.12fr]">
      <div class="space-y-6">
        <div class="page-card p-6 sm:p-8">
          <p class="eyebrow">FR-02.1</p>
          <h1 class="section-title mt-4">Create a draft expense with the required core fields</h1>
          <p class="section-copy mt-4">
            This form keeps the mandatory payload aligned with the API and entity documents: date, amount,
            currency, and category. Optional fields remain available without blocking fast entry.
          </p>
        </div>

        <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
          <div class="metric-card">
            <p class="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Mandatory fields</p>
            <p class="mt-3 text-lg font-extrabold text-slate-900">4 required inputs</p>
            <p class="mt-2 text-sm text-slate-600">Date, amount, currency, and category must be present.</p>
          </div>
          <div class="metric-card">
            <p class="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Initial status</p>
            <p class="mt-3 text-lg font-extrabold text-slate-900">Draft</p>
            <p class="mt-2 text-sm text-slate-600">New records are persisted in Draft state for later actions.</p>
          </div>
        </div>
      </div>

      <mat-card>
        <mat-card-content class="p-6 sm:p-8">
          <div class="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p class="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Expense Form</p>
              <h2 class="mt-3 text-3xl font-extrabold tracking-tight text-slate-900">Create Expense</h2>
            </div>
            <p class="rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
              Draft Save
            </p>
          </div>

          <form class="grid gap-6" [formGroup]="form" (ngSubmit)="onCreateExpense()">
            <div class="grid gap-4 md:grid-cols-2">
              <mat-form-field appearance="outline">
                <mat-label>Expense Date</mat-label>
                <input matInput type="date" formControlName="expenseDate" />
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Amount</mat-label>
                <input matInput type="number" formControlName="amount" min="0.01" step="0.01" />
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Currency</mat-label>
                <mat-select formControlName="currency">
                  <mat-option *ngFor="let currency of currencies" [value]="currency.code">
                    {{ currency.code }} - {{ currency.name }}
                  </mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Category</mat-label>
                <mat-select formControlName="categoryId">
                  <mat-option *ngFor="let category of categories" [value]="category.categoryId">{{ category.name }}</mat-option>
                </mat-select>
              </mat-form-field>
            </div>

            <div class="rounded-[24px] bg-teal-50/70 p-4 sm:p-5">
              <p class="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Multi-currency preview</p>
              <div class="mt-4 grid gap-4 md:grid-cols-[1fr_1.2fr] md:items-end">
                <mat-form-field appearance="outline">
                  <mat-label>Base Currency</mat-label>
                  <mat-select [value]="baseCurrency" (selectionChange)="onBaseCurrencyChange($event.value)">
                    <mat-option *ngFor="let currency of currencies" [value]="currency.code">
                      {{ currency.code }} - {{ currency.name }}
                    </mat-option>
                  </mat-select>
                </mat-form-field>

                <p class="rounded-2xl border border-teal-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700">
                  {{ conversionLabel || 'Enter amount and choose currencies to see conversion.' }}
                </p>
              </div>
            </div>

            <div class="rounded-[24px] bg-slate-50 p-4 sm:p-5">
              <p class="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Optional details</p>
              <div class="mt-4 grid gap-4 md:grid-cols-2">
                <mat-form-field appearance="outline">
                  <mat-label>Merchant</mat-label>
                  <input matInput formControlName="merchant" />
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Payment Method</mat-label>
                  <input matInput formControlName="paymentMethod" />
                </mat-form-field>

                <mat-form-field appearance="outline" class="md:col-span-2">
                  <mat-label>Notes</mat-label>
                  <textarea matInput rows="3" formControlName="notes"></textarea>
                </mat-form-field>

                <mat-form-field appearance="outline" class="md:col-span-2">
                  <mat-label>Receipt URL</mat-label>
                  <input matInput formControlName="attachmentUrl" />
                </mat-form-field>
              </div>
            </div>

            <div *ngIf="errorMessage" class="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {{ errorMessage }}
            </div>
            <div *ngIf="successMessage" class="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {{ successMessage }}
            </div>

            <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p class="text-sm leading-6 text-slate-600">Expenses are stored locally in this mock build and logged as business actions.</p>
              <button mat-flat-button color="primary" type="submit" class="!rounded-full !px-6 !py-3" [disabled]="form.invalid">
                Save As Draft
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </section>
  `
})
export class ExpenseCreateComponent implements OnInit {
  public readonly form = this.formBuilder.nonNullable.group({
    expenseDate: ['', [Validators.required]],
    amount: [0, [Validators.required, Validators.min(0.01)]],
    currency: ['USD', [Validators.required]],
    categoryId: ['', [Validators.required]],
    merchant: [''],
    paymentMethod: [''],
    notes: [''],
    attachmentUrl: ['']
  });

  public currencies: readonly CurrencyDefinition[] = [];
  public baseCurrency = 'USD';
  public conversionLabel = '';
  public categories: readonly Category[] = [];
  public errorMessage = '';
  public successMessage = '';

  public constructor(
    private readonly formBuilder: FormBuilder,
    private readonly currencyService: CurrencyService,
    private readonly expenseService: ExpenseService,
    private readonly store: Store
  ) {}

  public ngOnInit(): void {
    const preference = this.currencyService.getBaseCurrencyPreference();
    this.baseCurrency = preference.baseCurrency;

    this.currencyService.listSupportedCurrencies().subscribe((currencies) => {
      this.currencies = currencies;
      if (!currencies.some((currency) => currency.code === this.form.controls.currency.value)) {
        const fallback = currencies[0]?.code ?? 'USD';
        this.form.patchValue({ currency: fallback });
      }

      if (!currencies.some((currency) => currency.code === this.baseCurrency)) {
        this.baseCurrency = currencies[0]?.code ?? 'USD';
        this.currencyService.setBaseCurrencyPreference(this.baseCurrency);
      }

      this.updateConversionLabel();
    });

    this.expenseService.listCategories().subscribe((categories) => {
      this.categories = categories;
    });

    this.form.controls.amount.valueChanges
      .pipe(startWith(this.form.controls.amount.value))
      .subscribe(() => this.updateConversionLabel());

    this.form.controls.currency.valueChanges
      .pipe(startWith(this.form.controls.currency.value))
      .subscribe(() => this.updateConversionLabel());
  }

  public onBaseCurrencyChange(currencyCode: string): void {
    this.baseCurrency = currencyCode;
    this.currencyService.setBaseCurrencyPreference(currencyCode);
    this.updateConversionLabel();
  }

  public onCreateExpense(): void {
    if (this.form.invalid) {
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';
    this.store.dispatch(createExpenseStarted());

    const payload = this.form.getRawValue();
    this.expenseService.createExpense(payload).subscribe({
      next: (expense) => {
        this.store.dispatch(createExpenseSuccess({ expense }));
        this.successMessage = `Expense ${expense.expenseId} created in Draft status.`;
        this.form.patchValue({
          merchant: '',
          paymentMethod: '',
          notes: '',
          attachmentUrl: ''
        });
        this.updateConversionLabel();
      },
      error: (error: Error) => {
        this.errorMessage = error.message;
        this.store.dispatch(createExpenseFailure({ error: error.message }));
      }
    });
  }

  private updateConversionLabel(): void {
    const amount = this.form.controls.amount.value;
    const sourceCurrency = this.form.controls.currency.value;
    const converted = this.currencyService.convertAmount(amount, sourceCurrency, this.baseCurrency);

    if (converted === null) {
      this.conversionLabel = '';
      return;
    }

    this.conversionLabel = `${amount.toFixed(2)} ${sourceCurrency} = ${converted.toFixed(2)} ${this.baseCurrency}`;
  }
}
