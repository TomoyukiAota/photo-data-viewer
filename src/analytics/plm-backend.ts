import { AppIntegration } from '../app-integration/app-integration';

// Sends this app's events to Photo Location Map's analytics backend when this app
// runs in Photo Location Map's window. They go through Photo Location Map's main
// process, which adds the user ID of that install and the session ID of that
// launch, so they are recorded as part of that install's use, in order with the
// rest of the launch.

// The channel Photo Location Map's main process receives these events on, declared
// in src-shared/analytics/ipc/analytics-backend-ipc.ts of
// https://github.com/TomoyukiAota/photo-location-map. It has listened on it since
// 1.12.1. An event sent to an earlier version is dropped, without an error.
export const PLM_ANALYTICS_BACKEND_CHANNEL = 'analytics-backend-track-event';

// Photo Location Map already records this app's window under this category, with
// actions prefixed with "[PDV]" (src-main/photo-data-viewer/photo-data-viewer-tracker.ts
// there), so this app's own events join them. The category this app uses itself
// is dropped: in most calls it repeats the action.
export const PLM_CATEGORY = 'Photo Data Viewer';
export const PLM_ACTION_PREFIX = '[PDV] ';

export interface IpcRendererLike {
  send(channel: string, ...args: unknown[]): void;
}

export interface PlmBackendSinkOptions {
  isPlm: () => boolean;
  /** Electron's ipcRenderer, or null when it cannot be had. Called once, on the first event sent. */
  loadIpcRenderer: () => IpcRendererLike | null;
  logger: { warn: (message: string) => void };
}

// The options are passed in so that this can be unit-tested.
export function createPlmBackendSink(options: PlmBackendSinkOptions) {
  let ipcRenderer: IpcRendererLike | null | undefined; // undefined until the first event is sent.

  return (category: string, action: string, label?: string, value?: string): void => {
    if (!options.isPlm()) return;

    if (ipcRenderer === undefined) {
      ipcRenderer = options.loadIpcRenderer();
      if (!ipcRenderer) {
        options.logger.warn('[Analytics] Electron\'s ipcRenderer is not available, so events are not sent to Photo Location Map.');
      }
    }
    if (!ipcRenderer) return;

    ipcRenderer.send(PLM_ANALYTICS_BACKEND_CHANNEL, PLM_CATEGORY, `${PLM_ACTION_PREFIX}${action}`, label, value);
  };
}

// Uses Electron's own require, which Photo Location Map's window has because it
// enables nodeIntegration. Not the bundler's: electron is not a dependency of this
// app, so a require the bundler could see would fail the standalone build.
export function loadIpcRendererFromElectron(): IpcRendererLike | null {
  if (typeof window === 'undefined') return null;

  const electronRequire = (window as unknown as { require?: (id: string) => any }).require;
  try {
    return electronRequire?.('electron')?.ipcRenderer ?? null;
  } catch {
    return null;
  }
}

export const sendToPlmBackend = createPlmBackendSink({
  isPlm: () => AppIntegration.isPlm,
  loadIpcRenderer: loadIpcRendererFromElectron,
  logger: console,
});
