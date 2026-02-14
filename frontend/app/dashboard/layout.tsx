'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/dashboard/rooms', label: 'Rooms', icon: '🛏️' },
    { href: '/dashboard/bookings', label: 'Bookings', icon: '📅' },
    ...(user?.role === 'admin' ? [{ href: '/dashboard/users', label: 'Users', icon: '👥' }] : []),
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-slate-900 to-slate-800 text-white shadow-xl z-40">
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-primary-400 to-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl font-bold">L</span>
            </div>
            <span className="text-xl font-bold">LuxeStay</span>
          </Link>
        </div>

        {/* User Info */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-primary-400 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold">{user?.full_name?.charAt(0) || 'U'}</span>
            </div>
            <div>
              <p className="font-medium text-sm">{user?.full_name}</p>
              <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-white/10 hover:text-white transition-all duration-200"
                >
                  <span className="text-xl">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <button
            onClick={() => {
              logout();
              router.push('/');
            }}
            className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-gray-400 hover:bg-red-500/20 hover:text-red-400 transition-all duration-200"
          >
            <span className="text-xl">🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 min-h-screen">
        {/* Top Bar */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-8 py-4 sticky top-0 z-30">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-800">
              Welcome, {user?.full_name?.split(' ')[0]}! 👋
            </h1>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
