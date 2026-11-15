import { useState, type FormEvent } from 'react';
import type {
  UpdateProfileInput,
  UpdateProfileOutcome,
  UpdateProfileResponse,
  UserPrivate,
} from '@transcendence/shared';
import { Check, CheckCircle2, Pencil, UserRound, X } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { AvatarUpload } from './AvatarUpload';
import { LevelProgress } from './LevelProgress';
import { FriendList } from '../../friends/components/FriendListCard';
import { useLanguage } from '../../../locales/useLanguage';
import { UI } from '@/components/layout/layoutStyles';

type EditableField = 'username' | 'email';

interface PrivateProfileViewProps {
  user: UserPrivate;
  onAvatarUpload: (blob: Blob) => Promise<void>;
  onUpdateProfile: (
    input: UpdateProfileInput
  ) => Promise<UpdateProfileResponse>;
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
    setEditingField(field);

    if (field === 'username') {
      setUsernameDraft(user.username);
    } else {
      setEmailDraft(user.email);
    }
  };

  const cancelEditing = () => {
    setEditingField(null);
    setError(null);
  };

  const submitField = async (field: EditableField) => {
    setError(null);
    setSuccess(null);

    if (field === 'username') {
      const nextUsername = usernameDraft.trim();

      if (
        !nextUsername ||
        nextUsername.length < 3 ||
        nextUsername.length > 20 ||
        /\s/.test(nextUsername)
      ) {
        setError(
          t('profile.invalidUsername') ||
            'Username must be 3-20 characters with no spaces.'
        );
        return;
      }

      if (nextUsername === user.username) {
        setEditingField(null);
        return;
      }

      setIsSaving(true);
      try {
        const result = await onUpdateProfile({ username: nextUsername });
        if (result.outcome === 'updated') {
          setSuccess(t('profile.updated') || 'Profile updated successfully.');
          setEditingField(null);
        } else {
          setError(outcomeMessage(result.outcome));
        }
      } catch {
        setError(
          t('profile.updateFailed') ||
            'Could not update your profile. Try again.'
        );
      } finally {
        setIsSaving(false);
      }
      return;
    }

    const nextEmail = emailDraft.trim();

    if (!nextEmail) {
      setError(
        t('profile.fieldsRequired') || 'Username and email are required.'
      );
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(nextEmail)) {
      setError(t('profile.invalidEmail') || 'Enter a valid email address.');
      return;
    }

    if (nextEmail === user.email) {
      setEditingField(null);
      return;
    }

    setIsSaving(true);
    try {
      const result = await onUpdateProfile({ email: nextEmail });
      if (result.outcome === 'updated') {
        setSuccess(t('profile.updated') || 'Profile updated successfully.');
        setEditingField(null);
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

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (editingField) {
      void submitField(editingField);
    }
  };

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
      maxLength: undefined,
    },
    // TO DO: Implement password change functionality
    // {
    //   key: 'password' as const,
    //   label: t('profile.password') || 'Password',
    //   value: '********',
    //   canEdit: !emailManagedByOAuth,
    //   draft: passwordDraft,
    //   setDraft: setPasswordDraft,
    //   type: 'password' as const,
    //   maxLength: undefined,
    // },
  ];

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
        <Card className={`${UI.card.section} sm:p-8`}>
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <h2 className={UI.text.sectionTitle}>
              {t('profile.myProfile') || 'My Profile'}
              <span className={`ml-3 ${UI.badge.tag}`}>#{user.id}</span>
            </h2>
            <span className={UI.badge.pill}>
              <UserRound className="size-3.5" aria-hidden="true" />
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
            <div className="space-y-3">
              {editableFields.map((field) => {
                const isEditing = editingField === field.key;

                return (
                  <div key={field.key} className={`p-3.5 ${UI.card.inner}`}>
                    {isEditing ? (
                      <form onSubmit={handleFormSubmit} className="space-y-2.5">
                        <label className={`block ${UI.text.sublabel}`}>
                          {field.label}
                          <Input
                            autoFocus
                            type={field.type}
                            value={field.draft}
                            onChange={(event) =>
                              field.setDraft(event.target.value)
                            }
                            maxLength={field.maxLength}
                            autoComplete={field.key}
                            disabled={isSaving}
                            className="mt-1.5 text-sm"
                          />
                        </label>

                        <div className="flex flex-wrap gap-2">
                          <Button
                            type="submit"
                            size="sm"
                            disabled={isSaving}
                            className="gap-1.5 text-xs font-semibold"
                          >
                            <Check className="size-3.5" aria-hidden="true" />
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
                            className="gap-1.5 text-xs"
                          >
                            <X className="size-3.5" aria-hidden="true" />
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
                            className="text-muted-foreground hover:text-primary"
                          >
                            <Pencil className="size-3.5" aria-hidden="true" />
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}

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
                  <CheckCircle2 className="size-4" aria-hidden="true" />
                  {success}
                </p>
              )}
            </div>
          </div>
        </Card>

        {/* Read-only account information */}
        <Card className={`${UI.card.section} sm:p-8`}>
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <h2 className={UI.text.sectionTitle}>
              {t('profile.accountInformation') || 'Account information'}
            </h2>
            <span className={UI.badge.pill}>
              {t('profile.authentication') || 'Authentication'}
            </span>
          </div>

          <div className={`mt-5 p-3.5 ${UI.card.inner}`}>
            <LevelProgress xp={user.xp} />
          </div>

          <dl className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {readOnlyFields.map((field) => (
              <div key={field.label} className={`p-3.5 ${UI.card.inner}`}>
                <dt className={UI.text.sublabel}>{field.label}</dt>
                <dd
                  className={`mt-1 text-sm font-semibold break-all ${field.tone}`}
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
