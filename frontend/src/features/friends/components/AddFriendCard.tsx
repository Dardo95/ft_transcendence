import { useState, useEffect, useRef } from 'react';
import type { UserPublic } from '@transcendence/shared';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { UI } from '@/components/layout/layoutStyles';
import { useLanguage } from '@/locales/useLanguage';

type FeedbackState = {
  text: string;
  isError: boolean;
};

interface ApiResponse {
  data: UserPublic[];
  total: number;
  page: number;
  limit: number;
}

type AddFriendCardVariant = 'lobby' | 'profile';

interface AddFriendCardProps {
  variant?: AddFriendCardVariant;
}

export function AddFriendCard({ variant = 'lobby' }: AddFriendCardProps) {
  const { t } = useLanguage();
  const isProfile = variant === 'profile';

  const [targetUsername, setTargetUsername] = useState('');
  const [results, setResults] = useState<UserPublic[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Per-user friend request submission state
  const [sendingUser, setSendingUser] = useState<string | null>(null);
  const [sentMap, setSentMap] = useState<Record<string, boolean>>({});
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);

  // Reference used to cancel an in-flight search request
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const query = targetUsername.trim();

    // Require at least 2 characters; clear results when the query is empty
    if (query.length < 2) {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      setTimeout(() => {
        setResults([]);
        setIsLoading(false);
        setSearchError(null);
      }, 0);
      return;
    }

    // Debounce of about 300 ms
    const timer = setTimeout(async () => {
      // Cancel the previous request if there was one
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;

      setIsLoading(true);
      setSearchError(null);

      try {
        const res = await fetch(
          `/api/users?q=${encodeURIComponent(query)}&page=1&limit=20`,
          {
            credentials: 'include',
            signal: controller.signal,
          }
        );

        if (!res.ok) {
          setSearchError(t('app.friends.friendSearchError'));
          return;
        }

        const data: ApiResponse = await res.json();
        setResults(data.data || []);
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          return; // Intentionally cancelled by a newer keystroke
        }
        setSearchError(t('app.friends.networkError'));
      } finally {
        if (abortControllerRef.current === controller) {
          setIsLoading(false);
        }
      }
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [targetUsername, t]);

  // Send the request to POST /api/users/me/friend-requests
  async function handleSendRequest(username: string) {
    if (!username.trim() || sendingUser) return;

    setSendingUser(username);
    setFeedback(null);

    try {
      const res = await fetch('/api/users/me/friend-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username }),
      });

      const body = (await res.json().catch(() => ({}))) as {
        outcome?: string;
        message?: string;
      };

      if (!res.ok) {
        throw new Error(body.message || `Error ${res.status}`);
      }

      if (body.outcome === 'not_found') {
        setSentMap((prev) => ({ ...prev, [username]: false }));
        setFeedback({
          text: t('app.friends.friendNotFound').replace('{username}', username),
          isError: true,
        });
        return;
      }

      if (body.outcome === 'already_exists') {
        setSentMap((prev) => ({ ...prev, [username]: true }));
        setFeedback({
          text: t('app.friends.friendAlreadySent').replace(
            '{username}',
            username
          ),
          isError: false,
        });
        return;
      }

      if (body.outcome === 'self') {
        setFeedback({
          text: t('app.friends.friendSelfRequest'),
          isError: true,
        });
        return;
      }

      if (body.outcome === 'blocked') {
        setFeedback({
          text: t('app.friends.friendBlocked'),
          isError: true,
        });
        return;
      }

      setSentMap((prev) => ({ ...prev, [username]: true }));
      setFeedback({
        text: t('app.friends.friendRequestSentTo').replace(
          '{username}',
          username
        ),
        isError: false,
      });
    } catch (err: unknown) {
      // Ignore network / abort errors (no console noise)
      if (err instanceof DOMException && err.name === 'AbortError') return;
      if (
        err instanceof TypeError &&
        (err.message?.includes('fetch') ||
          err.message?.includes('Failed to fetch'))
      )
        return;
      setFeedback({
        text:
          err instanceof Error && err.message
            ? err.message
            : t('app.friends.sendRequestError'),
        isError: true,
      });
    } finally {
      setSendingUser(null);
    }
  }

  function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (targetUsername.trim()) {
      handleSendRequest(targetUsername.trim());
    }
  }

  const queryTrimmed = targetUsername.trim();
  const showDropdown = queryTrimmed.length >= 2;

  return (
    <Card
      className={`flex flex-col gap-2 transition-colors ${
        isProfile ? 'p-3.5' : `${UI.row.interactive} p-2.5`
      }`}
    >
      <form
        onSubmit={handleFormSubmit}
        className="relative flex w-full items-center gap-2"
      >
        <div className="relative min-w-0 flex-1">
          <Input
            type="text"
            value={targetUsername}
            onChange={(e) => setTargetUsername(e.target.value)}
            placeholder={
              t('app.friends.addFriendPlaceholder') ||
              'Añadir amigo: Introducir nombre de usuario'
            }
            className={`w-full pr-7 ${isProfile ? 'text-sm' : 'text-xs'}`}
          />

          {isLoading && (
            <span className="border-primary absolute top-1/2 right-2.5 h-3.5 w-3.5 -translate-y-1/2 animate-spin rounded-full border-2 border-t-transparent" />
          )}
        </div>

        <Button
          type="submit"
          disabled={!queryTrimmed || !!sendingUser}
          className="shrink-0 px-4 text-xs font-semibold"
        >
          {sendingUser === queryTrimmed
            ? '...'
            : t('app.friends.addFriendButton') || 'Enviar'}
        </Button>
      </form>

      {/* General success or error feedback */}
      {feedback && (
        <p
          className={`${UI.feedback.banner} ${
            feedback.isError ? UI.feedback.error : UI.feedback.success
          }`}
        >
          {feedback.text}
        </p>
      )}

      {/* Autocomplete search results stacked cleanly below the form */}
      {showDropdown && (
        <div
          className={`max-h-56 w-full overflow-y-auto p-1.5 shadow-2xl ${UI.card.inner} ${UI.row.dividerList}`}
        >
          {searchError && (
            <p className="text-destructive p-2 text-center text-xs">
              {searchError}
            </p>
          )}

          {!isLoading && !searchError && results.length === 0 && (
            <p className="text-muted-foreground p-2 text-center text-xs">
              {t('app.friends.noResults') || 'No se encontraron usuarios.'}
            </p>
          )}

          {results.map((user) => {
            const isAlreadySent = sentMap[user.username];
            const isSubmittingThis = sendingUser === user.username;

            return (
              <div
                key={user.id}
                className={`${UI.row.item} ${UI.row.interactive}`}
              >
                <div className="flex min-w-0 items-center gap-2.5">
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.username}
                      className={UI.avatar.sm}
                    />
                  ) : (
                    <div className={UI.avatar.fallback}>
                      {user.username.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <span className="text-foreground truncate text-xs font-semibold">
                    {user.username}
                  </span>
                </div>

                <Button
                  type="button"
                  size="sm"
                  disabled={isAlreadySent || isSubmittingThis}
                  onClick={() => handleSendRequest(user.username)}
                  className={`${UI.btn.chip} ${
                    isAlreadySent ? UI.btn.secondary : UI.btn.chipActive
                  }`}
                >
                  {isSubmittingThis
                    ? '...'
                    : isAlreadySent
                      ? t('app.friends.sent') || 'Enviada'
                      : t('app.friends.add') || '+ Añadir'}
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
