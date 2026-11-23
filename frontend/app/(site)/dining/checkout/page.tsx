'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BedDouble, ShoppingBag, Store, UtensilsCrossed } from 'lucide-react';
import { Empty } from '@/components/ui';
import { quoteOrder, useStore } from '@/lib/store';
import { money } from '@/lib/config';
import type { Order } from '@/lib/types';

export default function CheckoutPage() {
  const router = useRouter();
  const { db, user, cartLines, cartSubtotal, placeOrder, setCartNote } = useStore();
  // If the signed-in guest is currently checked in, pre-fill their room
  const stay = user && db.bookings.find((b) => b.userId === user.id && b.status === 'checked_in');
  const stayRoom = stay?.roomId ? db.rooms.find((r) => r.id === stay.roomId)?.number : '';

  const [type, setType] = useState<Order['type']>(stayRoom ? 'room_service' : 'dine_in');
  const [name, setName] = useState(user?.name || '');
  const [room, setRoom] = useState(stayRoom || '');
  const [table, setTable] = useState('');
  const [pay, setPay] = useState<Order['paymentMethod']>(stayRoom ? 'room_bill' : 'card');
  const q = quoteOrder(cartSubtotal);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const location = type === 'room_service' ? `Room ${room}` : type === 'dine_in' ? `Table ${table}` : 'Pickup';
    const ord = placeOrder({ customerName: name, type, location, paymentMethod: pay });
    router.push(`/dining/order/${ord.id}`);
  };

  return (
    <>
      <div className="h-24 bg-ink sm:h-28" />
      <section className="container-luxe py-14">
        {cartLines.length === 0 ? (
          <Empty icon={<ShoppingBag />} title="Your basket is empty" sub="Add a few dishes from our menu first." action={<Link href="/dining#menu" className="btn-dark">Browse menu</Link>} />
        ) : (
          <form onSubmit={submit} className="grid gap-10 lg:grid-cols-[1fr_380px]">
            <div className="space-y-8">
              <h1 className="h-display text-5xl">Checkout</h1>
              <div>
                <p className="label">How would you like it?</p>
                <div className="grid gap-3 sm:grid-cols-3">
                  {([['room_service', 'Room service', BedDouble], ['dine_in', 'Dine in', UtensilsCrossed], ['takeaway', 'Takeaway', Store]] as const).map(([id, label, I]) => (
                    <button key={id} type="button" onClick={() => { setType(id); if (id !== 'room_service' && pay === 'room_bill') setPay('card'); }}
                      className={`flex flex-col items-start gap-3 rounded-2xl border-2 bg-white p-5 text-left transition ${type === id ? 'border-gold shadow-soft' : 'border-transparent hover:border-ink/10'}`}>
                      <I size={22} className="text-gold-600" />
                      <span className="font-semibold">{label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label><span className="label">Name</span><input required className="input" value={name} onChange={(e) => setName(e.target.value)} /></label>
                {type === 'room_service' && <label><span className="label">Room number</span><input required className="input" value={room} onChange={(e) => setRoom(e.target.value)} placeholder="e.g. 401" /></label>}
                {type === 'dine_in' && <label><span className="label">Table number</span><input required className="input" value={table} onChange={(e) => setTable(e.target.value)} placeholder="e.g. 6" /></label>}
              </div>
              <div>
                <p className="label">Notes for the kitchen</p>
                <div className="space-y-3">
                  {cartLines.map((l) => (
                    <div key={l.itemId} className="flex flex-col gap-2 rounded-2xl bg-white p-4 sm:flex-row sm:items-center">
                      <span className="text-sm font-semibold sm:w-56">{l.qty} × {l.name}</span>
                      <input className="input py-2" placeholder="e.g. no onions, extra spicy" value={l.note || ''} onChange={(e) => setCartNote(l.itemId, e.target.value)} />
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="label">Payment</p>
                <div className="flex flex-wrap gap-2">
                  {([['room_bill', 'Charge to room'], ['card', 'Card'], ['mobile_money', 'Mobile Money'], ['cash', 'Cash']] as const)
                    .filter(([id]) => id !== 'room_bill' || type === 'room_service')
                    .map(([id, label]) => (
                      <button key={id} type="button" onClick={() => setPay(id)} className={`rounded-full border-2 px-5 py-2.5 text-sm font-semibold transition ${pay === id ? 'border-gold bg-white' : 'border-transparent bg-white/60 hover:border-ink/10'}`}>{label}</button>
                    ))}
                </div>
              </div>
            </div>
            <aside className="lg:sticky lg:top-28 lg:self-start">
              <div className="card space-y-3 p-6 text-sm">
                <p className="eyebrow">Order summary</p>
                {cartLines.map((l) => (
                  <div key={l.itemId} className="flex justify-between gap-4"><span>{l.qty} × {l.name}</span><span>{money(l.qty * l.price)}</span></div>
                ))}
                <div className="space-y-2 border-t border-ink/10 pt-3 text-ink-500">
                  <div className="flex justify-between"><span>Subtotal</span><span>{money(q.subtotal)}</span></div>
                  <div className="flex justify-between"><span>Service charge</span><span>{money(q.service)}</span></div>
                  <div className="flex justify-between"><span>Tax</span><span>{money(q.tax)}</span></div>
                </div>
                <div className="flex justify-between border-t border-ink/10 pt-3 text-lg font-semibold"><span>Total</span><span>{money(q.total)}</span></div>
                <button className="btn-gold mt-2 w-full">Place order</button>
              </div>
            </aside>
          </form>
        )}
      </section>
    </>
  );
}
