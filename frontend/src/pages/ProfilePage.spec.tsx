// @vitest-environment happy-dom

import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ProfilePage } from './ProfilePage';
import { ApiError, apiFetch } from '../api/api';

const authState = vi.hoisted(() => ({
  user: { username: 'viewer' },
  isAuthChecked: true,
}));

vi.mock('../features/auth/store/useAuthStore', () => ({
  useAuthStore: (selector: (state: typeof authState) => unknown) =>
    selector(authState),
}));

vi.mock('../api/api', () => {
  class ApiError extends Error {
    status: number;

    constructor(message: string, status: number) {
      super(message);
      this.status = status;
    }
  }

  return { ApiError, apiFetch: vi.fn() };
});

vi.mock('../features/auth/components/ProfilePagePrivate', () => ({
  ProfilePagePrivate: ({ user }: { user: { username: string } }) => (
    <div>Private profile: {user.username}</div>
  ),
}));

vi.mock('../features/auth/components/ProfilePagePublic', () => ({
  ProfilePagePublic: ({ user }: { user: { username: string } }) => (
    <div>Public profile: {user.username}</div>
  ),
}));

vi.mock('../features/auth/components/ProfilePageUnkown', () => ({
  ProfilePageUnkown: () => <div>User Not Found</div>,
}));

vi.mock('../locales/useLanguage', () => {
  const MESSAGES: Record<string, string> = {
    'profile.loading': 'Loading profile...',
    'profile.loadErrorTitle': 'Could not load this profile',
    'profile.loadError': 'We could not reach the server. Please try again.',
    'profile.retry': 'Retry',
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

function renderProfile(path = '/profile/alice') {
  const container = document.createElement('div');
  document.body.append(container);
  const root = createRoot(container);
  mountedRoots.push({ root, container });

  act(() => {
    root.render(
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/profile/:username" element={<ProfilePage />} />
        </Routes>
      </MemoryRouter>
    );
  });

  return container;
}

async function flush() {
  await act(async () => {
    await Promise.resolve();
    await Promise.resolve();
    await Promise.resolve();
  });
}

beforeEach(() => {
  vi.mocked(apiFetch).mockReset();
});

afterEach(() => {
  for (const { root, container } of mountedRoots.splice(0)) {
    act(() => root.unmount());
    container.remove();
  }

  vi.clearAllMocks();
});

describe('ProfilePage asynchronous states', () => {
  it('renders a styled loading state while the public profile loads', () => {
    vi.mocked(apiFetch).mockReturnValue(new Promise(() => undefined));

    const container = renderProfile();
    const status = container.querySelector('[role="status"]');

    expect(status).not.toBeNull();
    expect(status?.textContent).toContain('Loading profile...');
    expect(status?.getAttribute('aria-busy')).toBe('true');
  });

  it('renders the user-not-found view for a 404 response', async () => {
    vi.mocked(apiFetch).mockRejectedValue(new ApiError('Not found', 404));

    const container = renderProfile();
    await flush();

    expect(container.textContent).toContain('User Not Found');
    expect(container.querySelector('[role="alert"]')).toBeNull();
  });

  it('renders a recoverable error instead of not-found on a server error', async () => {
    const fetchMock = vi.mocked(apiFetch);
    fetchMock.mockRejectedValueOnce(new ApiError('Server error', 500));

    const container = renderProfile();
    await flush();

    const alert = container.querySelector('[role="alert"]');

    expect(alert?.textContent).toContain('Could not load this profile');
    expect(container.textContent).not.toContain('User Not Found');
  });

  it('treats network failures as recoverable and retries the request', async () => {
    const fetchMock = vi.mocked(apiFetch);
    fetchMock.mockRejectedValueOnce(new TypeError('Failed to fetch'));

    const container = renderProfile();
    await flush();

    expect(container.querySelector('[role="alert"]')).not.toBeNull();

    fetchMock.mockResolvedValueOnce({ username: 'alice' });

    const retry = Array.from(
      container.querySelectorAll<HTMLButtonElement>('button')
    ).find((button) => button.textContent === 'Retry');

    expect(retry).toBeDefined();

    act(() => retry?.click());
    await flush();

    expect(container.textContent).toContain('Public profile: alice');
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('renders the private profile for the authenticated user', () => {
    const container = renderProfile('/profile/viewer');

    expect(container.textContent).toContain('Private profile: viewer');
  });
});
