'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useProduk } from '@/lib/hooks/useProduk';
import Loading from '@/components/common/Loading';
import KartuProduk from '@/components/produk/KartuProduk';
import HomeKategoriProdukSection from '@/components/home/HomeKategoriProdukSection';

const heroSlides = [
  {
    id: 'hero-1',
    label: 'Promo Diskon',
    judul: 'Diskon Elektronik Pilihan Sampai 25%',
    deskripsi: 'Dapatkan penawaran spesial untuk AC, kulkas, TV, dan perangkat rumah tangga unggulan dengan stok terbatas.',
    tombolUtama: 'Lihat Promo',
    tombolSekunder: 'Belanja Sekarang',
    hrefUtama: '/produk',
    hrefSekunder: '/produk',
    gambar: '/assets/hero.png',
  },
  {
    id: 'hero-2',
    label: 'Iklan Produk',
    judul: 'Upgrade Rumah Dengan Perangkat Elektronik Modern',
    deskripsi: 'Pilih produk premium dari merek terpercaya untuk menghadirkan kenyamanan dan efisiensi di rumah Anda.',
    tombolUtama: 'Lihat Semua Produk',
    tombolSekunder: 'Cek Detail',
    hrefUtama: '/produk',
    hrefSekunder: '/produk',
    gambar: '/assets/hero.png',
  },
  {
    id: 'hero-3',
    label: 'Promo Mingguan',
    judul: 'Gratis Ongkir dan Harga Khusus Untuk Produk Tertentu',
    deskripsi: 'Nikmati promo mingguan dengan harga lebih hemat dan layanan cepat untuk kebutuhan elektronik keluarga.',
    tombolUtama: 'Belanja Hemat',
    tombolSekunder: 'Tentang Cermat Putra',
    hrefUtama: '/produk',
    hrefSekunder: '/profil',
    gambar: '/assets/hero.png',
  },
];

const productGridClassName =
  'grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4 xl:grid-cols-5 2xl:grid-cols-6 min-[1920px]:grid-cols-7';

export default function Home() {
  const { produk, loading } = useProduk({ batas: 8 });
  const produkTerbaru = useMemo(() => produk.slice(0, 8), [produk]);
  const [slideAktif, setSlideAktif] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setSlideAktif((current) => (current + 1) % heroSlides.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, []);

  const slide = heroSlides[slideAktif];

  return (
    <main className="min-h-screen bg-[#f5f5f5]">
      <section className="relative w-full overflow-hidden bg-neutral-950">
        {/* Carousel Container dengan aspect ratio lebih compact (3:1 atau 4:1) */}
        <div className="relative w-full aspect-[16/7] overflow-hidden md:aspect-[16/6]">
          <Image
            src={slide.gambar}
            alt={slide.judul}
            fill
            priority
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/60" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-black/25" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(220,38,38,0.3),_transparent_42%)]" />

          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-center">
            <div className="mx-auto w-full max-w-[1600px] flex-col justify-center px-4 py-4 sm:px-6 md:px-10 md:py-6 xl:px-16 xl:py-8 flex h-full">
              <div className="max-w-2xl">
                <p className="text-[11px] font-semibold uppercase tracking-[0.45em] text-primary-400 md:text-sm">
                  {slide.label}
                </p>
                <h1 className="mt-2 max-w-2xl text-2xl font-black uppercase leading-[0.95] text-white sm:text-3xl md:text-4xl xl:text-5xl">
                  {slide.judul}
                </h1>
                <p className="mt-2 max-w-xl text-xs leading-5 text-gray-200 md:mt-3 md:text-sm md:leading-6">
                  {slide.deskripsi}
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-2 md:mt-5">
                  <Link
                    href={slide.hrefUtama}
                    className="rounded-xl bg-primary-600 px-4 py-2 text-xs font-semibold text-white transition duration-300 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 active:bg-primary-800 md:px-5 md:py-3 md:text-sm"
                  >
                    {slide.tombolUtama}
                  </Link>
                  <Link
                    href={slide.hrefSekunder}
                    className="rounded-xl border border-white px-4 py-2 text-xs font-semibold text-white transition duration-300 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 active:bg-white/20 md:px-5 md:py-3 md:text-sm"
                  >
                    {slide.tombolSekunder}
                  </Link>
                </div>

                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-white/80 md:mt-4 md:text-xs">
                  <span>Produk elektronik pilihan</span>
                  <span>Harga terjangkau</span>
                  <span>Layanan cepat dan aman</span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Buttons - Positioned absolutely at vertical center */}
          <div className="absolute inset-y-0 left-0 flex items-center px-3 sm:px-4 md:px-8 xl:px-12 pointer-events-none">
            <button
              type="button"
              onClick={() => setSlideAktif((current) => (current === 0 ? heroSlides.length - 1 : current - 1))}
              aria-label="Iklan sebelumnya"
              title="Iklan sebelumnya"
              className="pointer-events-auto inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition duration-300 hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white active:bg-white/40 md:h-12 md:w-12"
            >
              <svg className="h-5 w-5 md:h-6 md:w-6 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center px-3 sm:px-4 md:px-8 xl:px-12 pointer-events-none">
            <button
              type="button"
              onClick={() => setSlideAktif((current) => (current + 1) % heroSlides.length)}
              aria-label="Iklan berikutnya"
              title="Iklan berikutnya"
              className="pointer-events-auto inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition duration-300 hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white active:bg-white/40 md:h-12 md:w-12"
            >
              <svg className="h-5 w-5 md:h-6 md:w-6 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </button>
          </div>

          {/* Indicators - Positioned at center bottom */}
          <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center px-4 py-4 md:py-5">
            <div className="flex items-center gap-2 rounded-full bg-black/40 px-3 py-1.5 backdrop-blur-sm">
              {heroSlides.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSlideAktif(index)}
                  aria-label={`Pilih iklan ${index + 1}`}
                  aria-current={slideAktif === index ? 'true' : 'false'}
                  className={`transition-all duration-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-400 ${
                    slideAktif === index 
                      ? 'w-8 h-2 bg-primary-500' 
                      : 'w-2 h-2 bg-white/40 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <HomeKategoriProdukSection />

      <section className="container mx-auto px-4 py-10 md:py-12">
        <div className="mb-6 flex items-center justify-between gap-4 md:mb-8">
          <h2 className="text-3xl font-bold text-slate-800 md:text-5xl">Produk Tersedia</h2>
          <Link
            href="/produk"
            className="rounded-xl border border-primary-500 px-6 py-3 text-lg font-semibold text-primary-600 transition hover:bg-primary-50"
          >
            Lihat Semua
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loading size="lg" />
          </div>
        ) : (
          <div className={productGridClassName}>
            {produkTerbaru.map((item) => (
              <KartuProduk key={item.id} produk={item} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
