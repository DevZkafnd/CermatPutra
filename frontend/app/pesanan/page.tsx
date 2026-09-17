'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getDummyPesanan } from '@/lib/data/dummyData';
import { Pesanan } from '@/types/pesanan.types';
import { formatRupiah, formatTanggal } from '@/lib/utils';
import Loading from '@/components/common/Loading';
import Alert from '@/components/common/Alert';
import Button from '@/components/common/Button';
import { useAuth } from '@/context/AuthContext';

export default function HalamanPesanan() {
  const { token } = useAuth();
  const [pesanan, setPesanan] = useState<Pesanan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPesanan = async () => {
      if (!token) return;

      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 500));
        setPesanan(getDummyPesanan());
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Gagal memuat pesanan');
      } finally {
        setLoading(false);
      }
    };

    fetchPesanan();
  }, [token]);

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

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Alert type="error" message={error} />
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      'MENUNGGU_PEMBAYARAN': 'bg-yellow-100 text-yellow-800',
      'DIBAYAR': 'bg-blue-100 text-blue-800',
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
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Pesanan Saya</h1>

      {pesanan.length === 0 ? (
        <div className="text-center py-12">
          <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-gray-500 text-lg mb-4">Belum ada pesanan</p>
          <Link href="/produk">
            <Button>Mulai Belanja</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {pesanan.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Nomor Pesanan</p>
                  <p className="font-semibold text-gray-800">{item.nomor_pesanan}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Tanggal</p>
                  <p className="text-gray-800">{formatTanggal(item.dibuat_pada)}</p>
                </div>
                {getStatusBadge(item.status)}
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Total Pembayaran</p>
                  <p className="text-xl font-bold text-primary-600">{formatRupiah(item.total_pembayaran)}</p>
                </div>
                <Link href={`/pesanan/${item.id}`}>
                  <Button variant="outline" size="sm">Lihat Detail</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
