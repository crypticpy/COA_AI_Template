import React from 'react';
import { RefreshCw, AlertCircle, WifiOff } from 'lucide-react';

export interface ErrorBoundaryProps {
  children: React.ReactNode;
  onRetry?: () => void;
  fallback?: React.ReactNode;
  errorMessage?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  isRetrying: boolean;
}

const isChunkLoadError = (error: Error | null): boolean => {
  if (!error) return false;
  const errorMessage = error.message?.toLowerCase() || '';
  return (
    errorMessage.includes('loading chunk') ||
    errorMessage.includes('failed to fetch dynamically imported module') ||
    errorMessage.includes('failed to load module script')
  );
};

/**
 * Error Boundary Component
 * Catches JavaScript errors and displays a fallback UI with retry support
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, isRetrying: false };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleRetry = () => {
    const { onRetry } = this.props;
    this.setState({ isRetrying: true });
    this.setState({ hasError: false, error: null, isRetrying: false }, () => {
      onRetry?.();
    });
  };

  render() {
    const { children, onRetry, fallback, errorMessage } = this.props;
    const { hasError, error, isRetrying } = this.state;

    if (hasError) {
      if (fallback) return <>{fallback}</>;

      const isChunkError = isChunkLoadError(error);
      const Icon = isChunkError ? WifiOff : AlertCircle;
      const title = isChunkError ? 'Failed to load page' : 'Something went wrong';
      const description = errorMessage || (isChunkError
        ? 'There was a network problem loading this page. Please check your connection and try again.'
        : 'An unexpected error occurred. Please try refreshing the page.');

      return (
        <div className="p-6 border border-red-300 dark:border-red-700 rounded-lg bg-red-50 dark:bg-red-900/20">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 p-2 rounded-full bg-red-100 dark:bg-red-800/40">
              <Icon className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-semibold text-red-700 dark:text-red-300">
                {title}
              </h2>
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {description}
              </p>

              {onRetry && (
                <button
                  onClick={this.handleRetry}
                  disabled={isRetrying}
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RefreshCw className={`h-4 w-4 ${isRetrying ? 'animate-spin' : ''}`} />
                  {isRetrying ? 'Retrying...' : 'Try Again'}
                </button>
              )}
            </div>
          </div>
        </div>
      );
    }

    return children;
  }
}
