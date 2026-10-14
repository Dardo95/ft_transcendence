import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../locales/useLanguage';
import { useAuthStore } from '../features/auth/store/useAuthStore';

import { LoginForm } from '../features/auth/components/LoginForm';
import { RegisterForm } from '../features/auth/components/RegisterForm';

export function LandingPage() {
  const { t } = useLanguage();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login');
  const { isAuthenticated, isLoading } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    // If the session is active and not loading, redirect to the lobby
    if (!isLoading && isAuthenticated) {
      navigate('/lobby', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  return (
    <div className="relative flex min-h-screen flex-col justify-between overflow-hidden bg-slate-950 text-slate-100 select-none">
      {/* Effect of rising cooking vapor from the background */}
      <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-orange-500/10 via-transparent to-transparent blur-2xl" />

      {/* Central Zone */}
      <main className="z-10 flex grow flex-col items-center justify-center px-4 text-center">
        <div className="mb-3 flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-xs font-semibold tracking-wider text-amber-500 uppercase">
          <span>{t('app.upTitle') || 'Arcade Multiplayer Webgame inspired by Bomberman'}</span>
        </div>

        <h1 className="mb-4 bg-linear-to-r from-orange-400 via-amber-200 to-orange-500 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent drop-shadow-md md:text-7xl">
          {t('app.title') || 'Kitchen Mayhem'}
        </h1>

        <p className="mb-10 max-w-md text-sm text-zinc-400 md:text-base">
          {t('app.subTitle') ||
            'High cuisine, destruction, pressure cookers and unleashed steam. Register or log in to access the service.'}
        </p>

        {/* Central Button with Pulse Ring Aura */}
        <button
          onClick={() => setIsAuthModalOpen(true)}
          className="group relative rounded-xl bg-linear-to-r from-orange-600 to-amber-600 px-8 py-4 text-lg font-bold text-white shadow-xl shadow-orange-600/30 transition-all duration-300 hover:scale-105 active:scale-95"
        >
          {/* Pulse Ring Aura */}
          <span className="absolute -inset-1 animate-pulse rounded-xl bg-orange-500/40 blur-md group-hover:bg-orange-500/60" />
          <span className="relative flex items-center gap-3">
            <span>{t('app.enterButton') || 'Enter the Kitchen'}</span>
          </span>
        </button>
      </main>

      {/* Auth Modal (dialog with backdrop blur) */}
      {isAuthModalOpen && (
        <div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm duration-200">
          <div className="relative w-full max-w-md rounded-2xl border border-zinc-700 bg-zinc-900 p-6 shadow-2xl">
            {/* Close modal button */}
            <button
              onClick={() => setIsAuthModalOpen(false)}
              className="absolute top-4 right-4 text-xl font-bold text-zinc-400 hover:text-white"
            >
              ✕
            </button>

            {/* Tabs: Log In / Register */}
            <div className="mb-6 flex border-b border-zinc-700">
              <button
                onClick={() => setAuthTab('login')}
                className={`flex-1 border-b-2 py-2 text-sm font-semibold transition-colors ${
                  authTab === 'login'
                    ? 'border-orange-500 text-orange-400'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {t('app.login') || 'Log In'}
              </button>
              <button
                onClick={() => setAuthTab('register')}
                className={`flex-1 border-b-2 py-2 text-sm font-semibold transition-colors ${
                  authTab === 'register'
                    ? 'border-orange-500 text-orange-400'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {t('app.register') || 'Register'}
              </button>
            </div>

            {/* Reactive forms */}
            <div className="mb-6">{authTab === 'login' ? <LoginForm /> : <RegisterForm />}</div>

            {/* Separator */}
            <div className="relative mb-4 flex items-center py-2">
              <div className="grow border-t border-zinc-700" />
              <span className="mx-4 shrink text-xs text-zinc-500 uppercase">
                {t('auth.login.orContinueWith') || 'Or continue with'}
              </span>
              <div className="grow border-t border-zinc-700" />
            </div>

            {/* Button for Google OAuth */}
            <button
              type="button"
              onClick={() => alert('Próximamente: Integración Google OAuth')}
              className="flex w-full items-center justify-center gap-3 rounded-lg border border-zinc-600 bg-zinc-800 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
                />
                <path
                  fill="#4285F4"
                  d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3 0-.8.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15.2s.7 5.5 1.9 7.9l3.7-2.9z"
                />
                <path
                  fill="#34A853"
                  d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16.5C3.7 20.2 7.5 23.5 12 23.5z"
                />
              </svg>
              <span>{t('auth.login.continueGoogle') || 'Continue with Google'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
