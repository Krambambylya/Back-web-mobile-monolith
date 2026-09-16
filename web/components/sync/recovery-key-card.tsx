'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Panel } from '@/components/ui/panel';

type RecoveryKeyCardProps = {
  recoveryKey?: string | null;
};

export function RecoveryKeyCard({ recoveryKey }: RecoveryKeyCardProps) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    if (!recoveryKey) return;
    try {
      await navigator.clipboard.writeText(recoveryKey);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.alert('Could not copy');
    }
  };

  const onDownload = () => {
    if (!recoveryKey) return;
    const body = [
      'Pairkit workspace recovery key',
      '',
      'Keep this file somewhere safe. It is shown once.',
      '',
      recoveryKey,
      '',
    ].join('\n');
    const blob = new Blob([body], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pairkit-recovery-key.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Panel>
      <h3 className="font-display text-lg font-semibold text-foreground">Recovery key</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        Needed if you lose every paired device. Save it now — it is shown once.
      </p>

      {recoveryKey ? (
        <>
          <p className="mt-4 break-all rounded-md border border-border bg-deep px-3 py-3 font-mono text-sm tracking-wide text-ink">
            {recoveryKey}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button onClick={() => void onCopy()}>{copied ? 'Copied' : 'Copy'}</Button>
            <Button variant="secondary" onClick={onDownload}>
              Download .txt
            </Button>
          </div>
        </>
      ) : (
        <p className="mt-4 rounded-md border border-border bg-deep p-4 text-sm text-muted-2">
          Appears after you create a workspace on this device.
        </p>
      )}
    </Panel>
  );
}
