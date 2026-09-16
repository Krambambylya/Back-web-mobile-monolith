'use client';

import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Panel } from '@/components/ui/panel';

type PairingCodeDisplayProps = {
  code: string | null;
  expiresAt?: string | null;
  onRefresh?: () => void;
  refreshing?: boolean;
  cooldownUntil?: number | null;
};

const formatRemaining = (ms: number): string => {
  const totalSec = Math.max(0, Math.ceil(ms / 1000));
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
};

const formatCode = (code: string): string => {
  const digits = code.replace(/\D/g, '').padStart(6, '0').slice(0, 6);
  return `${digits.slice(0, 3)} ${digits.slice(3)}`;
};

export function PairingCodeDisplay({
  code,
  expiresAt,
  onRefresh,
  refreshing,
  cooldownUntil = null,
}: PairingCodeDisplayProps) {
  const [now, setNow] = useState(() => Date.now());

  const cooldownMs = cooldownUntil ? Math.max(0, cooldownUntil - now) : 0;
  const inCooldown = cooldownMs > 0;
  const expiryMs = expiresAt ? new Date(expiresAt).getTime() : null;
  const expired = Boolean(code && expiryMs != null && expiryMs <= now);

  useEffect(() => {
    if (!inCooldown && !expired && expiryMs == null) return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [inCooldown, expired, expiryMs]);

  return (
    <Panel as="section">
      <p className="text-center text-sm font-medium text-muted">Code for another device</p>

      {code ? (
        <p
          className={`mt-4 text-center font-mono text-4xl font-semibold tracking-[0.28em] sm:text-5xl ${
            expired ? 'text-muted-2' : 'text-ink'
          }`}
          aria-label={`Code ${code}`}
        >
          {formatCode(code)}
        </p>
      ) : (
        <p className="mt-4 text-center text-base font-semibold text-muted">No active code</p>
      )}

      {expired ? (
        <p className="mt-3 text-center text-sm font-medium text-destructive">
          Code expired — refresh it
        </p>
      ) : null}

      {onRefresh ? (
        <Button
          variant="secondary"
          disabled={refreshing || inCooldown}
          onClick={onRefresh}
          className="mt-4 w-full"
        >
          {inCooldown
            ? `Too many attempts — ${formatRemaining(cooldownMs)}`
            : refreshing
              ? 'Refreshing…'
              : 'Refresh code'}
        </Button>
      ) : null}
    </Panel>
  );
}
