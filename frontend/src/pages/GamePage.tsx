import { Navigate, useParams, useSearchParams } from 'react-router-dom';

import { GameViewport } from '@/features/game';
import { SpectatorPage } from '@/features/spectator/components/SpectatorPage';

/**
 * Route-level shell for a game.
 *
 * GameViewport owns the Pixi renderer, game connection, input handling,
 * camera, HUD and end screens so the page remains responsible only for
 * mounting the game experience.
 */
export function GamePage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();

  if (!id) {
    return <Navigate to="/lobby" replace />;
  }

  const isSpectator = searchParams.get('mode') === 'spectator';

  return (
    <div className="text-foreground mx-auto w-full max-w-[1440px] lg:flex lg:min-h-0 lg:flex-1 lg:flex-col">
      {isSpectator ? <SpectatorPage gameId={id} /> : <GameViewport />}
    </div>
  );
}
