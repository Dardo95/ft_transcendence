import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MailIcon, UserIcon } from 'lucide-react';
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
import {
  validateRegistration,
  type RegisterFormErrors,
} from '../utils/validation';

export function RegisterForm() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<RegisterFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const authErrorKey = useAuthStore((state) => state.authErrorKey);
  const clearError = useAuthStore((state) => state.clearError);

  const { t } = useLanguage();
  const register = useAuthStore((state) => state.register);
  const navigate = useNavigate();

  // Handle form submission for user registration: validate inputs, call register, and navigate on success.
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    clearError();

    const errors = validateRegistration({
      username,
      email,
      password,
      confirmPassword,
    });
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      const firstInvalidField = (
        [
          ['username', 'register-username'],
          ['email', 'register-email'],
          ['password', 'register-password'],
          ['confirmPassword', 'register-confirm-password'],
        ] as const
      ).find(([field]) => errors[field]);

      if (firstInvalidField) {
        document.getElementById(firstInvalidField[1])?.focus();
      }
      return;
    }

    try {
      setIsSubmitting(true);
      await register({
        username: username.trim(),
        email: email.trim(),
        password,
      });
      const state = useAuthStore.getState();
      if (!state.authErrorKey && state.isAuthenticated) {
        navigate('/lobby', { replace: true });
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  // Clear the error for a specific field.
  function clearFieldError(field: keyof RegisterFormErrors) {
    if (!fieldErrors[field]) return;

    setFieldErrors((current) => ({ ...current, [field]: undefined }));
  }

  // Update the state for each input field and clear any existing field error when the user types.
  function updateUsername(value: string) {
    setUsername(value);
    clearFieldError('username');
  }

  // Update the state for each input field and clear any existing field error when the user types.
  function updateEmail(value: string) {
    setEmail(value);
    clearFieldError('email');
  }

  // Update the state for each input field and clear any existing field error when the user types.
  function updatePassword(value: string) {
    setPassword(value);
    clearFieldError('password');
  }

  // Update the state for each input field and clear any existing field error when the user types.
  function updateConfirmPassword(value: string) {
    setConfirmPassword(value);
    clearFieldError('confirmPassword');
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
          {t('auth.register.heading') || 'Join to enjoy the game!'}{' '}
        </h2>
        <p className={UI.text.formSubtitle}>
          {t('auth.register.subheading') || 'Sign up to start playing.'}{' '}
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
          <FieldLabel htmlFor="register-username">
            {t('auth.register.newUser') || 'New User'}
          </FieldLabel>
          <div className="relative">
            <UserIcon className={UI.form.inputIcon} aria-hidden="true" />
            <Input
              id="register-username"
              className={UI.form.inputWithIcon}
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => updateUsername(e.target.value)}
              placeholder={
                t('auth.register.userPlaceholder') || 'Enter your username'
              }
              aria-invalid={Boolean(fieldErrors.username) || undefined}
              aria-describedby={
                fieldErrors.username ? 'register-username-error' : undefined
              }
              maxLength={20}
              disabled={isSubmitting}
              required
            />
          </div>
          {fieldErrors.username && (
            <FieldError id="register-username-error">
              {t(fieldErrors.username)}
            </FieldError>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="register-email">
            {t('auth.register.email') || 'Email'}
          </FieldLabel>
          <div className="relative">
            <MailIcon className={UI.form.inputIcon} aria-hidden="true" />
            <Input
              id="register-email"
              className={UI.form.inputWithIcon}
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => updateEmail(e.target.value)}
              placeholder={
                t('auth.register.emailPlaceholder') || 'Enter your email'
              }
              aria-invalid={Boolean(fieldErrors.email) || undefined}
              aria-describedby={
                fieldErrors.email ? 'register-email-error' : undefined
              }
              disabled={isSubmitting}
              required
            />
          </div>
          {fieldErrors.email && (
            <FieldError id="register-email-error">
              {t(fieldErrors.email)}
            </FieldError>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="register-password">
            {t('auth.register.password') || 'Password'}
          </FieldLabel>
          <PasswordInput
            id="register-password"
            value={password}
            onChange={updatePassword}
            autoComplete="new-password"
            placeholder={t('auth.register.passwordPlaceholder') || '********'}
            disabled={isSubmitting}
            invalid={Boolean(fieldErrors.password)}
            describedBy={
              fieldErrors.password ? 'register-password-error' : undefined
            }
          />
          {fieldErrors.password && (
            <FieldError id="register-password-error">
              {t(fieldErrors.password)}
            </FieldError>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="register-confirm-password">
            {t('auth.register.confirmPassword') || 'Confirm password'}
          </FieldLabel>
          <PasswordInput
            id="register-confirm-password"
            value={confirmPassword}
            onChange={updateConfirmPassword}
            autoComplete="new-password"
            placeholder={
              t('auth.register.confirmPasswordPlaceholder') ||
              'Repeat your password'
            }
            disabled={isSubmitting}
            invalid={Boolean(fieldErrors.confirmPassword)}
            describedBy={
              fieldErrors.confirmPassword
                ? 'register-confirm-password-error'
                : undefined
            }
          />
          {fieldErrors.confirmPassword && (
            <FieldError id="register-confirm-password-error">
              {t(fieldErrors.confirmPassword)}
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
              ? t('auth.register.connecting') || 'Registering...'
              : t('auth.register.playNow') || 'Registered'}
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
