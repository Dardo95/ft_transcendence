// @vitest-environment happy-dom

import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { GlobalChat } from './GlobalChat';
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import { useChatStore, type ChatMessage } from '../store/useChatStore';
import { useSocketStore } from '@/stores/useSocketStore';

vi.mock('@/locales/useLanguage', () => ({
  useLanguage: () => ({ t: (key: string) => key }),
}));

const screen = {
  getByText(text: string): HTMLElement {
    const element = Array.from(
      document.body.querySelectorAll<HTMLElement>('*')
    ).find(
      (candidate) =>
        candidate.childElementCount === 0 && candidate.textContent === text
    );

    if (!element) {
      throw new Error(`Unable to find text: ${text}`);
    }

    return element;
  },
};

const mountedRoots: Array<{
  root: ReturnType<typeof createRoot>;
  container: HTMLDivElement;
}> = [];

function renderChat(messages: ChatMessage[]) {
  useAuthStore.setState({ user: null });
  useSocketStore.setState({ isConnected: true });
  useChatStore.setState({ messages });

  const container = document.createElement('div');
  document.body.append(container);
  const root = createRoot(container);
  mountedRoots.push({ root, container });

  act(() => {
    root.render(
      <MemoryRouter>
        <GlobalChat />
      </MemoryRouter>
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

describe('GlobalChat safe rendering', () => {
  it('renders script payloads as plain text without executing them', () => {
    const payload = '<script>alert("xss")</script>';
    window.alert = vi.fn();
    const alertSpy = vi.spyOn(window, 'alert');
    const container = renderChat([
      {
        id: 'script-payload',
        senderId: 2,
        sender: 'attacker',
        text: payload,
        timestamp: '2026-01-01T12:00:00.000Z',
      },
    ]);

    expect(screen.getByText(payload).textContent).toBe(payload);
    expect(container.querySelector('script')).toBeNull();
    expect(alertSpy).not.toHaveBeenCalled();
  });

  it('renders event-handler and javascript URI payloads as plain text', () => {
    const imagePayload = '<img src="x" onerror="alert(1)" />';
    const linkPayload = '<a href="javascript:alert(1)">click</a>';
    const container = renderChat([
      {
        id: 'image-payload',
        senderId: 2,
        sender: 'attacker',
        text: imagePayload,
        timestamp: '2026-01-01T12:00:00.000Z',
      },
      {
        id: 'link-payload',
        senderId: 2,
        sender: 'attacker',
        text: linkPayload,
        timestamp: '2026-01-01T12:00:01.000Z',
      },
    ]);

    expect(screen.getByText(imagePayload).textContent).toBe(imagePayload);
    expect(screen.getByText(linkPayload).textContent).toBe(linkPayload);
    expect(container.querySelector('img[src="x"]')).toBeNull();
    expect(container.querySelector('a[href^="javascript:"]')).toBeNull();
  });
});
