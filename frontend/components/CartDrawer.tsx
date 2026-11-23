'use client';

import Link from 'next/link';
import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { quoteOrder, useStore } from '@/lib/store';
import { money } from '@/lib/config';
import { Img } from './ui';

export default function CartDrawer() {
  const { cartOpen, setCartOpen, cartLines, cartSubtotal, setCartQty, db } = useStore();
  if (!cartOpen) return null;
  const q = quoteOrder(cartSubtotal);
  return (
    <div className="fixed inset-0 z-[70] bg-ink/50 backdrop-blur-sm" onClick={() => setCartOpen(false)}>
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md animate-slideIn flex-col bg-ivory-50 shadow-luxe" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-ink/10 px-6 py-5">
          <div>
            <p className="eyebrow">Your order</p>
            <h3 className="h-display text-3xl">Basket</h3>
          </div>
          <button onClick={() => setCartOpen(false)} className="rounded-full p-2 hover:bg-ink/5" aria-label="Close basket"><X size={20} /></button>
        </div>
        <div className="flex-1 space-y-4 overflow-y-auto px-6 py-6">
          {cartLines.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <ShoppingBag size={36} className="text-gold" />
              <p className="mt-4 font-display text-2xl">Your basket is empty</p>
              <p className="mt-1 text-sm text-ink-500">Browse our menu and order to your room or table.</p>
              <Link href="/dining#menu" onClick={() => setCartOpen(false)} className="btn-dark mt-6">View Menu</Link>
            </div>
          ) : (
            cartLines.map((l) => {
              const item = db.menu.find((m) => m.id === l.itemId);
              return (
                <div key={l.itemId} className="flex gap-4 rounded-2xl bg-white p-3 shadow-soft">
                  {item && <Img src={item.image} alt={l.name} className="h-20 w-20 shrink-0 rounded-xl" />}
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex justify-between gap-2">
                      <p className="text-sm font-semibold leading-tight">{l.name}</p>
                      <button onClick={() => setCartQty(l.itemId, 0)} className="text-ink/40 hover:text-rose-600" aria-label="Remove"><Trash2 size={15} /></button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 rounded-full border border-ink/10">
                        <button onClick={() => setCartQty(l.itemId, l.qty - 1)} className="p-1.5" aria-label="Decrease"><Minus size={13} /></button>
                        <span className="w-6 text-center text-sm font-semibold">{l.qty}</span>
                        <button onClick={() => setCartQty(l.itemId, l.qty + 1)} className="p-1.5" aria-label="Increase"><Plus size={13} /></button>
                      </div>
                      <span className="text-sm font-semibold">{money(l.price * l.qty)}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
        {cartLines.length > 0 && (
          <div className="space-y-2 border-t border-ink/10 bg-white px-6 py-5 text-sm">
            <div className="flex justify-between text-ink-500"><span>Subtotal</span><span>{money(q.subtotal)}</span></div>
            <div className="flex justify-between text-ink-500"><span>Service charge</span><span>{money(q.service)}</span></div>
            <div className="flex justify-between text-ink-500"><span>Tax</span><span>{money(q.tax)}</span></div>
            <div className="flex justify-between pt-2 text-lg font-semibold"><span>Total</span><span>{money(q.total)}</span></div>
            <Link href="/dining/checkout" onClick={() => setCartOpen(false)} className="btn-gold mt-3 w-full">Checkout</Link>
          </div>
        )}
      </aside>
    </div>
  );
}
