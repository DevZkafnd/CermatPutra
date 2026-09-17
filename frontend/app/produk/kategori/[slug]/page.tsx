'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import ShortcutKategori from '@/components/produk/ShortcutKategori';
import KartuProduk from '@/components/produk/KartuProduk';
import Loading from '@/components/common/Loading';
import Alert from '@/components/common/Alert';
import Button from '@/components/common/Button';
import { useProduk } from '@/lib/hooks/useProduk';
import { dummyKategoriProduk } from '@/lib/data/dummyData';

const productGridClassName =
  'grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4 xl:grid-cols-5 2xl:grid-cols-6 min-[1920px]:grid-cols-7';

export default function HalamanProdukPerKategori() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = typeof params.slug === 'string' ? params.slug : '';
  const subkategori = searchParams.get('sub') || '';
  const [halaman, setHalaman] = useState(1);
  const kategoriAktif = useMemo(
    () => dummyKategoriProduk.find((item) => item.slug === slug),
    [slug]
  );
  const { produk, loading, error, pagination } = useProduk({
    halaman,
    batas: 12,
    kategori: slug,
    subkategori: subkategori || undefined,
  });

  useEffect(() => {
    if (!kategoriAktif) return;
    const title = subkategori ? `${kategoriAktif.nama} ${subkategori}` : kategoriAktif.nama;
    document.title = `${title} - Cermat Putra`;
  }, [kategoriAktif, subkategori]);

  if (!kategoriAktif) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Alert type="error" message="Kategori tidak ditemukan." />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex min-h-[400px] items-center justify-center">
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
        <div className="mb-6 rounded-[2rem] bg-white px-6 py-4 text-sm text-gray-500 shadow-sm ring-1 ring-gray-200">
          <span>Home</span>
          <span className="mx-2">/</span>
          <span>Produk</span>
          <span className="mx-2">/</span>
          <span className="text-primary-600">{kategoriAktif.nama}</span>
          {subkategori ? (
            <>
              <span className="mx-2">/</span>
              <span className="text-primary-600">{subkategori}</span>
            </>
          ) : null}
        </div>

        <div className="mb-6 rounded-[2rem] bg-gradient-to-r from-neutral-950 via-neutral-900 to-primary-950 p-8 text-white shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-primary-300">
            Kategori Produk
          </p>
          <h1 className="mt-3 text-3xl font-black uppercase md:text-4xl">
            {subkategori ? `${kategoriAktif.nama} ${subkategori}` : kategoriAktif.nama}
          </h1>
          <p className="mt-3 max-w-3xl text-base leading-7 text-gray-200">
            Menampilkan produk khusus kategori {kategoriAktif.nama} dengan tampilan katalog yang modern dan mudah dijelajahi.
          </p>
        </div>

        <div className="mb-6">
          <ShortcutKategori kategori={[...dummyKategoriProduk]} activeSlug={kategoriAktif.slug} />
        </div>

        <div className="rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-gray-200 md:p-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.35em] text-primary-500">Katalog</p>
              <h2 className="mt-2 text-2xl font-black text-neutral-900">
                {subkategori ? `${kategoriAktif.nama} ${subkategori}` : `Produk ${kategoriAktif.nama}`}
              </h2>
            </div>
            <p className="text-sm text-gray-500">{produk.length} produk ditampilkan</p>
          </div>

          <div className={productGridClassName}>
            {produk.map((item) => (
              <KartuProduk key={item.id} produk={item} />
            ))}
          </div>
        </div>

        {produk.length === 0 && (
          <div className="mt-6 rounded-[2rem] bg-white py-16 text-center shadow-sm ring-1 ring-gray-200">
            <p className="text-lg text-gray-500">Belum ada produk pada kategori ini.</p>
          </div>
        )}

        {pagination && pagination.total_halaman > 1 ? (
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
        ) : null}
      </div>
    </div>
  );
}
