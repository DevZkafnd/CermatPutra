'use client';

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

interface WishlistContextType {
  wishlistIds: string[];
  totalWishlist: number;
  isWishlisted: (produkId: string) => boolean;
  toggleWishlist: (produkId: string) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const STORAGE_KEY = 'cermat-putra-wishlist';

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);

  useEffect(() => {
    const savedWishlist = window.localStorage.getItem(STORAGE_KEY);
    if (savedWishlist) {
      try {
        setWishlistIds(JSON.parse(savedWishlist));
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlistIds));
  }, [wishlistIds]);

  const value = useMemo<WishlistContextType>(() => ({
    wishlistIds,
    totalWishlist: wishlistIds.length,
    isWishlisted: (produkId: string) => wishlistIds.includes(produkId),
    toggleWishlist: (produkId: string) => {
      setWishlistIds((current) =>
        current.includes(produkId)
          ? current.filter((id) => id !== produkId)
          : [...current, produkId]
      );
    },
  }), [wishlistIds]);

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }

  return context;
}
