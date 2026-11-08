const { app, BrowserWindow, ipcMain } = require('electron');
const { writeFileSync } = require('node:fs');

app.setPath('userData', process.env.PDV_ELECTRON_PROFILE);

// The events the app sends Photo Location Map's main process, on the channel it
// listens on (src/analytics/plm-backend.ts).
const trackedEvents = [];
ipcMain.on('analytics-backend-track-event', (_, category, action, label, value) =>
  trackedEvents.push({ category, action, label, value }),
);
app.whenReady().then(async () => {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    show: false,
    webPreferences: { nodeIntegration: true, contextIsolation: false },
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
            resolve({ title: document.title, width: img.naturalWidth, height: img.naturalHeight,
              electron: process.versions.electron, text: document.body.innerText,
              fileInputCount: document.querySelectorAll('input[type=file]').length,
              menuVisible: menuButton.getBoundingClientRect().width > 0,
              dateFormat: localStorage.getItem('DateFormat'),
              clockSystemFormat: localStorage.getItem('ClockSystemFormat'),
              lang: document.documentElement.lang });
          } else if (Date.now() - start > 20000) {
            clearInterval(timer); reject(new Error('Photo did not load: ' + document.body.innerText + JSON.stringify({next: !!window.next, sameGlobal: global === window, chunks: global.webpackChunk_N_E?.length, push: String(global.webpackChunk_N_E?.push).slice(0,100)})));
          }
        } catch (error) {
          clearInterval(timer); reject(error); // An error here would otherwise leave this promise pending.
        }
      }, 50);
    })`);
    if (process.env.PDV_ELECTRON_THROW) {
      // An error nothing handles, whose message has the photo's path in it.
      await win.webContents.executeJavaScript(`setTimeout(() => {
        throw new Error('Cannot open ' + new URLSearchParams(location.search).get('photoPath'));
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
