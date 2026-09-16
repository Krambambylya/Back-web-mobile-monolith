'use client';

import { ButtonLink } from '@/components/ui/button';

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main
      id="main"
      className="mx-auto flex min-h-full max-w-3xl flex-col justify-center px-5 py-16"
    >
      <h1 className="font-display text-2xl font-semibold text-foreground">Something went wrong</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        Try again, or go back to the home page.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={reset}
          className="min-h-11 rounded-md bg-primary px-5 text-sm font-semibold text-on-primary"
        >
          Try again
        </button>
        <ButtonLink href="/" variant="secondary">
          Home
        </ButtonLink>
      </div>
    </main>
  );
}
