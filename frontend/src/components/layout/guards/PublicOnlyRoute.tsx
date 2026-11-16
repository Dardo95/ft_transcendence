import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../../features/auth/store/useAuthStore';

export function PublicOnlyRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isAuthChecked = useAuthStore((state) => state.isAuthChecked);
  const authErrorKey = useAuthStore((state) => state.authErrorKey);

  if (!isAuthChecked && !authErrorKey) {
    return <div className="bg-background fixed inset-0" />;
  }

  if (isAuthenticated) {
    return <Navigate to="/lobby" replace />;
  }

  return <Outlet />;
}
