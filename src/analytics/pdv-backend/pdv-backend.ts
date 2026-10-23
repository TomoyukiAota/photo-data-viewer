import { AppIntegration } from '../../app-integration/app-integration';
import { AnalyticsBackendEvent } from './backend-event';
import { appVersion, osFromUserAgent, PDV_BACKEND_ENABLED, PdvBackendEndpoint, randomUuid, userId } from './backend-context';
import { AnalyticsBackendSender } from './sender';
import { UnsentEvents } from './unsent-events';

// Sends this app's events to its own analytics backend, when it runs standalone.
// Launched from Photo Location Map, its events go to that app's instead
// (plm-backend.ts).

async function sha256Hex(text: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

// The most a request sent with keepalive, which outlives the page, may carry.
const KEEPALIVE_MAX_BYTES = 64 * 1024;

async function post(endpoint: string, events: AnalyticsBackendEvent[]): Promise<number> {
  const body = JSON.stringify({ schema_version: 1, events });
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      // The backend's function URL requires the SHA-256 of the body for a POST. This is why
      // navigator.sendBeacon cannot be used: it sends no header of its own.
      'x-amz-content-sha256': await sha256Hex(body),
    },
    body,
    keepalive: new Blob([body]).size <= KEEPALIVE_MAX_BYTES,
  });
  return response.status;
}

export function createPdvBackend(options: {
  endpoint: string;
  storage: Storage | undefined;
  userAgent: string;
  isHidden: () => boolean;
  post: (endpoint: string, events: AnalyticsBackendEvent[]) => Promise<number>;
  setTimer: (callback: () => void, delayMs: number) => unknown;
  clearTimer: (timer: unknown) => void;
}) {
  const logger = { info: (message: string) => console.info(`[Analytics] ${message}`), warn: (message: string) => console.warn(`[Analytics] ${message}`) };
  const sender = new AnalyticsBackendSender({
    post: (events) => options.post(options.endpoint, events),
    setTimer: options.setTimer,
    clearTimer: options.clearTimer,
    logger,
  });
  const unsent = new UnsentEvents(options.storage);
  const user = userId(options.storage);
  const session = randomUuid();
  const { os, osRelease } = osFromUserAgent(options.userAgent);
  let seq = 0;

  // Hidden, the page may be closed: keep what is not sent for the next page load,
  // and send it now rather than in a second. Shown again, the queue sends it.
  const handleHidden = () => {
    unsent.save(sender.unsentEvents);
    sender.sendNow();
  };
  const handleShown = () => unsent.remove();

  sender.add(...unsent.loadAndRemove());

  return {
    handleVisibilityChange: () => (options.isHidden() ? handleHidden() : handleShown()),
    track(category: string, action: string, label?: string, value?: string): void {
      sender.add({
        event_id: randomUuid(),
        user_id: user,
        session_id: session,
        seq: seq++,
        client_ts: new Date().toISOString(),
        app_version: appVersion(),
        os,
        os_release: osRelease,
        category,
        action,
        label: label ?? null,
        value: value ?? null,
      });
      // An event of a hidden page, such as the one saying it was hidden, is kept at once.
      if (options.isHidden()) handleHidden();
    },
  };
}

let backend: ReturnType<typeof createPdvBackend> | undefined;

function getBackend() {
  if (backend === undefined) {
    backend = createPdvBackend({
      endpoint: PdvBackendEndpoint.select(process.env.NEXT_PUBLIC_VERCEL_ENV),
      storage: window.localStorage,
      userAgent: navigator.userAgent,
      isHidden: () => document.visibilityState === 'hidden',
      post,
      setTimer: (callback, delayMs) => window.setTimeout(callback, delayMs),
      clearTimer: (timer) => window.clearTimeout(timer as number),
    });
    document.addEventListener('visibilitychange', backend.handleVisibilityChange);
  }
  return backend;
}

export function sendToPdvBackend(category: string, action: string, label?: string, value?: string): void {
  if (!PDV_BACKEND_ENABLED || typeof window === 'undefined' || !AppIntegration.isStandalone) return;
  getBackend().track(category, action, label, value);
}
