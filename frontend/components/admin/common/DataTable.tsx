'use client';

import clsx from 'clsx';
import EmptyState from '@/components/admin/common/EmptyState';

export type ColumnDef<T> = {
  header: string;
  className?: string;
  cell: (row: T) => React.ReactNode;
};

export default function DataTable<T>({
  columns,
  data,
  emptyText = 'Data tidak tersedia.',
}: {
  columns: Array<ColumnDef<T>>;
  data: T[];
  emptyText?: string;
}) {
  if (data.length === 0) {
    return <EmptyState title="Data Kosong" description={emptyText} />;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="text-left text-xs font-bold uppercase tracking-[0.22em] text-gray-600">
              {columns.map((col, idx) => (
                <th
                  key={`${col.header}-${idx}`}
                  className={clsx('sticky top-0 z-10 bg-white/90 px-5 py-4 backdrop-blur', col.className)}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={clsx(
                  'text-sm text-gray-700 transition hover:bg-gray-50',
                  rowIndex % 2 === 1 ? 'bg-gray-50/30' : 'bg-white'
                )}
              >
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className={clsx('px-5 py-4 align-middle', col.className)}>
                    {col.cell(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
