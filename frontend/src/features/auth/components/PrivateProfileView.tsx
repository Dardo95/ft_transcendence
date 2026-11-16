import { useState, type FormEvent } from 'react';
import type {
  // ChangePasswordInput,
  // ChangePasswordResponse,
  UpdateProfileInput,
  UpdateProfileOutcome,
  UpdateProfileResponse,
  UserPrivate,
} from '@transcendence/shared';
import { Check, CheckCircle2, Pencil, UserRound, X } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { FieldError } from '../../../components/ui/field';
import { Input } from '../../../components/ui/input';
import { AvatarUpload } from './AvatarUpload';
// import { ChangePasswordForm } from './ChangePasswordForm';
import { LevelProgress } from './LevelProgress';
import { FriendList } from '../../friends/components/FriendListCard';
import { useLanguage } from '../../../locales/useLanguage';
import { UI } from '@/components/layout/layoutStyles';
import {
  validateEmail,
  validateUsername,
  type ValidationErrorKey,
} from '../utils/validation';

type EditableField = 'username' | 'email';

interface PrivateProfileViewProps {
  user: UserPrivate;
  onAvatarUpload: (blob: Blob) => Promise<void>;
  onUpdateProfile: (
    input: UpdateProfileInput
  ) => Promise<UpdateProfileResponse>;
  // onChangePassword: (
  //   input: ChangePasswordInput
  // ) => Promise<ChangePasswordResponse>;
}

/**
 * Private profile view.
 * Read-first layout: values stay visible as text and only the targeted field
 * switches to an inline form when its pencil button is pressed.
 */
export function PrivateProfileView({
  user,
  onAvatarUpload,
  onUpdateProfile,
}: PrivateProfileViewProps) {
  const { t } = useLanguage();
  const [editingField, setEditingField] = useState<EditableField | null>(null);
  const [usernameDraft, setUsernameDraft] = useState(user.username);
  const [emailDraft, setEmailDraft] = useState(user.email);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<EditableField, ValidationErrorKey>>
  >({});
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const emailManagedByOAuth = user.oauthProvider !== null;
  const registrationDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : '—';
  const authenticationMethod = emailManagedByOAuth
    ? t('profile.googleOAuth') || 'Google OAuth'
    : t('profile.localAccount') || 'Local Account';
  const twoFactorStatus = user.twoFaEnabled
    ? t('profile.twoFactorEnabled') || 'Enabled'
    : t('profile.twoFactorDisabled') || 'Disabled';

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
    setEditingField(field);

    if (field === 'username') {
      setUsernameDraft(user.username);
    } else {
      setEmailDraft(user.email);
    }
  };

  const cancelEditing = () => {
    setEditingField(null);
    setFieldErrors({});
    setError(null);
  };

  const clearFieldError = (field: EditableField) => {
    if (!fieldErrors[field]) return;

    setFieldErrors((current) => ({ ...current, [field]: undefined }));
  };

  // Validate the input for a specific field and return any validation error key.
  const validateField = (
    field: EditableField,
    value: string
  ): ValidationErrorKey | null =>
    field === 'username' ? validateUsername(value) : validateEmail(value);

  // Submit the updated value for a specific field, handling validation, API call, and error/success state.
  const submitField = async (field: EditableField) => {
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

    if (
      (field === 'username' && nextValue === user.username) ||
      (field === 'email' && nextValue === user.email)
    ) {
      setEditingField(null);
      return;
    }

    setIsSaving(true);
    try {
      const result = await onUpdateProfile(
        field === 'username' ? { username: nextValue } : { email: nextValue }
      );

      if (result.outcome === 'updated') {
        setSuccess(t('profile.updated') || 'Profile updated successfully.');
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
    } catch {
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
    if (editingField) {
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
      canEdit: !emailManagedByOAuth,
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
    },
    {
      label: t('profile.authentication') || 'Authentication',
      value: authenticationMethod,
      tone: 'text-foreground',
    },
    {
      label: t('profile.twoFactor') || 'Two-factor authentication',
      value: twoFactorStatus,
      tone: user.twoFaEnabled
        ? 'text-success-foreground'
        : 'text-muted-foreground',
    },
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

            {/* Editable username and email */}
            <div className={UI.form.stack}>
              {editableFields.map((field) => {
                const isEditing = editingField === field.key;
                const fieldError = fieldErrors[field.key];
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
                          <label htmlFor={inputId} className={UI.form.label}>
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

                        <div className="flex flex-wrap gap-2">
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
                          <p className={UI.text.sublabel}>{field.label}</p>
                          <p className="text-foreground mt-1 text-sm font-medium break-all">
                            {field.value}
                          </p>

                          {field.key === 'email' && emailManagedByOAuth && (
                            <span className="border-primary/30 bg-primary/10 text-primary mt-2 inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-semibold tracking-wider uppercase">
                              {t('profile.managedByGoogle') ||
                                'Managed by Google'}
                            </span>
                          )}
                        </div>

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
                            <Pencil className={UI.icon.xs} aria-hidden="true" />
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}

              {/*
                TODO(password): re-enable this row when the backend endpoint
                `PATCH /api/users/me/password` exists. The form component is
                already prepared in `ChangePasswordForm.tsx`.

                <div className={`p-3.5 ${UI.card.inner}`}>
                  {editingField === 'password' && !emailManagedByOAuth ? (
                    <ChangePasswordForm
                      onChangePassword={onChangePassword}
                      onCancel={cancelEditing}
                      onSuccess={() => {
                        setEditingField(null);
                        setError(null);
                        setSuccess(
                          t('profile.passwordUpdated') ||
                            'Password updated successfully.'
                        );
                      }}
                    />
                  ) : (
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className={UI.text.sublabel}>
                          {t('profile.password') || 'Password'}
                        </p>
                        <p className="text-foreground mt-1 text-sm font-medium">
                          {emailManagedByOAuth ? '—' : '••••••••'}
                        </p>
                        <p className="text-muted-foreground mt-1 text-xs">
                          {emailManagedByOAuth
                            ? t('profile.passwordManagedByGoogle') ||
                              'This account uses Google and has no local password.'
                            : t('profile.passwordHint') ||
                              '8-128 characters.'}
                        </p>
                      </div>

                      {!emailManagedByOAuth && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon-sm"
                          onClick={() => startEditing('password')}
                          title={editLabel(t('profile.password') || 'Password')}
                          aria-label={editLabel(
                            t('profile.password') || 'Password'
                          )}
                          className={UI.btn.iconGhost}
                        >
                          <Pencil className={UI.icon.xs} aria-hidden="true" />
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              */}

              {error && (
                <p
                  className="text-destructive text-xs font-medium"
                  role="alert"
                >
                  {error}
                </p>
              )}

              {success && (
                <p className="text-success-foreground inline-flex items-center gap-1 text-xs font-medium">
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
              <div key={field.label} className={UI.card.innerPadded}>
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
      </div>
    </div>
  );
}
