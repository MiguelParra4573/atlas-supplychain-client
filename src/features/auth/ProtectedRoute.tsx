import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuth } from './auth-context';
import { FullPageSpinner } from '@/shared/ui/FullPageSpinner';

/** Deja pasar solo con sesión; si no, manda al login recordando a dónde iba. */
export function ProtectedRoute() {
  const { status } = useAuth();
  const location = useLocation();

  if (status === 'loading') return <FullPageSpinner label="Restaurando sesión…" />;
  if (status === 'anonymous') {
    return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />;
  }
  return <Outlet />;
}
