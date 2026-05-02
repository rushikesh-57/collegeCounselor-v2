'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useMemo, useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase-browser';
import { useToast } from '@/components/next/feedback/ToastProvider';
import { useAuth } from './AuthProvider';

type Mode = 'signin' | 'signup';

export default function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMode = searchParams?.get('mode') === 'signup' ? 'signup' : 'signin';
  const [mode, setMode] = useState<Mode>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { configured } = useAuth();
  const { showToast } = useToast();

  const title = useMemo(() => (mode === 'signin' ? 'Sign in' : 'Create account'), [mode]);

  async function signInWithGoogle() {
    setError('');
    setMessage('');

    if (!configured || !supabaseBrowser) {
      setError('Supabase auth is not configured yet.');
      return;
    }

    setLoading(true);

    const { error: oauthError } = await supabaseBrowser.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/account`,
      },
    });

    if (oauthError) {
      setLoading(false);
      setError(oauthError.message);
      showToast(oauthError.message, 'error');
    }
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError('');
    setMessage('');

    if (!configured || !supabaseBrowser) {
      setError('Supabase auth is not configured yet.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      if (mode === 'signin') {
        const { error: signInError } = await supabaseBrowser.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
        showToast('Signed in successfully.', 'success');
        router.push('/account');
        router.refresh();
        return;
      }

      const { data, error: signUpError } = await supabaseBrowser.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/account`,
        },
      });

      if (signUpError) throw signUpError;

      if (data.session) {
        showToast('Account created.', 'success');
        router.push('/account');
        router.refresh();
        return;
      }

      setMessage('Account created. Check your email to confirm your sign in.');
      showToast('Check your email to confirm your account.', 'info');
    } catch (err) {
      const nextError = err instanceof Error ? err.message : 'Authentication failed.';
      setError(nextError);
      showToast(nextError, 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="auth-panel">
      <div className="auth-copy">
        <h1>{title}</h1>
        <p>Use your account to keep counselling workflows secure and ready for student-specific features.</p>
      </div>

      <form className="auth-form" onSubmit={submit}>
        <button className="google-auth-button" disabled={loading || !configured} onClick={signInWithGoogle} type="button">
          <span className="google-mark" aria-hidden="true">G</span>
          Continue with Google
        </button>

        <div className="auth-divider">
          <span>or use email</span>
        </div>

        <label>
          Email
          <input
            autoComplete="email"
            inputMode="email"
            onChange={(event) => setEmail(event.target.value)}
            required
            type="email"
            value={email}
          />
        </label>

        <label>
          Password
          <input
            autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
            minLength={6}
            onChange={(event) => setPassword(event.target.value)}
            required
            type="password"
            value={password}
          />
        </label>

        {!configured ? (
          <p className="error-text">Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to enable auth.</p>
        ) : null}
        {error ? <p className="error-text">{error}</p> : null}
        {message ? <p className="fallback-text">{message}</p> : null}

        <button type="submit" disabled={loading || !configured}>
          {loading ? 'Please wait...' : title}
        </button>

        <button
          className="link-button"
          onClick={() => {
            setMode(mode === 'signin' ? 'signup' : 'signin');
            setError('');
            setMessage('');
          }}
          type="button"
        >
          {mode === 'signin' ? 'Create a new account' : 'Already have an account? Sign in'}
        </button>
      </form>
    </section>
  );
}
