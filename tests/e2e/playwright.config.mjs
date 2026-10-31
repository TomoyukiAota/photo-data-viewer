import { defineConfig } from '@playwright/test';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = fileURLToPath(new URL('../../', import.meta.url));

export default defineConfig({
  testDir: './browser',
  outputDir: resolve(repoRoot, 'test-results'),
  timeout: process.env.PDV_DEV ? 90000 : 30000,
  grep: process.env.PDV_DEV ? /photo values/ : undefined,
  workers: 1,
  snapshotPathTemplate: '{testDir}/snapshots/{arg}{ext}',
  webServer: process.env.PDV_BASE_URL
    ? undefined
    : {
        cwd: repoRoot,
        command: process.env.PDV_DEV
          ? 'npm run dev:test'
          : 'npm start -- -p 3200',
        url: 'http://127.0.0.1:3200',
        reuseExistingServer: false,
        env: { NEXT_PUBLIC_GOOGLE_ANALYTICS_ID: '' },
      },
  use: {
    browserName: process.env.PDV_BROWSER || 'chromium',
    baseURL: process.env.PDV_BASE_URL || 'http://127.0.0.1:3200',
    viewport: { width: 1280, height: 800 },
    locale: 'en-US',
    timezoneId: 'UTC',
    launchOptions: process.env.PDV_CHROME ? { channel: 'chrome' } : {},
    trace: 'retain-on-failure',
  },
});
