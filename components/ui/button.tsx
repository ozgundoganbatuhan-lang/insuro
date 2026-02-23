import React from 'react';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

const base =
  'inline-flex items-center justify-center rounded-xl font-medium transition focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50 disabled:pointer-events-none';
const variants: Record<Variant, string> = {
  primary: 'bg-primary text-primary-foreground hover:brightness-95 shadow-soft',
  secondary: 'bg-card text-foreground border border-border hover:bg-background',
  ghost: 'bg-transparent text-foreground hover:bg-background',
  danger: 'bg-danger text-white hover:brightness-95'
};
const sizes: Record<Size, string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-11 px-5 text-base'
};

export function Button({
  className,
  variant = 'primary',
  size = 'md',
  asChild,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  asChild?: boolean;
  children?: React.ReactNode;
}) {
  const classes = cn(base, variants[variant], sizes[size], className);

  if (asChild) {
    const child = React.Children.only(children) as React.ReactElement<any>;
    return React.cloneElement(child, {
      className: cn(child.props?.className, classes)
    });
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
