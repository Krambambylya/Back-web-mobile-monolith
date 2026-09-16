import type { SVGProps } from 'react';

type PairkitMarkProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export function PairkitMark({ size = 36, className, ...props }: PairkitMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      aria-hidden
      className={className}
      {...props}
    >
      <rect width="36" height="36" rx="10" fill="var(--color-surface-2)" />
      <circle cx="12" cy="18" r="4" fill="var(--color-primary)" />
      <circle cx="24" cy="18" r="4" fill="var(--color-accent-soft)" />
      <path d="M16 18h4" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
