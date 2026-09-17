'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { dummyKategoriProduk } from '@/lib/data/dummyData';
import IkonKategori from '@/components/produk/IkonKategori';
import { useCategoryNav } from '@/context/CategoryNavContext';

export default function HomeKategoriProdukSection() {
  const { open } = useCategoryNav();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [hasOverflow, setHasOverflow] = useState(false);

  // Calculate scroll progress for indicator
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

    // Check on mount
    updateScrollProgress();

    // Update on scroll
    container.addEventListener('scroll', updateScrollProgress);
    
    // Update on resize
    const resizeObserver = new ResizeObserver(updateScrollProgress);
    resizeObserver.observe(container);

    return () => {
      container.removeEventListener('scroll', updateScrollProgress);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <section className="container mx-auto px-4 py-10 md:py-12">
      {/* Mobile only: Hide heading on mobile, show on desktop */}
      <div className="mb-6 hidden sm:flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between md:mb-8">
        <div>
          <h2 className="text-2xl font-black text-neutral-900 md:text-3xl">Kategori Produk</h2>
          <p className="mt-2 text-sm text-gray-600 md:text-base">
            Temukan berbagai kategori elektronik sesuai kebutuhan rumah Anda.
          </p>
        </div>
        <button
          type="button"
          onClick={open}
          className="inline-flex items-center gap-2 self-start rounded-full border border-gray-200 bg-white px-5 py-3 text-sm font-bold text-neutral-900 transition hover:-translate-y-0.5 hover:border-primary-200 hover:text-primary-600 hover:shadow-md sm:self-auto"
          aria-label="Lihat semua kategori"
        >
          Lihat Semua Kategori <span aria-hidden="true">→</span>
        </button>
      </div>

      {/* Mobile: Shopee-style Category Carousel with Main Card */}
      <div className="sm:hidden">
        {/* Main Category Card Container */}
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          {/* Horizontal Scrolling Category Items */}
          <div 
            ref={scrollContainerRef}
            className="flex gap-2.5 overflow-x-auto px-3 py-4 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {dummyKategoriProduk.map((item) => (
              <Link
                key={item.slug}
                href={`/produk/kategori/${item.slug}`}
                className="flex min-w-[72px] max-w-[72px] flex-shrink-0 flex-col items-center justify-center rounded-xl border-2 border-neutral-900 bg-white px-2 py-3 text-center transition-transform duration-200 active:scale-95"
              >
                <span className="mb-1.5 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gray-50">
                  <IkonKategori iconKey={item.icon_key} />
                </span>
                <span className="line-clamp-2 text-[9px] font-bold leading-tight text-neutral-900">{item.nama}</span>
              </Link>
            ))}

            {/* Lihat Semua Kategori Button */}
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
          </div>

          {/* Scroll Position Indicator */}
          {hasOverflow && (
            <div className="px-4 pb-3">
              <div className="h-1 w-full rounded-full bg-gray-200">
                <div 
                  className="h-full rounded-full bg-neutral-900 transition-all duration-150"
                  style={{ width: `${Math.max(10, scrollProgress)}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Desktop: Grid Layout (Unchanged) */}
      <div className="hidden sm:grid grid-cols-3 gap-3 md:grid-cols-4 xl:grid-cols-6">
        {dummyKategoriProduk.map((item) => (
          <Link
            key={item.slug}
            href={`/produk/kategori/${item.slug}`}
            className="group flex min-h-[96px] flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white px-3 py-4 text-center shadow-sm transition duration-[250ms] hover:-translate-y-1 hover:border-primary-200 hover:shadow-lg"
          >
            <span className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-50 transition group-hover:bg-primary-50">
              <IkonKategori iconKey={item.icon_key} />
            </span>
            <span className="line-clamp-2 text-xs font-bold text-neutral-900 md:text-sm">{item.nama}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

