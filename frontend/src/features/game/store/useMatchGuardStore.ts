import { create } from 'zustand';

/**
 * Guardia de salida de una partida (GAME-F-17).
 *
 * Mientras hay una partida de servidor en vuelo (`armed`),
 * cualquier salida —botón Salir, logout, navegación interna o
 * cerrar la pestaña— pasa por `request`, que abre el modal de
 * confirmación en vez de actuar directamente. Fuera de partida
 * `request` ejecuta la acción sin más (cero overhead).
 *
 * No:
 * - Interceptar el botón "atrás" del navegador (BrowserRouter
 *   no soporta `useBlocker` sin migrar a data router).
 * - Demo ni a los espectadores: lo decide `GameViewport`
 */

export interface MatchGuardState {
  /** true solo con partida de servidor en juego y sin espectar. */
  armed: boolean;
  /** Abandono (derrota) registrado por `GameViewport`. */
  abandon: (() => void) | null;
  /** Modal visible. */
  open: boolean;
  /** Salida aplazada hasta que el jugador elija. */
  pending: PendingMatchExit | null;
  arm: (abandon: () => void) => void;
  disarm: () => void;
  /** Pide confirmación; sin partida en vuelo ejecuta `proceed`. */
  request: (exit: {
    abandon?: (() => void) | null;
    proceed: () => void;
  }) => void;
  /** Abandonar (derrota) y continuar. */
  confirmAbandon: () => void;
  /** Dejar en segundo plano: solo continuar, sin abandono. */
  confirmBackground: () => void;
  /** Cerrar el modal sin actuar. */
  cancel: () => void;
}

interface PendingMatchExit {
  abandon: (() => void) | null;
  proceed: () => void;
}

export const useMatchGuardStore = create<MatchGuardState>((set, get) => ({
  armed: false,
  abandon: null,
  open: false,
  pending: null,

  arm: (abandon) => set({ armed: true, abandon }),

  disarm: () =>
    set({ armed: false, abandon: null, open: false, pending: null }),

  request: ({ abandon, proceed }) => {
    if (!get().armed) {
      proceed();
      return;
    }

    set({
      open: true,
      pending: { abandon: abandon ?? get().abandon, proceed },
    });
  },

  confirmAbandon: () => {
    const { pending } = get();
    set({ open: false, pending: null });
    pending?.abandon?.();
    pending?.proceed();
  },

  confirmBackground: () => {
    const { pending } = get();
    set({ open: false, pending: null });
    pending?.proceed();
  },

  cancel: () => set({ open: false, pending: null }),
}));
