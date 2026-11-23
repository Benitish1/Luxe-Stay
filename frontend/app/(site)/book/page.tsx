'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Check, CreditCard, Smartphone, Building2, PartyPopper, ArrowLeft, ArrowRight, Lock } from 'lucide-react';
import { Img, addDays, fmtDate, today } from '@/components/ui';
import { EXTRAS, quoteBooking, useStore } from '@/lib/store';
import { money } from '@/lib/config';
import type { Booking } from '@/lib/types';

const steps = ['Your stay', 'Enhance', 'Details & payment'];

function BookInner() {
  const params = useSearchParams();
  const { db, user, availableCount, createBooking } = useStore();
  const [step, setStep] = useState(0);
  const [typeSlug, setTypeSlug] = useState(params.get('room') || db.roomTypes[0].slug);
  const [checkIn, setCheckIn] = useState(params.get('checkIn') || addDays(today(), 1));
  const [checkOut, setCheckOut] = useState(params.get('checkOut') || addDays(today(), 3));
  const [guests, setGuests] = useState(Number(params.get('guests') || 2));
  const [extras, setExtras] = useState<string[]>([]);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [requests, setRequests] = useState('');
  const [method, setMethod] = useState<Booking['paymentMethod']>('card');
  const [done, setDone] = useState<Booking | null>(null);

  const room = db.roomTypes.find((r) => r.slug === typeSlug) || db.roomTypes[0];
  const q = quoteBooking(room, checkIn, checkOut, guests, extras);
  const avail = availableCount(room.id, checkIn, checkOut);

  const confirm = (e: React.FormEvent) => {
    e.preventDefault();
    const bk = createBooking({
      userId: user?.id, guestName: name, guestEmail: email, guestPhone: phone, roomTypeId: room.id,
      checkIn, checkOut, guests, extras, requests, total: q.total, paid: method !== 'pay_at_hotel', paymentMethod: method,
    });
    setDone(bk);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (done) {
    return (
      <section className="container-luxe max-w-2xl py-20 text-center">
        <div className="reveal mx-auto grid h-20 w-20 place-items-center rounded-full bg-gold text-ink"><PartyPopper size={34} /></div>
        <p className="eyebrow mt-8">Reservation {done.status === 'confirmed' ? 'confirmed' : 'received'}</p>
        <h1 className="h-display mt-3 text-5xl">Thank you, {done.guestName.split(' ')[0]}.</h1>
        <p className="mt-4 text-ink-500">A confirmation has been sent to <b>{done.guestEmail}</b>. We can&apos;t wait to welcome you.</p>
        <div className="card mt-10 divide-y divide-ink/5 text-left text-sm">
          {[
            ['Confirmation code', <span key="c" className="font-mono text-base font-bold tracking-widest text-gold-700">{done.code}</span>],
            ['Room', room.name],
            ['Dates', `${fmtDate(done.checkIn)} → ${fmtDate(done.checkOut)} (${q.nights} nights)`],
            ['Guests', done.guests],
            ['Extras', done.extras.join(', ') || '—'],
            ['Payment', done.paid ? 'Paid' : 'Pay at hotel'],
            ['Total', <b key="t">{money(done.total)}</b>],
          ].map(([k, v]) => (
            <div key={String(k)} className="flex justify-between gap-4 px-6 py-4"><span className="text-ink-500">{k}</span><span className="text-right">{v}</span></div>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {user ? <Link href="/account" className="btn-dark">View my bookings</Link> : <Link href="/register" className="btn-dark">Create account & earn points</Link>}
          <Link href="/dining" className="btn-outline">Pre-order dinner</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="container-luxe grid gap-10 py-14 lg:grid-cols-[1fr_380px]">
      <div>
        {/* Stepper */}
        <ol className="mb-10 flex items-center gap-2 sm:gap-4">
          {steps.map((s, i) => (
            <li key={s} className="flex flex-1 items-center gap-2 sm:gap-3">
              <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-bold transition ${i < step ? 'bg-gold text-ink' : i === step ? 'bg-ink text-white' : 'bg-ink/5 text-ink-500'}`}>
                {i < step ? <Check size={16} /> : i + 1}
              </span>
              <span className={`hidden text-sm font-semibold sm:block ${i === step ? '' : 'text-ink-500'}`}>{s}</span>
              {i < steps.length - 1 && <span className="h-px flex-1 bg-ink/10" />}
            </li>
          ))}
        </ol>

        {step === 0 && (
          <div className="reveal space-y-8">
            <h1 className="h-display text-5xl">Plan your stay</h1>
            <div className="grid gap-4 sm:grid-cols-3">
              <label><span className="label">Check in</span><input type="date" className="input" value={checkIn} min={today()} onChange={(e) => { setCheckIn(e.target.value); if (e.target.value >= checkOut) setCheckOut(addDays(e.target.value, 1)); }} /></label>
              <label><span className="label">Check out</span><input type="date" className="input" value={checkOut} min={addDays(checkIn, 1)} onChange={(e) => setCheckOut(e.target.value)} /></label>
              <label><span className="label">Guests</span>
                <select className="input" value={guests} onChange={(e) => setGuests(+e.target.value)}>{[1, 2, 3, 4, 5].map((n) => <option key={n}>{n}</option>)}</select>
              </label>
            </div>
            <div>
              <p className="label">Choose your room</p>
              <div className="space-y-3">
                {db.roomTypes.map((r) => {
                  const a = availableCount(r.id, checkIn, checkOut);
                  const fits = r.capacity >= guests;
                  const disabled = a === 0 || !fits;
                  return (
                    <button key={r.id} type="button" disabled={disabled} onClick={() => setTypeSlug(r.slug)}
                      className={`flex w-full items-center gap-4 rounded-2xl border-2 bg-white p-3 text-left transition disabled:opacity-40 ${r.slug === typeSlug ? 'border-gold shadow-soft' : 'border-transparent hover:border-ink/10'}`}>
                      <Img src={r.images[0]} alt={r.name} className="h-20 w-28 shrink-0 rounded-xl" />
                      <div className="flex-1">
                        <p className="font-display text-2xl">{r.name}</p>
                        <p className="text-xs text-ink-500">{r.size} m² · up to {r.capacity} guests · {r.view} view</p>
                        <p className={`mt-1 text-xs font-semibold ${disabled ? 'text-rose-600' : 'text-emerald-600'}`}>{!fits ? `Max ${r.capacity} guests` : a === 0 ? 'Sold out' : `${a} available`}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-display text-2xl">{money(r.price)}</p>
                        <p className="text-xs text-ink-500">per night</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
            <button disabled={avail === 0 || q.nights < 1 || room.capacity < guests} onClick={() => setStep(1)} className="btn-dark">Continue <ArrowRight size={16} /></button>
          </div>
        )}

        {step === 1 && (
          <div className="reveal space-y-8">
            <h1 className="h-display text-5xl">Make it unforgettable</h1>
            <div className="grid gap-4 sm:grid-cols-2">
              {EXTRAS.map((x) => {
                const on = extras.includes(x.id);
                return (
                  <button key={x.id} type="button" onClick={() => setExtras((e) => (on ? e.filter((i) => i !== x.id) : [...e, x.id]))}
                    className={`flex items-start gap-4 rounded-2xl border-2 bg-white p-5 text-left transition ${on ? 'border-gold shadow-soft' : 'border-transparent hover:border-ink/10'}`}>
                    <span className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md border ${on ? 'border-gold bg-gold text-ink' : 'border-ink/20'}`}>{on && <Check size={14} />}</span>
                    <span className="flex-1">
                      <span className="block font-semibold">{x.label}</span>
                      <span className="text-sm text-ink-500">{money(x.price)} / {x.per}</span>
                    </span>
                  </button>
                );
              })}
            </div>
            <label className="block"><span className="label">Special requests</span>
              <textarea rows={3} className="input" placeholder="Anniversary, dietary needs, arrival time…" value={requests} onChange={(e) => setRequests(e.target.value)} />
            </label>
            <div className="flex gap-3">
              <button onClick={() => setStep(0)} className="btn-outline"><ArrowLeft size={16} /> Back</button>
              <button onClick={() => setStep(2)} className="btn-dark">Continue <ArrowRight size={16} /></button>
            </div>
          </div>
        )}

        {step === 2 && (
          <form onSubmit={confirm} className="reveal space-y-8">
            <h1 className="h-display text-5xl">Your details</h1>
            {!user && <p className="rounded-2xl bg-gold/10 p-4 text-sm">Have an account? <Link href="/login?next=/book" className="font-semibold text-gold-700 underline">Sign in</Link> to earn {Math.round(q.total)} loyalty points on this stay.</p>}
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="sm:col-span-2"><span className="label">Full name</span><input required className="input" value={name} onChange={(e) => setName(e.target.value)} /></label>
              <label><span className="label">Email</span><input required type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
              <label><span className="label">Phone</span><input required className="input" value={phone} onChange={(e) => setPhone(e.target.value)} /></label>
            </div>
            <div>
              <p className="label">Payment method</p>
              <div className="grid gap-3 sm:grid-cols-3">
                {([['card', 'Card', CreditCard], ['mobile_money', 'Mobile Money', Smartphone], ['pay_at_hotel', 'Pay at hotel', Building2]] as const).map(([id, label, I]) => (
                  <button key={id} type="button" onClick={() => setMethod(id)}
                    className={`flex items-center gap-3 rounded-2xl border-2 bg-white p-4 text-sm font-semibold transition ${method === id ? 'border-gold' : 'border-transparent hover:border-ink/10'}`}>
                    <I size={18} className="text-gold-600" />{label}
                  </button>
                ))}
              </div>
            </div>
            {method === 'card' && (
              <div className="grid gap-4 rounded-2xl bg-white p-5 sm:grid-cols-4">
                <label className="sm:col-span-2"><span className="label">Card number</span><input required className="input" placeholder="4242 4242 4242 4242" inputMode="numeric" /></label>
                <label><span className="label">Expiry</span><input required className="input" placeholder="MM/YY" /></label>
                <label><span className="label">CVC</span><input required className="input" placeholder="123" inputMode="numeric" /></label>
              </div>
            )}
            {method === 'mobile_money' && (
              <div className="rounded-2xl bg-white p-5">
                <label><span className="label">Mobile money number</span><input required className="input" placeholder="+250 78x xxx xxx" /></label>
                <p className="mt-2 text-xs text-ink-500">You&apos;ll receive a prompt on your phone to approve the payment.</p>
              </div>
            )}
            <p className="flex items-center gap-2 text-xs text-ink-500"><Lock size={14} /> Demo mode — no real payment is taken.</p>
            <div className="flex gap-3">
              <button type="button" onClick={() => setStep(1)} className="btn-outline"><ArrowLeft size={16} /> Back</button>
              <button className="btn-gold">Confirm & {method === 'pay_at_hotel' ? 'reserve' : `pay ${money(q.total)}`}</button>
            </div>
          </form>
        )}
      </div>

      {/* Summary */}
      <aside className="lg:sticky lg:top-28 lg:self-start">
        <div className="card overflow-hidden">
          <Img src={room.images[0]} alt={room.name} className="aspect-[16/9] w-full" />
          <div className="space-y-4 p-6 text-sm">
            <div>
              <p className="eyebrow">Your reservation</p>
              <p className="h-display mt-1 text-3xl">{room.name}</p>
            </div>
            <div className="grid grid-cols-2 gap-3 rounded-xl bg-ivory p-4">
              <div><p className="text-xs text-ink-500">Check in</p><p className="font-semibold">{fmtDate(checkIn)}</p></div>
              <div><p className="text-xs text-ink-500">Check out</p><p className="font-semibold">{fmtDate(checkOut)}</p></div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-ink-500"><span>{q.nights} night{q.nights !== 1 && 's'} · {guests} guest{guests > 1 && 's'}</span><span>{money(q.room)}</span></div>
              {q.extrasTotal > 0 && <div className="flex justify-between text-ink-500"><span>Extras</span><span>{money(q.extrasTotal)}</span></div>}
              <div className="flex justify-between text-ink-500"><span>Taxes</span><span>{money(q.tax)}</span></div>
              <div className="flex justify-between border-t border-ink/10 pt-3 text-lg font-semibold"><span>Total</span><span>{money(q.total)}</span></div>
            </div>
          </div>
        </div>
      </aside>
    </section>
  );
}

export default function BookPage() {
  return (
    <>
      <div className="h-24 bg-ink sm:h-28" />
      <Suspense><BookInner /></Suspense>
    </>
  );
}
