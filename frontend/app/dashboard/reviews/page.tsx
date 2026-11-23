'use client';

import { useState } from 'react';
import { Mail, MailOpen } from 'lucide-react';
import { PageHead, Tabs } from '@/components/dash';
import { Stars, fmtDate, timeAgo } from '@/components/ui';
import { useStore } from '@/lib/store';

export default function ReviewsInbox() {
  const { db, toggleReview, markMessageRead, notify } = useStore();
  const [tab, setTab] = useState<'reviews' | 'inbox'>('reviews');
  const avg = db.reviews.length ? db.reviews.reduce((s, r) => s + r.rating, 0) / db.reviews.length : 0;
  const unread = db.messages.filter((m) => !m.read).length;

  return (
    <>
      <PageHead title="Reviews & inbox" sub={`Average rating ${avg.toFixed(1)} from ${db.reviews.length} reviews`}
        action={<Tabs value={tab} onChange={setTab} options={[{ id: 'reviews', label: 'Reviews', count: db.reviews.length }, { id: 'inbox', label: 'Inbox', count: unread }]} />} />
      {tab === 'reviews' ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {db.reviews.map((r) => (
            <div key={r.id} className="card p-6">
              <div className="flex items-start justify-between gap-4">
                <div><Stars value={r.rating} /><p className="mt-2 font-display text-2xl">{r.title}</p></div>
                <button onClick={() => { toggleReview(r.id); notify(r.published ? 'Review hidden' : 'Review published on website'); }}
                  className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${r.published ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                  {r.published ? '● Published' : '○ Pending — publish'}
                </button>
              </div>
              <p className="mt-3 text-sm text-ink-500">{r.text}</p>
              <p className="mt-4 text-xs text-ink-500">{r.name} · {r.country} · {fmtDate(r.date)}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {db.messages.map((m) => (
            <details key={m.id} className={`card group p-5 ${m.read ? '' : 'ring-2 ring-gold/40'}`} onToggle={(e) => (e.target as HTMLDetailsElement).open && !m.read && markMessageRead(m.id)}>
              <summary className="flex cursor-pointer list-none items-center gap-4">
                {m.read ? <MailOpen size={18} className="text-ink-500" /> : <Mail size={18} className="text-gold-600" />}
                <div className="min-w-0 flex-1"><p className={`truncate ${m.read ? '' : 'font-bold'}`}>{m.subject}</p><p className="text-xs text-ink-500">{m.name} · {m.email}</p></div>
                <span className="text-xs text-ink-500">{timeAgo(m.createdAt)}</span>
              </summary>
              <p className="mt-4 border-t border-ink/5 pt-4 text-sm">{m.message}</p>
              <a href={`mailto:${m.email}?subject=Re: ${encodeURIComponent(m.subject)}`} className="btn-dark btn-sm mt-4">Reply by email</a>
            </details>
          ))}
          {db.messages.length === 0 && <p className="py-12 text-center text-ink-500">Inbox is empty.</p>}
        </div>
      )}
    </>
  );
}
