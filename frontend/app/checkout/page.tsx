'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useKeranjang } from '@/context/KeranjangContext';
import { useAuth } from '@/context/AuthContext';
import { createDummyPesanan, getDummyAlamatUtama, getDummyProfil, getDummyAlamatList, dummyProduk } from '@/lib/data/dummyData';
import { formatRupiah } from '@/lib/utils/formatRupiah';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import Loading from '@/components/common/Loading';
import Alert from '@/components/common/Alert';
import { MapComponent } from '@/components/map/MapComponent';
import { MapModal } from '@/components/map/MapModal';
import AddressSelector from '@/components/checkout/AddressSelector';
import { AlamatPengguna } from '@/types/pengguna.types';

type CheckoutMode = 'login' | 'register' | 'guest' | null;
type AuthModalMode = 'login' | 'register' | null;

export default function HalamanCheckout() {
  const router = useRouter();
  const { keranjang, loading: keranjangLoading, refreshKeranjang } = useKeranjang();
  const { token } = useAuth();
  const [mode, setMode] = useState<CheckoutMode>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<AuthModalMode>(null);

  // Handle direct buy from product card
  const [directBuyItem, setDirectBuyItem] = useState<{ produk_id: string; jumlah: number } | null>(null);

  useEffect(() => {
    // Check if there's a direct buy item
    if (typeof window !== 'undefined') {
      const directBuyData = window.localStorage.getItem('cermat-putra-direct-buy');
      if (directBuyData) {
        try {
          const parsed = JSON.parse(directBuyData);
          // Check if data is fresh (within 5 minutes)
          if (parsed.timestamp && Date.now() - parsed.timestamp < 5 * 60 * 1000) {
            setDirectBuyItem({ produk_id: parsed.produk_id, jumlah: parsed.jumlah });
          }
          // Clear the data
          window.localStorage.removeItem('cermat-putra-direct-buy');
        } catch (error) {
          console.error('Failed to parse direct buy data:', error);
        }
      }
    }
  }, []);

  const alamatUtama = useMemo(() => getDummyAlamatUtama(), []);
  const alamatList = useMemo(() => getDummyAlamatList(), []);
  const profil = useMemo(() => getDummyProfil(), []);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(alamatUtama?.id || null);

  const [selectedItemIds, setSelectedItemIds] = useState<string[] | null>(() => {
    if (typeof window === 'undefined') return null;
    const saved = window.localStorage.getItem('cermat-putra-cart-selected');
    if (!saved) return null;
    try {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed.filter((id: any) => typeof id === 'string') : null;
    } catch {
      return null;
    }
  });

  const [recipient, setRecipient] = useState({
    nama: profil.nama || '',
    email: profil.email || '',
    nomor_telepon: profil.nomor_telepon || '',
  });

  const [billing, setBilling] = useState({
    provinsi: alamatUtama?.provinsi || '',
    kota: alamatUtama?.kota || '',
    kecamatan: alamatUtama?.kecamatan || '',
    kelurahan: alamatUtama?.kelurahan || '',
    kode_pos: alamatUtama?.kode_pos || '',
    alamat_lengkap: alamatUtama?.alamat_lengkap || '',
    latitude: alamatUtama?.latitude || '',
    longitude: alamatUtama?.longitude || '',
  });

  const [mapModalOpen, setMapModalOpen] = useState(false);

  const [isGeocoding, setIsGeocoding] =
  useState(false);

  const billingLocation =
  billing.latitude.trim() !== '' &&
  billing.longitude.trim() !== ''
    ? {
        lat: Number(billing.latitude),
        lng: Number(billing.longitude),
      }
    : undefined;

  const isAddressReady =
    billing.provinsi.trim() !== '' &&
    billing.kota.trim() !== '' &&
    billing.kecamatan.trim() !== '' &&
    billing.kode_pos.trim() !== '' &&
    billing.alamat_lengkap.trim().length >= 10;

  // Reset GPS coordinates when official address changes
  useEffect(() => {
    setBilling((current) => {
      if (current.latitude === '' && current.longitude === '') {
        return current;
      }
      return {
        ...current,
        latitude: '',
        longitude: '',
      };
    });
  }, [
    billing.alamat_lengkap,
    billing.kelurahan,
    billing.kecamatan,
    billing.kota,
    billing.provinsi,
    billing.kode_pos,
  ]);

  // Forward geocoding with debounce and AbortController
  useEffect(() => {
    if (!isAddressReady) {
      setIsGeocoding(false);
      return;
    }

    let abortController: AbortController | null = null;

    const timeoutId = window.setTimeout(async () => {
      abortController = new AbortController();
      setIsGeocoding(true);

      try {
        const query = [
          billing.alamat_lengkap,
          billing.kelurahan,
          billing.kecamatan,
          billing.kota,
          billing.provinsi,
          billing.kode_pos,
          'Indonesia',
        ]
          .filter(Boolean)
          .join(', ');

        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(
            query
          )}&limit=1&countrycodes=id&accept-language=id`,
          {
            signal: abortController.signal,
            headers: {
              'User-Agent': 'CermatPutra/1.0',
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Forward geocoding gagal (${response.status})`);
        }

        const results = await response.json();

        if (!Array.isArray(results) || results.length === 0) {
          console.warn('Lokasi alamat tidak ditemukan:', query);
          return;
        }

        const result = results[0];
        const latitude = Number(result.lat);
        const longitude = Number(result.lon);

        if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
          throw new Error('Koordinat hasil geocoding tidak valid.');
        }

        setBilling((current) => ({
          ...current,
          latitude: latitude.toString(),
          longitude: longitude.toString(),
        }));
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }
        console.error('Forward geocoding error:', error);
      } finally {
        setIsGeocoding(false);
      }
    }, 1200);

    return () => {
      window.clearTimeout(timeoutId);
      if (abortController) {
        abortController.abort();
      }
    };
  }, [
    isAddressReady,
    billing.alamat_lengkap,
    billing.kelurahan,
    billing.kecamatan,
    billing.kota,
    billing.provinsi,
    billing.kode_pos,
  ]);

  const [jarakKm, setJarakKm] = useState<number>(10);
  const [shippingType, setShippingType] = useState<'regular' | 'express'>('regular');
  const [regularOption, setRegularOption] = useState('jne-reg');
  const [expressOption, setExpressOption] = useState('jne-express');

  const [paymentMethod, setPaymentMethod] = useState<'va' | 'cod'>('va');
  const [vaBank, setVaBank] = useState<'BCA VA' | 'BNI VA' | 'BRI VA' | 'Mandiri VA' | 'Permata VA'>('BCA VA');

  const [voucherCode, setVoucherCode] = useState('');
  const [voucherApplied, setVoucherApplied] = useState<null | { code: string; potongan: number }>(null);
  const [voucherError, setVoucherError] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const cartItems = useMemo(() => keranjang?.item ?? [], [keranjang]);
  const isInteractive = Boolean(token) || mode === 'guest';
  const isReadOnly = !isInteractive;

  const checkoutItems = useMemo(() => {
    // If there's a direct buy item, use that instead of cart
    if (directBuyItem) {
      const produk = dummyProduk.find((p) => p.id === directBuyItem.produk_id);
      if (produk) {
        return [
          {
            id: `direct-${produk.id}`,
            jumlah: directBuyItem.jumlah,
            produk: {
              id: produk.id,
              nama: produk.nama,
              harga: produk.harga,
              berat_gram: produk.berat_gram,
              gambar_url: produk.gambar_url,
            },
          },
        ];
      }
    }

    // Otherwise use cart items
    if (!selectedItemIds) return cartItems;
    if (selectedItemIds.length === 0) return [];
    const set = new Set(selectedItemIds);
    return cartItems.filter((item) => set.has(item.id));
  }, [cartItems, selectedItemIds, directBuyItem]);

  useEffect(() => {
    if (!token && mode !== 'guest') return;
    setRecipient((current) => ({
      ...current,
      nama: current.nama || profil.nama || '',
      email: current.email || profil.email || '',
      nomor_telepon: current.nomor_telepon || profil.nomor_telepon || '',
    }));
  }, [mode, profil.email, profil.nama, profil.nomor_telepon, token]);

  const handleAddressSelect = (address: AlamatPengguna) => {
    setSelectedAddressId(address.id);
    setBilling({
      provinsi: address.provinsi,
      kota: address.kota,
      kecamatan: address.kecamatan,
      kelurahan: address.kelurahan,
      kode_pos: address.kode_pos,
      alamat_lengkap: address.alamat_lengkap,
      latitude: address.latitude,
      longitude: address.longitude,
    });
    setRecipient({
      nama: address.nama_penerima,
      email: address.email || recipient.email,
      nomor_telepon: address.nomor_telepon,
    });
  };

  const errors = useMemo(() => {
    if (!isInteractive) return {};

    const next: Record<string, string> = {};
    const nama = recipient.nama.trim();
    const email = recipient.email.trim();
    const tel = recipient.nomor_telepon.trim();
    const prov = billing.provinsi.trim();
    const kota = billing.kota.trim();
    const kec = billing.kecamatan.trim();
    const alamat = billing.alamat_lengkap.trim();
    const kodePos = billing.kode_pos.trim();

    if (!nama) next.nama = 'Nama penerima wajib diisi';

    if (!email) next.email = 'Email wajib diisi';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = 'Format email tidak valid';

    if (!tel) next.nomor_telepon = 'Nomor handphone wajib diisi';
    else if (!/^\d+$/.test(tel)) next.nomor_telepon = 'Nomor handphone hanya angka';

    if (!prov) next.provinsi = 'Provinsi wajib diisi';
    if (!kota) next.kota = 'Kota / Kabupaten wajib diisi';
    if (!kec) next.kecamatan = 'Kecamatan wajib diisi';

    if (!alamat) next.alamat_lengkap = 'Alamat wajib diisi';
    else if (alamat.length < 10) next.alamat_lengkap = 'Alamat terlalu pendek';

    if (!kodePos) next.kode_pos = 'Kode pos wajib diisi';
    else if (!/^\d+$/.test(kodePos)) next.kode_pos = 'Kode pos hanya angka';

    return next;
  }, [billing.alamat_lengkap, billing.kecamatan, billing.kode_pos, billing.kota, billing.provinsi, isInteractive, recipient.email, recipient.nama, recipient.nomor_telepon]);

  const totalPotongan = voucherApplied?.potongan ?? 0;
  const subtotal = useMemo(() => {
    return checkoutItems.reduce((total, item) => total + item.produk.harga * item.jumlah, 0);
  }, [checkoutItems]);

  const regularOptions = useMemo(
    () => [
      { key: 'jne-reg', title: 'JNE REG', estimasi: 'Estimasi 2-3 Hari', ongkir: 18000, kurir: 'JNE', layanan: 'REG' },
      { key: 'jnt-reg', title: 'J&T REG', estimasi: 'Estimasi 2-4 Hari', ongkir: 16000, kurir: 'J&T', layanan: 'REG' },
      { key: 'jnt-cargo', title: 'J&T Cargo', estimasi: 'Estimasi 3-5 Hari', ongkir: 22000, kurir: 'J&T Cargo', layanan: 'CARGO' },
      { key: 'id-express', title: 'ID Express', estimasi: 'Estimasi 2-4 Hari', ongkir: 17000, kurir: 'ID Express', layanan: 'REG' },
    ],
    []
  );

  const expressOptions = useMemo(
    () => [
      { key: 'jne-express', title: 'JNE YES', estimasi: 'Estimasi 1-2 Hari', ongkir: 38000, kurir: 'JNE', layanan: 'YES' },
      { key: 'jnt-express', title: 'J&T Express', estimasi: 'Estimasi 1-2 Hari', ongkir: 36000, kurir: 'J&T', layanan: 'EXPRESS' },
      { key: 'id-express-fast', title: 'ID Express Fast', estimasi: 'Estimasi 1-2 Hari', ongkir: 37000, kurir: 'ID Express', layanan: 'FAST' },
    ],
    []
  );

  const shippingInfo = useMemo(() => {
    const distance = Math.max(0, Number.isFinite(jarakKm) ? jarakKm : 0);
    if (shippingType === 'express' && distance <= 50) {
      return { tipe: 'express' as const, kurir: 'Sopir Toko', layanan: null, estimasi: 'Estimasi 0-1 Hari', ongkir: 0 };
    }

    if (shippingType === 'express') {
      const found = expressOptions.find((item) => item.key === expressOption) || expressOptions[0];
      return { tipe: 'express' as const, kurir: found.kurir, layanan: found.layanan, estimasi: found.estimasi, ongkir: found.ongkir };
    }

    const found = regularOptions.find((item) => item.key === regularOption) || regularOptions[0];
    return { tipe: 'regular' as const, kurir: found.kurir, layanan: found.layanan, estimasi: found.estimasi, ongkir: found.ongkir };
  }, [expressOption, expressOptions, jarakKm, regularOption, regularOptions, shippingType]);

  const codAvailable = shippingInfo.kurir === 'Sopir Toko' && shippingType === 'express' && jarakKm <= 50;

  useEffect(() => {
    if (paymentMethod === 'cod' && !codAvailable) {
      setPaymentMethod('va');
    }
  }, [codAvailable, paymentMethod]);

  const ongkir = shippingInfo.ongkir;
  const totalBayar = Math.max(0, subtotal + ongkir - totalPotongan);
  const isContinueEnabled = isInteractive && checkoutItems.length > 0 && Object.keys(errors).length === 0;

  if (keranjangLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center min-h-[400px]">
          <Loading size="lg" />
        </div>
      </div>
    );
  }

  // Only show empty cart message if there's no direct buy item
  if (!directBuyItem && (!keranjang || cartItems.length === 0)) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Alert type="info" message="Keranjang belanja kosong" className="mb-4" />
        <div className="text-center">
          <Link href="/produk">
            <Button>Mulai Belanja</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (checkoutItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Alert type="info" message="Tidak ada produk yang dipilih untuk Checkout." className="mb-4" />
        <div className="text-center">
          <Link href="/keranjang">
            <Button>Kembali ke Keranjang</Button>
          </Link>
        </div>
      </div>
    );
  }

  const applyVoucher = () => {
    const code = voucherCode.trim().toUpperCase();
    setSuccess('');
    setError('');
    setVoucherError('');

    if (!code) {
      setVoucherApplied(null);
      return;
    }

    if (code === 'MAYANSNEW' || code === 'CPHEMAT') {
      setVoucherApplied({ code, potongan: 25000 });
      setSuccess(`Voucher ${code} berhasil digunakan`);
      return;
    }

    setVoucherApplied(null);
    setVoucherError('Voucher tidak valid');
  };

  const handleContinuePayment = async () => {
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 900));

      const checkoutIds = new Set(checkoutItems.map((item) => item.id));
      const nextSelected = (selectedItemIds ?? cartItems.map((item) => item.id)).filter((id) => !checkoutIds.has(id));
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('cermat-putra-cart-selected', JSON.stringify(nextSelected));
        setSelectedItemIds(nextSelected);
      }

      const pesanan = createDummyPesanan({
        items: checkoutItems,
        nama_penerima: recipient.nama.trim(),
        nomor_telepon: recipient.nomor_telepon.trim(),
        email: recipient.email.trim(),
        provinsi: billing.provinsi.trim(),
        kota: billing.kota.trim(),
        kecamatan: billing.kecamatan.trim(),
        kelurahan: billing.kelurahan.trim(),
        kode_pos: billing.kode_pos.trim(),
        alamat_lengkap: billing.alamat_lengkap.trim(),
        latitude: billing.latitude.trim(),
        longitude: billing.longitude.trim(),
        metode_pengiriman: shippingType,
        jarak_km: jarakKm,
        kurir: shippingInfo.kurir,
        layanan: shippingInfo.layanan,
        estimasi: shippingInfo.estimasi,
        metode_pembayaran: paymentMethod === 'va' ? 'VIRTUAL_ACCOUNT' : 'COD',
        bank_va: paymentMethod === 'va' ? vaBank : null,
        voucher: voucherApplied?.code || null,
        potongan: totalPotongan,
        ongkir,
        total_bayar: totalBayar,
      });
      await refreshKeranjang();
      router.push(`/pembayaran?id=${encodeURIComponent(pesanan.id)}`);
    } catch (err: any) {
      setError(err.message || 'Gagal melakukan checkout');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>

      {error && <Alert type="error" message={error} className="mb-6" />}
      {success && <Alert type="success" message={success} className="mb-6" />}

      {!token ? (
        <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-gray-700">Pilih cara checkout</p>
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
            <button
              type="button"
              onClick={() => {
                setAuthModalMode('login');
                setAuthModalOpen(true);
              }}
              className={`rounded-2xl border p-4 text-left transition ${
                mode === 'login' ? 'border-primary-500 bg-primary-50' : 'border-gray-200 bg-white hover:border-primary-200'
              }`}
            >
              <p className="text-sm font-bold text-neutral-900">Login</p>
              <p className="mt-1 text-xs text-gray-500">Masuk untuk checkout lebih cepat</p>
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthModalMode('register');
                setAuthModalOpen(true);
              }}
              className={`rounded-2xl border p-4 text-left transition ${
                mode === 'register' ? 'border-primary-500 bg-primary-50' : 'border-gray-200 bg-white hover:border-primary-200'
              }`}
            >
              <p className="text-sm font-bold text-neutral-900">Register</p>
              <p className="mt-1 text-xs text-gray-500">Buat akun baru dalam 1 menit</p>
            </button>
            <button
              type="button"
              onClick={() => setMode('guest')}
              className={`rounded-2xl border p-4 text-left transition ${
                mode === 'guest' ? 'border-primary-500 bg-primary-50' : 'border-gray-200 bg-white hover:border-primary-200'
              }`}
            >
              <p className="text-sm font-bold text-neutral-900">Guest</p>
              <p className="mt-1 text-xs text-gray-500">Checkout tanpa login</p>
            </button>
          </div>

          {/* Simple placeholder for modal - in production use a real modal component */}
          {authModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
              <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl mx-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {authModalMode === 'login' ? 'Login' : 'Register'}
                  </h2>
                  <button
                    onClick={() => {
                      setAuthModalOpen(false);
                      setAuthModalMode(null);
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <p className="text-gray-600 mb-6">
                  {authModalMode === 'login' 
                    ? 'Silakan login dengan akun Anda untuk melanjutkan checkout.' 
                    : 'Buat akun baru untuk checkout lebih cepat di masa depan.'}
                </p>
                <div className="space-y-3">
                  <Link href={`/${authModalMode}?redirect=/checkout`}>
                    <button
                      type="button"
                      onClick={() => setAuthModalOpen(false)}
                      className="w-full rounded-lg bg-primary-600 px-4 py-3 text-white font-semibold transition hover:bg-primary-700 active:bg-primary-800"
                    >
                      Buka Halaman {authModalMode === 'login' ? 'Login' : 'Register'}
                    </button>
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthModalOpen(false);
                      setAuthModalMode(null);
                    }}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-700 font-semibold transition hover:bg-gray-50"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : null}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2">
          <div className={`space-y-6 ${isReadOnly ? 'opacity-60' : ''}`}>
            <div className={`rounded-2xl border border-gray-200 bg-white p-6 shadow-sm ${isReadOnly ? 'pointer-events-none' : ''}`}>
              <h2 className="text-lg font-black text-neutral-900">Informasi Penerima</h2>
              <p className="mt-1 text-sm text-gray-500">Data penerima untuk kebutuhan pengiriman dan notifikasi.</p>

              <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                <Input
                  label="Nama Penerima"
                  value={recipient.nama}
                  onChange={(e) => setRecipient((c) => ({ ...c, nama: e.target.value }))}
                  placeholder={token ? 'Nama akan terisi otomatis' : 'Masukkan nama penerima'}
                  error={errors.nama}
                  disabled={token ? true : false}
                  required
                />
                <Input
                  label="Nomor Handphone"
                  value={recipient.nomor_telepon}
                  onChange={(e) => setRecipient((c) => ({ ...c, nomor_telepon: e.target.value }))}
                  placeholder="08xxxxxxxxxx"
                  error={errors.nomor_telepon}
                  required
                />
                <Input
                  label="Email"
                  type="email"
                  value={recipient.email}
                  onChange={(e) => setRecipient((c) => ({ ...c, email: e.target.value }))}
                  placeholder={token ? 'Email akan terisi otomatis' : 'email@example.com'}
                  error={errors.email}
                  disabled={token ? true : false}
                  required
                />
              </div>
            </div>

            {/* Address Selector - Shows saved addresses for logged in users */}
            {token && alamatList.length > 0 && (
              <AddressSelector
                selectedAddressId={selectedAddressId}
                onSelectAddress={handleAddressSelect}
              />
            )}

            {/* Billing Address - Only show for GUEST users */}
            {!token && mode === 'guest' && (
            <div className={`rounded-2xl border border-gray-200 bg-white p-6 shadow-sm ${isReadOnly ? 'pointer-events-none' : ''}`}>
              <h2 className="text-lg font-black text-neutral-900">Billing Address</h2>
              <p className="mt-1 text-sm text-gray-500">Alamat lengkap untuk pengiriman barang.</p>

              <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Provinsi */}
              <Input
                label="Provinsi"
                value={billing.provinsi}
                onChange={(e) =>
                  setBilling((current) => ({
                    ...current,
                    provinsi: e.target.value,
                  }))
                }
                placeholder="Masukkan provinsi"
                error={errors.provinsi}
                required
              />

              {/* Kota */}
              <Input
                label="Kota / Kabupaten"
                value={billing.kota}
                onChange={(e) =>
                  setBilling((current) => ({
                    ...current,
                    kota: e.target.value,
                  }))
                }
                placeholder="Masukkan kota / kabupaten"
                error={errors.kota}
                required
              />

              {/* Kecamatan */}
              <Input
                label="Kecamatan"
                value={billing.kecamatan}
                onChange={(e) =>
                  setBilling((current) => ({
                    ...current,
                    kecamatan: e.target.value,
                  }))
                }
                placeholder="Masukkan kecamatan"
                error={errors.kecamatan}
                required
              />

              {/* Kelurahan */}
              <Input
                label="Kelurahan (Opsional)"
                value={billing.kelurahan}
                onChange={(e) =>
                  setBilling((current) => ({
                    ...current,
                    kelurahan:
                      e.target.value,
                    latitude: '',
                    longitude: '',
                  }))
                }
                placeholder="Masukkan kelurahan"
              />

              {/* Kode Pos */}
              <Input
                label="Kode Pos"
                value={billing.kode_pos}
                onChange={(e) =>
                  setBilling((current) => ({
                    ...current,
                    kode_pos: e.target.value,
                  }))
                }
                placeholder="Masukkan kode pos"
                error={errors.kode_pos}
                required
              />
            </div>

              <div className="mt-4 space-y-1">
                <label htmlFor="alamat_lengkap" className="block text-sm font-medium text-gray-700">
                  Alamat Lengkap
                </label>
                <textarea
                  id="alamat_lengkap"
                  value={billing.alamat_lengkap}
                  onChange={(e) => {
                    setBilling((c) => ({ ...c, alamat_lengkap: e.target.value }));
                  }}
                  rows={3}
                  placeholder="Masukkan alamat lengkap"
                  className={`w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-primary-500 ${
                    errors.alamat_lengkap ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.alamat_lengkap ? <p className="text-sm text-red-500">{errors.alamat_lengkap}</p> : null}
              </div>

              {/* Latitude & Longitude fields (hidden, for data storage) */}
              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <Input
                  label="Latitude (Opsional)"
                  value={billing.latitude}
                  onChange={(e) => setBilling((c) => ({ ...c, latitude: e.target.value }))}
                  placeholder="Contoh: -6.2088"
                />
                <Input
                  label="Longitude (Opsional)"
                  value={billing.longitude}
                  onChange={(e) => setBilling((c) => ({ ...c, longitude: e.target.value }))}
                  placeholder="Contoh: 106.8456"
                />
              </div>

              {/* Map Component - NEW */}
              {billingLocation ? (
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lokasi Pengiriman
                </label>

                <div
                  onClick={() =>
                    setMapModalOpen(true)
                  }
                  className="cursor-pointer"
                >
                  <MapComponent
                    location={billingLocation}
                    onMapClick={() =>
                      setMapModalOpen(true)
                    }
                  />
                </div>

                <p className="mt-2 text-xs text-gray-500">
                  Klik peta untuk mengubah
                  titik lokasi pengiriman.
                </p>
              </div>
            ) : isAddressReady ? (
              <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 p-4">
                <p className="text-sm font-medium text-blue-800">
                  {isGeocoding
                    ? 'Sedang menentukan lokasi dari alamat...'
                    : 'Lokasi peta belum ditemukan.'}
                </p>

                <p className="mt-1 text-xs text-blue-700">
                  Sistem akan menampilkan peta
                  setelah koordinat alamat berhasil
                  ditemukan.
                </p>
              </div>
            ) : null}

            {/* Map Modal */}
            <MapModal
            isOpen={mapModalOpen}
            onClose={() =>
              setMapModalOpen(false)
            }
            initialLocation={billingLocation}
            onSave={(location) => {
              setBilling((current) => ({
                ...current,

                /**
                 * MAP HANYA BOLEH MENGUBAH
                 * latitude + longitude.
                 *
                 * Semua data alamat resmi
                 * dibiarkan utuh.
                 */
                latitude:
                  location.lat.toString(),

                longitude:
                  location.lng.toString(),
              }));

              setMapModalOpen(false);
            }}
          />
            </div>
            )}

            <div className={`rounded-2xl border border-gray-200 bg-white p-6 shadow-sm ${isReadOnly ? 'pointer-events-none' : ''}`}>
              <h2 className="text-lg font-black text-neutral-900">Shipping Method</h2>

              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setShippingType('regular')}
                  className={`rounded-2xl border p-4 text-left transition ${
                    shippingType === 'regular' ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-primary-200'
                  }`}
                >
                  <p className="text-sm font-bold text-neutral-900">Reguler</p>
                  <p className="mt-1 text-xs text-gray-500">Pilih ekspedisi reguler</p>
                </button>
                <button
                  type="button"
                  onClick={() => setShippingType('express')}
                  className={`rounded-2xl border p-4 text-left transition ${
                    shippingType === 'express' ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-primary-200'
                  }`}
                >
                  <p className="text-sm font-bold text-neutral-900">Express</p>
                  <p className="mt-1 text-xs text-gray-500">≤50 KM: Sopir Toko • &gt;50 KM: ekspedisi express</p>
                </button>
              </div>

              <div className="mt-5">
                <Input
                  label="Perkiraan Jarak (KM)"
                  type="number"
                  value={String(jarakKm)}
                  onChange={(e) => setJarakKm(Number(e.target.value))}
                  placeholder="Contoh: 10"
                />
              </div>

              {shippingType === 'regular' ? (
                <div className="mt-5 space-y-3">
                  {regularOptions.map((item) => (
                    <label
                      key={item.key}
                      className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition ${
                        regularOption === item.key ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-primary-200'
                      }`}
                    >
                      <input
                        type="radio"
                        name="regular-option"
                        checked={regularOption === item.key}
                        onChange={() => setRegularOption(item.key)}
                        className="mt-1 h-5 w-5 accent-primary-600"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-black text-neutral-900">{item.title}</p>
                        <p className="mt-1 text-xs text-gray-500">{item.estimasi}</p>
                      </div>
                      <p className="text-sm font-black text-neutral-900">{formatRupiah(item.ongkir)}</p>
                    </label>
                  ))}
                </div>
              ) : jarakKm <= 50 ? (
                <div className="mt-5 rounded-2xl border border-green-200 bg-green-50 p-4">
                  <p className="text-sm font-black text-neutral-900">Sopir Toko</p>
                  <p className="mt-1 text-xs text-gray-600">Pengiriman oleh tim toko untuk jarak ≤ 50 KM.</p>
                  <p className="mt-2 text-sm font-black text-neutral-900">{formatRupiah(0)}</p>
                </div>
              ) : (
                <div className="mt-5 space-y-3">
                  {expressOptions.map((item) => (
                    <label
                      key={item.key}
                      className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition ${
                        expressOption === item.key ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-primary-200'
                      }`}
                    >
                      <input
                        type="radio"
                        name="express-option"
                        checked={expressOption === item.key}
                        onChange={() => setExpressOption(item.key)}
                        className="mt-1 h-5 w-5 accent-primary-600"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-black text-neutral-900">{item.title}</p>
                        <p className="mt-1 text-xs text-gray-500">{item.estimasi}</p>
                      </div>
                      <p className="text-sm font-black text-neutral-900">{formatRupiah(item.ongkir)}</p>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className={`rounded-2xl border border-gray-200 bg-white p-6 shadow-sm ${isReadOnly ? 'pointer-events-none' : ''}`}>
              <h2 className="text-lg font-black text-neutral-900">Payment Method</h2>
              <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('va')}
                  className={`rounded-2xl border p-4 text-left transition ${
                    paymentMethod === 'va' ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-primary-200'
                  }`}
                >
                  <p className="text-sm font-bold text-neutral-900">Virtual Account</p>
                  <p className="mt-1 text-xs text-gray-500">BCA / BNI / BRI / Mandiri / Permata</p>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  disabled={!codAvailable}
                  className={`rounded-2xl border p-4 text-left transition disabled:cursor-not-allowed disabled:opacity-60 ${
                    paymentMethod === 'cod' ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-primary-200'
                  }`}
                >
                  <p className="text-sm font-bold text-neutral-900">COD</p>
                  <p className="mt-1 text-xs text-gray-500">Hanya untuk jarak ≤ 50 KM &amp; Sopir Toko</p>
                </button>
              </div>

              {paymentMethod === 'va' ? (
                <div className="mt-5 space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Bank Virtual Account</label>
                  <select
                    value={vaBank}
                    onChange={(e) => setVaBank(e.target.value as any)}
                    className="h-12 w-full rounded-xl border border-gray-300 bg-white px-3 text-sm font-semibold text-neutral-900 outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="BCA VA">BCA VA</option>
                    <option value="BNI VA">BNI VA</option>
                    <option value="BRI VA">BRI VA</option>
                    <option value="Mandiri VA">Mandiri VA</option>
                    <option value="Permata VA">Permata VA</option>
                  </select>
                  <p className="text-xs text-gray-500">Simulasi frontend. Nanti backend/Midtrans akan membuat nomor VA sesuai bank.</p>
                </div>
              ) : null}
            </div>

            <div className={`rounded-2xl border border-gray-200 bg-white p-6 shadow-sm ${isReadOnly ? 'pointer-events-none' : ''}`}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-black text-neutral-900">Voucher</h2>
                  <p className="mt-1 text-sm text-gray-500">Masukkan kode voucher untuk mendapatkan potongan harga.</p>
                </div>
                {!token ? (
                  <div className="rounded-lg bg-orange-50 px-3 py-2 text-right">
                    <svg className="h-5 w-5 text-orange-600 mx-auto mb-1" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                    </svg>
                    <p className="text-xs text-orange-700 font-medium">Login/Register untuk voucher</p>
                  </div>
                ) : null}
              </div>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <Input
                  label="Kode Voucher"
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value)}
                  placeholder="Contoh: CPHEMAT"
                />
                <Button type="button" onClick={applyVoucher} className="sm:mt-[26px] sm:w-auto">
                  Gunakan
                </Button>
              </div>
              
              {/* Voucher error message - directly below button */}
              {voucherError ? (
                <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                  <p className="text-sm font-semibold text-red-700">✗ {voucherError}</p>
                </div>
              ) : null}
              
              {/* Voucher success message */}
              {voucherApplied ? (
                <div className="mt-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3">
                  <p className="text-sm font-semibold text-green-700">
                    ✓ Voucher {voucherApplied.code} aktif • Potongan {formatRupiah(voucherApplied.potongan)}
                  </p>
                </div>
              ) : null}
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-black text-neutral-900">Produk</h2>
              <div className="mt-5 space-y-4">
                {checkoutItems.map((item) => (
                  <div key={item.id} className="flex gap-4 rounded-2xl border border-gray-200 bg-white p-4">
                    <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100">
                      {item.produk.gambar_url ? (
                        <Image src={item.produk.gambar_url} alt={item.produk.nama} fill className="object-cover" />
                      ) : null}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-sm font-black text-neutral-900">{item.produk.nama}</p>
                      <p className="mt-1 text-sm font-black text-primary-600">{formatRupiah(item.produk.harga)}</p>
                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs font-semibold text-gray-600">
                        <span>Jumlah: {item.jumlah}</span>
                        <span>Variasi: -</span>
                        <span>Berat: {Math.max(0, Math.round(item.produk.berat_gram / 10) / 100)} kg</span>
                      </div>
                    </div>
                    <p className="text-sm font-black text-neutral-900">{formatRupiah(item.produk.harga * item.jumlah)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {isReadOnly ? (
            <div className="mt-6 rounded-2xl border border-primary-200 bg-primary-50 p-5 text-sm text-primary-800">
              Pilih Login, Register, atau Guest untuk mengaktifkan seluruh form checkout.
            </div>
          ) : null}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md p-6 sticky top-24 lg:top-32 max-h-[calc(100vh-6rem)] lg:max-h-[calc(100vh-8rem)] overflow-y-auto border border-gray-200 z-20">
            <h3 className="font-bold text-gray-800 text-lg mb-4">Ringkasan Pesanan</h3>

            <div className="border-t pt-4 space-y-2 mb-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{formatRupiah(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Ongkir</span>
                <span>{formatRupiah(ongkir)}</span>
              </div>
              {voucherApplied ? (
                <div className="flex justify-between text-gray-600">
                  <span>Voucher</span>
                  <span>-{formatRupiah(totalPotongan)}</span>
                </div>
              ) : null}
            </div>

            <div className="border-t pt-4 mb-6">
              <div className="flex justify-between font-bold text-gray-800 text-lg">
                <span>Total</span>
                <span className="text-primary-600">{formatRupiah(totalBayar)}</span>
              </div>
            </div>

            <Button
              className="w-full"
              isLoading={isSubmitting}
              disabled={isSubmitting || !isContinueEnabled || !codAvailable && paymentMethod === 'cod'}
              onClick={handleContinuePayment}
            >
              Lanjut Pembayaran
            </Button>
            {isInteractive && Object.keys(errors).length > 0 ? (
              <p className="mt-3 text-xs text-red-600">Lengkapi data penerima dan billing address sebelum lanjut.</p>
            ) : null}
            {!token && mode !== 'guest' ? <p className="mt-3 text-xs text-gray-500">Pilih Guest untuk mengaktifkan form checkout.</p> : null}
          </div>
        </div>
      </div>
    </div>
  );
}
