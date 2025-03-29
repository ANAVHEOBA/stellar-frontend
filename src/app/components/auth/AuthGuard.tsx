'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';
import type { UserType } from '@/app/lib/auth/types';

interface AuthGuardProps {
  children: React.ReactNode;
  userType?: UserType;
  requireAuth?: boolean;
}

export function AuthGuard({ children, userType, requireAuth = true }: AuthGuardProps) {
  const { token, user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading) {
      console.log('AuthGuard Check:', {
        pathname,
        userType,
        requireAuth,
        currentUserType: user?.userType,
        hasToken: !!token
      });

      // Allow registration page access without auth
      if (pathname.includes('/register')) {
        console.log('Registration page access allowed');
        return;
      }

      // Redirect to home if auth is required but no token exists
      if (requireAuth && !token) {
        console.log('No token, redirecting to home');
        router.push('/');
        return;
      }

      // Redirect to home if wrong user type
      if (requireAuth && userType && user?.userType !== userType) {
        console.log('Wrong user type, redirecting to home');
        console.log('Expected:', userType);
        console.log('Got:', user?.userType);
        router.push('/');
        return;
      }
    }
  }, [token, user, isLoading, userType, requireAuth, router, pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  // Allow access to registration page without auth
  if (pathname.includes('/register')) {
    return <>{children}</>;
  }

  // Block access to protected routes without proper auth
  if (requireAuth && (!token || (userType && user?.userType !== userType))) {
    return null;
  }

  return <>{children}</>;
} 