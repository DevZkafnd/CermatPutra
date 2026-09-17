'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { dummyKategoriProduk } from '@/lib/data/dummyData';
import IkonKategori from '@/components/produk/IkonKategori';
import { useCategoryNav } from '@/context/CategoryNavContext';

const dummySubKategori: Record<string, string[]> = {
  ac: ['Split', 'Inverter', 'Portable', 'Cassette'],
  tv: ['Smart TV', 'Android TV', 'OLED TV', 'LED TV'],
  'mesin-cuci': ['Front Load', 'Top Load', 'Twin Tub'],
  kulkas: ['1 Pintu', '2 Pintu', 'Side by Side', 'Showcase'],
  blender: ['Blender Rumah Tangga', 'Blender Portable'],
  'rice-cooker': ['Mini', 'Digital', 'Low Sugar'],
  dispenser: ['Bottom Loading', 'Top Loading'],
  'water-heater': ['Gas', 'Listrik'],
};

export default function ExpandedCategoryNavigation() {
  const router = useRouter();
  const { isOpen, close } = useCategoryNav();
  const [keyword, setKeyword] = useState('');
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const kategoriFiltered = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    if (!q) return dummyKategoriProduk;
    return dummyKategoriProduk.filter((item) => item.nama.toLowerCase().includes(q) || item.slug.toLowerCase().includes(q));
  }, [keyword]);

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setKeyword('');
      setActiveSlug(null);
      if (scrollRef.current) {
        scrollRef.current.scrollTop = 0;
      }
      return;
    }

    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [close, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    if (kategoriFiltered.length === 0) {
      setActiveSlug(null);
      return;
    }
    if (activeSlug && kategoriFiltered.some((item) => item.slug === activeSlug)) return;
    setActiveSlug(kategoriFiltered[0].slug);
  }, [activeSlug, isOpen, kategoriFiltered]);

  const activeSub = activeSlug ? dummySubKategori[activeSlug] || [] : [];

  const navigateToListing = (kategoriSlug: string, sub?: string) => {
    const params = new URLSearchParams();
    params.set('kategori', kategoriSlug);
    if (sub) params.set('sub', sub);
    router.push(`/produk?${params.toString()}`);
  };

  return (
    <div
      className={`fixed inset-0 z-[60] ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
      aria-hidden={!isOpen}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          close();
        }
      }}
    >
      <div className={`absolute inset-0 bg-black/40 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`} />

      <div
        className={`absolute left-0 right-0 top-0 origin-top transform-gpu bg-white shadow-2xl transition duration-300 ${
          isOpen ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="flex h-[100dvh] max-h-[100dvh] flex-col">
          <div className="sticky top-0 z-10 border-b border-gray-200 bg-white">
          <div className="container mx-auto flex items-center gap-3 px-4 py-4">
            <Link href="/" className="flex items-center gap-3" onClick={close}>
              <Image src="/assets/img/logo_cp.png" alt="Logo Cermat Putra" width={44} height={44} className="h-10 w-auto" />
              <div className="hidden sm:block">
                <p className="text-base font-black uppercase tracking-wide text-neutral-950">
                  Cermat <span className="text-primary-600">Putra</span>
                </p>
                <p className="text-[10px] uppercase tracking-[0.25em] text-gray-500">Electronic Store</p>
              </div>
            </Link>

            <div className="mx-auto w-full max-w-2xl">
              <div className="flex h-12 items-center rounded-full border border-gray-300 bg-white px-4 shadow-sm">
                <svg className="mr-3 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" />
                </svg>
                <input
                  type="search"
                  value={keyword}
                  onChange={(event) => setKeyword(event.target.value)}
                  placeholder="Cari kategori (contoh: TV)"
                  className="w-full border-0 bg-transparent text-sm font-semibold text-gray-700 outline-none placeholder:text-gray-400"
                  aria-label="Cari kategori"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={close}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 text-gray-700 transition hover:border-primary-200 hover:text-primary-600"
              aria-label="Tutup kategori"
              title="Tutup"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          </div>

          <div ref={scrollRef} className="flex-1 min-h-0 overflow-x-hidden overflow-y-auto overscroll-contain">
            <div className="container mx-auto px-4 py-6">
              <div className="flex flex-col gap-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-gray-500">Kategori</p>
              <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-6">
                {kategoriFiltered.map((item) => {
                  const isActive = item.slug === activeSlug;
                  return (
                    <button
                      key={item.slug}
                      type="button"
                      onClick={() => setActiveSlug(item.slug)}
                      className={`group flex min-h-[88px] flex-col items-center justify-center rounded-2xl border px-3 py-4 text-center transition duration-[250ms] ${
                        isActive
                          ? 'border-primary-500 bg-primary-50 shadow-sm'
                          : 'border-gray-200 bg-white hover:-translate-y-0.5 hover:border-primary-200 hover:bg-gray-50 hover:shadow-md'
                      }`}
                      aria-label={`Pilih kategori ${item.nama}`}
                    >
                      <span className={`mb-2 inline-flex h-12 w-12 items-center justify-center rounded-2xl ${isActive ? 'bg-white' : 'bg-gray-50'} transition`}>
                        <IkonKategori iconKey={item.icon_key} />
                      </span>
                      <span className="line-clamp-2 text-xs font-black text-neutral-900">{item.nama}</span>
                    </button>
                  );
                })}
              </div>
              {kategoriFiltered.length === 0 ? (
                <p className="mt-4 text-sm font-semibold text-gray-600">Kategori tidak ditemukan.</p>
              ) : null}
            </div>

            {activeSlug ? (
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary-600">Subkategori</p>
                    <p className="mt-1 text-lg font-black text-neutral-900">
                      {dummyKategoriProduk.find((item) => item.slug === activeSlug)?.nama}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const slug = activeSlug;
                      close();
                      navigateToListing(slug);
                    }}
                    className="inline-flex items-center gap-2 rounded-full bg-neutral-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-primary-600"
                  >
                    Lihat Produk <span aria-hidden="true">→</span>
                  </button>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {activeSub.length > 0 ? (
                    activeSub.map((sub) => (
                      <button
                        key={sub}
                        type="button"
                        onClick={() => {
                          const slug = activeSlug;
                          close();
                          navigateToListing(slug, sub);
                        }}
                        className="rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-xs font-bold text-gray-700 transition hover:border-primary-200 hover:bg-primary-50 hover:text-primary-700"
                        aria-label={`Subkategori ${sub}`}
                      >
                        {sub}
                      </button>
                    ))
                  ) : (
                    <p className="text-sm font-semibold text-gray-600">Subkategori belum tersedia.</p>
                  )}
                </div>
              </div>
            ) : null}
          </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
