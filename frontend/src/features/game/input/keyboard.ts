import type { MovementInput } from '@transcendence/shared';

export type DirectionKey = 'up' | 'down' | 'left' | 'right';

const KEY_TO_DIRECTION: Record<string, DirectionKey> = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
  w: 'up',
  s: 'down',
  a: 'left',
  d: 'right',
};

const BOMB_KEYS = new Set([' ', 'Spacebar']);

const PREVENT_DEFAULT_KEYS = new Set([
  'ArrowUp',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  ' ',
  'Spacebar',
]);

const STOPPED: MovementInput = {
  up: false,
  down: false,
  left: false,
  right: false,
};

export interface KeyboardHandlers {
  onMovement: (movement: MovementInput) => void;
  onPlaceBomb: () => void;
}

function normalizeKey(key: string): string {
  return key.length === 1 ? key.toLowerCase() : key;
}

function getPressedKeyId(event: KeyboardEvent): string {
  // `code` distingue teclas físicas distintas que producen la misma
  // dirección (por ejemplo, W y ArrowUp). En entornos sin `code`,
  // usamos `key` como alternativa.
  return event.code || event.key;
}

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  const tag = target.tagName;

  return (
    tag === 'INPUT' ||
    tag === 'TEXTAREA' ||
    tag === 'SELECT' ||
    target.isContentEditable
  );
}

/**
 * Captura de teclado para el juego.
 *
 * - `preventDefault` en flechas y espacio: la página no hace scroll.
 * - Ignora `event.repeat`: mantener la tecla no dispara eventos nuevos.
 * - Si hay varias direcciones pulsadas, gana la última.
 * - Al soltar la última, recupera la anterior si sigue pulsada.
 * - No roba teclas si el foco está en un campo de texto.
 * - Al perder foco (`blur`) se limpia el estado para que el jugador
 *   no quede "atorado" moviéndose.
 */
export class KeyboardController {
  private readonly pressedKeys = new Map<string, DirectionKey>();
  private readonly handlers: KeyboardHandlers;
  private attached = false;

  constructor(handlers: KeyboardHandlers) {
    this.handlers = handlers;
  }

  attach(): void {
    if (this.attached) {
      return;
    }

    this.attached = true;
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
    window.addEventListener('blur', this.handleBlur);
  }

  destroy(): void {
    if (!this.attached) {
      return;
    }

    this.attached = false;
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    window.removeEventListener('blur', this.handleBlur);
    this.pressedKeys.clear();
  }

  private readonly handleKeyDown = (event: KeyboardEvent): void => {
    if (isEditableTarget(event.target)) {
      return;
    }

    if (PREVENT_DEFAULT_KEYS.has(event.key)) {
      event.preventDefault();
    }

    // Sin repeat: mantener la tecla no vuelve a emitir.
    if (event.repeat) {
      return;
    }

    if (BOMB_KEYS.has(event.key)) {
      this.handlers.onPlaceBomb();
      return;
    }

    const direction = KEY_TO_DIRECTION[normalizeKey(event.key)];

    if (!direction) {
      return;
    }

    const keyId = getPressedKeyId(event);

    // Map conserva el orden de inserción. Reinsertar esta tecla hace
    // que pase a ser la más reciente, sin mezclar teclas físicas.
    this.pressedKeys.delete(keyId);
    this.pressedKeys.set(keyId, direction);
    this.emitMovement();
  };

  private readonly handleKeyUp = (event: KeyboardEvent): void => {
    if (isEditableTarget(event.target)) {
      return;
    }

    const keyId = getPressedKeyId(event);

    if (this.pressedKeys.delete(keyId)) {
      this.emitMovement();
    }
  };

  private readonly handleBlur = (): void => {
    if (this.pressedKeys.size === 0) {
      return;
    }

    this.pressedKeys.clear();
    this.handlers.onMovement(STOPPED);
  };

  private emitMovement(): void {
    let activeDirection: DirectionKey | undefined;

    // La última entrada insertada representa la última tecla pulsada.
    for (const direction of this.pressedKeys.values()) {
      activeDirection = direction;
    }

    if (!activeDirection) {
      this.handlers.onMovement(STOPPED);
      return;
    }

    this.handlers.onMovement({
      up: activeDirection === 'up',
      down: activeDirection === 'down',
      left: activeDirection === 'left',
      right: activeDirection === 'right',
    });
  }
}
