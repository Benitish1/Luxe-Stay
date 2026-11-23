'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BedDouble, Crown, Sparkles, Star, UtensilsCrossed, User as UserIcon } from 'lucide-react';
import { Badge, Empty, Img, Stars, fmtDate, timeAgo } from '@/components/ui';
import { useStore } from '@/lib/store';
import { money } from '@/lib/config';

const TABS = [
  { id: 'stays', label: 'My stays', icon: BedDouble },
  { id: 'orders', label: 'Orders', icon: UtensilsCrossed },
  { id: 'services', label: 'Spa & services', icon: Sparkles },
  { id: 'profile', label: 'Profile', icon: UserIcon },
] as const;

const tier = (p: number) => (p >= 5000 ? 'Platinum' : p >= 2000 ? 'Gold' : 'Silver');

export default function AccountPage() {
  const router = useRouter();
  const { ready, user, db, setBookingStatus, updateProfile, addReview, notify } = useStore();
  const [tab, setTab] = useState<(typeof TABS)[number]['id']>('stays');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [review, setReview] = useState({ rating: 5, title: '', text: '' });

  useEffect(() => {
    if (ready && !user) router.replace('/login?next=/account');
    if (user) { setName(user.name); setPhone(user.phone || ''); }
  }, [ready, user, router]);

  if (!user) return <div className="h-screen bg-ink" />;

  const myBookings = db.bookings.filter((b) => b.userId === user.id || b.guestEmail === user.email);
  const myOrders = db.orders.filter((o) => o.userId === user.id);
  const myServices = db.serviceRequests.filter((s) => s.userId === user.id);
  const next = 5000;

  return (
    <>
      <section className="grain relative overflow-hidden bg-ink pb-12 pt-36">
        <div className="container-luxe relative flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <p className="eyebrow text-gold-300">My account</p>
            <h1 className="h-display mt-3 text-5xl text-white sm:text-6xl">Welcome back, {user.name.split(' ')[0]}.</h1>
          </div>
          <div className="w-full max-w-sm rounded-3xl bg-gradient-to-br from-gold-300 via-gold to-gold-700 p-6 text-ink shadow-luxe">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-luxe">LuxeStay Circle</span>
              <Crown size={20} />
            </div>
            <p className="mt-6 font-display text-4xl font-semibold">{user.loyaltyPoints.toLocaleString()} pts</p>
            <p className="text-sm font-semibold">{tier(user.loyaltyPoints)} member</p>
            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-ink/15"><div className="h-full rounded-full bg-ink" style={{ width: `${Math.min(100, (user.loyaltyPoints / next) * 100)}%` }} /></div>
            <p className="mt-2 text-xs">{user.loyaltyPoints >= next ? 'Top tier reached' : `${(next - user.loyaltyPoints).toLocaleString()} pts to Platinum`}</p>
          </div>
        </div>
      </section>

      <section className="container-luxe py-12">
        <div className="mb-8 flex gap-2 overflow-x-auto">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`flex items-center gap-2 whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-semibold transition ${tab === t.id ? 'bg-ink text-white' : 'bg-white text-ink-500 shadow-soft'}`}>
              <t.icon size={16} />{t.label}
            </button>
          ))}
        </div>

        {tab === 'stays' && (myBookings.length === 0 ? (
          <Empty icon={<BedDouble />} title="No stays yet" sub="Your upcoming and past reservations will appear here." action={<Link href="/book" className="btn-dark">Book a stay</Link>} />
        ) : (
          <div className="space-y-4">
            {myBookings.map((b) => {
              const rt = db.roomTypes.find((r) => r.id === b.roomTypeId)!;
              const room = db.rooms.find((r) => r.id === b.roomId);
              return (
                <div key={b.id} className="card flex flex-col gap-5 p-4 sm:flex-row sm:items-center">
                  <Img src={rt.images[0]} alt={rt.name} className="h-32 w-full rounded-xl sm:w-48" />
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3"><h3 className="font-display text-2xl">{rt.name}</h3><Badge status={b.status} /></div>
                    <p className="mt-1 text-sm text-ink-500">{fmtDate(b.checkIn)} → {fmtDate(b.checkOut)} · {b.guests} guests{room && ` · Room ${room.number}`}</p>
                    <p className="mt-1 font-mono text-xs tracking-widest text-gold-700">{b.code}</p>
                  </div>
                  <div className="flex flex-col items-start gap-2 sm:items-end">
                    <p className="font-display text-2xl">{money(b.total)}</p>
                    {['pending', 'confirmed'].includes(b.status) && (
                      <button onClick={() => { if (confirm('Cancel this reservation?')) { setBookingStatus(b.id, 'cancelled'); notify('Reservation cancelled'); } }} className="text-xs font-semibold text-rose-600 hover:underline">Cancel booking</button>
                    )}
                    {b.status === 'checked_in' && <Link href="/dining#menu" className="btn-gold btn-sm">Order room service</Link>}
                  </div>
                </div>
              );
            })}
            {myBookings.some((b) => b.status === 'checked_out') && (
              <form onSubmit={(e) => { e.preventDefault(); addReview({ name: user.name.split(' ')[0] + ' ' + (user.name.split(' ')[1]?.[0] || '') + '.', country: '—', ...review }); setReview({ rating: 5, title: '', text: '' }); notify('Thank you for your review!'); }}
                className="card mt-8 space-y-4 p-6">
                <h3 className="h-display text-3xl">Share your experience</h3>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <button type="button" key={i} onClick={() => setReview({ ...review, rating: i })} aria-label={`${i} stars`}>
                      <Star size={26} className={i <= review.rating ? 'fill-gold text-gold' : 'text-ink/20'} />
                    </button>
                  ))}
                </div>
                <input required className="input" placeholder="Title" value={review.title} onChange={(e) => setReview({ ...review, title: e.target.value })} />
                <textarea required rows={3} className="input" placeholder="Tell us about your stay" value={review.text} onChange={(e) => setReview({ ...review, text: e.target.value })} />
                <button className="btn-dark">Submit review</button>
              </form>
            )}
          </div>
        ))}

        {tab === 'orders' && (myOrders.length === 0 ? (
          <Empty icon={<UtensilsCrossed />} title="No orders yet" action={<Link href="/dining#menu" className="btn-dark">Browse menu</Link>} />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {myOrders.map((o) => (
              <Link key={o.id} href={`/dining/order/${o.id}`} className="card block p-5 transition hover:shadow-luxe">
                <div className="flex items-center justify-between"><p className="font-mono text-xs tracking-widest text-gold-700">{o.code}</p><Badge status={o.status} /></div>
                <p className="mt-3 text-sm">{o.lines.map((l) => `${l.qty}× ${l.name}`).join(', ')}</p>
                <div className="mt-4 flex justify-between text-sm text-ink-500"><span>{o.location} · {timeAgo(o.createdAt)}</span><span className="font-semibold text-ink">{money(o.total)}</span></div>
              </Link>
            ))}
          </div>
        ))}

        {tab === 'services' && (myServices.length === 0 ? (
          <Empty icon={<Sparkles />} title="No spa or service bookings" action={<Link href="/experiences" className="btn-dark">Explore experiences</Link>} />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {myServices.map((s) => {
              const svc = db.services.find((x) => x.id === s.serviceId)!;
              return (
                <div key={s.id} className="card flex items-center gap-4 p-4">
                  <Img src={svc.image} alt={svc.name} className="h-20 w-20 rounded-xl" />
                  <div className="flex-1"><p className="font-display text-xl">{svc.name}</p><p className="text-sm text-ink-500">{fmtDate(s.date)} at {s.time} · {s.people} {s.people > 1 ? 'people' : 'person'}</p></div>
                  <Badge status={s.status} />
                </div>
              );
            })}
          </div>
        ))}

        {tab === 'profile' && (
          <form onSubmit={(e) => { e.preventDefault(); updateProfile({ name, phone }); notify('Profile updated'); }} className="card max-w-xl space-y-4 p-8">
            <h3 className="h-display text-3xl">Profile details</h3>
            <label className="block"><span className="label">Full name</span><input className="input" value={name} onChange={(e) => setName(e.target.value)} /></label>
            <label className="block"><span className="label">Email</span><input className="input bg-ivory" value={user.email} disabled /></label>
            <label className="block"><span className="label">Phone</span><input className="input" value={phone} onChange={(e) => setPhone(e.target.value)} /></label>
            <div className="flex items-center gap-2 text-sm text-ink-500"><Stars value={5} size={12} /> Member since {fmtDate(user.createdAt)}</div>
            <button className="btn-dark">Save changes</button>
          </form>
        )}
      </section>
    </>
  );
}
