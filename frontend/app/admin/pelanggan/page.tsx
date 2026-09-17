'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import AdminPage from '@/components/admin/common/AdminPage';
import DataTable, { type ColumnDef } from '@/components/admin/common/DataTable';
import Pagination from '@/components/admin/common/Pagination';
import StatusBadge from '@/components/admin/common/StatusBadge';
import ConfirmModal from '@/components/admin/common/ConfirmModal';
import IntegrationNote from '@/components/admin/common/IntegrationNote';
import TableSkeleton from '@/components/admin/common/TableSkeleton';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import CustomerFormModal from '@/components/admin/pelanggan/CustomerFormModal';
import { dummyCustomers, formatDateID, loadFromStorage, saveToStorage } from '@/lib/data/adminDummyData';
import { AdminCustomer } from '@/types/admin.types';

const STORAGE_KEY = 'cermat-putra-admin-customers';

export default function AdminPelangganPage() {
  const [loading, setLoading] = useState(true);
  const [hydrated, setHydrated] = useState(false);
  const [items, setItems] = useState<AdminCustomer[]>(dummyCustomers);
  const [keyword, setKeyword] = useState('');
  const [memberFilter, setMemberFilter] = useState<'ALL' | AdminCustomer['status_member']>('ALL');
  const [halaman, setHalaman] = useState(1);
  const [confirmDelete, setConfirmDelete] = useState<AdminCustomer | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formInitial, setFormInitial] = useState<Omit<AdminCustomer, 'tanggal_bergabung'> | null>(null);

  useEffect(() => {
    setItems(loadFromStorage<AdminCustomer[]>(STORAGE_KEY, dummyCustomers));
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
      const matchKeyword = !q || item.nama.toLowerCase().includes(q) || item.email.toLowerCase().includes(q);
      const matchMember = memberFilter === 'ALL' ? true : item.status_member === memberFilter;
      return matchKeyword && matchMember;
    });
  }, [items, keyword, memberFilter]);

  const batas = 10;
  const totalHalaman = Math.max(1, Math.ceil(filtered.length / batas));
  const paged = useMemo(() => filtered.slice((halaman - 1) * batas, halaman * batas), [filtered, halaman]);

  useEffect(() => {
    setHalaman(1);
  }, [keyword, memberFilter]);

  const columns: Array<ColumnDef<AdminCustomer>> = useMemo(
    () => [
      {
        header: 'Foto',
        className: 'w-[88px]',
        cell: (row) => (
          <div className="relative h-12 w-12 overflow-hidden rounded-2xl bg-gray-100">
            {row.foto_url ? <Image src={row.foto_url} alt={row.nama} fill className="object-cover" /> : null}
            {!row.foto_url ? (
              <div className="flex h-full w-full items-center justify-center text-sm font-black text-primary-700">
                {row.nama.charAt(0).toUpperCase()}
              </div>
            ) : null}
          </div>
        ),
      },
      { header: 'Nama', cell: (row) => <p className="font-black text-neutral-900">{row.nama}</p> },
      { header: 'Email', cell: (row) => <span className="font-semibold text-gray-700">{row.email}</span> },
      { header: 'Nomor HP', cell: (row) => <span className="font-semibold text-gray-600">{row.nomor_hp}</span> },
      { header: 'Bergabung', cell: (row) => <span className="font-semibold text-gray-600">{formatDateID(row.tanggal_bergabung)}</span> },
      { header: 'Total Order', cell: (row) => <span className="font-black text-neutral-900">{row.total_order}</span> },
      { header: 'Member', cell: (row) => <StatusBadge value={row.status_member} /> },
      {
        header: 'Aksi',
        className: 'w-[260px]',
        cell: (row) => (
          <div className="flex flex-wrap gap-2">
            <Link
              href={`/admin/pelanggan/${row.id}`}
              className="inline-flex h-9 items-center justify-center rounded-xl border border-gray-200 px-3 text-xs font-bold text-gray-700 transition hover:border-primary-200 hover:text-primary-700"
            >
              Detail
            </Link>
            <button
              type="button"
              onClick={() => {
                setFormInitial({
                  id: row.id,
                  foto_url: row.foto_url,
                  nama: row.nama,
                  email: row.email,
                  nomor_hp: row.nomor_hp,
                  alamat: row.alamat,
                  total_order: row.total_order,
                  status_member: row.status_member,
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
    <AdminPage title="Kelola Pelanggan">
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-gray-500">Customers</p>
            <p className="mt-2 text-sm font-semibold text-gray-600">UI only (dummy). Siap untuk integrasi API Customer nantinya.</p>
            <IntegrationNote text="TODO: Integrasi API Customer" />
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <Input
              label="Search"
              placeholder="Cari nama / email..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="sm:w-64"
            />
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Filter Member</label>
              <select
                value={memberFilter}
                onChange={(e) => setMemberFilter(e.target.value as any)}
                className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm font-semibold text-gray-700 outline-none focus:ring-2 focus:ring-primary-500 sm:w-52"
              >
                <option value="ALL">Semua</option>
                <option value="REGULAR">REGULAR</option>
                <option value="SILVER">SILVER</option>
                <option value="GOLD">GOLD</option>
                <option value="PLATINUM">PLATINUM</option>
              </select>
            </div>
            <Button
              onClick={() => {
                setFormInitial({
                  id: '',
                  foto_url: null,
                  nama: '',
                  email: '',
                  nomor_hp: '',
                  alamat: '',
                  total_order: 0,
                  status_member: 'REGULAR',
                });
                setFormOpen(true);
              }}
            >
              Tambah Pelanggan
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {loading ? (
          <TableSkeleton rows={8} columns={8} />
        ) : (
          <>
            <DataTable columns={columns} data={paged} emptyText="Belum ada pelanggan." />
            <Pagination halaman={halaman} totalHalaman={totalHalaman} onChange={setHalaman} />
          </>
        )}
      </div>

      <ConfirmModal
        open={Boolean(confirmDelete)}
        title="Apakah Anda yakin ingin menghapus pelanggan ini?"
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

      <CustomerFormModal
        open={formOpen}
        initial={formInitial}
        onClose={() => {
          setFormOpen(false);
          setFormInitial(null);
        }}
        onSubmit={(data) => {
          setItems((current) => {
            if (!data.id) {
              const nextId = `cust-${Date.now()}`;
              const next: AdminCustomer = { ...data, id: nextId, tanggal_bergabung: new Date().toISOString() };
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
