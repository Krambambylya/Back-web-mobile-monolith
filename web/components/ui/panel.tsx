import type { HTMLAttributes } from 'react';

type PanelProps = HTMLAttributes<HTMLElement> & {
  as?: 'div' | 'section' | 'aside' | 'article';
};

export function Panel({ as: Tag = 'div', className = '', ...props }: PanelProps) {
  return (
    <Tag
      className={`rounded-lg border border-border bg-surface p-5 shadow-soft sm:p-6 ${className}`}
      {...props}
    />
  );
}
