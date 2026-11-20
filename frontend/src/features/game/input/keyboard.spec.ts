/**
 * @vitest-environment happy-dom
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { KeyboardController, type KeyboardHandlers } from './keyboard';

function press(key: string, options: KeyboardEventInit = {}): KeyboardEvent {
  const event = new KeyboardEvent('keydown', {
    key,
    bubbles: true,
    cancelable: true,
    ...options,
  });

  window.dispatchEvent(event);

  return event;
}

function release(key: string): void {
  window.dispatchEvent(
    new KeyboardEvent('keyup', { key, bubbles: true, cancelable: true })
  );
}

function createController(): {
  handlers: KeyboardHandlers;
  controller: KeyboardController;
  movement: ReturnType<typeof vi.fn>;
  bomb: ReturnType<typeof vi.fn>;
} {
  const movement = vi.fn();
  const bomb = vi.fn();
  const handlers: KeyboardHandlers = {
    onMovement: movement,
    onPlaceBomb: bomb,
  };

  return {
    handlers,
    controller: new KeyboardController(handlers),
    movement,
    bomb,
  };
}

describe('KeyboardController', () => {
  beforeEach(() => {
    window.dispatchEvent(new Event('blur'));
  });

  it('emits movement on keydown and stops on keyup', () => {
    const { controller, movement, bomb } = createController();
    controller.attach();

    press('ArrowUp');
    expect(movement).toHaveBeenLastCalledWith({
      up: true,
      down: false,
      left: false,
      right: false,
    });
    expect(bomb).not.toHaveBeenCalled();

    release('ArrowUp');
    expect(movement).toHaveBeenLastCalledWith({
      up: false,
      down: false,
      left: false,
      right: false,
    });

    controller.destroy();
  });

  it('prevents default on arrows so the page does not scroll', () => {
    const { controller } = createController();
    controller.attach();

    for (const key of ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']) {
      expect(press(key).defaultPrevented).toBe(true);
      release(key);
    }

    controller.destroy();
  });

  it('ignores key repeat so holding a key emits once', () => {
    const { controller, movement } = createController();
    controller.attach();

    press('ArrowRight');
    const callsAfterFirst = movement.mock.calls.length;

    press('ArrowRight', { repeat: true });
    press('ArrowRight', { repeat: true });

    expect(movement).toHaveBeenCalledTimes(callsAfterFirst);

    controller.destroy();
  });

  it('combines two held keys into a diagonal', () => {
    const { controller, movement } = createController();
    controller.attach();

    press('ArrowUp');
    press('ArrowRight');

    expect(movement).toHaveBeenLastCalledWith({
      up: true,
      down: false,
      left: false,
      right: true,
    });

    release('ArrowRight');
    expect(movement).toHaveBeenLastCalledWith({
      up: true,
      down: false,
      left: false,
      right: false,
    });

    controller.destroy();
  });

  it('places a bomb on space and prevents default', () => {
    const { controller, bomb } = createController();
    controller.attach();

    const event = press(' ');
    expect(event.defaultPrevented).toBe(true);
    expect(bomb).toHaveBeenCalledTimes(1);

    press(' ', { repeat: true });
    expect(bomb).toHaveBeenCalledTimes(1);

    controller.destroy();
  });

  it('does not capture keys while typing in a text field', () => {
    const { controller, movement } = createController();
    controller.attach();

    const input = document.createElement('input');
    document.body.appendChild(input);

    input.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'ArrowUp',
        bubbles: true,
        cancelable: true,
      })
    );

    expect(movement).not.toHaveBeenCalled();
    expect(
      window as unknown as { _skip?: number } // no-op para no confundir
    ).toBeDefined();

    input.remove();
    controller.destroy();
  });

  it('clears held keys when the window loses focus', () => {
    const { controller, movement } = createController();
    controller.attach();

    press('ArrowLeft');
    window.dispatchEvent(new Event('blur'));

    expect(movement).toHaveBeenLastCalledWith({
      up: false,
      down: false,
      left: false,
      right: false,
    });

    controller.destroy();
  });

  it('stops emitting after destroy', () => {
    const { controller, movement } = createController();
    controller.attach();
    controller.destroy();

    press('ArrowUp');

    expect(movement).not.toHaveBeenCalled();
  });
});
