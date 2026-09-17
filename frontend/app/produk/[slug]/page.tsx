'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { formatRupiah } from '@/lib/utils/formatRupiah';
import { useProdukDetail } from '@/lib/hooks/useProduk';
import Loading from '@/components/common/Loading';
import Alert from '@/components/common/Alert';
import { useKeranjang } from '@/context/KeranjangContext';
import { useWishlist } from '@/context/WishlistContext';

export default function HalamanDetailProduk() {
  const { slug } = useParams();
  const router = useRouter();
  const { produk, loading, error } = useProdukDetail(slug);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [tabAktif, setTabAktif] = useState<'deskripsi' | 'spesifikasi' | 'ulasan'>('deskripsi');
  const [gambarAktif, setGambarAktif] = useState(0);
  const { addToCart } = useKeranjang();
  const { isWishlisted, toggleWishlist } = useWishlist();

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center min-h-[400px]">
          <Loading size="lg" />
        </div>
      </div>
    );
  }

  if (error || !produk) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Alert type="error" message={error || 'Produk tidak ditemukan'} />
      </div>
    );
  }

  const handleAddToCart = async () => {
    try {
      setIsAdding(true);
      await addToCart({ produk_id: produk.id, jumlah: quantity });
    } catch (err: any) {
      console.error('Gagal menambah ke keranjang:', err);
    } finally {
      setIsAdding(false);
    }
  };

  const handleBeliSekarang = () => {
    // Save product to localStorage for direct checkout
    const checkoutData = {
      produk_id: produk.id,
      jumlah: quantity,
      timestamp: Date.now()
    };
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('cermat-putra-direct-buy', JSON.stringify(checkoutData));
    }
    router.push('/checkout');
  };

  const handleQuantityChange = (value: string) => {
    const parsed = Number(value);
    if (Number.isNaN(parsed)) {
      setQuantity(1);
      return;
    }

    setQuantity(Math.max(1, Math.min(produk.stok, parsed)));
  };

  const handlePrevImage = () => {
    setGambarAktif((current) => Math.max(0, current - 1));
  };

  const handleNextImage = () => {
    setGambarAktif((current) => Math.min(gallery.length - 1, current + 1));
  };

  const gallery = produk.gallery && produk.gallery.length > 0
    ? produk.gallery
    : produk.gambar_url
      ? [{ id: produk.id, url: produk.gambar_url, alt: produk.nama }]
      : [];

  const groupedSpecs = (produk.spesifikasi && Array.isArray(produk.spesifikasi))
    ? produk.spesifikasi.reduce<Record<string, typeof produk.spesifikasi>>((acc, item) => {
        if (!acc[item.kelompok]) {
          acc[item.kelompok] = [];
        }
        acc[item.kelompok].push(item);
        return acc;
      }, {})
    : {};

  return (
    <div className="bg-[#f6f6f6] py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6 rounded-2xl bg-white px-6 py-4 text-sm text-gray-500 shadow-sm ring-1 ring-gray-200">
          <span>Home</span>
          <span className="mx-2">/</span>
          <span>Produk</span>
          <span className="mx-2">/</span>
          <span className="text-primary-600">{produk.nama}</span>
        </div>

        <div className="overflow-hidden rounded-[2rem] bg-white shadow-sm ring-1 ring-gray-200">
          <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_460px] xl:items-stretch">
            <div className="grid grid-cols-1 xl:grid-cols-[96px_minmax(0,1fr)] xl:border-r xl:border-gray-200">
              <div className="hidden flex-col gap-3 border-r border-gray-200 bg-white p-4 xl:flex">
                {gallery.map((gambar, index) => (
                  <button
                    key={gambar.id}
                    type="button"
                    onClick={() => setGambarAktif(index)}
                    aria-label={`Pilih foto ${index + 1}`}
                    title={`Pilih foto ${index + 1}`}
                    className={`relative h-20 min-w-20 overflow-hidden rounded-2xl border bg-white shadow-sm ${gambarAktif === index ? 'border-primary-500 ring-2 ring-primary-100' : 'border-gray-200'}`}
                  >
                    <Image src={gambar.url} alt={gambar.alt} fill className="object-contain p-2" />
                  </button>
                ))}
              </div>

              <div className="relative flex min-h-[300px] items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 md:min-h-[420px] xl:min-h-[460px]">
                {gallery.length > 0 ? (
                  <>
                    <Image
                      src={gallery[gambarAktif].url}
                      alt={gallery[gambarAktif].alt}
                      fill
                      className="object-contain p-6 md:p-8 xl:p-10"
                    />
                    <div className="absolute bottom-4 right-4 rounded-full bg-black/55 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                      {gambarAktif + 1}/{gallery.length}
                    </div>
                    {gallery.length > 1 ? (
                      <>
                        <button
                          type="button"
                          onClick={handlePrevImage}
                          aria-label="Foto sebelumnya"
                          title="Foto sebelumnya"
                          disabled={gambarAktif === 0}
                          className="absolute left-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-neutral-900 shadow-md transition disabled:cursor-not-allowed disabled:opacity-40 md:left-4 md:h-11 md:w-11"
                        >
                          ‹
                        </button>
                        <button
                          type="button"
                          onClick={handleNextImage}
                          aria-label="Foto berikutnya"
                          title="Foto berikutnya"
                          disabled={gambarAktif === gallery.length - 1}
                          className="absolute right-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-neutral-900 shadow-md transition disabled:cursor-not-allowed disabled:opacity-40 md:right-4 md:h-11 md:w-11"
                        >
                          ›
                        </button>
                      </>
                    ) : null}
                  </>
                ) : (
                  <svg className="h-32 w-32 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 0 1 2.828 0L16 16m-2-2 1.586-1.586a2 2 0 0 1 2.828 0L20 14m-6-6h.01M6 20h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2Z" />
                  </svg>
                )}
              </div>
            </div>

            <div className="border-t border-gray-200 p-5 md:p-6 xl:border-l-0 xl:border-t-0 xl:p-7">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-primary-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-primary-700">
                {produk.merek}
              </span>
              {produk.badge ? (
                <span className="rounded-full bg-neutral-900 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-white">
                  {produk.badge}
                </span>
              ) : null}
            </div>

            <h1 className="mt-4 text-2xl font-black uppercase leading-tight text-neutral-900 md:text-3xl">
              {produk.nama}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className={`h-5 w-5 ${star <= Math.round(produk.rating) ? 'text-yellow-400' : 'text-gray-200'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 0 0 .95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 0 0-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 0 0-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 0 0-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 0 0 .951-.69l1.07-3.292Z" />
                  </svg>
                ))}
              </div>
              <p className="text-sm font-medium text-gray-500">
                {produk.rating.toFixed(1)} dari 5 • {produk.jumlah_ulasan} penilaian
              </p>
            </div>

            <div className="mt-5 border-y border-gray-200 py-5">
              <div className="flex flex-wrap items-end gap-4">
                <p className="text-3xl font-black text-primary-600 md:text-4xl">{formatRupiah(produk.harga)}</p>
                {produk.harga_asli ? (
                  <p className="text-lg text-gray-400 line-through">{formatRupiah(produk.harga_asli)}</p>
                ) : null}
              </div>
              <p className="mt-3 text-sm leading-7 text-gray-600">{produk.deskripsi}</p>
            </div>

            <div className="mt-5">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-gray-500">
                Kuantitas
              </p>
              <div className="flex w-full max-w-xs items-stretch overflow-hidden rounded-full border border-gray-300">
                <button
                  type="button"
                  onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                  className="inline-flex h-12 w-12 items-center justify-center bg-gray-50 text-lg font-bold text-neutral-900"
                >
                  -
                </button>
                <input
                  type="number"
                  min={1}
                  max={produk.stok}
                  value={quantity}
                  onChange={(event) => handleQuantityChange(event.target.value)}
                  aria-label={`Kuantitas ${produk.nama}`}
                  title={`Kuantitas ${produk.nama}`}
                  placeholder="1"
                  className="h-12 w-full border-x border-gray-300 text-center text-base font-semibold text-neutral-900 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setQuantity((current) => Math.min(produk.stok, current + 1))}
                  className="inline-flex h-12 w-12 items-center justify-center bg-gray-50 text-lg font-bold text-neutral-900"
                >
                  +
                </button>
              </div>
              <p className="mt-3 text-sm text-gray-500">Stok tersedia: {produk.stok}</p>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                className="inline-flex flex-1 items-center justify-center rounded-2xl bg-primary-600 px-6 py-4 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-primary-700 active:bg-primary-800 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={produk.stok === 0}
                onClick={handleBeliSekarang}
              >
                <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Beli Sekarang
              </button>
              <button
                type="button"
                className="inline-flex flex-1 items-center justify-center rounded-2xl bg-neutral-900 px-6 py-4 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={produk.stok === 0 || isAdding}
                onClick={handleAddToCart}
              >
                {isAdding ? 'Menambahkan...' : 'Masukkan Keranjang'}
              </button>
              <button
                type="button"
                onClick={() => toggleWishlist(produk.id)}
                className={`inline-flex items-center justify-center rounded-2xl border px-5 py-4 text-sm font-bold uppercase tracking-wide transition ${isWishlisted(produk.id) ? 'border-primary-200 bg-primary-50 text-primary-700' : 'border-gray-300 text-neutral-900 hover:border-primary-200 hover:text-primary-600'}`}
              >
                <svg className="mr-2 h-5 w-5" fill={isWishlisted(produk.id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="m12 21-1.45-1.32C5.4 15.01 2 11.93 2 8.15 2 5.07 4.42 3 7.4 3c1.69 0 3.31.79 4.35 2.04A5.63 5.63 0 0 1 16.1 3C19.08 3 21.5 5.07 21.5 8.15c0 3.78-3.4 6.86-8.55 11.55L12 21Z" />
                </svg>
                Wishlist
              </button>
            </div>

            <div className="mt-6 grid gap-4 rounded-[1.5rem] bg-gray-50 p-5 md:grid-cols-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-gray-500">Kategori</p>
                <p className="mt-2 font-semibold text-neutral-900">{produk.kategori.nama}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-gray-500">Merek</p>
                <p className="mt-2 font-semibold text-neutral-900">{produk.merek}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-gray-500">Berat</p>
                <p className="mt-2 font-semibold text-neutral-900">{(produk.berat_gram / 1000).toFixed(1)} Kg</p>
              </div>
            </div>
            </div>
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-[2rem] bg-white shadow-sm ring-1 ring-gray-200">
          <div className="flex flex-wrap border-b border-gray-200">
            {[
              { key: 'deskripsi', label: 'Deskripsi' },
              { key: 'spesifikasi', label: 'Spesifikasi' },
              { key: 'ulasan', label: 'Ulasan' },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setTabAktif(tab.key as typeof tabAktif)}
                className={`relative px-6 py-4 text-sm font-bold uppercase tracking-wide transition ${tabAktif === tab.key ? 'bg-primary-600 text-white' : 'text-neutral-700 hover:bg-gray-50'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-8">
            {tabAktif === 'deskripsi' ? (
              <div className="space-y-6">
                {(produk.deskripsi_sections && Array.isArray(produk.deskripsi_sections)) ? produk.deskripsi_sections.map((section) => {
                  if (section.tipe === 'heading') {
                    return <h2 key={section.id} className="text-3xl font-black text-neutral-900">{section.konten}</h2>;
                  }

                  if (section.tipe === 'paragraph') {
                    return <p key={section.id} className="text-base leading-8 text-gray-700">{section.konten}</p>;
                  }

                  if (section.tipe === 'image' && section.url_gambar) {
                    return (
                      <div key={section.id} className="relative h-[360px] overflow-hidden rounded-[1.5rem] bg-gray-100">
                        <Image
                          src={section.url_gambar}
                          alt={section.alt_gambar || produk.nama}
                          fill
                          className="object-contain p-8"
                        />
                      </div>
                    );
                  }

                  if (section.tipe === 'list' && section.items) {
                    return (
                      <ul key={section.id} className="space-y-3 rounded-[1.5rem] bg-gray-50 p-6 text-gray-700">
                        {section.items.map((item) => (
                          <li key={item} className="flex items-start gap-3">
                            <span className="mt-2 h-2 w-2 rounded-full bg-primary-600" />
                            <span className="leading-7">{item}</span>
                          </li>
                        ))}
                      </ul>
                    );
                  }

                  return null;
                }) : (
                  <p className="text-base leading-8 text-gray-700">{produk.deskripsi || 'Deskripsi tidak tersedia.'}</p>
                )}
              </div>
            ) : null}

            {tabAktif === 'spesifikasi' ? (
              <div className="space-y-8">
                {Object.keys(groupedSpecs).length > 0 ? Object.entries(groupedSpecs).map(([kelompok, items]) => (
                  <div key={kelompok} className="overflow-hidden rounded-[1.5rem] border border-gray-200">
                    <div className="bg-gray-100 px-5 py-4 text-sm font-bold uppercase tracking-[0.25em] text-neutral-800">
                      {kelompok}
                    </div>
                    <table className="w-full text-left">
                      <tbody>
                        {items.map((item) => (
                          <tr key={`${kelompok}-${item.label}`} className="border-t border-gray-200">
                            <th className="w-1/3 bg-white px-5 py-4 text-sm font-semibold text-gray-500">{item.label}</th>
                            <td className="px-5 py-4 text-sm text-gray-800">{item.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )) : (
                  <p className="text-base text-gray-500">Spesifikasi tidak tersedia.</p>
                )}
              </div>
            ) : null}

            {tabAktif === 'ulasan' ? (
              <div className="space-y-4">
                {(produk.ulasan && Array.isArray(produk.ulasan) && produk.ulasan.length > 0) ? produk.ulasan.map((ulasan) => (
                  <div key={ulasan.id} className="rounded-[1.5rem] border border-gray-200 bg-gray-50 p-5">
                    <div className="mb-2 flex flex-wrap items-center gap-3">
                      <span className="font-semibold text-neutral-900">{ulasan.pengguna.nama}</span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`h-4 w-4 ${i < ulasan.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 0 0 .95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 0 0-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 0 0-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 0 0-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 0 0 .951-.69l1.07-3.292Z" />
                          </svg>
                        ))}
                      </div>
                      {ulasan.tanggal ? (
                        <span className="text-sm text-gray-400">{ulasan.tanggal}</span>
                      ) : null}
                    </div>
                    <p className="leading-7 text-gray-700">{ulasan.komentar}</p>
                  </div>
                )) : (
                  <p className="text-base text-gray-500">Belum ada ulasan untuk produk ini.</p>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
