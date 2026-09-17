'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { dummyPengguna } from '@/lib/data/dummyData';
import { Pengguna, LoginData, RegisterData } from '@/types/pengguna.types';

interface AuthContextType {
  pengguna: Pengguna | null;
  token: string | null;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DUMMY_ACCOUNTS = [
  { email: 'demo@tokoelektronik.com', kata_sandi: 'demo123' },
  { email: 'user@example.com', kata_sandi: 'user123' },
];

// Helper function to clear cart state after successful login
function clearGuestCart() {
  try {
    // Clear localStorage cart data if exists
    localStorage.removeItem('guestCart');
    localStorage.removeItem('cart');
    localStorage.removeItem('keranjang');
    
    // Dispatch custom event to notify KeranjangContext
    window.dispatchEvent(new Event('cart-cleared-after-login'));
  } catch (error) {
    console.error('Error clearing guest cart:', error);
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [pengguna, setPengguna] = useState<Pengguna | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedPengguna = localStorage.getItem('pengguna');
    
    if (storedToken && storedPengguna) {
      setToken(storedToken);
      setPengguna(JSON.parse(storedPengguna));
    }
    setLoading(false);
  }, []);

  const login = async (data: LoginData) => {
    // Simulasi API call dengan delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const isValid = DUMMY_ACCOUNTS.some(
      (account) =>
        account.email.toLowerCase() === data.email.toLowerCase() &&
        account.kata_sandi === data.kata_sandi
    );

    if (!isValid) {
      throw new Error('Email atau password salah. Gunakan demo@tokoelektronik.com / demo123');
    }

    const newToken = 'dummy-token-' + Date.now();
    setToken(newToken);
    setPengguna(dummyPengguna);
    localStorage.setItem('token', newToken);
    localStorage.setItem('pengguna', JSON.stringify(dummyPengguna));
    
    // Clear guest cart immediately after successful login
    clearGuestCart();
  };

  const register = async (data: RegisterData) => {
    // Simulasi API call dengan delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newToken = 'dummy-token-' + Date.now();
    const newPengguna: Pengguna = {
      id: Date.now().toString(),
      nama: data.nama,
      email: data.email,
      nomor_telepon: data.nomor_telepon,
      role: 'PELANGGAN'
    };
    setToken(newToken);
    setPengguna(newPengguna);
    localStorage.setItem('token', newToken);
    localStorage.setItem('pengguna', JSON.stringify(newPengguna));
    
    // Clear guest cart immediately after successful registration
    clearGuestCart();
  };

  const logout = () => {
    setToken(null);
    setPengguna(null);
    localStorage.removeItem('token');
    localStorage.removeItem('pengguna');
  };

  return (
    <AuthContext.Provider value={{ pengguna, token, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
