import type { Metadata } from 'next';
import { Suspense } from 'react';
import AuthForm from '@/components/next/auth/AuthForm';
import Shell from '@/components/next/Shell';

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in or create a College Counselor account.',
};

export default function AuthPage() {
  return (
    <Shell>
      <Suspense fallback={<div className="skeleton-block" />}>
        <AuthForm />
      </Suspense>
    </Shell>
  );
}
