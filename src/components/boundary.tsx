import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import Error from './error';

type BoundaryProps = {
  children: React.ReactNode;
  fallback: React.ReactNode;
  errorFallback?: React.ReactNode;
};

const Boundary = ({ children, fallback, errorFallback }: BoundaryProps) => {
  return (
    <ErrorBoundary fallback={errorFallback ?? <Error />}>
      <Suspense fallback={fallback}>{children}</Suspense>
    </ErrorBoundary>
  );
};

export default Boundary;
