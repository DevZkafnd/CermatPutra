'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import AdminPage from '@/components/admin/common/AdminPage';
import DataTable, { type ColumnDef } from '@/components/admin/common/DataTable';
import Pagination from '@/components/admin/common/Pagination';
import StatusBadge from '@/components/admin/common/StatusBadge';
import ConfirmModal from '@/components/admin/common/ConfirmModal';
import IntegrationNote from '@/components/admin/common/IntegrationNote';
import TableSkeleton from '@/components/admin/common/TableSkeleton';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import ProductFormModal from '@/components/admin/produk/ProductFormModal';
import ProductDetailModal from '@/components/admin/produk/ProductDetailModal';
import { ADMIN_STORAGE_KEYS, dummyProducts, formatCurrencyID, formatDateID, loadFromStorage, saveToStorage } from '@/lib/data/adminDummyData';
import { AdminProduk } from '@/types/admin.types';

export default function AdminProdukPage() {
  const [loading, setLoading] = useState(true);
  const [hydrated, setHydrated] = useState(false);
  const [items, setItems] = useState<AdminProduk[]>(dummyProducts);
  const [keyword, setKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');
  const [halaman, setHalaman] = useState(1);
  const [confirmDelete, setConfirmDelete] = useState<AdminProduk | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formInitial, setFormInitial] = useState<Omit<AdminProduk, 'dibuat_pada'> | null>(null);
  const [detailItem, setDetailItem] = useState<AdminProduk | null>(null);

  useEffect(() => {
    const saved = loadFromStorage<AdminProduk[]>(ADMIN_STORAGE_KEYS.products, dummyProducts);
    setItems(saved);
    setHydrated(true);
    window.setTimeout(() => setLoading(false), 280);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveToStorage(ADMIN_STORAGE_KEYS.products, items);
  }, [items, hydrated]);

  const filtered = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    return items.filter((item) => {
      const matchKeyword = !q || item.nama.toLowerCase().includes(q) || item.sku.toLowerCase().includes(q);
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

  const columns: Array<ColumnDef<AdminProduk>> = useMemo(
    () => [
      {
        header: 'Thumbnail',
        className: 'w-[96px] whitespace-nowrap',
        cell: (row) => (
          <div className="relative h-12 w-12 overflow-hidden rounded-xl bg-gray-100">
            {row.thumbnail_url ? <Image src={row.thumbnail_url} alt={row.nama} fill className="object-cover" /> : null}
          </div>
        ),
      },
      { header: 'Nama Produk', className: 'min-w-[240px]', cell: (row) => <p className="font-bold text-neutral-900">{row.nama}</p> },
      { header: 'SKU', className: 'min-w-[140px] whitespace-nowrap', cell: (row) => <span className="font-semibold text-gray-600">{row.sku}</span> },
      { header: 'Kategori', className: 'min-w-[140px] whitespace-nowrap', cell: (row) => <span className="font-semibold text-gray-600">{row.kategori}</span> },
      { header: 'Harga', className: 'min-w-[160px] whitespace-nowrap', cell: (row) => <span className="font-black text-primary-600">{formatCurrencyID(row.harga)}</span> },
      { header: 'Stock', className: 'min-w-[110px] whitespace-nowrap', cell: (row) => <span className="font-bold text-gray-700">{row.stock}</span> },
      { header: 'Status', className: 'min-w-[140px] whitespace-nowrap', cell: (row) => <StatusBadge value={row.status} /> },
      { header: 'Dibuat', className: 'min-w-[140px] whitespace-nowrap', cell: (row) => <span className="font-semibold text-gray-600">{formatDateID(row.dibuat_pada)}</span> },
      {
        header: 'Aksi',
        className: 'min-w-[240px] whitespace-nowrap',
        cell: (row) => (
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setDetailItem(row)}
              className="inline-flex h-9 items-center justify-center rounded-xl border border-gray-200 px-3 text-xs font-bold text-gray-700 transition hover:border-primary-200 hover:text-primary-700"
            >
              Detail
            </button>
            <button
              type="button"
              onClick={() => setConfirmDelete(row)}
              className="inline-flex h-9 items-center justify-center rounded-xl border border-red-200 px-3 text-xs font-bold text-red-600 transition hover:bg-red-50"
            >
              Hapus
            </button>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <AdminPage title="Kelola Produk">
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-gray-500">Produk</p>
            <p className="mt-2 text-sm font-semibold text-gray-600">UI only (dummy). Siap untuk integrasi API Produk nantinya.</p>
            <IntegrationNote text="TODO: Integrasi API Produk" />
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <Input
              label="Search"
              placeholder="Cari nama / SKU..."
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
                  thumbnail_url: null,
                  nama: '',
                  sku: '',
                  kategori: '',
                  harga: 0,
                  stock: 0,
                  status: 'ACTIVE',
                  deskripsi: '',
                });
                setFormOpen(true);
              }}
            >
              Tambah Produk
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {loading ? (
          <TableSkeleton rows={8} columns={8} />
        ) : (
          <>
            <DataTable columns={columns} data={paged} emptyText="Belum ada produk." />
            <Pagination halaman={halaman} totalHalaman={totalHalaman} onChange={setHalaman} />
          </>
        )}
      </div>

      <ConfirmModal
        open={Boolean(confirmDelete)}
        title="Apakah Anda yakin ingin menghapus produk ini?"
        description="Data yang sudah dihapus tidak dapat dikembalikan."
        danger
        confirmLabel="Ya, Hapus"
        onClose={() => setConfirmDelete(null)}
        onConfirm={() => {
          if (!confirmDelete) return;
          setItems((current) => current.filter((item) => item.id !== confirmDelete.id));
          setDetailItem((current) => (current?.id === confirmDelete.id ? null : current));
          setConfirmDelete(null);
        }}
      />

      <ProductFormModal
        open={formOpen}
        initial={formInitial}
        onClose={() => {
          setFormOpen(false);
          setFormInitial(null);
        }}
        onSubmit={(data) => {
          setItems((current) => {
            if (!data.id) {
              const nextId = String(Math.max(...current.map((x) => Number(x.id)), 0) + 1);
              const newItem: AdminProduk = { ...data, id: nextId, dibuat_pada: new Date().toISOString() };
              return [newItem, ...current];
            }
            return current.map((item) => (item.id === data.id ? { ...item, ...data } : item));
          });
          setFormOpen(false);
          setFormInitial(null);
        }}
      />

      <ProductDetailModal
        open={Boolean(detailItem)}
        item={detailItem}
        onClose={() => setDetailItem(null)}
        onDelete={() => {
          if (!detailItem) return;
          setConfirmDelete(detailItem);
        }}
        onSave={(next) => {
          setItems((current) => current.map((item) => (item.id === next.id ? { ...item, ...next } : item)));
          setDetailItem((current) => (current?.id === next.id ? { ...current, ...next } : current));
        }}
      />
    </AdminPage>
  );
}
