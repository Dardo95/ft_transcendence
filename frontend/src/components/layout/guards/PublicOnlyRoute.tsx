import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../../features/auth/store/useAuthStore';
import { UI } from '@/components/layout/layoutStyles';

export function PublicOnlyRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isAuthChecked = useAuthStore((state) => state.isAuthChecked);
  const authErrorKey = useAuthStore((state) => state.authErrorKey);

  if (!isAuthChecked && !authErrorKey) {
    return <div className={UI.shell.bootScreen} />;
  }

  if (isAuthenticated) {
    return <Navigate to="/lobby" replace />;
  }

  return <Outlet />;
}
