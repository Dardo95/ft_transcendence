import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../features/auth/store/useAuthStore';
import { useLanguage } from '../../locales/useLanguage';

export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuthStore();
  const { t } = useLanguage();

  if (isLoading) {
    return (
      <div className="flex min-h-screen animate-pulse items-center justify-center font-bold text-orange-400">
        {t('app.preparing') || 'Preparing the kitchen...'}
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // console.log('Guard status:', { isAuthenticated, isLoading });

  return <Outlet />;
}
