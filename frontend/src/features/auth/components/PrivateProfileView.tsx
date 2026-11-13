import { useState, type FormEvent } from 'react';
import type {
  UpdateProfileInput,
  UpdateProfileOutcome,
  UpdateProfileResponse,
  UserPrivate,
} from '@transcendence/shared';
import {
  Check,
  CheckCircle2,
  Pencil,
  UserRound,
  X,
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { AvatarUpload } from './AvatarUpload';
import { LevelProgress } from './LevelProgress';
import { FriendList } from '../../friends/components/FriendListCard';
import { useLanguage } from '../../../locales/useLanguage';

type EditableField = 'username' | 'email';

interface PrivateProfileViewProps {
  user: UserPrivate;
  onAvatarUpload: (blob: Blob) => Promise<void>;
  onUpdateProfile: (
    input: UpdateProfileInput
  ) => Promise<UpdateProfileResponse>;
}

const SECTION_CARD =
  'rounded-2xl border border-zinc-800 bg-zinc-900/90 p-6 shadow-xl backdrop-blur-sm sm:p-8';
const INNER_BOX = 'rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-3.5';
const LABEL =
  'text-[11px] font-semibold tracking-wider text-zinc-400 uppercase';
const ORANGE_BADGE =
  'inline-flex items-center gap-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-xs font-semibold tracking-wider text-orange-400 uppercase';

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
    {
      key: 'password' as const,
      label: t('profile.password') || 'Password',
      value: '********',
      canEdit: !emailManagedByOAuth,
      // draft: passwordDraft, TO DO: Implement password change functionality
      // setDraft: setPasswordDraft,
      type: 'password' as const,
      maxLength: undefined,
    },
  ];

  const readOnlyFields = [
    {
      label: t('profile.joined') || 'Registered on',
      value: registrationDate,
      tone: 'text-white',
    },
    {
      label: t('profile.authentication') || 'Authentication',
      value: authenticationMethod,
      tone: 'text-white',
    },
    {
      label: t('profile.twoFactor') || 'Two-factor authentication',
      value: twoFactorStatus,
      tone: user.twoFaEnabled ? 'text-emerald-400' : 'text-zinc-400',
    },
  ];

  return (
    <div className="flex w-full justify-center px-4 py-8">
      <div className="w-full max-w-5xl space-y-8">
        {/* Editable profile details */}
        <section className={SECTION_CARD}>
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-bold text-white">
              {t('profile.myProfile') || 'My Profile'}
              <span className="text-s ml-3 rounded-full border border-zinc-700 bg-zinc-800 px-3 py-1 font-semibold text-zinc-300">
                #{user.id}
              </span>
            </h2>
            <span className={ORANGE_BADGE}>
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
                  <div key={field.key} className={INNER_BOX}>
                    {isEditing ? (
                      <form onSubmit={handleFormSubmit} className="space-y-2.5">
                        <label className={`block ${LABEL}`}>
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
                            className="mt-1.5 border-zinc-800 bg-zinc-900 text-sm text-white"
                          />
                        </label>

                        <div className="flex flex-wrap gap-2">
                          <Button
                            type="submit"
                            size="sm"
                            disabled={isSaving}
                            className="gap-1.5 bg-orange-600 text-xs font-semibold text-white hover:bg-orange-500"
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
                          <p className={LABEL}>{field.label}</p>
                          <p className="mt-1 text-sm font-medium break-all text-white">
                            {field.value}
                          </p>

                          {field.key === 'email' && emailManagedByOAuth && (
                            <span className="mt-2 inline-flex rounded-full border border-orange-500/30 bg-orange-500/10 px-2.5 py-0.5 text-[11px] font-semibold tracking-wider text-orange-400 uppercase">
                              {t('profile.managedByGoogle') ||
                                'Managed by Google'}
                            </span>
                          )}
                        </div>

                        {field.canEdit && (
                          <button
                            type="button"
                            onClick={() => startEditing(field.key)}
                            title={editLabel(field.label)}
                            aria-label={editLabel(field.label)}
                            className="rounded-lg border border-zinc-800 bg-zinc-900 p-2 text-zinc-400 transition-colors hover:border-orange-500/40 hover:text-orange-400"
                          >
                            <Pencil className="size-3.5" aria-hidden="true" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}

              {error && (
                <p className="text-xs font-medium text-red-400" role="alert">
                  {error}
                </p>
              )}

              {success && (
                <p className="inline-flex items-center gap-1 text-xs font-medium text-emerald-400">
                  <CheckCircle2 className="size-4" aria-hidden="true" />
                  {success}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Read-only account information */}
        <section className={SECTION_CARD}>
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-bold text-white">
              {t('profile.accountInformation') || 'Account information'}
            </h2>
            <span className={ORANGE_BADGE}>
              {t('profile.authentication') || 'Authentication'}
            </span>
          </div>

          <div className={`${INNER_BOX} mt-5`}>
            <LevelProgress xp={user.xp} />
          </div>

          <dl className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {readOnlyFields.map((field) => (
              <div key={field.label} className={INNER_BOX}>
                <dt className={LABEL}>{field.label}</dt>
                <dd
                  className={`mt-1 text-sm font-semibold break-all ${field.tone}`}
                >
                  {field.value}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Friends and social management */}
        <FriendList variant="profile" />
      </div>
    </div>
  );
}
