'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useId, useState } from 'react';

import { PairkitMark } from '@/components/brand/pairkit-mark';

const NAV = [
  { href: '/', label: 'About', match: (p: string) => p === '/' },
  { href: '/sync', label: 'Sync', match: (p: string) => p.startsWith('/sync') },
  { href: '/items', label: 'Items', match: (p: string) => p.startsWith('/items') },
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const [menuPath, setMenuPath] = useState(pathname);
  const [menuOpen, setMenuOpen] = useState(false);
  const open = menuOpen && menuPath === pathname;
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const toggleMenu = () => {
    setMenuPath(pathname);
    setMenuOpen(current => !(current && menuPath === pathname));
  };

  const linkClass = (active: boolean) =>
    [
      'cursor-pointer rounded-sm px-3 py-2 text-sm font-medium transition-colors duration-200',
      active ? 'bg-primary-muted text-accent-soft' : 'text-muted hover:text-foreground',
    ].join(' ');

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-[var(--header-h)] max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
          <Link href="/" className="flex min-w-0 cursor-pointer items-center gap-2.5">
            <PairkitMark size={36} className="h-9 w-9 shrink-0" />
            <span className="min-w-0">
              <span className="block font-display text-sm font-semibold tracking-tight text-ink sm:text-base">
                Pairkit
              </span>
              <span className="hidden text-[11px] leading-none text-muted sm:block">
                pairing starter
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
            {NAV.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={linkClass(item.match(pathname))}
                aria-current={item.match(pathname) ? 'page' : undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <button
            type="button"
            className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-md border border-border bg-surface/80 text-foreground transition-colors duration-200 hover:bg-surface-2 md:hidden"
            aria-expanded={open}
            aria-controls={menuId}
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={toggleMenu}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
              {open ? (
                <path
                  d="M6 6l12 12M18 6 6 18"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M4 7h16M4 12h16M4 17h16"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              )}
            </svg>
          </button>
        </div>

        {open ? (
          <div
            id={menuId}
            className="border-t border-border bg-background/95 px-5 py-4 backdrop-blur-md md:hidden"
          >
            <nav className="flex flex-col gap-1" aria-label="Mobile">
              {NAV.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={[
                    'cursor-pointer rounded-md px-4 py-3 text-base font-medium transition-colors duration-200',
                    item.match(pathname)
                      ? 'bg-primary-muted text-accent-soft'
                      : 'text-foreground hover:bg-surface',
                  ].join(' ')}
                  aria-current={item.match(pathname) ? 'page' : undefined}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        ) : null}
      </header>
      <div className="h-[var(--header-h)] shrink-0" aria-hidden />
    </>
  );
}
