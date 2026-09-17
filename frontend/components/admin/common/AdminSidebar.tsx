'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const navItems = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: 'dashboard' },
  { label: 'Produk', href: '/admin/produk', icon: 'produk' },
  { label: 'Inventory', href: '/admin/inventory', icon: 'inventory' },
  { label: 'Pesanan', href: '/admin/pesanan', icon: 'pesanan' },
  { label: 'Pelanggan', href: '/admin/pelanggan', icon: 'pelanggan' },
  { label: 'Diskon', href: '/admin/diskon', icon: 'diskon' },
  { label: 'Laporan Keuangan', href: '/admin/laporan-keuangan', icon: 'laporan' },
] as const;

function Icon({ name, className }: { name: string; className?: string }) {
  const cls = className || 'h-5 w-5';
  switch (name) {
    case 'dashboard':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 13h6V4H4v9Zm10 7h6V11h-6v9ZM4 20h6v-5H4v5Zm10-11h6V4h-6v5Z" />
        </svg>
      );
    case 'produk':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      );
    case 'inventory':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 7h16v13H4V7Zm3-3h10v3H7V4Z" />
        </svg>
      );
    case 'pesanan':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M7 7h10M7 11h10M7 15h7" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M6 3h12a2 2 0 0 1 2 2v14l-4-2-4 2-4-2-4 2V5a2 2 0 0 1 2-2Z" />
        </svg>
      );
    case 'pelanggan':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    case 'diskon':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 2 2 7l10 5 10-5-10-5Zm0 10L2 7v10l10 5 10-5V7l-10 5Z" />
        </svg>
      );
    case 'laporan':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 19V5a2 2 0 0 1 2-2h9l5 5v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 9h6M9 13h6M9 17h4" />
        </svg>
      );
    default:
      return null;
  }
}

export default function AdminSidebar({
  collapsed,
  onNavigate,
}: {
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <aside className={clsx('flex h-full flex-col border-r border-gray-200 bg-white', collapsed ? 'w-20' : 'w-72')}>
      <div className={clsx('flex items-center gap-3 border-b border-gray-200 px-4 py-4', collapsed ? 'justify-center' : '')}>
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-600 text-white">
          <span className="text-sm font-black">CP</span>
        </div>
        {collapsed ? null : (
          <div className="min-w-0">
            <p className="truncate text-sm font-black uppercase text-neutral-900">Cermat Putra</p>
            <p className="truncate text-xs font-semibold text-gray-500">Admin Dashboard</p>
          </div>
        )}
      </div>

      <nav className={clsx('flex-1 overflow-y-auto p-3', collapsed ? 'px-2' : '')}>
        <p className={clsx('px-2 pb-2 text-[10px] font-bold uppercase tracking-[0.25em] text-gray-400', collapsed ? 'text-center' : '')}>
          Menu
        </p>
        <div className="space-y-1">
          {navItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className={clsx(
                  'group flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold transition',
                  active ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-50 hover:text-primary-700',
                  collapsed ? 'justify-center' : ''
                )}
                aria-label={item.label}
                title={collapsed ? item.label : undefined}
              >
                <span className={clsx('inline-flex h-10 w-10 items-center justify-center rounded-2xl', active ? 'bg-primary-100' : 'bg-gray-50 group-hover:bg-primary-50')}>
                  <Icon name={item.icon} className={clsx('h-5 w-5', active ? 'text-primary-700' : 'text-gray-700 group-hover:text-primary-700')} />
                </span>
                {collapsed ? null : <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </div>
      </nav>

      <div className={clsx('border-t border-gray-200 p-3', collapsed ? 'px-2' : '')}>
        <Link
          href="/"
          onClick={onNavigate}
          className={clsx(
            'flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 hover:text-primary-700',
            collapsed ? 'justify-center' : ''
          )}
          aria-label="Kembali ke website"
          title={collapsed ? 'Kembali ke website' : undefined}
        >
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gray-50">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 19 8 12l7-7" />
            </svg>
          </span>
          {collapsed ? null : <span>Kembali ke Website</span>}
        </Link>
      </div>
    </aside>
  );
}

