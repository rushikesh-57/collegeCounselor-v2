import { Suspense } from 'react';
import AppProviders from './AppProviders.jsx';
import AppRouter from './router.jsx';
import PageSkeleton from '../shared/ui/PageSkeleton.jsx';
import { AppErrorBoundary } from '../shared/ui/AppErrorBoundary.jsx';

export default function App() {
  return (
    <AppErrorBoundary>
      <AppProviders>
        <Suspense fallback={<PageSkeleton />}>
          <AppRouter />
        </Suspense>
      </AppProviders>
    </AppErrorBoundary>
  );
}
