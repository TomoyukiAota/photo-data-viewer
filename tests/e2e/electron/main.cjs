const { app, BrowserWindow } = require('electron');
const { writeFileSync } = require('node:fs');

app.setPath('userData', process.env.PDV_ELECTRON_PROFILE);
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
        const img = document.querySelector('img[alt]');
        if (img && img.alt === ${JSON.stringify(process.env.PDV_ELECTRON_PHOTO)} && img.naturalWidth > 0) {
          clearInterval(timer);
          resolve({ title: document.title, width: img.naturalWidth, height: img.naturalHeight,
            electron: process.versions.electron, text: document.body.innerText,
            fileInputCount: document.querySelectorAll('input[type=file]').length,
            menuVisible: document.querySelector('button[aria-label=menu]').getBoundingClientRect().width > 0,
            dateFormat: localStorage.getItem('DateFormat'),
            clockSystemFormat: localStorage.getItem('ClockSystemFormat') });
        } else if (Date.now() - start > 20000) {
          clearInterval(timer); reject(new Error('Photo did not load: ' + document.body.innerText + JSON.stringify({next: !!window.next, sameGlobal: global === window, chunks: global.webpackChunk_N_E?.length, push: String(global.webpackChunk_N_E?.push).slice(0,100)})));
        }
      }, 50);
    })`);
    writeFileSync(
      process.env.PDV_ELECTRON_RESULT,
      JSON.stringify({ ...result, errors }),
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
