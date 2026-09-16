import Link from 'next/link';
import { forwardRef, type ComponentProps } from 'react';

const base =
  'inline-flex cursor-pointer items-center transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50';

const variants = {
  primary:
    'min-h-11 justify-center rounded-md bg-primary px-5 text-sm font-semibold text-on-primary hover:bg-primary-pressed',
  secondary:
    'min-h-11 justify-center rounded-md border border-border bg-surface px-5 text-sm font-semibold text-foreground hover:bg-surface-2',
  ghost:
    'min-h-11 justify-center rounded-md px-5 text-sm font-semibold text-muted hover:text-foreground',
  text: 'h-auto min-h-0 justify-start rounded-none px-0 py-0 text-sm font-medium',
} as const;

export type ButtonVariant = keyof typeof variants;

function cx(variant: ButtonVariant, className = '') {
  return `${base} ${variants[variant]} ${className}`.trim();
}

type ButtonProps = ComponentProps<'button'> & {
  variant?: ButtonVariant;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', className = '', type = 'button', ...props },
  ref,
) {
  return <button ref={ref} type={type} className={cx(variant, className)} {...props} />;
});

type ButtonLinkProps = ComponentProps<typeof Link> & {
  variant?: ButtonVariant;
};

export function ButtonLink({ variant = 'primary', className = '', ...props }: ButtonLinkProps) {
  return <Link className={cx(variant, className)} {...props} />;
}
