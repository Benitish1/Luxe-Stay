'use client';

import { useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { PageHead, Tabs } from '@/components/dash';
import { Img, Modal } from '@/components/ui';
import { useStore } from '@/lib/store';
import { money } from '@/lib/config';
import type { MenuCategory, MenuItem } from '@/lib/types';

const CATS: MenuCategory[] = ['Breakfast', 'Starters', 'Mains', 'Grill', 'Desserts', 'Drinks', 'Cocktails', 'Wine'];
const blank: Omit<MenuItem, 'id'> = { name: '', description: '', price: 10, category: 'Mains', image: '', tags: [], available: true, prepMinutes: 15 };

export default function MenuAdmin() {
  const { db, saveMenuItem, deleteMenuItem, notify } = useStore();
  const [cat, setCat] = useState<'all' | MenuCategory>('all');
  const [edit, setEdit] = useState<(Omit<MenuItem, 'id'> & { id?: string }) | null>(null);
  const [tags, setTags] = useState('');

  const list = db.menu.filter((m) => cat === 'all' || m.category === cat);
  const open = (m: Omit<MenuItem, 'id'> & { id?: string }) => { setEdit(m); setTags(m.tags.join(', ')); };

  return (
    <>
      <PageHead title="Menu" sub="Dishes and drinks guests can order from the website." action={<button onClick={() => open({ ...blank })} className="btn-dark btn-sm"><Plus size={14} /> Add item</button>} />
      <div className="mb-6 overflow-x-auto"><Tabs value={cat} onChange={setCat} options={[{ id: 'all' as const, label: 'All', count: db.menu.length }, ...CATS.map((c) => ({ id: c, label: c, count: db.menu.filter((m) => m.category === c).length }))]} /></div>
      <div className="card overflow-x-auto">
        <table className="table-luxe">
          <thead><tr><th>Item</th><th>Category</th><th>Price</th><th>Prep</th><th>Available</th><th /></tr></thead>
          <tbody>
            {list.map((m) => (
              <tr key={m.id}>
                <td><div className="flex items-center gap-3"><Img src={m.image} alt={m.name} className="h-12 w-12 rounded-xl" /><div><p className="font-semibold">{m.name}</p><p className="max-w-xs truncate text-xs text-ink-500">{m.description}</p></div></div></td>
                <td>{m.category}</td>
                <td className="font-semibold">{money(m.price)}</td>
                <td>{m.prepMinutes} min</td>
                <td>
                  <button onClick={() => { saveMenuItem({ ...m, available: !m.available }); notify(`${m.name} ${m.available ? 'hidden from' : 'shown on'} menu`); }}
                    className={`relative h-6 w-11 rounded-full transition ${m.available ? 'bg-emerald-500' : 'bg-ink/20'}`} aria-label="Toggle availability">
                    <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${m.available ? 'left-[22px]' : 'left-0.5'}`} />
                  </button>
                </td>
                <td className="text-right">
                  <button onClick={() => open(m)} className="rounded-lg p-2 hover:bg-ink/5" aria-label="Edit"><Pencil size={15} /></button>
                  <button onClick={() => { if (confirm(`Delete ${m.name}?`)) { deleteMenuItem(m.id); notify('Item deleted'); } }} className="rounded-lg p-2 text-rose-600 hover:bg-rose-50" aria-label="Delete"><Trash2 size={15} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={!!edit} onClose={() => setEdit(null)} title={edit?.id ? 'Edit item' : 'New menu item'}>
        {edit && (
          <form onSubmit={(e) => { e.preventDefault(); saveMenuItem({ ...edit, tags: tags.split(',').map((t) => t.trim()).filter(Boolean) }); setEdit(null); notify('Menu saved'); }} className="space-y-4">
            <label className="block"><span className="label">Name</span><input required className="input" value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} /></label>
            <label className="block"><span className="label">Description</span><textarea rows={2} className="input" value={edit.description} onChange={(e) => setEdit({ ...edit, description: e.target.value })} /></label>
            <div className="grid grid-cols-3 gap-3">
              <label><span className="label">Price</span><input type="number" step="0.5" min={0} className="input" value={edit.price} onChange={(e) => setEdit({ ...edit, price: +e.target.value })} /></label>
              <label><span className="label">Category</span><select className="input" value={edit.category} onChange={(e) => setEdit({ ...edit, category: e.target.value as MenuCategory })}>{CATS.map((c) => <option key={c}>{c}</option>)}</select></label>
              <label><span className="label">Prep (min)</span><input type="number" min={1} className="input" value={edit.prepMinutes} onChange={(e) => setEdit({ ...edit, prepMinutes: +e.target.value })} /></label>
            </div>
            <label className="block"><span className="label">Image URL</span><input className="input" placeholder="https://…" value={edit.image} onChange={(e) => setEdit({ ...edit, image: e.target.value })} /></label>
            <label className="block"><span className="label">Tags (comma separated)</span><input className="input" placeholder="Vegan, Spicy" value={tags} onChange={(e) => setTags(e.target.value)} /></label>
            <button className="btn-gold w-full">Save item</button>
          </form>
        )}
      </Modal>
    </>
  );
}
