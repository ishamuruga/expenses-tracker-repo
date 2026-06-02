import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { CurrencyDefinition, CurrencyPreference, ExchangeRate } from '../models/currency.models';
import { MOCK_CURRENCIES, MOCK_EXCHANGE_RATES, MOCK_CURRENCY_PREFERENCE } from './mock-seed';

const CURRENCIES_KEY = 'expense-tracker.currencies';
const EXCHANGE_RATES_KEY = 'expense-tracker.exchange-rates';
const CURRENCY_PREFERENCE_KEY = 'expense-tracker.currency-preference';

@Injectable({ providedIn: 'root' })
export class CurrencyService {
  public constructor() {
    this.seedCurrencyDataIfMissing();
  }

  public listSupportedCurrencies(): Observable<CurrencyDefinition[]> {
    return of(this.getCurrencies().filter((currency) => currency.isActive));
  }

  public isSupportedCurrency(code: string): boolean {
    return this.getCurrencies().some((currency) => currency.code === code && currency.isActive);
  }

  public getBaseCurrencyPreference(): CurrencyPreference {
    const raw = localStorage.getItem(CURRENCY_PREFERENCE_KEY);
    if (!raw) {
      return { ...MOCK_CURRENCY_PREFERENCE };
    }

    try {
      const parsed = JSON.parse(raw) as CurrencyPreference;
      if (!this.isSupportedCurrency(parsed.baseCurrency)) {
        return { ...MOCK_CURRENCY_PREFERENCE };
      }

      return parsed;
    } catch {
      return { ...MOCK_CURRENCY_PREFERENCE };
    }
  }

  public setBaseCurrencyPreference(baseCurrency: string): void {
    if (!this.isSupportedCurrency(baseCurrency)) {
      return;
    }

    localStorage.setItem(CURRENCY_PREFERENCE_KEY, JSON.stringify({ baseCurrency }));
  }

  public convertAmount(amount: number, sourceCurrency: string, targetCurrency: string): number | null {
    if (!Number.isFinite(amount) || amount <= 0) {
      return null;
    }

    if (!this.isSupportedCurrency(sourceCurrency) || !this.isSupportedCurrency(targetCurrency)) {
      return null;
    }

    if (sourceCurrency === targetCurrency) {
      return amount;
    }

    const rates = this.getExchangeRates();
    const sourceRate = rates.find(
      (rate) => rate.baseCurrency === 'USD' && rate.quoteCurrency === sourceCurrency
    )?.rate;
    const targetRate = rates.find(
      (rate) => rate.baseCurrency === 'USD' && rate.quoteCurrency === targetCurrency
    )?.rate;

    if (!sourceRate || !targetRate) {
      return null;
    }

    const usdAmount = amount / sourceRate;
    const converted = usdAmount * targetRate;
    return Number(converted.toFixed(2));
  }

  private seedCurrencyDataIfMissing(): void {
    if (!localStorage.getItem(CURRENCIES_KEY)) {
      localStorage.setItem(CURRENCIES_KEY, JSON.stringify(MOCK_CURRENCIES));
    }

    if (!localStorage.getItem(EXCHANGE_RATES_KEY)) {
      localStorage.setItem(EXCHANGE_RATES_KEY, JSON.stringify(MOCK_EXCHANGE_RATES));
    }

    if (!localStorage.getItem(CURRENCY_PREFERENCE_KEY)) {
      localStorage.setItem(CURRENCY_PREFERENCE_KEY, JSON.stringify(MOCK_CURRENCY_PREFERENCE));
    }
  }

  private getCurrencies(): CurrencyDefinition[] {
    const raw = localStorage.getItem(CURRENCIES_KEY);
    if (!raw) {
      return [];
    }

    try {
      return JSON.parse(raw) as CurrencyDefinition[];
    } catch {
      return [];
    }
  }

  private getExchangeRates(): ExchangeRate[] {
    const raw = localStorage.getItem(EXCHANGE_RATES_KEY);
    if (!raw) {
      return [];
    }

    try {
      return JSON.parse(raw) as ExchangeRate[];
    } catch {
      return [];
    }
  }
}