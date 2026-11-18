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

/** Takes the page's screenshot; `withMenu` for one of the menu open. */
async function snapshot(page, name, { withMenu = false } = {}) {
  if (
    page.viewportSize().width > 1200 &&
    new URL(page.url()).pathname === '/'
  ) {
    await expect(page.locator('.leaflet-container')).toBeVisible();
  }
  await page.evaluate(() => document.fonts.ready);
  // The menu's backdrop stays over the page for a moment after the menu is
  // closed, without fading.
  if (!withMenu) await expect(page.locator('#menu-appbar')).toBeHidden();
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

/** demo.jpg, as a file that is dragged and dropped. */
const photoFile = { name: 'demo.jpg', mimeType: 'image/jpeg', buffer: photo };

/**
 * Drags files from outside the browser over the page, as from the file
 * manager, and gives what they are dragged with, to drop them with.
 *
 * TL;DR: The drag's events are dispatched, with a DataTransfer that holds
 * the files.
 * Details: Playwright cannot drag a file from outside the browser: a drag of
 * its own starts in the page, which the app leaves alone. A browser does not
 * let a page set the drop effect of a DataTransfer that the page made, so
 * what the pointer shows is checked by the unit test
 * (src/components/drop-photo/DropPhoto.spec.tsx).
 */
async function dragFiles(page, files, target = page.locator('#__next')) {
  const dataTransfer = await page.evaluateHandle(
    (files) => {
      const transfer = new DataTransfer();
      for (const { name, type, base64 } of files) {
        const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
        transfer.items.add(new File([bytes], name, { type }));
      }
      return transfer;
    },
    files.map(({ name, mimeType, buffer }) => ({
      name,
      type: mimeType,
      base64: buffer.toString('base64'),
    })),
  );
  await target.dispatchEvent('dragenter', { dataTransfer });
  await target.dispatchEvent('dragover', { dataTransfer });
  return dataTransfer;
}

/** Drags files from outside the browser over the page and drops them there. */
async function dropFiles(page, files, target = page.locator('#__next')) {
  const dataTransfer = await dragFiles(page, files, target);
  await target.dispatchEvent('drop', { dataTransfer });
}

/** The address of the page that each entry of the menu opens, by the entry's name in English. */
const menuPaths = {
  Home: '/',
  Demo: '/demo',
  Settings: '/settings',
  Language: '/language',
  About: '/about',
  Credits: '/credits',
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

/**
 * The scripts of Vercel's Web Analytics and Speed Insights, which exist on
 * Vercel only (src/analytics/VercelAnalytics.tsx): those that a production
 * server asks for, and the debug versions that a development server loads from
 * Vercel.
 */
const vercelScripts =
  /\/_vercel\/(insights|speed-insights)\/script\.js$|va\.vercel-scripts\.com/;

test.beforeEach(async ({ page }) => {
  // Keep baseline captures independent of map servers, and GA. Vercel's
  // scripts are empty ones, which send nothing.
  await page.route(vercelScripts, (route) =>
    route.fulfill({ contentType: 'text/javascript', body: '' }),
  );
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

// TL;DR: Chrome offers to install the app, which then opens in a window of its
// own. Edge, built on Chromium, asks for the same.
// Details: The browser does so when the web app manifest has what it asks for
// (docs/tasks/20261118_installable-app), and says through the DevTools
// protocol what is missing, as DevTools' Application panel does. It is asked
// in a browser of its own: Playwright's usual context is Incognito, where
// nothing is installed, and the headless shell that Playwright runs by default
// does not check at all, so this runs the full browser, without a window too.
test('Chrome offers to install the app, with its name and icons', async ({
  browserName,
  headless,
  launchOptions,
  playwright,
}, testInfo) => {
  test.skip(
    browserName !== 'chromium',
    'Chromium alone tells whether a page can be installed.',
  );
  const baseURL = testInfo.project.use.baseURL;
  const appOrigin = new URL(baseURL).origin;
  const context = await playwright.chromium.launchPersistentContext(
    testInfo.outputPath('profile'),
    {
      ...launchOptions,
      channel: launchOptions.channel ?? 'chromium',
      headless,
      baseURL,
    },
  );
  try {
    // Nothing but the app is reached: no analytics, fonts or map tiles.
    await context.route(
      (url) => url.origin !== appOrigin,
      (route) => route.abort(),
    );
    const page = context.pages()[0] ?? (await context.newPage());
    // The event that the browser fires when it offers to install the page.
    await page.addInitScript(() => {
      window.installOffered = false;
      window.addEventListener('beforeinstallprompt', () => {
        window.installOffered = true;
      });
    });
    await page.goto('/');
    const cdp = await context.newCDPSession(page);
    expect(await cdp.send('Page.getInstallabilityErrors')).toEqual({
      installabilityErrors: [],
    });
    await expect
      .poll(() => page.evaluate(() => window.installOffered))
      .toBe(true);

    const { errors, manifest } = await cdp.send('Page.getAppManifest');
    expect(errors).toEqual([]);
    expect(manifest).toMatchObject({
      name: 'Photo Data Viewer',
      startUrl: `${appOrigin}/`,
      scope: `${appOrigin}/`,
      display: 'kStandalone',
    });
    // Each icon is the size that the manifest gives it, read from its PNG
    // header, so that a size changed in one place alone is found.
    expect(manifest.icons).toHaveLength(4);
    for (const icon of [
      ...manifest.icons,
      { url: `${appOrigin}/apple-touch-icon.png`, sizes: '180x180' },
    ]) {
      const response = await page.request.get(icon.url);
      expect(response.ok()).toBe(true);
      const png = await response.body();
      expect(`${png.readUInt32BE(16)}x${png.readUInt32BE(20)}`).toBe(
        icon.sizes,
      );
    }
    await expect(page.locator('link[rel=apple-touch-icon]')).toHaveAttribute(
      'href',
      '/apple-touch-icon.png',
    );
  } finally {
    await context.close();
  }
});

// The page's theme-color, which Chrome takes for the installed app's title bar
// in place of the manifest's, and with it whether the window and its file
// dialog are light or dark.
test("the installed app's title bar is white, and dark when the system is dark", async ({
  page,
}) => {
  await page.goto('/');
  const themeColor = () =>
    page.evaluate(
      () =>
        [...document.querySelectorAll('meta[name=theme-color]')].find(
          (meta) => matchMedia(meta.media).matches,
        )?.content,
    );
  await page.emulateMedia({ colorScheme: 'light' });
  expect(await themeColor()).toBe('#ffffff');
  await page.emulateMedia({ colorScheme: 'dark' });
  expect(await themeColor()).toBe('#202124');
});

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

/** The credits of the Credits page, in Flaticon's words, which stay in English in every language. */
const creditLines = [
  'Icons made by Magnific from www.flaticon.com',
  'Icon made by srip from www.flaticon.com',
  'Icon made by Dave Gandy from www.flaticon.com, licensed under CC BY 3.0',
];

test('the Credits page, the last entry of the menu, credits the authors of the icons, with links to them', async ({
  page,
}) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/about');
  await page.getByRole('button', { name: 'menu', exact: true }).click();
  // The entries of the pages, and Layout, which opens a submenu, after
  // Language.
  const entries = Object.keys(menuPaths);
  entries.splice(entries.indexOf('Language') + 1, 0, 'Layout');
  await expect(page.getByRole('menuitem')).toHaveText(entries);
  await page.keyboard.press('Escape');
  await navigate(page, 'Credits');
  await expect(page).toHaveTitle('Credits - Photo Data Viewer');
  await expect(page.getByRole('listitem')).toHaveText(creditLines);
  for (const [name, href] of [
    ['Magnific', 'https://www.flaticon.com/authors/magnific'],
    ['srip', 'https://www.flaticon.com/authors/srip'],
    ['Dave Gandy', 'https://www.flaticon.com/authors/dave-gandy'],
    ['CC BY 3.0', 'https://creativecommons.org/licenses/by/3.0/'],
  ]) {
    await expect(
      page.getByRole('link', { name, exact: true }),
    ).toHaveAttribute('href', href);
  }
  await expect(
    page.getByRole('link', { name: 'www.flaticon.com', exact: true }),
  ).toHaveCount(3);
  // The icons are drawn, beside their author's line.
  const icons = page.getByRole('listitem').locator('img');
  await expect(icons).toHaveCount(5);
  for (const icon of await icons.all()) {
    expect(await icon.evaluate((img) => img.naturalWidth)).toBeGreaterThan(0);
  }
  await snapshot(page, 'credits');
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

test('a photo dropped on the page is selected once the dialog asks, and recorded as dropped', async ({
  page,
}) => {
  const sent = await collectEvents(page);
  await page.goto('/');
  const placeholder = page.getByText(
    'The selected photo will be displayed here.',
    { exact: true },
  );

  // While the file is over the page, a veil says that the app takes it.
  const dataTransfer = await dragFiles(page, [photoFile], placeholder);
  const veil = page.getByText('Drop the photo to select it.', {
    exact: true,
  });
  await expect(veil).toBeVisible();
  await snapshot(page, 'drop-veil');

  // Dropped, it is not selected until the dialog asks, which names it.
  await placeholder.dispatchEvent('drop', { dataTransfer });
  await expect(veil).toBeHidden();
  const dialog = page.getByRole('dialog', {
    name: 'Are you sure you want to select the photo below?',
    exact: true,
  });
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText('demo.jpg');
  // Cancel has the focus, so that Enter replaces nothing. Select, the action
  // that the dialog asks about, is in the blue of the app's buttons, and
  // Cancel in the grey of the dialogs' buttons.
  const cancel = dialog.getByRole('button', { name: 'Cancel', exact: true });
  const select = dialog.getByRole('button', { name: 'Select', exact: true });
  await expect(cancel).toBeFocused();
  await expect(select).toHaveCSS('background-color', 'rgb(25, 118, 210)');
  await expect(select).toHaveCSS('color', 'rgb(255, 255, 255)');
  await expect(cancel).toHaveCSS('background-color', 'rgb(221, 221, 221)');
  await snapshot(page, 'drop-dialog');

  // Cancel, Escape, or Enter on Cancel, selects nothing.
  await cancel.click();
  await expect(dialog).toBeHidden();
  await dropFiles(page, [photoFile]);
  await expect(dialog).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await dropFiles(page, [photoFile]);
  await expect(cancel).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(dialog).toBeHidden();
  await expect(placeholder).toBeVisible();

  // Tab moves to Select, and Enter selects the photo.
  await dropFiles(page, [photoFile]);
  await expect(cancel).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(select).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(
    page.getByRole('cell', { name: 'demo.jpg', exact: true }),
  ).toBeVisible();
  await expect(page).toHaveTitle(/demo.jpg/);

  // A drag that starts in the page, as the shown photo dragged by the mouse
  // does, is the page's own, though the browser gives the photo with it as a
  // file: the app leaves it to the browser, which does not open it.
  // Playwright's own drag gives the target no file, so the events are
  // dispatched.
  const isOwnDragTaken = await page.evaluate(() => {
    const image = document.querySelector('img[alt="demo.jpg"]');
    const app = document.querySelector('#__next');
    const transfer = new DataTransfer();
    transfer.items.add(new File(['x'], 'demo.jpg', { type: 'image/jpeg' }));
    const fire = (target, type) => {
      const event = new DragEvent(type, {
        dataTransfer: transfer,
        bubbles: true,
        cancelable: true,
      });
      target.dispatchEvent(event);
      return event.defaultPrevented;
    };
    fire(image, 'dragstart');
    const taken = [fire(app, 'dragenter'), fire(app, 'dragover'), fire(app, 'drop')];
    fire(image, 'dragend');
    return taken;
  });
  expect(isOwnDragTaken).toEqual([false, false, false]);
  await expect(dialog).toBeHidden();
  // A file from outside, after it, is taken again.
  await dropFiles(page, [photoFile]);
  await expect(dialog).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();

  // The usage data has the dialog each time it asked, and the photo as one
  // dropped.
  await expectSent(
    sent,
    (events) =>
      events
        .filter((event) => event.action === 'Opened Drop Photo Dialog')
        .map((event) => JSON.parse(event.label)),
    [
      { fileCount: 1 },
      { fileCount: 1 },
      { fileCount: 1 },
      { fileCount: 1 },
      { fileCount: 1 },
    ],
  );
  await expectSent(
    sent,
    (events) =>
      events
        .filter((event) => event.action === 'Loaded Photo')
        .map((event) => JSON.parse(event.label))
        .map(({ isDropped, isReload, isDemo }) => ({ isDropped, isReload, isDemo })),
    [{ isDropped: true, isReload: false, isDemo: false }],
  );
});

test('a photo dropped on another page is selected on the Home page, and of several files the first', async ({
  page,
}) => {
  await page.goto('/settings');
  await dropFiles(page, [
    { ...photoFile, name: 'first.jpg' },
    { ...photoFile, name: 'second.jpg' },
  ]);
  const dialog = page.getByRole('dialog');
  await expect(dialog).toContainText('first.jpg');
  await expect(dialog).not.toContainText('second.jpg');
  await dialog.getByRole('button', { name: 'Select', exact: true }).click();
  await page.waitForURL((url) => url.pathname === '/');
  await expect(
    page.getByRole('cell', { name: 'first.jpg', exact: true }),
  ).toBeVisible();
});

test('a dropped file that is not a photo gets the dialog that one chosen with the button gets, and text dragged is left alone', async ({
  page,
}) => {
  await page.goto('/');

  // Text and links that are dragged carry no file: no veil, and the browser
  // does with them what it did.
  const isTextTaken = await page.evaluate(() => {
    const transfer = new DataTransfer();
    transfer.setData('text/plain', 'https://example.com/');
    const event = new DragEvent('dragover', {
      dataTransfer: transfer,
      bubbles: true,
      cancelable: true,
    });
    document.querySelector('#__next').dispatchEvent(event);
    return event.defaultPrevented;
  });
  expect(isTextTaken).toBe(false);
  await expect(
    page.getByText('Drop the photo to select it.', { exact: true }),
  ).toBeHidden();

  await dropFiles(page, [
    { name: 'broken.jpg', mimeType: 'image/jpeg', buffer: Buffer.from('invalid') },
  ]);
  await page
    .getByRole('dialog')
    .getByRole('button', { name: 'Select', exact: true })
    .click();
  const unsupported = page
    .getByRole('dialog')
    .filter({ hasText: 'EXIF data is not available.' });
  await expect(unsupported).toBeVisible();

  // A file dropped on that dialog is refused: no dialog asks about it. The
  // app opens a dialog as the drop is handled, so it would be there by now.
  await dropFiles(page, [photoFile], unsupported);
  await expect(page.getByRole('dialog')).toHaveCount(1);
  await unsupported.getByRole('button', { name: 'Close', exact: true }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(
    page.getByRole('cell', { name: 'broken.jpg', exact: true }),
  ).toBeVisible();
});

/**
 * Makes the page say that it runs on `platform`, as `navigator.platform`
 * says it: `Win32` on Windows, `MacIntel` on a Mac.
 */
async function emulatePlatform(page, platform) {
  await page.addInitScript((platform) => {
    Object.defineProperty(Navigator.prototype, 'platform', {
      get: () => platform,
      configurable: true,
    });
  }, platform);
}

for (const { platform, system, fileManager } of [
  { platform: 'Win32', system: 'Windows', fileManager: 'File Explorer' },
  { platform: 'MacIntel', system: 'a Mac', fileManager: 'Finder' },
]) {
  test(`the button beside Select Photo says that a file can be dropped from ${fileManager}, on ${system}`, async ({
    page,
  }) => {
    await emulatePlatform(page, platform);
    await page.goto('/');
    const selectPhoto = page.getByRole('button', {
      name: 'Select Photo',
      exact: true,
    });
    // Found while its box is open as well, when MUI hides what is outside the
    // box from screen readers.
    const hint = page.getByRole('button', {
      name: 'About drag and drop',
      exact: true,
      includeHidden: true,
    });

    // Right beside Select Photo, on its line.
    const [selectBox, hintBox] = await Promise.all([
      selectPhoto.boundingBox(),
      hint.boundingBox(),
    ]);
    expect(hintBox.x).toBeGreaterThanOrEqual(selectBox.x + selectBox.width);
    expect(hintBox.x - (selectBox.x + selectBox.width)).toBeLessThan(10);
    expect(
      Math.abs(
        hintBox.y + hintBox.height / 2 - (selectBox.y + selectBox.height / 2),
      ),
    ).toBeLessThanOrEqual(2);

    // The box under it names the file manager of the system.
    await hint.click();
    const box = page.getByRole('dialog', {
      name: `You can also drag and drop a file from ${fileManager} to select it.`,
      exact: true,
    });
    await expect(box).toBeVisible();
    await expect(hint).toHaveAttribute('aria-expanded', 'true');
    if (platform === 'Win32') await snapshot(page, 'drop-hint');

    // Escape closes it, and gives the focus back to the button.
    await page.keyboard.press('Escape');
    await expect(box).toBeHidden();
    await expect(hint).toBeFocused();
    await expect(hint).toHaveAttribute('aria-expanded', 'false');

    // A file dragged into the window closes it, as the page would refuse a
    // drop over it, a dialog: the drag enters the box's invisible backdrop,
    // and the page takes the drop.
    await hint.click();
    await expect(box).toBeVisible();
    await page.evaluate(() => {
      const transfer = new DataTransfer();
      transfer.items.add(new File(['x'], 'demo.jpg', { type: 'image/jpeg' }));
      document
        .querySelector('.MuiPopover-root .MuiBackdrop-root')
        .dispatchEvent(
          new DragEvent('dragenter', {
            dataTransfer: transfer,
            bubbles: true,
            cancelable: true,
          }),
        );
    });
    await expect(box).toBeHidden();
    await dropFiles(page, [photoFile]);
    await expect(
      page.getByRole('dialog', {
        name: 'Are you sure you want to select the photo below?',
        exact: true,
      }),
    ).toBeVisible();
  });
}

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

/**
 * Checks the three buttons beside the numbers of the latitude and the
 * longitude of the photo loaded: each is all in the window, beside the
 * numbers on the side where a line ends (the left, in a language written
 * from right to left), and none covers another. They are seen in the order
 * of the page, which the keyboard follows: each comes after the one before
 * it on the same line, or on a line below it. Returns their boxes.
 */
async function expectButtonsBesideNumbers(page, { rightToLeft = false } = {}) {
  const row = page.getByText('37.332558', { exact: true }).locator('xpath=..');
  const buttons = row.getByRole('button');
  await expect(buttons).toHaveCount(3);
  const numbers = await Promise.all(
    [2, 3].map((n) => row.locator('> div').nth(n).boundingBox()),
  );
  const boxes = [];
  for (const button of await buttons.all()) {
    await expect(button).toBeInViewport({ ratio: 1 });
    boxes.push(await button.boundingBox());
  }
  for (const box of boxes) {
    for (const number of numbers) {
      if (rightToLeft) {
        expect(box.x + box.width).toBeLessThanOrEqual(number.x);
      } else {
        expect(box.x).toBeGreaterThanOrEqual(number.x + number.width);
      }
    }
  }
  const overlap = (a, b) =>
    a.x < b.x + b.width &&
    b.x < a.x + a.width &&
    a.y < b.y + b.height &&
    b.y < a.y + a.height;
  boxes.forEach((a, i) =>
    boxes.slice(i + 1).forEach((b) => expect(overlap(a, b)).toBe(false)),
  );
  boxes.slice(1).forEach((b, i) => {
    const a = boxes[i];
    if (b.y < a.y + a.height && a.y < b.y + b.height) {
      if (rightToLeft) {
        expect(b.x + b.width).toBeLessThanOrEqual(a.x);
      } else {
        expect(b.x).toBeGreaterThanOrEqual(a.x + a.width);
      }
    } else {
      expect(b.y).toBeGreaterThanOrEqual(a.y + a.height);
    }
  });
  return boxes;
}

test('the buttons beside the coordinates are on one line, in the order that the keyboard follows, and the Google Earth button opens the place, which the usage data does not record', async ({
  page,
  context,
}) => {
  const sent = await collectEvents(page);
  // The new tab gets a page of the test's in place of Google Earth.
  await context.route(/^https:\/\/earth\.google\.com\//, (route) =>
    route.fulfill({ contentType: 'text/html', body: '<title>Earth</title>' }),
  );
  await page.goto('/');
  await loadPhoto(page);
  const centres = (await expectButtonsBesideNumbers(page)).map(
    (box) => box.y + box.height / 2,
  );
  expect(Math.max(...centres) - Math.min(...centres)).toBeLessThanOrEqual(1);
  // Google Maps, Google Earth and Google Street View, from one to the next
  // with Tab.
  const names = [
    'Show in Google Maps',
    'Show in Google Earth',
    'Show in Google Street View',
  ];
  await page.getByRole('button', { name: names[0], exact: true }).focus();
  for (const name of names.slice(1)) {
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name, exact: true })).toBeFocused();
  }

  const opened = page.waitForEvent('popup');
  await page
    .getByRole('button', { name: 'Show in Google Earth', exact: true })
    .click();
  const tab = await opened;
  await tab.waitForLoadState();
  // A search for the coordinates, which Google Earth marks with a pin. The
  // tab cannot reach this page.
  expect(tab.url()).toMatch(
    /^https:\/\/earth\.google\.com\/web\/search\/37\.332558\d*,-122\.005661\d*$/,
  );
  expect(await tab.evaluate(() => window.opener)).toBeNull();

  // The usage data says which button was used, and not where the photo was
  // taken.
  await expectSent(
    sent,
    (events) =>
      events
        .filter((event) => event.category === 'Opened URL')
        .map((event) => [event.action, event.label]),
    [
      [
        '[Home Page] Opened URL for Show in Google Earth',
        'https://earth.google.com/web/search/ with latitude and longitude',
      ],
    ],
  );
  expect(JSON.stringify(sent.events)).not.toMatch(/37\.33|122\.00/);
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

// The scripts that send to Vercel are Vercel's, and do nothing in a browser
// driven by a test. What the app gives them is checked instead: the calls it
// queues for them, which a script takes when it loads, and the function that
// each passes an event through before sending it.
test("Vercel's Web Analytics and Speed Insights are loaded only while usage data is sent, and send nothing once it is turned off", async ({
  page,
}) => {
  const scripts = [];
  page.on('request', (request) => {
    if (vercelScripts.test(request.url())) {
      scripts.push(new URL(request.url()).pathname);
    }
  });
  const queued = (queue, name) =>
    page.evaluate(
      ([queue, name]) =>
        window[queue]
          .filter(([queuedName]) => queuedName === name)
          .map(([, value]) => value),
      [queue, name],
    );
  const beforeSend = (queue, event) =>
    page.evaluate(
      ([queue, event]) =>
        window[queue].find(([name]) => name === 'beforeSend')[1](event),
      [queue, event],
    );

  await page.goto('/');
  await expect
    .poll(() => [...scripts].sort())
    .toEqual([
      '/_vercel/insights/script.js',
      '/_vercel/speed-insights/script.js',
    ]);
  expect(await queued('vaq', 'pageview')).toEqual([{ route: '/', path: '/' }]);
  expect(
    await page
      .locator('script[src="/_vercel/speed-insights/script.js"]')
      .getAttribute('data-route'),
  ).toBe('/');

  // The address goes without the photo's path, which Photo Location Map
  // passes in it.
  const origin = new URL(page.url()).origin;
  const withPhotoPath = `${origin}/?photoPath=%2FUsers%2Fme%2Fphoto.jpg&utm_source=test`;
  expect(
    await beforeSend('vaq', { type: 'pageview', url: withPhotoPath }),
  ).toEqual({ type: 'pageview', url: `${origin}/?utm_source=test` });
  expect(
    await beforeSend('siq', { type: 'vital', url: withPhotoPath, route: '/' }),
  ).toEqual({ type: 'vital', url: `${origin}/?utm_source=test`, route: '/' });

  // A page opened from the menu is a page view of its own.
  await navigate(page, 'Settings');
  await expect
    .poll(() => queued('vaq', 'pageview'))
    .toEqual([
      { route: '/', path: '/' },
      { route: '/settings', path: '/settings' },
    ]);

  // Turned off, the scripts already loaded are given nothing to send.
  await page
    .getByLabel('Send usage data to improve this application')
    .uncheck();
  const settingsPage = `${origin}/settings`;
  expect(
    await beforeSend('vaq', { type: 'pageview', url: settingsPage }),
  ).toBeNull();
  expect(
    await beforeSend('siq', { type: 'vital', url: settingsPage }),
  ).toBeNull();

  // Opened while it is off, the app loads neither script.
  scripts.length = 0;
  await page.reload();
  await expect(
    page.getByLabel('Send usage data to improve this application'),
  ).not.toBeChecked();
  expect(scripts).toEqual([]);
  expect(
    await page.evaluate(() => [typeof window.vaq, typeof window.siq]),
  ).toEqual(['undefined', 'undefined']);
});

// TL;DR: The page load says whether the installed app was opened.
// Details: In the installed app's window, the display-mode media feature is
// standalone (src/analytics/display-mode.ts). Neither Playwright nor the
// DevTools protocol shows a page as an installed app or emulates the
// feature, so the second load answers that one media query as the installed
// app's window does, and every other query as the browser does.
test('the page load says whether the app was opened in a tab or as the installed app', async ({
  page,
}) => {
  const sent = await collectEvents(page);
  const displayModes = (events) =>
    events
      .filter((event) => event.action === 'Page Loaded')
      .map((event) => JSON.parse(event.label).displayMode);

  await page.goto('/');
  await expectSent(sent, displayModes, ['browser']);

  await page.addInitScript(() => {
    const matchMedia = window.matchMedia.bind(window);
    window.matchMedia = (query) =>
      query.includes('display-mode')
        ? {
            matches: query === '(display-mode: standalone)',
            media: query,
            onchange: null,
            addEventListener() {},
            removeEventListener() {},
            addListener() {},
            removeListener() {},
            dispatchEvent: () => false,
          }
        : matchMedia(query);
  });
  await page.reload();
  await expectSent(sent, displayModes, ['browser', 'standalone']);
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
  // The buttons beside the coordinates do not fit on one line here.
  await expectButtonsBesideNumbers(page);
  await snapshot(page, 'narrow-loaded');
  await page.getByRole('tab', { name: 'Map', exact: true }).click();
  await expect(page.locator('.leaflet-marker-icon')).toBeVisible();
  await page.getByRole('tab', { name: 'Photo', exact: true }).click();
  await expect(page.locator('img[alt="demo.jpg"]')).toBeVisible();
  await snapshot(page, 'narrow-photo');
});

/**
 * Chooses a layout in the submenu of the menu's entry Layout, and waits until
 * the menu is gone.
 */
async function chooseLayout(page, name) {
  await page.getByRole('button', { name: 'menu', exact: true }).click();
  await page.getByRole('menuitem', { name: 'Layout', exact: true }).click();
  await page.getByRole('menuitemradio', { name, exact: true }).click();
  await expect(page.locator('#menu-appbar')).toBeHidden();
}

/** What the events say of the layout mode under an action: the labels, in order. */
function layoutModeLabels(events, action) {
  return events
    .filter(
      (event) => event.action === action && /^LayoutMode:/.test(event.label),
    )
    .map((event) => event.label);
}

/** The layouts shown, as recorded: whether the panes were split, in order. */
function shownLayouts(events) {
  return events
    .filter(
      (event) =>
        event.action === 'App Layout' && /^isWideLayout:/.test(event.label),
    )
    .map((event) => event.label);
}

// TL;DR: The menu's entry Layout opens a submenu that chooses the layout:
// automatic, as the window's width alone decided it before, always split
// panes, or always a single pane, which tabs choose what it shows.
// Details: The choice is kept in the browser, and recorded as a setting is.
// The submenu is used with the mouse and with the keyboard, which a choice
// gives back to the menu's button: the header stays when the layout under it
// changes.
test('the layout is chosen in the submenu of the menu’s entry Layout, and is kept and recorded', async ({
  page,
}) => {
  const sent = await collectEvents(page);
  const panes = page.locator('.reflex-container.vertical');
  const photoTab = page.getByRole('tab', { name: 'Photo', exact: true });
  const menuButton = page.getByRole('button', { name: 'menu', exact: true });
  const menu = page.locator('#menu-appbar');
  const entry = page.getByRole('menuitem', { name: 'Layout', exact: true });
  const submenu = page.locator('#layout-submenu');
  const item = (name) => page.getByRole('menuitemradio', { name, exact: true });

  // Automatic, which is what the app starts with: split panes in a wide
  // window.
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/');
  await expect(panes).toBeVisible();
  await expect(photoTab).toHaveCount(0);
  await expectSent(
    sent,
    (events) => layoutModeLabels(events, 'Loaded User Setting'),
    ['LayoutMode: auto'],
  );

  // By the keyboard: the entry says that it opens a menu, which the arrow
  // towards it opens with the focus on the mode chosen, and the arrow back
  // closes alone. A choice closes the menu, and the focus is back on its
  // button.
  await menuButton.focus();
  await page.keyboard.press('Enter');
  await expect(entry).toHaveAttribute('aria-haspopup', 'menu');
  await entry.focus();
  await page.keyboard.press('ArrowRight');
  await expect(item('Automatic')).toBeFocused();
  await expect(item('Automatic')).toHaveAttribute('aria-checked', 'true');
  await expect(item('Split panes')).toHaveAttribute('aria-checked', 'false');
  await expect(item('Single pane')).toHaveAttribute('aria-checked', 'false');
  // Once the submenu is open, and placed again by its entry, beside it. The
  // entry is found by what it is, as a screen reader is not to find the menu
  // under the submenu.
  await expect
    .poll(async () => {
      const [entryBox, submenuBox] = await Promise.all([
        page.locator('[aria-haspopup="menu"]').boundingBox(),
        submenu.locator('[role="menu"]').boundingBox(),
      ]);
      return Math.round(submenuBox.y - entryBox.y);
    })
    .toBe(0);
  await snapshot(page, 'layout-menu', { withMenu: true });
  await page.keyboard.press('ArrowLeft');
  await expect(submenu).toBeHidden();
  await expect(entry).toBeFocused();
  await expect(entry).toHaveAttribute('aria-expanded', 'false');
  await page.keyboard.press('Enter');
  await expect(item('Automatic')).toBeFocused();
  await page.keyboard.press('End');
  await expect(item('Single pane')).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(menu).toBeHidden();
  await expect(menuButton).toBeFocused();

  // A single pane, in the wide window, and after a reload too.
  await expect(photoTab).toBeVisible();
  await expect(panes).toHaveCount(0);
  expect(await page.evaluate(() => localStorage.getItem('LayoutMode'))).toBe(
    'singlePane',
  );
  await expectSent(
    sent,
    (events) => layoutModeLabels(events, 'Changed User Setting'),
    ['LayoutMode: singlePane'],
  );
  // The layout shown is recorded when the mode changes it, not only when the
  // window is resized.
  await expectSent(sent, (events) => shownLayouts(events).slice(0, 2), [
    'isWideLayout: True',
    'isWideLayout: False',
  ]);
  await page.reload();
  await expect(photoTab).toBeVisible();
  await expect(panes).toHaveCount(0);

  // Split panes, in a phone's width: each pane keeps its room, and the page
  // is no wider than the window. The table scrolls sideways in its pane.
  await page.setViewportSize({ width: 320, height: 800 });
  await chooseLayout(page, 'Split panes');
  await expect(panes).toBeVisible();
  await expect(photoTab).toHaveCount(0);
  await loadPhoto(page);
  const columns = panes.locator('> .reflex-element');
  for (const column of await columns.all()) {
    expect((await column.boundingBox()).width).toBeGreaterThanOrEqual(100);
  }
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    ),
  ).toBe(false);
  // Off the splitter, which the submenu's entry was over: it darkens under
  // the mouse.
  await page.mouse.move(0, 0);
  await snapshot(page, 'narrow-split-panes');

  // Escape closes the submenu alone, and leaves the mode as it is.
  await menuButton.click();
  await entry.click();
  await expect(item('Split panes')).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(submenu).toBeHidden();
  await expect(entry).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(menu).toBeHidden();
  await expect(panes).toBeVisible();

  // Automatic again: a single pane, in this window.
  await chooseLayout(page, 'Automatic');
  await expect(photoTab).toBeVisible();
  await expect(panes).toHaveCount(0);
  await expectSent(
    sent,
    (events) => layoutModeLabels(events, 'Changed User Setting'),
    ['LayoutMode: singlePane', 'LayoutMode: splitPanes', 'LayoutMode: auto'],
  );
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

  // TL;DR: Nothing is shown in English before the texts of the language
  // arrive, the title in the tab included.
  // Details: the page is served with a title for search engines, the app's
  // name, which is the same in every language (SearchHead.tsx). The texts of
  // Japanese are held back here, as a slow connection holds them, and so is
  // anything else that the page fetches after it is served.
  test('until the Japanese texts arrive, the page shows nothing, and its title is the name of the app', async ({
    page,
    request,
  }) => {
    const served = await (await request.get('/about')).text();
    let release;
    const held = new Promise((resolve) => (release = resolve));
    let asked;
    const askedForMore = new Promise((resolve) => (asked = resolve));
    await page.route('**/_next/static/chunks/**', async (route) => {
      if (!served.includes(new URL(route.request().url()).pathname)) {
        asked();
        await held;
      }
      await route.continue();
    });
    await page.goto('/about', { waitUntil: 'domcontentloaded' });
    await askedForMore;
    await expect(page).toHaveTitle('Photo Data Viewer');
    await expect(page.locator('#__next')).toBeEmpty();
    release();
    await expect(
      page.getByText('このアプリは Tomoyuki Aota が開発しています。'),
    ).toBeVisible();
    await expect(page).toHaveTitle('このアプリについて - Photo Data Viewer');
  });
});

// TL;DR: What search engines and link previews read: the head of a page, which
// SearchHead.tsx gives, robots.txt and the sitemap.
// Details: a search engine or a link preview that does not run the page reads
// the page as it is served, which is its head alone, as the app renders nothing
// until it runs in the browser (_app.tsx). Google runs the page as well, and
// reads what the page leaves. Each page has an address in each language
// (next.config.js), which search engines show in that language's results. The
// wording of the descriptions is checked by the unit tests of SearchHead.
test.describe('what search engines read', () => {
  test.describe('as a page is served, before it runs', () => {
    test.use({ javaScriptEnabled: false });

    test('each page has a title, a description and the address that search engines show', async ({
      page,
    }) => {
      for (const path of Object.values(menuPaths)) {
        const response = await page.goto(path);
        expect(response.headers()['x-robots-tag']).toBeUndefined();
        await expect(page).toHaveTitle('Photo Data Viewer');
        await expect(page.locator('meta[name="description"]')).toHaveAttribute(
          'content',
          /\S/,
        );
        const address = `https://photo-data-viewer.vercel.app${path}`;
        await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
          'href',
          address,
        );
        await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
          'content',
          address,
        );
      }
    });

    test("a page at a language's address has its title and description in that language, and lists the page's address in every language", async ({
      page,
    }) => {
      const response = await page.goto('/ja/about');
      expect(response.headers()['x-robots-tag']).toBeUndefined();
      await expect(page.locator('html')).toHaveAttribute('lang', 'ja');
      await expect(page).toHaveTitle('このアプリについて - Photo Data Viewer');
      await expect(page.locator('meta[name="description"]')).toHaveAttribute(
        'content',
        /^Photo Data Viewer は写真をサーバーに送信せず/,
      );
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        'href',
        'https://photo-data-viewer.vercel.app/ja/about',
      );
      const alternates = page.locator('link[rel="alternate"]');
      await expect(alternates).toHaveCount(43); // The 42 languages, and the address without a language.
      await expect(
        page.locator('link[rel="alternate"][hreflang="pt-BR"]'),
      ).toHaveAttribute('href', 'https://photo-data-viewer.vercel.app/pt-BR/about');
      await expect(
        page.locator('link[rel="alternate"][hreflang="x-default"]'),
      ).toHaveAttribute('href', 'https://photo-data-viewer.vercel.app/about');

      // A language written from right to left is served so.
      await page.goto('/ar');
      await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    });
  });

  test('a page that runs keeps one description and its address, with its own title, and they follow it to another page', async ({
    page,
  }) => {
    await page.goto('/');
    await expect(
      page.getByRole('button', { name: 'Select Photo' }),
    ).toBeVisible();
    await expect(page).toHaveTitle('Photo Data Viewer');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'https://photo-data-viewer.vercel.app/',
    );
    await navigate(page, 'About');
    await expect(page).toHaveTitle('About - Photo Data Viewer');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'https://photo-data-viewer.vercel.app/about',
    );
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
      'content',
      'https://photo-data-viewer.vercel.app/about',
    );
    await expect(page.locator('title')).toHaveCount(1);
    await expect(page.locator('meta[name="description"]')).toHaveCount(1);
  });

  test("a language's address shows the page in that language, whatever the browser's, and the menu keeps it", async ({
    page,
  }) => {
    await page.goto('/ja/about'); // In a browser set to English (playwright.config.mjs).
    await expect(
      page.getByText('このアプリは Tomoyuki Aota が開発しています。'),
    ).toBeVisible();
    await expect(page).toHaveTitle('このアプリについて - Photo Data Viewer');
    await page.getByRole('button', { name: 'メニュー', exact: true }).click();
    await page.getByRole('menuitem', { name: '設定', exact: true }).click();
    await page.waitForURL((url) => url.pathname === '/ja/settings');
    await expect(page.getByLabel('日付の形式', { exact: true })).toBeVisible();
    await expect(page.locator('html')).toHaveAttribute('lang', 'ja');
  });

  test("the Language page at a language's address opens the address of the language chosen, and Back returns to the first", async ({
    page,
  }) => {
    await page.goto('/ja/language');
    const list = page.getByRole('listbox');
    await expect(list).toHaveAccessibleName('言語');
    await expect(list.locator('[aria-selected="true"]')).toHaveText(['日本語']);

    await list.getByRole('option', { name: 'English', exact: true }).click();
    await page.waitForURL((url) => url.pathname === '/en/language');
    await expect(list).toHaveAccessibleName('Language');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');

    await page.goBack();
    await page.waitForURL((url) => url.pathname === '/ja/language');
    await expect(list).toHaveAccessibleName('言語');
    await expect(page.locator('html')).toHaveAttribute('lang', 'ja');

    // The browser's language opens the address without a language, whose lang
    // is the language shown, not the locale that Next.js gives it.
    await list.getByRole('option').first().click();
    await page.waitForURL((url) => url.pathname === '/language');
    await expect(list).toHaveAccessibleName('Language');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  });

  test('robots.txt lets search engines read every page, and names the sitemap, which lists the Home page and the About page in every language', async ({
    request,
  }) => {
    // Served as checked out, which is with CRLF line endings on Windows.
    const robots = (await (await request.get('/robots.txt')).text()).replace(
      /\r\n/g,
      '\n',
    );
    expect(robots).toContain('User-agent: *\nAllow: /\n');
    expect(robots).toContain(
      'Sitemap: https://photo-data-viewer.vercel.app/sitemap.xml',
    );
    const sitemap = await request.get('/sitemap.xml');
    expect(sitemap.headers()['content-type']).toContain('xml');
    const addresses = [...(await sitemap.text()).matchAll(/<loc>(.*)<\/loc>/g)].map(
      ([, address]) => address,
    );
    // Without a language, then in each of the 42, for each of the two pages.
    expect(addresses).toHaveLength(86);
    expect(addresses).toEqual(
      expect.arrayContaining([
        'https://photo-data-viewer.vercel.app/',
        'https://photo-data-viewer.vercel.app/ja',
        'https://photo-data-viewer.vercel.app/about',
        'https://photo-data-viewer.vercel.app/ja/about',
        'https://photo-data-viewer.vercel.app/zh-Hant/about',
      ]),
    );
    // Each is served.
    for (const address of ['/ja', '/zh-Hant/about']) {
      expect((await request.get(address)).status()).toBe(200);
    }
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
    const menuButton = page.locator('button[aria-label]:not([aria-haspopup])');
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
    // The buttons beside the numbers are all in the window as well.
    await expectButtonsBesideNumbers(page);
    // No name of the table is cut, and the table is no wider than the window.
    for (const name of await page.locator('tbody td:first-child').all()) {
      expect(await isCut(name)).toBe(false);
    }
    expect(await pageIsWiderThanTheWindow(page)).toBe(false);
    expect(errors).toEqual([]);
  });

  test('the menu of the layouts is whole, and the split panes stay in the window', async ({
    page,
  }) => {
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('lang', 'pl');

    // The submenu of the layouts, which the menu's entry that opens a menu
    // opens, under the entry in a phone's width, which stays in view. Each
    // mode's name, and the description under the automatic one, which takes
    // more than one line here, are whole and in the window.
    await page.locator('button[aria-label]:not([aria-haspopup])').click();
    const entry = page.locator('[aria-haspopup="menu"]');
    await entry.click();
    const submenu = page.locator('#layout-submenu [role="menu"]');
    await expect(submenu).toBeInViewport({ ratio: 1 });
    // Once it is open, and placed again by its entry.
    await expect
      .poll(async () => {
        const [entryBox, submenuBox] = await Promise.all([
          entry.boundingBox(),
          submenu.boundingBox(),
        ]);
        return Math.round(submenuBox.y - (entryBox.y + entryBox.height));
      })
      .toBe(0);
    const modes = submenu.getByRole('menuitemradio');
    await expect(modes).toHaveCount(3);
    const texts = submenu.locator('.MuiListItemText-root > *');
    await expect(texts).toHaveCount(4);
    for (const text of await texts.all()) {
      await expect(text).toBeInViewport({ ratio: 1 });
      expect(await isCut(text)).toBe(false);
    }
    expect((await texts.nth(1).boundingBox()).height).toBeGreaterThan(30);

    // Split panes, the second mode: the photo and the map in one column and
    // the data in the other, each with its room, inside the window.
    await modes.nth(1).click();
    await expect(page.locator('#menu-appbar')).toBeHidden();
    await loadPhoto(page);
    const columns = page.locator(
      '.reflex-container.vertical > .reflex-element',
    );
    await expect(columns).toHaveCount(2);
    const [left, right] = await Promise.all(
      [0, 1].map((n) => columns.nth(n).boundingBox()),
    );
    expect(left.width).toBeGreaterThanOrEqual(100);
    expect(right.width).toBeGreaterThanOrEqual(100);
    expect(left.x + left.width).toBeLessThanOrEqual(right.x);
    expect(right.x + right.width).toBeLessThanOrEqual(320);
    await expect(columns.nth(0).locator('img[alt="demo.jpg"]')).toBeVisible();
    await expect(columns.nth(0).locator('.leaflet-container')).toBeVisible();
    await expect(
      columns.nth(1).getByRole('cell', { name: 'demo.jpg', exact: true }),
    ).toBeVisible();
    expect(await pageIsWiderThanTheWindow(page)).toBe(false);
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

  test('the box about drag and drop, the veil over the page and the dialog for a dropped photo are whole', async ({
    page,
  }) => {
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('lang', 'pl');

    // The box of the button beside Select Photo, which comes after the input
    // of files, is all in the window, and its sentence is not cut.
    await page
      .locator('input[type=file]')
      .locator('xpath=following-sibling::button')
      .click();
    const hintBox = page.getByRole('dialog');
    await expect(hintBox).toBeInViewport({ ratio: 1 });
    expect(await isCut(hintBox)).toBe(false);
    expect(await pageIsWiderThanTheWindow(page)).toBe(false);
    await page.keyboard.press('Escape');
    await expect(hintBox).toBeHidden();

    // The veil's text, under its icon, is all in the window.
    const dataTransfer = await dragFiles(page, [photoFile]);
    const veilText = page.locator('[class*="DropPhoto_message"]');
    await expect(veilText).toBeInViewport({ ratio: 1 });
    expect(await isCut(veilText)).toBe(false);
    await page.locator('#__next').dispatchEvent('drop', { dataTransfer });

    // The dialog is all in the window, and its question, the file's name and
    // its buttons are one under another with a space between them, though
    // the question takes two lines here.
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeInViewport({ ratio: 1 });
    const parts = dialog.locator('> div > *');
    await expect(parts).toHaveCount(3);
    const [question, fileName, buttons] = await Promise.all(
      [0, 1, 2].map((n) => parts.nth(n).boundingBox()),
    );
    expect(question.height).toBeGreaterThan(40); // On two lines.
    expect(fileName.y - (question.y + question.height)).toBeGreaterThanOrEqual(8);
    expect(buttons.y - (fileName.y + fileName.height)).toBeGreaterThanOrEqual(8);
    expect(await isCut(dialog.locator('> div'))).toBe(false);
    // The two buttons are whole, side by side or one under the other.
    const [cancel, select] = await dialog.getByRole('button').all();
    for (const button of [cancel, select]) {
      await expect(button).toBeInViewport({ ratio: 1 });
      expect(await isCut(button)).toBe(false);
    }
    const [cancelBox, selectBox] = await Promise.all(
      [cancel, select].map((button) => button.boundingBox()),
    );
    expect(
      selectBox.x >= cancelBox.x + cancelBox.width ||
        selectBox.y >= cancelBox.y + cancelBox.height,
    ).toBe(true);
    expect(await pageIsWiderThanTheWindow(page)).toBe(false);

    await select.click();
    await expect(
      page.getByRole('cell', { name: 'demo.jpg', exact: true }),
    ).toBeVisible();
  });

  test('the Credits page and its entry in the menu are whole, and a credit continues on the next line', async ({
    page,
  }) => {
    await page.goto('/credits');
    await expect(page.locator('html')).toHaveAttribute('lang', 'pl');

    // The menu's last entry, the page's, is all in the window.
    await page.locator('button[aria-label]').first().click();
    const lastEntry = page.getByRole('menuitem').last();
    await expect(lastEntry).toBeInViewport({ ratio: 1 });
    expect(await isCut(lastEntry)).toBe(false);
    await page.keyboard.press('Escape');
    await expect(page.locator('#menu-appbar')).toBeHidden();

    // The title, the sentence and each credit are whole, in the window, and
    // the longest credit takes more than one line.
    const credits = page.getByRole('listitem');
    await expect(credits).toHaveText(creditLines);
    for (const element of [
      ...(await page.locator('[class*="Credits_page-title"]').all()),
      ...(await page.locator('[class*="Credits_intro"]').all()),
      ...(await credits.all()),
    ]) {
      await expect(element).toBeInViewport({ ratio: 1 });
      expect(await isCut(element)).toBe(false);
    }
    const longest = credits.last().locator('[dir="ltr"]');
    expect((await longest.boundingBox()).height).toBeGreaterThan(30);
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

  test('the Home page has no button about drag and drop, as no file is dragged from a file manager with a finger', async ({
    page,
  }) => {
    await page.goto('/');
    await expect(
      page.getByRole('button', { name: 'Select Photo', exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'About drag and drop', exact: true }),
    ).toHaveCount(0);
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
    // The buttons beside the numbers are on their left, where a line ends.
    await expectButtonsBesideNumbers(page, { rightToLeft: true });
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

  test('the dialog for a dropped photo is laid out from the right, with the file\'s name in its own order', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    await dropFiles(page, [photoFile]);
    const dialog = page.getByRole('dialog', {
      name: 'هل تريد بالتأكيد اختيار الصورة أدناه؟',
      exact: true,
    });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText('demo.jpg', { exact: true })).toHaveCSS(
      'direction',
      'ltr',
    );
    // Cancel, the first, is where a line starts: at the right.
    const cancel = dialog.getByRole('button', { name: 'إلغاء', exact: true });
    const select = dialog.getByRole('button', { name: 'اختيار', exact: true });
    expect((await cancel.boundingBox()).x).toBeGreaterThan(
      (await select.boundingBox()).x,
    );
    await snapshot(page, 'drop-dialog-ar');
    await select.click();
    await expect(
      page.getByRole('cell', { name: 'demo.jpg', exact: true }),
    ).toBeVisible();
  });

  test('the Credits page is laid out from the right, and its credits, in English, are read from the left', async ({
    page,
  }) => {
    await page.goto('/credits');
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    await expect(page).toHaveTitle('شكر وتقدير - Photo Data Viewer');
    const credits = page.getByRole('listitem');
    await expect(credits).toHaveText(creditLines);
    // An author's icons are where a line starts, at the right, and the credit
    // beside them keeps the order of its English words.
    for (const credit of await credits.all()) {
      const line = credit.locator('[dir="ltr"]');
      await expect(line).toHaveCSS('direction', 'ltr');
      expect((await credit.locator('img').first().boundingBox()).x).toBeGreaterThan(
        (await line.boundingBox()).x,
      );
    }
    await snapshot(page, 'credits-ar');
  });

  test('the narrow layout is laid out from the right as well', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');

    // The sentence ends before the menu's button, at its right, and the
    // submenu of the layouts is in the window.
    const menuButton = page.getByRole('button', {
      name: 'القائمة',
      exact: true,
    });
    const sentence = page.getByText('اختر صورتك لعرض بيانات EXIF.', {
      exact: true,
    });
    const [menuBox, sentenceBox] = await Promise.all(
      [menuButton, sentence].map((locator) => locator.boundingBox()),
    );
    expect(menuBox.x + menuBox.width).toBeLessThanOrEqual(sentenceBox.x);

    await loadPhoto(page);
    await expectButtonsBesideNumbers(page, { rightToLeft: true });
    await snapshot(page, 'narrow-loaded-ar');

    // After the screenshot, which would have the focus that Escape leaves on
    // a button.
    await menuButton.click();
    await page.getByRole('menuitem', { name: 'التخطيط', exact: true }).click();
    await expect(page.locator('#layout-submenu [role="menu"]')).toBeInViewport({
      ratio: 1,
    });
    await page.keyboard.press('Escape');
    await page.keyboard.press('Escape');
    await expect(page.locator('#menu-appbar')).toBeHidden();
  });
});
