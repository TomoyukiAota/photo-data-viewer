import { test, expect } from '@playwright/test';
import { fileURLToPath } from 'node:url';
import { mkdtempSync, rmSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawn } from 'node:child_process';

for (const filename of ['demo.jpg', 'demo.heic']) {
  test(`embedded mode loads a real local ${filename} in Electron`, async () => {
    test.skip(
      !process.env.PDV_ELECTRON_PATH,
      'Set PDV_ELECTRON_PATH to the companion-compatible Electron executable.',
    );
    const profile = mkdtempSync(join(tmpdir(), 'pdv-electron-'));
    const resultPath = join(profile, 'result.json');
    const url = new URL('http://127.0.0.1:3130/');
    url.searchParams.set(
      'photoPath',
      fileURLToPath(new URL(`../fixtures/${filename}`, import.meta.url)),
    );
    url.searchParams.set('dateFormat', 'DD/MM/YYYY');
    url.searchParams.set('clockSystemFormat', '12-hour');
    try {
      await new Promise((resolve, reject) => {
        const child = spawn(
          process.env.PDV_ELECTRON_PATH,
          [fileURLToPath(new URL('./main.cjs', import.meta.url))],
          {
            env: {
              ...process.env,
              PDV_ELECTRON_PROFILE: profile,
              PDV_ELECTRON_URL: url.toString(),
              PDV_ELECTRON_PHOTO: filename,
              PDV_ELECTRON_RESULT: resultPath,
            },
            stdio: 'ignore',
          },
        );
        const timer = setTimeout(() => {
          child.kill();
          reject(new Error('Electron timed out'));
        }, 30000);
        child.once('error', (error) => {
          clearTimeout(timer);
          reject(error);
        });
        child.once('exit', (code) => {
          clearTimeout(timer);
          code === 0
            ? resolve()
            : reject(new Error(readFileSync(resultPath, 'utf8')));
        });
      });
      const result = JSON.parse(readFileSync(resultPath, 'utf8'));
      expect(result.title).toBe(`${filename} - Photo Location Map`);
      expect(result.width).toBeGreaterThan(0);
      expect(result.electron).toBe('32.0.2');
      expect(result.fileInputCount).toBe(0);
      expect(result.dateFormat).toBe('DD/MM/YYYY');
      expect(result.clockSystemFormat).toBe('12-hour');
      expect(result.text).toContain(filename);
      expect(result.errors).toEqual([]);
    } finally {
      rmSync(profile, { recursive: true, force: true });
    }
  });
}
