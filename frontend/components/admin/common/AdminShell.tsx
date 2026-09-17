'use client';

import { useEffect, useState, type ReactNode } from 'react';
import AdminSidebar from '@/components/admin/common/AdminSidebar';
import AdminTopbar from '@/components/admin/common/AdminTopbar';

export default function AdminShell({ children, pageTitle }: { children: ReactNode; pageTitle: string }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!mobileOpen) return;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <div className="h-screen overflow-hidden bg-[#f5f5f5]">
      <div className="flex h-full">
        <div className="hidden h-full lg:block">
          <AdminSidebar collapsed={collapsed} />
        </div>

        {mobileOpen ? (
          <div
            className="fixed inset-0 z-50 lg:hidden"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                setMobileOpen(false);
              }
            }}
          >
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-y-0 left-0 w-[86%] max-w-sm">
              <AdminSidebar
                collapsed={false}
                onNavigate={() => {
                  setMobileOpen(false);
                }}
              />
            </div>
          </div>
        ) : null}

        <div className="flex h-full min-w-0 flex-1 flex-col">
          <AdminTopbar
            onOpenMobileSidebar={() => setMobileOpen(true)}
            onToggleCollapsed={() => setCollapsed((v) => !v)}
            collapsed={collapsed}
            pageTitle={pageTitle}
          />

          <div className="min-h-0 flex-1 overflow-y-auto">
            <main className="mx-auto w-full max-w-[1600px] px-4 py-6 md:px-6 md:py-8">
              {children}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
