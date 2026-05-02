'use client';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <main className="main">
      <section className="card">
        <h1>Something broke in this view</h1>
        <p>{error.message || 'Unexpected error occurred.'}</p>
        <button type="button" onClick={() => reset()}>Retry</button>
      </section>
    </main>
  );
}
