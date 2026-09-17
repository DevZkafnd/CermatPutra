'use client';

import { useEffect, useState } from 'react';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Modal from '@/components/admin/common/Modal';
import { AdminCustomer } from '@/types/admin.types';

type Draft = Omit<AdminCustomer, 'tanggal_bergabung'>;

export default function CustomerFormModal({
  open,
  initial,
  onClose,
  onSubmit,
}: {
  open: boolean;
  initial: Draft | null;
  onClose: () => void;
  onSubmit: (data: Draft) => void;
}) {
  const [draft, setDraft] = useState<Draft | null>(initial);

  useEffect(() => {
    setDraft(initial);
  }, [initial]);

  if (!open || !draft) return null;

  return (
    <Modal open={open} onClose={onClose} maxWidthClassName="max-w-2xl">
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-lg font-black text-neutral-900">{draft.id ? 'Edit Pelanggan' : 'Tambah Pelanggan'}</p>
            <p className="mt-1 text-sm font-semibold text-gray-600">UI only (dummy). Siap untuk integrasi API Customer nantinya.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-gray-200 text-gray-700 transition hover:border-primary-200 hover:text-primary-700"
            aria-label="Tutup"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input label="Nama" value={draft.nama} onChange={(e) => setDraft((c) => (c ? { ...c, nama: e.target.value } : c))} />
          <Input label="Email" value={draft.email} onChange={(e) => setDraft((c) => (c ? { ...c, email: e.target.value } : c))} />
          <Input
            label="Nomor HP"
            value={draft.nomor_hp}
            onChange={(e) => setDraft((c) => (c ? { ...c, nomor_hp: e.target.value } : c))}
          />
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Status Member</label>
            <select
              value={draft.status_member}
              onChange={(e) => setDraft((c) => (c ? { ...c, status_member: e.target.value as any } : c))}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="REGULAR">REGULAR</option>
              <option value="SILVER">SILVER</option>
              <option value="GOLD">GOLD</option>
              <option value="PLATINUM">PLATINUM</option>
            </select>
          </div>
          <Input
            label="Alamat"
            value={draft.alamat}
            onChange={(e) => setDraft((c) => (c ? { ...c, alamat: e.target.value } : c))}
            className="md:col-span-2"
          />
          <Input
            label="Total Order"
            type="number"
            value={String(draft.total_order)}
            onChange={(e) => setDraft((c) => (c ? { ...c, total_order: Number(e.target.value) } : c))}
          />
          <Input
            label="Foto URL (opsional)"
            value={draft.foto_url || ''}
            onChange={(e) => setDraft((c) => (c ? { ...c, foto_url: e.target.value || null } : c))}
          />
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button onClick={() => onSubmit(draft)}>Simpan</Button>
        </div>
      </div>
    </Modal>
  );
}
