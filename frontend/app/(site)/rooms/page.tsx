'use client';

import { Suspense, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { SlidersHorizontal } from 'lucide-react';
import BookingBar from '@/components/BookingBar';
import RoomCard from '@/components/RoomCard';
import { Empty, PageHero, fmtDate } from '@/components/ui';
import { IMAGES } from '@/lib/seed';
import { useStore } from '@/lib/store';

function RoomsInner() {
  const params = useSearchParams();
  const { db, availableCount } = useStore();
  const checkIn = params.get('checkIn') || '';
  const checkOut = params.get('checkOut') || '';
  const guests = Number(params.get('guests') || 1);
  const [sort, setSort] = useState<'price-asc' | 'price-desc' | 'rating'>('price-asc');
  const [maxPrice, setMaxPrice] = useState(1500);

  const list = useMemo(() => {
    const l = db.roomTypes.filter((r) => r.capacity >= guests && r.price <= maxPrice);
    return l.sort((a, b) => (sort === 'rating' ? b.rating - a.rating : sort === 'price-asc' ? a.price - b.price : b.price - a.price));
  }, [db.roomTypes, guests, maxPrice, sort]);

  const query = checkIn ? `?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}` : '';

  return (
    <>
      <PageHero eyebrow="Accommodation" title="Rooms & Suites" sub="Thoughtfully designed spaces for rest, work and celebration." image={IMAGES.resort} />
      <div className="container-luxe relative z-10 -mt-10"><BookingBar compact /></div>
      <section className="container-luxe py-16">
        <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            {checkIn ? (
              <p className="text-sm text-ink-500">Showing availability for <b className="text-ink">{fmtDate(checkIn)} – {fmtDate(checkOut)}</b> · {guests} guest{guests > 1 ? 's' : ''}</p>
            ) : (
              <p className="text-sm text-ink-500">{list.length} room types · choose dates above to see live availability</p>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <SlidersHorizontal size={16} className="text-gold-600" />
            <label className="flex items-center gap-3 rounded-full bg-white px-4 py-2 text-xs shadow-soft">
              Max ${maxPrice}
              <input type="range" min={150} max={1500} step={50} value={maxPrice} onChange={(e) => setMaxPrice(+e.target.value)} className="accent-[#C6A15B]" />
            </label>
            <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} className="rounded-full bg-white px-4 py-2 text-xs font-semibold shadow-soft outline-none">
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
              <option value="rating">Top rated</option>
            </select>
          </div>
        </div>
        {list.length === 0 ? (
          <Empty icon={<SlidersHorizontal />} title="No rooms match" sub="Try fewer guests or a higher price range." />
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {list.map((r) => (
              <RoomCard key={r.id} room={r} query={query} available={checkIn ? availableCount(r.id, checkIn, checkOut) : undefined} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}

export default function RoomsPage() {
  return <Suspense><RoomsInner /></Suspense>;
}
