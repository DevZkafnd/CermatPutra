'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import Alert from '@/components/common/Alert';

export default function FormRegister() {
  const [namaDepan, setNamaDepan] = useState('');
  const [namaBelakang, setNamaBelakang] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nomorTelepon, setNomorTelepon] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Combine first and last name for backend
      const namaLengkap = `${namaDepan.trim()} ${namaBelakang.trim()}`.trim();
      
      await register({
        nama: namaLengkap,
        email,
        kata_sandi: password,
        nomor_telepon: nomorTelepon,
      });
      router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registrasi gagal');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Daftar</h1>
        <p className="text-gray-600">Buat akun baru</p>
      </div>

      {error && <Alert type="error" message={error} className="mb-4" />}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Nama Depan"
            type="text"
            value={namaDepan}
            onChange={(e) => setNamaDepan(e.target.value)}
            required
            placeholder="Masukkan nama depan"
          />
          <Input
            label="Nama Belakang"
            type="text"
            value={namaBelakang}
            onChange={(e) => setNamaBelakang(e.target.value)}
            required
            placeholder="Masukkan nama belakang"
          />
        </div>
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="email@example.com"
        />
        <Input
          label="Nomor Telepon"
          type="tel"
          value={nomorTelepon}
          onChange={(e) => setNomorTelepon(e.target.value)}
          required
          placeholder="081234567890"
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="Masukkan password"
        />
        <Button type="submit" isLoading={isLoading} className="w-full">
          Daftar
        </Button>
      </form>
    </div>
  );
}
