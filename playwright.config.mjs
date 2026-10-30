import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30000,
  workers: 1,
  snapshotPathTemplate: '{testDir}/snapshots/{arg}{ext}',
  use: {
    baseURL: process.env.PDV_BASE_URL || 'http://127.0.0.1:3200',
    viewport: { width: 1280, height: 800 },
    locale: 'en-US',
    timezoneId: 'UTC',
    launchOptions: process.env.PDV_CHROME ? { channel: 'chrome' } : {},
    trace: 'retain-on-failure',
  },
});
