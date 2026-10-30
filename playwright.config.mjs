import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30000,
  workers: 1,
  snapshotPathTemplate: '{testDir}/snapshots/{arg}{ext}',
  webServer: process.env.PDV_BASE_URL
    ? undefined
    : {
        command: 'npm start -- -p 3200',
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
