import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../locales/useLanguage';
import { useAuthStore } from '../features/auth/store/useAuthStore';

import { LoginForm } from '../features/auth/components/LoginForm';
import { RegisterForm } from '../features/auth/components/RegisterForm';

import logoUrl from '../assets/logo.png';

export function LandingPage() {
  const { t } = useLanguage();
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login');
  const { isAuthenticated, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate('/lobby', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  return (
    <div className="relative flex min-h-screen w-full flex-col justify-between overflow-x-hidden bg-slate-950 font-sans text-slate-100 select-none">
      <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-orange-600/10 via-transparent to-transparent blur-3xl" />
      <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-orange-500/10 blur-[120px]" />

      {/* Main content area: Responsive 2-column layout on full screen, stacked on split screen */}
      <main className="z-10 flex flex-1 items-center justify-center px-4 py-8 md:px-8 lg:px-12">
        <div className="grid w-full max-w-6xl grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-8">
          {/* Left side: Branding, Logo and Motto */}
          <div className="flex flex-col items-center text-center lg:col-span-7 lg:items-start lg:text-left">
            {/* Logo */}
            <div className="relative mb-4 flex items-center justify-center">
              <img
                src={logoUrl}
                alt="ft_bomberman Logo"
                className="h-28 w-auto object-contain drop-shadow-[0_10px_20px_rgba(249,115,22,0.3)] sm:h-36 lg:h-44"
              />
            </div>

<<<<<<< HEAD
            {/* Auth error banner inside the modal */}
            {error && (
              <div className="mb-4 flex items-center justify-center gap-1.5 rounded-xl border border-red-700/80 bg-red-950/70 p-2.5 text-center text-xs text-red-300 cursor-pointer">
                <span>⚠️</span>
                <span onClick={() => clearError()}>{error}</span>
              </div>
            )}

            {/* Reactive forms */}
            <div className="mb-6">
              {authTab === 'login' ? <LoginForm /> : <RegisterForm />}
            </div>

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
=======
            {/* Subtitle / Battle Badge */}
            <div className="mb-3 flex items-center gap-2 text-sm font-black tracking-widest text-orange-400 uppercase sm:text-base">
              <span className="text-orange-500">❖</span>
>>>>>>> main
              <span>
                {t('app.battlefield') || 'LA COCINA ES UN CAMPO DE BATALLA'}
              </span>
              <span className="text-orange-500">❖</span>
            </div>

            <p className="max-w-md text-xs font-medium text-zinc-400 sm:text-sm">
              {t('app.subTitle') ||
                'Alta cocina, destrucción, ollas a presión y vapor desatado. Regístrate o inicia sesión para entrar al servicio.'}
            </p>
          </div>

          {/* Right side: Floating card with Tabs and Forms */}
          <div className="w-full lg:col-span-5">
            <div className="mx-auto w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6 shadow-2xl backdrop-blur-md sm:p-8">
              <div className="mb-6 flex border-b border-zinc-800 pb-1">
                <button
                  type="button"
                  onClick={() => setAuthTab('login')}
                  className={`relative flex-1 pb-3 text-xs font-bold transition-all sm:text-sm ${
                    authTab === 'login'
                      ? 'text-orange-400 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-orange-500'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {t('auth.login.tab') || 'Iniciar sesión'}
                </button>
                <button
                  type="button"
                  onClick={() => setAuthTab('register')}
                  className={`relative flex-1 pb-3 text-xs font-bold transition-all sm:text-sm ${
                    authTab === 'register'
                      ? 'text-orange-400 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-orange-500'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {t('auth.register.tab') || 'Crear cuenta'}
                </button>
              </div>

              {/* Render of Forms */}
              <div className="w-full">
                {authTab === 'login' ? <LoginForm /> : <RegisterForm />}
              </div>

              {/* Inferior Link Switch */}
              <div className="mt-5 text-center text-xs text-zinc-500">
                {authTab === 'login' ? (
                  <>
                    {t('auth.login.noAccount') || '¿No tienes cuenta?'}{' '}
                    <button
                      type="button"
                      onClick={() => setAuthTab('register')}
                      className="font-semibold text-orange-400 hover:text-orange-300 hover:underline"
                    >
                      {t('auth.login.registerInstead') || 'Regístrate'}
                    </button>
                  </>
                ) : (
                  <>
                    {t('auth.register.alreadyHaveAccount') ||
                      '¿Ya tienes cuenta?'}
                    <button
                      type="button"
                      onClick={() => setAuthTab('login')}
                      className="font-semibold text-orange-400 hover:text-orange-300 hover:underline"
                    >
                      {t('auth.register.loginInstead') || 'Inicia sesión'}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
