'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';

export type ConfirmOptions = {
  title: string;
  body?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
};

type ConfirmDialogProps = ConfirmOptions & {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({
  open,
  title,
  body,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  destructive = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const titleId = useId();
  const bodyId = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const node = dialogRef.current;
    if (!node) return;
    if (open) {
      if (!node.open) node.showModal();
      cancelRef.current?.focus();
    } else if (node.open) {
      node.close();
    }
  }, [open]);

  if (!open) return null;

  return (
    <dialog
      ref={dialogRef}
      className="fixed inset-0 z-50 m-auto w-[min(100%-2.5rem,28rem)] rounded-lg border border-border bg-surface p-5 text-foreground shadow-soft backdrop:bg-deep/80 backdrop:backdrop-blur-sm sm:p-6"
      aria-labelledby={titleId}
      aria-describedby={body ? bodyId : undefined}
      onCancel={event => {
        event.preventDefault();
        onCancel();
      }}
    >
      <h2
        id={titleId}
        className="font-display text-lg font-semibold tracking-tight text-foreground"
      >
        {title}
      </h2>
      {body ? (
        <p id={bodyId} className="mt-2 text-sm leading-relaxed text-muted">
          {body}
        </p>
      ) : null}
      <div className="mt-6 flex flex-wrap justify-end gap-2.5">
        <Button ref={cancelRef} variant="secondary" onClick={onCancel}>
          {cancelLabel}
        </Button>
        <Button
          variant="primary"
          className={
            destructive
              ? 'bg-destructive text-on-primary hover:bg-destructive hover:opacity-90'
              : ''
          }
          onClick={onConfirm}
        >
          {confirmLabel}
        </Button>
      </div>
    </dialog>
  );
}

type PendingConfirm = ConfirmOptions & {
  resolve: (ok: boolean) => void;
};

export function useConfirm() {
  const [pending, setPending] = useState<PendingConfirm | null>(null);

  const confirm = useCallback((options: ConfirmOptions) => {
    return new Promise<boolean>(resolve => {
      setPending({ ...options, resolve });
    });
  }, []);

  const close = useCallback(
    (ok: boolean) => {
      pending?.resolve(ok);
      setPending(null);
    },
    [pending],
  );

  const dialog = (
    <ConfirmDialog
      open={Boolean(pending)}
      title={pending?.title ?? ''}
      body={pending?.body}
      confirmLabel={pending?.confirmLabel}
      cancelLabel={pending?.cancelLabel}
      destructive={pending?.destructive}
      onConfirm={() => close(true)}
      onCancel={() => close(false)}
    />
  );

  return { confirm, dialog };
}
