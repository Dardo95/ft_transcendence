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
 * - No roba teclas si el foco está en un campo de texto.
 * - Al perder foco (`blur`) se limpia el estado para que el jugador
 *   no quede "atorado" moviéndose.
 */
export class KeyboardController {
  private readonly pressed = new Set<DirectionKey>();
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
    this.pressed.clear();
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

    const direction = KEY_TO_DIRECTION[event.key];

    if (!direction) {
      return;
    }

    this.pressed.add(direction);
    this.emitMovement();
  };

  private readonly handleKeyUp = (event: KeyboardEvent): void => {
    if (isEditableTarget(event.target)) {
      return;
    }

    const direction = KEY_TO_DIRECTION[event.key];

    if (!direction) {
      return;
    }

    this.pressed.delete(direction);
    this.emitMovement();
  };

  private readonly handleBlur = (): void => {
    if (this.pressed.size === 0) {
      return;
    }

    this.pressed.clear();
    this.handlers.onMovement(STOPPED);
  };

  private emitMovement(): void {
    if (this.pressed.size === 0) {
      this.handlers.onMovement(STOPPED);
      return;
    }

    this.handlers.onMovement({
      up: this.pressed.has('up'),
      down: this.pressed.has('down'),
      left: this.pressed.has('left'),
      right: this.pressed.has('right'),
    });
  }
}
