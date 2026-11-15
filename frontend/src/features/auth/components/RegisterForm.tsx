import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MailIcon, UserIcon } from 'lucide-react';
import { useLanguage } from '../../../locales/useLanguage';
import { useAuthStore } from '../store/useAuthStore';

import { Button } from '@/components/ui/button';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Icons } from '@/components/ui/icons';
import { UI } from '@/components/layout/layoutStyles';
import { PasswordInput } from './PasswordInput';

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
        <h2 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">
          {t('auth.register.heading') || 'Join to enjoy the game!'}{' '}
        </h2>
        <p className="text-muted-foreground mt-1 text-sm">
          {t('auth.register.subheading') || 'Sign up to start playing.'}{' '}
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
          <FieldLabel htmlFor="register-username">
            {t('auth.register.newUser') || 'New User'}
          </FieldLabel>
          <div className="relative">
            <UserIcon
              className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2"
              aria-hidden="true"
            />
            <Input
              id="register-username"
              className="h-10 pl-9"
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={
                t('auth.register.userPlaceholder') || 'Enter your username'
              }
              required
            />
          </div>
        </Field>

        <Field>
          <FieldLabel htmlFor="register-email">
            {t('auth.register.email') || 'Email'}
          </FieldLabel>
          <div className="relative">
            <MailIcon
              className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2"
              aria-hidden="true"
            />
            <Input
              id="register-email"
              className="h-10 pl-9"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={
                t('auth.register.emailPlaceholder') || 'Enter your email'
              }
              required
            />
          </div>
        </Field>

        <Field>
          <FieldLabel htmlFor="register-password">
            {t('auth.register.password') || 'Password'}
          </FieldLabel>
          <PasswordInput
            id="register-password"
            value={password}
            onChange={setPassword}
            autoComplete="new-password"
            placeholder={t('auth.register.passwordPlaceholder') || '********'}
          />
        </Field>

        <Field orientation="horizontal" className="mt-2">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-10 w-full cursor-pointer"
          >
            {isSubmitting
              ? t('auth.register.connecting') || 'Registering...'
              : t('auth.register.playNow') || 'Registered'}
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
