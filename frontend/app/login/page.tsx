'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import AuthShell from '@/components/AuthShell';
import { useStore } from '@/lib/store';

const demo = [
  { role: 'Admin', email: 'admin@luxestay.com', password: 'admin123' },
  { role: 'Staff', email: 'staff@luxestay.com', password: 'staff123' },
  { role: 'Guest', email: 'guest@luxestay.com', password: 'guest123' },
];

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { login, notify } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const go = (em: string, pw: string) => {
    setError('');
    try {
      const u = login(em, pw);
      notify(`Welcome back, ${u.name.split(' ')[0]}`);
      router.push(params.get('next') || (u.role === 'guest' ? '/account' : '/dashboard'));
    } catch (e) {
      setError((e as Error).message);
    }
  };

  return (
    <AuthShell title="Welcome back" sub="Sign in to manage your stays, orders and rewards.">
      <form onSubmit={(e) => { e.preventDefault(); go(email, password); }} className="space-y-4">
        <label className="block"><span className="label">Email</span><input required type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
        <label className="block"><span className="label">Password</span><input required type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} /></label>
        {error && <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>}
        <button className="btn-dark w-full">Sign in</button>
      </form>
      <p className="mt-6 text-center text-sm text-ink-500">New to LuxeStay? <Link href="/register" className="font-semibold text-gold-700 hover:underline">Create an account</Link></p>
      <div className="mt-10 rounded-2xl border border-dashed border-gold/50 bg-gold/5 p-5">
        <p className="eyebrow">Demo accounts — one click</p>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {demo.map((d) => (
            <button key={d.role} onClick={() => go(d.email, d.password)} className="rounded-xl bg-white px-3 py-3 text-sm font-semibold shadow-soft transition hover:bg-ink hover:text-white">{d.role}</button>
          ))}
        </div>
      </div>
      <p className="mt-8 text-center"><Link href="/" className="text-sm text-ink-500 hover:text-ink">← Back to hotel</Link></p>
    </AuthShell>
  );
}

export default function LoginPage() {
  return <Suspense><LoginForm /></Suspense>;
}
