import Link from 'next/link';

import { SiteFooter } from '@/components/layout/site-footer';
import { SiteHeader } from '@/components/layout/site-header';

type AppShellProps = {
  children: React.ReactNode;
  title?: string;
  backHref?: string;
  hideTitle?: boolean;
  showFooter?: boolean;
};

export function AppShell({
  children,
  title,
  backHref,
  hideTitle = false,
  showFooter = false,
}: AppShellProps) {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main id="main" className="relative mx-auto w-full max-w-6xl flex-1 px-5 pb-16 pt-8 sm:px-8">
        {!hideTitle && (title || backHref) ? (
          <div className="mb-8 flex items-center gap-3">
            {backHref ? (
              <Link
                href={backHref}
                className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-md border border-border bg-surface text-foreground transition-colors duration-200 hover:bg-surface-2"
                aria-label="Back"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M15 6 9 12l6 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            ) : null}
            {title ? (
              <h1 className="min-w-0 flex-1 truncate font-display text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                {title}
              </h1>
            ) : null}
          </div>
        ) : null}
        {children}
      </main>
      {showFooter ? <SiteFooter /> : null}
    </div>
  );
}
