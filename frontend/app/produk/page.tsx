'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import KartuProduk from '@/components/produk/KartuProduk';
import ShortcutKategori from '@/components/produk/ShortcutKategori';
import { useProduk } from '@/lib/hooks/useProduk';
import Loading from '@/components/common/Loading';
import Alert from '@/components/common/Alert';
import Button from '@/components/common/Button';
import { dummyKategoriProduk, dummyProduk } from '@/lib/data/dummyData';

const productGridClassName =
  'grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4 xl:grid-cols-5 2xl:grid-cols-6 min-[1920px]:grid-cols-7';

export default function HalamanProdukPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-12">
          <div className="flex justify-center items-center min-h-[400px]">
            <Loading size="lg" />
          </div>
        </div>
      }
    >
      <HalamanProduk />
    </Suspense>
  );
}

function HalamanProduk() {
  const searchParams = useSearchParams();
  const [halaman, setHalaman] = useState(1);
  const kataKunci = searchParams.get('cari') || '';
  const kategoriSlug = searchParams.get('kategori') || '';
  const subkategori = searchParams.get('sub') || '';
  const kategoriAktif = useMemo(
    () => (kategoriSlug ? dummyKategoriProduk.find((item) => item.slug === kategoriSlug) || null : null),
    [kategoriSlug]
  );
  const { produk, loading, error, pagination } = useProduk({
    halaman,
    batas: 12,
    kategori: kategoriSlug || undefined,
    subkategori: subkategori || undefined,
    cari: kataKunci,
  });

  const judulHalaman = useMemo(
    () => {
      if (kategoriAktif && subkategori) return `${kategoriAktif.nama} ${subkategori}`;
      if (kategoriAktif) return `Kategori ${kategoriAktif.nama}`;
      if (kataKunci) return `Hasil pencarian untuk "${kataKunci}"`;
      return 'Semua Produk';
    },
    [kataKunci, kategoriAktif, subkategori]
  );
  const produkRekomendasi = useMemo(
    () => [...dummyProduk].sort((a, b) => b.rating - a.rating || b.jumlah_ulasan - a.jumlah_ulasan).slice(0, 5),
    []
  );
  const produkTerlaris = useMemo(
    () => [...dummyProduk].sort((a, b) => b.jumlah_terjual - a.jumlah_terjual).slice(0, 10),
    []
  );
  const showHighlights = !kataKunci && !kategoriSlug && !subkategori;

  useEffect(() => {
    document.title = `${judulHalaman} - Cermat Putra`;
  }, [judulHalaman]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center min-h-[400px]">
          <Loading size="lg" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Alert type="error" message={error} />
      </div>
    );
  }

  return (
    <div className="bg-[#f6f6f6] py-10">
      <div className="container mx-auto px-4">
        {(kategoriAktif || subkategori) ? (
          <div className="mb-6 rounded-[2rem] bg-white px-6 py-4 text-sm text-gray-500 shadow-sm ring-1 ring-gray-200">
            <span>Home</span>
            <span className="mx-2">/</span>
            <span>Produk</span>
            {kategoriAktif ? (
              <>
                <span className="mx-2">/</span>
                <span className="text-primary-600">{kategoriAktif.nama}</span>
              </>
            ) : null}
            {subkategori ? (
              <>
                <span className="mx-2">/</span>
                <span className="text-primary-600">{subkategori}</span>
              </>
            ) : null}
          </div>
        ) : null}

        <div className="mb-6 rounded-[2rem] bg-gradient-to-r from-neutral-950 via-neutral-900 to-primary-950 p-8 text-white shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-primary-300">
            Halaman Produk
          </p>
          <h1 className="mt-3 text-3xl font-black uppercase md:text-4xl">{judulHalaman}</h1>
          <p className="mt-3 max-w-3xl text-base leading-7 text-gray-200">
            Temukan elektronik rumah tangga dan kebutuhan usaha dari berbagai merek dengan tampilan katalog yang modern, rapi, dan nyaman dijelajahi.
          </p>
        </div>

        <div className="mb-6">
          <ShortcutKategori kategori={[...dummyKategoriProduk]} activeSlug={kategoriAktif?.slug} />
        </div>

        {showHighlights ? (
          <>
            <section className="mb-6 rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-gray-200 md:p-6">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.35em] text-primary-500">Rekomendasi</p>
                  <h2 className="mt-2 text-2xl font-black text-neutral-900">Produk Rekomendasi</h2>
                </div>
              </div>
              <div className={productGridClassName}>
                {produkRekomendasi.map((item) => (
                  <KartuProduk key={`recommended-${item.id}`} produk={item} />
                ))}
              </div>
            </section>

            <section className="mb-6 rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-gray-200 md:p-6">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.35em] text-primary-500">Terlaris</p>
                  <h2 className="mt-2 text-2xl font-black text-neutral-900">Paling Banyak Dibeli</h2>
                </div>
                <p className="hidden text-sm text-gray-500 md:block">
                  Urutan mengikuti data dummy jumlah pembelian tertinggi.
                </p>
              </div>
              <div className={productGridClassName}>
                {produkTerlaris.map((item) => (
                  <KartuProduk key={`top-selling-${item.id}`} produk={item} />
                ))}
              </div>
            </section>
          </>
        ) : null}

        <div className="mb-6 rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-gray-200 md:p-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.35em] text-primary-500">Katalog</p>
              <h2 className="mt-2 text-2xl font-black text-neutral-900">{judulHalaman}</h2>
            </div>
            {kataKunci || kategoriSlug || subkategori ? (
              <p className="text-sm text-gray-500">
                Menampilkan hasil berdasarkan filter yang aktif.
              </p>
            ) : null}
          </div>

          <div className={productGridClassName}>
            {produk.map((item) => (
              <KartuProduk key={item.id} produk={item} />
            ))}
          </div>
        </div>

        {produk.length === 0 && (
          <div className="rounded-[2rem] bg-white py-16 text-center shadow-sm ring-1 ring-gray-200">
            <p className="text-lg text-gray-500">Belum ada produk yang cocok dengan pencarian Anda.</p>
          </div>
        )}

        {pagination && (
          <div className="mt-8 flex justify-center gap-2">
            <Button
              onClick={() => setHalaman(halaman - 1)}
              disabled={halaman === 1}
              variant="outline"
            >
              Sebelumnya
            </Button>
            <span className="px-4 py-2 text-gray-600">
              Halaman {halaman} dari {pagination.total_halaman}
            </span>
            <Button
              onClick={() => setHalaman(halaman + 1)}
              disabled={halaman === pagination.total_halaman}
              variant="outline"
            >
              Selanjutnya
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
