// The preload of Photo Location Map's isolated window for Photo Data Viewer, as in
// electron-util/preload/photo-data-viewer.cjs of https://github.com/TomoyukiAota/photo-location-map: the bridge
// that src/app-integration/plm-bridge.ts reads, and nothing else of Node.js or Electron.
'use strict';
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('plmPhotoDataViewer', {
  version: 1,
  readPhoto: () => ipcRenderer.invoke('ipc-constants-photo-data-viewer-photo'),
  trackEvent: (category, action, label, value) => {
    ipcRenderer.send(
      'analytics-backend-track-event',
      category,
      action,
      label,
      value,
    );
  },
});
window.dispatchEvent(new Event('plm-photo-data-viewer-bridge-ready'));
