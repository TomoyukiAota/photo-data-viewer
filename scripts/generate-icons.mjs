// Draws the app's icon and writes it in every size the app needs:
//
// - public/icons/icon-192.png and icon-512.png: the icon of the installed app,
//   from the web app manifest (public/manifest.webmanifest).
// - public/icons/icon-maskable-192.png and icon-maskable-512.png: the same, for
//   a system that cuts the icon to its own shape.
// - public/apple-touch-icon.png: iPhone and iPad, which round its corners
//   themselves.
// - public/favicon.ico: the browser's tab and bookmarks, at 16, 32 and 48
//   pixels.
// - public/link-preview.png: the image that sites and chat apps show with the
//   title and the description of a link to any page of the app
//   (src/components/search-head/SearchHead.tsx), 1200 by 630 pixels: the
//   drawing and the app's name, in white on the icon's blue.
//
// The icon is a photo with an "i" for its information, the Material icons
// "photo" and "info" from Google's Material Icons (Apache License 2.0), which
// the app's menu has too, in white on the blue of the app's buttons and tabs.
//
// Run it from the repository's root after changing the drawing:
//
//   node scripts/generate-icons.mjs
//
// It draws in Playwright's Chromium, which the browser tests install
// (`npx playwright install chromium`), without opening a window. The app's
// name is written in Roboto, the app's font, which it loads from Google Fonts
// as the app does: it needs the network, and stops if the font does not
// arrive, rather than write the name in another font.

import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';

/** The primary color of MUI's default theme, which the app's buttons and tabs are in. */
const BLUE = '#1976d2';

// The paths of the Material icons, in their box of 24 by 24, as
// @mui/icons-material has them (Photo.js and Info.js).
const PHOTO =
  'M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2M8.5 13.5l2.5 3.01L14.5 12l4.5 6H5z';
const INFO =
  'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m1 15h-2v-6h2zm0-8h-2V7h2z';

/** The photo alone, in the middle of the box of a Material icon. */
const PHOTO_GLYPH = `<path fill="#fff" d="${PHOTO}"/>`;

/**
 * The photo and the "i" over its lower corner, in the box of a Material icon.
 * The "i" is drawn half its size, in a ring of the background's color that
 * parts it from the photo. Together they reach from 3 to 23.5, and are moved
 * by half the 2.5 that the "i" adds, so that they are in the middle.
 */
const PHOTO_INFO_GLYPH = `
  <g transform="translate(-1.25 -1.25)">
    <path fill="#fff" d="${PHOTO}"/>
    <circle cx="18.5" cy="18.5" r="6.4" fill="${BLUE}"/>
    <path fill="#fff" transform="translate(18.5 18.5) scale(0.5) translate(-12 -12)" d="${INFO}"/>
  </g>`;

/**
 * The icon as an SVG of `size` pixels.
 *
 * @param {object} layout
 * @param {number} layout.body The side of the blue square, as a part of the icon's side.
 * @param {number} layout.radius The radius of its corners, as a part of its side.
 * @param {string} layout.glyph What is drawn on it, in a box of 24 by 24.
 * @param {number} layout.glyphSize The side of that box, as a part of the square's side.
 */
function svg(size, { body, radius, glyph, glyphSize }) {
  const side = size * body;
  const offset = (size - side) / 2;
  const scale = (side * glyphSize) / 24;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect x="${offset}" y="${offset}" width="${side}" height="${side}" rx="${side * radius}" fill="${BLUE}"/>
  <g transform="translate(${size / 2} ${size / 2}) scale(${scale}) translate(-12 -12)">${glyph}</g>
</svg>`;
}

const LAYOUTS = {
  // Where the icon is shown as it is: a rounded square with the margin of a
  // macOS app icon (824 of 1024 pixels), so that it is as large as the other
  // apps' icons beside it.
  any: {
    body: 824 / 1024,
    radius: 0.225,
    glyph: PHOTO_INFO_GLYPH,
    glyphSize: 0.68,
  },
  // Where the system cuts the icon to its own shape (a circle on Android, a
  // rounded square on macOS): the square fills the icon, and the glyph stays
  // in the circle of 80% of its side that every shape keeps. Its farthest
  // point, the photo's upper corner, is 13.7 of the 24 from the middle.
  maskable: { body: 1, radius: 0, glyph: PHOTO_INFO_GLYPH, glyphSize: 0.64 },
  // iPhone and iPad round the corners themselves, and draw nothing else.
  apple: { body: 1, radius: 0, glyph: PHOTO_INFO_GLYPH, glyphSize: 0.68 },
  // A tab's icon fills its place, with the glyph as large as it can be.
  favicon: { body: 1, radius: 0.1875, glyph: PHOTO_INFO_GLYPH, glyphSize: 0.8 },
  // At 16 pixels the "i" is a blur that hides the photo too. The photo alone
  // fills the box, whose edges then fall on whole pixels and stay sharp.
  favicon16: { body: 1, radius: 0.1875, glyph: PHOTO_GLYPH, glyphSize: 1 },
};

/** An ICO file of PNG images, which every browser reads. */
function ico(images) {
  const header = Buffer.alloc(6 + 16 * images.length);
  header.writeUInt16LE(1, 2); // An icon, not a cursor.
  header.writeUInt16LE(images.length, 4);
  let offset = header.length;
  images.forEach(({ size, data }, i) => {
    const entry = 6 + 16 * i;
    header.writeUInt8(size, entry);
    header.writeUInt8(size, entry + 1);
    header.writeUInt16LE(1, entry + 4); // Color planes.
    header.writeUInt16LE(32, entry + 6); // Bits per pixel.
    header.writeUInt32LE(data.length, entry + 8);
    header.writeUInt32LE(offset, entry + 12);
    offset += data.length;
  });
  return Buffer.concat([header, ...images.map(({ data }) => data)]);
}

/** The app's name, the same in every language (src/app-integration/app-name.ts). */
const APP_NAME = 'Photo Data Viewer';

/**
 * Roboto in the weight that the image writes the name in, from Google Fonts,
 * as src/pages/_document.tsx loads it.
 */
const ROBOTO =
  'https://fonts.googleapis.com/css?family=Roboto:500&display=swap';

/**
 * The image of a link to the app, as an SVG of 1200 by 630 pixels, the size
 * that sites and chat apps show large: the drawing above the app's name,
 * together in the middle, in white on the icon's blue, which looks the same on
 * a light page and a dark one. A site that cuts it to a square keeps them. The
 * name is the only text, so the image is the same in every language.
 */
function linkPreviewSvg() {
  const [width, height] = [1200, 630];
  const glyphBox = 250; // The side of the drawing's box of 24.
  const drawn = (glyphBox * 20.5) / 24; // The drawing reaches 20.5 of its 24.
  const fontSize = 64;
  // The height of Roboto's capitals. No letter of the name goes below its line.
  const capitals = fontSize * 0.711;
  const gap = 64;
  const top = (height - (drawn + gap + capitals)) / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="${width}" height="${height}" fill="${BLUE}"/>
  <g transform="translate(${width / 2} ${top + drawn / 2}) scale(${glyphBox / 24}) translate(-12 -12)">${PHOTO_INFO_GLYPH}</g>
  <text x="${width / 2}" y="${top + drawn + gap + capitals}" text-anchor="middle" font-family="Roboto" font-weight="500" font-size="${fontSize}" fill="#fff">${APP_NAME}</text>
</svg>`;
}

const browser = await chromium.launch();
const page = await browser.newPage({ deviceScaleFactor: 1 });

/** The icon in the layout at `size` pixels, as a PNG whose corners are transparent. */
async function draw(layout, size) {
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(
    `<html><body style="margin:0">${svg(size, LAYOUTS[layout])}</body></html>`,
  );
  return page.screenshot({
    omitBackground: true,
    clip: { x: 0, y: 0, width: size, height: size },
  });
}

/** The image of a link to the app, as a PNG. */
async function drawLinkPreview() {
  await page.setViewportSize({ width: 1200, height: 630 });
  await page.setContent(
    `<html><head><link rel="stylesheet" href="${ROBOTO}"></head><body style="margin:0">${linkPreviewSvg()}</body></html>`,
  );
  // The faces of Roboto that the name needs, once loaded: none when Google
  // Fonts was not reached, and the browser would write the name in another
  // font.
  const faces = await page.evaluate(
    (name) =>
      document.fonts
        .load('500 64px Roboto', name)
        .then((loaded) => loaded.length),
    APP_NAME,
  );
  if (!faces) throw new Error(`Roboto was not loaded from ${ROBOTO}.`);
  return page.screenshot({ clip: { x: 0, y: 0, width: 1200, height: 630 } });
}

await mkdir('public/icons', { recursive: true });
for (const size of [192, 512]) {
  await writeFile(`public/icons/icon-${size}.png`, await draw('any', size));
  await writeFile(
    `public/icons/icon-maskable-${size}.png`,
    await draw('maskable', size),
  );
}
await writeFile('public/apple-touch-icon.png', await draw('apple', 180));
const favicons = [];
for (const size of [16, 32, 48]) {
  const layout = size === 16 ? 'favicon16' : 'favicon';
  favicons.push({ size, data: await draw(layout, size) });
}
await writeFile('public/favicon.ico', ico(favicons));
await writeFile('public/link-preview.png', await drawLinkPreview());

await browser.close();
