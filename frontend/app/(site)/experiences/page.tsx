'use client';

import { useState } from 'react';
import { Clock, Users } from 'lucide-react';
import { Img, Modal, PageHero, addDays, today } from '@/components/ui';
import { IMAGES } from '@/lib/seed';
import { useStore } from '@/lib/store';
import { money } from '@/lib/config';
import type { Service } from '@/lib/types';

const CATS = ['All', 'Spa', 'Wellness', 'Transport', 'Experience'] as const;

export default function ExperiencesPage() {
  const { db, user, requestService, notify } = useStore();
  const [cat, setCat] = useState<(typeof CATS)[number]>('All');
  const [sel, setSel] = useState<Service | null>(null);
  const [form, setForm] = useState({ name: '', date: addDays(today(), 1), time: '10:00', people: 1 });

  const open = (s: Service) => { setSel(s); setForm((f) => ({ ...f, name: user?.name || f.name })); };
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sel) return;
    requestService({ serviceId: sel.id, userId: user?.id, guestName: form.name, date: form.date, time: form.time, people: form.people });
    notify(`${sel.name} requested — we'll confirm shortly`);
    setSel(null);
  };

  const list = db.services.filter((s) => cat === 'All' || s.category === cat);

  return (
    <>
      <PageHero eyebrow="Spa · Wellness · Adventures" title={<>Moments made <em className="gold-text">for you</em>.</>} sub="Restore body and mind, or venture out with our curated experiences." image={IMAGES.spa} />
      <section className="container-luxe py-20">
        <div className="flex flex-wrap gap-2">
          {CATS.map((c) => (
            <button key={c} onClick={() => setCat(c)} className={`rounded-full px-5 py-2 text-sm font-semibold transition ${cat === c ? 'bg-ink text-white' : 'bg-white text-ink-500 shadow-soft hover:text-ink'}`}>{c}</button>
          ))}
        </div>
        <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {list.map((s) => (
            <div key={s.id} className="group overflow-hidden rounded-3xl bg-white shadow-soft transition hover:-translate-y-1 hover:shadow-luxe">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Img src={s.image} alt={s.name} className="h-full w-full transition duration-700 group-hover:scale-110" />
                <span className="absolute left-4 top-4 rounded-full bg-ivory/95 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider">{s.category}</span>
              </div>
              <div className="p-6">
                <h3 className="h-display text-3xl">{s.name}</h3>
                <p className="mt-2 text-sm text-ink-500">{s.description}</p>
                <div className="mt-6 flex items-center justify-between border-t border-ink/5 pt-5">
                  <div>
                    <p className="font-display text-3xl">{money(s.price)}</p>
                    <p className="flex items-center gap-1 text-xs text-ink-500"><Clock size={12} />{s.duration}</p>
                  </div>
                  <button onClick={() => open(s)} className="btn-dark btn-sm">Book</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Modal open={!!sel} onClose={() => setSel(null)} title={sel?.name || ''}>
        {sel && (
          <form onSubmit={submit} className="space-y-4">
            <p className="text-sm text-ink-500">{sel.description}</p>
            <label className="block"><span className="label">Your name</span><input required className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
            <div className="grid grid-cols-3 gap-3">
              <label><span className="label">Date</span><input type="date" min={today()} className="input" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></label>
              <label><span className="label">Time</span><input type="time" className="input" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} /></label>
              <label><span className="label flex items-center gap-1"><Users size={12} />People</span><input type="number" min={1} max={10} className="input" value={form.people} onChange={(e) => setForm({ ...form, people: +e.target.value })} /></label>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-white p-4">
              <span className="text-sm text-ink-500">Estimated total</span>
              <span className="font-display text-3xl">{money(sel.price * (sel.category === 'Transport' ? 1 : form.people))}</span>
            </div>
            <button className="btn-gold w-full">Request booking</button>
          </form>
        )}
      </Modal>
    </>
  );
}
