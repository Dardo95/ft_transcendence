import type { CSSProperties } from 'react';
import type {
  GameSnapshot,
  Position,
  TerrainType,
} from '@transcendence/shared';

interface GameBoardProps {
  snapshot: GameSnapshot;
  playerId: string | null;
}

const FLOOR_COLORS = ['#39443b', '#3e493e', '#354137', '#41493d'];

const playerStyles = [
  'bg-[#e9793d]',
  'bg-[#2ca9b3]',
  'bg-[#8c6ac5]',
  'bg-[#87a94e]',
];

function tileStyle(tile: TerrainType, x: number, y: number): CSSProperties {
  if (tile === 'INDESTRUCTIBLE') {
    return {
      background: 'linear-gradient(145deg, #737b78, #424b4b 55%, #2c3435)',
      border: '1px solid #616968',
      boxShadow:
        'inset 0 2px 2px rgba(255, 255, 255, 0.18), inset 0 -3px 3px rgba(0, 0, 0, 0.35)',
    };
  }

  if (tile === 'DESTRUCTIBLE') {
    return {
      background: 'linear-gradient(145deg, #a36a3e, #70462f 58%, #4b3024)',
      border: '1px solid #70452d',
      boxShadow:
        'inset 0 2px 2px rgba(255, 220, 169, 0.2), inset 0 -3px 3px rgba(0, 0, 0, 0.3)',
    };
  }

  return {
    backgroundColor: FLOOR_COLORS[(x + y) % FLOOR_COLORS.length],
    backgroundImage:
      'linear-gradient(135deg, rgba(255, 255, 255, 0.035) 25%, transparent 25%), linear-gradient(315deg, rgba(0, 0, 0, 0.09) 25%, transparent 25%)',
    backgroundSize: '8px 8px',
    border: '1px solid rgba(15, 24, 20, 0.18)',
  };
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

export function GameBoard({ snapshot, playerId }: GameBoardProps) {
  const { width, height, tiles } = snapshot.board;

  return (
    <div className="w-full overflow-hidden rounded-[0.45rem] border-[5px] border-[#14191b] bg-[#0c1112] shadow-[0_15px_35px_rgba(0,0,0,0.4),inset_0_0_0_1px_rgba(255,255,255,0.08)]">
      <div
        className="relative isolate grid w-full overflow-hidden bg-[#202a27]"
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
              className="relative min-h-0 min-w-0"
              style={tileStyle(tile, x, y)}
              aria-hidden="true"
            >
              {tile === 'INDESTRUCTIBLE' && (
                <span className="absolute inset-[16%] rounded-[2px] border border-[#0f1414]/35" />
              )}
              {tile === 'DESTRUCTIBLE' && (
                <>
                  <span className="absolute inset-[12%] rounded-[2px] border-2 border-[#3a1f12]/50" />
                  <span className="absolute top-[12%] bottom-[12%] left-1/2 w-0.5 bg-[#3a1f12]/45" />
                </>
              )}
            </div>
          ))
        )}

        <div className="pointer-events-none absolute inset-0 z-[2]">
          {snapshot.explosions.flatMap((explosion) =>
            explosion.cells.map((cell, index) => (
              <div
                key={`explosion-${explosion.id}-${index}`}
                className="absolute grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-[25%] bg-[radial-gradient(circle,rgba(255,248,178,0.98)_5%,rgba(255,176,54,0.85)_40%,rgba(229,61,32,0.42)_72%,transparent_100%)] text-[clamp(0.9rem,2.6vw,2rem)] text-[#fff5c0] [text-shadow:0_0_9px_#ff502d]"
                style={{
                  ...centeredPosition(cell, width, height, true),
                  width: `${(100 / width) * 0.92}%`,
                  height: `${(100 / height) * 0.92}%`,
                }}
                aria-label="Explosión"
              >
                <span>✹</span>
              </div>
            ))
          )}

          {snapshot.powerUps.map((powerUp) => (
            <div
              key={powerUp.id}
              className={`absolute grid h-[48%] max-h-7 w-[48%] max-w-7 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-[30%] border-2 border-[#fff0bd] text-[clamp(0.65rem,1.5vw,1rem)] font-black text-[#322316] shadow-[0_0_12px_rgba(255,206,103,0.5)] ${
                powerUp.type === 'SPEED'
                  ? 'bg-[linear-gradient(145deg,#bde88e,#4d914e)]'
                  : powerUp.type === 'BLAST_RADIUS'
                    ? 'bg-[linear-gradient(145deg,#ffc2a0,#d75e3e)]'
                    : 'bg-[linear-gradient(145deg,#f3d57f,#b67b31)]'
              }`}
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
              className="absolute grid aspect-square w-[5%] min-w-4 -translate-x-1/2 -translate-y-1/2 animate-pulse place-items-center rounded-full border-2 border-[#14191a] bg-[radial-gradient(circle_at_32%_25%,#838b88,#222827_65%)] shadow-[0_0_0_2px_rgba(255,177,73,0.28),0_3px_7px_rgba(0,0,0,0.45)]"
              style={centeredPosition(bomb.position, width, height, true)}
              title={`Bomba · alcance ${bomb.blastRadius}`}
            >
              <span className="absolute -top-[17%] right-[7%] h-[32%] w-[32%] rotate-[30deg] border-t-2 border-r-2 border-[#f0b35f]" />
            </div>
          ))}

          {snapshot.players.map((player, index) => {
            const isMe = player.id === playerId;
            const playerName = player.displayName || `Jugador ${index + 1}`;

            return (
              <div
                key={player.id}
                className={`absolute grid aspect-square w-[5.2%] min-w-[18px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-white/85 shadow-[0_3px_8px_rgba(0,0,0,0.45)] transition-[left,top,opacity] duration-75 ${
                  playerStyles[index % playerStyles.length]
                } ${player.alive ? '' : 'opacity-25 grayscale'} ${
                  isMe ? 'ring-2 ring-[#fff2b9] ring-offset-2' : ''
                }`}
                style={{
                  left: `${(player.position.x / width) * 100}%`,
                  top: `${(player.position.y / height) * 100}%`,
                }}
                title={`${playerName}${player.isBot ? ' · Bot' : ''}${isMe ? ' · Tú' : ''}`}
              >
                <span className="text-[clamp(0.55rem,2vw,1.15rem)] leading-none drop-shadow-[0_2px_2px_rgba(0,0,0,0.4)]">
                  {player.isBot ? '🤖' : '🧑'}
                </span>
                <span className="absolute top-[calc(100%+3px)] left-1/2 max-w-[90px] -translate-x-1/2 overflow-hidden rounded-[3px] bg-[#090c0d]/83 px-1 py-px text-[clamp(0.38rem,0.7vw,0.58rem)] font-black text-ellipsis whitespace-nowrap text-white">
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
