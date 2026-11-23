'use client';

import { useState } from 'react';
import { KeyRound, Pencil, Phone, Plus, ShieldOff, Trash2, Copy } from 'lucide-react';
import { PageHead } from '@/components/dash';
import { Img, Modal } from '@/components/ui';
import { useStore } from '@/lib/store';
import type { Staff } from '@/lib/types';

const DEPTS: Staff['department'][] = ['Front Office', 'Housekeeping', 'Kitchen', 'Restaurant', 'Spa', 'Management', 'Security'];
const blank: Omit<Staff, 'id'> = { name: '', role: '', department: 'Front Office', phone: '', shift: 'Morning', onDuty: false, avatar: '' };
const genPassword = () => Math.random().toString(36).slice(2, 6) + '-' + Math.random().toString(36).slice(2, 6);

type Access = { enabled: boolean; email: string; password: string; role: 'staff' | 'admin' };

export default function StaffPage() {
  const { db, user, saveStaff, revokeStaffAccess, deleteStaff, notify } = useStore();
  const [edit, setEdit] = useState<(Omit<Staff, 'id'> & { id?: string }) | null>(null);
  const [access, setAccess] = useState<Access>({ enabled: true, email: '', password: '', role: 'staff' });
  const [error, setError] = useState('');
  const [issued, setIssued] = useState<{ name: string; email: string; password: string } | null>(null);
  const onDuty = db.staff.filter((s) => s.onDuty).length;
  const account = (s: Staff) => db.users.find((u) => u.id === s.userId);

  const openEdit = (s: Omit<Staff, 'id'> & { id?: string }) => {
    const acc = s.userId ? db.users.find((u) => u.id === s.userId) : undefined;
    setEdit(s);
    setError('');
    setAccess(acc
      ? { enabled: true, email: acc.email, password: '', role: acc.role === 'admin' ? 'admin' : 'staff' }
      : { enabled: !s.id, email: '', password: genPassword(), role: 'staff' });
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!edit) return;
    setError('');
    try {
      const hadLogin = !!edit.userId;
      saveStaff(edit, access.enabled ? { email: access.email, password: access.password || undefined, role: access.role } : null);
      if (!access.enabled && hadLogin && edit.id) revokeStaffAccess(edit.id);
      if (access.enabled && access.password) setIssued({ name: edit.name, email: access.email, password: access.password });
      notify(access.enabled ? `${edit.name} saved with dashboard access` : `${edit.name} saved`);
      setEdit(null);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <>
      <PageHead title="Staff" sub={`${db.staff.length} team members · ${onDuty} on duty now · Staff can't sign up themselves. You create their logins here.`}
        action={<button onClick={() => openEdit({ ...blank })} className="btn-dark btn-sm"><Plus size={14} /> Add staff member</button>} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {db.staff.map((s) => {
          const acc = account(s);
          return (
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
              <div className={`mt-4 flex items-center gap-2 rounded-xl px-3 py-2 text-xs ${acc ? 'bg-gold/10' : 'bg-ink/5 text-ink-500'}`}>
                <KeyRound size={13} className={acc ? 'text-gold-700' : ''} />
                {acc ? <span className="truncate">Login: <b>{acc.email}</b> · <span className="capitalize">{acc.role}</span></span> : 'No dashboard login'}
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-ink/5 pt-4">
                <a href={`tel:${s.phone}`} className="flex items-center gap-2 text-xs text-ink-500 hover:text-ink"><Phone size={13} />{s.phone}</a>
                <div className="flex gap-1">
                  <button onClick={() => { saveStaff({ ...s, onDuty: !s.onDuty }); notify(`${s.name} clocked ${s.onDuty ? 'out' : 'in'}`); }} className="rounded-full px-3 py-1 text-xs font-semibold hover:bg-ink/5">{s.onDuty ? 'Clock out' : 'Clock in'}</button>
                  <button onClick={() => openEdit(s)} className="rounded-lg p-2 hover:bg-ink/5" aria-label="Edit"><Pencil size={14} /></button>
                  {acc && acc.id !== user?.id && <button onClick={() => { if (confirm(`Remove ${s.name}'s dashboard access?`)) { revokeStaffAccess(s.id); notify('Access removed'); } }} className="rounded-lg p-2 text-amber-600 hover:bg-amber-50" aria-label="Remove access"><ShieldOff size={14} /></button>}
                  {acc?.id !== user?.id && <button onClick={() => { if (confirm(`Remove ${s.name} from staff?`)) { deleteStaff(s.id); notify('Staff member removed'); } }} className="rounded-lg p-2 text-rose-600 hover:bg-rose-50" aria-label="Delete"><Trash2 size={14} /></button>}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Modal open={!!edit} onClose={() => setEdit(null)} title={edit?.id ? 'Edit staff member' : 'Add staff member'} wide>
        {edit && (
          <form onSubmit={submit} className="space-y-5">
            <div className="grid gap-3 sm:grid-cols-2">
              <label><span className="label">Full name</span><input required className="input" value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} /></label>
              <label><span className="label">Job title</span><input required className="input" placeholder="e.g. Receptionist" value={edit.role} onChange={(e) => setEdit({ ...edit, role: e.target.value })} /></label>
              <label><span className="label">Department</span><select className="input" value={edit.department} onChange={(e) => setEdit({ ...edit, department: e.target.value as Staff['department'] })}>{DEPTS.map((d) => <option key={d}>{d}</option>)}</select></label>
              <label><span className="label">Shift</span><select className="input" value={edit.shift} onChange={(e) => setEdit({ ...edit, shift: e.target.value as Staff['shift'] })}><option>Morning</option><option>Afternoon</option><option>Night</option></select></label>
              <label className="sm:col-span-2"><span className="label">Phone</span><input className="input" value={edit.phone} onChange={(e) => setEdit({ ...edit, phone: e.target.value })} /></label>
            </div>

            <div className="rounded-2xl border border-gold/40 bg-white p-5">
              <label className="flex cursor-pointer items-center justify-between gap-4">
                <span>
                  <span className="flex items-center gap-2 font-semibold"><KeyRound size={16} className="text-gold-600" /> Dashboard login</span>
                  <span className="text-xs text-ink-500">Give this person an email and password to sign in at the Staff portal.</span>
                </span>
                <input type="checkbox" className="h-5 w-5 accent-[#C6A15B]" checked={access.enabled} onChange={(e) => setAccess({ ...access, enabled: e.target.checked })} />
              </label>
              {access.enabled && (
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <label><span className="label">Login email</span><input required type="email" className="input" value={access.email} onChange={(e) => setAccess({ ...access, email: e.target.value })} /></label>
                  <label><span className="label">{edit.userId ? 'New password (optional)' : 'Password'}</span>
                    <div className="flex gap-2">
                      <input className="input font-mono" required={!edit.userId} minLength={6} placeholder={edit.userId ? 'Leave blank to keep' : ''} value={access.password} onChange={(e) => setAccess({ ...access, password: e.target.value })} />
                      <button type="button" onClick={() => setAccess({ ...access, password: genPassword() })} className="btn-outline btn-sm shrink-0">Generate</button>
                    </div>
                  </label>
                  <label className="sm:col-span-2"><span className="label">Access level</span>
                    <select className="input" value={access.role} onChange={(e) => setAccess({ ...access, role: e.target.value as Access['role'] })} disabled={edit.userId === user?.id}>
                      <option value="staff">Staff: day-to-day operations (no staff or user management)</option>
                      <option value="admin">Admin: full access, including staff & users</option>
                    </select>
                  </label>
                </div>
              )}
            </div>
            {error && <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>}
            <button className="btn-gold w-full">Save</button>
          </form>
        )}
      </Modal>

      <Modal open={!!issued} onClose={() => setIssued(null)} title="Login details">
        {issued && (
          <div className="space-y-4">
            <p className="text-sm text-ink-500">Share these with <b className="text-ink">{issued.name}</b>. They sign in at <b className="text-ink">Staff login</b> (footer of the website, or <span className="font-mono">/login?portal=staff</span>).</p>
            <div className="space-y-2 rounded-2xl bg-white p-4 font-mono text-sm">
              <p>Email: <b>{issued.email}</b></p>
              <p>Password: <b>{issued.password}</b></p>
            </div>
            <button onClick={() => { navigator.clipboard?.writeText(`LuxeStay staff login\nEmail: ${issued.email}\nPassword: ${issued.password}`); notify('Copied to clipboard'); }} className="btn-dark w-full"><Copy size={15} /> Copy details</button>
          </div>
        )}
      </Modal>
    </>
  );
}
