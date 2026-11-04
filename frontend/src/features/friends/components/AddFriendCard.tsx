import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/locales/useLanguage';

interface UserSearchResult {
  id: number;
  username: string;
  avatarUrl?: string | null;
}

interface ApiResponse {
  data: UserSearchResult[];
  total: number;
  page: number;
  limit: number;
}

export function AddFriendCard() {
  const { t } = useLanguage();

  const [targetUsername, setTargetUsername] = useState('');
  const [results, setResults] = useState<UserSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Estados para el envío de solicitud por usuario
  const [sendingUser, setSendingUser] = useState<string | null>(null);
  const [sentMap, setSentMap] = useState<Record<string, boolean>>({});
  const [feedback, setFeedback] = useState<{
    text: string;
    isError: boolean;
  } | null>(null);

  // Referencia para cancelar la petición en vuelo
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const query = targetUsername.trim();

    // Requisito: Mínimo 2 caracteres; si está vacío, limpiar y no buscar
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

    // Debounce de ~300 ms
    const timer = setTimeout(async () => {
      // 1. Cancelar petición anterior si existía
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
          throw new Error('Error searching users');
        }

        const data: ApiResponse = await res.json();
        setResults(data.data || []);
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          return; // Cancelada de forma intencional por nueva pulsación
        }
        setSearchError('Error connecting to server');
      } finally {
        if (abortControllerRef.current === controller) {
          setIsLoading(false);
        }
      }
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [targetUsername]);

  // Enviar solicitud POST /api/users/me/friend-requests
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

      if (res.status === 409) {
        setSentMap((prev) => ({ ...prev, [username]: true }));
        setFeedback({
          text: `Solicitud ya enviada a ${username}`,
          isError: false,
        });
        return;
      }

      if (res.status === 404) {
        setSentMap((prev) => ({ ...prev, [username]: false }));
        setFeedback({
          text: `Usuario ${username} no encontrado`,
          isError: true,
        });
        return;
      }

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${res.status}`);
      }

      setSentMap((prev) => ({ ...prev, [username]: true }));
      setFeedback({ text: `Solicitud enviada a ${username}`, isError: false });
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
        text: err instanceof Error ? err.message : 'Error al enviar solicitud',
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
    <Card className="flex justify-between rounded-xl border border-zinc-700 bg-zinc-950/40 p-2.5 transition-colors hover:bg-zinc-800/40">
      <form onSubmit={handleFormSubmit} className="relative flex gap-2">
        <div className="relative flex-1">
          <Input
            type="text"
            value={targetUsername}
            onChange={(e) => setTargetUsername(e.target.value)}
            placeholder={
              t('app.friends.addFriendPlaceholder') ||
              'Añadir amigo: Introducir nombre de usuario'
            }
            className="border-zinc-700 bg-zinc-950 pr-7 text-xs text-white"
          />

          {isLoading && (
            <span className="absolute top-1/2 right-2.5 h-3.5 w-3.5 -translate-y-1/2 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
          )}
        </div>

        <Button
          type="submit"
          disabled={!queryTrimmed || !!sendingUser}
          className="bg-orange-600 px-4 text-xs font-semibold hover:bg-orange-500"
        >
          {sendingUser === queryTrimmed
            ? '...'
            : t('app.friends.addFriendButton') || 'Enviar'}
        </Button>
      </form>

      {/* Feedback general de éxito o error */}
      {feedback && (
        <p
          className={`my-2 flex items-center justify-center rounded-xl bg-white p-2.5 text-center text-xs font-semibold text-orange-500 ${
            feedback.isError ? 'text-red-400' : 'text-emerald-400'
          }`}
        >
          {feedback.text}
        </p>
      )}

      {/* Resultados de búsqueda con autocompletado flotante */}
      {showDropdown && (
        <div className="mt-2 max-h-56 w-full divide-y divide-zinc-900 overflow-y-auto rounded-xl border border-zinc-800 bg-zinc-950 p-1.5 shadow-2xl">
          {searchError && (
            <p className="p-2 text-center text-xs text-red-400">
              {searchError}
            </p>
          )}

          {!isLoading && !searchError && results.length === 0 && (
            <p className="p-2 text-center text-xs text-zinc-500">
              {t('app.friends.noResults') || 'No se encontraron usuarios.'}
            </p>
          )}

          {results.map((user) => {
            const isAlreadySent = sentMap[user.username];
            const isSubmittingThis = sendingUser === user.username;

            return (
              <div
                key={user.id}
                className="flex items-center justify-between rounded-lg p-2 transition-colors hover:bg-zinc-900/60"
              >
                <div className="flex min-w-0 items-center gap-2.5">
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.username}
                      className="h-7 w-7 rounded-full border border-zinc-700 object-cover"
                    />
                  ) : (
                    <div className="flex h-7 w-7 items-center justify-center rounded-full border border-zinc-700 bg-zinc-800 text-xs font-bold text-zinc-300">
                      {user.username.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <span className="truncate text-xs font-semibold text-zinc-200">
                    {user.username}
                  </span>
                </div>

                <Button
                  type="button"
                  size="sm"
                  disabled={isAlreadySent || isSubmittingThis}
                  onClick={() => handleSendRequest(user.username)}
                  className={`h-7 px-3 text-[11px] font-semibold transition-colors ${
                    isAlreadySent
                      ? 'bg-zinc-800 text-zinc-500'
                      : 'bg-orange-600 text-white hover:bg-orange-500'
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
