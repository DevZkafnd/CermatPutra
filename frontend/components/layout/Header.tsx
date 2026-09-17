'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import Image from 'next/image';
import { useKeranjang } from '@/context/KeranjangContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import MobileSidebarDrawer from './MobileSidebarDrawer';

export default function Header() {
  const router = useRouter();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [keyword, setKeyword] = useState('');
  const { keranjang } = useKeranjang();
  const { totalWishlist } = useWishlist();
  const { token, pengguna } = useAuth();

  const totalKeranjang = useMemo(
    () => keranjang?.item.reduce((acc, item) => acc + item.jumlah, 0) || 0,
    [keranjang]
  );

  const handlePesanan = (event?: React.MouseEvent) => {
    if (event) event.preventDefault();

    if (!token) {
      router.push('/login?redirect=/pesanan');
      return;
    }

    router.push('/pesanan');
  };

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    router.push(`/produk${keyword ? `?cari=${encodeURIComponent(keyword)}` : ''}`);
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-primary-100 bg-white shadow-sm">
        {/* Top Bar - Desktop Only */}
        <div className="hidden lg:block bg-neutral-950 text-white">
          <div className="container mx-auto flex items-center justify-between px-4 py-3 text-xs md:text-sm">
            <p className="font-medium tracking-wide text-gray-400">
              Promo elektronik pilihan, hemat lebih banyak di Cermat Putra
            </p>
            <div className="flex items-center gap-6 md:gap-8">
              <a 
                href="/pesanan" 
                onClick={handlePesanan} 
                className="inline-flex items-center gap-2 font-bold text-base text-white transition hover:text-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-400 rounded px-3 py-2"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2m0 0V3a2 2 0 00-2-2h-2a2 2 0 00-2 2v2z" />
                </svg>
                <span className="hidden sm:inline">Pesanan</span>
              </a>
              {!token ? (
                <>
                  <Link 
                    href="/login" 
                    className="inline-flex items-center gap-2 font-bold text-base text-white transition hover:text-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-400 rounded px-3 py-2"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v2a2 2 0 01-2 2H7a2 2 0 01-2-2v-2" />
                    </svg>
                    <span className="hidden sm:inline">Login</span>
                  </Link>
                  <Link 
                    href="/register" 
                    className="inline-flex items-center gap-2 font-bold text-base text-white transition hover:text-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-400 rounded px-3 py-2"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    <span className="hidden sm:inline">Register</span>
                  </Link>
                </>
              ) : (
                <Link 
                  href="/profil" 
                  className="inline-flex items-center gap-2 font-bold text-base text-white transition hover:text-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-400 rounded px-3 py-2"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="hidden sm:inline">{pengguna?.nama || 'Profil'}</span>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Main Navbar */}
        <div className="container mx-auto px-4 py-4">
          {/* Desktop Layout */}
          <div className="hidden lg:flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center justify-between gap-4">
              <Link href="/" className="flex items-center space-x-3">
                <Image
                  src="/assets/img/logo_cp.png"
                  alt="Logo Cermat Putra"
                  width={52}
                  height={52}
                  className="h-11 w-auto"
                />
                <div>
                  <p className="text-xl font-extrabold uppercase tracking-wide text-neutral-950">
                    Cermat <span className="text-primary-600">Putra</span>
                  </p>
                  <p className="text-xs uppercase tracking-[0.25em] text-gray-500">
                    Electronic Store
                  </p>
                </div>
              </Link>
            </div>

            <form onSubmit={handleSearch} className="flex flex-1 items-center gap-3 lg:max-w-2xl">
              <div className="flex h-12 flex-1 items-center rounded-full border border-gray-300 bg-white px-4 shadow-sm">
                <svg className="mr-3 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" />
                </svg>
                <input
                  type="search"
                  value={keyword}
                  onChange={(event) => setKeyword(event.target.value)}
                  placeholder="Cari AC, kulkas, TV, mesin cuci..."
                  className="w-full border-0 bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
                  aria-label="Cari produk"
                />
              </div>
              <button
                type="submit"
                className="hidden rounded-full bg-primary-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-700 md:inline-flex"
              >
                Cari
              </button>
            </form>

            <div className="hidden items-center gap-3 md:flex">
              <Link href="/produk" className="rounded-full border border-gray-200 px-5 py-3 text-sm font-medium text-gray-700 transition hover:border-primary-200 hover:text-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-400">
                Produk
              </Link>
              <Link
                href="/keranjang"
                className="relative inline-flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 text-gray-700 transition hover:border-primary-200 hover:text-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-400"
                aria-label="Keranjang"
                title="Keranjang"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M6 6h15l-1.5 9h-12L6 6Zm0 0-2-3H2" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm9 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />
                </svg>
                {totalKeranjang > 0 && (
                  <span className="absolute -top-1 -right-1 inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-primary-600 px-1.5 text-xs font-bold text-white">
                    {totalKeranjang}
                  </span>
                )}
              </Link>
              <Link
                href="/wishlist"
                className="relative inline-flex items-center gap-2 rounded-full border border-gray-200 px-5 py-3 text-sm font-medium text-gray-700 transition hover:border-primary-200 hover:text-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-400"
                aria-label="Wishlist"
                title="Wishlist"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="m12 21-1.45-1.32C5.4 15.01 2 11.93 2 8.15 2 5.07 4.42 3 7.4 3c1.69 0 3.31.79 4.35 2.04A5.63 5.63 0 0 1 16.1 3C19.08 3 21.5 5.07 21.5 8.15c0 3.78-3.4 6.86-8.55 11.55L12 21Z" />
                </svg>
                <span>Wishlist</span>
                {totalWishlist > 0 && (
                  <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-neutral-900 px-1.5 text-xs font-bold text-white">
                    {totalWishlist}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="lg:hidden">
            {/* Row 1: Hamburger, Logo (Centered), Wishlist, Cart */}
            <div className="flex items-center justify-between mb-3">
              {/* Left: Hamburger */}
              <button
                type="button"
                onClick={() => setIsMobileSidebarOpen(true)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 text-gray-700 active:bg-gray-50 transition flex-shrink-0"
                aria-label="Buka menu"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              {/* Center: Logo (absolute positioning for true viewport center) */}
              <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center">
                <Link href="/" className="flex items-center justify-center">
                  <Image
                    src="/assets/img/logo_cp.png"
                    alt="Logo Cermat Putra"
                    width={44}
                    height={44}
                    className="h-11 w-auto"
                  />
                </Link>
              </div>

              {/* Right: Wishlist & Cart */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <Link
                  href="/wishlist"
                  className="relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 text-gray-700 transition active:bg-gray-50"
                  aria-label="Wishlist"
                  title="Wishlist"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="m12 21-1.45-1.32C5.4 15.01 2 11.93 2 8.15 2 5.07 4.42 3 7.4 3c1.69 0 3.31.79 4.35 2.04A5.63 5.63 0 0 1 16.1 3C19.08 3 21.5 5.07 21.5 8.15c0 3.78-3.4 6.86-8.55 11.55L12 21Z" />
                  </svg>
                  {totalWishlist > 0 && (
                    <span className="absolute -top-1 -right-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-neutral-900 px-1 text-xs font-bold text-white">
                      {totalWishlist}
                    </span>
                  )}
                </Link>

                <Link
                  href="/keranjang"
                  className="relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 text-gray-700 transition active:bg-gray-50"
                  aria-label="Keranjang"
                  title="Keranjang"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M6 6h15l-1.5 9h-12L6 6Zm0 0-2-3H2" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm9 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />
                  </svg>
                  {totalKeranjang > 0 && (
                    <span className="absolute -top-1 -right-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary-600 px-1 text-xs font-bold text-white">
                      {totalKeranjang}
                    </span>
                  )}
                </Link>
              </div>
            </div>

            {/* Row 2: Search Bar */}
            <form onSubmit={handleSearch} className="w-full">
              <div className="flex h-11 w-full items-center rounded-full border border-gray-300 bg-white px-4 shadow-sm">
                <svg className="mr-2 h-5 w-5 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" />
                </svg>
                <input
                  type="search"
                  value={keyword}
                  onChange={(event) => setKeyword(event.target.value)}
                  placeholder="Cari AC, kulkas, TV, mesin cuci..."
                  className="w-full border-0 bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
                  aria-label="Cari produk"
                />
              </div>
            </form>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Drawer */}
      <MobileSidebarDrawer 
        isOpen={isMobileSidebarOpen} 
        onClose={() => setIsMobileSidebarOpen(false)} 
      />
    </>
  );
}
