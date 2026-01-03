import React from 'react';
import { cn } from '../lib/utils';

export interface PageLoadingSpinnerProps {
  message?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

function getSpinnerSizeClasses(size: 'sm' | 'md' | 'lg'): string {
  const sizeMap = {
    sm: 'h-16 w-16',
    md: 'h-24 w-24',
    lg: 'h-32 w-32',
  };
  return sizeMap[size];
}

/**
 * Full-page loading spinner for Suspense fallbacks
 */
export function PageLoadingSpinner({
  message,
  className,
  size = 'lg',
}: PageLoadingSpinnerProps) {
  return (
    <div
      className={cn(
        'min-h-screen flex flex-col items-center justify-center',
        'bg-brand-faded-white dark:bg-brand-dark-blue',
        'transition-colors',
        className
      )}
      role="status"
      aria-label={message || 'Loading'}
      aria-live="polite"
    >
      <div
        className={cn(
          'animate-spin rounded-full border-b-2 border-brand-blue',
          getSpinnerSizeClasses(size)
        )}
        aria-hidden="true"
      />
      {message && (
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          {message}
        </p>
      )}
      <span className="sr-only">{message || 'Loading page content...'}</span>
    </div>
  );
}

export default PageLoadingSpinner;
