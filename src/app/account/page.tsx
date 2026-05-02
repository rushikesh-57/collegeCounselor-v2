import type { Metadata } from 'next';
import AccountClient from '@/components/next/auth/AccountClient';
import Shell from '@/components/next/Shell';

export const metadata: Metadata = {
  title: 'Account',
  description: 'Manage your College Counselor account.',
};

export default function AccountPage() {
  return (
    <Shell>
      <AccountClient />
    </Shell>
  );
}
