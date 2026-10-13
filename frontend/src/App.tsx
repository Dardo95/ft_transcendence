/**
 * Application root component.
 * Category: Application
 *
 * Responsible for:
 * - Defining the main application structure.
 * - Registering global providers and application-level components.
 * - Defining the main routing structure.
 *
 * Does not:
 * - Contain business logic.
 * - Perform API requests directly.
 * - Manage feature-specific state.
 */

import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './features/auth/store/useAuthStore';

import { AppLayout } from './components/layout/AppLayout';
import { AppLayoutPublic } from './components/layout/AppLayoutPublic';
import { DynamicLayout } from './components/layout/DynamicLayout';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { PublicOnlyRoute } from './components/layout/PublicOnlyRoute';

import { LandingPage } from './pages/LandingPage';
import { LobbyPage } from './pages/LobbyPage';
import { GamePage } from './pages/GamePage';
import { ProfilePage } from './pages/ProfilePage';
import { StatsPage } from './pages/StatsPage';
import { RulesPage } from './pages/RulesPage';
import { AboutUsPage } from './pages/AboutUsPage';
import { ProjectPage } from './pages/ProjectPage';
import { TermsPage } from './pages/TermsPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { NotFoundPage } from './pages/NotFoundPage';

// export default function App() {
// 	return (
// 		<BrowserRouter>
// 			<Routes>
// 				{/* Ruta principal y pública al Entrypoint */}
// 				<Route path="/login" element={<LandingPage />} />
// 				<Route path="/" element={<Navigate to="/login" replace />} />

// 				{/* Rutas con AppLayout (Header + Outlet + Footer) */}
// 				<Route element={<AppLayout />}>
// 					{/* Aquí irán /rules, /about-us, /project, /lobby, etc. */}
// 				</Route>
// 			</Routes>
// 		</BrowserRouter>
// 	);
// }

export default function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Group 1: Entrypoint (only accessible if NOT logged in) */}
        <Route element={<PublicOnlyRoute />}>
          <Route element={<AppLayoutPublic />}>
            <Route path="/login" element={<LandingPage />} />
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Route>
        </Route>

        {/* Group 2: Shared pages (DynamicLayout: uses AppLayout if logged in, or AppLayoutPublic if not logged in) */}
        <Route element={<DynamicLayout />}>
          <Route path="/rules" element={<RulesPage />} />
          <Route path="/about-us" element={<AboutUsPage />} />
          <Route path="/project" element={<ProjectPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
        </Route>

        {/* Group 3: Private pages (Mandatory login; use AppLayout with normal Header and Footer) */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/lobby" element={<LobbyPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/stats" element={<StatsPage />} />
            <Route path="/game/:id" element={<GamePage />} />
          </Route>
        </Route>

        {/* 404 Not Found */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

// export default function App() {
// 	return (
// 		<AppLayout>
// 			<LoginForm />
// 			<RegisterForm />
// 			<AuthStatus />
// 		</AppLayout>
// 	);
// }
