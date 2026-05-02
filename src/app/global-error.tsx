'use client';

import { useEffect } from 'react';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error('Global route error boundary:', error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <main className="main">
          <section className="card">
            <h1>Something went wrong</h1>
            <p>We hit an unexpected error. Please retry.</p>
            <button type="button" onClick={() => reset()}>Retry</button>
          </section>
        </main>
      </body>
    </html>
  );
}
