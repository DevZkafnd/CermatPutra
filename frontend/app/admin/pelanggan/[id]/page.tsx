'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import AdminPage from '@/components/admin/common/AdminPage';
import StatCard from '@/components/admin/common/StatCard';
import StatusBadge from '@/components/admin/common/StatusBadge';
import Button from '@/components/common/Button';
import { dummyCustomers, dummyOrders, formatCurrencyID, formatDateID, loadFromStorage } from '@/lib/data/adminDummyData';
import { AdminCustomer } from '@/types/admin.types';

const STORAGE_KEY = 'cermat-putra-admin-customers';

export default function AdminDetailPelangganPage() {
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : '';
  const [customers, setCustomers] = useState<AdminCustomer[]>(dummyCustomers);

  useEffect(() => {
    setCustomers(loadFromStorage<AdminCustomer[]>(STORAGE_KEY, dummyCustomers));
  }, []);

  const customer = useMemo(() => customers.find((item) => item.id === id) || null, [customers, id]);

  const customerOrders = useMemo(() => {
    if (!customer) return [];
    return dummyOrders.filter((o) => o.customer === customer.nama).slice(0, 8);
  }, [customer]);

  const totalSpent = useMemo(() => customerOrders.reduce((acc, item) => acc + item.total, 0), [customerOrders]);

  if (!customer) {
    return (
      <AdminPage title="Detail Pelanggan">
        <div className="rounded-3xl bg-white p-10 shadow-sm ring-1 ring-gray-200">
          <p className="text-lg font-black text-neutral-900">Pelanggan tidak ditemukan</p>
          <p className="mt-2 text-sm font-semibold text-gray-600">ID: {id}</p>
          <div className="mt-6">
            <Link href="/admin/pelanggan">
              <Button variant="outline">Kembali</Button>
            </Link>
          </div>
        </div>
      </AdminPage>
    );
  }

  return (
    <AdminPage title="Detail Pelanggan">
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="relative h-16 w-16 overflow-hidden rounded-3xl bg-gray-100">
              {customer.foto_url ? (
                <Image src={customer.foto_url} alt={customer.nama} fill className="object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xl font-black text-primary-700">
                  {customer.nama.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-xl font-black text-neutral-900">{customer.nama}</p>
              <p className="mt-1 text-sm font-semibold text-gray-600">{customer.email}</p>
              <p className="mt-1 text-sm font-semibold text-gray-600">{customer.nomor_hp}</p>
              <div className="mt-2">
                <StatusBadge value={customer.status_member} />
              </div>
            </div>
          </div>
          <Link href="/admin/pelanggan">
            <Button variant="outline">Kembali</Button>
          </Link>
        </div>
        <div className="mt-5 rounded-2xl border border-gray-200 bg-gray-50 p-5">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-gray-500">Alamat</p>
          <p className="mt-2 text-sm font-semibold text-gray-700">{customer.alamat}</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard title="Tanggal Bergabung" value={formatDateID(customer.tanggal_bergabung)} tone="neutral" />
        <StatCard title="Total Order" value={String(customer.total_order)} tone="primary" />
        <StatCard title="Total Belanja" value={formatCurrencyID(totalSpent)} tone="success" />
      </div>

      <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-gray-500">Riwayat Pesanan</p>
        <p className="mt-2 text-sm font-semibold text-gray-600">Daftar pesanan dari data dummy (sample).</p>

        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
          {customerOrders.map((order) => (
            <div key={order.id} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-black text-neutral-900">{order.invoice}</p>
                  <p className="mt-1 text-xs font-semibold text-gray-500">{formatDateID(order.dibuat_pada)}</p>
                </div>
                <StatusBadge value={order.status} />
              </div>
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="font-semibold text-gray-600">{order.metode_pembayaran}</span>
                <span className="font-black text-primary-600">{formatCurrencyID(order.total)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminPage>
  );
}
