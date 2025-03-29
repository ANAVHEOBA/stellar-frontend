'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/merchant/dashboard',
    icon: '📊'
  },
  {
    name: 'Rates',
    href: '/merchant/rates',
    icon: '💱'
  },
  {
    name: 'Payments',
    href: '/merchant/payments',
    icon: '💳'
  },
  {
    name: 'Settings',
    href: '/merchant/settings',
    icon: '⚙️'
  }
];

export function Sidebar() {
  const pathname = usePathname();
  const { logoutUser } = useAuth();

  return (
    <div className="w-64 bg-white shadow-md">
      <div className="flex flex-col h-full">
        {/* Logo/Header */}
        <div className="p-6 border-b">
          <h1 className="text-xl font-semibold text-gray-800">Merchant Portal</h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navigationItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center p-3 text-gray-700 rounded-lg hover:bg-gray-50 
                    ${pathname === item.href ? 'bg-blue-50 text-blue-700' : ''}`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t">
          <button
            onClick={() => logoutUser()}
            className="flex items-center w-full p-3 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            <span className="mr-3">🚪</span>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
} 