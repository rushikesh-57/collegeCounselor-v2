'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Nav, { nav } from './Nav';
import { useAuth } from './auth/AuthProvider';

export default function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? '/';
  const { loading, user } = useAuth();
  const authHref = user ? '/account' : '/auth';
  const authLabel = loading ? 'Account' : user ? 'Account' : 'Sign in';
  const mobileTabs = [
    nav[0],
    nav[1],
    nav[2],
    [authLabel, authHref],
  ] as const;

  return (
    <div className="shell">
      <header className="topbar">
        <div className="topbar-inner">
          <Link href="/" className="brand">College Counselor</Link>
          <Nav pathname={pathname} />
          <Link href={authHref} className={`nav-auth ${pathname === authHref ? 'active' : ''}`}>
            {authLabel}
          </Link>
        </div>
      </header>
      <main className="main">{children}</main>
      <nav className="bottom-tabs" aria-label="Bottom navigation">
        {mobileTabs.map(([label, href]) => (
          <Link key={href} href={href} className={pathname === href ? 'active' : ''}>
            {label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
