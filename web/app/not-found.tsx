import type { Metadata } from 'next';

import { SiteFooter } from '@/components/layout/site-footer';
import { SiteHeader } from '@/components/layout/site-header';
import { ButtonLink } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Not found',
  robots: { index: false, follow: true },
};

export default function NotFoundPage() {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main
        id="main"
        className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-5 py-16 sm:px-8"
      >
        <p className="text-sm font-semibold tracking-wide text-accent-soft">404</p>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          This page does not exist
        </h1>
        <p className="mt-4 max-w-md text-base leading-relaxed text-muted">
          The link is stale or the address is wrong.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/">Home</ButtonLink>
          <ButtonLink href="/sync" variant="secondary">
            Sync
          </ButtonLink>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
