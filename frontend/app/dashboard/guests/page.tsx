'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { PageHead } from '@/components/dash';
import { Badge, fmtDate } from '@/components/ui';
import { useStore } from '@/lib/store';
import { money } from '@/lib/config';
import type { Role } from '@/lib/types';

export default function Guests() {
  const { db, user, setUserRole, notify } = useStore();
  const [q, setQ] = useState('');

  // Combine registered users and walk-in guests from bookings
  const walkIns = Array.from(new Map(db.bookings.filter((b) => !db.users.some((u) => u.email === b.guestEmail)).map((b) => [b.guestEmail, b])).values());
  const spend = (email: string, id?: string) =>
    db.bookings.filter((b) => b.guestEmail === email && b.status !== 'cancelled').reduce((s, b) => s + b.total, 0) +
    db.orders.filter((o) => id && o.userId === id).reduce((s, o) => s + o.total, 0);
  const stays = (email: string) => db.bookings.filter((b) => b.guestEmail === email && b.status !== 'cancelled').length;
  const match = (s: string) => s.toLowerCase().includes(q.toLowerCase());

  return (
    <>
      <PageHead title="Guests & users" sub="Guest profiles, spending history and account roles." action={
        <label className="relative w-full max-w-xs"><Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-500" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name or email" className="input rounded-full py-2.5 pl-10" /></label>
      } />
      <div className="card overflow-x-auto">
        <table className="table-luxe">
          <thead><tr><th>Name</th><th>Contact</th><th>Stays</th><th>Lifetime spend</th><th>Points</th><th>Role</th></tr></thead>
          <tbody>
            {db.users.filter((u) => match(u.name + u.email)).map((u) => (
              <tr key={u.id}>
                <td><div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-full bg-gold/20 text-xs font-bold text-gold-700">{u.name.split(' ').map((p) => p[0]).slice(0, 2).join('')}</span><div><p className="font-semibold">{u.name}</p><p className="text-xs text-ink-500">Since {fmtDate(u.createdAt)}</p></div></div></td>
                <td>{u.email}<p className="text-xs text-ink-500">{u.phone}</p></td>
                <td>{stays(u.email)}</td>
                <td className="font-semibold">{money(spend(u.email, u.id))}</td>
                <td>{u.loyaltyPoints.toLocaleString()}</td>
                <td>
                  <select disabled={u.id === user?.id} value={u.role} onChange={(e) => { setUserRole(u.id, e.target.value as Role); notify(`${u.name} is now ${e.target.value}`); }} className="rounded-full border border-ink/10 bg-white px-3 py-1.5 text-xs font-semibold capitalize outline-none disabled:opacity-50">
                    <option value="guest">Guest</option><option value="staff">Staff</option><option value="admin">Admin</option>
                  </select>
                </td>
              </tr>
            ))}
            {walkIns.filter((b) => match(b.guestName + b.guestEmail)).map((b) => (
              <tr key={b.guestEmail}>
                <td><div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-full bg-ink/5 text-xs font-bold">{b.guestName.split(' ').map((p) => p[0]).slice(0, 2).join('')}</span><p className="font-semibold">{b.guestName}</p></div></td>
                <td>{b.guestEmail}<p className="text-xs text-ink-500">{b.guestPhone}</p></td>
                <td>{stays(b.guestEmail)}</td>
                <td className="font-semibold">{money(spend(b.guestEmail))}</td>
                <td>—</td>
                <td><Badge status="gray">No account</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
