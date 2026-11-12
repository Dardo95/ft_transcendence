import { useState, type FormEvent } from 'react';
import type {
  UpdateProfileInput,
  UpdateProfileOutcome,
  UpdateProfileResponse,
  UserPrivate,
} from '@transcendence/shared';
import { CheckCircle2, Save } from 'lucide-react';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { AvatarUpload } from './AvatarUpload';
import { LevelProgress } from './LevelProgress';
import { FriendList } from '../../friends/components/FriendListCard';
import { useLanguage } from '../../../locales/useLanguage';

interface PrivateProfileViewProps {
  user: UserPrivate;
  onAvatarUpload: (blob: Blob) => Promise<void>;
  onUpdateProfile: (
    input: UpdateProfileInput
  ) => Promise<UpdateProfileResponse>;
}

export function PrivateProfileView({
  user,
  onAvatarUpload,
  onUpdateProfile,
}: PrivateProfileViewProps) {
  const { t } = useLanguage();
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const emailManagedByOAuth = user.oauthProvider !== null;
  const registrationDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString()
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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    const nextUsername = username.trim();
    const nextEmail = email.trim();

    if (!nextUsername || (!emailManagedByOAuth && !nextEmail)) {
      setError(
        t('profile.fieldsRequired') || 'Username and email are required.'
      );
      return;
    }

    setIsSaving(true);
    try {
      const result = await onUpdateProfile({
        username: nextUsername,
        ...(emailManagedByOAuth ? {} : { email: nextEmail }),
      });

      if (result.outcome === 'updated') {
        setSuccess(t('profile.updated') || 'Profile updated successfully.');
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

  const readOnlyFields = [
    {
      label: t('profile.userId') || 'User ID',
      value: `#${user.id}`,
      accent: true,
    },
    {
      label: t('profile.joined') || 'Registered on',
      value: registrationDate,
    },
    {
      label: t('profile.authentication') || 'Authentication',
      value: authenticationMethod,
    },
    {
      label: t('profile.twoFactor') || 'Two-factor authentication',
      value: twoFactorStatus,
    },
  ];

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      {/* Block A: editable profile data */}
      <Card className="rounded-2xl border-zinc-800 bg-zinc-900 p-6 shadow-xl">
        <h3 className="text-xs font-bold tracking-wider text-zinc-300 uppercase">
          {t('profile.profileDetails') || 'Profile details'}
        </h3>

        <div className="mt-5 flex flex-col items-center gap-6 md:flex-row md:items-start">
          <AvatarUpload
            currentAvatarUrl={user.avatarUrl}
            username={user.username}
            onAvatarUpdated={onAvatarUpload}
          />

          <form
            onSubmit={handleSubmit}
            className="w-full flex-1 space-y-4 text-left"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="space-y-1 text-xs font-semibold tracking-wide text-zinc-400 uppercase">
                {t('profile.username') || 'Username'}
                <Input
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  maxLength={20}
                  autoComplete="username"
                  disabled={isSaving}
                />
              </label>

              <label className="space-y-1 text-xs font-semibold tracking-wide text-zinc-400 uppercase">
                {t('profile.email') || 'Email'}
                <Input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
                  disabled={isSaving || emailManagedByOAuth}
                />
              </label>
            </div>

            {emailManagedByOAuth && (
              <p className="text-xs text-zinc-500">
                {t('profile.managedByGoogle') || 'Managed by Google'}
              </p>
            )}

            {error && (
              <p className="text-xs font-medium text-red-400" role="alert">
                {error}
              </p>
            )}

            {success && (
              <p className="inline-flex items-center gap-1 text-xs font-medium text-emerald-400">
                <CheckCircle2 className="size-4" />
                {success}
              </p>
            )}

            <Button type="submit" size="sm" disabled={isSaving}>
              <Save className="size-4" />
              {isSaving
                ? t('profile.saving') || 'Saving...'
                : t('profile.save') || 'Save changes'}
            </Button>
          </form>
        </div>
      </Card>

      {/* Block B: read-only account data */}
      <Card className="rounded-2xl border-zinc-800 bg-zinc-900 p-6 shadow-xl">
        <h3 className="text-xs font-bold tracking-wider text-zinc-300 uppercase">
          {t('profile.accountInformation') || 'Account information'}
        </h3>

        <div className="mt-4">
          <LevelProgress xp={user.xp} />
        </div>

        <dl className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {readOnlyFields.map((field) => (
            <div
              key={field.label}
              className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-3"
            >
              <dt className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
                {field.label}
              </dt>
              <dd
                className={`mt-0.5 text-sm break-all ${
                  field.accent
                    ? 'font-semibold text-orange-400'
                    : 'text-zinc-200'
                }`}
              >
                {field.value}
              </dd>
            </div>
          ))}
        </dl>
      </Card>

      {/* Friends & Social Management */}
      <div className="gap-6">
        <FriendList />
      </div>
    </div>
  );
}
