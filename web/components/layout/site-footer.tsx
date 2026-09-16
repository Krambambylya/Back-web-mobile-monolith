import Link from 'next/link';

const LINKS = [
  { href: '/sync', label: 'Sync' },
  { href: '/items', label: 'Items' },
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-5 py-8 sm:px-8">
        <nav
          aria-label="Footer"
          className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2"
        >
          {LINKS.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-muted transition-colors duration-200 hover:text-accent-soft"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <p className="text-center text-xs leading-relaxed text-muted-2 sm:text-sm">
          © {new Date().getFullYear()} Pairkit. MIT-0.
        </p>
      </div>
    </footer>
  );
}
