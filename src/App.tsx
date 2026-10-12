import { AppProviders } from '@/app/AppProviders';
import { AppRoutes } from '@/app/router';

export function App() {
  return (
    <AppProviders>
      <AppRoutes />
    </AppProviders>
  );
}
