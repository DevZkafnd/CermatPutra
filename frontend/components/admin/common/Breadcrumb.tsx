'use client';

import Link from 'next/link';
import { useMemo } from 'react';

export default function Breadcrumb({ items }: { items: Array<{ label: string; href?: string }> }) {
  const normalized = useMemo(() => items.filter((item) => item.label), [items]);

  return (
    <nav className="flex flex-wrap items-center gap-2 text-sm text-gray-500" aria-label="Breadcrumb">
      {normalized.map((item, index) => {
        const isLast = index === normalized.length - 1;
        const content = item.href && !isLast ? (
          <Link href={item.href} className="font-semibold text-gray-600 hover:text-primary-600">
            {item.label}
          </Link>
        ) : (
          <span className={isLast ? 'font-semibold text-primary-600' : 'font-semibold text-gray-600'}>{item.label}</span>
        );

        return (
          <span key={`${item.label}-${index}`} className="inline-flex items-center gap-2">
            {index === 0 ? null : <span aria-hidden="true">/</span>}
            {content}
          </span>
        );
      })}
    </nav>
  );
}

