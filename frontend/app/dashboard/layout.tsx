'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  BedDouble, Bell, CalendarCheck, ChefHat, ClipboardList, ExternalLink, LayoutDashboard, LogOut, Menu as MenuIcon,
  MessageSquare, RotateCcw, Sparkles, UserCog, Users, UtensilsCrossed, X,
} from 'lucide-react';
import { Logo } from '@/components/ui';
import { useStore } from '@/lib/store';

const NAV = [
  { group: 'Overview', items: [{ href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard }] },
  { group: 'Rooms', items: [
    { href: '/dashboard/reservations', label: 'Reservations', icon: CalendarCheck },
    { href: '/dashboard/rooms', label: 'Front desk & rooms', icon: BedDouble },
    { href: '/dashboard/housekeeping', label: 'Housekeeping', icon: ClipboardList },
  ] },
  { group: 'Food & beverage', items: [
    { href: '/dashboard/orders', label: 'Kitchen orders', icon: ChefHat },
    { href: '/dashboard/menu', label: 'Menu', icon: UtensilsCrossed },
  ] },
  { group: 'Guests', items: [
    { href: '/dashboard/services', label: 'Spa & services', icon: Sparkles },
    { href: '/dashboard/guests', label: 'Guests & users', icon: Users, admin: true },
    { href: '/dashboard/reviews', label: 'Reviews & inbox', icon: MessageSquare },
  ] },
  { group: 'Team', items: [{ href: '/dashboard/staff', label: 'Staff', icon: UserCog, admin: true }] },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { ready, user, db, logout, resetDemo } = useStore();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (ready && (!user || user.role === 'guest')) router.replace('/login?next=/dashboard');
  }, [ready, user, router]);
  useEffect(() => setOpen(false), [pathname]);

  if (!user || user.role === 'guest') return <div className="grid h-screen place-items-center bg-ink"><span className="h-10 w-10 animate-spin rounded-full border-2 border-gold border-t-transparent" /></div>;

  const newOrders = db.orders.filter((o) => o.status === 'received').length;
  const pending = db.bookings.filter((b) => b.status === 'pending').length;
  const unread = db.messages.filter((m) => !m.read).length;
  const counts: Record<string, number> = { '/dashboard/orders': newOrders, '/dashboard/reservations': pending, '/dashboard/reviews': unread };

  const sidebar = (
    <aside className="flex h-full w-72 flex-col bg-ink text-white/70">
      <div className="flex items-center justify-between px-6 py-6"><Logo light /><button className="lg:hidden" onClick={() => setOpen(false)} aria-label="Close menu"><X size={20} /></button></div>
      <nav className="flex-1 space-y-6 overflow-y-auto px-4 py-2">
        {NAV.map((g) => {
          const items = g.items.filter((i) => !('admin' in i && i.admin) || user.role === 'admin');
          if (!items.length) return null;
          return (
            <div key={g.group}>
              <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-luxe text-white/35">{g.group}</p>
              {items.map((i) => {
                const active = pathname === i.href;
                return (
                  <Link key={i.href} href={i.href} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${active ? 'bg-gold text-ink font-semibold' : 'hover:bg-white/5 hover:text-white'}`}>
                    <i.icon size={18} strokeWidth={1.7} />
                    <span className="flex-1">{i.label}</span>
                    {counts[i.href] > 0 && <span className={`grid h-5 min-w-5 place-items-center rounded-full px-1.5 text-[10px] font-bold ${active ? 'bg-ink text-gold' : 'bg-gold text-ink'}`}>{counts[i.href]}</span>}
                  </Link>
                );
              })}
            </div>
          );
        })}
      </nav>
      <div className="space-y-1 border-t border-white/10 p-4">
        <Link href="/" className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm hover:bg-white/5"><ExternalLink size={16} /> View website</Link>
        <button onClick={() => { if (confirm('Reset all demo data to the original state?')) resetDemo(); }} className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm hover:bg-white/5"><RotateCcw size={16} /> Reset demo data</button>
        <button onClick={() => { logout(); router.push('/login'); }} className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-rose-300 hover:bg-white/5"><LogOut size={16} /> Sign out</button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-ivory-100">
      <div className="fixed inset-y-0 left-0 z-40 hidden lg:block">{sidebar}</div>
      {open && <div className="fixed inset-0 z-50 bg-ink/50 lg:hidden" onClick={() => setOpen(false)}><div className="h-full animate-slideIn" style={{ animationDirection: 'reverse' }} onClick={(e) => e.stopPropagation()}>{sidebar}</div></div>}
      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-ink/5 bg-ivory-100/90 px-4 py-4 backdrop-blur sm:px-8">
          <div className="flex items-center gap-3">
            <button className="rounded-lg p-2 hover:bg-ink/5 lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu"><MenuIcon size={20} /></button>
            <div>
              <p className="text-xs text-ink-500">{new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
              <p className="font-display text-2xl leading-tight">Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, {user.name.split(' ')[0]}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard/orders" className="relative rounded-full bg-white p-2.5 shadow-soft" aria-label="New orders">
              <Bell size={18} />
              {newOrders + pending > 0 && <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full bg-rose-500 ring-2 ring-white" />}
            </Link>
            <div className="hidden items-center gap-3 rounded-full bg-white py-1 pl-1 pr-4 shadow-soft sm:flex">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-gold text-xs font-bold">{user.name.split(' ').map((p) => p[0]).slice(0, 2).join('')}</span>
              <div className="leading-tight"><p className="text-sm font-semibold">{user.name}</p><p className="text-[11px] capitalize text-ink-500">{user.role}</p></div>
            </div>
          </div>
        </header>
        <main className="p-4 sm:p-8">
          {user.role !== 'admin' && NAV.some((g) => g.items.some((i) => 'admin' in i && i.admin && i.href === pathname))
            ? <div className="card p-12 text-center"><p className="font-display text-3xl">Admins only</p><p className="mt-2 text-sm text-ink-500">Ask the hotel manager for access to this page.</p></div>
            : children}
        </main>
      </div>
    </div>
  );
}
