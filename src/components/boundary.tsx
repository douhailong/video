import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import Error from './error';

type BoundaryProps = {
  children: ReactNode;
  fallback: ReactNode;
  errorFallback?: ReactNode;
};

const Boundary = ({ children, fallback, errorFallback }: BoundaryProps) => {
  return (
    <ErrorBoundary fallback={errorFallback ?? <Error />}>
      <Suspense fallback={fallback}>{children}</Suspense>
    </ErrorBoundary>
  );
};

export default Boundary;
