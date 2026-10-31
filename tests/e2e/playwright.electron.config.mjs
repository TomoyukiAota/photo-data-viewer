import { defineConfig } from '@playwright/test';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = fileURLToPath(new URL('../../', import.meta.url));

export default defineConfig({
  testDir: './electron',
  timeout: 60000,
  outputDir: resolve(repoRoot, '.upgrade-artifacts/electron-results'),
  workers: 1,
  webServer: process.env.PDV_ELECTRON_BASE_URL
    ? undefined
    : {
        cwd: repoRoot,
        command: 'npx cross-env PDV_IN_PLM=True next start -p 3130',
        url: 'http://127.0.0.1:3130',
        reuseExistingServer: false,
        env: { NEXT_PUBLIC_GOOGLE_ANALYTICS_ID: '' },
      },
});
