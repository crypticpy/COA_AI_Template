import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

const loadingButtonVariants = cva(
  [
    'inline-flex items-center justify-center',
    'font-medium rounded-md',
    'transition-colors duration-150',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'dark:focus:ring-offset-brand-dark-blue',
  ],
  {
    variants: {
      variant: {
        primary: [
          'bg-brand-blue text-white',
          'hover:bg-brand-dark-blue',
          'focus:ring-brand-blue',
        ],
        secondary: [
          'bg-white text-gray-700 border border-gray-300',
          'hover:bg-gray-50',
          'focus:ring-brand-blue',
          'dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600',
          'dark:hover:bg-gray-600',
        ],
        danger: [
          'bg-red-600 text-white',
          'hover:bg-red-700',
          'focus:ring-red-500',
          'dark:bg-red-700 dark:hover:bg-red-800',
        ],
      },
      size: {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface LoadingButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof loadingButtonVariants> {
  loading?: boolean;
  loadingText?: string;
  asChild?: boolean;
}

/**
 * Button component with built-in loading state
 */
export const LoadingButton = React.forwardRef<HTMLButtonElement, LoadingButtonProps>(
  (
    {
      className,
      variant,
      size,
      loading = false,
      loadingText,
      disabled,
      children,
      asChild = false,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';
    const isDisabled = disabled || loading;

    const buttonContent = loading ? (
      <>
        <Loader2
          className={cn(
            'animate-spin',
            size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4',
            (loadingText || children) && 'mr-2'
          )}
          aria-hidden="true"
        />
        {loadingText ?? children}
      </>
    ) : (
      children
    );

    return (
      <Comp
        ref={ref}
        className={cn(loadingButtonVariants({ variant, size }), className)}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        aria-busy={loading}
        {...props}
      >
        {buttonContent}
      </Comp>
    );
  }
);

LoadingButton.displayName = 'LoadingButton';

export { loadingButtonVariants };
export default LoadingButton;
