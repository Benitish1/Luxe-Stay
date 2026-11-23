'use client';

import Link from 'next/link';
import { ArrowRight, BedDouble, ChefHat, DollarSign, LogIn, LogOut, Percent } from 'lucide-react';
import { RevenueChart, Stat } from '@/components/dash';
import { Badge, timeAgo, today } from '@/components/ui';
import { revenueHistory } from '@/lib/seed';
import { useStore } from '@/lib/store';
import { money } from '@/lib/config';

const ROOM_STATUS = [
  { id: 'available', label: 'Available', cls: 'bg-emerald-500' },
  { id: 'occupied', label: 'Occupied', cls: 'bg-sky-600' },
  { id: 'cleaning', label: 'Cleaning', cls: 'bg-amber-400' },
  { id: 'maintenance', label: 'Maintenance', cls: 'bg-rose-500' },
] as const;

export default function DashboardHome() {
  const { db, setBookingStatus, notify } = useStore();
  const t = today();
  const total = db.rooms.length;
  const occupied = db.rooms.filter((r) => r.status === 'occupied').length;
  const occupancy = total ? Math.round((occupied / total) * 100) : 0;
  const arrivals = db.bookings.filter((b) => b.checkIn === t && ['confirmed', 'pending'].includes(b.status));
  const departures = db.bookings.filter((b) => b.checkOut === t && b.status === 'checked_in');
  const inHouse = db.bookings.filter((b) => b.status === 'checked_in');
  const activeOrders = db.orders.filter((o) => ['received', 'preparing', 'ready'].includes(o.status));
  const todaysDining = db.orders.filter((o) => o.createdAt.slice(0, 10) === t && o.status !== 'cancelled').reduce((s, o) => s + o.total, 0);
  const adr = inHouse.length ? inHouse.reduce((s, b) => s + (db.roomTypes.find((r) => r.id === b.roomTypeId)?.price || 0), 0) / inHouse.length : 0;
  const chart = revenueHistory.map((d, i) => ({ date: d.date, value: d.rooms + d.dining + (i === revenueHistory.length - 1 ? Math.round(todaysDining) : 0) }));
  const fortnight = chart.reduce((s, d) => s + d.value, 0);

  const roomName = (typeId: string) => db.roomTypes.find((r) => r.id === typeId)?.name;
  const roomNo = (id?: string) => db.rooms.find((r) => r.id === id)?.number;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Occupancy" value={`${occupancy}%`} hint={`${occupied} of ${total} rooms occupied`} icon={<Percent size={16} />} />
        <Stat label="Arrivals today" value={String(arrivals.length)} hint={`${departures.length} departures · ${inHouse.length} in-house`} icon={<LogIn size={16} />} />
        <Stat label="Avg. daily rate" value={money(Math.round(adr))} hint="Across in-house guests" icon={<DollarSign size={16} />} />
        <Stat label="Kitchen" value={String(activeOrders.length)} hint={`Active orders · ${money(todaysDining)} today`} icon={<ChefHat size={16} />} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <div className="card p-6">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">Total revenue · last 14 days</p>
              <p className="mt-1 font-display text-4xl font-semibold">{money(fortnight)}</p>
            </div>
            <p className="text-xs text-ink-500">Rooms + dining, per day</p>
          </div>
          <div className="mt-4"><RevenueChart data={chart} /></div>
        </div>

        <div className="card p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">Room status</p>
          <p className="mt-1 font-display text-4xl font-semibold">{total} rooms</p>
          <div className="mt-6 flex h-4 gap-0.5 overflow-hidden rounded-full">
            {ROOM_STATUS.map((s) => {
              const n = db.rooms.filter((r) => r.status === s.id).length;
              return n ? <div key={s.id} className={`${s.cls} first:rounded-l-full last:rounded-r-full`} style={{ width: `${(n / total) * 100}%` }} title={`${s.label}: ${n}`} /> : null;
            })}
          </div>
          <ul className="mt-6 space-y-3">
            {ROOM_STATUS.map((s) => {
              const n = db.rooms.filter((r) => r.status === s.id).length;
              return (
                <li key={s.id} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-3"><span className={`h-2.5 w-2.5 rounded-full ${s.cls}`} />{s.label}</span>
                  <span className="font-semibold">{n} <span className="font-normal text-ink-500">· {Math.round((n / total) * 100)}%</span></span>
                </li>
              );
            })}
          </ul>
          <Link href="/dashboard/rooms" className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-gold-700">Open front desk <ArrowRight size={14} /></Link>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-2xl">Today&apos;s arrivals</h2>
            <Link href="/dashboard/reservations" className="text-xs font-semibold text-gold-700">All reservations →</Link>
          </div>
          {arrivals.length === 0 ? <p className="py-8 text-center text-sm text-ink-500">No arrivals expected today.</p> : (
            <ul className="divide-y divide-ink/5">
              {arrivals.map((b) => (
                <li key={b.id} className="flex items-center justify-between gap-3 py-3">
                  <div>
                    <p className="font-semibold">{b.guestName}</p>
                    <p className="text-xs text-ink-500">{roomName(b.roomTypeId)} · {b.guests} guests{b.extras.length > 0 && ` · ${b.extras.join(', ')}`}</p>
                  </div>
                  <button onClick={() => { setBookingStatus(b.id, 'checked_in'); notify(`${b.guestName} checked in`); }} className="btn-dark btn-sm"><LogIn size={13} /> Check in</button>
                </li>
              ))}
            </ul>
          )}
          {departures.length > 0 && (
            <>
              <h3 className="mb-2 mt-6 font-display text-xl">Departures</h3>
              <ul className="divide-y divide-ink/5">
                {departures.map((b) => (
                  <li key={b.id} className="flex items-center justify-between gap-3 py-3">
                    <div><p className="font-semibold">{b.guestName}</p><p className="text-xs text-ink-500">Room {roomNo(b.roomId)} · {money(b.total)}</p></div>
                    <button onClick={() => { setBookingStatus(b.id, 'checked_out'); notify(`${b.guestName} checked out`); }} className="btn-outline btn-sm"><LogOut size={13} /> Check out</button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        <div className="card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-2xl">Live kitchen orders</h2>
            <Link href="/dashboard/orders" className="text-xs font-semibold text-gold-700">Kitchen board →</Link>
          </div>
          {activeOrders.length === 0 ? <p className="py-8 text-center text-sm text-ink-500">The kitchen is quiet.</p> : (
            <ul className="divide-y divide-ink/5">
              {activeOrders.map((o) => (
                <li key={o.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="font-semibold">{o.location} <span className="font-normal text-ink-500">· {o.customerName}</span></p>
                    <p className="truncate text-xs text-ink-500">{o.lines.map((l) => `${l.qty}× ${l.name}`).join(', ')}</p>
                  </div>
                  <div className="shrink-0 text-right"><Badge status={o.status} /><p className="mt-1 text-[11px] text-ink-500">{timeAgo(o.createdAt)}</p></div>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-ivory p-4"><p className="text-xs text-ink-500">Housekeeping open</p><p className="font-display text-3xl">{db.tasks.filter((x) => x.status !== 'done').length}</p></div>
            <div className="rounded-xl bg-ivory p-4"><p className="text-xs text-ink-500">Spa requests</p><p className="font-display text-3xl">{db.serviceRequests.filter((x) => x.status === 'requested').length}</p></div>
          </div>
        </div>
      </div>
      <p className="flex items-center gap-2 text-xs text-ink-500"><BedDouble size={14} /> Demo data — changes are saved in this browser only until the Java backend is connected.</p>
    </div>
  );
}
