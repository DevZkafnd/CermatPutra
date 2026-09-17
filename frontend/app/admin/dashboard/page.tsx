'use client';

import { useMemo } from 'react';
import AdminPage from '@/components/admin/common/AdminPage';
import StatCard from '@/components/admin/common/StatCard';
import ChartCard from '@/components/admin/common/ChartCard';
import StatusBadge from '@/components/admin/common/StatusBadge';
import IntegrationNote from '@/components/admin/common/IntegrationNote';
import { dummyCustomers, dummyInventory, dummyOrders, dummyProducts, formatCurrencyID, formatDateID } from '@/lib/data/adminDummyData';

export default function AdminDashboardPage() {
  const totalPendapatan = useMemo(() => dummyOrders.reduce((acc, item) => acc + item.total, 0), []);
  const produkTerlaris = useMemo(() => dummyProducts.slice(0, 6), []);
  const aktivitas = useMemo(() => dummyOrders.slice(0, 6), []);

  return (
    <AdminPage title="Dashboard">
      <IntegrationNote text="TODO: Integrasi API Dashboard" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard
          title="Total Produk"
          value={String(dummyProducts.length)}
          subtitle="Produk aktif & nonaktif"
          icon={
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          }
        />
        <StatCard
          title="Total Inventory"
          value={String(dummyInventory.length)}
          subtitle="Draft & ready"
          tone="neutral"
          icon={
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 7h16v13H4V7Zm3-3h10v3H7V4Z" />
            </svg>
          }
        />
        <StatCard
          title="Total Pesanan"
          value={String(dummyOrders.length)}
          subtitle="Semua status"
          tone="warning"
          icon={
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M7 7h10M7 11h10M7 15h7" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M6 3h12a2 2 0 0 1 2 2v14l-4-2-4 2-4-2-4 2V5a2 2 0 0 1 2-2Z" />
            </svg>
          }
        />
        <StatCard
          title="Total Pelanggan"
          value={String(dummyCustomers.length)}
          subtitle="Member & regular"
          tone="neutral"
          icon={
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          }
        />
        <StatCard
          title="Total Pendapatan"
          value={formatCurrencyID(totalPendapatan)}
          subtitle="Simulasi data dummy"
          tone="success"
          icon={
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8v8m-4-4h8" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          }
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ChartCard title="Grafik Penjualan" subtitle="Chart dummy untuk kebutuhan UI" bars={[12, 18, 15, 22, 30, 24, 18, 29, 35, 28, 31, 40]} />
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-gray-500">Produk Terlaris</p>
          <div className="mt-5 space-y-4">
            {produkTerlaris.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="truncate text-sm font-black text-neutral-900">{item.nama}</p>
                  <p className="mt-1 text-xs font-semibold text-gray-500">{item.kategori} • {item.sku}</p>
                </div>
                <span className="text-sm font-black text-primary-600">{formatCurrencyID(item.harga)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-gray-500">Aktivitas Terbaru</p>
            <p className="mt-2 text-sm font-semibold text-gray-600">Daftar pesanan terbaru dari data dummy.</p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {aktivitas.map((order) => (
            <div key={order.id} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-black text-neutral-900">{order.invoice}</p>
                  <p className="mt-1 text-xs font-semibold text-gray-500">{order.customer}</p>
                </div>
                <StatusBadge value={order.status} />
              </div>
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="font-semibold text-gray-600">{formatDateID(order.dibuat_pada)}</span>
                <span className="font-black text-primary-600">{formatCurrencyID(order.total)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminPage>
  );
}
