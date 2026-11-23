'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Facebook, Instagram, Mail, MapPin, Phone, Twitter } from 'lucide-react';
import { Logo } from './ui';
import { HOTEL } from '@/lib/config';
import { useStore } from '@/lib/store';

export default function Footer() {
  const { notify } = useStore();
  const [email, setEmail] = useState('');
  return (
    <footer className="grain relative overflow-hidden bg-ink text-white/70">
      <div className="container-luxe relative border-b border-white/10 py-16">
        <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          <div>
            <p className="eyebrow text-gold-300">The LuxeStay Circle</p>
            <h3 className="h-display mt-3 text-4xl text-white">Private offers, delivered quietly.</h3>
          </div>
          <form className="flex w-full max-w-md gap-2" onSubmit={(e) => { e.preventDefault(); if (email) { notify('Welcome to the LuxeStay Circle'); setEmail(''); } }}>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email address"
              className="w-full rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm text-white outline-none placeholder:text-white/40 focus:border-gold" />
            <button className="btn-gold shrink-0">Subscribe</button>
          </form>
        </div>
      </div>
      <div className="container-luxe relative grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-5">
          <Logo light />
          <p className="text-sm leading-relaxed">A sanctuary of quiet luxury — where every stay is crafted around you.</p>
          <div className="flex gap-3">
            {[Instagram, Facebook, Twitter].map((I, i) => (
              <a key={i} href="#" className="grid h-10 w-10 place-items-center rounded-full border border-white/15 transition hover:border-gold hover:text-gold" aria-label="Social link"><I size={16} /></a>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-5 text-xs font-semibold uppercase tracking-luxe text-white">Stay</p>
          <ul className="space-y-3 text-sm">
            <li><Link href="/rooms" className="hover:text-gold">Rooms & Suites</Link></li>
            <li><Link href="/book" className="hover:text-gold">Book a Stay</Link></li>
            <li><Link href="/account" className="hover:text-gold">Manage Booking</Link></li>
            <li><Link href="/#offers" className="hover:text-gold">Special Offers</Link></li>
          </ul>
        </div>
        <div>
          <p className="mb-5 text-xs font-semibold uppercase tracking-luxe text-white">Discover</p>
          <ul className="space-y-3 text-sm">
            <li><Link href="/dining" className="hover:text-gold">Dining & Room Service</Link></li>
            <li><Link href="/experiences" className="hover:text-gold">Spa & Wellness</Link></li>
            <li><Link href="/#events" className="hover:text-gold">Weddings & Events</Link></li>
            <li><Link href="/contact" className="hover:text-gold">Contact</Link></li>
          </ul>
        </div>
        <div>
          <p className="mb-5 text-xs font-semibold uppercase tracking-luxe text-white">Contact</p>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-3"><MapPin size={16} className="mt-0.5 shrink-0 text-gold" />{HOTEL.address}</li>
            <li className="flex gap-3"><Phone size={16} className="mt-0.5 shrink-0 text-gold" />{HOTEL.phone}</li>
            <li className="flex gap-3"><Mail size={16} className="mt-0.5 shrink-0 text-gold" />{HOTEL.email}</li>
          </ul>
        </div>
      </div>
      <div className="container-luxe relative flex flex-col justify-between gap-2 border-t border-white/10 py-6 text-xs sm:flex-row">
        <p>© {new Date().getFullYear()} {HOTEL.name} {HOTEL.tagline}. All rights reserved.</p>
        <p>Check-in {HOTEL.checkIn} · Check-out {HOTEL.checkOut}</p>
      </div>
    </footer>
  );
}
