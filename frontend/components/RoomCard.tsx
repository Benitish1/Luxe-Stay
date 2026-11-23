'use client';

import Link from 'next/link';
import { ArrowUpRight, BedDouble, Maximize2, Users } from 'lucide-react';
import type { RoomType } from '@/lib/types';
import { money } from '@/lib/config';
import { Img, Stars } from './ui';

export default function RoomCard({ room, query = '', available }: { room: RoomType; query?: string; available?: number }) {
  return (
    <Link href={`/rooms/${room.slug}${query}`} className="group block overflow-hidden rounded-3xl bg-white shadow-soft transition duration-500 hover:-translate-y-1 hover:shadow-luxe">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Img src={room.images[0]} alt={room.name} className="h-full w-full transition duration-700 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent opacity-0 transition group-hover:opacity-100" />
        <span className="absolute left-4 top-4 rounded-full bg-ivory/95 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider">{room.view} view</span>
        {available !== undefined && (
          <span className={`absolute right-4 top-4 rounded-full px-3 py-1 text-[11px] font-semibold ${available > 0 ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}>
            {available > 0 ? `${available} left` : 'Sold out'}
          </span>
        )}
        <span className="absolute bottom-4 right-4 grid h-11 w-11 translate-y-4 place-items-center rounded-full bg-gold text-ink opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <ArrowUpRight size={18} />
        </span>
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between">
          <Stars value={room.rating} size={12} />
          <span className="text-xs text-ink-500">{room.rating.toFixed(1)}</span>
        </div>
        <h3 className="h-display mt-3 text-3xl">{room.name}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-ink-500">{room.short}</p>
        <div className="mt-5 flex flex-wrap gap-4 text-xs text-ink-500">
          <span className="flex items-center gap-1.5"><Maximize2 size={14} className="text-gold-600" />{room.size} m²</span>
          <span className="flex items-center gap-1.5"><Users size={14} className="text-gold-600" />Up to {room.capacity}</span>
          <span className="flex items-center gap-1.5"><BedDouble size={14} className="text-gold-600" />{room.beds}</span>
        </div>
        <div className="mt-6 flex items-end justify-between border-t border-ink/5 pt-5">
          <p className="text-xs text-ink-500">From<span className="ml-2 font-display text-3xl font-semibold text-ink">{money(room.price)}</span> / night</p>
          <span className="text-xs font-semibold uppercase tracking-wider text-gold-600">View →</span>
        </div>
      </div>
    </Link>
  );
}
