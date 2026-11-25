// @vitest-environment happy-dom

import { act, type ComponentProps } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { LobbyNotifications } from './LobbyNotifications';

const MESSAGES: Record<string, string> = {
  'app.lobby.lobbyErrorLobbyGone':
    'This lobby no longer exists. We refreshed your lobby.',
  'app.lobby.dismissNotification': 'Dismiss notification',
  'app.lobby.retry': 'Retry',
};

vi.mock('@/locales/useLanguage', () => ({
  useLanguage: () => ({
    t: (key: string) => MESSAGES[key] ?? '',
  }),
}));

const mountedRoots: Array<{
  root: ReturnType<typeof createRoot>;
  container: HTMLDivElement;
}> = [];

function renderNotifications(
  props: Partial<ComponentProps<typeof LobbyNotifications>> = {}
) {
  const container = document.createElement('div');
  document.body.append(container);
  const root = createRoot(container);
  mountedRoots.push({ root, container });

  act(() => {
    root.render(
      <LobbyNotifications
        error={null}
        gameError={null}
        notice={null}
        noticeData={null}
        onDismissError={vi.fn()}
        onDismissGameError={vi.fn()}
        onDismissNotice={vi.fn()}
        {...props}
      />
    );
  });

  return container;
}

afterEach(() => {
  for (const { root, container } of mountedRoots.splice(0)) {
    act(() => root.unmount());
    container.remove();
  }

  vi.restoreAllMocks();
});

describe('LobbyNotifications recoverable errors', () => {
  it('localizes a stale lobby error and keeps the lobby mounted', () => {
    const container = renderNotifications({
      error: 'Lobby no longer exists',
    });

    const alert = container.querySelector('[role="alert"]');

    expect(alert).not.toBeNull();
    expect(alert?.textContent).toContain(
      'This lobby no longer exists. We refreshed your lobby.'
    );
    expect(container.querySelector('button')).not.toBeNull();
  });

  it('dismisses a lobby error manually', () => {
    const onDismissError = vi.fn();
    const container = renderNotifications({
      error: 'Lobby is full',
      onDismissError,
    });

    const dismiss = container.querySelector<HTMLButtonElement>(
      'button[aria-label="Dismiss notification"]'
    );

    expect(dismiss).not.toBeNull();

    act(() => dismiss?.click());

    expect(onDismissError).toHaveBeenCalledTimes(1);
  });

  it('shows a retryable game exception without blanking the parent', () => {
    const onRetryGameError = vi.fn();
    const onDismissGameError = vi.fn();
    const container = renderNotifications({
      gameError: 'A private match needs between 2 and 4 players.',
      onRetryGameError,
      onDismissGameError,
    });

    const alert = container.querySelector('[role="alert"]');

    expect(alert?.textContent).toContain(
      'A private match needs between 2 and 4 players.'
    );

    const retry = Array.from(
      container.querySelectorAll<HTMLButtonElement>('button')
    ).find((button) => button.textContent === 'Retry');

    expect(retry).toBeDefined();

    act(() => retry?.click());
    expect(onRetryGameError).toHaveBeenCalledTimes(1);

    const dismiss = container.querySelector<HTMLButtonElement>(
      'button[aria-label="Dismiss notification"]'
    );

    act(() => dismiss?.click());
    expect(onDismissGameError).toHaveBeenCalledTimes(1);
  });
});
