import type { Metadata } from 'next';
import { Cormorant_Garamond, Manrope } from 'next/font/google';
import './globals.css';
import { StoreProvider } from '@/lib/store';
import Toast from '@/components/Toast';

const display = Cormorant_Garamond({ subsets: ['latin'], weight: ['400', '500', '600'], style: ['normal', 'italic'], variable: '--font-display' });
const sans = Manrope({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'LuxeStay — Hotel & Residences',
  description: 'Luxury rooms and suites, fine dining, spa and unforgettable experiences. Book direct for the best rates.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body>
        <StoreProvider>
          {children}
          <Toast />
        </StoreProvider>
      </body>
    </html>
  );
}
