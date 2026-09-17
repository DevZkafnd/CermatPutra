'use client';

import { useEffect, useState } from 'react';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Modal from '@/components/admin/common/Modal';
import { AdminProduk } from '@/types/admin.types';

type Draft = Omit<AdminProduk, 'dibuat_pada'>;

export default function ProductFormModal({
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
            <p className="text-lg font-black text-neutral-900">{draft.id ? 'Edit Produk' : 'Tambah Produk'}</p>
            <p className="mt-1 text-sm font-semibold text-gray-600">UI only (dummy). Siap untuk integrasi API nantinya.</p>
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
          <Input label="Nama Produk" value={draft.nama} onChange={(e) => setDraft((c) => (c ? { ...c, nama: e.target.value } : c))} />
          <Input label="SKU" value={draft.sku} onChange={(e) => setDraft((c) => (c ? { ...c, sku: e.target.value } : c))} />
          <Input label="Kategori" value={draft.kategori} onChange={(e) => setDraft((c) => (c ? { ...c, kategori: e.target.value } : c))} />
          <Input
            label="Harga"
            type="number"
            value={String(draft.harga)}
            onChange={(e) => setDraft((c) => (c ? { ...c, harga: Number(e.target.value) } : c))}
          />
          <Input
            label="Stock"
            type="number"
            value={String(draft.stock)}
            onChange={(e) => setDraft((c) => (c ? { ...c, stock: Number(e.target.value) } : c))}
          />
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              value={draft.status}
              onChange={(e) => setDraft((c) => (c ? { ...c, status: e.target.value as any } : c))}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
          </div>
          <Input
            label="Thumbnail URL (opsional)"
            value={draft.thumbnail_url || ''}
            onChange={(e) => setDraft((c) => (c ? { ...c, thumbnail_url: e.target.value || null } : c))}
            className="md:col-span-2"
          />
          <div className="space-y-1 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Deskripsi</label>
            <textarea
              value={draft.deskripsi}
              onChange={(e) => setDraft((c) => (c ? { ...c, deskripsi: e.target.value } : c))}
              rows={4}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Tulis deskripsi singkat produk..."
            />
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button
            onClick={() => {
              onSubmit(draft);
            }}
          >
            Simpan
          </Button>
        </div>
      </div>
    </Modal>
  );
}
