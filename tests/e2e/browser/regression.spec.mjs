import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';

const photo = readFileSync(new URL('../fixtures/demo.jpg', import.meta.url));
const png = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
  'base64',
);

/**
 * demo.jpg with its EXIF replaced by a GPS block whose latitude and longitude have
 * no values and whose references are empty bytes, as some files have. For it,
 * exifr 7.1.3 gives the latitude and the longitude as the text "NaNNaN".
 */
function photoWithEmptyGpsValues() {
  const entries = [
    [0x0001, 7, 0], // GPSLatitudeRef, UNDEFINED, no bytes
    [0x0002, 5, 0], // GPSLatitude, RATIONAL, no values
    [0x0003, 7, 0], // GPSLongitudeRef
    [0x0004, 5, 0], // GPSLongitude
  ];
  const gpsOffset = 8 + 18; // After the TIFF header and IFD0, which has one entry.
  const tiff = Buffer.alloc(gpsOffset + 2 + 12 * entries.length + 4);
  tiff.write('II*\0', 0, 'latin1');
  tiff.writeUInt32LE(8, 4);
  tiff.writeUInt16LE(1, 8);
  tiff.writeUInt16LE(0x8825, 10); // GPSInfo, LONG, 1 value: the GPS block's offset.
  tiff.writeUInt16LE(4, 12);
  tiff.writeUInt32LE(1, 14);
  tiff.writeUInt32LE(gpsOffset, 18);
  tiff.writeUInt16LE(entries.length, gpsOffset);
  entries.forEach(([tag, type, count], i) => {
    const offset = gpsOffset + 2 + 12 * i;
    tiff.writeUInt16LE(tag, offset);
    tiff.writeUInt16LE(type, offset + 2);
    tiff.writeUInt32LE(count, offset + 4);
  });
  const payload = Buffer.concat([Buffer.from('Exif\0\0', 'latin1'), tiff]);
  const app1 = Buffer.concat([Buffer.from([0xff, 0xe1, 0, 0]), payload]);
  app1.writeUInt16BE(payload.length + 2, 2);

  // Every segment of demo.jpg but its APP1, with this APP1 right after SOI.
  const segments = [photo.subarray(0, 2), app1];
  let i = 2;
  while (photo[i] === 0xff && photo[i + 1] !== 0xda) {
    const end = i + 2 + photo.readUInt16BE(i + 2);
    if (photo[i + 1] !== 0xe1) segments.push(photo.subarray(i, end));
    i = end;
  }
  segments.push(photo.subarray(i));
  return Buffer.concat(segments);
}

async function snapshot(page, name) {
  if (
    page.viewportSize().width > 1200 &&
    new URL(page.url()).pathname === '/'
  ) {
    await expect(page.locator('.leaflet-container')).toBeVisible();
  }
  await page.evaluate(() => document.fonts.ready);
  // The menu's backdrop stays over the page for a moment after the menu is
  // closed, without fading.
  await expect(page.locator('#menu-appbar')).toBeHidden();
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

async function expectTruncated(cell) {
  await expect(cell).toHaveCSS('white-space', 'nowrap');
  await expect(cell).toHaveCSS('overflow-x', 'hidden');
  await expect
    .poll(() =>
      cell.evaluate((element) => element.scrollWidth > element.clientWidth),
    )
    .toBe(true);
}

test('long filenames retain the original single-line clipping', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto('/');
  for (const name of [
    `${'longfilename'.repeat(12)}.jpg`,
    `${'long filename '.repeat(12)}.jpg`,
  ]) {
    await page.locator('input[type=file]').setInputFiles({
      name,
      mimeType: 'image/jpeg',
      buffer: photo,
    });
    const cell = page.getByRole('cell', { name, exact: true });
    await expect(cell).toBeVisible();
    // The original app clips nested filename text without rendering an ellipsis.
    await expectTruncated(cell);
  }
});

test.beforeEach(async ({ page }) => {
  // Keep baseline captures independent of map servers, and GA.
  await page.route(
    /collect-(dev|prod)\.analytics\.photo-data-viewer\.tomoyukiaota\.com/,
    (route) => route.fulfill({ status: 204, body: '' }),
  );
  await page.route(/googletagmanager\.com|google-analytics\.com/, (route) =>
    route.abort(),
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
  await expect(page.locator('.leaflet-marker-icon')).toHaveCSS('position', 'absolute');
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
  for (const name of ['BlueTRC', 'ChromaticAdaptation']) {
    const row = page.getByRole('row').filter({
      has: page.getByRole('cell', { name, exact: true }),
    });
    const value = row.getByRole('cell').nth(1);
    await expectTruncated(value);
    await expect(value).toHaveCSS('text-overflow', 'ellipsis');
  }
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
  const movedBox = await vertical.boundingBox();
  expect(Math.abs(movedBox.x - box.x)).toBeGreaterThan(50);
  await page.reload();
  expect(
    await page.evaluate(() =>
      localStorage.getItem('WideLayoutPhotoDataPaneFlex'),
    ),
  ).toBe(saved);
  await expect
    .poll(async () => {
      const restoredBox = await vertical.boundingBox();
      return restoredBox ? Math.abs(restoredBox.x - movedBox.x) : Infinity;
    })
    .toBeLessThanOrEqual(1);
  await navigate(page, 'Settings');
  await snapshot(page, 'settings');
  await page.getByLabel('Date Format', { exact: true }).click();
  await page.getByRole('option', { name: 'DD/MM/YYYY', exact: true }).click();
  await page.reload();
  await expect(page.getByLabel('Date Format', { exact: true })).toHaveText(
    'DD/MM/YYYY',
  );
  await page
    .getByLabel('Send usage data to improve this application')
    .uncheck();
  await page.reload();
  await expect(
    page.getByLabel('Send usage data to improve this application'),
  ).not.toBeChecked();
  await navigate(page, 'About');
  await snapshot(page, 'about');
  await page.getByRole('link', { name: 'Settings', exact: true }).click();
  await expect(page).toHaveURL(/\/settings$/);
  await navigate(page, 'About');
  await navigate(page, 'Demo');
  await snapshot(page, 'demo');
  await page.getByRole('button', { name: 'Run Demo' }).click();
  await expect(
    page.getByRole('cell', { name: 'Demo (Apple Park).jpg', exact: true }),
  ).toBeVisible();
  expect(errors).toEqual([]);
});

test('the Language page lists the languages, narrows them down, and applies the one chosen', async ({
  page,
  browserName,
}) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await navigate(page, 'Language');
  await expect(page).toHaveURL(/\/language$/);
  await expect(page).toHaveTitle('Language - Photo Data Viewer');

  // A list box: the browser's language first, chosen until another is, then
  // each language under its own name, those in Latin letters by alphabet.
  const list = page.getByRole('listbox');
  const options = list.getByRole('option');
  const chosen = list.locator('[aria-selected="true"]');
  await expect(list).toHaveAccessibleName('Language');
  await expect(options).toHaveCount(43);
  await expect(options.first()).toHaveText('Use browser setting (English)');
  await expect(options.nth(1)).toHaveText('Bahasa Indonesia');
  await expect(options.last()).toHaveText('繁體中文');
  await expect(chosen).toHaveText(['Use browser setting (English)']);
  await expect(
    list.getByRole('option', { name: '日本語', exact: true }),
  ).toHaveAttribute('lang', 'ja');
  // A box of seven entries of 32px, which scrolls for the others, with a
  // scrollbar of its own where the browser lets the page draw one.
  expect(
    await list.evaluate((element) => [
      element.clientHeight,
      element.scrollHeight > element.clientHeight,
    ]),
  ).toEqual([224, true]);
  if (browserName === 'chromium') {
    expect(
      await list.evaluate(
        (element) => getComputedStyle(element, '::-webkit-scrollbar').width,
      ),
    ).toBe('12px');
  }
  await snapshot(page, 'language');

  // The search is without regard to case or diacritics, by a language's own
  // name, its English name or its code.
  const search = page.getByRole('searchbox', { name: 'Search', exact: true });
  await search.fill('cestina');
  await expect(options).toHaveText(['Čeština']);
  await search.fill('GERMAN');
  await expect(options).toHaveText(['Deutsch']);
  await search.fill('pt-');
  await expect(options).toHaveText([
    'Português (Brasil)',
    'Português (Portugal)',
  ]);
  await search.fill('no such language');
  await expect(options).toHaveCount(0);
  await expect(page.getByRole('status')).toHaveText('No languages found');
  // The chosen entry stays chosen while the search hides it.
  await search.fill('');
  await expect(chosen).toHaveText(['Use browser setting (English)']);

  // Tab reaches the list, and Enter chooses the entry under the focus. Its
  // texts are fetched then, and the page is in the language at once.
  await search.fill('deu');
  await search.press('Tab');
  await expect(options.first()).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('html')).toHaveAttribute('lang', 'de');
  await expect(page).toHaveTitle('Sprache - Photo Data Viewer');
  await expect(list).toHaveAccessibleName('Sprache');
  await expect(chosen).toHaveText(['Deutsch']);
  expect(await page.evaluate(() => localStorage.getItem('Language'))).toBe(
    'de',
  );

  // The arrow keys and Home move along the list, and Space chooses.
  const germanSearch = page.getByRole('searchbox', {
    name: 'Suchen',
    exact: true,
  });
  await germanSearch.fill('');
  await germanSearch.press('Tab');
  await expect(
    list.getByRole('option', { name: 'Deutsch', exact: true }),
  ).toBeFocused();
  await page.keyboard.press('ArrowUp');
  await expect(
    list.getByRole('option', { name: 'Dansk', exact: true }),
  ).toBeFocused();
  await page.keyboard.press('Home');
  await expect(options.first()).toBeFocused();
  await expect(options.first()).toHaveText(
    'Einstellung des Browsers verwenden (English)',
  );
  await page.keyboard.press('Space');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(chosen).toHaveText(['Use browser setting (English)']);
  expect(await page.evaluate(() => localStorage.getItem('Language'))).toBe(
    'auto',
  );
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
  await page.locator('input[type=file]').setInputFiles({
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

test('a photo whose GPS values are empty is shown without a location', async ({
  page,
}) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await page.locator('input[type=file]').setInputFiles({
    name: 'empty-gps.jpg',
    mimeType: 'image/jpeg',
    buffer: photoWithEmptyGpsValues(),
  });
  await expect(
    page.getByRole('cell', { name: 'empty-gps.jpg', exact: true }),
  ).toBeVisible();
  await expect(page.locator('img[alt="empty-gps.jpg"]')).toBeVisible();
  await expect(
    page.getByText('Location data (latitude and longitude) is not available.'),
  ).toBeVisible();
  await expect(page.locator('.leaflet-container')).toBeVisible();
  await expect(page.locator('.leaflet-marker-icon')).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('errors nothing handled are sent to the analytics backend', async ({
  page,
}) => {
  const events = [];
  await page.route(
    /collect-(dev|prod)\.analytics\.photo-data-viewer\.tomoyukiaota\.com/,
    (route) => {
      events.push(...JSON.parse(route.request().postData()).events);
      return route.fulfill({ status: 204, body: '' });
    },
  );
  await page.goto('/');
  await page.evaluate(() => {
    setTimeout(() => {
      throw new TypeError('thrown by the test');
    });
    Promise.reject(new RangeError('rejected by the test'));
  });
  await expect
    .poll(() =>
      events
        .filter((event) => event.action === 'Unhandled Error')
        .map((event) => JSON.parse(event.label))
        .sort((a, b) => a.error.localeCompare(b.error)),
    )
    .toEqual([
      expect.objectContaining({
        error: 'RangeError: rejected by the test',
        errorSource: 'unhandledrejection',
        pathname: '/',
      }),
      expect.objectContaining({
        error: 'TypeError: thrown by the test',
        errorSource: 'error',
        pathname: '/',
      }),
    ]);
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

// The suite above runs with the en-US locale (playwright.config.mjs); these run
// as a browser set to Japanese, the first translation. The other languages are
// checked by the unit test of the translation files, not here.
test.describe('in a browser whose language is Japanese', () => {
  test.use({ locale: 'ja-JP' });

  test('the app is in Japanese, and the language chosen on the Language page is kept', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('lang', 'ja');
    await expect(page.getByRole('button', { name: '写真を選択' })).toBeVisible();
    await expect(
      page.getByRole('tab', { name: '全般', exact: true }),
    ).toBeVisible();
    await loadPhoto(page);
    // The day of the week in Date Taken comes from dayjs' Japanese locale, in
    // parentheses as Japanese writes it (dateTime.weekdayPattern in ja.json).
    await expect(
      page.getByRole('cell', {
        name: /^\d{4}-\d{2}-\d{2} \([日月火水木金土]\) \d{2}:\d{2}:\d{2}$/,
      }),
    ).toBeVisible();
    await snapshot(page, 'narrow-loaded-ja');

    await page.setViewportSize({ width: 1280, height: 800 });
    await page.getByRole('button', { name: 'メニュー', exact: true }).click();
    await page.getByRole('menuitem', { name: '設定', exact: true }).click();
    await expect(page.getByLabel('日付の形式', { exact: true })).toBeVisible();
    await snapshot(page, 'settings-ja');

    // The Language page, which the menu names in English as well, for someone
    // who cannot read Japanese.
    await page.getByRole('button', { name: 'メニュー', exact: true }).click();
    await page
      .getByRole('menuitem', { name: '言語 (Language)', exact: true })
      .click();
    const list = page.getByRole('listbox');
    const chosen = list.locator('[aria-selected="true"]');
    await expect(list).toHaveAccessibleName('言語');
    await expect(chosen).toHaveText(['ブラウザの設定に従う（日本語）']);
    const search = page.getByRole('searchbox', { name: '検索', exact: true });
    await expect(search).toBeVisible();
    await snapshot(page, 'language-ja');

    // The search also finds a language by its name in the language of the
    // page, which the browser knows.
    await search.fill('ドイツ語');
    await expect(list.getByRole('option')).toHaveText(['Deutsch']);
    await search.fill('');

    await list.getByRole('option', { name: 'English', exact: true }).click();
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(list).toHaveAccessibleName('Language');
    await expect(chosen).toHaveText(['English']);
    await expect(list.getByRole('option').first()).toHaveText(
      'Use browser setting (日本語)',
    );
    await page.reload();
    await expect(chosen).toHaveText(['English']);
    expect(await page.evaluate(() => localStorage.getItem('Language'))).toBe(
      'en',
    );
  });

  test('the About page is in Japanese', async ({ page }) => {
    await page.goto('/about');
    await expect(
      page.getByText('このアプリは Tomoyuki Aota が開発しています。'),
    ).toBeVisible();
    await expect(page).toHaveTitle('このアプリについて - Photo Data Viewer');
    await snapshot(page, 'about-ja');
  });
});

// One language written from right to left, for which the layout is mirrored.
test.describe('in a browser whose language is Arabic', () => {
  test.use({ locale: 'ar-EG' });

  test('the app is in Arabic and laid out from the right', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('lang', 'ar');
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    await loadPhoto(page);

    // The menu is where a line ends, at the left, and a name is to the right
    // of its value.
    const menuButton = page.getByRole('button', {
      name: 'القائمة',
      exact: true,
    });
    expect((await menuButton.boundingBox()).x).toBeLessThan(100);
    const name = page.getByRole('cell', { name: 'اسم الملف', exact: true });
    const value = page.getByRole('cell', { name: 'demo.jpg', exact: true });
    expect((await name.boundingBox()).x).toBeGreaterThan(
      (await value.boundingBox()).x,
    );
    // A photo's data keeps its own direction, so that "3.09 MB" is not shown
    // as "MB 3.09", and a minus sign stays before its number.
    await expect(page.getByText('3.09 MB', { exact: true })).toHaveCSS(
      'direction',
      'ltr',
    );
    await expect(page.getByText(/-122\.005661/)).toHaveCSS('direction', 'ltr');
    await expect(page.locator('.leaflet-marker-icon')).toBeVisible();
    await snapshot(page, 'loaded-general-ar');

    // The panes keep their sides, and the splitter between them follows the
    // mouse.
    const vertical = page.locator(
      '.reflex-container.vertical > .reflex-splitter',
    );
    const box = await vertical.boundingBox();
    await page.mouse.move(box.x + 4, box.y + 100);
    await page.mouse.down();
    await page.mouse.move(box.x - 96, box.y + 100, { steps: 5 });
    await page.mouse.up();
    const movedBox = await vertical.boundingBox();
    expect(Math.abs(movedBox.x - (box.x - 100))).toBeLessThanOrEqual(2);

    await menuButton.click();
    await page.getByRole('menuitem', { name: 'الإعدادات', exact: true }).click();
    await expect(
      page.getByLabel('تنسيق التاريخ', { exact: true }),
    ).toBeVisible();
    await snapshot(page, 'settings-ar');

    await menuButton.click();
    await page
      .getByRole('menuitem', { name: 'اللغة (Language)', exact: true })
      .click();
    const list = page.getByRole('listbox');
    await expect(list.locator('[aria-selected="true"]')).toHaveText([
      'استخدام إعداد المتصفح (العربية)',
    ]);
    await snapshot(page, 'language-ar');

    // A language written from left to right lays the page out from the left
    // again.
    await list.getByRole('option', { name: 'English', exact: true }).click();
    await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
    const englishMenuButton = page.getByRole('button', {
      name: 'menu',
      exact: true,
    });
    expect((await englishMenuButton.boundingBox()).x).toBeGreaterThan(1100);
    expect(errors).toEqual([]);
  });

  test('the narrow layout is laid out from the right as well', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    await loadPhoto(page);
    await snapshot(page, 'narrow-loaded-ar');
  });
});
