import { test, expect } from '@playwright/test';
import { fileURLToPath } from 'node:url';
import { mkdtempSync, rmSync, readFileSync } from 'node:fs';
import { homedir, tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawn } from 'node:child_process';

function photoPath(filename) {
  return fileURLToPath(new URL(`../fixtures/${filename}`, import.meta.url));
}

// Opens the app in Electron as Photo Location Map does, with the photo's path in
// the address, and gives what main.cjs found once the photo was shown.
async function runInElectron(filename, env = {}) {
  const profile = mkdtempSync(join(tmpdir(), 'pdv-electron-'));
  const resultPath = join(profile, 'result.json');
  const url = new URL(
    process.env.PDV_ELECTRON_BASE_URL || 'http://127.0.0.1:3130/',
  );
  url.searchParams.set('photoPath', photoPath(filename));
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
            ...env,
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
        if (code === 0) {
          resolve();
          return;
        }
        let message;
        try {
          message = readFileSync(resultPath, 'utf8');
        } catch {
          message = `Electron exited with code ${code}`;
        }
        reject(new Error(message));
      });
    });
    return JSON.parse(readFileSync(resultPath, 'utf8'));
  } finally {
    rmSync(profile, { recursive: true, force: true });
  }
}

for (const filename of ['demo.jpg', 'demo.heic']) {
  test(`embedded mode loads a real local ${filename} in Electron`, async () => {
    test.skip(
      !process.env.PDV_ELECTRON_PATH,
      'Set PDV_ELECTRON_PATH to the companion-compatible Electron executable.',
    );
    const result = await runInElectron(filename);
    expect(result.title).toBe(`${filename} - Photo Location Map`);
    expect([result.width, result.height]).toEqual([3024, 4032]);
    expect(result.electron).toBe('32.0.2');
    expect(result.fileInputCount).toBe(0);
    expect(result.menuVisible).toBe(false);
    expect(result.dateFormat).toBe('DD/MM/YYYY');
    expect(result.clockSystemFormat).toBe('12-hour');
    expect(result.text).toContain(filename);
    expect(result.errors).toEqual([]);
  });
}

test('embedded mode sends Photo Location Map an error nothing handled, without the photo\'s path', async () => {
  test.skip(
    !process.env.PDV_ELECTRON_PATH,
    'Set PDV_ELECTRON_PATH to the companion-compatible Electron executable.',
  );
  const result = await runInElectron('demo.jpg', { PDV_ELECTRON_THROW: '1' });
  const event = result.trackedEvents.find(
    ({ action }) => action === '[PDV] Unhandled Error',
  );
  expect(event.category).toBe('Photo Data Viewer');
  expect(JSON.parse(event.label)).toMatchObject({
    error: 'Error: Cannot open <path>',
    errorSource: 'error',
    pathname: '/',
  });
  // The label is JSON, which escapes each backslash of a Windows path, so a path
  // is looked for as JSON writes it.
  const asInJson = (text) => JSON.stringify(text).slice(1, -1);
  expect(event.label).not.toContain(asInJson(photoPath('demo.jpg')));
  expect(event.label).not.toContain(asInJson(homedir()));
});
