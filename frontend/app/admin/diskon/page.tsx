'use client';

import { useEffect, useMemo, useState } from 'react';
import AdminPage from '@/components/admin/common/AdminPage';
import DataTable, { type ColumnDef } from '@/components/admin/common/DataTable';
import Pagination from '@/components/admin/common/Pagination';
import StatusBadge from '@/components/admin/common/StatusBadge';
import ConfirmModal from '@/components/admin/common/ConfirmModal';
import IntegrationNote from '@/components/admin/common/IntegrationNote';
import TableSkeleton from '@/components/admin/common/TableSkeleton';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import VoucherFormModal from '@/components/admin/diskon/VoucherFormModal';
import { dummyDiscounts, formatCurrencyID, formatDateID, loadFromStorage, saveToStorage } from '@/lib/data/adminDummyData';
import { AdminVoucher } from '@/types/admin.types';

const STORAGE_KEY = 'cermat-putra-admin-discounts';

export default function AdminDiskonPage() {
  const [loading, setLoading] = useState(true);
  const [hydrated, setHydrated] = useState(false);
  const [items, setItems] = useState<AdminVoucher[]>(dummyDiscounts);
  const [keyword, setKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');
  const [halaman, setHalaman] = useState(1);
  const [confirmDelete, setConfirmDelete] = useState<AdminVoucher | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formInitial, setFormInitial] = useState<(Omit<AdminVoucher, 'tanggal_berlaku'> & { tanggal_berlaku: string }) | null>(null);

  useEffect(() => {
    setItems(loadFromStorage<AdminVoucher[]>(STORAGE_KEY, dummyDiscounts));
    setHydrated(true);
    window.setTimeout(() => setLoading(false), 260);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveToStorage(STORAGE_KEY, items);
  }, [items, hydrated]);

  const filtered = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    return items.filter((item) => {
      const matchKeyword = !q || item.nama.toLowerCase().includes(q) || item.kode.toLowerCase().includes(q);
      const matchStatus = statusFilter === 'ALL' ? true : item.status === statusFilter;
      return matchKeyword && matchStatus;
    });
  }, [items, keyword, statusFilter]);

  const batas = 10;
  const totalHalaman = Math.max(1, Math.ceil(filtered.length / batas));
  const paged = useMemo(() => filtered.slice((halaman - 1) * batas, halaman * batas), [filtered, halaman]);

  useEffect(() => {
    setHalaman(1);
  }, [keyword, statusFilter]);

  const columns: Array<ColumnDef<AdminVoucher>> = useMemo(
    () => [
      { header: 'Nama', cell: (row) => <p className="font-black text-neutral-900">{row.nama}</p> },
      { header: 'Kode', cell: (row) => <span className="font-bold text-gray-700">{row.kode}</span> },
      { header: 'Jenis', cell: (row) => <span className="font-semibold text-gray-600">{row.tipe}</span> },
      {
        header: 'Nilai',
        cell: (row) => (
          <span className="font-black text-primary-600">
            {row.tipe === 'PERSENTASE' ? `${row.persentase || 0}%` : formatCurrencyID(row.nominal || 0)}
          </span>
        ),
      },
      { header: 'Min Belanja', cell: (row) => <span className="font-semibold text-gray-700">{formatCurrencyID(row.minimal_belanja)}</span> },
      {
        header: 'Max Diskon',
        cell: (row) => <span className="font-semibold text-gray-700">{row.maksimal_diskon ? formatCurrencyID(row.maksimal_diskon) : '-'}</span>,
      },
      { header: 'Status', cell: (row) => <StatusBadge value={row.status} /> },
      { header: 'Berlaku', cell: (row) => <span className="font-semibold text-gray-600">{formatDateID(row.tanggal_berlaku)}</span> },
      {
        header: 'Aksi',
        className: 'w-[220px]',
        cell: (row) => (
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                setFormInitial({
                  ...row,
                  tanggal_berlaku: row.tanggal_berlaku,
                });
                setFormOpen(true);
              }}
              className="inline-flex h-9 items-center justify-center rounded-xl bg-neutral-900 px-3 text-xs font-bold text-white transition hover:bg-primary-600"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => setConfirmDelete(row)}
              className="inline-flex h-9 items-center justify-center rounded-xl border border-red-200 px-3 text-xs font-bold text-red-600 transition hover:bg-red-50"
            >
              Delete
            </button>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <AdminPage title="Kelola Diskon">
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-gray-500">Voucher</p>
            <p className="mt-2 text-sm font-semibold text-gray-600">Diskon hanya berlaku untuk customer login (UI preparation).</p>
            <IntegrationNote text="TODO: Integrasi API Voucher" />
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <Input
              label="Search"
              placeholder="Cari nama / kode..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="sm:w-64"
            />
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Filter Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm font-semibold text-gray-700 outline-none focus:ring-2 focus:ring-primary-500 sm:w-44"
              >
                <option value="ALL">Semua</option>
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </div>
            <Button
              onClick={() => {
                setFormInitial({
                  id: '',
                  nama: '',
                  kode: '',
                  tipe: 'PERSENTASE',
                  persentase: 10,
                  nominal: undefined,
                  minimal_belanja: 0,
                  maksimal_diskon: 0,
                  status: 'ACTIVE',
                  tanggal_berlaku: new Date().toISOString(),
                });
                setFormOpen(true);
              }}
            >
              Tambah Voucher
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {loading ? (
          <TableSkeleton rows={8} columns={8} />
        ) : (
          <>
            <DataTable columns={columns} data={paged} emptyText="Belum ada voucher." />
            <Pagination halaman={halaman} totalHalaman={totalHalaman} onChange={setHalaman} />
          </>
        )}
      </div>

      <ConfirmModal
        open={Boolean(confirmDelete)}
        title="Apakah Anda yakin ingin menghapus voucher ini?"
        description="Data yang sudah dihapus tidak dapat dikembalikan."
        danger
        confirmLabel="Ya, Hapus"
        onClose={() => setConfirmDelete(null)}
        onConfirm={() => {
          if (!confirmDelete) return;
          setItems((current) => current.filter((item) => item.id !== confirmDelete.id));
          setConfirmDelete(null);
        }}
      />

      <VoucherFormModal
        open={formOpen}
        initial={formInitial}
        onClose={() => {
          setFormOpen(false);
          setFormInitial(null);
        }}
        onSubmit={(data) => {
          setItems((current) => {
            if (!data.id) {
              const next: AdminVoucher = { ...data, id: `v-${Date.now()}`, tanggal_berlaku: data.tanggal_berlaku };
              return [next, ...current];
            }
            return current.map((item) => (item.id === data.id ? { ...item, ...data } : item));
          });
          setFormOpen(false);
          setFormInitial(null);
        }}
      />
    </AdminPage>
  );
}
