import type { Metadata } from 'next';

import { SiteFooter } from '@/components/layout/site-footer';
import { SiteHeader } from '@/components/layout/site-header';
import { ButtonLink } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'What is Pairkit',
};

export default function HomePage() {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main id="main" className="mx-auto w-full max-w-6xl flex-1 px-5 pb-16 pt-12 sm:px-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-accent-soft">Starter</p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
          Pairkit
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
          Next.js, Expo, and Express in one repo, sharing Zod contracts in{' '}
          <code className="font-mono text-sm text-foreground">@pairkit/core</code>. Workspace
          pairing and a thin Item record are a demo slice so the layers are not empty. Replace the
          slice; keep the contracts.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/sync">Open sync hub</ButtonLink>
          <ButtonLink href="/items" variant="secondary">
            Open items
          </ButtonLink>
        </div>
        <section className="mt-16 grid gap-4 sm:grid-cols-3">
          {[
            {
              title: 'Shared contracts',
              body: 'One Zod package for web, mobile, and the API. The same shapes at every layer.',
            },
            {
              title: 'Optional clients',
              body: 'Web and mobile do not import each other. Drop a client by removing its package and the workspace/CI lines that name it.',
            },
            {
              title: 'Demo slice',
              body: 'Pairing plus Item sync exists so you can trace a request through the stack. Search Pairkit when you rename.',
            },
          ].map(card => (
            <article
              key={card.title}
              className="rounded-lg border border-border bg-surface p-5 shadow-soft"
            >
              <h2 className="font-display text-lg font-semibold text-foreground">{card.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">{card.body}</p>
            </article>
          ))}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
