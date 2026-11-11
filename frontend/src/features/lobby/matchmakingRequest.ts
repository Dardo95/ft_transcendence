import type { MatchmakingPayload } from './types';

/** Forma de `mode` que espera el gateway (`game:matchmaking`). */
export type ServerGameMode = 'PUBLIC' | 'PRIVATE' | 'PRACTICE';

export interface ServerMatchmakingRequest {
  mode: ServerGameMode;
  mapId: string;
  settings: MatchmakingPayload['settings'];
}

const MODE_TO_SERVER: Record<MatchmakingPayload['mode'], ServerGameMode> = {
  practice: 'PRACTICE',
  private: 'PRIVATE',
  public: 'PUBLIC',
};

/** Traduce el payload local del lobby al protocolo del backend. */
export function toServerMatchmakingRequest(
  payload: MatchmakingPayload
): ServerMatchmakingRequest {
  return {
    mode: MODE_TO_SERVER[payload.mode],
    mapId: payload.mapId,
    settings: payload.settings,
  };
}
