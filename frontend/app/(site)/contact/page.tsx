'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Clock, Mail, MapPin, Phone, Send } from 'lucide-react';
import { PageHero } from '@/components/ui';
import { IMAGES } from '@/lib/seed';
import { useStore } from '@/lib/store';
import { HOTEL } from '@/lib/config';

function ContactInner() {
  const params = useSearchParams();
  const { sendMessage, notify } = useStore();
  const [f, setF] = useState({ name: '', email: '', subject: params.get('subject') || '', message: '' });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(f);
    notify('Message sent — our team will reply within 24 hours');
    setF({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <>
      <PageHero eyebrow="Contact" title="We'd love to hear from you." sub="Reservations, events, or simply a question — our team is here around the clock." image={IMAGES.exterior} />
      <section className="container-luxe grid gap-12 py-20 lg:grid-cols-[1fr_1.3fr]">
        <div className="space-y-6">
          {[
            [MapPin, 'Address', HOTEL.address],
            [Phone, 'Phone', HOTEL.phone],
            [Mail, 'Email', HOTEL.email],
            [Clock, 'Reception', 'Open 24 hours, 7 days a week'],
          ].map(([I, t, v]) => {
            const Icon = I as typeof MapPin;
            return (
              <div key={t as string} className="flex gap-5">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gold/15 text-gold-700"><Icon size={20} /></span>
                <div><p className="text-xs uppercase tracking-wider text-ink-500">{t as string}</p><p className="mt-1 font-display text-2xl">{v as string}</p></div>
              </div>
            );
          })}
          <div className="overflow-hidden rounded-3xl shadow-soft">
            <iframe title="Map" className="h-64 w-full grayscale" loading="lazy"
              src={`https://www.google.com/maps?q=${encodeURIComponent(HOTEL.address)}&output=embed`} />
          </div>
        </div>
        <form onSubmit={submit} className="card space-y-4 p-8">
          <h2 className="h-display text-4xl">Send us a message</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <label><span className="label">Name</span><input required className="input" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></label>
            <label><span className="label">Email</span><input required type="email" className="input" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></label>
          </div>
          <label className="block"><span className="label">Subject</span><input required className="input" value={f.subject} onChange={(e) => setF({ ...f, subject: e.target.value })} /></label>
          <label className="block"><span className="label">Message</span><textarea required rows={6} className="input" value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })} /></label>
          <button className="btn-gold"><Send size={16} /> Send message</button>
        </form>
      </section>
    </>
  );
}

export default function ContactPage() {
  return <Suspense><ContactInner /></Suspense>;
}
