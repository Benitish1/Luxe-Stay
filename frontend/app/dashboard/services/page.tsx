'use client';

import { PageHead } from '@/components/dash';
import { Badge, Img, fmtDate } from '@/components/ui';
import { useStore } from '@/lib/store';
import { money } from '@/lib/config';

export default function ServicesAdmin() {
  const { db, setServiceRequestStatus, notify } = useStore();
  const list = [...db.serviceRequests].sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  return (
    <>
      <PageHead title="Spa & services" sub="Treatments, transfers and experiences requested by guests." />
      <div className="card overflow-x-auto">
        <table className="table-luxe">
          <thead><tr><th>Service</th><th>Guest</th><th>When</th><th>People</th><th>Value</th><th>Status</th><th /></tr></thead>
          <tbody>
            {list.map((r) => {
              const s = db.services.find((x) => x.id === r.serviceId);
              if (!s) return null;
              return (
                <tr key={r.id}>
                  <td><div className="flex items-center gap-3"><Img src={s.image} alt={s.name} className="h-10 w-10 rounded-lg" /><div><p className="font-semibold">{s.name}</p><p className="text-xs text-ink-500">{s.category}</p></div></div></td>
                  <td>{r.guestName}</td>
                  <td>{fmtDate(r.date, { weekday: 'short', day: 'numeric', month: 'short' })} · {r.time}</td>
                  <td>{r.people}</td>
                  <td>{money(s.price * (s.category === 'Transport' ? 1 : r.people))}</td>
                  <td><Badge status={r.status} /></td>
                  <td className="space-x-2 text-right">
                    {r.status === 'requested' && <button onClick={() => { setServiceRequestStatus(r.id, 'confirmed'); notify('Booking confirmed'); }} className="btn-dark btn-sm">Confirm</button>}
                    {r.status === 'confirmed' && <button onClick={() => { setServiceRequestStatus(r.id, 'done'); notify('Marked as done'); }} className="btn-gold btn-sm">Done</button>}
                    {['requested', 'confirmed'].includes(r.status) && <button onClick={() => { setServiceRequestStatus(r.id, 'cancelled'); notify('Cancelled'); }} className="btn btn-sm text-rose-600 hover:bg-rose-50">Cancel</button>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <h2 className="h-display mb-4 mt-12 text-3xl">Service catalogue</h2>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {db.services.map((s) => (
          <div key={s.id} className="card overflow-hidden">
            <Img src={s.image} alt={s.name} className="aspect-[16/9] w-full" />
            <div className="p-4"><p className="font-display text-xl">{s.name}</p><p className="text-xs text-ink-500">{s.duration} · {money(s.price)}</p></div>
          </div>
        ))}
      </div>
    </>
  );
}
