import Link from 'next/link';

export const nav = [
  ['Home', '/'],
  ['Colleges', '/colleges'],
  ['Check Cutoffs', '/check-cutoffs'],
  ['Branches', '/branches'],
  ['Downloads', '/downloads'],
  ['Contact', '/contact'],
  ['Chatbot', '/chatbot'],
] as const;

export default function Nav({ pathname }: { pathname: string }) {
  return (
    <nav className="nav desktop-nav" aria-label="Primary">
      {nav.map(([label, href]) => (
        <Link key={href} href={href} className={pathname === href ? 'active' : ''}>
          {label}
        </Link>
      ))}
    </nav>
  );
}
