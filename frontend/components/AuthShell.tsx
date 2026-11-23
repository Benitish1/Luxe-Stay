import { ReactNode } from 'react';
import { Img, Logo } from './ui';
import { IMAGES } from '@/lib/seed';

export default function AuthShell({ title, sub, children }: { title: string; sub: string; children: ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="grain relative hidden overflow-hidden bg-ink lg:block">
        <Img src={IMAGES.pool} alt="" className="absolute inset-0 h-full w-full animate-kenburns opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-ink/40" />
        <div className="absolute left-12 top-10"><Logo light /></div>
        <div className="absolute bottom-14 left-12 right-12">
          <p className="h-display text-5xl italic text-white">“The art of hospitality is making guests feel at home when you wish they were.”</p>
          <p className="mt-4 text-sm uppercase tracking-luxe text-gold-300">LuxeStay Hotel & Residences</p>
        </div>
      </div>
      <div className="flex items-center justify-center px-6 py-16">
        <div className="reveal w-full max-w-md">
          <div className="mb-10 lg:hidden"><Logo /></div>
          <h1 className="h-display text-5xl">{title}</h1>
          <p className="mt-3 text-ink-500">{sub}</p>
          <div className="mt-10">{children}</div>
        </div>
      </div>
    </div>
  );
}
