import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../../locales/useLanguage';
import { useAuthStore } from '../store/useAuthStore';

import { Button } from '@/components/ui/button';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Icons } from '@/components/ui/icons';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const navigate = useNavigate();
  const { t } = useLanguage();
  const login = useAuthStore((state) => state.login);

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await login({ email, password });
      navigate('/lobby', { replace: true });
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : t('auth.errors.login') || 'Error at login'
      );
    } finally {
      setIsSubmitting(false);
    }
  }
  const errorRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (errorMessage && errorRef.current) {
      errorRef.current.focus();
    }
  }, [errorMessage]);

  return (
    <form onSubmit={handleSubmit} className="mx-auto w-full max-w-sm">
      {/* Header of the Form */}
      <div className="mb-6">
        <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
          {t('auth.login.heading') || 'Welcome back!'}{' '}
        </h2>
        <p className="mt-1 text-sm text-zinc-400">
          {t('auth.login.subheading') ||
            'Log in to return to the game.'}{' '}
        </p>
      </div>

      {errorMessage && (
        <div ref={errorRef}
        tabIndex={-1}
        className="mb-4 flex items-center justify-center gap-1.5 rounded-xl border border-red-700/80 bg-red-950/70 p-2.5 text-center text-xs text-red-300">
          <span>⚠️</span>
          <span>{errorMessage}</span>
        </div>
      )}

      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="login-email">
            {t('auth.login.email') || 'Email'}
          </FieldLabel>
          <Input
            id="login-email"
            className="h-10"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('auth.login.emailPlaceholder') || 'Enter your email'}
            required
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="login-password">
            {t('auth.login.password') || 'Password'}
          </FieldLabel>
          <Input
            id="login-password"
            className="h-10"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t('auth.login.passwordPlaceholder') || '********'}
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
              ? t('auth.login.connecting') || 'Connecting...'
              : t('auth.login.playNow') || 'Play Now'}
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
