// Jest's environment here has no Web Crypto, which browsers have; Node's stands in.
import { webcrypto } from 'crypto';
Object.defineProperty(globalThis, 'crypto', { value: webcrypto, configurable: true });

import { appVersion, osFromUserAgent, PdvBackendEndpoint, randomUuid, userId } from './backend-context';

describe('osFromUserAgent', () => {
  it.each([
    ['Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', 'macos', '10.15.7'],
    ['Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', 'windows', '10.0'],
    ['Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Mobile/15E148 Safari/604.1', 'ios', '18.6'],
    ['Mozilla/5.0 (iPad; CPU OS 17_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.7 Mobile/15E148 Safari/604.1', 'ios', '17.7'],
    ['Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36', 'android', '15'],
    ['Mozilla/5.0 (X11; CrOS x86_64 14541.0.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', 'chromeos', 'unknown'],
    ['Mozilla/5.0 (X11; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0', 'linux', 'unknown'],
    ['curl/8.7.1', 'unknown', 'unknown'],
  ])('%s', (userAgent, os, osRelease) => {
    expect(osFromUserAgent(userAgent)).toEqual({ os, osRelease });
  });
});

describe('PdvBackendEndpoint', () => {
  it('sends to prod from the production deployment only', () => {
    expect(PdvBackendEndpoint.select('production')).toBe(PdvBackendEndpoint.prod);
    expect(PdvBackendEndpoint.select('preview')).toBe(PdvBackendEndpoint.dev);
    expect(PdvBackendEndpoint.select('development')).toBe(PdvBackendEndpoint.dev);
    expect(PdvBackendEndpoint.select(undefined)).toBe(PdvBackendEndpoint.dev);
  });
});

describe('appVersion', () => {
  const original = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA;
  afterEach(() => {
    process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA = original;
  });

  it("is the deployment's commit, or development without one", () => {
    process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA = '63237be0000000000000000000000000000000aa';
    expect(appVersion()).toBe('63237be0000000000000000000000000000000aa');
    process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA = '';
    expect(appVersion()).toBe('development');
  });
});

describe('userId', () => {
  afterEach(() => localStorage.clear());

  it("is kept in this browser's storage", () => {
    const first = userId(localStorage);
    expect(first).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
    expect(userId(localStorage)).toBe(first);
  });

  it('is made for the page load alone when storage cannot be used', () => {
    const broken = { getItem: () => { throw new Error('SecurityError'); } } as unknown as Storage;
    expect(userId(broken)).toMatch(/^[0-9a-f-]{36}$/);
  });
});

describe('randomUuid', () => {
  it('makes version 4 UUIDs', () => {
    expect(randomUuid()).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
    expect(randomUuid()).not.toBe(randomUuid());
  });
});
