const { app, BrowserWindow, ipcMain, protocol } = require('electron');
const { randomBytes } = require('node:crypto');
const { readFileSync, writeFileSync } = require('node:fs');
const { basename, join } = require('node:path');

app.setPath('userData', process.env.PDV_ELECTRON_PROFILE);

// PDV_ELECTRON_HOST=isolated opens the app as Photo Location Map does since its
// window is isolated: no Node.js, a sandbox and context isolation, with the bridge
// of isolated-preload.cjs, which gives the photo at PDV_ELECTRON_PHOTO_PATH as a
// URL of the plm-photo scheme, or as its bytes with PDV_ELECTRON_TRANSPORT=ipc.
const isolated = process.env.PDV_ELECTRON_HOST === 'isolated';
if (isolated) {
  protocol.registerSchemesAsPrivileged([
    { scheme: 'plm-photo', privileges: { standard: true, secure: true, supportFetchAPI: true, corsEnabled: true, stream: true } },
  ]);
}

/**
 * Serves the photo at PDV_ELECTRON_PHOTO_PATH as Photo Location Map's isolated
 * window does: through the bridge's IPC channel, as a plm-photo: URL or as its
 * bytes, and at that URL for the app's page alone.
 */
function servePhotoThroughTheBridge() {
  const photoPath = process.env.PDV_ELECTRON_PHOTO_PATH;
  const name = basename(photoPath);
  const type = name.toLowerCase().endsWith('.heic') ? 'image/heic' : 'image/jpeg';
  const token = randomBytes(32).toString('hex');
  const origin = new URL(process.env.PDV_ELECTRON_URL).origin;
  /**
   * Whether `request` comes from the app's page, as Photo Location Map checks it:
   * Chromium gives the handler no Origin header, so the request must be a CORS
   * one, from a page of the app's origin by its referrer.
   */
  const fromTheApp = (request) => {
    try {
      return request.mode === 'cors' && new URL(request.referrer).origin === origin;
    } catch {
      return false;
    }
  };
  protocol.handle('plm-photo', (request) => {
    if (new URL(request.url).pathname.slice(1) !== token || !fromTheApp(request)) {
      return new Response(null, { status: 404 });
    }
    return new Response(readFileSync(photoPath), {
      headers: { 'content-type': type, 'access-control-allow-origin': origin },
    });
  });
  ipcMain.handle('ipc-constants-photo-data-viewer-photo', () =>
    process.env.PDV_ELECTRON_TRANSPORT === 'ipc'
      ? { name, type, bytes: readFileSync(photoPath) }
      : { name, type, url: `plm-photo://photo/${token}` },
  );
}

// The events the app sends Photo Location Map's main process, on the channel it
// listens on (src/analytics/plm-backend.ts).
const trackedEvents = [];
ipcMain.on('analytics-backend-track-event', (_, category, action, label, value) =>
  trackedEvents.push({ category, action, label, value }),
);
app.whenReady().then(async () => {
  if (isolated) servePhotoThroughTheBridge();
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    show: false,
    webPreferences: isolated
      ? { contextIsolation: true, nodeIntegration: false, sandbox: true, preload: join(__dirname, 'isolated-preload.cjs') }
      : { nodeIntegration: true, contextIsolation: false },
  });
  win.webContents.session.webRequest.onBeforeRequest(
    {
      urls: [
        '*://*.google-analytics.com/*',
        '*://www.googletagmanager.com/*',
        '*://*.analytics.photo-data-viewer.tomoyukiaota.com/*',
      ],
    },
    (_, callback) => callback({ cancel: true }),
  );
  const errors = [];
  const diagnostics = [];
  win.webContents.on('console-message', (_, level, message) =>
    diagnostics.push({ level, message }),
  );
  win.webContents.session.webRequest.onErrorOccurred((details) =>
    diagnostics.push({
      requestError: details.error,
      resource: details.resourceType,
    }),
  );
  win.webContents.on('console-message', (_, level, message) => {
    if (level >= 3) errors.push(message);
  });
  win.webContents.on('render-process-gone', (_, details) =>
    errors.push(details.reason),
  );
  try {
    await win.loadURL(process.env.PDV_ELECTRON_URL);
    const result = await win.webContents
      .executeJavaScript(`new Promise((resolve, reject) => {
      const start = Date.now();
      const timer = setInterval(() => {
        try {
          const img = document.querySelector('img[alt]');
          if (img && img.alt === ${JSON.stringify(process.env.PDV_ELECTRON_PHOTO)} && img.naturalWidth > 0) {
            clearInterval(timer);
            // The menu button is the only button with an aria-label; the label itself is translated.
            const menuButton = document.querySelector('button[aria-label]');
            if (!menuButton) throw new Error('The menu button was not found');
            resolve({ title: document.title, width: img.naturalWidth, height: img.naturalHeight,
              electron: typeof process === 'undefined' ? null : process.versions.electron,
              nodeInPage: typeof require !== 'undefined' || typeof process !== 'undefined', text: document.body.innerText,
              fileInputCount: document.querySelectorAll('input[type=file]').length,
              menuVisible: menuButton.getBoundingClientRect().width > 0,
              dateFormat: localStorage.getItem('DateFormat'),
              clockSystemFormat: localStorage.getItem('ClockSystemFormat'),
              lang: document.documentElement.lang });
          } else if (Date.now() - start > 20000) {
            clearInterval(timer); reject(new Error('Photo did not load: ' + document.body.innerText + JSON.stringify({next: !!window.next, sameGlobal: typeof global !== 'undefined' && global === window, chunks: globalThis.webpackChunk_N_E?.length, push: String(globalThis.webpackChunk_N_E?.push).slice(0,100)})));
          }
        } catch (error) {
          clearInterval(timer); reject(error); // An error here would otherwise leave this promise pending.
        }
      }, 50);
    })`);
    if (process.env.PDV_ELECTRON_THROW) {
      // An error nothing handles, whose message has the photo's path in it.
      await win.webContents.executeJavaScript(`setTimeout(() => {
        throw new Error('Cannot open ' + (new URLSearchParams(location.search).get('photoPath') ?? ${JSON.stringify(process.env.PDV_ELECTRON_PHOTO)}));
      }); true`);
      const start = Date.now();
      while (
        !trackedEvents.some((event) => event.action === '[PDV] Unhandled Error') &&
        Date.now() - start < 10000
      ) {
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
    }
    writeFileSync(
      process.env.PDV_ELECTRON_RESULT,
      JSON.stringify({ ...result, errors, trackedEvents }),
    );
    app.exit(0);
  } catch (error) {
    writeFileSync(
      process.env.PDV_ELECTRON_RESULT,
      JSON.stringify({ error: error.message, errors, diagnostics }),
    );
    app.exit(1);
  }
});
