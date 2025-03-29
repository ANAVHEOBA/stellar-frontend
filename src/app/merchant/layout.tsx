'use client';

import { AuthGuard } from '@/app/components/auth/AuthGuard';
import { Sidebar } from '@/app/components/merchant/layout/Sidebar';
import { usePathname } from 'next/navigation';

export default function MerchantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const requireAuth = !pathname.includes('/register');

  // Don't show sidebar on registration page
  if (pathname.includes('/register')) {
    return (
      <AuthGuard userType="merchant" requireAuth={requireAuth}>
        {children}
      </AuthGuard>
    );
  }

  return (
    <AuthGuard userType="merchant" requireAuth={requireAuth}>
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    </AuthGuard>
  );
} 