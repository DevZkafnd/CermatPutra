'use client';

import { useEffect, useState } from 'react';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Modal from '@/components/admin/common/Modal';
import { AdminVoucher } from '@/types/admin.types';

type Draft = Omit<AdminVoucher, 'tanggal_berlaku'> & { tanggal_berlaku: string };

export default function VoucherFormModal({
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
            <p className="text-lg font-black text-neutral-900">{draft.id ? 'Edit Voucher' : 'Tambah Voucher'}</p>
            <p className="mt-1 text-sm font-semibold text-gray-600">UI only (dummy). Siap untuk integrasi API Voucher nantinya.</p>
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
          <Input label="Nama Voucher" value={draft.nama} onChange={(e) => setDraft((c) => (c ? { ...c, nama: e.target.value } : c))} />
          <Input label="Kode Voucher" value={draft.kode} onChange={(e) => setDraft((c) => (c ? { ...c, kode: e.target.value.toUpperCase() } : c))} />

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Jenis</label>
            <select
              value={draft.tipe}
              onChange={(e) =>
                setDraft((c) =>
                  c
                    ? {
                        ...c,
                        tipe: e.target.value as any,
                      }
                    : c
                )
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="PERSENTASE">PERSENTASE</option>
              <option value="NOMINAL">NOMINAL</option>
            </select>
          </div>

          {draft.tipe === 'PERSENTASE' ? (
            <Input
              label="Persentase (%)"
              type="number"
              value={String(draft.persentase || 0)}
              onChange={(e) => setDraft((c) => (c ? { ...c, persentase: Number(e.target.value), nominal: undefined } : c))}
            />
          ) : (
            <Input
              label="Nominal (Rp)"
              type="number"
              value={String(draft.nominal || 0)}
              onChange={(e) => setDraft((c) => (c ? { ...c, nominal: Number(e.target.value), persentase: undefined, maksimal_diskon: undefined } : c))}
            />
          )}

          <Input
            label="Minimal Belanja"
            type="number"
            value={String(draft.minimal_belanja)}
            onChange={(e) => setDraft((c) => (c ? { ...c, minimal_belanja: Number(e.target.value) } : c))}
          />

          <Input
            label="Maksimal Diskon (opsional)"
            type="number"
            value={draft.maksimal_diskon ? String(draft.maksimal_diskon) : ''}
            onChange={(e) => setDraft((c) => (c ? { ...c, maksimal_diskon: e.target.value ? Number(e.target.value) : undefined } : c))}
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
            label="Tanggal Berlaku"
            type="date"
            value={draft.tanggal_berlaku.slice(0, 10)}
            onChange={(e) => setDraft((c) => (c ? { ...c, tanggal_berlaku: new Date(e.target.value).toISOString() } : c))}
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
