'use client';

import { useState } from 'react';
import { Plus, Trash2, Wrench, Sparkles, CheckCircle2, User } from 'lucide-react';
import { PageHead, Tabs } from '@/components/dash';
import { Badge, Img, Modal } from '@/components/ui';
import { useStore } from '@/lib/store';
import { money } from '@/lib/config';
import type { Room, RoomStatus } from '@/lib/types';

const STATUS: { id: RoomStatus; label: string; ring: string; dot: string }[] = [
  { id: 'available', label: 'Available', ring: 'ring-emerald-500/40 bg-emerald-50', dot: 'bg-emerald-500' },
  { id: 'occupied', label: 'Occupied', ring: 'ring-sky-600/40 bg-sky-50', dot: 'bg-sky-600' },
  { id: 'cleaning', label: 'Cleaning', ring: 'ring-amber-400/50 bg-amber-50', dot: 'bg-amber-400' },
  { id: 'maintenance', label: 'Maintenance', ring: 'ring-rose-500/40 bg-rose-50', dot: 'bg-rose-500' },
];

export default function RoomsBoard() {
  const { db, user, setRoomStatus, addRoom, deleteRoom, updateRoomType, addTask, notify } = useStore();
  const [view, setView] = useState<'board' | 'types'>('board');
  const [filter, setFilter] = useState<'all' | RoomStatus>('all');
  const [sel, setSel] = useState<Room | null>(null);
  const [adding, setAdding] = useState(false);
  const [nr, setNr] = useState({ number: '', floor: 1, typeId: db.roomTypes[0]?.id || '' });
  const isAdmin = user?.role === 'admin';

  const floors = Array.from(new Set(db.rooms.map((r) => r.floor))).sort();
  const current = sel && db.rooms.find((r) => r.id === sel.id);
  const guestIn = (roomId: string) => db.bookings.find((b) => b.roomId === roomId && b.status === 'checked_in');

  return (
    <>
      <PageHead title="Front desk & rooms" sub="Live room status board. Click a room to update it."
        action={<div className="flex gap-2"><Tabs value={view} onChange={setView} options={[{ id: 'board', label: 'Room board' }, { id: 'types', label: 'Room types & rates' }]} />
          {isAdmin && view === 'board' && <button onClick={() => setAdding(true)} className="btn-dark btn-sm"><Plus size={14} /> Add room</button>}</div>} />

      {view === 'board' ? (
        <>
          <div className="mb-6 flex flex-wrap gap-2">
            <button onClick={() => setFilter('all')} className={`rounded-full px-4 py-2 text-xs font-semibold ${filter === 'all' ? 'bg-ink text-white' : 'bg-white shadow-soft'}`}>All · {db.rooms.length}</button>
            {STATUS.map((s) => (
              <button key={s.id} onClick={() => setFilter(s.id)} className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold ${filter === s.id ? 'bg-ink text-white' : 'bg-white shadow-soft'}`}>
                <span className={`h-2 w-2 rounded-full ${s.dot}`} />{s.label} · {db.rooms.filter((r) => r.status === s.id).length}
              </button>
            ))}
          </div>
          <div className="space-y-6">
            {floors.map((f) => {
              const rooms = db.rooms.filter((r) => r.floor === f && (filter === 'all' || r.status === filter));
              if (!rooms.length) return null;
              return (
                <div key={f}>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-luxe text-ink-500">Floor {f}</p>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6 2xl:grid-cols-8">
                    {rooms.map((r) => {
                      const st = STATUS.find((s) => s.id === r.status)!;
                      const g = guestIn(r.id);
                      return (
                        <button key={r.id} onClick={() => setSel(r)} className={`rounded-2xl p-4 text-left ring-1 transition hover:-translate-y-0.5 hover:shadow-soft ${st.ring}`}>
                          <div className="flex items-center justify-between"><span className="font-display text-3xl font-semibold">{r.number}</span><span className={`h-2.5 w-2.5 rounded-full ${st.dot}`} /></div>
                          <p className="mt-1 truncate text-xs text-ink-500">{db.roomTypes.find((t) => t.id === r.typeId)?.name}</p>
                          <p className="mt-2 truncate text-[11px] font-semibold">{g ? g.guestName : st.label}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {db.roomTypes.map((t) => (
            <div key={t.id} className="card flex gap-4 p-4">
              <Img src={t.images[0]} alt={t.name} className="h-28 w-36 shrink-0 rounded-xl" />
              <div className="flex-1">
                <p className="font-display text-2xl">{t.name}</p>
                <p className="text-xs text-ink-500">{db.rooms.filter((r) => r.typeId === t.id).length} rooms · up to {t.capacity} guests · {t.size} m²</p>
                <label className="mt-3 flex items-center gap-3 text-sm">
                  <span className="text-ink-500">Nightly rate</span>
                  <input type="number" disabled={!isAdmin} className="input w-28 py-2" defaultValue={t.price}
                    onBlur={(e) => { const v = +e.target.value; if (v > 0 && v !== t.price) { updateRoomType(t.id, { price: v }); notify(`${t.name} rate updated to ${money(v)}`); } }} />
                </label>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={!!current} onClose={() => setSel(null)} title={current ? `Room ${current.number}` : ''}>
        {current && (
          <div className="space-y-5">
            <div className="flex items-center gap-3"><Badge status={current.status} /><span className="text-sm text-ink-500">{db.roomTypes.find((t) => t.id === current.typeId)?.name} · Floor {current.floor}</span></div>
            {guestIn(current.id) && <p className="flex items-center gap-2 rounded-xl bg-white p-4 text-sm"><User size={16} className="text-gold-600" />In-house: <b>{guestIn(current.id)!.guestName}</b></p>}
            <div>
              <p className="label">Set status</p>
              <div className="grid grid-cols-2 gap-2">
                {STATUS.map((s) => (
                  <button key={s.id} onClick={() => { setRoomStatus(current.id, s.id); notify(`Room ${current.number} → ${s.label}`); }}
                    className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold ring-1 transition ${current.status === s.id ? s.ring + ' ring-2' : 'bg-white ring-ink/10 hover:ring-ink/30'}`}>
                    <span className={`h-2.5 w-2.5 rounded-full ${s.dot}`} />{s.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap gap-2 border-t border-ink/10 pt-5">
              <button onClick={() => { addTask({ roomId: current.id, title: 'Room cleaning', assignee: 'Unassigned', priority: 'normal' }); setRoomStatus(current.id, 'cleaning'); notify('Cleaning task created'); }} className="btn-outline btn-sm"><Sparkles size={14} /> Request cleaning</button>
              <button onClick={() => { addTask({ roomId: current.id, title: 'Maintenance check', assignee: 'Maintenance', priority: 'high' }); setRoomStatus(current.id, 'maintenance'); notify('Maintenance ticket created'); }} className="btn-outline btn-sm"><Wrench size={14} /> Report issue</button>
              {current.status !== 'available' && current.status !== 'occupied' && <button onClick={() => { setRoomStatus(current.id, 'available'); notify(`Room ${current.number} is ready`); }} className="btn-gold btn-sm"><CheckCircle2 size={14} /> Mark ready</button>}
              {isAdmin && <button onClick={() => { if (confirm(`Delete room ${current.number}?`)) { deleteRoom(current.id); setSel(null); notify('Room deleted'); } }} className="btn btn-sm ml-auto text-rose-600 hover:bg-rose-50"><Trash2 size={14} /> Delete</button>}
            </div>
          </div>
        )}
      </Modal>

      <Modal open={adding} onClose={() => setAdding(false)} title="Add a room">
        <form onSubmit={(e) => { e.preventDefault(); addRoom({ ...nr, status: 'available' }); setAdding(false); notify(`Room ${nr.number} added`); setNr({ ...nr, number: '' }); }} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <label><span className="label">Room number</span><input required className="input" value={nr.number} onChange={(e) => setNr({ ...nr, number: e.target.value })} /></label>
            <label><span className="label">Floor</span><input type="number" min={0} className="input" value={nr.floor} onChange={(e) => setNr({ ...nr, floor: +e.target.value })} /></label>
          </div>
          <label className="block"><span className="label">Room type</span>
            <select className="input" value={nr.typeId} onChange={(e) => setNr({ ...nr, typeId: e.target.value })}>{db.roomTypes.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</select>
          </label>
          <button className="btn-gold w-full">Add room</button>
        </form>
      </Modal>
    </>
  );
}
