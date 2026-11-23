'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  ArrowRight, Car, ChevronLeft, ChevronRight, Dumbbell, Sparkles, UtensilsCrossed, Waves, Wifi, Wine, ConciergeBell, Quote,
} from 'lucide-react';
import BookingBar from '@/components/BookingBar';
import RoomCard from '@/components/RoomCard';
import { Img, SectionTitle, Stars } from '@/components/ui';
import { IMAGES } from '@/lib/seed';
import { useStore } from '@/lib/store';
import { money } from '@/lib/config';

const amenities = [
  { icon: Waves, title: 'Infinity Pool', text: 'Heated, with a sunset bar' },
  { icon: Sparkles, title: 'Spa & Hammam', text: 'Rituals inspired by Africa' },
  { icon: UtensilsCrossed, title: 'Fine Dining', text: 'Two restaurants & room service' },
  { icon: Dumbbell, title: 'Fitness Studio', text: 'Open 24 hours' },
  { icon: Car, title: 'Airport Transfers', text: 'Private chauffeur service' },
  { icon: Wifi, title: 'High-speed Wi-Fi', text: 'Complimentary everywhere' },
  { icon: Wine, title: 'Rooftop Lounge', text: 'Cocktails under the stars' },
  { icon: ConciergeBell, title: '24/7 Concierge', text: 'Anything, anytime' },
];

const offers = [
  { tag: 'Save 20%', title: 'Stay Longer', text: 'Book 4 nights or more and enjoy 20% off with daily breakfast.', image: IMAGES.resort },
  { tag: 'Romance', title: 'Honeymoon Escape', text: 'Suite upgrade, couples massage, champagne and a candlelit dinner.', image: IMAGES.spa },
  { tag: 'Family', title: 'Kids Stay Free', text: 'Children under 12 stay and dine free in our Family Suites.', image: IMAGES.pool },
];

export default function Home() {
  const { db } = useStore();
  const [rv, setRv] = useState(0);
  const reviews = db.reviews.filter((r) => r.published);
  const review = reviews[rv % Math.max(1, reviews.length)];
  const featured = db.menu.filter((m) => m.tags.includes('Chef’s pick') || m.tags.includes('Signature')).slice(0, 4);

  return (
    <>
      {/* HERO */}
      <section className="grain relative flex min-h-screen items-center overflow-hidden bg-ink">
        <Img src={IMAGES.hero} alt="LuxeStay pool at dusk" className="absolute inset-0 h-full w-full animate-kenburns" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/30 to-ink/90" />
        <div className="container-luxe relative pb-20 pt-40">
          <div className="max-w-4xl">
            <p className="eyebrow reveal text-gold-300">Welcome to LuxeStay · Five-star hospitality</p>
            <h1 className="h-display reveal mt-6 text-6xl text-white sm:text-7xl lg:text-[7.5rem]" style={{ animationDelay: '.15s' }}>
              Where every stay <br /> becomes a <em className="gold-text">story</em>.
            </h1>
            <p className="reveal mt-8 max-w-xl text-lg leading-relaxed text-white/75" style={{ animationDelay: '.3s' }}>
              Elegant rooms, a world-class kitchen, a serene spa and service that remembers your name. Book direct for our best rates and exclusive perks.
            </p>
          </div>
          <div className="reveal mt-12" style={{ animationDelay: '.45s' }}>
            <BookingBar />
          </div>
          <div className="reveal mt-10 flex flex-wrap items-center gap-8 text-white/70" style={{ animationDelay: '.6s' }}>
            <div className="flex items-center gap-3"><Stars value={5} /><span className="text-sm">4.9 from 2,300+ guests</span></div>
            <span className="hidden h-4 w-px bg-white/20 sm:block" />
            <span className="text-sm">✦ Best rate guarantee</span>
            <span className="text-sm">✦ Free cancellation up to 48h</span>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="py-24 sm:py-32">
        <div className="container-luxe grid items-center gap-16 lg:grid-cols-2">
          <div className="relative">
            <Img src={IMAGES.lobby} alt="Hotel lobby" className="aspect-[4/5] w-full rounded-[2rem] shadow-luxe" />
            <div className="absolute -bottom-8 -right-4 w-56 rounded-3xl bg-ink p-6 text-white shadow-luxe sm:-right-10">
              <p className="font-display text-6xl text-gold">15</p>
              <p className="mt-1 text-sm text-white/70">Years of crafting unforgettable stays</p>
            </div>
          </div>
          <div>
            <SectionTitle eyebrow="Our story" title={<>A sanctuary of <em className="text-gold-600">quiet luxury</em> in the heart of the city.</>}
              sub="LuxeStay was built on a simple promise: to make every guest feel at home, only better. Wake to birdsong in the gardens, linger over breakfast by the pool, then let our team take care of the rest." />
            <div className="mt-10 grid grid-cols-3 gap-6 border-y border-ink/10 py-8">
              {[['32', 'Rooms & suites'], ['2', 'Restaurants'], ['98%', 'Would return']].map(([n, l]) => (
                <div key={l}><p className="font-display text-5xl">{n}</p><p className="mt-1 text-xs uppercase tracking-wider text-ink-500">{l}</p></div>
              ))}
            </div>
            <Link href="/rooms" className="btn-dark mt-10">Discover the hotel <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>

      {/* ROOMS */}
      <section id="rooms" className="bg-ivory-200/60 py-24 sm:py-32">
        <div className="container-luxe">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <SectionTitle eyebrow="Accommodation" title="Rooms & Suites" sub="Five ways to stay, each designed with natural textures, handcrafted furniture and every modern comfort." />
            <Link href="/rooms" className="btn-outline">View all rooms <ArrowRight size={16} /></Link>
          </div>
          <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {db.roomTypes.slice(0, 3).map((r) => <RoomCard key={r.id} room={r} />)}
          </div>
        </div>
      </section>

      {/* AMENITIES */}
      <section className="grain relative overflow-hidden bg-ink py-24 sm:py-32">
        <div className="container-luxe relative">
          <SectionTitle light center eyebrow="Amenities" title="Everything you need, nothing you don't." />
          <div className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-3xl bg-white/10 lg:grid-cols-4">
            {amenities.map(({ icon: I, title, text }) => (
              <div key={title} className="group bg-ink p-8 transition hover:bg-ink-700">
                <I size={28} className="text-gold transition group-hover:scale-110" strokeWidth={1.4} />
                <p className="mt-6 font-display text-2xl text-white">{title}</p>
                <p className="mt-1 text-sm text-white/55">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DINING */}
      <section className="py-24 sm:py-32">
        <div className="container-luxe grid items-center gap-16 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <SectionTitle eyebrow="Dining" title={<>Savour the <em className="text-gold-600">season</em>.</>}
              sub="From sunrise breakfasts to midnight room service, our kitchen celebrates local produce with global flair. Order from your phone and we'll bring it to your room, your sunbed or your table." />
            <div className="mt-10 space-y-4">
              {featured.map((m) => (
                <div key={m.id} className="flex items-center gap-4 border-b border-ink/10 pb-4">
                  <Img src={m.image} alt={m.name} className="h-16 w-16 rounded-full" />
                  <div className="flex-1">
                    <p className="font-display text-xl">{m.name}</p>
                    <p className="text-xs text-ink-500">{m.description}</p>
                  </div>
                  <p className="font-display text-2xl text-gold-600">{money(m.price)}</p>
                </div>
              ))}
            </div>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link href="/dining#menu" className="btn-gold">Order now <ArrowRight size={16} /></Link>
              <Link href="/dining" className="btn-outline">Our restaurants</Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Img src={IMAGES.restaurant} alt="Restaurant" className="col-span-2 aspect-[16/10] w-full rounded-[2rem]" />
            <Img src={IMAGES.bar} alt="Bar" className="aspect-square w-full rounded-[2rem]" />
            <Img src={IMAGES.restaurant2} alt="Dining room" className="aspect-square w-full rounded-[2rem]" />
          </div>
        </div>
      </section>

      {/* SPA BANNER */}
      <section className="relative overflow-hidden">
        <Img src={IMAGES.spa} alt="Spa" className="absolute inset-0 h-full w-full" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/60 to-transparent" />
        <div className="container-luxe relative py-28 sm:py-40">
          <div className="max-w-lg">
            <p className="eyebrow text-gold-300">Spa & Wellness</p>
            <h2 className="h-display mt-4 text-5xl text-white sm:text-6xl">Breathe in. <br />Let go.</h2>
            <p className="mt-5 text-white/70">Signature massages, couples journeys, sunrise yoga and curated adventures beyond the hotel walls.</p>
            <Link href="/experiences" className="btn-ghost-light mt-8">Book a treatment <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>

      {/* OFFERS */}
      <section id="offers" className="py-24 sm:py-32">
        <div className="container-luxe">
          <SectionTitle center eyebrow="Special offers" title="Exclusive packages" sub="Book direct for perks you won't find anywhere else." />
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {offers.map((o) => (
              <div key={o.title} className="group relative aspect-[3/4] overflow-hidden rounded-[2rem]">
                <Img src={o.image} alt={o.title} className="absolute inset-0 h-full w-full transition duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
                <span className="absolute left-6 top-6 rounded-full bg-gold px-3 py-1 text-xs font-bold text-ink">{o.tag}</span>
                <div className="absolute inset-x-0 bottom-0 p-8 text-white">
                  <h3 className="h-display text-4xl">{o.title}</h3>
                  <p className="mt-3 text-sm text-white/75">{o.text}</p>
                  <Link href="/book" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-gold-300">Book this offer <ArrowRight size={14} /></Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EVENTS */}
      <section id="events" className="bg-ivory-200/60 py-24 sm:py-32">
        <div className="container-luxe grid items-center gap-16 lg:grid-cols-2">
          <div className="grid grid-cols-2 gap-4">
            <Img src={IMAGES.event} alt="Wedding" className="aspect-[3/4] w-full rounded-[2rem]" />
            <Img src={IMAGES.conference} alt="Conference" className="mt-12 aspect-[3/4] w-full rounded-[2rem]" />
          </div>
          <div>
            <SectionTitle eyebrow="Weddings & events" title="Moments worth gathering for."
              sub="Our garden lawn hosts up to 300 guests, while the Grand Ballroom and three boardrooms are perfect for galas, conferences and private celebrations. Our events team handles every detail." />
            <ul className="mt-8 grid grid-cols-2 gap-3 text-sm">
              {['Weddings up to 300 guests', 'Conference & meetings', 'Private dining', 'Birthday & gala dinners'].map((t) => (
                <li key={t} className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-gold" />{t}</li>
              ))}
            </ul>
            <Link href="/contact?subject=Event%20enquiry" className="btn-dark mt-10">Plan your event <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      {review && (
        <section className="py-24 sm:py-32">
          <div className="container-luxe max-w-4xl text-center">
            <Quote size={44} className="mx-auto text-gold" strokeWidth={1} />
            <p key={review.id} className="h-display reveal mt-8 text-3xl italic sm:text-4xl lg:text-5xl">“{review.text}”</p>
            <div className="mt-8"><Stars value={review.rating} /></div>
            <p className="mt-3 font-semibold">{review.name}</p>
            <p className="text-sm text-ink-500">{review.country}</p>
            <div className="mt-8 flex justify-center gap-3">
              <button onClick={() => setRv((v) => (v - 1 + reviews.length) % reviews.length)} className="grid h-12 w-12 place-items-center rounded-full border border-ink/15 hover:bg-ink hover:text-white" aria-label="Previous review"><ChevronLeft size={18} /></button>
              <button onClick={() => setRv((v) => (v + 1) % reviews.length)} className="grid h-12 w-12 place-items-center rounded-full border border-ink/15 hover:bg-ink hover:text-white" aria-label="Next review"><ChevronRight size={18} /></button>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="container-luxe pb-24">
        <div className="grain relative overflow-hidden rounded-[2.5rem] bg-ink px-8 py-20 text-center sm:px-16">
          <Img src={IMAGES.exterior} alt="" className="absolute inset-0 h-full w-full opacity-30" />
          <div className="relative">
            <p className="eyebrow text-gold-300">Your escape awaits</p>
            <h2 className="h-display mx-auto mt-4 max-w-3xl text-5xl text-white sm:text-6xl">Reserve your stay and receive a complimentary welcome dinner.</h2>
            <Link href="/book" className="btn-gold mt-10">Book your stay <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>
    </>
  );
}
