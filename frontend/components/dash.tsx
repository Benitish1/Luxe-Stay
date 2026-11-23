'use client';

import { ReactNode, useState } from 'react';
import { money } from '@/lib/config';
import { fmtDate } from './ui';

export function PageHead({ title, sub, action }: { title: string; sub?: string; action?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <h1 className="h-display text-4xl sm:text-5xl">{title}</h1>
        {sub && <p className="mt-1 text-sm text-ink-500">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

export function Stat({ label, value, hint, icon }: { label: string; value: string; hint?: string; icon: ReactNode }) {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">{label}</p>
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-gold/15 text-gold-700">{icon}</span>
      </div>
      <p className="mt-3 font-display text-4xl font-semibold">{value}</p>
      {hint && <p className="mt-1 text-xs text-ink-500">{hint}</p>}
    </div>
  );
}

export function Tabs<T extends string>({ value, onChange, options }: { value: T; onChange: (v: T) => void; options: { id: T; label: string; count?: number }[] }) {
  return (
    <div className="flex flex-wrap gap-1 rounded-full bg-white p-1 shadow-soft">
      {options.map((o) => (
        <button key={o.id} onClick={() => onChange(o.id)} className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition ${value === o.id ? 'bg-ink text-white' : 'text-ink-500 hover:text-ink'}`}>
          {o.label}{o.count !== undefined && <span className={`rounded-full px-1.5 text-[10px] ${value === o.id ? 'bg-white/20' : 'bg-ink/5'}`}>{o.count}</span>}
        </button>
      ))}
    </div>
  );
}

/** Single-series revenue bar chart with hover tooltip (pure SVG). */
export function RevenueChart({ data }: { data: { date: string; value: number }[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const W = 640, H = 220, pad = { l: 44, r: 8, t: 12, b: 26 };
  const max = Math.ceil(Math.max(...data.map((d) => d.value)) / 2000) * 2000 || 1;
  const bw = (W - pad.l - pad.r) / data.length;
  const y = (v: number) => pad.t + (H - pad.t - pad.b) * (1 - v / max);
  const ticks = [0, max / 2, max];
  return (
    <div className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Daily revenue for the last 14 days">
        {ticks.map((t) => (
          <g key={t}>
            <line x1={pad.l} x2={W - pad.r} y1={y(t)} y2={y(t)} stroke="currentColor" className="text-ink/10" strokeDasharray={t === 0 ? '' : '3 4'} />
            <text x={pad.l - 8} y={y(t) + 4} textAnchor="end" className="fill-ink-500 text-[10px]">{t >= 1000 ? `${t / 1000}k` : t}</text>
          </g>
        ))}
        {data.map((d, i) => {
          const x = pad.l + i * bw + 3;
          const w = bw - 6;
          const top = y(d.value);
          const h = H - pad.b - top;
          const r = Math.min(4, w / 2, h);
          return (
            <g key={d.date} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
              <rect x={pad.l + i * bw} y={pad.t} width={bw} height={H - pad.t - pad.b} fill="transparent" />
              <path d={`M${x},${H - pad.b} V${top + r} Q${x},${top} ${x + r},${top} H${x + w - r} Q${x + w},${top} ${x + w},${top + r} V${H - pad.b} Z`}
                className={`transition ${hover === null || hover === i ? 'fill-gold' : 'fill-gold/40'}`} />
              {(i % 2 === 1 || data.length < 8) && (
                <text x={x + w / 2} y={H - 8} textAnchor="middle" className="fill-ink-500 text-[10px]">{fmtDate(d.date, { day: 'numeric', month: 'short' })}</text>
              )}
            </g>
          );
        })}
      </svg>
      {hover !== null && (
        <div className="pointer-events-none absolute -translate-x-1/2 rounded-lg bg-ink px-3 py-2 text-xs text-white shadow-luxe"
          style={{ left: `${((pad.l + hover * bw + bw / 2) / W) * 100}%`, top: `${(y(data[hover].value) / H) * 100 - 22}%` }}>
          <p className="text-white/60">{fmtDate(data[hover].date, { weekday: 'short', day: 'numeric', month: 'short' })}</p>
          <p className="font-semibold">{money(data[hover].value)}</p>
        </div>
      )}
    </div>
  );
}
