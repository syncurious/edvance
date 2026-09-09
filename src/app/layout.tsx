import type { Metadata } from 'next';

import { Toaster } from '@/components/ui/toast';
import { StoreProvider } from '@/store/provider';

import './globals.css';

export const metadata: Metadata = {
  icons: { icon: '/favicon.svg' },
  title: {
    default: 'Edvance',
    template: '%s | Edvance',
  },
  description:
    'A focused administration platform for school teams and education networks.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>
          {children}
          <Toaster />
        </StoreProvider>
      </body>
    </html>
  );
}
