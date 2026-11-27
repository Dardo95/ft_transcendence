// @vitest-environment happy-dom

import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { FriendList } from './FriendListCard';

const friendsStore = vi.hoisted(() => {
  const loadFriendsData = vi.fn(async () => undefined);
  const deleteFriend = vi.fn(async () => undefined);
  const clearError = vi.fn();

  return {
    state: {
      friends: [] as Array<{ id: number; username: string }>,
      isLoading: false,
      error: null as string | null,
      loadFriendsData,
      deleteFriend,
      clearError,
    },
  };
});

vi.mock('../store/useFriendsStore', () => ({
  useFriendsStore: (
    selector?: (state: typeof friendsStore.state) => unknown
  ) => (selector ? selector(friendsStore.state) : friendsStore.state),
}));

vi.mock('@/features/chat/store/useLobbyStore', () => ({
  useLobbyStore: (
    selector: (state: { inviteFriendToLobby: () => void }) => unknown
  ) => selector({ inviteFriendToLobby: () => undefined }),
}));

vi.mock('./AddFriendCard', () => ({
  AddFriendCard: () => null,
}));

vi.mock('./IncomingRequests', () => ({
  IncomingRequests: () => null,
}));

vi.mock('@/locales/useLanguage', () => {
  const MESSAGES: Record<string, string> = {
    'app.friends.friendList': 'Friend List',
    'app.friends.loadingFriends': 'Loading friends...',
    'app.friends.noFriendsYet': 'You have no friends added yet.',
    'app.friends.errorFriendsLoad':
      'Could not load your friends. Please try again.',
    'app.friends.retry': 'Retry',
    'app.friends.dismissNotification': 'Dismiss notification',
  };

  return {
    useLanguage: () => ({
      t: (key: string) => MESSAGES[key] ?? '',
    }),
  };
});

const mountedRoots: Array<{
  root: ReturnType<typeof createRoot>;
  container: HTMLDivElement;
}> = [];

function renderFriendList() {
  const container = document.createElement('div');
  document.body.append(container);
  const root = createRoot(container);
  mountedRoots.push({ root, container });

  act(() => {
    root.render(
      <MemoryRouter>
        <FriendList />
      </MemoryRouter>
    );
  });

  return container;
}

beforeEach(() => {
  friendsStore.state.isLoading = false;
  friendsStore.state.error = null;
  friendsStore.state.friends = [];
  friendsStore.state.loadFriendsData.mockClear();
  friendsStore.state.clearError.mockClear();
});

afterEach(() => {
  for (const { root, container } of mountedRoots.splice(0)) {
    act(() => root.unmount());
    container.remove();
  }

  vi.clearAllMocks();
});

describe('FriendList asynchronous states', () => {
  it('shows a loading indicator while the first request is in flight', () => {
    friendsStore.state.isLoading = true;

    const container = renderFriendList();
    const status = container.querySelector('[role="status"]');

    expect(status).not.toBeNull();
    expect(status?.textContent).toContain('Loading friends...');
    expect(friendsStore.state.loadFriendsData).toHaveBeenCalledTimes(1);
  });

  it('shows the localized empty state after loading finishes', () => {
    const container = renderFriendList();

    expect(container.textContent).toContain('You have no friends added yet.');
    expect(container.querySelector('[role="alert"]')).toBeNull();
  });

  it('renders a retryable error banner when loading fails', () => {
    friendsStore.state.error = 'errorFriendsLoad';

    const container = renderFriendList();
    const alert = container.querySelector('[role="alert"]');

    expect(alert?.textContent).toContain(
      'Could not load your friends. Please try again.'
    );

    const retry = Array.from(
      container.querySelectorAll<HTMLButtonElement>('button')
    ).find((button) => button.textContent === 'Retry');

    expect(retry).toBeDefined();

    act(() => retry?.click());

    // One call comes from the mount effect, one from the retry button.
    expect(friendsStore.state.loadFriendsData).toHaveBeenCalledTimes(2);
  });

  it('dismisses the error banner without clearing the loaded lists', () => {
    friendsStore.state.error = 'errorFriendsLoad';

    const container = renderFriendList();
    const dismiss = container.querySelector<HTMLButtonElement>(
      'button[aria-label="Dismiss notification"]'
    );

    expect(dismiss).not.toBeNull();

    act(() => dismiss?.click());

    expect(friendsStore.state.clearError).toHaveBeenCalledTimes(1);
  });
});
