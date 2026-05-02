import './globals.css';
import type { Metadata } from 'next';
import ClientProviders from '@/components/next/ClientProviders';

export const metadata: Metadata = {
  title: {
    default: 'College Counselor',
    template: '%s | College Counselor',
  },
  description: 'Find safer engineering college options using historical CAP cutoff data.',
  openGraph: {
    title: 'College Counselor',
    description: 'Find safer engineering college options using historical CAP cutoff data.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
