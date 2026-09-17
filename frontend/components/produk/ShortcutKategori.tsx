'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Kategori } from '@/types/produk.types';
import IkonKategori from '@/components/produk/IkonKategori';
import { useCategoryNav } from '@/context/CategoryNavContext';

interface ShortcutKategoriProps {
  kategori: Kategori[];
  activeSlug?: string;
  tampilkanLihatSemuaMobile?: boolean;
  batasiKategoriMobile?: boolean;
}

export default function ShortcutKategori({
  kategori,
  activeSlug,
  tampilkanLihatSemuaMobile = true,
  batasiKategoriMobile = true,
}: ShortcutKategoriProps) {
  const { open } = useCategoryNav();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [hasOverflow, setHasOverflow] = useState(false);

  const kategoriMobile = batasiKategoriMobile ? kategori.slice(0, 4) : kategori;

  // Calculate scroll progress for mobile indicator
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const updateScrollProgress = () => {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      const maxScroll = scrollWidth - clientWidth;
      
      if (maxScroll <= 0) {
        setHasOverflow(false);
        setScrollProgress(0);
        return;
      }
      
      setHasOverflow(true);
      const progress = (scrollLeft / maxScroll) * 100;
      setScrollProgress(Math.min(100, Math.max(0, progress)));
    };

    updateScrollProgress();
    container.addEventListener('scroll', updateScrollProgress);
    
    const resizeObserver = new ResizeObserver(updateScrollProgress);
    resizeObserver.observe(container);

    return () => {
      container.removeEventListener('scroll', updateScrollProgress);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div className="rounded-[2rem] bg-white p-4 shadow-sm ring-1 ring-gray-200 md:p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary-500">Kategori</p>
          <h2 className="mt-2 text-xl font-black text-neutral-900 md:text-2xl">Pilih Kategori Produk</h2>
        </div>
        <Link href="/categories" className="hidden text-sm font-semibold text-primary-600 transition hover:text-primary-700 md:inline-flex xl:hidden">
          Lihat Semua
        </Link>
      </div>

      {/* Mobile: Shopee-style Category Carousel */}
      <div className="md:hidden">
        {/* Main Category Card Container */}
        <div className="rounded-2xl border border-gray-200 bg-gray-50 shadow-sm overflow-hidden">
          {/* Horizontal Scrolling Category Items */}
          <div 
            ref={scrollContainerRef}
            className="flex gap-2.5 overflow-x-auto px-3 py-4 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {kategori.map((item) => {
              const isActive = activeSlug === item.slug;
              return (
                <Link
                  key={item.slug}
                  href={`/produk/kategori/${item.slug}`}
                  className={`flex min-w-[72px] max-w-[72px] flex-shrink-0 flex-col items-center justify-center rounded-xl border-2 px-2 py-3 text-center transition-transform duration-200 active:scale-95 ${
                    isActive ? 'border-primary-600 bg-primary-50' : 'border-neutral-900 bg-white'
                  }`}
                >
                  <span className="mb-1.5 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gray-50">
                    <IkonKategori iconKey={item.icon_key} />
                  </span>
                  <span className="line-clamp-2 text-[9px] font-bold leading-tight text-neutral-900">{item.nama}</span>
                </Link>
              );
            })}

            {/* Lihat Semua Kategori Button */}
            {tampilkanLihatSemuaMobile && (
              <button
                type="button"
                onClick={open}
                className="flex min-w-[72px] max-w-[72px] flex-shrink-0 flex-col items-center justify-center rounded-xl border-2 border-neutral-900 bg-neutral-900 px-2 py-3 text-center transition-transform duration-200 active:scale-95"
                aria-label="Lihat semua kategori"
              >
                <span className="mb-1.5 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
                  <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </span>
                <span className="line-clamp-2 text-[9px] font-bold leading-tight text-white">Lihat Semua</span>
              </button>
            )}
          </div>

          {/* Scroll Position Indicator */}
          {hasOverflow && (
            <div className="px-4 pb-3">
              <div className="h-1 w-full rounded-full bg-gray-300">
                <div 
                  className="h-full rounded-full bg-neutral-900 transition-all duration-150"
                  style={{ width: `${Math.max(10, scrollProgress)}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Desktop/Tablet: Grid Layout (Unchanged) */}
      <div className="hidden grid-cols-6 gap-3 md:grid xl:grid-cols-9 2xl:grid-cols-12">
        {kategori.map((item) => {
          const isActive = activeSlug === item.slug;
          return (
            <Link
              key={item.slug}
              href={`/produk/kategori/${item.slug}`}
              className={`group flex min-h-[96px] flex-col items-center justify-center rounded-2xl border px-2 py-3 text-center transition duration-200 hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-md ${
                isActive ? 'border-primary-500 bg-primary-50 shadow-sm' : 'border-gray-200 bg-white'
              }`}
            >
              <span className="mb-2 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gray-50 transition group-hover:bg-primary-50">
              <IkonKategori iconKey={item.icon_key} />
              </span>
              <span className="line-clamp-2 text-[11px] font-semibold leading-4 text-neutral-800 md:text-xs">
                {item.nama}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
