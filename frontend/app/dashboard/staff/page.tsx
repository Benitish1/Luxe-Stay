'use client';

import { useState } from 'react';
import { Pencil, Phone, Plus, Trash2 } from 'lucide-react';
import { PageHead } from '@/components/dash';
import { Img, Modal } from '@/components/ui';
import { useStore } from '@/lib/store';
import type { Staff } from '@/lib/types';

const DEPTS: Staff['department'][] = ['Front Office', 'Housekeeping', 'Kitchen', 'Restaurant', 'Spa', 'Management', 'Security'];
const blank: Omit<Staff, 'id'> = { name: '', role: '', department: 'Front Office', phone: '', shift: 'Morning', onDuty: false, avatar: '' };

export default function StaffPage() {
  const { db, saveStaff, deleteStaff, notify } = useStore();
  const [edit, setEdit] = useState<(Omit<Staff, 'id'> & { id?: string }) | null>(null);
  const onDuty = db.staff.filter((s) => s.onDuty).length;

  return (
    <>
      <PageHead title="Staff" sub={`${db.staff.length} team members · ${onDuty} on duty now`} action={<button onClick={() => setEdit({ ...blank })} className="btn-dark btn-sm"><Plus size={14} /> Add staff</button>} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {db.staff.map((s) => (
          <div key={s.id} className="card p-5">
            <div className="flex items-center gap-4">
              <div className="relative">
                {s.avatar ? <Img src={s.avatar} alt={s.name} className="h-14 w-14 rounded-full" /> : <span className="grid h-14 w-14 place-items-center rounded-full bg-gold/20 font-bold text-gold-700">{s.name.split(' ').map((p) => p[0]).slice(0, 2).join('')}</span>}
                <span className={`absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full ring-2 ring-white ${s.onDuty ? 'bg-emerald-500' : 'bg-ink/25'}`} />
              </div>
              <div className="min-w-0 flex-1"><p className="truncate font-semibold">{s.name}</p><p className="text-sm text-ink-500">{s.role}</p></div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              <span className="chip bg-ivory">{s.department}</span>
              <span className="chip bg-ivory">{s.shift} shift</span>
              <span className={`chip ${s.onDuty ? 'bg-emerald-50 text-emerald-700' : 'bg-stone-100 text-stone-600'}`}>{s.onDuty ? 'On duty' : 'Off duty'}</span>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-ink/5 pt-4">
              <a href={`tel:${s.phone}`} className="flex items-center gap-2 text-xs text-ink-500 hover:text-ink"><Phone size={13} />{s.phone}</a>
              <div className="flex gap-1">
                <button onClick={() => { saveStaff({ ...s, onDuty: !s.onDuty }); notify(`${s.name} clocked ${s.onDuty ? 'out' : 'in'}`); }} className="rounded-full px-3 py-1 text-xs font-semibold hover:bg-ink/5">{s.onDuty ? 'Clock out' : 'Clock in'}</button>
                <button onClick={() => setEdit(s)} className="rounded-lg p-2 hover:bg-ink/5" aria-label="Edit"><Pencil size={14} /></button>
                <button onClick={() => { if (confirm(`Remove ${s.name}?`)) { deleteStaff(s.id); notify('Staff member removed'); } }} className="rounded-lg p-2 text-rose-600 hover:bg-rose-50" aria-label="Delete"><Trash2 size={14} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Modal open={!!edit} onClose={() => setEdit(null)} title={edit?.id ? 'Edit staff member' : 'Add staff member'}>
        {edit && (
          <form onSubmit={(e) => { e.preventDefault(); saveStaff(edit); setEdit(null); notify('Staff saved'); }} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <label><span className="label">Full name</span><input required className="input" value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} /></label>
              <label><span className="label">Job title</span><input required className="input" value={edit.role} onChange={(e) => setEdit({ ...edit, role: e.target.value })} /></label>
              <label><span className="label">Department</span><select className="input" value={edit.department} onChange={(e) => setEdit({ ...edit, department: e.target.value as Staff['department'] })}>{DEPTS.map((d) => <option key={d}>{d}</option>)}</select></label>
              <label><span className="label">Shift</span><select className="input" value={edit.shift} onChange={(e) => setEdit({ ...edit, shift: e.target.value as Staff['shift'] })}><option>Morning</option><option>Afternoon</option><option>Night</option></select></label>
            </div>
            <label className="block"><span className="label">Phone</span><input className="input" value={edit.phone} onChange={(e) => setEdit({ ...edit, phone: e.target.value })} /></label>
            <button className="btn-gold w-full">Save</button>
          </form>
        )}
      </Modal>
    </>
  );
}
