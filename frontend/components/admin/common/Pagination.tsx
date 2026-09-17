'use client';

import clsx from 'clsx';

export default function Pagination({
  halaman,
  totalHalaman,
  onChange,
}: {
  halaman: number;
  totalHalaman: number;
  onChange: (next: number) => void;
}) {
  if (totalHalaman <= 1) return null;

  const pages = Array.from({ length: totalHalaman }).map((_, idx) => idx + 1);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
      <p className="text-sm font-semibold text-gray-600">
        Halaman <span className="font-black text-neutral-900">{halaman}</span> dari{' '}
        <span className="font-black text-neutral-900">{totalHalaman}</span>
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onChange(Math.max(1, halaman - 1))}
          disabled={halaman <= 1}
          className="inline-flex h-10 items-center justify-center rounded-xl border border-gray-200 px-3 text-sm font-bold text-gray-700 transition hover:border-primary-200 hover:text-primary-700 disabled:opacity-50"
          aria-label="Halaman sebelumnya"
        >
          Prev
        </button>
        <div className="hidden items-center gap-2 sm:flex">
          {pages.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onChange(p)}
              className={clsx(
                'inline-flex h-10 w-10 items-center justify-center rounded-xl border text-sm font-bold transition',
                p === halaman
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-primary-200 hover:text-primary-700'
              )}
              aria-label={`Halaman ${p}`}
            >
              {p}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => onChange(Math.min(totalHalaman, halaman + 1))}
          disabled={halaman >= totalHalaman}
          className="inline-flex h-10 items-center justify-center rounded-xl border border-gray-200 px-3 text-sm font-bold text-gray-700 transition hover:border-primary-200 hover:text-primary-700 disabled:opacity-50"
          aria-label="Halaman berikutnya"
        >
          Next
        </button>
      </div>
    </div>
  );
}

