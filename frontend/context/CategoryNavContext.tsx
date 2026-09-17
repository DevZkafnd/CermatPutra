'use client';

import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

interface CategoryNavContextType {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const CategoryNavContext = createContext<CategoryNavContextType | undefined>(undefined);

export function CategoryNavProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const value = useMemo<CategoryNavContextType>(
    () => ({
      isOpen,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
    }),
    [isOpen]
  );

  return <CategoryNavContext.Provider value={value}>{children}</CategoryNavContext.Provider>;
}

export function useCategoryNav() {
  const ctx = useContext(CategoryNavContext);
  if (!ctx) {
    throw new Error('useCategoryNav must be used within a CategoryNavProvider');
  }
  return ctx;
}

