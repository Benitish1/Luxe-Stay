'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { LayoutDashboard, ShieldCheck, UserPlus } from 'lucide-react';
import { useStore } from '@/lib/store';

/**
 * Wraps guest-only actions (booking, checkout, spa requests).
 * - Visitors without an account are asked to create one (or sign in) first.
 * - Admin / staff are sent to the dashboard: they manage, they don't order.
 */
export default function GuestGate({ children, action = 'continue' }: { children: ReactNode; action?: string }) {
  const { ready, user } = useStore();
  const pathname = usePathname();
  const params = useSearchParams();
  const here = pathname + (params.toString() ? `?${params}` : '');
  const next = encodeURIComponent(here);

  if (!ready) return <div className="grid min-h-[50vh] place-items-center"><span className="h-10 w-10 animate-spin rounded-full border-2 border-gold border-t-transparent" /></div>;

  if (user && user.role !== 'guest') {
    return (
      <div className="container-luxe max-w-xl py-24 text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-ink text-gold"><ShieldCheck size={28} /></span>
        <h1 className="h-display mt-6 text-4xl">You&apos;re signed in as {user.role === 'admin' ? 'the administrator' : 'staff'}.</h1>
        <p className="mt-3 text-ink-500">Bookings and orders on the website are made by guests. To manage reservations, kitchen orders and requests, use the dashboard.</p>
        <Link href="/dashboard" className="btn-dark mt-8"><LayoutDashboard size={16} /> Go to dashboard</Link>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container-luxe max-w-xl py-24 text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-gold text-ink"><UserPlus size={28} /></span>
        <p className="eyebrow mt-6">One quick step</p>
        <h1 className="h-display mt-3 text-4xl sm:text-5xl">Create your free account to {action}.</h1>
        <p className="mt-3 text-ink-500">Your account keeps your reservations and orders in one place, lets you track room service live, and earns loyalty points on every stay.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href={`/register?next=${next}`} className="btn-gold"><UserPlus size={16} /> Create account</Link>
          <Link href={`/login?next=${next}`} className="btn-outline">I already have an account</Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
