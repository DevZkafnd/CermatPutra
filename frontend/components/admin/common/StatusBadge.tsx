'use client';

import clsx from 'clsx';

export default function StatusBadge({
  value,
}: {
  value: string;
}) {
  const normalized = value.toUpperCase();
  const mapping: Record<string, string> = {
    ACTIVE: 'bg-green-50 text-green-700 ring-green-200',
    INACTIVE: 'bg-gray-100 text-gray-700 ring-gray-200',
    DRAFT: 'bg-gray-100 text-gray-700 ring-gray-200',
    READY: 'bg-blue-50 text-blue-700 ring-blue-200',
    PUBLISH: 'bg-green-50 text-green-700 ring-green-200',
    PENDING: 'bg-yellow-50 text-yellow-700 ring-yellow-200',
    PAID: 'bg-blue-50 text-blue-700 ring-blue-200',
    PROCESSING: 'bg-purple-50 text-purple-700 ring-purple-200',
    SHIPPING: 'bg-indigo-50 text-indigo-700 ring-indigo-200',
    COMPLETED: 'bg-green-50 text-green-700 ring-green-200',
    CANCELLED: 'bg-red-50 text-red-700 ring-red-200',
    REFUND: 'bg-red-50 text-red-700 ring-red-200',
  };
  const cls = mapping[normalized] || 'bg-gray-100 text-gray-700 ring-gray-200';

  return (
    <span className={clsx('inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ring-1', cls)}>
      {normalized}
    </span>
  );
}

