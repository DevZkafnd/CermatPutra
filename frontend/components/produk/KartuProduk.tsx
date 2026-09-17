'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Produk } from '@/types/produk.types';
import { formatRupiah } from '@/lib/utils/formatRupiah';
import { useKeranjang } from '@/context/KeranjangContext';
import { useWishlist } from '@/context/WishlistContext';

interface KartuProdukProps {
  produk: Produk;
  aksiSekunder?: 'whatsapp' | 'hapus-wishlist';
}

export default function KartuProduk({ produk, aksiSekunder = 'whatsapp' }: KartuProdukProps) {
  const router = useRouter();
  const { addToCart, loading } = useKeranjang();
  const { toggleWishlist } = useWishlist();
  const [jumlah, setJumlah] = useState(1);
  const whatsappLink = `https://wa.me/6281234567890?text=${encodeURIComponent(
    `Halo admin Cermat Putra, saya tertarik dengan produk ${produk.nama}. Apakah masih tersedia?`
  )}`;

  const handleTambahKeKeranjang = async () => {
    await addToCart({ produk_id: produk.id, jumlah });
  };

  const handleBeliSekarang = (event: React.MouseEvent) => {
    event.stopPropagation();
    // Save product to localStorage for direct checkout
    const checkoutData = {
      produk_id: produk.id,
      jumlah,
      timestamp: Date.now()
    };
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('cermat-putra-direct-buy', JSON.stringify(checkoutData));
    }
    router.push('/checkout');
  };

  return (
    <div
      role="link"
      tabIndex={0}
      onClick={() => router.push(`/produk/${produk.slug}`)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          router.push(`/produk/${produk.slug}`);
        }
      }}
      className="group cursor-pointer overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-100"
      aria-label={`Buka detail ${produk.nama}`}
    >
      <div className="relative h-40 overflow-hidden bg-gray-50 sm:h-44 md:h-40 xl:h-44">
        {produk.gambar_url ? (
          <Image
            src={produk.gambar_url}
            alt={produk.nama}
            fill
            className="object-contain p-4 transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <svg className="h-16 w-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 0 1 2.828 0L16 16m-2-2 1.586-1.586a2 2 0 0 1 2.828 0L20 14m-6-6h.01M6 20h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2Z" />
            </svg>
          </div>
        )}
      </div>

      <div className="p-3 md:p-4">
        <p className="line-clamp-2 text-sm font-semibold leading-snug text-neutral-900 md:text-base">
          {produk.nama}
        </p>

        <div className="mt-2">
          <p className="text-base font-black text-primary-600 md:text-lg">{formatRupiah(produk.harga)}</p>
          {produk.harga_asli ? (
            <p className="text-xs font-semibold text-gray-400 line-through md:text-sm">{formatRupiah(produk.harga_asli)}</p>
          ) : null}
        </div>

        <p className="mt-2 text-xs font-semibold text-gray-500">{produk.jumlah_terjual} Terjual</p>

        <div className="mt-3 flex items-center justify-between overflow-hidden rounded-xl border border-gray-200 bg-white">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              setJumlah((current) => Math.max(1, current - 1));
            }}
            className="inline-flex h-10 w-10 items-center justify-center bg-gray-50 text-base font-black text-neutral-900 transition hover:bg-gray-100"
            aria-label="Kurangi jumlah"
            title="Kurangi jumlah"
          >
            -
          </button>
          <span className="text-sm font-black text-neutral-900" aria-label={`Jumlah ${jumlah}`}>
            {jumlah}
          </span>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              setJumlah((current) => Math.min(produk.stok, current + 1));
            }}
            className="inline-flex h-10 w-10 items-center justify-center bg-gray-50 text-base font-black text-neutral-900 transition hover:bg-gray-100"
            aria-label="Tambah jumlah"
            title="Tambah jumlah"
          >
            +
          </button>
        </div>

        <button
          type="button"
          onClick={handleBeliSekarang}
          disabled={produk.stok === 0}
          className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 px-3 py-3 text-sm font-black text-white transition hover:bg-primary-700 active:bg-primary-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          Beli Sekarang
        </button>

        {aksiSekunder === 'whatsapp' ? (
          <a
            href={whatsappLink}
            target="_blank"
            rel="noreferrer"
            onClick={(event) => event.stopPropagation()}
            className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-green-200 bg-white px-3 py-3 text-sm font-black text-green-600 transition hover:border-green-300 hover:bg-green-50"
            aria-label={`Beli ${produk.nama} via WhatsApp`}
            title="Beli via WhatsApp"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M19.05 4.91A9.82 9.82 0 0 0 12.03 2C6.62 2 2.2 6.4 2.2 11.83c0 1.74.45 3.44 1.3 4.94L2 22l5.4-1.42a9.77 9.77 0 0 0 4.64 1.18h.01c5.41 0 9.83-4.4 9.83-9.83 0-2.63-1.02-5.1-2.83-7.02Zm-7.01 15.2h-.01a8.1 8.1 0 0 1-4.12-1.13l-.3-.18-3.2.84.86-3.12-.2-.32a8.13 8.13 0 0 1-1.25-4.34c0-4.5 3.67-8.17 8.2-8.17 2.18 0 4.23.84 5.78 2.39a8.1 8.1 0 0 1 2.39 5.79c0 4.5-3.68 8.17-8.15 8.17Zm4.48-6.13c-.25-.13-1.47-.73-1.7-.81-.23-.09-.4-.13-.56.12-.17.25-.65.8-.8.96-.15.17-.3.19-.56.07-.25-.13-1.07-.39-2.03-1.24-.75-.67-1.26-1.5-1.4-1.75-.15-.25-.02-.39.11-.52.11-.11.25-.3.37-.45.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.84-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1s.9 2.44 1.02 2.61c.13.17 1.77 2.7 4.3 3.79.6.26 1.07.42 1.44.54.61.19 1.16.16 1.6.1.49-.07 1.47-.6 1.68-1.19.21-.58.21-1.08.15-1.19-.06-.1-.23-.17-.48-.29Z" />
            </svg>
            Beli via WhatsApp
          </a>
        ) : (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              toggleWishlist(produk.id);
            }}
            className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-3 py-3 text-sm font-black text-red-600 transition hover:border-red-300 hover:bg-red-50"
            aria-label="Hapus dari wishlist"
            title="Hapus dari wishlist"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 7h12M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m-9 0 1 14h8l1-14" />
            </svg>
            Hapus dari Wishlist
          </button>
        )}
      </div>
    </div>
  );
}
