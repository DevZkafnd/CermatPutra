'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Input from '@/components/common/Input';
import Loading from '@/components/common/Loading';
import Alert from '@/components/common/Alert';
import { MapModal } from '@/components/map/MapModal';
import { addDummyAlamat, getDummyProfil } from '@/lib/data/dummyData';
import { AlamatPengguna } from '@/types/pengguna.types';

export default function HalamanTambahAlamat() {
  const router = useRouter();
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showMapModal, setShowMapModal] = useState(false);

  const [formData, setFormData] = useState<Omit<AlamatPengguna, 'id' | 'is_utama'>>({
    label: 'Rumah',
    nama_penerima: '',
    nomor_telepon: '',
    email: '',
    provinsi: '',
    kota: '',
    kecamatan: '',
    kelurahan: '',
    kode_pos: '',
    alamat_lengkap: '',
    latitude: '',
    longitude: '',
  });

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }

    // Pre-fill dengan data profil
    const profil = getDummyProfil();
    setFormData((prev) => ({
      ...prev,
      nama_penerima: profil.nama,
      nomor_telepon: profil.nomor_telepon,
      email: profil.email,
    }));
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validasi
    if (!formData.nama_penerima.trim()) {
      setError('Nama penerima wajib diisi');
      return;
    }
    if (!formData.nomor_telepon.trim()) {
      setError('Nomor telepon wajib diisi');
      return;
    }
    if (!formData.email.trim()) {
      setError('Email wajib diisi');
      return;
    }
    if (!formData.provinsi.trim() || !formData.kota.trim() || !formData.kecamatan.trim()) {
      setError('Provinsi, Kota, dan Kecamatan wajib diisi');
      return;
    }
    if (!formData.kode_pos.trim() || !/^\d+$/.test(formData.kode_pos.trim())) {
      setError('Kode pos wajib diisi dan harus berupa angka');
      return;
    }
    if (!formData.alamat_lengkap.trim() || formData.alamat_lengkap.trim().length < 10) {
      setError('Alamat lengkap minimal 10 karakter');
      return;
    }

    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      addDummyAlamat(formData);
      router.push('/profil/alamat');
    } catch (err: any) {
      setError(err?.message || 'Gagal menyimpan alamat');
      setIsSaving(false);
    }
  };

  const handleMapConfirm = (location: { lat: number; lng: number }) => {
    setFormData((prev) => ({
      ...prev,
      latitude: location.lat.toString(),
      longitude: location.lng.toString(),
    }));
    setShowMapModal(false);
  };

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
          <h1 className="text-lg font-bold text-neutral-900">Tambah Alamat Baru</h1>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-2xl px-4">
        {error && <Alert type="error" message={error} className="mt-4" />}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* Label Alamat */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <label className="block text-sm font-bold text-neutral-900">Label Alamat</label>
            <div className="mt-3 grid grid-cols-4 gap-2">
              {(['Rumah', 'Kantor', 'Kos', 'Lainnya'] as const).map((label) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, label }))}
                  className={`rounded-lg border-2 px-3 py-2 text-sm font-bold transition ${
                    formData.label === label
                      ? 'border-primary-600 bg-primary-50 text-primary-700'
                      : 'border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Informasi Penerima */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <h2 className="text-sm font-bold text-neutral-900">Informasi Penerima</h2>
            <div className="mt-4 space-y-4">
              <Input
                label="Nama Penerima"
                value={formData.nama_penerima}
                onChange={(e) => setFormData((prev) => ({ ...prev, nama_penerima: e.target.value }))}
                required
              />
              <Input
                label="Nomor Telepon"
                value={formData.nomor_telepon}
                onChange={(e) => setFormData((prev) => ({ ...prev, nomor_telepon: e.target.value }))}
                placeholder="08xxxxxxxxxx"
                required
              />
              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>
          </div>

          {/* Alamat Lengkap */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <h2 className="text-sm font-bold text-neutral-900">Alamat</h2>
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Input
                  label="Provinsi"
                  value={formData.provinsi}
                  onChange={(e) => setFormData((prev) => ({ ...prev, provinsi: e.target.value }))}
                  required
                />
                <Input
                  label="Kota/Kabupaten"
                  value={formData.kota}
                  onChange={(e) => setFormData((prev) => ({ ...prev, kota: e.target.value }))}
                  required
                />
                <Input
                  label="Kecamatan"
                  value={formData.kecamatan}
                  onChange={(e) => setFormData((prev) => ({ ...prev, kecamatan: e.target.value }))}
                  required
                />
                <Input
                  label="Kelurahan (Opsional)"
                  value={formData.kelurahan || ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, kelurahan: e.target.value }))}
                />
                <Input
                  label="Kode Pos"
                  value={formData.kode_pos}
                  onChange={(e) => setFormData((prev) => ({ ...prev, kode_pos: e.target.value }))}
                  placeholder="12345"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Alamat Lengkap <span className="text-red-600">*</span>
                </label>
                <textarea
                  value={formData.alamat_lengkap}
                  onChange={(e) => setFormData((prev) => ({ ...prev, alamat_lengkap: e.target.value }))}
                  rows={3}
                  placeholder="Nama jalan, nomor rumah, blok, RT/RW, patokan"
                  className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                  required
                />
              </div>
            </div>
          </div>

          {/* Pin Lokasi */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <h2 className="text-sm font-bold text-neutral-900">Pin Lokasi (Opsional)</h2>
            <p className="mt-1 text-xs text-gray-600">Tandai lokasi alamat Anda di peta untuk pengiriman yang lebih akurat</p>
            <button
              type="button"
              onClick={() => setShowMapModal(true)}
              className="mt-3 w-full rounded-xl border-2 border-dashed border-primary-300 bg-primary-50 px-4 py-3 text-sm font-bold text-primary-700 transition hover:border-primary-400 hover:bg-primary-100"
            >
              {formData.latitude && formData.longitude ? (
                <>
                  <svg className="mx-auto mb-1 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Lokasi telah dipilih
                </>
              ) : (
                <>
                  <svg className="mx-auto mb-1 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Pilih Lokasi di Peta
                </>
              )}
            </button>
          </div>

          {/* Submit Button */}
          <div className="sticky bottom-0 border-t border-gray-200 bg-white p-4 -mx-4">
            <div className="mx-auto max-w-2xl">
              <button
                type="submit"
                disabled={isSaving}
                className="w-full rounded-xl bg-primary-600 px-6 py-3 text-base font-bold text-white transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSaving ? 'Menyimpan...' : 'Simpan Alamat'}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Map Modal */}
      <MapModal
        isOpen={showMapModal}
        onClose={() => setShowMapModal(false)}
        onSave={handleMapConfirm}
        initialLocation={
          formData.latitude && formData.longitude
            ? { lat: parseFloat(formData.latitude), lng: parseFloat(formData.longitude) }
            : undefined
        }
      />
    </div>
  );
}
