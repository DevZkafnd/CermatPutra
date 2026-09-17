'use client';

import { useKeranjang } from '@/context/KeranjangContext';
import ItemKeranjang from '@/components/keranjang/ItemKeranjang';
import RingkasanBelanja from '@/components/keranjang/RingkasanBelanja';
import Loading from '@/components/common/Loading';
import Alert from '@/components/common/Alert';
import Link from 'next/link';
import Button from '@/components/common/Button';
import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';
import { dummyProduk } from '@/lib/data/dummyData';
import { formatRupiah } from '@/lib/utils/formatRupiah';
import { useWishlist } from '@/context/WishlistContext';

export default function HalamanKeranjang() {
  const { keranjang, loading, removeFromCart, updateJumlah, addToCart } = useKeranjang();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [confirmRemoveId, setConfirmRemoveId] = useState<string | null>(null);
  const selectAllRef = useRef<HTMLInputElement | null>(null);
  const STORAGE_KEY = 'cermat-putra-cart-selected';

  useEffect(() => {
    if (!keranjang) return;
    const allIds = keranjang.item.map((item) => item.id);
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      setSelectedIds(new Set(allIds));
      return;
    }

    try {
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed)) {
        setSelectedIds(new Set(allIds));
        return;
      }

      const filtered = parsed.filter((id: any) => typeof id === 'string' && allIds.includes(id));
      setSelectedIds(new Set(filtered));
    } catch {
      setSelectedIds(new Set(allIds));
    }
  }, [keranjang]);

  useEffect(() => {
    if (!keranjang) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(selectedIds)));
  }, [keranjang, selectedIds]);

  const rekomendasiProduk = useMemo(() => {
    if (!keranjang || keranjang.item.length === 0) return [];

    const kategoriSlug = new Set(
      keranjang.item
        .map((item) => dummyProduk.find((produk) => produk.id === item.id)?.kategori.slug)
        .filter((slug): slug is string => Boolean(slug))
    );
    const produkDalamKeranjang = new Set(keranjang.item.map((item) => item.id));

    const sejenis = dummyProduk.filter(
      (produk) => !produkDalamKeranjang.has(produk.id) && kategoriSlug.has(produk.kategori.slug)
    );

    const lainnya = dummyProduk.filter((produk) => !produkDalamKeranjang.has(produk.id) && !kategoriSlug.has(produk.kategori.slug));

    return [...sejenis, ...lainnya].slice(0, 8);
  }, [keranjang]);

  const selectedItems = useMemo(() => {
    if (!keranjang) return [];
    return keranjang.item.filter((item) => selectedIds.has(item.id));
  }, [keranjang, selectedIds]);

  const selectedSubtotal = useMemo(() => {
    return selectedItems.reduce((acc, item) => acc + item.produk.harga * item.jumlah, 0);
  }, [selectedItems]);

  const allSelected = keranjang ? keranjang.item.length > 0 && selectedIds.size === keranjang.item.length : false;
  const someSelected = keranjang ? selectedIds.size > 0 && selectedIds.size < keranjang.item.length : false;

  useEffect(() => {
    if (!selectAllRef.current) return;
    selectAllRef.current.indeterminate = someSelected;
  }, [someSelected]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center min-h-[400px]">
          <Loading size="lg" />
        </div>
      </div>
    );
  }

  if (!keranjang) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Alert type="error" message="Keranjang tidak tersedia saat ini." className="mb-4" />
        <div className="text-center">
          <Link href="/produk">
            <Button>Lihat Produk</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Keranjang Belanja</h1>

      {confirmRemoveId ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl">
            <p className="text-base font-black text-neutral-900">Hapus produk dari keranjang?</p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setConfirmRemoveId(null)}
                className="inline-flex h-11 items-center justify-center rounded-xl border border-gray-200 text-sm font-bold text-gray-700"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={async () => {
                  const id = confirmRemoveId;
                  setConfirmRemoveId(null);
                  await removeFromCart(id);
                }}
                className="inline-flex h-11 items-center justify-center rounded-xl bg-red-600 text-sm font-bold text-white"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {keranjang.item.length === 0 ? (
        <div className="text-center py-12">
          <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <p className="text-gray-500 text-lg mb-4">Keranjang belanja kosong</p>
          <Link href="/produk">
            <Button>Mulai Belanja</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add padding bottom on mobile to prevent content hiding behind fixed summary */}
          <div className="lg:col-span-2 pb-48 lg:pb-0">
            <div className="mb-4 rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
              <label className="flex items-center gap-3 text-sm font-bold text-neutral-900">
                <input
                  ref={selectAllRef}
                  type="checkbox"
                  checked={allSelected}
                  onChange={(event) => {
                    const checked = event.target.checked;
                    if (checked) {
                      setSelectedIds(new Set(keranjang.item.map((item) => item.id)));
                    } else {
                      setSelectedIds(new Set());
                    }
                  }}
                  className="h-5 w-5 accent-primary-600"
                  aria-label="Pilih semua produk"
                />
                Pilih Semua
              </label>
            </div>

            <div className="hidden md:block overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="grid grid-cols-12 gap-4 border-b border-gray-200 bg-gray-50 px-5 py-4 text-xs font-bold uppercase tracking-wide text-gray-600">
                <div className="col-span-7">Produk</div>
                <div className="col-span-2 text-right">Harga</div>
                <div className="col-span-3 text-center">Jumlah</div>
              </div>
              <div className="divide-y divide-gray-100">
                {keranjang.item.map((item) => (
                  <div key={item.id} className="grid grid-cols-12 items-center gap-4 px-5 py-4">
                    <div className="col-span-7 flex items-center gap-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(item.id)}
                        onChange={(event) => {
                          const checked = event.target.checked;
                          setSelectedIds((current) => {
                            const next = new Set(current);
                            if (checked) next.add(item.id);
                            else next.delete(item.id);
                            return next;
                          });
                        }}
                        className="h-5 w-5 accent-primary-600"
                        aria-label={`Pilih ${item.produk.nama}`}
                      />
                      <div className="relative h-16 w-16 overflow-hidden rounded-xl bg-gray-100">
                        {item.produk.gambar_url ? (
                          <Image src={item.produk.gambar_url} alt={item.produk.nama} fill className="object-cover" />
                        ) : null}
                      </div>
                      <div className="min-w-0">
                        <p className="line-clamp-2 text-sm font-semibold text-neutral-900">{item.produk.nama}</p>
                      </div>
                    </div>
                    <div className="col-span-2 text-right text-sm font-semibold text-neutral-800">
                      {formatRupiah(item.produk.harga)}
                    </div>
                    <div className="col-span-3 flex justify-center">
                      <div className="flex items-center gap-3">
                        <div className="flex items-stretch overflow-hidden rounded-full border border-gray-300">
                          <button
                            type="button"
                            onClick={() => {
                              if (item.jumlah <= 1) {
                                setConfirmRemoveId(item.id);
                                return;
                              }
                              updateJumlah(item.id, item.jumlah - 1);
                            }}
                            className="inline-flex h-11 w-11 items-center justify-center bg-gray-50 text-base font-black text-neutral-900 transition hover:bg-gray-100"
                            aria-label="Kurangi jumlah"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            min={1}
                            value={item.jumlah}
                            onChange={(event) => updateJumlah(item.id, Number(event.target.value))}
                            aria-label={`Jumlah ${item.produk.nama}`}
                            className="h-11 w-16 border-x border-gray-300 text-center text-sm font-black text-neutral-900 outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => updateJumlah(item.id, item.jumlah + 1)}
                            className="inline-flex h-11 w-11 items-center justify-center bg-gray-50 text-base font-black text-neutral-900 transition hover:bg-gray-100"
                            aria-label="Tambah jumlah"
                          >
                            +
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 text-gray-700 transition hover:border-red-200 hover:text-red-600"
                          aria-label="Hapus produk"
                          title="Hapus"
                        >
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 7h12M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m-9 0 1 14h8l1-14" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4 md:hidden">
              {keranjang.item.map((item) => (
                <ItemKeranjang
                  key={item.id}
                  item={item}
                  onRemove={removeFromCart}
                  onUpdateJumlah={updateJumlah}
                  checked={selectedIds.has(item.id)}
                  onToggleChecked={(checked) => {
                    setSelectedIds((current) => {
                      const next = new Set(current);
                      if (checked) next.add(item.id);
                      else next.delete(item.id);
                      return next;
                    });
                  }}
                />
              ))}
            </div>

            {rekomendasiProduk.length > 0 ? (
              <div className="mt-10">
                <div className="mb-4 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary-600">Rekomendasi</p>
                    <h2 className="mt-1 text-xl font-black text-neutral-900 md:text-2xl">Kamu Mungkin Juga Suka</h2>
                  </div>
                  <Link href="/produk" className="text-sm font-bold text-primary-600 hover:text-primary-700">
                    Lihat Semua
                  </Link>
                </div>

                <div className="flex gap-4 overflow-x-auto pb-2 [-webkit-overflow-scrolling:touch] md:grid md:grid-cols-2 md:gap-5 md:overflow-visible lg:grid-cols-4">
                  {rekomendasiProduk.map((produk) => (
                    <div
                      key={produk.id}
                      className="min-w-[180px] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg md:min-w-0"
                    >
                      <Link href={`/produk/${produk.slug}`} className="block">
                        <div className="relative h-32 bg-gray-50">
                          {produk.gambar_url ? (
                            <Image src={produk.gambar_url} alt={produk.nama} fill className="object-contain p-3" />
                          ) : null}
                        </div>
                      </Link>

                      <div className="p-3">
                        <Link href={`/produk/${produk.slug}`} className="block">
                          <p className="line-clamp-2 text-sm font-bold text-neutral-900">{produk.nama}</p>
                        </Link>
                        <p className="mt-1 text-sm font-black text-primary-600">{formatRupiah(produk.harga)}</p>

                        <div className="mt-3 flex items-center justify-between gap-2">
                          <button
                            type="button"
                            onClick={() => addToCart({ produk_id: produk.id, jumlah: 1 })}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-neutral-900 text-white transition hover:bg-primary-600"
                            aria-label="Tambah ke keranjang"
                            title="Tambah ke keranjang"
                          >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                          </button>
                          <button
                            type="button"
                            onClick={() => toggleWishlist(produk.id)}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-neutral-700 transition hover:border-primary-200 hover:text-primary-600"
                            aria-label={isWishlisted(produk.id) ? 'Hapus dari wishlist' : 'Tambah ke wishlist'}
                            title="Wishlist"
                          >
                            <svg
                              className={`h-5 w-5 ${isWishlisted(produk.id) ? 'fill-primary-600 text-primary-600' : 'fill-none'}`}
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="m12 21-1.45-1.32C5.4 15.01 2 11.93 2 8.15 2 5.07 4.42 3 7.4 3c1.69 0 3.31.79 4.35 2.04A5.63 5.63 0 0 1 16.1 3C19.08 3 21.5 5.07 21.5 8.15c0 3.78-3.4 6.86-8.55 11.55L12 21Z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          {/* Desktop: Sidebar Summary */}
          <div className="hidden lg:block lg:col-span-1">
            <RingkasanBelanja
              subtotal={selectedSubtotal}
              selectedCount={selectedItems.length}
              checkoutDisabled={selectedItems.length === 0}
            />
          </div>

          {/* Mobile: Fixed Bottom Summary */}
          <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden">
            <RingkasanBelanja
              subtotal={selectedSubtotal}
              selectedCount={selectedItems.length}
              checkoutDisabled={selectedItems.length === 0}
              isMobileFixed={true}
            />
          </div>
        </div>
      )}
    </div>
  );
}
