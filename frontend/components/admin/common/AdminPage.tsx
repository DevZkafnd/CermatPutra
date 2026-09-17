'use client';

import type { ReactNode } from 'react';
import AdminShell from '@/components/admin/common/AdminShell';

export default function AdminPage({ title, children }: { title: string; children: ReactNode }) {
  return <AdminShell pageTitle={title}>{children}</AdminShell>;
}

