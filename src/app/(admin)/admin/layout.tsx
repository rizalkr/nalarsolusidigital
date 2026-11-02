import React from 'react';
import { AdminNavbar } from '@/components/admin/AdminNavbar';

export const metadata = {
  title: 'Admin Nalar Solusi Digital',
  description: 'Sistem CRM dan manajemen operasional Nalar Solusi Digital',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-surface flex flex-col text-text-primary">
      <AdminNavbar />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
    </div>
  );
}

