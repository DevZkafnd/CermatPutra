'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useWishlist } from '@/context/WishlistContext';
import { dummyProduk } from '@/lib/data/dummyData';
import KartuProduk from '@/components/produk/KartuProduk';
import Button from '@/components/common/Button';

const productGridClassName =
  'grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4 xl:grid-cols-5 2xl:grid-cols-6 min-[1920px]:grid-cols-7';

export default function HalamanWishlist() {
  const { token } = useAuth();
  const { wishlistIds } = useWishlist();

  const wishlistProduk = useMemo(() => {
    const set = new Set(wishlistIds);
    return dummyProduk.filter((item) => set.has(item.id));
  }, [wishlistIds]);

  if (!token) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-lg rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50 text-3xl">
            ❤️
          </div>
          <h1 className="mt-5 text-2xl font-black text-neutral-900">Silakan Login Terlebih Dahulu</h1>
          <p className="mt-2 text-sm text-gray-600">
            Anda harus login atau membuat akun terlebih dahulu untuk melihat daftar wishlist.
          </p>
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Link href="/login">
              <Button className="w-full">Login</Button>
            </Link>
            <Link href="/register">
              <Button variant="outline" className="w-full">
                Register
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <section className="container mx-auto px-4 py-10 md:py-12">
        <div className="mb-6 md:mb-8">
          <h1 className="text-3xl font-black text-neutral-900 md:text-4xl">Wishlist Saya</h1>
          <p className="mt-2 text-sm text-gray-600 md:text-base">Produk favorit yang telah Anda simpan.</p>
        </div>

        {wishlistProduk.length === 0 ? (
          <div className="mx-auto max-w-xl rounded-3xl border border-gray-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-50">
              <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="m12 21-1.45-1.32C5.4 15.01 2 11.93 2 8.15 2 5.07 4.42 3 7.4 3c1.69 0 3.31.79 4.35 2.04A5.63 5.63 0 0 1 16.1 3C19.08 3 21.5 5.07 21.5 8.15c0 3.78-3.4 6.86-8.55 11.55L12 21Z" />
              </svg>
            </div>
            <h2 className="mt-5 text-2xl font-black text-neutral-900">Wishlist Masih Kosong</h2>
            <p className="mt-2 text-sm text-gray-600">Simpan produk favorit Anda agar lebih mudah ditemukan nanti.</p>
            <div className="mt-6">
              <Link href="/">
                <Button>Belanja Sekarang</Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className={productGridClassName}>
            {wishlistProduk.map((item) => (
              <KartuProduk key={item.id} produk={item} aksiSekunder="hapus-wishlist" />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

