import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../locales/useLanguage';
import { useAuthStore } from '../features/auth/store/useAuthStore';

import { LoginForm } from '../features/auth/components/LoginForm';
import { RegisterForm } from '../features/auth/components/RegisterForm';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UI } from '@/components/layout/layoutStyles';

import logoUrl from '../assets/ui_logo.svg';
import backgroundImage from '../assets/ui_login_bg.svg';

export function LandingPage() {
  const { t } = useLanguage();
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login');
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isAuthChecked = useAuthStore((state) => state.isAuthChecked);
  const authErrorKey = useAuthStore((state) => state.authErrorKey);
  const navigate = useNavigate();

  useEffect(() => {
    if (authErrorKey) return;
    if (isAuthChecked && isAuthenticated) {
      navigate('/lobby', { replace: true });
    }
  }, [isAuthenticated, isAuthChecked, navigate, authErrorKey]);

  return (
    <div
      className="text-foreground relative flex h-full w-full flex-col justify-between overflow-x-hidden font-sans select-none"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Main content area: Responsive 2-column layout on full screen, stacked on split screen */}
      <main className="z-10 flex flex-1 items-center justify-center px-4 py-8 md:px-8 lg:px-12">
        <div className="grid w-full max-w-6xl grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-8">
          {/* Left side: Branding, Logo and Motto */}
          <div className="flex flex-col items-center text-center lg:col-span-7 lg:items-start lg:text-left">
            {/* Logo */}
            <div className="relative mb-4 flex w-full items-center justify-center">
              <img
                src={logoUrl}
                alt="ft_bomberman Logo"
                className="h-28 w-auto object-contain sm:h-36 lg:h-44"
              />
            </div>

            {/* Subtitle / Battle Badge */}
            <div className={UI.badge.header}>
              <span className="text-primary">❖</span>
              <span>
                {t('app.general.battlefield') ||
                  'LA COCINA ES UN CAMPO DE BATALLA'}
              </span>
              <span className="text-primary">❖</span>
            </div>

            <p className={`${UI.text.pageSubtitle} lg:mx-0`}>
              {t('app.general.subTitle') ||
                'Fine cuisine, destruction, pressure cookers, and unleashed steam. Sign up or log in to enter the service.'}
            </p>
          </div>

          {/* Right side: Floating card with Tabs and Forms */}
          <div className="w-full lg:col-span-5">
            <Card className="mx-auto w-full max-w-md p-6 sm:p-8">
              <div className="mb-6 flex pb-1">
                <button
                  type="button"
                  onClick={() => {
                    setAuthTab('login');
                    useAuthStore.getState().clearError();
                  }}
                  className={`${UI.btn.tab} ${
                    authTab === 'login' ? UI.btn.tabActive : UI.btn.tabInactive
                  }`}
                >
                  {t('auth.login.tab') || 'Log in'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthTab('register');
                    useAuthStore.getState().clearError();
                  }}
                  className={`${UI.btn.tab} ${
                    authTab === 'register'
                      ? UI.btn.tabActive
                      : UI.btn.tabInactive
                  }`}
                >
                  {t('auth.register.tab') || 'Create account'}
                </button>
              </div>

              {/* Render of Forms */}
              <div className="w-full">
                {authTab === 'login' ? (
                  <LoginForm key="login" />
                ) : (
                  <RegisterForm key="register" />
                )}
              </div>

              {/* Inferior Link Switch */}
              <div className="text-muted-foreground mt-5 text-center text-sm">
                {authTab === 'login' ? (
                  <>
                    {t('auth.login.noAccount') || "Don't have an account?"}{' '}
                    <Button
                      type="button"
                      variant="link"
                      onClick={() => {
                        setAuthTab('register');
                        useAuthStore.getState().clearError();
                      }}
                      className={UI.btn.link}
                    >
                      {t('auth.login.registerInstead') || 'Sign up'}
                    </Button>
                  </>
                ) : (
                  <>
                    {t('auth.register.alreadyHaveAccount') ||
                      'Already have an account?'}
                    <Button
                      type="button"
                      variant="link"
                      onClick={() => {
                        setAuthTab('login');
                        useAuthStore.getState().clearError();
                      }}
                      className={UI.btn.link}
                    >
                      {t('auth.register.loginInstead') || 'Log in'}
                    </Button>
                  </>
                )}
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
