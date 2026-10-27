import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../../locales/useLanguage';
import { useAuthStore } from '../store/useAuthStore';

import { Button } from '@/components/ui/button';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Icons } from '@/components/ui/icons';

export function RegisterForm() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const authErrorKey = useAuthStore((state) => state.authErrorKey);
  const clearError = useAuthStore((state) => state.clearError);

  const { t } = useLanguage();
  const register = useAuthStore((state) => state.register);
  const navigate = useNavigate();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    clearError();

    try {
      setIsSubmitting(true);
      await register({ username, email, password });
      const state = useAuthStore.getState();
      if (!state.authErrorKey && state.isAuthenticated) {
        navigate('/lobby', { replace: true });
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  const errorRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (authErrorKey && errorRef.current) {
      errorRef.current.focus();
    }
  }, [authErrorKey]);

  return (
    <form onSubmit={handleSubmit} className="mx-auto w-full max-w-sm">
      {/* Header of the Form */}
      <div className="mb-6">
        <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
          {t('auth.register.heading') || 'Join to enjoy the game!'}{' '}
        </h2>
        <p className="mt-1 text-sm text-zinc-400">
          {t('auth.register.subheading') || 'Sign up to start playing.'}{' '}
        </p>
      </div>

      {authErrorKey && (
        <div
          ref={errorRef}
          tabIndex={-1}
          role="alert"
          aria-live="polite"
          className="mb-4 flex items-center justify-center rounded-xl bg-white p-2.5 text-center text-xs font-semibold text-orange-500"
        >
          <span>{t(authErrorKey)}</span>
        </div>
      )}

      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="register-username">
            {t('auth.register.newUser') || 'New User'}
          </FieldLabel>
          <Input
            id="register-username"
            className="h-10"
            type="text"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder={
              t('auth.register.userPlaceholder') || 'Enter your username'
            }
            required
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="register-email">
            {t('auth.register.email') || 'Email'}
          </FieldLabel>
          <Input
            id="register-email"
            className="h-10"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={
              t('auth.register.emailPlaceholder') || 'Enter your email'
            }
            required
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="register-password">
            {t('auth.register.password') || 'Password'}
          </FieldLabel>
          <Input
            id="register-password"
            className="h-10"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t('auth.register.passwordPlaceholder') || '********'}
            required
          />
        </Field>

        <Field orientation="horizontal" className="mt-2">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-10 w-full bg-orange-600 hover:bg-orange-800"
          >
            {isSubmitting
              ? t('auth.register.connecting') || 'Registering...'
              : t('auth.register.playNow') || 'Registered'}
          </Button>
        </Field>
      </FieldGroup>

      {/* Separator */}
      <div className="relative my-5 flex items-center">
        <div className="grow border-t border-zinc-800" />
        <span className="mx-3 shrink text-sm text-zinc-500 uppercase">
          {t('auth.login.orContinueWith') || 'or continue with'}
        </span>
        <div className="grow border-t border-zinc-800" />
      </div>

      {/* Google OAuth */}
      <button
        type="button"
        onClick={() => {
          window.location.href = '/api/auth/google';
        }}
        className="hover:bg-zinc-750 flex h-10 w-full items-center justify-center gap-2.5 rounded-lg border border-zinc-700 bg-zinc-800/80 px-4 py-0 text-sm font-semibold text-white transition-all hover:border-zinc-600 active:scale-[0.99]"
      >
        <Icons.google className="h-4 w-4" viewBox="0 0 24 24" />
        <span>{t('auth.login.continueGoogle') || 'Continue with Google'}</span>
      </button>
    </form>
  );
}
