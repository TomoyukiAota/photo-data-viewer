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
  const errors = [];
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
            dateFormat: localStorage.getItem('DateFormat'),
            clockSystemFormat: localStorage.getItem('ClockSystemFormat') });
        } else if (Date.now() - start > 20000) {
          clearInterval(timer); reject(new Error('Photo did not load: ' + document.body.innerText));
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
      JSON.stringify({ error: error.message, errors }),
    );
    app.exit(1);
  }
});
