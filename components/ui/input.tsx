import React from 'react';
import { cn } from '@/lib/cn';

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'h-10 w-full rounded-xl border border-border bg-card px-3 text-sm outline-none transition placeholder:text-foreground/40 focus:ring-2 focus:ring-primary/25',
        className
      )}
      {...props}
    />
  );
}
