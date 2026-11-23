'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CalendarDays, Search, Users } from 'lucide-react';
import { addDays, today } from './ui';

export default function BookingBar({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const [checkIn, setCheckIn] = useState(addDays(today(), 1));
  const [checkOut, setCheckOut] = useState(addDays(today(), 3));
  const [guests, setGuests] = useState(2);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/rooms?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`);
  };

  const field = 'flex flex-1 items-center gap-3 px-5 py-3';
  return (
    <form onSubmit={submit}
      className={`grid w-full gap-px overflow-hidden rounded-3xl bg-ink/10 shadow-luxe sm:grid-cols-2 lg:flex lg:rounded-full ${compact ? '' : 'max-w-4xl'}`}>
      <label className={`${field} bg-white`}>
        <CalendarDays size={18} className="shrink-0 text-gold-600" />
        <span className="flex-1">
          <span className="block text-[10px] font-semibold uppercase tracking-wider text-ink-500">Check in</span>
          <input type="date" value={checkIn} min={today()} required
            onChange={(e) => { setCheckIn(e.target.value); if (e.target.value >= checkOut) setCheckOut(addDays(e.target.value, 1)); }}
            className="w-full bg-transparent text-sm font-semibold outline-none" />
        </span>
      </label>
      <label className={`${field} bg-white`}>
        <CalendarDays size={18} className="shrink-0 text-gold-600" />
        <span className="flex-1">
          <span className="block text-[10px] font-semibold uppercase tracking-wider text-ink-500">Check out</span>
          <input type="date" value={checkOut} min={addDays(checkIn, 1)} required onChange={(e) => setCheckOut(e.target.value)}
            className="w-full bg-transparent text-sm font-semibold outline-none" />
        </span>
      </label>
      <label className={`${field} bg-white`}>
        <Users size={18} className="shrink-0 text-gold-600" />
        <span className="flex-1">
          <span className="block text-[10px] font-semibold uppercase tracking-wider text-ink-500">Guests</span>
          <select value={guests} onChange={(e) => setGuests(+e.target.value)} className="w-full bg-transparent text-sm font-semibold outline-none">
            {[1, 2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>)}
          </select>
        </span>
      </label>
      <div className="bg-white p-2">
        <button className="btn-gold h-full w-full whitespace-nowrap lg:px-8"><Search size={16} /> Check Availability</button>
      </div>
    </form>
  );
}
