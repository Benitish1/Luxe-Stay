'use client';

import { CheckCircle2 } from 'lucide-react';
import { useStore } from '@/lib/store';

export default function Toast() {
  const { toast } = useStore();
  if (!toast) return null;
  return (
    <div className="fixed bottom-6 left-1/2 z-[100] -translate-x-1/2 reveal" role="status">
      <div className="flex items-center gap-3 rounded-full bg-ink px-5 py-3 text-sm text-ivory shadow-luxe">
        <CheckCircle2 size={18} className="text-gold" />
        {toast}
      </div>
    </div>
  );
}
