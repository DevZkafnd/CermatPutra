'use client';

import { useEffect, useMemo, useState } from 'react';
import AdminPage from '@/components/admin/common/AdminPage';
import StatCard from '@/components/admin/common/StatCard';
import ChartCard from '@/components/admin/common/ChartCard';
import DataTable, { type ColumnDef } from '@/components/admin/common/DataTable';
import Pagination from '@/components/admin/common/Pagination';
import StatusBadge from '@/components/admin/common/StatusBadge';
import IntegrationNote from '@/components/admin/common/IntegrationNote';
import TableSkeleton from '@/components/admin/common/TableSkeleton';
import Button from '@/components/common/Button';
import { dummyFinancialSummary, dummyTransactions, formatCurrencyID, formatDateID } from '@/lib/data/adminDummyData';
import { AdminTransactionRow } from '@/types/admin.types';

export default function AdminLaporanKeuanganPage() {
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'hari-ini' | 'minggu-ini' | 'bulan-ini' | 'tahun-ini' | 'custom'>('bulan-ini');
  const [halaman, setHalaman] = useState(1);
  const batas = 10;
  const totalHalaman = Math.max(1, Math.ceil(dummyTransactions.length / batas));
  const paged = useMemo(() => dummyTransactions.slice((halaman - 1) * batas, halaman * batas), [halaman]);

  useEffect(() => {
    window.setTimeout(() => setLoading(false), 260);
  }, []);

  const columns: Array<ColumnDef<AdminTransactionRow>> = useMemo(
    () => [
      { header: 'Invoice', cell: (row) => <p className="font-black text-neutral-900">{row.invoice}</p> },
      { header: 'Customer', cell: (row) => <span className="font-semibold text-gray-700">{row.customer}</span> },
      { header: 'Produk', cell: (row) => <span className="font-semibold text-gray-700">{row.produk}</span> },
      { header: 'Qty', cell: (row) => <span className="font-bold text-gray-700">{row.qty}</span> },
      { header: 'Pembayaran', cell: (row) => <span className="font-semibold text-gray-600">{row.metode_pembayaran}</span> },
      { header: 'Total', cell: (row) => <span className="font-black text-primary-600">{formatCurrencyID(row.total)}</span> },
      { header: 'Diskon', cell: (row) => <span className="font-bold text-gray-700">{row.diskon ? formatCurrencyID(row.diskon) : '-'}</span> },
      { header: 'Status', cell: (row) => <StatusBadge value={row.status} /> },
      { header: 'Tanggal', cell: (row) => <span className="font-semibold text-gray-600">{formatDateID(row.tanggal)}</span> },
    ],
    []
  );

  return (
    <AdminPage title="Laporan Keuangan">
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-gray-500">Monitoring Keuangan</p>
            <p className="mt-2 text-sm font-semibold text-gray-600">UI only (dummy). Siap untuk integrasi API Financial Report nantinya.</p>
            <IntegrationNote text="TODO: Integrasi API Financial Report" />
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex flex-wrap gap-2">
              {([
                { key: 'hari-ini', label: 'Hari Ini' },
                { key: 'minggu-ini', label: 'Minggu Ini' },
                { key: 'bulan-ini', label: 'Bulan Ini' },
                { key: 'tahun-ini', label: 'Tahun Ini' },
                { key: 'custom', label: 'Custom Date' },
              ] as const).map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setFilter(item.key)}
                  className={`rounded-full border px-4 py-2 text-xs font-bold transition ${
                    filter === item.key ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-200 bg-white text-gray-700 hover:border-primary-200 hover:text-primary-700'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <Button variant="outline">Export PDF</Button>
              <Button variant="outline">Export Excel</Button>
              <Button variant="outline">Print</Button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Pendapatan" value={formatCurrencyID(dummyFinancialSummary.total_pendapatan)} tone="success" />
        <StatCard title="Total Pesanan" value={String(dummyFinancialSummary.total_pesanan)} tone="primary" />
        <StatCard title="Total Produk Terjual" value={String(dummyFinancialSummary.total_produk_terjual)} tone="neutral" />
        <StatCard title="Total Refund" value={formatCurrencyID(dummyFinancialSummary.total_refund)} tone="warning" />
        <StatCard title="Total Diskon" value={formatCurrencyID(dummyFinancialSummary.total_diskon)} tone="neutral" />
        <StatCard title="Laba Kotor" value={formatCurrencyID(dummyFinancialSummary.laba_kotor)} tone="success" />
        <StatCard title="Laba Bersih" value={formatCurrencyID(dummyFinancialSummary.laba_bersih)} tone="success" />
        <StatCard title="Status Filter" value={filter.replace('-', ' ').toUpperCase()} tone="neutral" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartCard title="Penjualan Bulanan" subtitle="Dummy chart" bars={[18, 22, 30, 26, 34, 41, 28, 35, 39, 42, 38, 45]} />
        <ChartCard title="Pendapatan Bulanan" subtitle="Dummy chart" bars={[12, 16, 18, 20, 24, 28, 21, 26, 30, 33, 29, 36]} />
        <ChartCard title="Produk Terjual" subtitle="Dummy chart" bars={[10, 14, 17, 16, 19, 24, 18, 22, 27, 26, 25, 30]} />
        <ChartCard title="Transaksi Harian" subtitle="Dummy chart" bars={[5, 8, 6, 10, 9, 12, 7, 11, 13, 10, 9, 14]} />
      </div>

      <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-gray-500">Tabel Transaksi</p>
        <p className="mt-2 text-sm font-semibold text-gray-600">Data dummy untuk kebutuhan UI.</p>
        <div className="mt-5 space-y-4">
          {loading ? (
            <TableSkeleton rows={8} columns={9} />
          ) : (
            <>
              <DataTable columns={columns} data={paged} emptyText="Belum ada transaksi." />
              <Pagination halaman={halaman} totalHalaman={totalHalaman} onChange={setHalaman} />
            </>
          )}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-gray-500">Produk Terlaris</p>
          <div className="mt-5 space-y-3">
            {['TV 4K UHD', 'AC Inverter', 'Kulkas 2 Pintu', 'Mesin Cuci Front Load', 'Dispenser'].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between gap-4">
                <p className="text-sm font-black text-neutral-900">{item}</p>
                <span className="text-sm font-black text-primary-600">{formatCurrencyID(1200000 + idx * 250000)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-gray-500">Kategori Terlaris</p>
          <div className="mt-5 space-y-3">
            {['TV', 'AC', 'Kulkas', 'Mesin Cuci', 'Rice Cooker'].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between gap-4">
                <p className="text-sm font-black text-neutral-900">{item}</p>
                <span className="text-sm font-black text-neutral-900">{320 + idx * 90}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-gray-500">Pendapatan per Kategori</p>
          <div className="mt-5 space-y-3">
            {['TV', 'AC', 'Kulkas', 'Mesin Cuci', 'Dispenser'].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between gap-4">
                <p className="text-sm font-black text-neutral-900">{item}</p>
                <span className="text-sm font-black text-primary-600">{formatCurrencyID(18500000 + idx * 3200000)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminPage>
  );
}
