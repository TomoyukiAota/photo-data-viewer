// Jest's environment here has no Web Crypto, which browsers have; Node's stands in.
import { webcrypto } from 'crypto';
Object.defineProperty(globalThis, 'crypto', { value: webcrypto, configurable: true });

import { AnalyticsBackendEvent } from './backend-event';
import { createPdvBackend } from './pdv-backend';

const SAFARI = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15';

function setUp({ hidden = false } = {}) {
  const state = { hidden };
  const posted: AnalyticsBackendEvent[][] = [];
  const timers: (() => void)[] = [];
  const backend = createPdvBackend({
    endpoint: 'https://collect-dev.example/v1/events',
    storage: localStorage,
    userAgent: SAFARI,
    isHidden: () => state.hidden,
    post: async (_endpoint, events) => {
      posted.push(events);
      return 200;
    },
    setTimer: (callback) => timers.push(callback),
    clearTimer: () => {},
  });
  const runTimers = async () => {
    timers.splice(0).forEach((callback) => callback());
    await new Promise((resolve) => setTimeout(resolve, 0));
  };
  return { backend, posted, state, runTimers };
}

const kept = () => JSON.parse(localStorage.getItem('AnalyticsUnsentEvents') ?? '[]') as AnalyticsBackendEvent[];

describe('createPdvBackend', () => {
  afterEach(() => localStorage.clear());

  it('sends each event with this browser, this page load, and its order in it', async () => {
    const { backend, posted, runTimers } = setUp();
    backend.track('Loaded Photo', 'Loaded Photo', '{"extension":"jpg"}');
    backend.track('Page', 'Page Hidden');
    await runTimers();

    const [first, second] = posted[0];
    expect(first).toMatchObject({
      os: 'macos',
      os_release: '10.15.7',
      category: 'Loaded Photo',
      action: 'Loaded Photo',
      label: '{"extension":"jpg"}',
      value: null,
      seq: 0,
    });
    expect(second).toMatchObject({ seq: 1, label: null });
    expect(second.session_id).toBe(first.session_id);
    expect(second.user_id).toBe(first.user_id);
    expect(first.user_id).toBe(localStorage.getItem('AnalyticsUserId'));
    expect(first.event_id).not.toBe(second.event_id);
  });

  it('keeps what is not sent when the page is hidden, and sends it at once', async () => {
    const { backend, posted, state } = setUp();
    backend.track('Page', 'Page Loaded');
    state.hidden = true;
    backend.handleVisibilityChange();
    expect(kept().map((e) => e.action)).toEqual(['Page Loaded']);
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(posted.length).toBe(1); // Without waiting for the timer.
  });

  it('keeps an event of a hidden page at once, such as the one saying it was hidden', () => {
    const { backend } = setUp({ hidden: true });
    backend.track('Page', 'Page Hidden');
    expect(kept().map((e) => e.action)).toEqual(['Page Hidden']);
  });

  it('forgets what it kept when the page is shown again, as the queue sends it', () => {
    const { backend, state } = setUp();
    backend.track('Page', 'Page Loaded');
    state.hidden = true;
    backend.handleVisibilityChange();
    state.hidden = false;
    backend.handleVisibilityChange();
    expect(localStorage.getItem('AnalyticsUnsentEvents')).toBeNull();
  });

  it('sends what the last page load kept, with its own IDs', async () => {
    const first = setUp({ hidden: true });
    first.backend.track('Page', 'Page Hidden');
    const saved = kept()[0];

    const { posted, runTimers } = setUp();
    await runTimers();
    expect(posted[0][0]).toEqual(saved);
    expect(localStorage.getItem('AnalyticsUnsentEvents')).toBeNull();
  });
});
