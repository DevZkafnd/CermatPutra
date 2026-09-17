'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Loading from '@/components/common/Loading';
import Alert from '@/components/common/Alert';
import { getDummyAlamatList, setDummyAlamatUtama, deleteDummyAlamat } from '@/lib/data/dummyData';
import { AlamatPengguna } from '@/types/pengguna.types';

const MAX_ADDRESSES = 5;

export default function HalamanAlamat() {
  const router = useRouter();
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [alamatList, setAlamatList] = useState<AlamatPengguna[]>([]);

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }

    setLoading(true);
    setAlamatList(getDummyAlamatList());
    setLoading(false);
  }, [token, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex min-h-[400px] items-center justify-center">
          <Loading size="lg" />
        </div>
      </div>
    );
  }

  const handleSetUtama = (id: string) => {
    const next = setDummyAlamatUtama(id);
    setAlamatList(next);
    setSuccess('Alamat utama berhasil diubah');
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleHapus = (id: string) => {
    const next = deleteDummyAlamat(id);
    setAlamatList(next);
    setSuccess('Alamat berhasil dihapus');
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleTambahAlamat = () => {
    if (alamatList.length >= MAX_ADDRESSES) {
      setError(`Maksimal ${MAX_ADDRESSES} alamat`);
      setTimeout(() => setError(null), 3000);
      return;
    }
    router.push('/profil/alamat/tambah');
  };

  const canAddMore = alamatList.length < MAX_ADDRESSES;

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-2xl items-center gap-4 px-4 py-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-700 transition hover:bg-gray-100"
            aria-label="Kembali"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-bold text-neutral-900">Alamat Saya</h1>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-2xl px-4">
        {/* Alerts */}
        {error && <Alert type="error" message={error} className="mt-4" />}
        {success && <Alert type="success" message={success} className="mt-4" />}

        {/* Add Button */}
        <div className="mt-6">
          <button
            type="button"
            onClick={handleTambahAlamat}
            disabled={!canAddMore}
            className="w-full rounded-xl border-2 border-dashed border-primary-300 bg-primary-50 px-6 py-4 text-center font-bold text-primary-700 transition hover:border-primary-400 hover:bg-primary-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {canAddMore ? (
              <>
                <svg className="mx-auto mb-1 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Tambah Alamat Baru</span>
                <p className="mt-1 text-xs font-normal text-gray-600">
                  {alamatList.length}/{MAX_ADDRESSES} alamat
                </p>
              </>
            ) : (
              <span>Maksimal {MAX_ADDRESSES} alamat tercapai</span>
            )}
          </button>
        </div>

        {/* Address List */}
        {alamatList.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-12 text-center">
            <svg className="mx-auto h-16 w-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="mt-4 text-base font-bold text-gray-900">Belum ada alamat</p>
            <p className="mt-1 text-sm text-gray-600">Tambahkan alamat pengiriman pertama Anda</p>
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {alamatList.map((alamat) => (
              <div
                key={alamat.id}
                className={`rounded-2xl border-2 bg-white p-5 transition ${
                  alamat.is_utama
                    ? 'border-primary-300 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-black uppercase text-neutral-900">
                        {alamat.label}
                      </span>
                      {alamat.is_utama && (
                        <span className="rounded-full bg-primary-600 px-2.5 py-0.5 text-xs font-bold text-white">
                          Utama
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-sm font-bold text-neutral-900">{alamat.nama_penerima}</p>
                    <p className="mt-1 text-sm text-gray-700">{alamat.nomor_telepon}</p>
                    <p className="mt-2 text-sm text-gray-700">{alamat.alamat_lengkap}</p>
                    <p className="text-sm text-gray-700">
                      {alamat.kecamatan}, {alamat.kota}, {alamat.provinsi} {alamat.kode_pos}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2 border-t border-gray-200 pt-4">
                  {!alamat.is_utama && (
                    <button
                      type="button"
                      onClick={() => handleSetUtama(alamat.id)}
                      className="flex-1 rounded-lg border border-primary-600 bg-white px-4 py-2 text-sm font-bold text-primary-600 transition hover:bg-primary-50"
                    >
                      Jadikan Utama
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleHapus(alamat.id)}
                    className="flex-1 rounded-lg border border-red-600 bg-white px-4 py-2 text-sm font-bold text-red-600 transition hover:bg-red-50"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
