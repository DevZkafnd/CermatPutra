'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import Loading from '@/components/common/Loading';
import Alert from '@/components/common/Alert';
import { getDummyProfil, saveDummyProfil } from '@/lib/data/dummyData';
import { ProfilPenggunaLocal, JenisKelamin } from '@/types/pengguna.types';
import { maskPhone, maskEmail } from '@/lib/utils/maskData';
import EditNameModal from '@/components/profil/EditNameModal';
import GenderSelector from '@/components/profil/GenderSelector';
import PhoneOTPModal from '@/components/profil/PhoneOTPModal';
import EmailOTPModal from '@/components/profil/EmailOTPModal';

export default function HalamanProfil() {
  const router = useRouter();
  const { token, logout } = useAuth();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [profil, setProfil] = useState<ProfilPenggunaLocal | null>(null);
  
  // Modal states
  const [showEditName, setShowEditName] = useState(false);
  const [showGenderSelector, setShowGenderSelector] = useState(false);
  const [showPhoneOTP, setShowPhoneOTP] = useState(false);
  const [showEmailOTP, setShowEmailOTP] = useState(false);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    const savedProfil = getDummyProfil();
    setProfil(savedProfil);
    setLoading(false);
  }, [token]);

  if (!token) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert type="info" message="Harap login terlebih dahulu" className="mb-4" />
        <div className="text-center">
          <Link href="/login" className="inline-block rounded-xl bg-primary-600 px-6 py-3 font-bold text-white hover:bg-primary-700">
            Login
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex min-h-[400px] items-center justify-center">
          <Loading size="lg" />
        </div>
      </div>
    );
  }

  if (error || !profil) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert type="error" message={error || 'Gagal memuat profil'} />
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const fotoPreview = profil.foto_data_url || null;

  const handleUploadFoto = () => {
    fileInputRef.current?.click();
  };

  const handleFotoPicked = async (file: File) => {
    try {
      const reader = new FileReader();
      const dataUrl = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(String(reader.result || ''));
        reader.onerror = () => reject(new Error('Gagal membaca file'));
        reader.readAsDataURL(file);
      });

      const nextProfil: ProfilPenggunaLocal = { ...profil, foto_data_url: dataUrl };
      saveDummyProfil(nextProfil);
      setProfil(nextProfil);
      setSuccess('Foto profil berhasil diperbarui');
    } catch (err: any) {
      setError(err?.message || 'Gagal mengupload foto');
    }
  };

  const handleSaveName = (newName: string) => {
    const nextProfil: ProfilPenggunaLocal = { ...profil, nama: newName };
    saveDummyProfil(nextProfil);
    setProfil(nextProfil);
    setSuccess('Nama berhasil diperbarui');
  };

  const handleSaveGender = (gender: JenisKelamin) => {
    const nextProfil: ProfilPenggunaLocal = { ...profil, jenis_kelamin: gender };
    saveDummyProfil(nextProfil);
    setProfil(nextProfil);
    setSuccess('Jenis kelamin berhasil diperbarui');
  };

  const handlePhoneVerified = (newPhone: string) => {
    const nextProfil: ProfilPenggunaLocal = { ...profil, nomor_telepon: newPhone };
    saveDummyProfil(nextProfil);
    setProfil(nextProfil);
    setSuccess('Nomor telepon berhasil diperbarui');
  };

  const handleEmailVerified = (newEmail: string, subscribeNewsletter: boolean) => {
    const nextProfil: ProfilPenggunaLocal = { ...profil, email: newEmail };
    saveDummyProfil(nextProfil);
    setProfil(nextProfil);
    
    if (subscribeNewsletter) {
      setSuccess('Email berhasil diperbarui dan Anda telah berlangganan newsletter');
    } else {
      setSuccess('Email berhasil diperbarui');
    }
  };

  const handlePhoneClick = () => {
    setShowPhoneOTP(true);
  };

  const handleEmailClick = () => {
    setShowEmailOTP(true);
  };

  const handleAlamatClick = () => {
    router.push('/profil/alamat');
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
          <h1 className="text-lg font-bold text-neutral-900">Ubah Profil</h1>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-2xl px-4">
        {/* Alerts */}
        {error && <Alert type="error" message={error} className="mt-4" />}
        {success && <Alert type="success" message={success} className="mt-4" />}

        {/* Photo Section */}
        <div className="mt-6 flex flex-col items-center gap-3 rounded-2xl border border-gray-200 bg-white p-6">
          <div className="relative h-24 w-24 overflow-hidden rounded-full bg-gray-100">
            {fotoPreview ? (
              <Image src={fotoPreview} alt="Foto profil" fill className="object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-3xl font-black text-primary-600">
                {profil.nama.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={handleUploadFoto}
            className="rounded-full border-2 border-primary-600 px-6 py-2 text-sm font-bold text-primary-600 transition hover:bg-primary-50"
          >
            Ubah
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) {
                handleFotoPicked(file);
                event.target.value = '';
              }
            }}
          />
        </div>

        {/* Profile Fields */}
        <div className="mt-4 space-y-2">
          {/* Nama */}
          <button
            type="button"
            onClick={() => setShowEditName(true)}
            className="flex w-full items-center justify-between rounded-2xl border border-gray-200 bg-white px-5 py-4 text-left transition hover:border-gray-300"
          >
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-600">Nama</p>
              <p className="mt-1 truncate text-base font-bold text-neutral-900">{profil.nama}</p>
            </div>
            <svg className="ml-3 h-5 w-5 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Jenis Kelamin */}
          <button
            type="button"
            onClick={() => setShowGenderSelector(true)}
            className="flex w-full items-center justify-between rounded-2xl border border-gray-200 bg-white px-5 py-4 text-left transition hover:border-gray-300"
          >
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-600">Jenis Kelamin</p>
              <p className="mt-1 truncate text-base font-bold text-neutral-900">
                {profil.jenis_kelamin || 'Belum diatur'}
              </p>
            </div>
            <svg className="ml-3 h-5 w-5 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* No. Handphone */}
          <button
            type="button"
            onClick={handlePhoneClick}
            className="flex w-full items-center justify-between rounded-2xl border border-gray-200 bg-white px-5 py-4 text-left transition hover:border-gray-300"
          >
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-600">No. Handphone</p>
              <p className="mt-1 truncate text-base font-bold text-neutral-900">
                {profil.nomor_telepon ? maskPhone(profil.nomor_telepon) : 'Belum diatur'}
              </p>
            </div>
            <svg className="ml-3 h-5 w-5 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Email */}
          <button
            type="button"
            onClick={handleEmailClick}
            className="flex w-full items-center justify-between rounded-2xl border border-gray-200 bg-white px-5 py-4 text-left transition hover:border-gray-300"
          >
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-600">Email</p>
              <p className="mt-1 truncate text-base font-bold text-neutral-900">
                {maskEmail(profil.email)}
              </p>
            </div>
            <svg className="ml-3 h-5 w-5 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Alamat Saya */}
          <button
            type="button"
            onClick={handleAlamatClick}
            className="flex w-full items-center justify-between rounded-2xl border border-gray-200 bg-white px-5 py-4 text-left transition hover:border-gray-300"
          >
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-600">Alamat Saya</p>
              <p className="mt-1 text-base font-bold text-neutral-900">Kelola alamat</p>
            </div>
            <svg className="ml-3 h-5 w-5 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Logout Button */}
        <div className="mt-6">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full rounded-xl border-2 border-red-600 bg-white px-6 py-3 text-base font-bold text-red-600 transition hover:bg-red-50"
          >
            Keluar
          </button>
        </div>
      </div>

      {/* Modals */}
      <EditNameModal
        isOpen={showEditName}
        currentName={profil.nama}
        onClose={() => setShowEditName(false)}
        onSave={handleSaveName}
      />
      <GenderSelector
        isOpen={showGenderSelector}
        currentGender={profil.jenis_kelamin || null}
        onClose={() => setShowGenderSelector(false)}
        onConfirm={handleSaveGender}
      />
      <PhoneOTPModal
        isOpen={showPhoneOTP}
        currentPhone={profil.nomor_telepon}
        onClose={() => setShowPhoneOTP(false)}
        onVerified={handlePhoneVerified}
      />
      <EmailOTPModal
        isOpen={showEmailOTP}
        currentEmail={profil.email}
        onClose={() => setShowEmailOTP(false)}
        onVerified={handleEmailVerified}
      />
    </div>
  );
}
