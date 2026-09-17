'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getDummyPesananById } from '@/lib/data/dummyData';
import { Pesanan } from '@/types/pesanan.types';
import { formatRupiah, formatTanggal } from '@/lib/utils';
import { canCancelOrder } from '@/lib/utils/orderUtils';
import Loading from '@/components/common/Loading';
import Alert from '@/components/common/Alert';
import Button from '@/components/common/Button';
import OrderStatusTracker from '@/components/pesanan/OrderStatusTracker';
import { useAuth } from '@/context/AuthContext';

export default function HalamanDetailPesanan() {
  const { id } = useParams();
  const router = useRouter();
  const { token } = useAuth();
  const [pesanan, setPesanan] = useState<Pesanan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    const fetchPesanan = async () => {
      if (!token || !id) return;

      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 500));
        const foundPesanan = getDummyPesananById(typeof id === 'string' ? id : id[0]);
        if (!foundPesanan) {
          throw new Error('Pesanan tidak ditemukan');
        }
        setPesanan(foundPesanan);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Gagal memuat pesanan');
      } finally {
        setLoading(false);
      }
    };

    fetchPesanan();
  }, [token, id]);

  const handleCancelOrder = async () => {
    if (!pesanan) return;

    setIsCancelling(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local state (in real app, this would refetch from backend)
      setPesanan({ ...pesanan, status: 'DIBATALKAN' });
      setShowCancelModal(false);
      
      // Show success message (could use toast/notification)
      alert('Pesanan berhasil dibatalkan');
    } catch (err) {
      alert('Gagal membatalkan pesanan. Silakan coba lagi.');
    } finally {
      setIsCancelling(false);
    }
  };

  if (!token) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Alert type="info" message="Harap login terlebih dahulu" className="mb-4" />
        <div className="text-center">
          <Link href="/login">
            <Button>Login</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center min-h-[400px]">
          <Loading size="lg" />
        </div>
      </div>
    );
  }

  if (error || !pesanan) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Alert type="error" message={error || 'Pesanan tidak ditemukan'} />
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      'MENUNGGU_PEMBAYARAN': 'bg-yellow-100 text-yellow-800',
      'DIKEMAS': 'bg-blue-100 text-blue-800',
      'DIKIRIM': 'bg-purple-100 text-purple-800',
      'SELESAI': 'bg-green-100 text-green-800',
      'DIBATALKAN': 'bg-red-100 text-red-800',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
        {status.replace('_', ' ')}
      </span>
    );
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-6">
        <Link href="/pesanan">
          <Button variant="outline" size="sm">← Kembali ke Daftar Pesanan</Button>
        </Link>
      </div>

      <h1 className="text-3xl font-bold text-gray-800 mb-8">Detail Pesanan</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Main order detail */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary-600">Informasi Pesanan</p>
                <p className="mt-2 text-sm text-gray-500">Nomor Pesanan</p>
                <p className="text-base font-black text-neutral-900">{pesanan.nomor_pesanan}</p>
              </div>
              <div className="flex flex-col items-start gap-2 sm:items-end">
                <p className="text-sm font-semibold text-gray-600">{formatTanggal(pesanan.dibuat_pada)}</p>
                {getStatusBadge(pesanan.status)}
              </div>
            </div>

            {/* Cancel Order Button */}
            {canCancelOrder(pesanan.status) && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowCancelModal(true)}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl border-2 border-red-500 text-red-600 font-bold text-sm transition hover:bg-red-50 active:bg-red-100"
                >
                  Batalkan Pesanan
                </button>
              </div>
            )}

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">Metode Pembayaran</p>
                <p className="mt-1 text-sm font-black text-neutral-900">
                  {pesanan.metode_pembayaran === 'COD'
                    ? 'COD (Bayar di Tempat)'
                    : pesanan.bank_va
                      ? `Virtual Account • ${pesanan.bank_va}`
                      : 'Virtual Account'}
                </p>
              </div>
              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">Status Pembayaran</p>
                <p className="mt-1 text-sm font-black text-neutral-900">{pesanan.status_pembayaran || 'MENUNGGU_PEMBAYARAN'}</p>
              </div>
            </div>

            <div className="my-6 h-px bg-gray-200" />

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary-600">Informasi Pengiriman</p>
              <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">Penerima</p>
                  <p className="mt-1 text-sm font-black text-neutral-900">{pesanan.alamat?.nama_penerima || '-'}</p>
                  <p className="mt-1 text-sm text-gray-700">{pesanan.alamat?.nomor_telepon || '-'}</p>
                  <p className="text-sm text-gray-700">{pesanan.alamat?.email || '-'}</p>
                </div>
                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">Alamat</p>
                  <p className="mt-1 text-sm font-semibold text-neutral-900">{pesanan.alamat?.alamat_lengkap || '-'}</p>
                  <p className="mt-1 text-sm text-gray-700">
                    {(pesanan.alamat?.kecamatan ? `${pesanan.alamat.kecamatan}, ` : '')}
                    {pesanan.alamat?.kota || '-'}, {pesanan.alamat?.provinsi || '-'} {pesanan.alamat?.kode_pos || ''}
                  </p>
                </div>
              </div>
            </div>

            <div className="my-6 h-px bg-gray-200" />

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary-600">Produk</p>
              <div className="mt-4 space-y-4">
                {(pesanan.item ?? []).map((item, index) => (
                  <div key={`${item.nama_produk}-${index}`} className="flex flex-col gap-4 rounded-2xl border border-gray-200 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 items-center gap-4">
                      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100">
                        {item.gambar_url ? <Image src={item.gambar_url} alt={item.nama_produk} fill className="object-cover" /> : null}
                      </div>
                      <div className="min-w-0">
                        <p className="line-clamp-2 text-sm font-black text-neutral-900">{item.nama_produk}</p>
                        <p className="mt-1 text-sm font-black text-primary-600">{formatRupiah(item.harga_satuan)}</p>
                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs font-semibold text-gray-600">
                          <span>Jumlah: {item.jumlah}</span>
                          <span>Variasi: {item.variasi || '-'}</span>
                          <span>Berat: {item.berat_gram ? `${Math.max(0, Math.round(item.berat_gram / 10) / 100)} kg` : '-'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                      <p className="text-sm font-black text-neutral-900">{formatRupiah(item.subtotal)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="my-6 h-px bg-gray-200" />

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary-600">Pengiriman</p>
              <div className="mt-4 rounded-2xl border border-gray-200 bg-gray-50 p-5">
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-black text-neutral-900">{pesanan.pengiriman?.kurir || '-'}</p>
                  {pesanan.pengiriman?.layanan ? <p className="text-sm text-gray-700">{pesanan.pengiriman.layanan}</p> : null}
                  {pesanan.pengiriman?.estimasi ? <p className="text-sm text-gray-700">{pesanan.pengiriman.estimasi}</p> : null}
                </div>

                {pesanan.pengiriman?.kurir === 'Sopir Toko' ? (
                  <div className="mt-4">
                    <a
                      href={`https://wa.me/6281234567890?text=${encodeURIComponent(`Halo Cermat Putra, saya ingin menanyakan status pesanan ${pesanan.nomor_pesanan}`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-green-600 text-sm font-black text-white transition hover:bg-green-700"
                    >
                      Hubungi Toko via WhatsApp
                    </a>
                  </div>
                ) : (
                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="rounded-xl bg-white p-4">
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">Nomor Resi</p>
                      <p className="mt-1 break-all text-sm font-black text-neutral-900">{pesanan.pengiriman?.resi || 'RESI-XXXXXXX'}</p>
                      <div className="mt-3 flex gap-2">
                        <button
                          type="button"
                          onClick={async () => {
                            const resi = pesanan.pengiriman?.resi || 'RESI-XXXXXXX';
                            await navigator.clipboard.writeText(resi);
                          }}
                          className="inline-flex h-10 flex-1 items-center justify-center rounded-xl border border-gray-200 text-sm font-black text-gray-700 transition hover:border-primary-200 hover:text-primary-600"
                        >
                          Copy Resi
                        </button>
                        <button
                          type="button"
                          className="inline-flex h-10 flex-1 items-center justify-center rounded-xl bg-neutral-900 text-sm font-black text-white transition hover:bg-primary-600"
                        >
                          Lacak
                        </button>
                      </div>
                    </div>
                    <div className="rounded-xl bg-white p-4">
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">Ongkir</p>
                      <p className="mt-1 text-sm font-black text-neutral-900">{formatRupiah(pesanan.ongkir ?? 0)}</p>
                      <p className="mt-2 text-xs font-semibold text-gray-500">Tracking akan aktif setelah integrasi backend ekspedisi.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="my-6 h-px bg-gray-200" />

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary-600">Ringkasan Pembayaran</p>
              <div className="mt-4 space-y-2 text-sm text-gray-700">
                <div className="flex justify-between">
                  <span>Total Produk</span>
                  <span className="font-semibold text-neutral-900">{formatRupiah(pesanan.total_produk ?? 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Ongkir</span>
                  <span className="font-semibold text-neutral-900">{formatRupiah(pesanan.ongkir ?? 0)}</span>
                </div>
                {pesanan.voucher_kode ? (
                  <div className="flex justify-between">
                    <span>Voucher</span>
                    <span className="font-semibold text-neutral-900">{pesanan.voucher_kode}</span>
                  </div>
                ) : null}
                {pesanan.diskon ? (
                  <div className="flex justify-between">
                    <span>Diskon</span>
                    <span className="font-semibold text-neutral-900">-{formatRupiah(pesanan.diskon)}</span>
                  </div>
                ) : null}
                <div className="mt-3 border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-base font-black text-neutral-900">
                    <span>Total Pembayaran</span>
                    <span className="text-primary-600">{formatRupiah(pesanan.total_pembayaran)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Order Status Tracker */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 lg:top-32">
            <OrderStatusTracker status={pesanan.status} />
          </div>
        </div>
      </div>

      {/* Cancel Order Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setShowCancelModal(false)}>
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Batalkan Pesanan?</h3>
            <p className="text-sm text-gray-600 mb-4">
              Anda yakin ingin membatalkan pesanan <span className="font-bold">{pesanan.nomor_pesanan}</span>?
            </p>
            <p className="text-sm text-gray-600 mb-6">
              Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowCancelModal(false)}
                disabled={isCancelling}
                className="flex-1 px-4 py-3 rounded-xl border border-gray-300 text-gray-700 font-semibold transition hover:bg-gray-50 disabled:opacity-50"
              >
                Tidak, Kembali
              </button>
              <button
                type="button"
                onClick={handleCancelOrder}
                disabled={isCancelling}
                className="flex-1 px-4 py-3 rounded-xl bg-red-600 text-white font-semibold transition hover:bg-red-700 disabled:opacity-50"
              >
                {isCancelling ? 'Membatalkan...' : 'Ya, Batalkan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
