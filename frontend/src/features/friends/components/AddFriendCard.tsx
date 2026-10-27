import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useFriendsStore } from '../store/useFriendsStore';

export function AddFriendCard() {
  const [targetUsername, setTargetUsername] = useState('');
  const [feedback, setFeedback] = useState<{
    text: string;
    isError: boolean;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const sendRequest = useFriendsStore((state) => state.sendRequest);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!targetUsername.trim()) return;

    setIsSubmitting(true);
    setFeedback(null);

    try {
      await sendRequest(targetUsername.trim());
      setFeedback({
        text: `Solicitud enviada a ${targetUsername}`,
        isError: false,
      });
      setTargetUsername('');
    } catch (err: unknown) {
      setFeedback({
        text: err instanceof Error ? err.message : 'Error al enviar solicitud',
        isError: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="rounded-2xl border border-zinc-700 bg-zinc-800/80 p-5 shadow-xl">
      <div className="mb-3">
        <h3 className="text-sm font-bold tracking-wide text-white">
          Solcitud de amistad
        </h3>
        <p className="mt-0.5 text-[11px] text-zinc-400">
          Envía una solicitud de amistad por nombre de usuario.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="text"
          value={targetUsername}
          onChange={(e) => setTargetUsername(e.target.value)}
          placeholder="Nombre de usuario exacto..."
          className="border-zinc-700 bg-zinc-950 text-xs"
          disabled={isSubmitting}
        />
        <Button
          type="submit"
          disabled={isSubmitting || !targetUsername.trim()}
          className="bg-orange-600 px-4 text-xs font-semibold hover:bg-orange-500"
        >
          {isSubmitting ? '...' : 'Enviar'}
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
    </Card>
  );
}
