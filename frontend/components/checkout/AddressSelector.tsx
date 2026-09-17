'use client';

import { useState, useEffect } from 'react';
import { AlamatPengguna } from '@/types/pengguna.types';
import { getDummyAlamatList, setDummyAlamatUtama, addDummyAlamat } from '@/lib/data/dummyData';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { MapComponent } from '@/components/map/MapComponent';
import { MapModal } from '@/components/map/MapModal';

interface AddressSelectorProps {
  selectedAddressId: string | null;
  onSelectAddress: (address: AlamatPengguna) => void;
}

type ModalView = 'list' | 'add';

export default function AddressSelector({ selectedAddressId, onSelectAddress }: AddressSelectorProps) {
  const [addresses, setAddresses] = useState<AlamatPengguna[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalView, setModalView] = useState<ModalView>('list');

  // Add Address Form State
  const [newAddress, setNewAddress] = useState({
    label: '',
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

  const [mapModalOpen, setMapModalOpen] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadedAddresses = getDummyAlamatList();
    setAddresses(loadedAddresses);
  }, []);

  const selectedAddress = addresses.find((addr) => addr.id === selectedAddressId) || addresses.find((addr) => addr.is_utama) || addresses[0];

  const handleSelectAddress = (address: AlamatPengguna) => {
    setDummyAlamatUtama(address.id);
    setAddresses(getDummyAlamatList());
    onSelectAddress(address);
    setIsModalOpen(false);
    setModalView('list');
  };

  const handleOpenAddAddress = () => {
    setModalView('add');
    // Reset form
    setNewAddress({
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
    setFormErrors({});
  };

  const handleBackToList = () => {
    setModalView('list');
    setFormErrors({});
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!newAddress.nama_penerima.trim()) errors.nama_penerima = 'Nama penerima wajib diisi';
    if (!newAddress.nomor_telepon.trim()) errors.nomor_telepon = 'Nomor telepon wajib diisi';
    else if (!/^\d+$/.test(newAddress.nomor_telepon)) errors.nomor_telepon = 'Nomor hanya angka';
    
    if (!newAddress.provinsi) errors.provinsi = 'Provinsi wajib diisi';
    if (!newAddress.kota) errors.kota = 'Kota wajib diisi';
    if (!newAddress.kecamatan) errors.kecamatan = 'Kecamatan wajib diisi';
    if (!newAddress.kode_pos) errors.kode_pos = 'Kode pos wajib diisi';
    
    if (!newAddress.alamat_lengkap.trim()) errors.alamat_lengkap = 'Alamat lengkap wajib diisi';
    else if (newAddress.alamat_lengkap.trim().length < 10) errors.alamat_lengkap = 'Alamat terlalu pendek';

    return errors;
  };

  const handleSaveAddress = () => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // Save address
    const savedAddresses = addDummyAlamat({
      label: newAddress.label || 'Rumah',
      nama_penerima: newAddress.nama_penerima.trim(),
      nomor_telepon: newAddress.nomor_telepon.trim(),
      email: newAddress.email.trim(),
      provinsi: newAddress.provinsi,
      kota: newAddress.kota,
      kecamatan: newAddress.kecamatan,
      kelurahan: newAddress.kelurahan,
      kode_pos: newAddress.kode_pos,
      alamat_lengkap: newAddress.alamat_lengkap.trim(),
      latitude: newAddress.latitude,
      longitude: newAddress.longitude,
    });

    // Reload addresses
    const reloadedAddresses = getDummyAlamatList();
    setAddresses(reloadedAddresses);

    // Select the newly added address
    const newlyAdded = reloadedAddresses[reloadedAddresses.length - 1];
    if (newlyAdded) {
      setDummyAlamatUtama(newlyAdded.id);
      onSelectAddress(newlyAdded);
    }

    // Return to list view
    setModalView('list');
  };

  const billingLocation =
    newAddress.latitude.trim() !== '' &&
    newAddress.longitude.trim() !== ''
      ? {
          lat: Number(newAddress.latitude),
          lng: Number(newAddress.longitude),
        }
      : undefined;

  const isAddressReady =
    newAddress.provinsi.trim() !== '' &&
    newAddress.kota.trim() !== '' &&
    newAddress.kecamatan.trim() !== '' &&
    newAddress.kode_pos.trim() !== '' &&
    newAddress.alamat_lengkap.trim().length >= 10;

  if (!selectedAddress && addresses.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-black text-neutral-900">Alamat Pengiriman</h2>
        <div className="mt-4 rounded-xl border border-orange-200 bg-orange-50 p-4">
          <p className="text-sm font-semibold text-orange-800">Tidak ada alamat tersimpan</p>
          <p className="mt-1 text-xs text-orange-700">Tambahkan alamat pengiriman terlebih dahulu.</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setIsModalOpen(true);
            handleOpenAddAddress();
          }}
          className="mt-4 w-full rounded-xl bg-primary-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-primary-700"
        >
          Tambah Alamat
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-lg font-black text-neutral-900">Alamat Pengiriman</h2>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="text-sm font-bold text-primary-600 transition hover:text-primary-700"
          >
            Ubah
          </button>
        </div>

        {/* Shopee-style address display */}
        {selectedAddress && (
          <div className="mt-4 rounded-xl border border-primary-200 bg-primary-50/30 p-4">
            <div className="flex items-start gap-3">
              <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-black text-neutral-900">{selectedAddress.nama_penerima}</p>
                  <span className="text-sm font-semibold text-gray-500">|</span>
                  <p className="text-sm font-semibold text-gray-700">{selectedAddress.nomor_telepon}</p>
                  {selectedAddress.is_utama && (
                    <span className="inline-flex items-center rounded-full border border-primary-500 bg-primary-50 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-primary-700">
                      Utama
                    </span>
                  )}
                  {selectedAddress.label && (
                    <span className="inline-flex items-center rounded-full border border-gray-300 bg-white px-2 py-0.5 text-[10px] font-bold text-gray-600">
                      {selectedAddress.label}
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-gray-700">
                  {selectedAddress.alamat_lengkap}
                  {selectedAddress.kelurahan && `, ${selectedAddress.kelurahan}`}
                  {`, ${selectedAddress.kecamatan}, ${selectedAddress.kota}, ${selectedAddress.provinsi}, ${selectedAddress.kode_pos}`}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Address Selection/Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              {modalView === 'add' && (
                <button
                  type="button"
                  onClick={handleBackToList}
                  className="inline-flex items-center gap-2 text-sm font-bold text-gray-700 transition hover:text-gray-900"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Kembali
                </button>
              )}
              <h3 className={`text-lg font-black text-neutral-900 ${modalView === 'list' ? '' : 'ml-auto mr-auto'}`}>
                {modalView === 'list' ? 'Pilih Alamat Pengiriman' : 'Tambah Alamat'}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  setModalView('list');
                }}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
                aria-label="Tutup"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="max-h-[calc(90vh-180px)] overflow-y-auto p-6">
              {modalView === 'list' ? (
                // Address List View
                <div className="space-y-3">
                  {addresses.map((address) => {
                    const isSelected = address.id === selectedAddress?.id;
                    return (
                      <button
                        key={address.id}
                        type="button"
                        onClick={() => handleSelectAddress(address)}
                        className={`w-full rounded-xl border-2 p-4 text-left transition ${
                          isSelected
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 bg-white hover:border-primary-200 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {/* Radio indicator */}
                          <div className={`mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 ${
                            isSelected ? 'border-primary-600 bg-primary-600' : 'border-gray-300 bg-white'
                          }`}>
                            {isSelected && (
                              <div className="h-2 w-2 rounded-full bg-white"></div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="text-sm font-black text-neutral-900">{address.nama_penerima}</p>
                              <span className="text-sm font-semibold text-gray-400">|</span>
                              <p className="text-sm font-semibold text-gray-700">{address.nomor_telepon}</p>
                              {address.is_utama && (
                                <span className="inline-flex items-center rounded-full border border-primary-500 bg-primary-100 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-primary-700">
                                  Utama
                                </span>
                              )}
                              {address.label && (
                                <span className="inline-flex items-center rounded-full border border-gray-300 bg-gray-50 px-2 py-0.5 text-[10px] font-bold text-gray-600">
                                  {address.label}
                                </span>
                              )}
                            </div>
                            <p className="mt-2 text-sm leading-relaxed text-gray-600">
                              {address.alamat_lengkap}
                              {address.kelurahan && `, ${address.kelurahan}`}
                              {`, ${address.kecamatan}, ${address.kota}, ${address.provinsi}, ${address.kode_pos}`}
                            </p>
                          </div>

                          {/* Checkmark for selected */}
                          {isSelected && (
                            <svg className="mt-1 h-6 w-6 flex-shrink-0 text-primary-600" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                            </svg>
                          )}
                        </div>
                      </button>
                    );
                  })}

                  {addresses.length === 0 && (
                    <div className="rounded-xl border border-gray-200 bg-gray-50 p-8 text-center">
                      <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <p className="mt-3 text-sm font-semibold text-gray-600">Belum ada alamat tersimpan</p>
                    </div>
                  )}
                </div>
              ) : (
                // Add Address Form View
                <div className="space-y-4">
                  <Input
                    label="Label Alamat"
                    value={newAddress.label}
                    onChange={(e) => setNewAddress((c) => ({ ...c, label: e.target.value }))}
                    placeholder="Rumah / Kantor / Lainnya"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Nama Penerima"
                      value={newAddress.nama_penerima}
                      onChange={(e) => setNewAddress((c) => ({ ...c, nama_penerima: e.target.value }))}
                      placeholder="Nama lengkap penerima"
                      error={formErrors.nama_penerima}
                      required
                    />
                    <Input
                      label="Nomor Telepon"
                      value={newAddress.nomor_telepon}
                      onChange={(e) => setNewAddress((c) => ({ ...c, nomor_telepon: e.target.value }))}
                      placeholder="08xxxxxxxxxx"
                      error={formErrors.nomor_telepon}
                      required
                    />
                  </div>

                  <Input
                    label="Email (Opsional)"
                    type="email"
                    value={newAddress.email}
                    onChange={(e) => setNewAddress((c) => ({ ...c, email: e.target.value }))}
                    placeholder="email@example.com"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Provinsi"
                      value={newAddress.provinsi}
                      onChange={(e) => setNewAddress((c) => ({ ...c, provinsi: e.target.value }))}
                      placeholder="Masukkan provinsi"
                      error={formErrors.provinsi}
                      required
                    />

                    <Input
                      label="Kota / Kabupaten"
                      value={newAddress.kota}
                      onChange={(e) => setNewAddress((c) => ({ ...c, kota: e.target.value }))}
                      placeholder="Masukkan kota / kabupaten"
                      error={formErrors.kota}
                      required
                    />

                    <Input
                      label="Kecamatan"
                      value={newAddress.kecamatan}
                      onChange={(e) => setNewAddress((c) => ({ ...c, kecamatan: e.target.value }))}
                      placeholder="Masukkan kecamatan"
                      error={formErrors.kecamatan}
                      required
                    />

                    <Input
                      label="Kelurahan (Opsional)"
                      value={newAddress.kelurahan}
                      onChange={(e) => setNewAddress((c) => ({ ...c, kelurahan: e.target.value }))}
                      placeholder="Masukkan kelurahan"
                    />

                    <Input
                      label="Kode Pos"
                      value={newAddress.kode_pos}
                      onChange={(e) => setNewAddress((c) => ({ ...c, kode_pos: e.target.value }))}
                      placeholder="Masukkan kode pos"
                      error={formErrors.kode_pos}
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="alamat_lengkap" className="block text-sm font-medium text-gray-700">
                      Alamat Lengkap <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="alamat_lengkap"
                      value={newAddress.alamat_lengkap}
                      onChange={(e) => setNewAddress((c) => ({ ...c, alamat_lengkap: e.target.value }))}
                      rows={3}
                      placeholder="Nama jalan, nomor rumah, RT/RW, patokan"
                      className={`w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-primary-500 ${
                        formErrors.alamat_lengkap ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.alamat_lengkap && <p className="text-sm text-red-500">{formErrors.alamat_lengkap}</p>}
                  </div>

                  {/* Map Component */}
                  {billingLocation && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Lokasi Pengiriman
                      </label>
                      <div onClick={() => setMapModalOpen(true)} className="cursor-pointer">
                        <MapComponent location={billingLocation} onMapClick={() => setMapModalOpen(true)} />
                      </div>
                      <p className="mt-2 text-xs text-gray-500">Klik peta untuk mengubah titik lokasi</p>
                    </div>
                  )}

                  {/* Map Modal */}
                  <MapModal
                    isOpen={mapModalOpen}
                    onClose={() => setMapModalOpen(false)}
                    initialLocation={billingLocation}
                    onSave={(location) => {
                      setNewAddress((current) => ({
                        ...current,
                        latitude: location.lat.toString(),
                        longitude: location.lng.toString(),
                      }));
                      setMapModalOpen(false);
                    }}
                  />
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-200 px-6 py-4">
              {modalView === 'list' ? (
                <button
                  type="button"
                  onClick={handleOpenAddAddress}
                  className="w-full rounded-xl bg-primary-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-primary-700"
                >
                  Tambah Alamat
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSaveAddress}
                  className="w-full rounded-xl bg-primary-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-primary-700"
                >
                  Simpan
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
