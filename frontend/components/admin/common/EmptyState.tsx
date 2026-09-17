'use client';

import Link from 'next/link';
import Button from '@/components/common/Button';

export default function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
}: {
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
}) {
  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-10 text-center shadow-sm">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-50">
        <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </div>
      <p className="mt-5 text-2xl font-black text-neutral-900">{title}</p>
      {description ? <p className="mt-2 text-sm font-semibold text-gray-600">{description}</p> : null}
      {actionLabel && actionHref ? (
        <div className="mt-6 flex justify-center">
          <Link href={actionHref}>
            <Button>{actionLabel}</Button>
          </Link>
        </div>
      ) : null}
    </div>
  );
}

