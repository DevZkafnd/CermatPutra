'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { dummyKeranjang, addToDummyKeranjang, removeFromDummyKeranjang, updateDummyKeranjangJumlah, clearDummyKeranjang } from '@/lib/data/dummyData';
import { Keranjang } from '@/types/pesanan.types';

interface KeranjangContextType {
  keranjang: Keranjang | null;
  loading: boolean;
  addToCart: (data: { produk_id: string; jumlah: number }) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateJumlah: (itemId: string, jumlah: number) => Promise<void>;
  refreshKeranjang: () => Promise<void>;
  clearCart: () => void;
}

const KeranjangContext = createContext<KeranjangContextType | undefined>(undefined);

export function KeranjangProvider({ children }: { children: ReactNode }) {
  const [keranjang, setKeranjang] = useState<Keranjang | null>(null);
  const [loading, setLoading] = useState(false);

  const refreshKeranjang = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 300));
      setKeranjang({ ...dummyKeranjang });
    } catch (err) {
      console.error('Gagal memuat keranjang:', err);
    } finally {
      setLoading(false);
    }
  };

  const clearCart = () => {
    clearDummyKeranjang();
    setKeranjang({ ...dummyKeranjang });
  };

  const addToCart = async (data: { produk_id: string; jumlah: number }) => {
    try {
      addToDummyKeranjang(data.produk_id, data.jumlah);
      setKeranjang({ ...dummyKeranjang });
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (err) {
      console.error('Gagal menambah ke keranjang:', err);
      throw err;
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      removeFromDummyKeranjang(itemId);
      setKeranjang({ ...dummyKeranjang });
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (err) {
      console.error('Gagal menghapus dari keranjang:', err);
      throw err;
    }
  };

  const updateJumlah = async (itemId: string, jumlah: number) => {
    try {
      updateDummyKeranjangJumlah(itemId, jumlah);
      setKeranjang({ ...dummyKeranjang });
      await new Promise(resolve => setTimeout(resolve, 300));
    } catch (err) {
      console.error('Gagal update jumlah keranjang:', err);
      throw err;
    }
  };

  useEffect(() => {
    refreshKeranjang();
  }, []);

  // Listen for cart clear event from AuthContext
  useEffect(() => {
    const handleCartCleared = () => {
      clearCart();
    };

    window.addEventListener('cart-cleared-after-login', handleCartCleared);
    return () => window.removeEventListener('cart-cleared-after-login', handleCartCleared);
  }, []);

  return (
    <KeranjangContext.Provider value={{ keranjang, loading, addToCart, removeFromCart, updateJumlah, refreshKeranjang, clearCart }}>
      {children}
    </KeranjangContext.Provider>
  );
}

export function useKeranjang() {
  const context = useContext(KeranjangContext);
  if (context === undefined) {
    throw new Error('useKeranjang must be used within a KeranjangProvider');
  }
  return context;
}
