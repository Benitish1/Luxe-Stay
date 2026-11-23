'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Plus, Search } from 'lucide-react';
import { PageHead, Tabs } from '@/components/dash';
import { Badge, Modal, fmtDate } from '@/components/ui';
import { useStore, nightsBetween } from '@/lib/store';
import { money } from '@/lib/config';
import type { Booking, BookingStatus } from '@/lib/types';

type F = 'all' | BookingStatus;

export default function Reservations() {
  const { db, setBookingStatus, assignRoom, notify } = useStore();
  const [filter, setFilter] = useState<F>('all');
  const [q, setQ] = useState('');
  const [sel, setSel] = useState<Booking | null>(null);

  const list = useMemo(() => db.bookings
    .filter((b) => (filter === 'all' || b.status === filter) && `${b.guestName} ${b.code} ${b.guestEmail}`.toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => a.checkIn.localeCompare(b.checkIn)), [db.bookings, filter, q]);

  const count = (s: F) => (s === 'all' ? db.bookings.length : db.bookings.filter((b) => b.status === s).length);
  const rt = (id: string) => db.roomTypes.find((r) => r.id === id);
  const current = sel && db.bookings.find((b) => b.id === sel.id);

  const act = (b: Booking, s: BookingStatus, msg: string) => { setBookingStatus(b.id, s); notify(msg); setSel(null); };

  return (
    <>
      <PageHead title="Reservations" sub="Manage all bookings, check guests in and out." action={<Link href="/book" target="_blank" className="btn-dark btn-sm"><Plus size={14} /> New booking</Link>} />
      <div className="mb-6 flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
        <Tabs value={filter} onChange={setFilter} options={(['all', 'pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled'] as F[]).map((s) => ({ id: s, label: s === 'all' ? 'All' : s.replace('_', ' ').replace(/^\w/, (c) => c.toUpperCase()), count: count(s) }))} />
        <label className="relative w-full max-w-xs">
          <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-500" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search guest or code" className="input rounded-full py-2.5 pl-10" />
        </label>
      </div>
      <div className="card overflow-x-auto">
        <table className="table-luxe">
          <thead><tr><th>Code</th><th>Guest</th><th>Room</th><th>Stay</th><th>Total</th><th>Status</th><th /></tr></thead>
          <tbody>
            {list.map((b) => (
              <tr key={b.id} className="cursor-pointer" onClick={() => setSel(b)}>
                <td className="font-mono text-xs tracking-wider text-gold-700">{b.code}</td>
                <td><p className="font-semibold">{b.guestName}</p><p className="text-xs text-ink-500">{b.guestEmail}</p></td>
                <td>{rt(b.roomTypeId)?.name}<p className="text-xs text-ink-500">{b.roomId ? `Room ${db.rooms.find((r) => r.id === b.roomId)?.number}` : 'Unassigned'}</p></td>
                <td>{fmtDate(b.checkIn, { day: 'numeric', month: 'short' })} – {fmtDate(b.checkOut, { day: 'numeric', month: 'short' })}<p className="text-xs text-ink-500">{nightsBetween(b.checkIn, b.checkOut)} nights · {b.guests} guests</p></td>
                <td className="font-semibold">{money(b.total)}<p className={`text-xs font-normal ${b.paid ? 'text-emerald-600' : 'text-amber-600'}`}>{b.paid ? 'Paid' : 'Unpaid'}</p></td>
                <td><Badge status={b.status} /></td>
                <td className="text-right text-xs font-semibold text-gold-700">Manage →</td>
              </tr>
            ))}
            {list.length === 0 && <tr><td colSpan={7} className="py-12 text-center text-ink-500">No reservations found.</td></tr>}
          </tbody>
        </table>
      </div>

      <Modal open={!!current} onClose={() => setSel(null)} title={current?.guestName || ''} wide>
        {current && (() => {
          const type = rt(current.roomTypeId)!;
          const freeRooms = db.rooms.filter((r) => r.typeId === current.roomTypeId && (r.status === 'available' || r.id === current.roomId));
          return (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-3"><Badge status={current.status} /><span className="font-mono text-sm tracking-widest text-gold-700">{current.code}</span></div>
              <div className="grid gap-3 text-sm sm:grid-cols-2">
                {[
                  ['Room type', type.name], ['Dates', `${fmtDate(current.checkIn)} → ${fmtDate(current.checkOut)}`],
                  ['Guests', current.guests], ['Phone', current.guestPhone], ['Email', current.guestEmail],
                  ['Extras', current.extras.join(', ') || '—'], ['Payment', `${current.paymentMethod.replace(/_/g, ' ')} · ${current.paid ? 'paid' : 'unpaid'}`], ['Total', money(current.total)],
                ].map(([k, v]) => <div key={String(k)} className="rounded-xl bg-white p-3"><p className="text-xs text-ink-500">{k}</p><p className="font-semibold">{v}</p></div>)}
              </div>
              {current.requests && <p className="rounded-xl bg-gold/10 p-4 text-sm"><b>Request:</b> {current.requests}</p>}
              {!['checked_out', 'cancelled'].includes(current.status) && (
                <label className="block"><span className="label">Assign room</span>
                  <select className="input" value={current.roomId || ''} onChange={(e) => { assignRoom(current.id, e.target.value); notify('Room assigned'); }}>
                    <option value="">— Select a room —</option>
                    {freeRooms.map((r) => <option key={r.id} value={r.id}>Room {r.number} (floor {r.floor})</option>)}
                  </select>
                </label>
              )}
              <div className="flex flex-wrap gap-2 border-t border-ink/10 pt-5">
                {current.status === 'pending' && <button onClick={() => act(current, 'confirmed', 'Reservation confirmed')} className="btn-dark btn-sm">Confirm</button>}
                {['pending', 'confirmed'].includes(current.status) && <button onClick={() => act(current, 'checked_in', `${current.guestName} checked in`)} className="btn-gold btn-sm">Check in</button>}
                {current.status === 'checked_in' && <button onClick={() => act(current, 'checked_out', `${current.guestName} checked out`)} className="btn-gold btn-sm">Check out & settle</button>}
                {['pending', 'confirmed'].includes(current.status) && <button onClick={() => act(current, 'cancelled', 'Reservation cancelled')} className="btn btn-sm text-rose-600 hover:bg-rose-50">Cancel</button>}
              </div>
            </div>
          );
        })()}
      </Modal>
    </>
  );
}
