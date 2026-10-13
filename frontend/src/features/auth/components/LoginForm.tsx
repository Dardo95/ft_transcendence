/**
 * User login form.
 * Category: Feature Component
 *
 * Responsible for:
 * - Collecting login credentials.
 * - Validating user input.
 * - Triggering the authentication flow.
 * - Displaying authentication errors to the user.
 *
 * Does not:
 * - Perform HTTP requests directly.
 * - Implement authentication business logic.
 * - Store authentication state directly.
 */

import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useLanguage } from '../../../locales/useLanguage';
import { useAuthStore } from '../store/useAuthStore';
import { Card } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';

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
        error instanceof Error ? error.message : t('auth.errors.login') || 'Error at login'
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="mx-auto w-full max-w-sm">
      <h2 className="mb-4 text-center text-xl font-bold text-orange-400">
        {t('auth.login.title') || 'Chef Credentials'}
      </h2>

      {errorMessage && (
        <div className="mb-4 flex items-center justify-center gap-1.5 rounded-xl border border-red-700/80 bg-red-950/70 p-2.5 text-center text-xs text-red-300">
          <span>⚠️</span>
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
        <Input
          label={t('auth.login.email') || 'Email'}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('auth.login.emailPlaceholder') || 'Enter your email'}
          required
        />
        <Input
          label={t('auth.login.password') || 'Password'}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={t('auth.login.passwordPlaceholder') || '********'}
          required
        />

        <Button type="submit" disabled={isSubmitting} className="mt-2">
          {isSubmitting
            ? t('auth.login.connecting') || 'Connecting...'
            : t('auth.login.playNow') || 'Play Now'}
        </Button>
      </form>
    </Card>
  );
}
