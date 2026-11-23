'use client';

import { useMemo, useState } from 'react';
import { Clock, Plus, Search, ShoppingBag, Minus } from 'lucide-react';
import { Img, PageHero, Empty } from '@/components/ui';
import { IMAGES } from '@/lib/seed';
import { useStore } from '@/lib/store';
import { money } from '@/lib/config';
import type { MenuCategory } from '@/lib/types';

const CATS: (MenuCategory | 'All')[] = ['All', 'Breakfast', 'Starters', 'Mains', 'Grill', 'Desserts', 'Drinks', 'Cocktails', 'Wine'];

const venues = [
  { name: 'The Gold Room', type: 'Fine dining · Dinner', hours: '18:30 – 23:00', image: IMAGES.restaurant, text: 'Seasonal tasting menus and an award-winning wine cellar.' },
  { name: 'Terrace Café', type: 'All-day dining', hours: '06:30 – 22:00', image: IMAGES.restaurant2, text: 'Breakfast buffets, light lunches and wood-fired pizza by the pool.' },
  { name: 'Sky Lounge', type: 'Rooftop bar', hours: '16:00 – 01:00', image: IMAGES.bar, text: 'Signature cocktails, live jazz on Fridays and sunset views.' },
];

export default function DiningPage() {
  const { db, isStaff, cart, addToCart, setCartQty, cartCount, cartSubtotal, setCartOpen, notify } = useStore();
  const [cat, setCat] = useState<(typeof CATS)[number]>('All');
  const [q, setQ] = useState('');

  const items = useMemo(
    () => db.menu.filter((m) => (cat === 'All' || m.category === cat) && (m.name + m.description + m.tags.join(' ')).toLowerCase().includes(q.toLowerCase())),
    [db.menu, cat, q],
  );
  const qtyOf = (id: string) => cart.find((c) => c.itemId === id)?.qty || 0;

  return (
    <>
      <PageHero eyebrow="Dining & In-room dining" title={<>A table for <em className="gold-text">every mood</em>.</>} sub="Order from our menu to your room, a table or for takeaway — freshly prepared by our chefs." image={IMAGES.restaurant} />

      <section className="container-luxe py-20">
        <div className="grid gap-6 md:grid-cols-3">
          {venues.map((v) => (
            <div key={v.name} className="group overflow-hidden rounded-3xl bg-white shadow-soft">
              <Img src={v.image} alt={v.name} className="aspect-[16/10] w-full transition duration-700 group-hover:scale-105" />
              <div className="p-6">
                <p className="eyebrow">{v.type}</p>
                <h3 className="h-display mt-2 text-3xl">{v.name}</h3>
                <p className="mt-2 text-sm text-ink-500">{v.text}</p>
                <p className="mt-4 flex items-center gap-2 text-xs font-semibold"><Clock size={14} className="text-gold-600" />{v.hours}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="menu" className="scroll-mt-24 bg-ivory-200/60 py-20">
        <div className="container-luxe">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="eyebrow">Order online</p>
              <h2 className="h-display mt-3 text-5xl sm:text-6xl">Our Menu</h2>
              <p className="mt-3 text-ink-500">Room service available 24 hours · average delivery 25 minutes</p>
            </div>
            <label className="relative w-full max-w-xs">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-500" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search dishes, e.g. vegan" className="input rounded-full pl-11" />
            </label>
          </div>

          <div className="sticky top-[68px] z-30 -mx-4 mt-8 overflow-x-auto bg-ivory-200/90 px-4 py-3 backdrop-blur sm:mx-0 sm:rounded-full sm:px-2">
            <div className="flex gap-2">
              {CATS.map((c) => (
                <button key={c} onClick={() => setCat(c)} className={`whitespace-nowrap rounded-full px-5 py-2 text-sm font-semibold transition ${cat === c ? 'bg-ink text-white' : 'text-ink-500 hover:bg-white'}`}>{c}</button>
              ))}
            </div>
          </div>

          {items.length === 0 ? (
            <div className="mt-10"><Empty icon={<Search />} title="Nothing found" sub="Try a different search or category." /></div>
          ) : (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((m) => {
                const qty = qtyOf(m.id);
                return (
                  <div key={m.id} className={`group flex flex-col overflow-hidden rounded-3xl bg-white shadow-soft transition hover:shadow-luxe ${!m.available && 'opacity-60'}`}>
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Img src={m.image} alt={m.name} className="h-full w-full transition duration-700 group-hover:scale-105" />
                      <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
                        {m.tags.slice(0, 2).map((t) => <span key={t} className="rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider">{t}</span>)}
                      </div>
                      {!m.available && <span className="absolute inset-0 grid place-items-center bg-ink/50 text-sm font-bold uppercase tracking-wider text-white">Unavailable</span>}
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="font-display text-2xl leading-tight">{m.name}</h3>
                        <span className="font-display text-2xl text-gold-600">{money(m.price)}</span>
                      </div>
                      <p className="mt-2 flex-1 text-sm text-ink-500">{m.description}</p>
                      <div className="mt-5 flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-xs text-ink-500"><Clock size={13} />{m.prepMinutes} min</span>
                        {isStaff ? null : qty === 0 ? (
                          <button disabled={!m.available} onClick={() => { addToCart(m.id); notify(`${m.name} added to basket`); }} className="btn-dark btn-sm"><Plus size={14} /> Add</button>
                        ) : (
                          <div className="flex items-center gap-2 rounded-full bg-ink p-1 text-white">
                            <button onClick={() => setCartQty(m.id, qty - 1)} className="grid h-7 w-7 place-items-center rounded-full hover:bg-white/10" aria-label="Decrease"><Minus size={13} /></button>
                            <span className="w-5 text-center text-sm font-bold">{qty}</span>
                            <button onClick={() => setCartQty(m.id, qty + 1)} className="grid h-7 w-7 place-items-center rounded-full hover:bg-white/10" aria-label="Increase"><Plus size={13} /></button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {cartCount > 0 && (
        <button onClick={() => setCartOpen(true)} className="reveal fixed bottom-6 left-1/2 z-40 flex -translate-x-1/2 items-center gap-4 rounded-full bg-ink py-3 pl-5 pr-3 text-white shadow-luxe">
          <ShoppingBag size={18} className="text-gold" />
          <span className="text-sm font-semibold">{cartCount} item{cartCount > 1 && 's'} · {money(cartSubtotal)}</span>
          <span className="rounded-full bg-gold px-4 py-2 text-xs font-bold text-ink">View basket</span>
        </button>
      )}
    </>
  );
}
