import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/electron',
  timeout: 60000,
  outputDir: '.upgrade-artifacts/electron-results',
  workers: 1,
  webServer: {
    command: 'npx cross-env PDV_IN_PLM=True next start -p 3130',
    url: 'http://127.0.0.1:3130',
    reuseExistingServer: false,
    env: { NEXT_PUBLIC_GOOGLE_ANALYTICS_ID: '' },
  },
});
