import React from 'react';
import { cn } from '@/lib/utils';
import { Priority } from '@/types/task';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | Priority;
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        {
          'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300': variant === 'default',
          'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300': variant === 'High',
          'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300':
            variant === 'Medium',
          'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300': variant === 'Low',
        },
        className
      )}
    >
      {children}
    </span>
  );
}
