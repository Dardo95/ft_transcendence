import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../../locales/useLanguage';

import type {
  ChangePasswordInput,
  ChangePasswordResponse,
  UpdateProfileInput,
  UpdateProfileOutcome,
  UpdateProfileResponse,
  UserPrivate,
} from '@transcendence/shared';

import { UI } from '@/components/layout/layoutStyles';
import { Check, CheckCircle2, Pencil, UserRound, X } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { FieldError } from '../../../components/ui/field';
import { Input } from '../../../components/ui/input';
import { AvatarUpload } from './AvatarUpload';
import { ChangePasswordForm } from './ChangePasswordForm';
import { LevelProgress } from './LevelProgress';
import { PasswordInput } from './PasswordInput';
import { FriendList } from '../../friends/components/FriendListCard';
import { BlockedUsersCard } from '../../friends/components/BlockedUsersCard';

import {
  changeMyPassword,
  updateMyAvatar,
  updateMyProfile,
} from '../service/authService';
import { useAuthStore } from '../store/useAuthStore';
import {
  validateEmail,
  validateLoginPassword,
  validateUsername,
  type ValidationErrorKey,
} from '../utils/validation';
import { ApiError } from '../../../api/api';

type AccountField = 'username' | 'email';
type EditableField = AccountField | 'password';
type ProfileField = AccountField | 'currentPassword';

function apiErrorMessage(error: ApiError): string {
  const message: unknown = error.message;
  return Array.isArray(message) ? message.join(' ') : String(message ?? '');
}

interface ProfilePagePrivateProps {
  user: UserPrivate;
}

/**
 * Private profile view.
 * Read-first layout: values stay visible as text and only the targeted field
 * switches to an inline form when its pencil button is pressed.
 */
export function ProfilePagePrivate({ user }: ProfilePagePrivateProps) {
  const navigate = useNavigate();
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const { t } = useLanguage();
  const [editingField, setEditingField] = useState<EditableField | null>(null);
  const [usernameDraft, setUsernameDraft] = useState(user.username);
  const [emailDraft, setEmailDraft] = useState(user.email);
  const [currentPassword, setCurrentPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<ProfileField, ValidationErrorKey>>
  >({});
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const onAvatarUpload = async (blob: Blob) => {
    await updateMyAvatar(blob);
    await checkAuth();
  };

  const onUpdateProfile = async (
    input: UpdateProfileInput
  ): Promise<UpdateProfileResponse> => {
    const result = await updateMyProfile(input);
    if (result.outcome === 'updated') {
      const nextUsername = result.user?.username ?? input.username;
      if (nextUsername !== undefined && nextUsername !== user.username) {
        navigate('/profile', { replace: true });
      }
      await checkAuth();
    }
    return result;
  };

  const onChangePassword = (
    input: ChangePasswordInput
  ): Promise<ChangePasswordResponse> => changeMyPassword(input);

  // Email changes require a local password. Google-only accounts can never
  // change their email, while Google accounts with a linked local password can.
  const accessBadge =
    user.oauthProvider === null
      ? t('profile.localAccount') || 'Local Account'
      : user.hasPassword
        ? t('profile.googleLinked') || 'Google linked'
        : t('profile.managedByGoogle') || 'Managed by Google';
  const registrationDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : '—';
  // Two-factor authentication status is currently not going to be implemented, so this field is commented out for now.
  // const twoFactorStatus = user.twoFaEnabled
  //   ? t('profile.twoFactorEnabled') || 'Enabled'
  //   : t('profile.twoFactorDisabled') || 'Disabled';

  const outcomeMessage = (outcome: UpdateProfileOutcome): string => {
    switch (outcome) {
      case 'username_taken':
        return t('profile.usernameTaken') || 'That username is already taken.';
      case 'email_taken':
        return t('profile.emailTaken') || 'That email is already registered.';
      case 'invalid_username':
        return (
          t('profile.invalidUsername') ||
          'Username must be 3-20 characters with no spaces.'
        );
      case 'invalid_email':
        return t('profile.invalidEmail') || 'Enter a valid email address.';
      default:
        return '';
    }
  };

  const editLabel = (label: string) =>
    (t('profile.editField') || 'Edit {field}').replace('{field}', label);

  const startEditing = (field: EditableField) => {
    setError(null);
    setSuccess(null);
    setFieldErrors({});
    setCurrentPassword('');
    setEditingField(field);

    if (field === 'username') {
      setUsernameDraft(user.username);
    } else if (field === 'email') {
      setEmailDraft(user.email);
    }
  };

  const cancelEditing = () => {
    setEditingField(null);
    setFieldErrors({});
    setCurrentPassword('');
    setError(null);
    setSuccess(null);
  };

  const handlePasswordSuccess = () => {
    setEditingField(null);
    setFieldErrors({});
    setCurrentPassword('');
    setError(null);
    setSuccess(
      t('profile.passwordUpdated') || 'Password updated successfully.'
    );
  };

  const clearFieldError = (field: ProfileField) => {
    if (!fieldErrors[field]) return;

    setFieldErrors((current) => ({ ...current, [field]: undefined }));
  };

  // Validate the input for a specific field and return any validation error key.
  const validateField = (
    field: AccountField,
    value: string
  ): ValidationErrorKey | null =>
    field === 'username' ? validateUsername(value) : validateEmail(value);

  // Submit the updated value for a specific field, handling validation, API call, and error/success state.
  const submitField = async (field: AccountField) => {
    setError(null);
    setSuccess(null);
    setFieldErrors({});

    const value = field === 'username' ? usernameDraft : emailDraft;
    const validationError = validateField(field, value);

    if (validationError) {
      setFieldErrors({ [field]: validationError });
      document.getElementById(`profile-${field}`)?.focus();
      return;
    }

    const nextValue = value.trim();

    if (field === 'username' && nextValue === user.username) {
      setEditingField(null);
      return;
    }

    // Email changes always require the current password, even when the typed
    // address matches the stored one.
    if (field === 'email') {
      if (!currentPassword) {
        setFieldErrors({
          currentPassword: 'auth.validation.currentPasswordRequired',
        });
        document.getElementById('profile-current-password')?.focus();
        return;
      }

      const currentPasswordError = validateLoginPassword(currentPassword);
      if (currentPasswordError) {
        setFieldErrors({ currentPassword: currentPasswordError });
        document.getElementById('profile-current-password')?.focus();
        return;
      }
    }

    setIsSaving(true);
    try {
      const result = await onUpdateProfile(
        field === 'username'
          ? { username: nextValue }
          : { email: nextValue, currentPassword }
      );

      if (result.outcome === 'updated') {
        setSuccess(t('profile.updated') || 'Profile updated successfully.');
        setCurrentPassword('');
        setEditingField(null);
      } else if (
        result.outcome === 'invalid_username' ||
        result.outcome === 'invalid_email'
      ) {
        setFieldErrors({
          [field]:
            result.outcome === 'invalid_username'
              ? 'auth.validation.usernameInvalid'
              : 'auth.validation.emailInvalid',
        });
      } else {
        setError(outcomeMessage(result.outcome));
      }
    } catch (err: unknown) {
      if (err instanceof ApiError && field === 'email') {
        if (err.status === 403) {
          setError(
            t('auth.validation.oauthAccount') ||
              'Google accounts do not have a local password.'
          );
          return;
        }

        if (err.status === 400) {
          const detail = apiErrorMessage(err);

          if (/email/i.test(detail)) {
            setFieldErrors({ email: 'auth.validation.emailInvalid' });
            document.getElementById('profile-email')?.focus();
          } else {
            setFieldErrors({
              currentPassword: 'auth.validation.currentPasswordInvalid',
            });
            document.getElementById('profile-current-password')?.focus();
          }
          return;
        }
      }

      setError(
        t('profile.updateFailed') || 'Could not update your profile. Try again.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Handle form submission for the inline edit form, submitting the currently editing field.
  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (editingField && editingField !== 'password') {
      void submitField(editingField);
    }
  };

  // Define the editable and read-only fields for rendering, including labels, values, and editability.
  const editableFields = [
    {
      key: 'username' as const,
      label: t('profile.username') || 'Username',
      value: user.username,
      canEdit: true,
      draft: usernameDraft,
      setDraft: setUsernameDraft,
      type: 'text' as const,
      maxLength: 20,
    },
    {
      key: 'email' as const,
      label: t('profile.email') || 'Email',
      value: user.email,
      canEdit: user.hasPassword,
      draft: emailDraft,
      setDraft: setEmailDraft,
      type: 'email' as const,
      maxLength: 254,
    },
  ];

  // Define the read-only fields for rendering, including labels, values, and text tone.
  const readOnlyFields = [
    {
      label: t('profile.joined') || 'Registered on',
      value: registrationDate,
      tone: 'text-foreground',
      fullWidth: true,
    },
    // Already included in the access badge above, so this field is commented out for now.
    // {
    //   label: t('profile.authentication') || 'Authentication',
    //   value: authenticationMethod,
    //   tone: 'text-foreground',
    //   fullWidth: false,
    // },
    // Two-factor authentication status is currently not going to be implemented, so this field is commented out for now.
    // {
    //   label: t('profile.twoFactor') || 'Two-factor authentication',
    //   value: twoFactorStatus,
    //   tone: user.twoFaEnabled
    //     ? 'text-success-foreground'
    //     : 'text-muted-foreground',
    //   fullWidth: false,
    // },
  ];

  return (
    <div className={UI.shell.page}>
      <div className={UI.shell.container}>
        {/* Editable profile details */}
        <Card className={UI.card.sectionLarge}>
          <div className={UI.row.header}>
            <h2 className={UI.text.sectionTitle}>
              {t('profile.myProfile') || 'My Profile'}
              <span className={`ml-3 ${UI.badge.tag}`}>#{user.id}</span>
            </h2>
            <span className={UI.badge.pill}>
              <UserRound className={UI.icon.xs} aria-hidden="true" />
              {t('profile.privateProfileBadge') || 'Editable Data'}
            </span>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,220px)_1fr]">
            {/* Avatar selector */}
            <div className="flex flex-col items-center gap-3 text-center">
              <AvatarUpload
                currentAvatarUrl={user.avatarUrl}
                username={user.username}
                onAvatarUpdated={onAvatarUpload}
              />
            </div>

            {/* Editable username, email and password */}
            <div className={UI.form.stack}>
              {editableFields.map((field) => {
                const isEditing = editingField === field.key;
                const fieldError = fieldErrors[field.key];
                const currentPasswordError = fieldErrors.currentPassword;
                const inputId = `profile-${field.key}`;
                const errorId = `${inputId}-error`;

                return (
                  <div key={field.key} className={UI.card.innerPadded}>
                    {isEditing ? (
                      <form
                        onSubmit={handleFormSubmit}
                        noValidate
                        className="space-y-2.5"
                      >
                        <div className="space-y-1.5">
                          <label
                            htmlFor={inputId}
                            className={UI.text.fieldLabel}
                          >
                            {field.label}
                          </label>
                          <Input
                            id={inputId}
                            autoFocus
                            type={field.type}
                            value={field.draft}
                            onChange={(event) => {
                              field.setDraft(event.target.value);
                              clearFieldError(field.key);
                            }}
                            onBlur={() => {
                              const validationError = validateField(
                                field.key,
                                field.draft
                              );

                              if (validationError) {
                                setFieldErrors((current) => ({
                                  ...current,
                                  [field.key]: validationError,
                                }));
                              }
                            }}
                            maxLength={field.maxLength}
                            autoComplete={field.key}
                            disabled={isSaving}
                            aria-invalid={Boolean(fieldError) || undefined}
                            aria-describedby={fieldError ? errorId : undefined}
                            className="text-sm"
                          />
                          {fieldError && (
                            <FieldError id={errorId}>
                              {t(fieldError)}
                            </FieldError>
                          )}
                        </div>

                        {field.key === 'email' && (
                          <div className="space-y-1.5">
                            <label
                              htmlFor="profile-current-password"
                              className={UI.text.fieldLabel}
                            >
                              {t('profile.currentPassword') ||
                                'Current password'}
                            </label>
                            <PasswordInput
                              id="profile-current-password"
                              value={currentPassword}
                              onChange={(value) => {
                                setCurrentPassword(value);
                                clearFieldError('currentPassword');
                              }}
                              autoComplete="current-password"
                              placeholder={
                                t('profile.currentPasswordPlaceholder') ||
                                'Enter your current password'
                              }
                              disabled={isSaving}
                              invalid={Boolean(currentPasswordError)}
                              describedBy={
                                currentPasswordError
                                  ? 'profile-current-password-error'
                                  : undefined
                              }
                            />
                            {currentPasswordError && (
                              <FieldError id="profile-current-password-error">
                                {t(currentPasswordError)}
                              </FieldError>
                            )}
                          </div>
                        )}

                        <div className="space-y-1">
                          <p className={UI.text.microLabel}>
                            {field.key === 'username'
                              ? t('profile.usernameHint') ||
                                '3-20 characters, no spaces.'
                              : t('profile.emailHint') ||
                                'Enter a valid email address (254 characters max).'}
                          </p>

                          {field.key === 'email' && (
                            <p className={UI.text.microLabel}>
                              {t('profile.emailChangePasswordHint') ||
                                'Enter your current password to change your email.'}
                            </p>
                          )}
                        </div>

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
                            onClick={cancelEditing}
                            className={UI.btn.smGhost}
                          >
                            <X className={UI.icon.xs} aria-hidden="true" />
                            {t('profile.cancel') || 'Cancel'}
                          </Button>
                        </div>
                      </form>
                    ) : (
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className={UI.text.fieldLabel}>{field.label}</p>
                          <p className="text-foreground mt-1 text-sm font-medium break-all">
                            {field.value}
                          </p>
                        </div>

                        <div className="flex shrink-0 items-center gap-2 self-end">
                          {field.key === 'email' && (
                            <span className={UI.badge.tag}>{accessBadge}</span>
                          )}

                          {field.canEdit && (
                            <Button
                              type="button"
                              variant="outline"
                              size="icon-sm"
                              onClick={() => startEditing(field.key)}
                              title={editLabel(field.label)}
                              aria-label={editLabel(field.label)}
                              className={UI.btn.iconGhost}
                            >
                              <Pencil
                                className={UI.icon.xs}
                                aria-hidden="true"
                              />
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {user.hasPassword && (
                <div className={UI.card.innerPadded}>
                  {editingField === 'password' ? (
                    <ChangePasswordForm
                      onChangePassword={onChangePassword}
                      onCancel={cancelEditing}
                      onSuccess={handlePasswordSuccess}
                    />
                  ) : (
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className={UI.text.fieldLabel}>
                          {t('profile.password') || 'Password'}
                        </p>
                        <p className="text-foreground mt-1 text-sm font-medium break-all">
                          **********
                        </p>
                      </div>

                      <Button
                        type="button"
                        variant="outline"
                        size="icon-sm"
                        onClick={() => startEditing('password')}
                        title={editLabel(t('profile.password') || 'Password')}
                        aria-label={editLabel(
                          t('profile.password') || 'Password'
                        )}
                        className={`${UI.btn.iconGhost} self-end`}
                      >
                        <Pencil className={UI.icon.xs} aria-hidden="true" />
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {error && (
                <p className={UI.feedback.inlineError} role="alert">
                  {error}
                </p>
              )}

              {success && (
                <p className={UI.feedback.inlineSuccess}>
                  <CheckCircle2 className={UI.icon.sm} aria-hidden="true" />
                  {success}
                </p>
              )}
            </div>
          </div>
        </Card>

        {/* Read-only account information */}
        <Card className={UI.card.sectionLarge}>
          <div className={UI.row.header}>
            <h2 className={UI.text.sectionTitle}>
              {t('profile.accountInformation') || 'Account information'}
            </h2>
            <span className={UI.badge.pill}>
              {t('profile.authentication') || 'Authentication'}
            </span>
          </div>

          <div className={`mt-5 ${UI.card.innerPadded}`}>
            <LevelProgress xp={user.xp} />
          </div>

          <dl className={UI.shell.detailGrid}>
            {readOnlyFields.map((field) => (
              <div
                key={field.label}
                className={`${UI.card.innerPadded} ${
                  field.fullWidth ? UI.shell.detailGridFull : ''
                }`}
              >
                <dt className={UI.text.sublabel}>{field.label}</dt>
                <dd
                  className={`text-foreground ${field.tone} ${UI.text.value}`}
                >
                  {field.value}
                </dd>
              </div>
            ))}
          </dl>
        </Card>

        {/* Friends and social management */}
        <FriendList variant="profile" />

        {/* Blocked users management */}
        <BlockedUsersCard />
      </div>
    </div>
  );
}
