'use client';

import './globals.css';

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="bg-background font-sans text-foreground">
        <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-5">
          <h1 className="text-2xl font-semibold">Pairkit crashed</h1>
          <p className="mt-3 text-sm text-muted">Reload the page to continue.</p>
          <button
            type="button"
            onClick={reset}
            className="mt-6 h-11 w-fit rounded-md bg-primary px-5 text-sm font-semibold text-on-primary"
          >
            Reload
          </button>
        </main>
      </body>
    </html>
  );
}
