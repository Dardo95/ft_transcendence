import { useState } from 'react';
import { useFriendsStore } from '../store/useFriendsStore';

import { useLanguage } from '@/locales/useLanguage';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function AddFriendCard() {
  const { t } = useLanguage();
  const [targetUsername, setTargetUsername] = useState('');
  const [feedback, setFeedback] = useState<{
    text: string;
    isError: boolean;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const sendRequest = useFriendsStore((state) => state.sendFriendRequest);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!targetUsername.trim()) return;

    setIsSubmitting(true);
    setFeedback(null);

    try {
      await sendRequest(targetUsername.trim());
      setFeedback({
        text: `${t('app.friendRequestSent') || 'Solicitud enviada a'} ${targetUsername}`,
        isError: false,
      });
      setTargetUsername('');
    } catch (err: unknown) {
      setFeedback({
        text:
          err instanceof Error
            ? err.message
            : t('app.requestSendError') || 'Error al enviar solicitud',
        isError: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    // <Card className="rounded-2xl border border-zinc-700 bg-zinc-800/80 p-5 shadow-xl">
    <div className="flex flex-col gap-2 rounded-2xl border border-zinc-700 bg-zinc-800/80 p-5 shadow-xl">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="text"
          value={targetUsername}
          onChange={(e) => setTargetUsername(e.target.value)}
          placeholder={
            t('app.addFriendPlaceholder') ||
            'Añadir amigo: Introducir nombre de usuario exacto'
          }
          className="border-zinc-700 bg-zinc-950 text-xs text-white"
          disabled={isSubmitting}
        />
        <Button
          type="submit"
          disabled={isSubmitting || !targetUsername.trim()}
          className="bg-orange-600 px-4 text-xs font-semibold hover:bg-orange-500"
        >
          {isSubmitting ? '...' : t('app.addFriendButton') || 'Enviar'}
        </Button>
      </form>

      {feedback && (
        <p
          className={`mt-2 text-[11px] ${
            feedback.isError ? 'text-red-400' : 'text-emerald-400'
          }`}
        >
          {feedback.text}
        </p>
      )}
      {/* </Card> */}
    </div>
  );
}
