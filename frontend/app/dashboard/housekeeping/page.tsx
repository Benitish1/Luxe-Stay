'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { PageHead } from '@/components/dash';
import { Badge, Modal, timeAgo } from '@/components/ui';
import { useStore } from '@/lib/store';
import type { HousekeepingTask, TaskStatus } from '@/lib/types';

const COLS: { id: TaskStatus; label: string; next?: TaskStatus; action?: string }[] = [
  { id: 'todo', label: 'To do', next: 'in_progress', action: 'Start' },
  { id: 'in_progress', label: 'In progress', next: 'done', action: 'Complete' },
  { id: 'done', label: 'Done' },
];

export default function Housekeeping() {
  const { db, addTask, setTaskStatus, notify } = useStore();
  const [open, setOpen] = useState(false);
  const [f, setF] = useState<{ roomId: string; title: string; assignee: string; priority: HousekeepingTask['priority'] }>({ roomId: db.rooms[0]?.id || '', title: '', assignee: '', priority: 'normal' });
  const hk = db.staff.filter((s) => s.department === 'Housekeeping');
  const roomNo = (id: string) => db.rooms.find((r) => r.id === id)?.number || '—';

  return (
    <>
      <PageHead title="Housekeeping" sub="Cleaning, turn-down and maintenance tasks. Completing a task marks the room ready."
        action={<button onClick={() => setOpen(true)} className="btn-dark btn-sm"><Plus size={14} /> New task</button>} />
      <div className="grid gap-6 lg:grid-cols-3">
        {COLS.map((c) => {
          const tasks = db.tasks.filter((t) => t.status === c.id);
          return (
            <div key={c.id} className="rounded-3xl bg-ivory-200/70 p-4">
              <div className="mb-4 flex items-center justify-between px-2"><p className="font-display text-2xl">{c.label}</p><span className="rounded-full bg-white px-2.5 py-0.5 text-xs font-bold">{tasks.length}</span></div>
              <div className="space-y-3">
                {tasks.map((t) => (
                  <div key={t.id} className="card p-4">
                    <div className="flex items-start justify-between gap-2"><p className="font-display text-2xl font-semibold">Room {roomNo(t.roomId)}</p><Badge status={t.priority} /></div>
                    <p className="mt-1 text-sm">{t.title}</p>
                    <p className="mt-2 text-xs text-ink-500">{t.assignee} · {timeAgo(t.createdAt)}</p>
                    {c.next && <button onClick={() => { setTaskStatus(t.id, c.next!); notify(`Task ${c.next === 'done' ? 'completed' : 'started'}`); }} className={`${c.next === 'done' ? 'btn-gold' : 'btn-dark'} btn-sm mt-4 w-full`}>{c.action}</button>}
                  </div>
                ))}
                {tasks.length === 0 && <p className="py-8 text-center text-sm text-ink-500">Nothing here</p>}
              </div>
            </div>
          );
        })}
      </div>
      <Modal open={open} onClose={() => setOpen(false)} title="New task">
        <form onSubmit={(e) => { e.preventDefault(); addTask({ ...f, assignee: f.assignee || 'Unassigned' }); setOpen(false); notify('Task created'); }} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <label><span className="label">Room</span><select className="input" value={f.roomId} onChange={(e) => setF({ ...f, roomId: e.target.value })}>{db.rooms.map((r) => <option key={r.id} value={r.id}>{r.number}</option>)}</select></label>
            <label><span className="label">Priority</span><select className="input" value={f.priority} onChange={(e) => setF({ ...f, priority: e.target.value as typeof f.priority })}><option value="low">Low</option><option value="normal">Normal</option><option value="high">High</option></select></label>
          </div>
          <label className="block"><span className="label">Task</span><input required className="input" placeholder="e.g. Extra towels" value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} /></label>
          <label className="block"><span className="label">Assign to</span>
            <select className="input" value={f.assignee} onChange={(e) => setF({ ...f, assignee: e.target.value })}>
              <option value="">Unassigned</option>{hk.map((s) => <option key={s.id}>{s.name}</option>)}<option>Maintenance</option>
            </select>
          </label>
          <button className="btn-gold w-full">Create task</button>
        </form>
      </Modal>
    </>
  );
}
