'use client';

import Button from '@/components/common/Button';
import StatusBadge from '@/components/admin/common/StatusBadge';
import Modal from '@/components/admin/common/Modal';
import { AdminOrder } from '@/types/admin.types';
import { formatCurrencyID, formatDateID } from '@/lib/data/adminDummyData';

export default function OrderDetailModal({
  open,
  order,
  onClose,
}: {
  open: boolean;
  order: AdminOrder | null;
  onClose: () => void;
}) {
  if (!open || !order) return null;

  return (
    <Modal open={open} onClose={onClose} maxWidthClassName="max-w-2xl">
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-lg font-black text-neutral-900">Detail Pesanan</p>
            <p className="mt-1 text-sm font-semibold text-gray-600">{order.invoice}</p>
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
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-gray-500">Customer</p>
            <p className="mt-2 text-sm font-black text-neutral-900">{order.customer}</p>
            <p className="mt-1 text-xs font-semibold text-gray-600">{formatDateID(order.dibuat_pada)}</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-gray-500">Status</p>
            <div className="mt-2">
              <StatusBadge value={order.status} />
            </div>
            <p className="mt-3 text-xs font-semibold text-gray-600">{order.metode_pembayaran}</p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-gray-200 bg-white">
          <div className="border-b border-gray-200 px-5 py-4">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-gray-500">Items</p>
          </div>
          <div className="divide-y divide-gray-100">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between gap-4 px-5 py-4 text-sm">
                <div className="min-w-0">
                  <p className="truncate font-black text-neutral-900">{item.produk}</p>
                  <p className="mt-1 text-xs font-semibold text-gray-500">Qty {item.qty}</p>
                </div>
                <p className="font-black text-primary-600">{formatCurrencyID(item.qty * item.harga)}</p>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-200 px-5 py-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-600">Total</span>
              <span className="text-lg font-black text-neutral-900">{formatCurrencyID(order.total)}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Tutup
          </Button>
        </div>
      </div>
    </Modal>
  );
}
