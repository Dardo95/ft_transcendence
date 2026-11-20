import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MailIcon } from 'lucide-react';
import { useLanguage } from '../../../locales/useLanguage';
import { useAuthStore } from '../store/useAuthStore';

import { Button } from '@/components/ui/button';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Icons } from '@/components/ui/icons';
import { UI } from '@/components/layout/layoutStyles';
import { PasswordInput } from './PasswordInput';
import { validateLogin, type LoginFormErrors } from '../utils/validation';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<LoginFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const authErrorKey = useAuthStore((state) => state.authErrorKey);
  const clearError = useAuthStore((state) => state.clearError);

  const navigate = useNavigate();
  const { t } = useLanguage();
  const login = useAuthStore((state) => state.login);

  // Handle form submission for user login: validate inputs, call login, and navigate on success.
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    clearError();

    // Validate the form fields before submitting.
    const errors = validateLogin({ email, password });
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      const firstInvalidId = errors.email ? 'login-email' : 'login-password';
      document.getElementById(firstInvalidId)?.focus();
      return;
    }

    setIsSubmitting(true);

    try {
      await login({ email: email.trim(), password });
      const state = useAuthStore.getState();
      if (!state.authErrorKey && state.isAuthenticated) {
        navigate('/lobby', { replace: true });
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  // Update the email state and clear any existing field error for email when the user types.
  function updateEmail(value: string) {
    setEmail(value);
    if (fieldErrors.email) {
      setFieldErrors((current) => ({ ...current, email: undefined }));
    }
  }

  // Update the password state and clear any existing field error for password when the user types.
  function updatePassword(value: string) {
    setPassword(value);
    if (fieldErrors.password) {
      setFieldErrors((current) => ({ ...current, password: undefined }));
    }
  }

  // Focus the error message when an authentication error occurs.
  const errorRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (authErrorKey && errorRef.current) {
      errorRef.current.focus();
    }
  }, [authErrorKey]);

  return (
    <form onSubmit={handleSubmit} noValidate className={UI.form.container}>
      {/* Header of the Form */}
      <div className="mb-6">
        <h2 className={UI.text.formTitle}>
          {t('auth.login.heading') || 'Welcome back!'}{' '}
        </h2>
        <p className={UI.text.formSubtitle}>
          {t('auth.login.subheading') || 'Log in to return to the game.'}{' '}
        </p>
      </div>

      {authErrorKey && (
        <div
          ref={errorRef}
          tabIndex={-1}
          role="alert"
          aria-live="polite"
          className={`mb-4 ${UI.feedback.banner} ${UI.feedback.error}`}
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
            <MailIcon className={UI.form.inputIcon} aria-hidden="true" />
            <Input
              id="login-email"
              className={UI.form.inputWithIcon}
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => updateEmail(e.target.value)}
              placeholder={
                t('auth.login.emailPlaceholder') || 'Enter your email'
              }
              aria-invalid={Boolean(fieldErrors.email) || undefined}
              aria-describedby={
                fieldErrors.email ? 'login-email-error' : undefined
              }
              disabled={isSubmitting}
              required
            />
          </div>
          {fieldErrors.email && (
            <FieldError id="login-email-error">
              {t(fieldErrors.email)}
            </FieldError>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="login-password">
            {t('auth.login.password') || 'Password'}
          </FieldLabel>
          <PasswordInput
            id="login-password"
            value={password}
            onChange={updatePassword}
            autoComplete="current-password"
            placeholder={t('auth.login.passwordPlaceholder') || '********'}
            disabled={isSubmitting}
            invalid={Boolean(fieldErrors.password)}
            describedBy={
              fieldErrors.password ? 'login-password-error' : undefined
            }
          />
          {fieldErrors.password && (
            <FieldError id="login-password-error">
              {t(fieldErrors.password)}
            </FieldError>
          )}
        </Field>

        <Field orientation="horizontal" className="mt-2">
          <Button
            type="submit"
            disabled={isSubmitting}
            className={UI.btn.submit}
          >
            {isSubmitting
              ? t('auth.login.connecting') || 'Connecting...'
              : t('auth.login.playNow') || 'Play Now'}
          </Button>
        </Field>
      </FieldGroup>

      {/* Separator */}
      <div className={UI.form.divider}>
        <div className={UI.form.dividerLine} />
        <span className={UI.form.dividerLabel}>
          {t('auth.login.orContinueWith') || 'or continue with'}
        </span>
        <div className={UI.form.dividerLine} />
      </div>

      {/* Google OAuth */}
      <Button
        type="button"
        variant="outline"
        onClick={() => {
          window.location.href = '/api/auth/google';
        }}
        className={UI.btn.oauth}
      >
        <Icons.google className={UI.icon.sm} viewBox="0 0 24 24" />
        <span>{t('auth.login.continueGoogle') || 'Continue with Google'}</span>
      </Button>
    </form>
  );
}
