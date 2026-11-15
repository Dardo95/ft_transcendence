import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MailIcon } from 'lucide-react';
import { useLanguage } from '../../../locales/useLanguage';
import { useAuthStore } from '../store/useAuthStore';

import { Button } from '@/components/ui/button';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Icons } from '@/components/ui/icons';
import { UI } from '@/components/layout/layoutStyles';
import { PasswordInput } from './PasswordInput';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const authErrorKey = useAuthStore((state) => state.authErrorKey);
  const clearError = useAuthStore((state) => state.clearError);

  const navigate = useNavigate();
  const { t } = useLanguage();
  const login = useAuthStore((state) => state.login);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    clearError();

    try {
      await login({ email, password });
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
        <h2 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">
          {t('auth.login.heading') || 'Welcome back!'}{' '}
        </h2>
        <p className="text-muted-foreground mt-1 text-sm">
          {t('auth.login.subheading') || 'Log in to return to the game.'}{' '}
        </p>
      </div>

      {authErrorKey && (
        <div
          ref={errorRef}
          tabIndex={-1}
          role="alert"
          aria-live="polite"
          className={`mb-4 flex items-center justify-center text-center font-semibold ${UI.feedback.error}`}
        >
          <span>{t(authErrorKey)}</span>
        </div>
      )}

      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="login-email">
            {t('auth.login.email') || 'Email'}
          </FieldLabel>
          <div className="relative">
            <MailIcon
              className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2"
              aria-hidden="true"
            />
            <Input
              id="login-email"
              className="h-10 pl-9"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={
                t('auth.login.emailPlaceholder') || 'Enter your email'
              }
              required
            />
          </div>
        </Field>

        <Field>
          <FieldLabel htmlFor="login-password">
            {t('auth.login.password') || 'Password'}
          </FieldLabel>
          <PasswordInput
            id="login-password"
            value={password}
            onChange={setPassword}
            autoComplete="current-password"
            placeholder={t('auth.login.passwordPlaceholder') || '********'}
          />
        </Field>

        <Field orientation="horizontal" className="mt-2">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-10 w-full cursor-pointer"
          >
            {isSubmitting
              ? t('auth.login.connecting') || 'Connecting...'
              : t('auth.login.playNow') || 'Play Now'}
          </Button>
        </Field>
      </FieldGroup>

      {/* Separator */}
      <div className="relative my-5 flex items-center">
        <div className="border-border grow border-t" />
        <span className="text-muted-foreground mx-3 shrink text-sm uppercase">
          {t('auth.login.orContinueWith') || 'or continue with'}
        </span>
        <div className="border-border grow border-t" />
      </div>

      {/* Google OAuth */}
      <Button
        type="button"
        variant="outline"
        onClick={() => {
          window.location.href = '/api/auth/google';
        }}
        className="h-10 w-full gap-2.5 text-sm font-semibold"
      >
        <Icons.google className="h-4 w-4" viewBox="0 0 24 24" />
        <span>{t('auth.login.continueGoogle') || 'Continue with Google'}</span>
      </Button>
    </form>
  );
}
