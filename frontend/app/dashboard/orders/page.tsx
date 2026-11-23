'use client';

import { BedDouble, Store, UtensilsCrossed, X } from 'lucide-react';
import { PageHead } from '@/components/dash';
import { Badge, timeAgo } from '@/components/ui';
import { useStore } from '@/lib/store';
import { money } from '@/lib/config';
import type { OrderStatus } from '@/lib/types';

const COLS: { id: OrderStatus; label: string; next?: OrderStatus; action?: string }[] = [
  { id: 'received', label: 'New', next: 'preparing', action: 'Start preparing' },
  { id: 'preparing', label: 'Preparing', next: 'ready', action: 'Mark ready' },
  { id: 'ready', label: 'Ready to serve', next: 'delivered', action: 'Delivered' },
  { id: 'delivered', label: 'Completed' },
];
const typeIcon = { room_service: BedDouble, dine_in: UtensilsCrossed, takeaway: Store };

export default function KitchenOrders() {
  const { db, setOrderStatus, notify } = useStore();
  const today = new Date().toISOString().slice(0, 10);
  const revenue = db.orders.filter((o) => o.createdAt.slice(0, 10) === today && o.status !== 'cancelled').reduce((s, o) => s + o.total, 0);

  return (
    <>
      <PageHead title="Kitchen orders" sub={`Live board for room service, dine-in and takeaway · ${money(revenue)} in orders today`} />
      <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-4">
        {COLS.map((c) => {
          const all = db.orders.filter((o) => o.status === c.id).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
          const orders = c.id === 'delivered' ? all.slice(0, 6) : all;
          return (
            <div key={c.id} className="rounded-3xl bg-ivory-200/70 p-4">
              <div className="mb-4 flex items-center justify-between px-2"><p className="font-display text-2xl">{c.label}</p><span className="rounded-full bg-white px-2.5 py-0.5 text-xs font-bold">{orders.length}</span></div>
              <div className="space-y-3">
                {orders.map((o) => {
                  const I = typeIcon[o.type];
                  const mins = Math.round((Date.now() - new Date(o.createdAt).getTime()) / 60000);
                  const late = c.id !== 'delivered' && mins > 30;
                  return (
                    <div key={o.id} className={`card p-4 ${late ? 'ring-2 ring-rose-400' : ''}`}>
                      <div className="flex items-center justify-between">
                        <p className="flex items-center gap-2 font-semibold"><I size={16} className="text-gold-600" />{o.location}</p>
                        <span className={`text-xs ${late ? 'font-bold text-rose-600' : 'text-ink-500'}`}>{timeAgo(o.createdAt)}</span>
                      </div>
                      <p className="mt-0.5 text-xs text-ink-500">{o.code} · {o.customerName}</p>
                      <ul className="mt-3 space-y-1 border-t border-ink/5 pt-3 text-sm">
                        {o.lines.map((l) => (
                          <li key={l.itemId}><b>{l.qty}×</b> {l.name}{l.note && <span className="block pl-5 text-xs italic text-rose-600">{l.note}</span>}</li>
                        ))}
                      </ul>
                      <div className="mt-3 flex items-center justify-between text-xs"><span className="text-ink-500 capitalize">{o.paymentMethod.replace('_', ' ')}</span><span className="font-semibold">{money(o.total)}</span></div>
                      {c.next ? (
                        <div className="mt-4 flex gap-2">
                          <button onClick={() => { setOrderStatus(o.id, c.next!); notify(`${o.code} → ${c.next}`); }} className={`${c.next === 'delivered' ? 'btn-gold' : 'btn-dark'} btn-sm flex-1`}>{c.action}</button>
                          {c.id === 'received' && <button onClick={() => { setOrderStatus(o.id, 'cancelled'); notify(`${o.code} cancelled`); }} className="btn btn-sm px-3 text-rose-600 hover:bg-rose-50" aria-label="Cancel order"><X size={14} /></button>}
                        </div>
                      ) : <div className="mt-3"><Badge status={o.status} /></div>}
                    </div>
                  );
                })}
                {orders.length === 0 && <p className="py-8 text-center text-sm text-ink-500">No orders</p>}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
