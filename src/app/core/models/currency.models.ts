export interface CurrencyDefinition {
  code: string;
  name: string;
  symbol: string;
  isActive: boolean;
}

export interface ExchangeRate {
  baseCurrency: string;
  quoteCurrency: string;
  rate: number;
  updatedAt: string;
}

export interface CurrencyPreference {
  baseCurrency: string;
}