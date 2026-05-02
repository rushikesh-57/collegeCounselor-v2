import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="main">
      <section className="card">
        <h1>Page not found</h1>
        <p>The route may have changed during the Next.js migration.</p>
        <Link href="/" style={{ color: 'var(--brand)', fontWeight: 700 }}>Back to Home</Link>
      </section>
    </main>
  );
}
