import type { ReactNode } from 'react';

import { UI } from '@/components/layout/layoutStyles';
import { GameModeSelector } from './GameModeSelector';
import { GameSettingsCard } from './GameSettingsCard';
import { LobbyStatusCard } from './LobbyStatusCard';
import { MapSelector } from './MapSelector';
import { MatchmakingButton } from './MatchmakingButton';

import type {
  GameMode,
  GameSettings,
  MapId,
  MatchmakingPayload,
} from '../types';

interface Props {
  selectedMode: GameMode;
  onModeChange: (mode: GameMode) => void;
  selectedMap: MapId;
  onMapChange: (map: MapId) => void;
  settings: GameSettings;
  onSettingsChange: (settings: GameSettings) => void;
  isHost: boolean;
  playersCount: number;
  isSearching: boolean;
  disabled?: boolean;
  countdown: number | null;
  onStart: (payload: MatchmakingPayload) => void;
  onCancelSearch: () => void;
  children?: ReactNode;
}

export function GameConfig({
  selectedMode,
  onModeChange,
  selectedMap,
  onMapChange,
  settings,
  onSettingsChange,
  isHost,
  playersCount,
  isSearching,
  disabled = false,
  countdown,
  onStart,
  onCancelSearch,
  children,
}: Props) {
  const payload: MatchmakingPayload = {
    mode: selectedMode,
    mapId: selectedMap,
    settings,
  };

  // En práctica el jugador configura su propia partida, aunque no sea el
  // anfitrión de la lobby.
  const canEditSettings = selectedMode === 'practice' || isHost;
  const controlsDisabled = disabled || isSearching;

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(290px,0.9fr)]">
      <div className={UI.shell.stack}>
        <GameModeSelector
          selectedMode={selectedMode}
          onChange={onModeChange}
          disabled={controlsDisabled}
        />

        <MapSelector
          selectedMap={selectedMap}
          onChange={onMapChange}
          disabled={controlsDisabled}
        />

        <GameSettingsCard
          settings={settings}
          onChange={onSettingsChange}
          isHost={canEditSettings}
          isPublicMode={selectedMode === 'public'}
          disabled={disabled}
        />

        <MatchmakingButton
          mode={selectedMode}
          payload={payload}
          playersCount={playersCount}
          isHost={isHost}
          isSearching={isSearching}
          disabled={disabled}
          countdown={countdown}
          onStart={onStart}
          onCancelSearch={onCancelSearch}
        />
      </div>

      <aside className={UI.shell.stack}>
        <LobbyStatusCard />
        {children}
      </aside>
    </div>
  );
}
