'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AuthShell from '@/components/AuthShell';
import { useStore } from '@/lib/store';

export default function RegisterPage() {
  const router = useRouter();
  const { register, notify } = useStore();
  const [f, setF] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [error, setError] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (f.password.length < 6) return setError('Password must be at least 6 characters');
    if (f.password !== f.confirm) return setError('Passwords do not match');
    try {
      register(f.name, f.email, f.password, f.phone);
      notify('Welcome! 250 bonus points added to your account');
      router.push('/account');
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <AuthShell title="Join the Circle" sub="Create an account to book faster, order room service and earn rewards on every stay.">
      <form onSubmit={submit} className="space-y-4">
        <label className="block"><span className="label">Full name</span><input required className="input" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label><span className="label">Email</span><input required type="email" className="input" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></label>
          <label><span className="label">Phone</span><input className="input" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} /></label>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label><span className="label">Password</span><input required type="password" className="input" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} /></label>
          <label><span className="label">Confirm</span><input required type="password" className="input" value={f.confirm} onChange={(e) => setF({ ...f, confirm: e.target.value })} /></label>
        </div>
        {error && <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>}
        <button className="btn-gold w-full">Create account</button>
      </form>
      <p className="mt-6 text-center text-sm text-ink-500">Already a member? <Link href="/login" className="font-semibold text-gold-700 hover:underline">Sign in</Link></p>
    </AuthShell>
  );
}
