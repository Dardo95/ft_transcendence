import type { CSSProperties } from 'react';
import type { GameSnapshot, Position } from '@transcendence/shared';

interface GameBoardProps {
  snapshot: GameSnapshot;
  playerId: string | null;
}

function tileClass(tile: string): string {
  switch (tile) {
    case 'INDESTRUCTIBLE':
      return 'game-tile game-tile--indestructible';
    case 'DESTRUCTIBLE':
      return 'game-tile game-tile--destructible';
    default:
      return 'game-tile game-tile--floor';
  }
}

function centeredPosition(
  position: Position,
  width: number,
  height: number,
  tilePosition = false
): CSSProperties {
  const offset = tilePosition ? 0.5 : 0;
  return {
    left: `${((position.x + offset) / width) * 100}%`,
    top: `${((position.y + offset) / height) * 100}%`,
  };
}

const playerStyles = [
  'game-player-token--orange',
  'game-player-token--cyan',
  'game-player-token--violet',
  'game-player-token--lime',
];

export function GameBoard({ snapshot, playerId }: GameBoardProps) {
  const { width, height, tiles } = snapshot.board;

  return (
    <div className="game-board-frame">
      <div
        className="game-board"
        style={{
          gridTemplateColumns: `repeat(${width}, minmax(0, 1fr))`,
          aspectRatio: `${width} / ${height}`,
        }}
        role="img"
        aria-label={`Arena de ${width} por ${height} casillas`}
      >
        {tiles.flatMap((row, y) =>
          row.map((tile, x) => (
            <div
              key={`${x}-${y}`}
              className={`${tileClass(tile)} game-tile--pattern-${(x + y) % 4}`}
              aria-hidden="true"
            />
          ))
        )}

        <div className="game-board-entities">
          {snapshot.explosions.flatMap((explosion) =>
            explosion.cells.map((cell, index) => (
              <div
                key={`explosion-${explosion.id}-${index}`}
                className="game-explosion"
                style={centeredPosition(cell, width, height, true)}
                aria-label="Explosión"
              >
                <span>✹</span>
              </div>
            ))
          )}

          {snapshot.powerUps.map((powerUp) => (
            <div
              key={powerUp.id}
              className={`game-powerup game-powerup--${powerUp.type.toLowerCase()}`}
              style={centeredPosition(powerUp.position, width, height, true)}
              title={powerUp.type}
            >
              {powerUp.type === 'EXTRA_BOMB'
                ? '✚'
                : powerUp.type === 'BLAST_RADIUS'
                  ? '✹'
                  : '⚡'}
            </div>
          ))}

          {snapshot.bombs.map((bomb) => (
            <div
              key={bomb.id}
              className="game-bomb"
              style={centeredPosition(bomb.position, width, height, true)}
              title={`Bomba · alcance ${bomb.blastRadius}`}
            >
              <span />
            </div>
          ))}

          {snapshot.players.map((player, index) => {
            const isMe = player.id === playerId;
            const playerName = player.displayName || `Jugador ${index + 1}`;

            return (
              <div
                key={player.id}
                className={`game-player-token ${playerStyles[index % playerStyles.length]}${
                  player.alive ? '' : 'game-player-token--dead'
                }${isMe ? 'game-player-token--me' : ''}`}
                style={{
                  left: `${(player.position.x / width) * 100}%`,
                  top: `${(player.position.y / height) * 100}%`,
                }}
                title={`${playerName}${player.isBot ? ' · Bot' : ''}${isMe ? ' · Tú' : ''}`}
              >
                <span className="game-player-token__face">
                  {player.isBot ? '🤖' : '👨‍🍳'}
                </span>
                <span className="game-player-token__name">
                  {playerName}
                  {isMe ? ' · TÚ' : ''}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
