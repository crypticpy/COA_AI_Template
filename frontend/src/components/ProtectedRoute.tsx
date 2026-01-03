import React, { Suspense } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import { ErrorBoundary } from './ErrorBoundary';
import { PageLoadingSpinner } from './PageLoadingSpinner';

export interface ProtectedRouteProps {
  element: React.ReactNode;
  loadingMessage?: string;
  redirectTo?: string;
  withSuspense?: boolean;
}

/**
 * Protected Route Component
 * Combines authentication checking, Suspense, and error handling
 */
export function ProtectedRoute({
  element,
  loadingMessage,
  redirectTo = '/login',
  withSuspense = true,
}: ProtectedRouteProps) {
  const { user } = useAuthContext();

  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }

  const handleRetry = () => {
    // ErrorBoundary will reset and re-render
  };

  const content = withSuspense ? (
    <Suspense fallback={<PageLoadingSpinner message={loadingMessage} />}>
      {element}
    </Suspense>
  ) : (
    element
  );

  return (
    <ErrorBoundary onRetry={handleRetry}>
      {content}
    </ErrorBoundary>
  );
}

export default ProtectedRoute;
