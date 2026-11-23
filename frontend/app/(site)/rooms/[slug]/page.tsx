'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { BedDouble, Check, ChevronLeft, Eye, Maximize2, Users } from 'lucide-react';
import { Img, Stars, addDays, today } from '@/components/ui';
import RoomCard from '@/components/RoomCard';
import { quoteBooking, useStore } from '@/lib/store';
import { HOTEL, money } from '@/lib/config';

function RoomDetail() {
  const { slug } = useParams<{ slug: string }>();
  const params = useSearchParams();
  const router = useRouter();
  const { db, isStaff, availableCount } = useStore();
  const room = db.roomTypes.find((r) => r.slug === slug);
  const [active, setActive] = useState(0);
  const [checkIn, setCheckIn] = useState(params.get('checkIn') || addDays(today(), 1));
  const [checkOut, setCheckOut] = useState(params.get('checkOut') || addDays(today(), 3));
  const [guests, setGuests] = useState(Number(params.get('guests') || 2));

  if (!room) {
    return (
      <div className="container-luxe py-48 text-center">
        <h1 className="h-display text-5xl">Room not found</h1>
        <Link href="/rooms" className="btn-dark mt-8">Back to rooms</Link>
      </div>
    );
  }
  const q = quoteBooking(room, checkIn, checkOut, guests, []);
  const avail = availableCount(room.id, checkIn, checkOut);

  return (
    <>
      <section className="bg-ink pb-8 pt-28">
        <div className="container-luxe">
          <Link href="/rooms" className="inline-flex items-center gap-1 text-sm text-white/60 hover:text-gold"><ChevronLeft size={16} /> All rooms</Link>
          <div className="mt-6 grid gap-4 lg:grid-cols-[2fr_1fr]">
            <Img src={room.images[active]} alt={room.name} className="aspect-[16/10] w-full rounded-[2rem]" />
            <div className="grid grid-cols-3 gap-4 lg:grid-cols-1">
              {room.images.map((im, i) => (
                <button key={i} onClick={() => setActive(i)} className={`overflow-hidden rounded-2xl ring-2 transition ${active === i ? 'ring-gold' : 'ring-transparent opacity-70 hover:opacity-100'}`}>
                  <Img src={im} alt="" className="aspect-[16/10] h-full w-full" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container-luxe grid gap-12 py-16 lg:grid-cols-[1fr_400px]">
        <div>
          <div className="flex items-center gap-3"><Stars value={room.rating} /><span className="text-sm text-ink-500">{room.rating.toFixed(1)} guest rating</span></div>
          <h1 className="h-display mt-4 text-5xl sm:text-6xl">{room.name}</h1>
          <div className="mt-6 flex flex-wrap gap-6 text-sm text-ink-500">
            <span className="flex items-center gap-2"><Maximize2 size={16} className="text-gold-600" />{room.size} m²</span>
            <span className="flex items-center gap-2"><Users size={16} className="text-gold-600" />Up to {room.capacity} guests</span>
            <span className="flex items-center gap-2"><BedDouble size={16} className="text-gold-600" />{room.beds}</span>
            <span className="flex items-center gap-2"><Eye size={16} className="text-gold-600" />{room.view} view</span>
          </div>
          <p className="mt-8 text-lg leading-relaxed text-ink-500">{room.description}</p>

          <h2 className="h-display mt-14 text-3xl">Room amenities</h2>
          <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {room.amenities.map((a) => (
              <li key={a} className="flex items-center gap-3 text-sm"><span className="grid h-7 w-7 place-items-center rounded-full bg-gold/15 text-gold-700"><Check size={14} /></span>{a}</li>
            ))}
          </ul>

          <h2 className="h-display mt-14 text-3xl">Good to know</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[['Check-in', `From ${HOTEL.checkIn}`], ['Check-out', `Until ${HOTEL.checkOut}`], ['Cancellation', 'Free up to 48 hours before']].map(([t, v]) => (
              <div key={t} className="card p-5"><p className="text-xs uppercase tracking-wider text-ink-500">{t}</p><p className="mt-1 font-semibold">{v}</p></div>
            ))}
          </div>
        </div>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="card overflow-hidden">
            <div className="bg-ink p-6 text-white">
              <p className="text-sm text-white/60">From</p>
              <p><span className="font-display text-5xl text-gold">{money(room.price)}</span> <span className="text-sm text-white/60">/ night</span></p>
            </div>
            <div className="space-y-4 p-6">
              <div className="grid grid-cols-2 gap-3">
                <label><span className="label">Check in</span><input type="date" className="input" value={checkIn} min={today()} onChange={(e) => { setCheckIn(e.target.value); if (e.target.value >= checkOut) setCheckOut(addDays(e.target.value, 1)); }} /></label>
                <label><span className="label">Check out</span><input type="date" className="input" value={checkOut} min={addDays(checkIn, 1)} onChange={(e) => setCheckOut(e.target.value)} /></label>
              </div>
              <label className="block"><span className="label">Guests</span>
                <select className="input" value={guests} onChange={(e) => setGuests(+e.target.value)}>
                  {Array.from({ length: room.capacity }, (_, i) => i + 1).map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
              </label>
              <div className="space-y-2 border-t border-ink/10 pt-4 text-sm">
                <div className="flex justify-between text-ink-500"><span>{money(room.price)} × {q.nights} night{q.nights !== 1 && 's'}</span><span>{money(q.room)}</span></div>
                <div className="flex justify-between text-ink-500"><span>Taxes & fees</span><span>{money(q.tax)}</span></div>
                <div className="flex justify-between pt-2 text-lg font-semibold"><span>Total</span><span>{money(q.total)}</span></div>
              </div>
              <p className={`text-center text-xs font-semibold ${avail > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {avail > 0 ? `✓ ${avail} room${avail > 1 ? 's' : ''} available for these dates` : 'Sold out for these dates — try others'}
              </p>
              <button disabled={isStaff || avail === 0 || q.nights < 1} onClick={() => router.push(`/book?room=${room.slug}&checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`)} className="btn-gold w-full">
                Reserve now
              </button>
              <p className="text-center text-xs text-ink-500">{isStaff ? 'Reservations are made by guests' : 'You won’t be charged yet'}</p>
            </div>
          </div>
        </aside>
      </section>

      <section className="bg-ivory-200/60 py-20">
        <div className="container-luxe">
          <h2 className="h-display text-4xl">You may also like</h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {db.roomTypes.filter((r) => r.id !== room.id).slice(0, 3).map((r) => <RoomCard key={r.id} room={r} />)}
          </div>
        </div>
      </section>
    </>
  );
}

export default function Page() {
  return <Suspense><RoomDetail /></Suspense>;
}
