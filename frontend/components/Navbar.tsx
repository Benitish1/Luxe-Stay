'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, ShoppingBag, User as UserIcon, X, LayoutDashboard, LogOut } from 'lucide-react';
import { Logo } from './ui';
import { useStore } from '@/lib/store';
import { HOTEL } from '@/lib/config';

const links = [
  { href: '/rooms', label: 'Rooms & Suites' },
  { href: '/dining', label: 'Dining' },
  { href: '/experiences', label: 'Spa & Experiences' },
  { href: '/#events', label: 'Events' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isStaff, cartCount, setCartOpen, logout } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => { setOpen(false); setMenuOpen(false); }, [pathname]);

  const solid = scrolled || open;

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${solid ? 'bg-ink/95 py-3 shadow-luxe backdrop-blur-md' : 'py-6'}`}>
      {!scrolled && (
        <div className="container-luxe -mt-3 mb-3 hidden justify-end gap-6 text-[11px] tracking-wider text-white/60 lg:flex">
          <span>{HOTEL.address}</span>
          <a href={`tel:${HOTEL.phone}`} className="hover:text-gold">{HOTEL.phone}</a>
        </div>
      )}
      <div className="container-luxe flex items-center justify-between gap-6">
        <Logo light />
        <nav className="hidden items-center gap-8 lg:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href}
              className={`relative text-[13px] font-medium tracking-wide transition hover:text-gold ${pathname === l.href ? 'text-gold' : 'text-white/85'}`}>
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          {!isStaff && <button onClick={() => setCartOpen(true)} className="relative rounded-full p-2.5 text-white/85 transition hover:bg-white/10 hover:text-gold" aria-label="Open order basket">
            <ShoppingBag size={20} />
            {cartCount > 0 && <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-gold px-1 text-[10px] font-bold text-ink">{cartCount}</span>}
          </button>}
          <div className="relative">
            {user ? (
              <button onClick={() => setMenuOpen((v) => !v)} className="flex items-center gap-2 rounded-full p-1 pr-3 text-white/85 transition hover:bg-white/10" aria-label="Account menu">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-gold text-xs font-bold text-ink">{user.name.split(' ').map((p) => p[0]).slice(0, 2).join('')}</span>
                <span className="hidden text-sm sm:inline">{user.name.split(' ')[0]}</span>
              </button>
            ) : (
              <div className="flex items-center gap-1">
                <Link href="/login" className="hidden rounded-full px-3 py-2 text-[13px] font-medium text-white/85 transition hover:text-gold md:inline-flex">Sign in</Link>
                <Link href="/login" className="rounded-full p-2.5 text-white/85 transition hover:bg-white/10 hover:text-gold md:hidden" aria-label="Sign in"><UserIcon size={20} /></Link>
                <Link href="/register" className="btn-ghost-light btn-sm hidden md:inline-flex">Create account</Link>
              </div>
            )}
            {menuOpen && user && (
              <div className="reveal absolute right-0 mt-3 w-56 overflow-hidden rounded-2xl bg-white py-2 text-sm text-ink shadow-luxe">
                <div className="border-b border-ink/5 px-4 pb-3 pt-1">
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-xs text-ink-500">{user.email}</p>
                </div>
                {user.role !== 'guest' && (
                  <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2.5 hover:bg-ivory"><LayoutDashboard size={16} /> Management dashboard</Link>
                )}
                {!isStaff && <Link href="/account" className="flex items-center gap-2 px-4 py-2.5 hover:bg-ivory"><UserIcon size={16} /> My account</Link>}
                <button onClick={() => { logout(); router.push('/'); }} className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-rose-600 hover:bg-ivory"><LogOut size={16} /> Sign out</button>
              </div>
            )}
          </div>
          {isStaff
            ? <Link href="/dashboard" className="btn-gold btn-sm ml-1 hidden sm:inline-flex"><LayoutDashboard size={14} /> Dashboard</Link>
            : <Link href="/book" className="btn-gold btn-sm ml-1 hidden sm:inline-flex">Book Now</Link>}
          <button onClick={() => setOpen((v) => !v)} className="rounded-full p-2.5 text-white lg:hidden" aria-label="Toggle menu">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="container-luxe reveal mt-4 flex flex-col gap-1 pb-4 lg:hidden">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="border-b border-white/10 py-3 font-display text-2xl text-white">{l.label}</Link>
          ))}
          {isStaff ? (
            <Link href="/dashboard" className="btn-gold mt-4">Open dashboard</Link>
          ) : (
            <>
              <Link href="/book" className="btn-gold mt-4">Book Your Stay</Link>
              {!user && <Link href="/register" className="btn-ghost-light mt-2">Create an account</Link>}
            </>
          )}
        </nav>
      )}
    </header>
  );
}
