'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Modal from '@/components/admin/common/Modal';
import StatusBadge from '@/components/admin/common/StatusBadge';
import { formatCurrencyID, formatDateID } from '@/lib/data/adminDummyData';
import { AdminProduk } from '@/types/admin.types';

type Draft = Omit<AdminProduk, 'dibuat_pada'>;

export default function ProductDetailModal({
  open,
  item,
  onClose,
  onSave,
  onDelete,
}: {
  open: boolean;
  item: AdminProduk | null;
  onClose: () => void;
  onSave: (next: Draft) => void;
  onDelete: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Draft | null>(null);

  useEffect(() => {
    if (!open || !item) return;
    setEditing(false);
    setDraft({
      id: item.id,
      thumbnail_url: item.thumbnail_url,
      nama: item.nama,
      sku: item.sku,
      kategori: item.kategori,
      harga: item.harga,
      stock: item.stock,
      status: item.status,
      deskripsi: item.deskripsi,
    });
  }, [open, item]);

  const createdLabel = useMemo(() => (item ? formatDateID(item.dibuat_pada) : '-'), [item]);

  if (!open || !item || !draft) return null;

  return (
    <Modal open={open} onClose={onClose} maxWidthClassName="max-w-3xl">
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-lg font-black text-neutral-900">Detail Produk</p>
            <p className="mt-1 text-sm font-semibold text-gray-600">{draft.nama}</p>
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

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-[220px_1fr]">
          <div className="space-y-3">
            <div className="relative aspect-square overflow-hidden rounded-3xl bg-gray-100">
              {draft.thumbnail_url ? <Image src={draft.thumbnail_url} alt={draft.nama} fill className="object-cover" /> : null}
              {!draft.thumbnail_url ? (
                <div className="flex h-full w-full items-center justify-center text-sm font-black text-gray-400">No Image</div>
              ) : null}
            </div>
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-gray-500">Status</p>
              <div className="mt-3">
                <StatusBadge value={draft.status} />
              </div>
              <p className="mt-3 text-xs font-semibold text-gray-600">Dibuat: {createdLabel}</p>
            </div>
          </div>

          {!editing ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="rounded-2xl border border-gray-200 bg-white p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.25em] text-gray-500">SKU</p>
                  <p className="mt-2 text-sm font-black text-neutral-900">{draft.sku}</p>
                </div>
                <div className="rounded-2xl border border-gray-200 bg-white p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.25em] text-gray-500">Kategori</p>
                  <p className="mt-2 text-sm font-black text-neutral-900">{draft.kategori}</p>
                </div>
                <div className="rounded-2xl border border-gray-200 bg-white p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.25em] text-gray-500">Harga</p>
                  <p className="mt-2 text-sm font-black text-primary-600">{formatCurrencyID(draft.harga)}</p>
                </div>
                <div className="rounded-2xl border border-gray-200 bg-white p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.25em] text-gray-500">Stock</p>
                  <p className="mt-2 text-sm font-black text-neutral-900">{draft.stock}</p>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-4">
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-gray-500">Deskripsi</p>
                <p className="mt-2 whitespace-pre-line text-sm font-semibold text-gray-700">{draft.deskripsi || '-'}</p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <Button variant="danger" onClick={onDelete}>
                  Hapus
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditing(true);
                  }}
                >
                  Ubah
                </Button>
                <Button variant="outline" onClick={onClose}>
                  Tutup
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
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
                    rows={5}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditing(false);
                    setDraft({
                      id: item.id,
                      thumbnail_url: item.thumbnail_url,
                      nama: item.nama,
                      sku: item.sku,
                      kategori: item.kategori,
                      harga: item.harga,
                      stock: item.stock,
                      status: item.status,
                      deskripsi: item.deskripsi,
                    });
                  }}
                >
                  Batal
                </Button>
                <Button
                  onClick={() => {
                    onSave(draft);
                    setEditing(false);
                  }}
                >
                  Simpan
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}

