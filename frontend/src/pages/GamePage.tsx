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
    <div className="text-foreground mx-auto w-full max-w-[1440px] lg:flex lg:min-h-0 lg:flex-1 lg:flex-col">
      <GameViewport />
    </div>
  );
}
