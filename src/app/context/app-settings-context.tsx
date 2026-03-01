import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Currency {
  code: string;
  symbol: string;
  name: string;
}

export const CURRENCIES: Currency[] = [
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'INR', symbol: '', name: 'Indian Rupee' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'JPY', symbol: '', name: 'Japanese Yen' },
  { code: 'ZAR', symbol: 'R', name: 'South African Rand' },
];

export interface AppSettings {
  currency: Currency;
  libraryFinesEnabled: boolean;
  setCurrency: (currency: Currency) => void;
  setLibraryFinesEnabled: (enabled: boolean) => void;
}

const AppSettingsContext = createContext<AppSettings | undefined>(undefined);

const STORAGE_KEY = 'setu_app_settings';

interface StoredSettings {
  currencyCode: string;
  libraryFinesEnabled: boolean;
}

function loadSettings(): StoredSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as StoredSettings;
  } catch {
    // ignore
  }
  return { currencyCode: 'GBP', libraryFinesEnabled: true };
}

export function AppSettingsProvider({ children }: { children: ReactNode }) {
  const stored = loadSettings();
  const defaultCurrency = CURRENCIES.find(c => c.code === stored.currencyCode) ?? CURRENCIES[0];

  const [currency, setCurrencyState] = useState<Currency>(defaultCurrency);
  const [libraryFinesEnabled, setLibraryFinesEnabledState] = useState<boolean>(stored.libraryFinesEnabled);

  useEffect(() => {
    const toStore: StoredSettings = {
      currencyCode: currency.code,
      libraryFinesEnabled,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
  }, [currency, libraryFinesEnabled]);

  const setCurrency = (c: Currency) => setCurrencyState(c);
  const setLibraryFinesEnabled = (enabled: boolean) => setLibraryFinesEnabledState(enabled);

  return (
    <AppSettingsContext.Provider value={{ currency, libraryFinesEnabled, setCurrency, setLibraryFinesEnabled }}>
      {children}
    </AppSettingsContext.Provider>
  );
}

export function useAppSettings(): AppSettings {
  const ctx = useContext(AppSettingsContext);
  if (!ctx) throw new Error('useAppSettings must be used within AppSettingsProvider');
  return ctx;
}
