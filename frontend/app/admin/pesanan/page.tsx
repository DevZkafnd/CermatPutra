'use client';

import { useEffect, useMemo, useState } from 'react';
import AdminPage from '@/components/admin/common/AdminPage';
import DataTable, { type ColumnDef } from '@/components/admin/common/DataTable';
import Pagination from '@/components/admin/common/Pagination';
import StatusBadge from '@/components/admin/common/StatusBadge';
import IntegrationNote from '@/components/admin/common/IntegrationNote';
import TableSkeleton from '@/components/admin/common/TableSkeleton';
import Input from '@/components/common/Input';
import { dummyOrders, formatCurrencyID, formatDateID } from '@/lib/data/adminDummyData';
import { AdminOrder, AdminOrderStatus } from '@/types/admin.types';
import OrderDetailModal from '@/components/admin/pesanan/OrderDetailModal';

export default function AdminPesananPage() {
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState<'ALL' | AdminOrderStatus>('ALL');
  const [halaman, setHalaman] = useState(1);
  const [detail, setDetail] = useState<AdminOrder | null>(null);

  useEffect(() => {
    window.setTimeout(() => setLoading(false), 260);
  }, []);

  const filtered = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    return dummyOrders.filter((order) => {
      const matchKeyword = !q || order.invoice.toLowerCase().includes(q) || order.customer.toLowerCase().includes(q);
      const matchStatus = status === 'ALL' ? true : order.status === status;
      return matchKeyword && matchStatus;
    });
  }, [keyword, status]);

  const batas = 10;
  const totalHalaman = Math.max(1, Math.ceil(filtered.length / batas));
  const paged = useMemo(() => filtered.slice((halaman - 1) * batas, halaman * batas), [filtered, halaman]);

  const columns: Array<ColumnDef<AdminOrder>> = useMemo(
    () => [
      { header: 'Invoice', cell: (row) => <p className="font-black text-neutral-900">{row.invoice}</p> },
      { header: 'Customer', cell: (row) => <span className="font-semibold text-gray-700">{row.customer}</span> },
      { header: 'Tanggal', cell: (row) => <span className="font-semibold text-gray-600">{formatDateID(row.dibuat_pada)}</span> },
      { header: 'Pembayaran', cell: (row) => <span className="font-semibold text-gray-600">{row.metode_pembayaran}</span> },
      { header: 'Total', cell: (row) => <span className="font-black text-primary-600">{formatCurrencyID(row.total)}</span> },
      { header: 'Status', cell: (row) => <StatusBadge value={row.status} /> },
      {
        header: 'Aksi',
        className: 'w-[140px]',
        cell: (row) => (
          <button
            type="button"
            onClick={() => setDetail(row)}
            className="inline-flex h-9 items-center justify-center rounded-xl border border-gray-200 px-3 text-xs font-bold text-gray-700 transition hover:border-primary-200 hover:text-primary-700"
          >
            Detail
          </button>
        ),
      },
    ],
    []
  );

  return (
    <AdminPage title="Kelola Pesanan">
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-gray-500">Orders</p>
            <p className="mt-2 text-sm font-semibold text-gray-600">UI only (dummy). Siap untuk integrasi API Orders nantinya.</p>
            <IntegrationNote text="TODO: Integrasi API Orders" />
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <Input
              label="Search"
              placeholder="Cari invoice / customer..."
              value={keyword}
              onChange={(e) => {
                setKeyword(e.target.value);
                setHalaman(1);
              }}
              className="sm:w-64"
            />
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Filter Status</label>
              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value as any);
                  setHalaman(1);
                }}
                className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm font-semibold text-gray-700 outline-none focus:ring-2 focus:ring-primary-500 sm:w-52"
              >
                <option value="ALL">Semua</option>
                <option value="PENDING">Pending</option>
                <option value="PAID">Paid</option>
                <option value="PROCESSING">Processing</option>
                <option value="SHIPPING">Shipping</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {loading ? (
          <TableSkeleton rows={8} columns={7} />
        ) : (
          <>
            <DataTable columns={columns} data={paged} emptyText="Belum ada pesanan." />
            <Pagination halaman={halaman} totalHalaman={totalHalaman} onChange={setHalaman} />
          </>
        )}
      </div>

      <OrderDetailModal open={Boolean(detail)} order={detail} onClose={() => setDetail(null)} />
    </AdminPage>
  );
}
