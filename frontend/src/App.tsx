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

import { lazy, Suspense, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './features/auth/store/useAuthStore';

import { DynamicLayout } from './components/layout/DynamicLayout';
import { ProtectedRoute } from './components/layout/guards/ProtectedRoute';
import { PublicOnlyRoute } from './components/layout/guards/PublicOnlyRoute';

import { AppLayout } from './components/layout/private/AppLayout';
import { AppLayoutPublic } from './components/layout/public/AppLayoutPublic';

// Route-level code splitting keeps the initial bundle below Vite's chunk-size
// warning threshold and only downloads the page the user actually visits.
const LandingPage = lazy(() =>
  import('./pages/LandingPage').then((module) => ({
    default: module.LandingPage,
  }))
);
const LobbyPage = lazy(() =>
  import('./pages/LobbyPage').then((module) => ({
    default: module.LobbyPage,
  }))
);
const GamePage = lazy(() =>
  import('./pages/GamePage').then((module) => ({
    default: module.GamePage,
  }))
);
const ProfilePage = lazy(() =>
  import('./pages/ProfilePage').then((module) => ({
    default: module.ProfilePage,
  }))
);
const StatsPage = lazy(() =>
  import('./pages/StatsPage').then((module) => ({
    default: module.StatsPage,
  }))
);
const RulesPage = lazy(() =>
  import('./pages/RulesPage').then((module) => ({
    default: module.RulesPage,
  }))
);
const AboutUsPage = lazy(() =>
  import('./pages/AboutUsPage').then((module) => ({
    default: module.AboutUsPage,
  }))
);
const ProjectPage = lazy(() =>
  import('./pages/ProjectPage').then((module) => ({
    default: module.ProjectPage,
  }))
);
const TermsPage = lazy(() =>
  import('./pages/TermsPage').then((module) => ({
    default: module.TermsPage,
  }))
);
const PrivacyPage = lazy(() =>
  import('./pages/PrivacyPage').then((module) => ({
    default: module.PrivacyPage,
  }))
);
const NotFoundPage = lazy(() =>
  import('./pages/NotFoundPage').then((module) => ({
    default: module.NotFoundPage,
  }))
);

export default function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    void checkAuth().finally(() => setReady(true));
  }, [checkAuth]);

  if (!ready) {
    return <div className="fixed inset-0 bg-slate-950" />;
  }

  return (
    <BrowserRouter>
      <Suspense fallback={<div className="fixed inset-0 bg-slate-950" />}>
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
              <Route path="/profile/:username" element={<ProfilePage />} />
              <Route path="/stats" element={<StatsPage />} />
              <Route path="/game/:id?" element={<GamePage />} />
            </Route>
          </Route>

          {/* 404 Not Found */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
