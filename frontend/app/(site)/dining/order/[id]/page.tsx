'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Check, ChefHat, ClipboardCheck, ConciergeBell, Truck } from 'lucide-react';
import { useStore } from '@/lib/store';
import { money } from '@/lib/config';
import { timeAgo } from '@/components/ui';

const flow = [
  { id: 'received', label: 'Order received', icon: ClipboardCheck },
  { id: 'preparing', label: 'Being prepared', icon: ChefHat },
  { id: 'ready', label: 'Ready', icon: ConciergeBell },
  { id: 'delivered', label: 'Delivered', icon: Truck },
] as const;

export default function OrderTracking() {
  const { id } = useParams<{ id: string }>();
  const { db, ready } = useStore();
  const order = db.orders.find((o) => o.id === id);

  if (!ready) return <div className="h-screen bg-ink" />;
  if (!order) {
    return (
      <div className="container-luxe py-48 text-center">
        <h1 className="h-display text-5xl">Order not found</h1>
        <Link href="/dining" className="btn-dark mt-8">Back to menu</Link>
      </div>
    );
  }
  const idx = flow.findIndex((f) => f.id === order.status);

  return (
    <>
      <div className="h-24 bg-ink sm:h-28" />
      <section className="container-luxe max-w-3xl py-16">
        <p className="eyebrow">Order {order.code} · placed {timeAgo(order.createdAt)}</p>
        <h1 className="h-display mt-3 text-5xl">{order.status === 'delivered' ? 'Enjoy your meal!' : order.status === 'cancelled' ? 'Order cancelled' : 'Your order is on its way.'}</h1>
        <p className="mt-3 text-ink-500">Delivering to <b className="text-ink">{order.location}</b>. This page updates automatically as the kitchen progresses.</p>

        {order.status !== 'cancelled' && (
          <ol className="mt-12 grid grid-cols-4 gap-2">
            {flow.map((f, i) => {
              const done = i <= idx;
              return (
                <li key={f.id} className="relative flex flex-col items-center text-center">
                  {i > 0 && <span className={`absolute right-1/2 top-6 h-0.5 w-full -translate-y-1/2 ${i <= idx ? 'bg-gold' : 'bg-ink/10'}`} />}
                  <span className={`relative grid h-12 w-12 place-items-center rounded-full transition ${done ? 'bg-gold text-ink' : 'bg-white text-ink-500 ring-1 ring-ink/10'} ${i === idx ? 'animate-pulse' : ''}`}>
                    {i < idx ? <Check size={18} /> : <f.icon size={18} />}
                  </span>
                  <span className={`mt-3 text-xs font-semibold sm:text-sm ${done ? '' : 'text-ink-500'}`}>{f.label}</span>
                </li>
              );
            })}
          </ol>
        )}

        <div className="card mt-12 divide-y divide-ink/5 text-sm">
          {order.lines.map((l) => (
            <div key={l.itemId} className="flex justify-between gap-4 px-6 py-4">
              <span>{l.qty} × {l.name}{l.note && <span className="block text-xs text-ink-500">“{l.note}”</span>}</span>
              <span>{money(l.qty * l.price)}</span>
            </div>
          ))}
          <div className="flex justify-between px-6 py-4 text-lg font-semibold"><span>Total</span><span>{money(order.total)}</span></div>
        </div>
        <p className="mt-6 text-center text-xs text-ink-500">Tip: open the staff dashboard (Kitchen orders) in another tab and move this order along to see it update.</p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/dining#menu" className="btn-outline">Order more</Link>
          <Link href="/account" className="btn-dark">My orders</Link>
        </div>
      </section>
    </>
  );
}
