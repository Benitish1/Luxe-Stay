import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="grain relative grid min-h-screen place-items-center bg-ink px-6 text-center">
      <div>
        <p className="font-display text-[9rem] leading-none text-gold">404</p>
        <h1 className="h-display mt-2 text-4xl text-white">This room doesn&apos;t exist.</h1>
        <p className="mt-3 text-white/60">The page you&apos;re looking for has checked out.</p>
        <Link href="/" className="btn-gold mt-8">Return to lobby</Link>
      </div>
    </div>
  );
}
