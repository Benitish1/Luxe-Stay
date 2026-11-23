'use client';

import Link from 'next/link';
import { Eye, LayoutDashboard } from 'lucide-react';
import { useStore } from '@/lib/store';

/** Shown on the public website when an admin/staff member is signed in. */
export default function StaffBar() {
  const { user, isStaff } = useStore();
  if (!isStaff || !user) return null;
  return (
    <div className="fixed bottom-4 left-1/2 z-[60] w-[calc(100%-2rem)] max-w-xl -translate-x-1/2">
      <div className="flex items-center gap-3 rounded-full bg-ink py-2 pl-5 pr-2 text-sm text-white shadow-luxe ring-1 ring-gold/40">
        <Eye size={16} className="shrink-0 text-gold" />
        <span className="flex-1 truncate">Viewing the guest website as <b className="capitalize">{user.role}</b></span>
        <Link href="/dashboard" className="btn-gold btn-sm shrink-0"><LayoutDashboard size={14} /> Dashboard</Link>
      </div>
    </div>
  );
}
