import { useState, type FormEvent } from 'react';
import type {
  UpdateProfileInput,
  UpdateProfileOutcome,
  UpdateProfileResponse,
  UserPrivate,
} from '@transcendence/shared';
import { CheckCircle2, Pencil, Save, X } from 'lucide-react';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { AvatarUpload } from './AvatarUpload';
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
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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

  const startEditing = () => {
    setUsername(user.username);
    setEmail(user.email);
    setError(null);
    setSuccess(null);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setUsername(user.username);
    setEmail(user.email);
    setError(null);
    setIsEditing(false);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    const nextUsername = username.trim();
    const nextEmail = email.trim();

    if (!nextUsername || !nextEmail) {
      setError(
        t('profile.fieldsRequired') || 'Username and email are required.'
      );
      return;
    }

    setIsSaving(true);
    try {
      const result = await onUpdateProfile({
        username: nextUsername,
        email: nextEmail,
      });

      if (result.outcome === 'updated') {
        setIsEditing(false);
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

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      {/* User Information Card */}
      <Card className="flex flex-col items-center gap-6 rounded-2xl border-zinc-800 bg-zinc-900 p-6 shadow-xl md:flex-row md:items-start">
        <AvatarUpload
          currentAvatarUrl={user.avatarUrl}
          username={user.username}
          onAvatarUpdated={onAvatarUpload}
        />

        <div className="w-full flex-1 space-y-4 text-center md:text-left">
          <div>
            <div className="flex items-center justify-center gap-3 md:justify-start">
              <h2 className="text-2xl font-bold tracking-wide text-white">
                {user.username}
              </h2>
              <span className="rounded-full border border-orange-800/40 bg-orange-950/60 px-2.5 py-0.5 text-xs font-semibold text-orange-400">
                User #{user.id}
              </span>
            </div>
            <p className="mt-1 text-xs text-zinc-400">
              {t('profile.joined') || 'Registered on'}:{' '}
              {user.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : '2026'}
            </p>
          </div>

          {isEditing ? (
            <form
              onSubmit={handleSubmit}
              className="space-y-3 border-t border-zinc-800/80 pt-4 text-left"
            >
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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
                    disabled={isSaving}
                  />
                </label>
              </div>

              {error && (
                <p className="text-xs font-medium text-red-400" role="alert">
                  {error}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-2">
                <Button type="submit" size="sm" disabled={isSaving}>
                  <Save className="size-4" />
                  {isSaving
                    ? t('profile.saving') || 'Saving...'
                    : t('profile.save') || 'Save changes'}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={cancelEditing}
                  disabled={isSaving}
                >
                  <X className="size-4" />
                  {t('profile.cancel') || 'Cancel'}
                </Button>
              </div>
            </form>
          ) : (
            <div className="border-t border-zinc-800/80 pt-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-3 text-left">
                  <span className="block text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
                    {t('profile.email') || 'Email'}
                  </span>
                  <span className="text-sm break-all text-zinc-200">
                    {user.email}
                  </span>
                </div>

                <div className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-3 text-left">
                  <span className="block text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
                    {t('profile.userId') || 'User ID'}
                  </span>
                  <span className="text-sm font-semibold text-orange-400">
                    #{user.id}
                  </span>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-3">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={startEditing}
                >
                  <Pencil className="size-4" />
                  {t('profile.editProfile') || 'Edit profile'}
                </Button>
                {success && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-400">
                    <CheckCircle2 className="size-4" />
                    {success}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Friends & Social Management */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <FriendList />
        </div>
      </div>
    </div>
  );
}
