// What the analytics backend is told about this app with every event, besides the
// event itself.

// Sending to this app's own analytics backend, from the standalone app only. Off
// until its endpoints exist; turning it on is a step of its own, checked in a
// browser first.
export const PDV_BACKEND_ENABLED = false;

export const PdvBackendEndpoint = {
  dev: 'https://collect-dev.analytics.photo-data-viewer.tomoyukiaota.com/v1/events',
  prod: 'https://collect-prod.analytics.photo-data-viewer.tomoyukiaota.com/v1/events',

  // prod for Vercel's production deployment only. Its previews and `npm run dev` go to
  // dev, as does a build without Vercel's system environment variables.
  select(vercelEnv: string | undefined): string {
    return vercelEnv === 'production' ? this.prod : this.dev;
  },
};

// The deployment's git commit, as this app has no version numbers. Vercel sets it
// at build time; `npm run dev` has none.
export function appVersion(): string {
  return process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || 'development';
}

// The OS and its version, guessed from the User-Agent, which is all a web page can
// tell. iPhones and iPads say "like Mac OS X", and Android says "Linux", so those
// are looked for first. macOS's version is frozen at 10.15.7 by Safari and Chrome.
export function osFromUserAgent(userAgent: string): { os: string; osRelease: string } {
  const version = (match: RegExpMatchArray | null) => match?.[1]?.replace(/_/g, '.') || 'unknown';
  if (/iPhone|iPad|iPod/.test(userAgent)) return { os: 'ios', osRelease: version(userAgent.match(/OS (\d+[_\d]*)/)) };
  if (/Android/.test(userAgent)) return { os: 'android', osRelease: version(userAgent.match(/Android (\d+(?:\.\d+)*)/)) };
  if (/Windows NT/.test(userAgent)) return { os: 'windows', osRelease: version(userAgent.match(/Windows NT (\d+\.\d+)/)) };
  if (/CrOS/.test(userAgent)) return { os: 'chromeos', osRelease: 'unknown' };
  if (/Mac OS X/.test(userAgent)) return { os: 'macos', osRelease: version(userAgent.match(/Mac OS X (\d+[_.\d]*)/)) };
  if (/Linux/.test(userAgent)) return { os: 'linux', osRelease: 'unknown' };
  return { os: 'unknown', osRelease: 'unknown' };
}

export function randomUuid(): string {
  if (typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  // Older browsers: version 4 from random bytes.
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

const USER_ID_KEY = 'AnalyticsUserId';

// This browser's ID, kept in its storage. Clearing site data makes a new one, and
// Safari clears script-written storage after seven days without a visit, so it
// counts browsers, not people.
export function userId(storage: Storage | undefined): string {
  try {
    const saved = storage?.getItem(USER_ID_KEY);
    if (saved) return saved;
    const id = randomUuid();
    storage?.setItem(USER_ID_KEY, id);
    return id;
  } catch {
    return randomUuid(); // Storage that cannot be used: an ID for this page load only.
  }
}
