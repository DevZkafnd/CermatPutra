'use client';

import clsx from 'clsx';

export default function StatCard({
  title,
  value,
  subtitle,
  icon,
  tone = 'primary',
}: {
  title: string;
  value: string;
  subtitle?: string;
  icon?: React.ReactNode;
  tone?: 'primary' | 'neutral' | 'success' | 'warning';
}) {
  const toneClasses = {
    primary: 'bg-primary-50 text-primary-700',
    neutral: 'bg-gray-50 text-gray-700',
    success: 'bg-green-50 text-green-700',
    warning: 'bg-yellow-50 text-yellow-700',
  };

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-200 transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-gray-500">{title}</p>
          <p className="mt-2 text-2xl font-black text-neutral-900">{value}</p>
          {subtitle ? <p className="mt-1 text-sm font-semibold text-gray-600">{subtitle}</p> : null}
        </div>
        {icon ? (
          <span className={clsx('inline-flex h-12 w-12 items-center justify-center rounded-2xl', toneClasses[tone])}>
            {icon}
          </span>
        ) : null}
      </div>
    </div>
  );
}

