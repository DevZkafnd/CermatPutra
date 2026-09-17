'use client';

import { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import Breadcrumb from '@/components/admin/common/Breadcrumb';

export default function AdminTopbar({
  onOpenMobileSidebar,
  onToggleCollapsed,
  collapsed,
  pageTitle,
}: {
  onOpenMobileSidebar: () => void;
  onToggleCollapsed: () => void;
  collapsed: boolean;
  pageTitle: string;
}) {
  const pathname = usePathname();

  const breadcrumbItems = useMemo(() => {
    const parts = pathname.split('/').filter(Boolean);
    const items: Array<{ label: string; href?: string }> = [{ label: 'Admin', href: '/admin/dashboard' }];
    if (parts.length >= 2) {
      const label = parts[1].replace(/-/g, ' ');
      items.push({ label: label.charAt(0).toUpperCase() + label.slice(1), href: `/${parts[0]}/${parts[1]}` });
    }
    if (parts.length >= 3) {
      items.push({ label: parts[2] });
    }
    return items;
  }, [pathname]);

  return (
    <header className="z-40 border-b border-gray-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-[1600px] items-center gap-3 px-4 py-4 md:px-6">
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-gray-200 text-gray-700 transition hover:border-primary-200 hover:text-primary-700 lg:hidden"
          aria-label="Buka menu admin"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <button
          type="button"
          onClick={onToggleCollapsed}
          className="hidden h-11 w-11 items-center justify-center rounded-2xl border border-gray-200 text-gray-700 transition hover:border-primary-200 hover:text-primary-700 lg:inline-flex"
          aria-label={collapsed ? 'Perluas sidebar' : 'Ciutkan sidebar'}
          title={collapsed ? 'Perluas sidebar' : 'Ciutkan sidebar'}
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={collapsed ? 'M8 5l8 7-8 7' : 'M16 5 8 12l8 7'} />
          </svg>
        </button>

        <div className="min-w-0 flex-1">
          <p className="text-lg font-black text-neutral-900 md:text-xl">{pageTitle}</p>
          <div className="mt-1">
            <Breadcrumb items={breadcrumbItems} />
          </div>
        </div>

        <div className="hidden w-full max-w-md items-center rounded-2xl border border-gray-200 bg-white px-4 py-2 shadow-sm md:flex">
          <svg className="mr-3 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" />
          </svg>
          <input
            type="search"
            placeholder="Search admin..."
            className="w-full border-0 bg-transparent text-sm font-semibold text-gray-700 outline-none placeholder:text-gray-400"
            aria-label="Search admin"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-gray-200 text-gray-700 transition hover:border-primary-200 hover:text-primary-700"
            aria-label="Notifikasi"
            title="Notifikasi"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 7h18s-3 0-3-7" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </button>

          <button
            type="button"
            className="inline-flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-3 py-2 text-sm font-bold text-gray-700 transition hover:border-primary-200 hover:text-primary-700"
            aria-label="Profil admin"
            title="Profil admin"
          >
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-50 text-primary-700">
              <span className="text-sm font-black">A</span>
            </span>
            <span className="hidden sm:block">Admin</span>
          </button>
        </div>
      </div>
    </header>
  );
}
