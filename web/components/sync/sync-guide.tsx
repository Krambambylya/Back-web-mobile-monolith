'use client';

const STEPS = [
  'Create a workspace on one device',
  'Enter the 6-digit code on another',
  'Items sync across the workspace',
] as const;

export function SyncGuide() {
  return (
    <div className="flex flex-col gap-8 lg:sticky lg:top-[calc(var(--header-h)+1.5rem)]">
      <section>
        <h3 className="font-display text-lg font-semibold text-foreground">How it works</h3>
        <ol className="mt-5">
          {STEPS.map((text, index) => {
            const last = index === STEPS.length - 1;
            return (
              <li key={text} className="flex gap-4">
                <div className="flex w-10 shrink-0 flex-col items-center">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/40 bg-primary-muted font-mono text-sm text-accent-soft">
                    {index + 1}
                  </span>
                  {last ? null : <span className="w-px flex-1 bg-border-strong" aria-hidden />}
                </div>
                <p
                  className={`min-h-10 pt-2.5 text-sm leading-relaxed text-foreground ${
                    last ? 'pb-0' : 'pb-8'
                  }`}
                >
                  {text}
                </p>
              </li>
            );
          })}
        </ol>
      </section>
      <section className="rounded-lg border border-border bg-surface-2 p-4 shadow-soft">
        <p className="text-sm leading-relaxed text-foreground">
          <span className="font-semibold">Recovery key</span> is shown once. Save it before you
          close the tab.
        </p>
      </section>
    </div>
  );
}
