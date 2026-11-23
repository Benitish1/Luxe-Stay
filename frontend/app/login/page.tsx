'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ShieldCheck } from 'lucide-react';
import AuthShell from '@/components/AuthShell';
import { useStore } from '@/lib/store';

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { login, logout, notify } = useStore();
  const staffPortal = params.get('portal') === 'staff';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const u = login(email, password);
      if (staffPortal && u.role === 'guest') {
        logout();
        return setError('This is the staff portal. Guest accounts sign in on the main sign-in page.');
      }
      notify(`Welcome back, ${u.name.split(' ')[0]}`);
      if (u.role !== 'guest') return router.push('/dashboard');
      router.push(params.get('next') || '/account');
    } catch (err) {
      setError((err as Error).message);
    }
  };

  if (staffPortal) {
    return (
      <AuthShell title="Staff portal" sub="For LuxeStay team members. Your login is created by the hotel administrator.">
        <form onSubmit={submit} className="space-y-4">
          <label className="block"><span className="label">Work email</span><input required type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
          <label className="block"><span className="label">Password</span><input required type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} /></label>
          {error && <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>}
          <button className="btn-dark w-full"><ShieldCheck size={16} /> Sign in to dashboard</button>
        </form>
        <p className="mt-6 rounded-2xl bg-gold/10 p-4 text-sm text-ink-500">Don&apos;t have a staff login? Ask the hotel manager to create one for you from <b>Dashboard → Staff</b>.</p>
        <p className="mt-8 text-center"><Link href="/login" className="text-sm text-ink-500 hover:text-ink">Guest sign in →</Link></p>
      </AuthShell>
    );
  }

  return (
    <AuthShell title="Welcome back" sub="Sign in to book rooms, order food and manage your stays.">
      <form onSubmit={submit} className="space-y-4">
        <label className="block"><span className="label">Email</span><input required type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
        <label className="block"><span className="label">Password</span><input required type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} /></label>
        {error && <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>}
        <button className="btn-dark w-full">Sign in</button>
      </form>
      <div className="mt-8 rounded-2xl border border-gold/40 bg-gold/5 p-5 text-center">
        <p className="font-display text-2xl">New to LuxeStay?</p>
        <p className="mt-1 text-sm text-ink-500">Create a free account to book and order. It takes 30 seconds.</p>
        <Link href={`/register${params.get('next') ? `?next=${encodeURIComponent(params.get('next')!)}` : ''}`} className="btn-gold mt-4">Create an account</Link>
      </div>
      <div className="mt-8 flex justify-between text-sm text-ink-500">
        <Link href="/" className="hover:text-ink">← Back to hotel</Link>
        <Link href="/login?portal=staff" className="hover:text-ink">Staff login</Link>
      </div>
    </AuthShell>
  );
}

export default function LoginPage() {
  return <Suspense><LoginForm /></Suspense>;
}
