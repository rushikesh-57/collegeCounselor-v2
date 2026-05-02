'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthProvider';
import { useToast } from '@/components/next/feedback/ToastProvider';

export default function AccountClient() {
  const router = useRouter();
  const { configured, loading, signOut, user } = useAuth();
  const { showToast } = useToast();

  async function logout() {
    await signOut();
    showToast('Signed out.', 'success');
    router.push('/auth');
    router.refresh();
  }

  if (loading) {
    return (
      <section className="card">
        <h1>Account</h1>
        <div className="skeleton-block" />
      </section>
    );
  }

  if (!configured) {
    return (
      <section className="card">
        <h1>Account</h1>
        <p className="error-text">Supabase auth is not configured yet.</p>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="card">
        <h1>Account</h1>
        <p>Sign in to manage your counselling workspace.</p>
        <Link className="button-link" href="/auth">Sign in</Link>
      </section>
    );
  }

  return (
    <section className="card">
      <h1>Account</h1>
      <div className="account-summary">
        <span>Email</span>
        <strong>{user.email}</strong>
        <span>User ID</span>
        <strong>{user.id}</strong>
      </div>
      <button type="button" onClick={logout}>Sign out</button>
    </section>
  );
}
