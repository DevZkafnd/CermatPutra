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
import InventoryFormModal from '@/components/admin/inventory/InventoryFormModal';
import InventoryDetailModal from '@/components/admin/inventory/InventoryDetailModal';
import {
  ADMIN_STORAGE_KEYS,
  dummyInventory,
  dummyProducts,
  formatCurrencyID,
  formatDateID,
  loadFromStorage,
  saveToStorage,
} from '@/lib/data/adminDummyData';
import { AdminInventoryItem, AdminProduk } from '@/types/admin.types';

export default function AdminInventoryPage() {
  const [loading, setLoading] = useState(true);
  const [hydrated, setHydrated] = useState(false);
  const [inventory, setInventory] = useState<AdminInventoryItem[]>(dummyInventory);
  const [products, setProducts] = useState<AdminProduk[]>(dummyProducts);
  const [keyword, setKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'DRAFT' | 'READY'>('ALL');
  const [halaman, setHalaman] = useState(1);
  const [confirmPublish, setConfirmPublish] = useState<AdminInventoryItem | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<AdminInventoryItem | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formInitial, setFormInitial] = useState<Omit<AdminInventoryItem, 'dibuat_pada'> | null>(null);
  const [detailItem, setDetailItem] = useState<AdminInventoryItem | null>(null);

  useEffect(() => {
    setInventory(loadFromStorage(ADMIN_STORAGE_KEYS.inventory, dummyInventory));
    setProducts(loadFromStorage(ADMIN_STORAGE_KEYS.products, dummyProducts));
    setHydrated(true);
    window.setTimeout(() => setLoading(false), 280);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveToStorage(ADMIN_STORAGE_KEYS.inventory, inventory);
  }, [inventory, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    saveToStorage(ADMIN_STORAGE_KEYS.products, products);
  }, [products, hydrated]);

  const filtered = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    return inventory.filter((item) => {
      const matchKeyword = !q || item.nama.toLowerCase().includes(q) || item.sku.toLowerCase().includes(q);
      const matchStatus = statusFilter === 'ALL' ? true : item.status === statusFilter;
      return matchKeyword && matchStatus;
    });
  }, [inventory, keyword, statusFilter]);

  const batas = 10;
  const totalHalaman = Math.max(1, Math.ceil(filtered.length / batas));
  const paged = useMemo(() => filtered.slice((halaman - 1) * batas, halaman * batas), [filtered, halaman]);

  useEffect(() => {
    setHalaman(1);
  }, [keyword, statusFilter]);

  const columns: Array<ColumnDef<AdminInventoryItem>> = useMemo(
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
        className: 'min-w-[320px] whitespace-nowrap',
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
              onClick={() => setConfirmPublish(row)}
              disabled={row.status !== 'READY'}
              className="inline-flex h-9 items-center justify-center rounded-xl bg-neutral-900 px-3 text-xs font-bold text-white transition hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Publish
            </button>
            <button
              type="button"
              onClick={() => {
                setConfirmDelete(row);
              }}
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
    <AdminPage title="Kelola Inventory">
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-gray-500">Inventory</p>
            <p className="mt-2 text-sm font-semibold text-gray-600">
              Produk di Inventory tidak tampil di website pelanggan. Publish mensimulasikan pemindahan item ke daftar Produk (dummy state).
            </p>
            <IntegrationNote text="TODO: Integrasi API Inventory" />
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
                <option value="DRAFT">DRAFT</option>
                <option value="READY">READY</option>
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
                  status: 'DRAFT',
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
            <DataTable columns={columns} data={paged} emptyText="Belum ada produk di inventory." />
            <Pagination halaman={halaman} totalHalaman={totalHalaman} onChange={setHalaman} />
          </>
        )}
      </div>

      <ConfirmModal
        open={Boolean(confirmPublish)}
        title="Publish produk?"
        description={confirmPublish ? `Item "${confirmPublish.nama}" akan dipindahkan dari Inventory ke daftar Produk.` : undefined}
        confirmLabel="Publish"
        onClose={() => setConfirmPublish(null)}
        onConfirm={() => {
          if (!confirmPublish) return;
          const target = confirmPublish;
          setInventory((current) => current.filter((item) => item.id !== target.id));
          setProducts((current) => {
            const nextId = String(Math.max(...current.map((x) => Number(x.id)), 0) + 1);
            const next: AdminProduk = {
              id: nextId,
              thumbnail_url: target.thumbnail_url,
              nama: target.nama,
              sku: target.sku,
              kategori: target.kategori,
              harga: target.harga,
              stock: target.stock,
              status: 'ACTIVE',
              deskripsi: target.deskripsi,
              dibuat_pada: new Date().toISOString(),
            };
            return [next, ...current];
          });
          setConfirmPublish(null);
        }}
      />

      <ConfirmModal
        open={Boolean(confirmDelete)}
        title="Apakah Anda yakin ingin menghapus produk ini?"
        description="Data yang sudah dihapus tidak dapat dikembalikan."
        danger
        confirmLabel="Ya, Hapus"
        onClose={() => setConfirmDelete(null)}
        onConfirm={() => {
          if (!confirmDelete) return;
          setInventory((current) => current.filter((item) => item.id !== confirmDelete.id));
          setDetailItem((current) => (current?.id === confirmDelete.id ? null : current));
          setConfirmDelete(null);
        }}
      />

      <InventoryFormModal
        open={formOpen}
        initial={formInitial}
        onClose={() => {
          setFormOpen(false);
          setFormInitial(null);
        }}
        onSubmit={(data) => {
          setInventory((current) => {
            const nextId = data.id || `inv-${Date.now()}`;
            const next: AdminInventoryItem = { ...data, id: nextId, dibuat_pada: new Date().toISOString() };
            return [next, ...current];
          });
          setFormOpen(false);
          setFormInitial(null);
        }}
      />

      <InventoryDetailModal
        open={Boolean(detailItem)}
        item={detailItem}
        onClose={() => setDetailItem(null)}
        onDelete={() => {
          if (!detailItem) return;
          setConfirmDelete(detailItem);
        }}
        onSave={(next) => {
          setInventory((current) => current.map((item) => (item.id === next.id ? { ...item, ...next } : item)));
          setDetailItem((current) => (current?.id === next.id ? { ...current, ...next } : current));
        }}
      />
    </AdminPage>
  );
}
