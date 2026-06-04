// src/contexts/AppContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { storage } from '@utils/storage';

interface AppContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>(storage.getTheme());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    storage.setTheme(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <AppContext.Provider value={{ theme, toggleTheme, isLoading, setIsLoading }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};