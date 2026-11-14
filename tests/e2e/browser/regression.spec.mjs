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

/** The address of the page that each entry of the menu opens, by the entry's name in English. */
const menuPaths = {
  Home: '/',
  Demo: '/demo',
  Settings: '/settings',
  Language: '/language',
  About: '/about',
};

/**
 * Opens a page from the menu, and waits until the page's address is the new
 * one.
 *
 * TL;DR: What follows is to see the new page, not the one before it.
 * Details: The entry changes the page a moment after the click. `snapshot`
 * goes by the address to tell whether to wait for the map: called while the
 * address was still the Home page's, it waited for a map on the Settings page,
 * which has none, and the test failed now and then on a slow machine.
 */
async function navigate(page, name) {
  await page.getByRole('button', { name: 'menu', exact: true }).click();
  await page.getByRole('menuitem', { name, exact: true }).click();
  await page.waitForURL((url) => url.pathname === menuPaths[name]);
}

/**
 * How long to wait for an event to reach the analytics backend.
 *
 * TL;DR: Longer than the five seconds of `expect`, which end before the app
 * tries a second time.
 * Details: The app sends an event a second after it is recorded, and when
 * the request fails it tries again five seconds later
 * (src/analytics/pdv-backend/sender.ts): the event then arrives six seconds
 * after it was recorded. That happened once in CI, on Windows, where the
 * test failed with nothing received after five seconds. What made the
 * request fail is not known: it could not be made to happen again, and CI
 * kept no trace of a test then.
 */
const SENT_TIMEOUT = 15000;

/**
 * Collects the events that the page sends to the analytics backend, which
 * this answers in place of the route that answers them for every test, and
 * what the app logs about sending them.
 */
async function collectEvents(page) {
  const sent = { events: [], log: [], pageLoads: 0 };
  page.on('load', () => sent.pageLoads++);
  page.on('console', (message) => {
    if (message.text().startsWith('[Analytics]')) sent.log.push(message.text());
  });
  await page.route(
    /collect-(dev|prod)\.analytics\.photo-data-viewer\.tomoyukiaota\.com/,
    (route) => {
      sent.events.push(...JSON.parse(route.request().postData()).events);
      return route.fulfill({ status: 204, body: '' });
    },
  );
  return sent;
}

/**
 * Waits until what `read` finds in the events sent is `expected`.
 *
 * When it does not come, the failure has what the app logged about sending,
 * and how often the page was loaded: a request that failed, an event that
 * was never recorded and a change of page that loaded the page anew look
 * the same otherwise.
 */
async function expectSent(sent, read, expected) {
  try {
    await expect
      .poll(() => read(sent.events), { timeout: SENT_TIMEOUT })
      .toEqual(expected);
  } catch (error) {
    await test.info().attach('what the app logged about sending', {
      body: [`Page loads: ${sent.pageLoads}`, ...sent.log].join('\n'),
      contentType: 'text/plain',
    });
    throw error;
  }
}

/** What the events say of the language under an action: the labels, in order. */
function languageLabels(events, action) {
  return events
    .filter(
      (event) => event.action === action && /^Language/.test(event.label),
    )
    .map((event) => event.label);
}

/** What was recorded each time the Language page was left, in order. */
function leftLanguagePage(events) {
  return events
    .filter((event) => event.action === 'Left Language Page')
    .map((event) => JSON.parse(event.label));
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

/** What each test's page did besides what the test looks at, for a test that fails. */
const pageActivity = new WeakMap();

/** A request as a failure shows it: the app's own by its path, another site's by its host and path. */
function shortUrl(url, appOrigin) {
  const { origin, host, pathname } = new URL(url);
  return (origin === appOrigin ? pathname : `${host}${pathname}`).slice(0, 80);
}

// TL;DR: A test that fails shows how its page was loaded, the requests that
// failed and the errors on the page.
// Details: It is what a failure in CI shows at a glance; the run keeps the
// test's trace as well (ci.yml). A test failed once on Windows with the Home
// page never drawn, in the development mode, when CI kept no trace: whether
// a request of the page failed, the page was loaded again or nothing
// happened at all could not be told.
test.beforeEach(async ({ page }, testInfo) => {
  const started = Date.now();
  const appOrigin = new URL(testInfo.project.use.baseURL).origin;
  const activity = { loads: [], failedRequests: [], errors: [] };
  pageActivity.set(page, activity);
  page.on('load', () =>
    activity.loads.push(`${((Date.now() - started) / 1000).toFixed(1)} s`),
  );
  page.on('requestfailed', (request) =>
    activity.failedRequests.push(
      `${request.failure()?.errorText} ${request.method()} ${shortUrl(request.url(), appOrigin)}`,
    ),
  );
  page.on('console', (message) => {
    if (message.type() === 'error') activity.errors.push(message.text());
  });
  page.on('pageerror', (error) => activity.errors.push(error.message));
});

test.afterEach(async ({ page }, testInfo) => {
  const activity = pageActivity.get(page);
  if (!activity || testInfo.status === testInfo.expectedStatus) return;
  // The reporter prints the first 300 characters of each.
  await testInfo.attach('page loads and failed requests', {
    body: [
      `Loads: ${activity.loads.length} (${activity.loads.join(', ')} after the start)`,
      `Failed requests: ${activity.failedRequests.length}`,
      ...activity.failedRequests,
    ].join('\n'),
    contentType: 'text/plain',
  });
  if (activity.errors.length > 0) {
    await testInfo.attach('errors on the page', {
      body: activity.errors.join('\n'),
      contentType: 'text/plain',
    });
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
  // The fields follow their texts in every language, and in English they
  // are as wide as they always were. The widths are asked for until the page
  // has its fields: it may not have them yet when its address has changed.
  await expect
    .poll(() =>
      page
        .locator('[data-label]')
        .evaluateAll((boxes) =>
          boxes.map((box) => Math.round(box.getBoundingClientRect().width)),
        ),
    )
    .toEqual([150, 110]);
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

  // The search field has the focus when the page opens, as a keyboard is at
  // hand in this browser, and the page is not scrolled for it.
  const search = page.getByRole('searchbox', { name: 'Search', exact: true });
  await expect(search).toBeFocused();
  expect(await page.evaluate(() => window.scrollY)).toBe(0);
  // A magnifying glass is in the search field at its end, the right here, as
  // search fields usually have one: 20 pixels, 8 from the field's edge, in the
  // middle of its height, and the field's text ends before it.
  const searchBox = await search.boundingBox();
  const glass = await search
    .locator('xpath=following-sibling::*[1]')
    .boundingBox();
  expect([glass.width, glass.height]).toEqual([20, 20]);
  expect(searchBox.x + searchBox.width - (glass.x + glass.width)).toBe(8);
  expect(glass.y - searchBox.y).toBe((searchBox.height - glass.height) / 2);
  await expect(search).toHaveCSS('padding-right', '36px');

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
  // The line that says when the search finds no language is in the page from
  // the start, empty and without height, so that a screen reader says it when
  // it comes.
  const status = page.getByRole('status');
  await expect(status).toBeAttached();
  await expect(status).toHaveText('');
  // Found without its role, which a hidden list has not: the list is hidden
  // while the search finds no language.
  const box = page.locator('[role="listbox"]').locator('xpath=..');
  const boxHeight = (await box.boundingBox()).height;
  expect(boxHeight).toBe(226); // Seven entries and the border.
  if (browserName === 'chromium') {
    expect(
      await list.evaluate(
        (element) => getComputedStyle(element, '::-webkit-scrollbar').width,
      ),
    ).toBe('12px');
  }
  await snapshot(page, 'language');

  // The search is without regard to case or diacritics, by a language's own
  // name, its English name or its code. The box keeps its height whatever the
  // search leaves, so that nothing below it moves while the user types.
  await search.fill('cestina');
  await expect(options).toHaveText(['Čeština']);
  expect((await box.boundingBox()).height).toBe(boxHeight);
  await search.fill('GERMAN');
  await expect(options).toHaveText(['Deutsch']);
  await search.fill('pt-');
  await expect(options).toHaveText([
    'Português (Brasil)',
    'Português (Portugal)',
  ]);
  await search.fill('no such language');
  await expect(options).toHaveCount(0);
  await expect(status).toHaveText('No languages found');
  // The line is in the box, in the place of the entries.
  const statusBox = await status.boundingBox();
  const emptyBox = await box.boundingBox();
  expect(emptyBox.height).toBe(boxHeight);
  expect(statusBox.y).toBeGreaterThanOrEqual(emptyBox.y);
  expect(statusBox.y + statusBox.height).toBeLessThan(
    emptyBox.y + emptyBox.height,
  );
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
  // A letter typed on the list moves to the next language whose name starts
  // with it, and letters typed in quick succession are taken together, as in
  // Photo Location Map's list.
  await page.keyboard.press('s');
  await expect(
    list.getByRole('option', { name: 'Slovenčina', exact: true }),
  ).toBeFocused();
  await page.keyboard.press('v');
  await expect(
    list.getByRole('option', { name: 'Svenska', exact: true }),
  ).toBeFocused();
  await page.keyboard.press('Home');
  await expect(options.first()).toBeFocused();
  // The entry that follows the browser, which names the browser's language.
  // Its German words are not checked: they are a translation, which a review
  // may change.
  await expect(options.first()).toContainText('(English)');
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

test('the language is recorded when the app opens, when it is changed, and when the Language page is left', async ({
  page,
}) => {
  const sent = await collectEvents(page);
  const loaded = (events) => languageLabels(events, 'Loaded User Setting');
  const changed = (events) => languageLabels(events, 'Changed User Setting');

  // When the app opens: the setting, which follows the browser until a
  // language is chosen, and the language that the app is shown in.
  await page.goto('/');
  await expectSent(sent, loaded, ['Language: auto', 'Language in Use: en']);

  // When a language is chosen on the Language page.
  await navigate(page, 'Language');
  await page
    .getByRole('listbox')
    .getByRole('option', { name: '日本語', exact: true })
    .click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'ja');
  await expectSent(sent, changed, ['Language: ja', 'Language in Use: ja']);
  expect(leftLanguagePage(sent.events)).toEqual([]);

  // When the Language page is left for another page, by the menu: the
  // language settled on, and the one found on arriving.
  await page.getByRole('button', { name: 'メニュー', exact: true }).click();
  await page.getByRole('menuitem', { name: '設定', exact: true }).click();
  await page.waitForURL((url) => url.pathname === '/settings');
  const leftWithJapanese = {
    languageSetting: 'ja',
    languageInUse: 'ja',
    languageSettingOnArrival: 'auto',
    languageInUseOnArrival: 'en',
    isChanged: true,
  };
  await expectSent(sent, leftLanguagePage, [leftWithJapanese]);

  // By the browser's Back as well, and when nothing was chosen. Going back to
  // the Language page records nothing; going back from it does.
  await page.goBack();
  await page.waitForURL((url) => url.pathname === '/language');
  await page.goBack();
  await page.waitForURL((url) => url.pathname === '/');
  await expectSent(sent, leftLanguagePage, [
    leftWithJapanese,
    {
      languageSetting: 'ja',
      languageInUse: 'ja',
      languageSettingOnArrival: 'ja',
      languageInUseOnArrival: 'ja',
      isChanged: false,
    },
  ]);
  // The app was opened once, and the language changed once.
  expect(loaded(sent.events)).toHaveLength(2);
  expect(changed(sent.events)).toHaveLength(2);
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
    await expect(search).toBeFocused();
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

  // The setting follows the browser here, and so does not tell the language.
  // Japanese is fetched before the app is shown, and recorded once it is.
  test('the language shown is recorded beside the setting, also on the Language page as the first page', async ({
    page,
  }) => {
    const sent = await collectEvents(page);
    await page.goto('/language');
    await expect(page.locator('html')).toHaveAttribute('lang', 'ja');
    await expectSent(
      sent,
      (events) => languageLabels(events, 'Loaded User Setting'),
      ['Language: auto', 'Language in Use: ja'],
    );

    await page.getByRole('button', { name: 'メニュー', exact: true }).click();
    await page.getByRole('menuitem', { name: 'ホーム', exact: true }).click();
    await page.waitForURL((url) => url.pathname === '/');
    await expectSent(sent, leftLanguagePage, [
      {
        languageSetting: 'auto',
        languageInUse: 'ja',
        languageSettingOnArrival: 'auto',
        languageInUseOnArrival: 'ja',
        isChanged: false,
      },
    ]);
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

// TL;DR: The layout is one for every language, and holds whatever the length
// of a language's words and sentences is. Polish stands for the languages
// that write more than English does.
// Details: Nothing here names a Polish text: the elements are found by where
// they are, so that a change of a translation does not break the test.
test.describe('in a language with longer words (Polish), on a phone', () => {
  test.use({ locale: 'pl-PL', viewport: { width: 320, height: 667 } });

  const centre = (box) => box.y + box.height / 2;
  /** Whether a text is cut, sideways or in height, by the box that it is in. */
  const isCut = (locator) =>
    locator.evaluate(
      (element) =>
        element.scrollWidth > element.clientWidth + 1 ||
        element.scrollHeight > element.clientHeight + 1,
    );
  const pageIsWiderThanTheWindow = (page) =>
    page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    );

  test('the header is as high as its text, and a name of the table stays beside its number', async ({
    page,
  }) => {
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('lang', 'pl');

    // The sentence takes more lines than in English, and the header grows
    // with it: the button under the sentence is all in view, above the tabs,
    // and the sentence ends before the menu's button.
    const button = page
      .locator('input[type=file]')
      .locator('xpath=preceding-sibling::button');
    const sentence = button.locator('xpath=preceding-sibling::div');
    const menuButton = page.locator('button[aria-label]').first();
    await expect(button).toBeInViewport({ ratio: 1 });
    const buttonBox = await button.boundingBox();
    const sentenceBox = await sentence.boundingBox();
    const menuBox = await menuButton.boundingBox();
    const tabsBox = await page.getByRole('tablist').first().boundingBox();
    expect(sentenceBox.height).toBeGreaterThan(30); // More than one line.
    expect(buttonBox.y + buttonBox.height).toBeLessThanOrEqual(tabsBox.y);
    expect(sentenceBox.x + sentenceBox.width).toBeLessThanOrEqual(menuBox.x);
    expect(await pageIsWiderThanTheWindow(page)).toBe(false);

    // Each of the latitude and the longitude has its name beside its number,
    // though the name takes two lines of the names' column here.
    await loadPhoto(page);
    const row = page.getByText('37.332558', { exact: true }).locator('xpath=..');
    const [latitudeName, longitudeName, latitude, longitude] = await Promise.all(
      [0, 1, 2, 3].map((n) => row.locator('> div').nth(n).boundingBox()),
    );
    expect(latitudeName.height).toBeGreaterThan(30); // On two lines.
    expect(Math.abs(centre(latitudeName) - centre(latitude))).toBeLessThanOrEqual(1);
    expect(Math.abs(centre(longitudeName) - centre(longitude))).toBeLessThanOrEqual(1);
    expect(longitudeName.y).toBeGreaterThanOrEqual(
      latitudeName.y + latitudeName.height,
    );
    // No name of the table is cut, and the table is no wider than the window.
    for (const name of await page.locator('tbody td:first-child').all()) {
      expect(await isCut(name)).toBe(false);
    }
    expect(await pageIsWiderThanTheWindow(page)).toBe(false);
    expect(errors).toEqual([]);
  });

  test('a field of the Settings page is as wide as its label, which is not cut', async ({
    page,
  }) => {
    await page.goto('/settings');
    await expect(page.locator('html')).toHaveAttribute('lang', 'pl');
    for (const id of ['date-format', 'clock-system-format']) {
      // The label on the field's border, which MUI cuts with "…" where it is
      // wider than the field, and the field's chosen value.
      const label = page.locator(`#${id}`);
      const field = page.locator(`[aria-labelledby~="${id}"]`);
      await expect(label).toBeInViewport({ ratio: 1 });
      await expect(field).toBeInViewport({ ratio: 1 });
      expect(await isCut(label)).toBe(false);
      expect(await isCut(field)).toBe(false);
    }
    // The clock's field follows its label: it is wider than the 110 pixels
    // that it has in English, and the two fields are one under the other,
    // as they do not fit side by side here.
    const [dateBox, clockBox] = await Promise.all(
      [0, 1].map((n) => page.locator('[data-label]').nth(n).boundingBox()),
    );
    expect(clockBox.width).toBeGreaterThan(110);
    expect(clockBox.y).toBeGreaterThan(dateBox.y + dateBox.height);
    expect(await pageIsWiderThanTheWindow(page)).toBe(false);
  });

  test('the dialog and the messages for a file that cannot be read are whole', async ({
    page,
  }) => {
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('lang', 'pl');
    await page.locator('input[type=file]').setInputFiles({
      name: 'broken.jpg',
      mimeType: 'image/jpeg',
      buffer: Buffer.from('invalid'),
    });

    // The dialog is all in the window, and its title, its message and its
    // button are one under another with a space between them, though the
    // title takes two lines here.
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeInViewport({ ratio: 1 });
    const parts = dialog.locator('> div > *');
    await expect(parts).toHaveCount(3);
    const [title, message, close] = await Promise.all(
      [0, 1, 2].map((n) => parts.nth(n).boundingBox()),
    );
    expect(title.height).toBeGreaterThan(40); // On two lines.
    expect(message.y - (title.y + title.height)).toBeGreaterThanOrEqual(8);
    expect(close.y - (message.y + message.height)).toBeGreaterThanOrEqual(8);
    expect(await isCut(dialog.locator('> div'))).toBe(false);
    await dialog.getByRole('button').click();
    await expect(dialog).toBeHidden();

    // The message in the map's place is in a box as high as its lines, inside
    // the pane; the one in the photo's place is inside the pane as well.
    const tabs = page.getByRole('tablist').first().getByRole('tab');
    await tabs.nth(1).click();
    const mapMessage = page.locator('[class*="overlay-content"]');
    await expect(mapMessage).toBeInViewport({ ratio: 1 });
    expect(await isCut(mapMessage)).toBe(false);
    await tabs.nth(2).click();
    const photoMessage = page.locator('[class*="PhotoText_text"]');
    await expect(photoMessage).toBeInViewport({ ratio: 1 });
    expect(await isCut(photoMessage)).toBe(false);
    expect(await pageIsWiderThanTheWindow(page)).toBe(false);
  });
});

test.describe('on a phone', () => {
  // A device that is touched, which Playwright emulates in Chromium alone.
  test.skip(
    ({ browserName }) => browserName !== 'chromium',
    'Playwright emulates a touch device in Chromium alone.',
  );
  test.use({
    viewport: { width: 375, height: 667 },
    isMobile: true,
    hasTouch: true,
  });

  test('the Language page leaves the focus alone, so that the keyboard stays down until the user asks for it', async ({
    page,
  }) => {
    await page.goto('/language');
    // What the page goes by: the main pointer is a finger.
    expect(
      await page.evaluate(() => window.matchMedia('(pointer: coarse)').matches),
    ).toBe(true);
    const search = page.getByRole('searchbox', { name: 'Search', exact: true });
    await expect(search).toBeVisible();
    await expect(page.getByRole('option')).toHaveCount(43);
    await expect(search).not.toBeFocused();
    expect(await page.evaluate(() => document.activeElement.tagName)).toBe(
      'BODY',
    );
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
    // The language's name is a value put into the text: in a language written
    // from right to left it is between U+2068 and U+2069, which are not drawn
    // and keep it together.
    await expect(list.locator('[aria-selected="true"]')).toHaveText([
      'استخدام إعداد المتصفح (\u2068العربية\u2069)',
    ]);
    // The magnifying glass of the search field is where its line ends, at the
    // left.
    const arabicSearch = page.getByRole('searchbox');
    const searchBox = await arabicSearch.boundingBox();
    const glass = await arabicSearch
      .locator('xpath=following-sibling::*[1]')
      .boundingBox();
    expect(glass.x - searchBox.x).toBe(8);
    await expect(arabicSearch).toHaveCSS('padding-left', '36px');
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
