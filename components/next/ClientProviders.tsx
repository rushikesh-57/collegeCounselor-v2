'use client';

import AuthProvider from './auth/AuthProvider';
import ToastProvider from './feedback/ToastProvider';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <AuthProvider>{children}</AuthProvider>
    </ToastProvider>
  );
}
