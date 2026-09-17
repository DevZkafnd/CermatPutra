'use client';

import { Suspense, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Alert from '@/components/common/Alert';
import Button from '@/components/common/Button';
import { getDummyPesananById } from '@/lib/data/dummyData';
import { formatRupiah } from '@/lib/utils/formatRupiah';
import { formatTanggal } from '@/lib/utils/formatTanggal';

export default function HalamanPembayaran() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-12">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-600">Memuat halaman pembayaran...</p>
          </div>
        </div>
      }
    >
      <PembayaranContent />
    </Suspense>
  );
}

function PembayaranContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const pesanan = useMemo(() => (id ? getDummyPesananById(id) : null), [id]);

  if (!id) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Alert type="error" message="ID pesanan tidak ditemukan." className="mb-6" />
        <Link href="/pesanan">
          <Button>Lihat Pesanan</Button>
        </Link>
      </div>
    );
  }

  if (!pesanan) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Alert type="error" message="Pesanan tidak ditemukan." className="mb-6" />
        <Link href="/pesanan">
          <Button>Lihat Pesanan</Button>
        </Link>
      </div>
    );
  }

  const pembayaranLabel =
    pesanan.metode_pembayaran === 'COD'
      ? 'COD (Bayar di Tempat)'
      : pesanan.bank_va
        ? `Virtual Account • ${pesanan.bank_va}`
        : 'Virtual Account';

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8 flex flex-col gap-2">
        <h1 className="text-3xl font-black text-neutral-900">Pembayaran</h1>
        <p className="text-sm text-gray-600">Selesaikan pembayaran untuk memproses pesanan Anda.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-black text-neutral-900">Instruksi Pembayaran</h2>
            <p className="mt-2 text-sm text-gray-600">
              Ini adalah simulasi frontend. Nanti saat backend/payment gateway sudah tersedia, halaman ini akan diintegrasikan tanpa mengubah struktur UI.
            </p>

            <div className="mt-5 rounded-xl bg-gray-50 p-4">
              <p className="text-sm font-bold text-neutral-900">{pembayaranLabel}</p>
              {pesanan.metode_pembayaran === 'COD' ? (
                <p className="mt-1 text-sm text-gray-600">Pembayaran dilakukan saat barang diterima.</p>
              ) : (
                <>
                  <p className="mt-1 text-sm text-gray-600">Bank: {pesanan.bank_va || 'BCA VA'}</p>
                  <p className="text-sm text-gray-600">Nomor Virtual Account: 1234567890</p>
                  <p className="text-sm text-gray-600">Atas Nama: Cermat Putra</p>
                </>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-black text-neutral-900">Item Pesanan</h2>
            <div className="mt-4 space-y-3">
              {(pesanan.item ?? []).map((item) => (
                <div key={item.nama_produk} className="flex items-start justify-between gap-4 rounded-xl bg-gray-50 p-4">
                  <div className="min-w-0">
                    <p className="line-clamp-2 text-sm font-semibold text-neutral-900">{item.nama_produk}</p>
                    <p className="mt-1 text-xs text-gray-600">
                      {item.jumlah} x {formatRupiah(item.harga_satuan)}
                    </p>
                  </div>
                  <p className="text-sm font-black text-neutral-900">{formatRupiah(item.subtotal)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-black text-neutral-900">Ringkasan</h2>
            <div className="mt-4 space-y-2 text-sm text-gray-700">
              <div className="flex justify-between">
                <span>No. Pesanan</span>
                <span className="font-semibold text-neutral-900">{pesanan.nomor_pesanan}</span>
              </div>
              <div className="flex justify-between">
                <span>Tanggal</span>
                <span className="font-semibold text-neutral-900">{formatTanggal(pesanan.dibuat_pada)}</span>
              </div>
            </div>

            <div className="mt-4 border-t border-gray-200 pt-4">
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex justify-between">
                  <span>Harga Produk</span>
                  <span className="font-semibold text-neutral-900">{formatRupiah(pesanan.total_produk ?? 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Ongkir</span>
                  <span className="font-semibold text-neutral-900">{formatRupiah(pesanan.ongkir ?? 0)}</span>
                </div>
                {pesanan.diskon ? (
                  <div className="flex justify-between">
                    <span>Diskon</span>
                    <span className="font-semibold text-neutral-900">-{formatRupiah(pesanan.diskon)}</span>
                  </div>
                ) : null}
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4">
                <span className="text-sm font-semibold text-gray-700">Total Akhir</span>
                <span className="text-xl font-black text-primary-600">{formatRupiah(pesanan.total_pembayaran)}</span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <Button className="w-full" onClick={() => router.push(`/pesanan/${pesanan.id}`)}>
                Lihat Detail Pesanan
              </Button>
              <Link href="/produk">
                <Button variant="outline" className="w-full top-2">
                  Lanjut Belanja
                </Button>
              </Link>
            </div>

            <p className="mt-4 text-xs text-gray-500">
              Status pesanan masih <span className="font-semibold">Menunggu Pembayaran</span> sampai simulasi pembayaran dikonfirmasi.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
