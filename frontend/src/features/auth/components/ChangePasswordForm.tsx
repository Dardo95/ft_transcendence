import { useState, type FormEvent } from 'react';
import type {
  ChangePasswordInput,
  ChangePasswordResponse,
} from '@transcendence/shared';
import { Check, X } from 'lucide-react';

import { ApiError } from '@/api/api';
import { Button } from '../../../components/ui/button';
import { FieldError } from '../../../components/ui/field';
import { UI } from '@/components/layout/layoutStyles';
import { useLanguage } from '../../../locales/useLanguage';
import { PasswordInput } from './PasswordInput';
import {
  validatePasswordChange,
  type PasswordChangeFormErrors,
} from '../utils/validation';

interface ChangePasswordFormProps {
  onChangePassword: (
    input: ChangePasswordInput
  ) => Promise<ChangePasswordResponse>;
  onCancel: () => void;
  onSuccess: () => void;
}

function apiErrorMessage(error: ApiError): string {
  const message: unknown = error.message;
  return Array.isArray(message) ? message.join(' ') : String(message ?? '');
}

/**
 * Form component for changing the user's password.
 * Validates locally first, then maps the backend 400/403 responses to
 * translated field or form errors.
 */
export function ChangePasswordForm({
  onChangePassword,
  onCancel,
  onSuccess,
}: ChangePasswordFormProps) {
  const { t } = useLanguage();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<PasswordChangeFormErrors>({});
  const [submitError, setSubmitError] =
    useState<PasswordChangeFormErrors['newPassword']>(undefined);
  const [isSaving, setIsSaving] = useState(false);

  // Clears the error for a specific field when the user starts typing in it.
  function clearFieldError(field: keyof PasswordChangeFormErrors) {
    if (!fieldErrors[field]) return;

    setFieldErrors((current) => ({ ...current, [field]: undefined }));
  }

  function resetFeedback() {
    setSubmitError(undefined);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    resetFeedback();

    const errors = validatePasswordChange({
      currentPassword,
      newPassword,
      confirmPassword,
    });
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      const firstInvalidField = (
        [
          ['currentPassword', 'change-password-current'],
          ['newPassword', 'change-password-new'],
          ['confirmPassword', 'change-password-confirm'],
        ] as const
      ).find(([field]) => errors[field]);

      if (firstInvalidField) {
        document.getElementById(firstInvalidField[1])?.focus();
      }
      return;
    }

    setIsSaving(true);

    try {
      const result = await onChangePassword({
        currentPassword,
        newPassword,
      });

      if (result.message) {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setFieldErrors({});
        onSuccess();
      }
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 403) {
          setSubmitError('auth.validation.oauthAccount');
          return;
        }

        if (error.status === 400) {
          const detail = apiErrorMessage(error);

          if (/current password/i.test(detail)) {
            setFieldErrors({
              currentPassword: 'auth.validation.currentPasswordInvalid',
            });
            document.getElementById('change-password-current')?.focus();
            return;
          }

          if (/different/i.test(detail)) {
            setFieldErrors({
              newPassword: 'auth.validation.samePassword',
            });
            document.getElementById('change-password-new')?.focus();
            return;
          }

          if (/password/i.test(detail)) {
            setFieldErrors({
              newPassword: 'auth.validation.passwordInvalid',
            });
            document.getElementById('change-password-new')?.focus();
            return;
          }
        }
      }

      setSubmitError('auth.validation.passwordUpdateFailed');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-2.5">
      <div className="space-y-1.5">
        <label htmlFor="change-password-current" className={UI.text.fieldLabel}>
          {t('profile.currentPassword') || 'Current password'}
        </label>
        <PasswordInput
          id="change-password-current"
          value={currentPassword}
          onChange={(value) => {
            setCurrentPassword(value);
            clearFieldError('currentPassword');
            resetFeedback();
          }}
          autoComplete="current-password"
          placeholder={
            t('profile.currentPasswordPlaceholder') ||
            'Enter your current password'
          }
          disabled={isSaving}
          invalid={Boolean(fieldErrors.currentPassword)}
          describedBy={
            fieldErrors.currentPassword
              ? 'change-password-current-error'
              : undefined
          }
        />
        {fieldErrors.currentPassword && (
          <FieldError id="change-password-current-error">
            {t(fieldErrors.currentPassword)}
          </FieldError>
        )}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="change-password-new" className={UI.text.fieldLabel}>
          {t('profile.newPassword') || 'New password'}
        </label>
        <PasswordInput
          id="change-password-new"
          value={newPassword}
          onChange={(value) => {
            setNewPassword(value);
            clearFieldError('newPassword');
            resetFeedback();
          }}
          autoComplete="new-password"
          placeholder={
            t('profile.newPasswordPlaceholder') || 'Enter your new password'
          }
          disabled={isSaving}
          invalid={Boolean(fieldErrors.newPassword)}
          describedBy={
            fieldErrors.newPassword ? 'change-password-new-error' : undefined
          }
        />
        {fieldErrors.newPassword && (
          <FieldError id="change-password-new-error">
            {t(fieldErrors.newPassword)}
          </FieldError>
        )}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="change-password-confirm" className={UI.text.fieldLabel}>
          {t('profile.confirmPassword') || 'Confirm new password'}
        </label>
        <PasswordInput
          id="change-password-confirm"
          value={confirmPassword}
          onChange={(value) => {
            setConfirmPassword(value);
            clearFieldError('confirmPassword');
            resetFeedback();
          }}
          autoComplete="new-password"
          placeholder={
            t('profile.confirmPasswordPlaceholder') || 'Repeat the new password'
          }
          disabled={isSaving}
          invalid={Boolean(fieldErrors.confirmPassword)}
          describedBy={
            fieldErrors.confirmPassword
              ? 'change-password-confirm-error'
              : undefined
          }
        />
        {fieldErrors.confirmPassword && (
          <FieldError id="change-password-confirm-error">
            {t(fieldErrors.confirmPassword)}
          </FieldError>
        )}
      </div>

      <p className={UI.text.microLabel}>
        {t('profile.passwordChangeHint') ||
          'The new password must be 8-128 characters, differ from the current one, and match the confirmation.'}
      </p>

      {submitError && (
        <p className={UI.feedback.inlineError} role="alert">
          {t(submitError)}
        </p>
      )}

      <div className="flex flex-wrap justify-end gap-2">
        <Button
          type="submit"
          size="sm"
          disabled={isSaving}
          className={UI.btn.smSave}
        >
          <Check className={UI.icon.xs} aria-hidden="true" />
          {isSaving
            ? t('profile.saving') || 'Saving...'
            : t('profile.save') || 'Save changes'}
        </Button>

        <Button
          type="button"
          size="sm"
          variant="ghost"
          disabled={isSaving}
          onClick={onCancel}
          className={UI.btn.smGhost}
        >
          <X className={UI.icon.xs} aria-hidden="true" />
          {t('profile.cancel') || 'Cancel'}
        </Button>
      </div>
    </form>
  );
}
