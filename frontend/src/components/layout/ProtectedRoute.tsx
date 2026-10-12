import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../features/auth/store/useAuthStore";
import { useLanguage } from "../../locales/useLanguage";

export function ProtectedRoute() {
	const { isAuthenticated, isLoading } = useAuthStore();
	const { t } = useLanguage();

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center text-orange-400 font-bold animate-pulse">
				{t("app.preparing") || "Preparing the kitchen..."}
			</div>
		);
	}

	if (!isAuthenticated) {
		return <Navigate to="/login" replace />;
	}

	// console.log('Guard status:', { isAuthenticated, isLoading });

	return <Outlet />;
}
