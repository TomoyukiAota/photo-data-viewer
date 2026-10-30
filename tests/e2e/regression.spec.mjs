import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';

const photo = readFileSync(new URL('../fixtures/demo.jpg', import.meta.url));
const png = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
  'base64',
);

async function snapshot(page, name) {
  if (
    page.viewportSize().width > 1200 &&
    new URL(page.url()).pathname === '/'
  ) {
    await expect(page.locator('.leaflet-container')).toBeVisible();
  }
  await page.evaluate(() => document.fonts.ready);
  if (process.env.PDV_VISUAL) {
    await expect(page).toHaveScreenshot(`${name}.png`, {
      animations: 'disabled',
      maxDiffPixels: 4,
      mask: [page.locator('.leaflet-container')],
      timeout: 15000,
    });
  }
}

async function loadPhoto(page) {
  await page
    .locator('input[type=file]')
    .setInputFiles({ name: 'demo.jpg', mimeType: 'image/jpeg', buffer: photo });
  await expect(
    page.getByRole('cell', { name: 'demo.jpg', exact: true }),
  ).toBeVisible();
}

async function navigate(page, name) {
  await page.getByRole('button', { name: 'menu', exact: true }).click();
  await page.getByRole('menuitem', { name, exact: true }).click();
}

test.beforeEach(async ({ page }) => {
  // Keep baseline captures independent of map servers, and GA.
  await page.route(/googletagmanager\.com|google-analytics\.com/, (route) =>
    route.abort(),
  );
  await page.route(/unpkg\.com/, (route) =>
    route.fulfill({ contentType: 'text/css', body: '' }),
  );
  await page.route(/tile\.openstreetmap\.org/, (route) =>
    route.fulfill({ contentType: 'image/png', body: png }),
  );
  await page.route(/cdn\.jsdelivr\.net.*Demo/, (route) =>
    route.fulfill({ contentType: 'image/jpeg', body: photo }),
  );
});

for (const width of [1280, 1201, 1200, 1199, 600, 320]) {
  test(`empty home at width ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    await page.goto('/');
    await expect(
      page.getByRole('button', { name: 'Select Photo' }),
    ).toBeVisible();
    await expect(
      page.getByRole('tab', { name: 'General', exact: true }),
    ).toBeVisible();
    await snapshot(page, `home-${width}`);
  });
}

test('photo values, tabs, rotation, splitter persistence, and navigation', async ({
  page,
}) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await loadPhoto(page);
  await expect(page).toHaveTitle(/demo.jpg/);
  await expect(page.getByRole('cell', { name: /37\.332/ })).toBeVisible();
  await expect(page.locator('.leaflet-marker-icon')).toBeVisible();
  await snapshot(page, 'loaded-general');
  await page
    .getByRole('img', { name: 'Rotate photo', exact: true })
    .click({ force: true });
  await expect(page.locator('img[alt="demo.jpg"]')).toHaveAttribute(
    'style',
    /rotate\(90deg\)/,
  );
  await page.getByRole('tab', { name: 'Details', exact: true }).click();
  await expect(
    page.getByRole('cell', { name: 'Apple', exact: true }).first(),
  ).toBeVisible();
  await snapshot(page, 'loaded-details');
  await page.getByRole('tab', { name: 'Raw Data', exact: true }).click();
  await expect(page.getByText(/"Make": "Apple"/)).toBeVisible();
  await snapshot(page, 'loaded-raw');
  const vertical = page.locator(
    '.reflex-container.vertical > .reflex-splitter',
  );
  const box = await vertical.boundingBox();
  await page.mouse.move(box.x + 4, box.y + 100);
  await page.mouse.down();
  await page.mouse.move(box.x - 100, box.y + 100, { steps: 5 });
  await page.mouse.up();
  const saved = await page.evaluate(() =>
    localStorage.getItem('WideLayoutPhotoDataPaneFlex'),
  );
  expect(Number(saved)).toBeGreaterThan(0.5);
  await page.reload();
  expect(
    await page.evaluate(() =>
      localStorage.getItem('WideLayoutPhotoDataPaneFlex'),
    ),
  ).toBe(saved);
  await navigate(page, 'Settings');
  await snapshot(page, 'settings');
  await page.getByLabel('Date Format', { exact: true }).click();
  await page.getByRole('option', { name: 'DD/MM/YYYY', exact: true }).click();
  await page.reload();
  await expect(page.getByLabel('Date Format', { exact: true })).toHaveText(
    'DD/MM/YYYY',
  );
  await navigate(page, 'About');
  await snapshot(page, 'about');
  await navigate(page, 'Demo');
  await snapshot(page, 'demo');
  await page.getByRole('button', { name: 'Run Demo' }).click();
  await expect(
    page.getByRole('cell', { name: 'Demo (Apple Park).jpg', exact: true }),
  ).toBeVisible();
  expect(errors).toEqual([]);
});

test('no EXIF and malformed files retain the existing dialog and image behavior', async ({
  page,
}) => {
  await page.goto('/');
  await page
    .locator('input[type=file]')
    .setInputFiles({ name: 'no-exif.png', mimeType: 'image/png', buffer: png });
  await expect(page.locator('img[alt="no-exif.png"]')).toBeVisible();
  await page
    .locator('input[type=file]')
    .setInputFiles({
      name: 'broken.jpg',
      mimeType: 'image/jpeg',
      buffer: Buffer.from('invalid'),
    });
  await expect(page.getByRole('dialog')).toContainText(
    'EXIF data is not available.',
  );
  await snapshot(page, 'unsupported-dialog');
  await page.getByRole('button', { name: 'Close', exact: true }).click();
  await expect(
    page
      .locator('#__next')
      .getByText('Unsupported File Format', { exact: true }),
  ).toBeVisible();
});

test('HEIF decoding preserves image dimensions and displayed metadata', async ({
  page,
}) => {
  await page.goto('/');
  const heic = readFileSync(new URL('../fixtures/demo.heic', import.meta.url));
  await page
    .locator('input[type=file]')
    .setInputFiles({ name: 'demo.heic', mimeType: 'image/heic', buffer: heic });
  const img = page.locator('img[alt="demo.heic"]');
  await expect(img).toBeVisible({ timeout: 20000 });
  await expect
    .poll(() => img.evaluate((el) => [el.naturalWidth, el.naturalHeight]))
    .toEqual([3024, 4032]);
  await snapshot(page, 'heif-general');
});

test('empty details keeps the original no-data row', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('tab', { name: 'Details', exact: true }).click();
  await expect(
    page.getByRole('cell', { name: 'No data', exact: true }),
  ).toBeVisible();
  await snapshot(page, 'empty-details');
});

test('narrow photo, metadata, and map tabs retain their layout', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto('/');
  await loadPhoto(page);
  await snapshot(page, 'narrow-loaded');
  await page.getByRole('tab', { name: 'Map', exact: true }).click();
  await expect(page.locator('.leaflet-marker-icon')).toBeVisible();
  await page.getByRole('tab', { name: 'Photo', exact: true }).click();
  await expect(page.locator('img[alt="demo.jpg"]')).toBeVisible();
  await snapshot(page, 'narrow-photo');
});
