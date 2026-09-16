'use client';

type SyncingBannerProps = {
  className?: string;
  message?: string;
};

export function SyncingBanner({ className = '', message = 'Working…' }: SyncingBannerProps) {
  return (
    <div
      className={`flex items-start gap-3 rounded-lg border border-border bg-surface px-4 py-3.5 shadow-soft ${className}`}
      role="status"
    >
      <span
        className="pk-pulse mt-1 inline-block h-2.5 w-2.5 shrink-0 rounded-full bg-primary"
        aria-hidden
      />
      <div>
        <p className="text-sm font-semibold text-foreground">Syncing…</p>
        <p className="mt-1 text-sm text-muted">{message}</p>
      </div>
    </div>
  );
}
