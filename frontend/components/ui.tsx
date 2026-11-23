'use client';

import { useState, ReactNode, useEffect } from 'react';
import Link from 'next/link';
import { Star, X } from 'lucide-react';
import { HOTEL } from '@/lib/config';

/** Image with a graceful gradient fallback if the photo can't load. */
export function Img({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  const [failed, setFailed] = useState(false);
  if (failed)
    return (
      <div className={`flex items-center justify-center bg-gradient-to-br from-ink-700 via-ink-600 to-gold-700 ${className}`} aria-label={alt}>
        <span className="font-display text-2xl italic text-gold-300/70">{HOTEL.name}</span>
      </div>
    );
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} className={`object-cover ${className}`} />;
}

export function Logo({ light = false, compact = false }: { light?: boolean; compact?: boolean }) {
  return (
    <Link href="/" className="group flex items-center gap-3">
      <span className={`grid h-10 w-10 place-items-center rounded-full border ${light ? 'border-gold/60' : 'border-gold'} transition group-hover:rotate-[20deg]`}>
        <span className="font-display text-xl italic text-gold">L</span>
      </span>
      {!compact && (
        <span className="leading-none">
          <span className={`block font-display text-2xl font-semibold tracking-wide ${light ? 'text-white' : 'text-ink'}`}>{HOTEL.name}</span>
          <span className={`block text-[9px] uppercase tracking-luxe ${light ? 'text-white/60' : 'text-ink-500'}`}>{HOTEL.tagline}</span>
        </span>
      )}
    </Link>
  );
}

export function Stars({ value, size = 14 }: { value: number; size?: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={size} className={i <= Math.round(value) ? 'fill-gold text-gold' : 'text-ink/20'} />
      ))}
    </span>
  );
}

const tones: Record<string, string> = {
  green: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  amber: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  blue: 'bg-sky-50 text-sky-700 ring-sky-600/20',
  red: 'bg-rose-50 text-rose-700 ring-rose-600/20',
  gray: 'bg-stone-100 text-stone-600 ring-stone-500/20',
  gold: 'bg-gold/10 text-gold-700 ring-gold/30',
  violet: 'bg-violet-50 text-violet-700 ring-violet-600/20',
};
const statusTone: Record<string, string> = {
  pending: 'amber', confirmed: 'blue', checked_in: 'green', checked_out: 'gray', cancelled: 'red',
  available: 'green', occupied: 'blue', cleaning: 'amber', maintenance: 'red',
  received: 'violet', preparing: 'amber', ready: 'green', delivered: 'gray',
  requested: 'amber', done: 'gray', todo: 'gray', in_progress: 'amber',
  high: 'red', normal: 'blue', low: 'gray',
};
export function Badge({ status, children }: { status: string; children?: ReactNode }) {
  const tone = tones[statusTone[status] || status] || tones.gray;
  return (
    <span className={`chip ring-1 ring-inset ${tone}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {children ?? status.replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase())}
    </span>
  );
}

export function Modal({ open, onClose, title, children, wide = false }: { open: boolean; onClose: () => void; title: string; children: ReactNode; wide?: boolean }) {
  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-ink/60 p-0 backdrop-blur-sm sm:items-center sm:p-4" onClick={onClose}>
      <div className={`reveal max-h-[92vh] w-full overflow-y-auto rounded-t-3xl bg-ivory-50 p-6 shadow-luxe sm:rounded-3xl sm:p-8 ${wide ? 'sm:max-w-3xl' : 'sm:max-w-lg'}`} onClick={(e) => e.stopPropagation()}>
        <div className="mb-6 flex items-start justify-between gap-4">
          <h3 className="h-display text-3xl">{title}</h3>
          <button onClick={onClose} className="rounded-full p-2 hover:bg-ink/5" aria-label="Close"><X size={20} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function SectionTitle({ eyebrow, title, sub, center = false, light = false }: { eyebrow: string; title: ReactNode; sub?: string; center?: boolean; light?: boolean }) {
  return (
    <div className={`${center ? 'mx-auto text-center' : ''} max-w-2xl`}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className={`h-display mt-4 text-4xl sm:text-5xl lg:text-6xl ${light ? 'text-white' : ''}`}>{title}</h2>
      {sub && <p className={`mt-5 text-base leading-relaxed ${light ? 'text-white/70' : 'text-ink-500'}`}>{sub}</p>}
    </div>
  );
}

export function PageHero({ eyebrow, title, sub, image }: { eyebrow: string; title: ReactNode; sub?: string; image: string }) {
  return (
    <section className="grain relative flex min-h-[62vh] items-end overflow-hidden bg-ink pb-16 pt-40">
      <Img src={image} alt="" className="absolute inset-0 h-full w-full animate-kenburns opacity-60" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-ink/20" />
      <div className="container-luxe relative reveal">
        <p className="eyebrow text-gold-300">{eyebrow}</p>
        <h1 className="h-display mt-4 max-w-3xl text-5xl text-white sm:text-6xl lg:text-7xl">{title}</h1>
        {sub && <p className="mt-5 max-w-xl text-lg text-white/70">{sub}</p>}
      </div>
    </section>
  );
}

export function Empty({ icon, title, sub, action }: { icon: ReactNode; title: string; sub?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-ink/15 px-6 py-16 text-center">
      <div className="mb-4 grid h-14 w-14 place-items-center rounded-full bg-gold/10 text-gold-600">{icon}</div>
      <p className="font-display text-2xl">{title}</p>
      {sub && <p className="mt-2 max-w-sm text-sm text-ink-500">{sub}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export const fmtDate = (d: string, opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' }) =>
  new Date(d.length === 10 ? d + 'T12:00:00' : d).toLocaleDateString('en-GB', opts);
export const timeAgo = (iso: string) => {
  const m = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m} min ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} h ago`;
  return `${Math.round(h / 24)} d ago`;
};
export const today = () => new Date().toISOString().slice(0, 10);
export const addDays = (d: string, n: number) => {
  const x = new Date(d + 'T12:00:00');
  x.setDate(x.getDate() + n);
  return x.toISOString().slice(0, 10);
};
