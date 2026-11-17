import { GameViewport } from '../features/game';

/**
 * Route-level shell for a game.
 *
 * GameViewport owns the Pixi renderer, game connection, input handling,
 * camera, HUD and end screens so the page remains responsible only for
 * mounting the game experience.
 */
export function GamePage() {
  return (
    <div className="h-full w-full">
      <GameViewport />
    </div>
  );
}
