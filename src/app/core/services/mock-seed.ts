import { AppUser } from '../models/auth.models';
import { CurrencyDefinition, CurrencyPreference, ExchangeRate } from '../models/currency.models';
import { Category } from '../models/expense.models';

const now = new Date().toISOString();

export const MOCK_USERS: readonly AppUser[] = [
  {
    userId: 'u-admin-001',
    fullName: 'Admin User',
    email: 'admin@expensetracker.local',
    passwordHash: 'Admin@123',
    role: 'Admin',
    isEmailVerified: true,
    status: 'Active',
    createdAt: now,
    updatedAt: now,
    lastLoginAt: now
  },
  {
    userId: 'u-user-001',
    fullName: 'Alex Johnson',
    email: 'user1@expensetracker.local',
    passwordHash: 'User@123',
    role: 'User',
    isEmailVerified: true,
    status: 'Active',
    createdAt: now,
    updatedAt: now,
    lastLoginAt: now
  }
];

export const MOCK_CATEGORIES: readonly Category[] = [
  {
    categoryId: 'cat-001',
    name: 'Travel',
    description: 'Transport and commute costs',
    isSystemDefault: true,
    isActive: true,
    createdByUserId: 'u-admin-001',
    createdAt: now,
    updatedAt: now
  },
  {
    categoryId: 'cat-002',
    name: 'Meals',
    description: 'Food and dining expenses',
    isSystemDefault: true,
    isActive: true,
    createdByUserId: 'u-admin-001',
    createdAt: now,
    updatedAt: now
  },
  {
    categoryId: 'cat-003',
    name: 'Utilities',
    description: 'Internet, phone, electricity and utility bills',
    isSystemDefault: true,
    isActive: true,
    createdByUserId: 'u-admin-001',
    createdAt: now,
    updatedAt: now
  }
];

export const MOCK_CURRENCIES: readonly CurrencyDefinition[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$', isActive: true },
  { code: 'EUR', name: 'Euro', symbol: 'EUR', isActive: true },
  { code: 'INR', name: 'Indian Rupee', symbol: 'INR', isActive: true },
  { code: 'GBP', name: 'British Pound', symbol: 'GBP', isActive: true },
  { code: 'JPY', name: 'Japanese Yen', symbol: 'JPY', isActive: true }
];

// Rates are quoted as USD -> quoteCurrency.
export const MOCK_EXCHANGE_RATES: readonly ExchangeRate[] = [
  { baseCurrency: 'USD', quoteCurrency: 'USD', rate: 1, updatedAt: now },
  { baseCurrency: 'USD', quoteCurrency: 'EUR', rate: 0.92, updatedAt: now },
  { baseCurrency: 'USD', quoteCurrency: 'INR', rate: 83.4, updatedAt: now },
  { baseCurrency: 'USD', quoteCurrency: 'GBP', rate: 0.78, updatedAt: now },
  { baseCurrency: 'USD', quoteCurrency: 'JPY', rate: 157.3, updatedAt: now }
];

export const MOCK_CURRENCY_PREFERENCE: CurrencyPreference = {
  baseCurrency: 'USD'
};