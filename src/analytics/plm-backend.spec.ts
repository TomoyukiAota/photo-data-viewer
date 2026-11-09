import {
  createPlmBackendSink,
  IpcRendererLike,
  loadIpcRendererFromElectron,
  loadSenderFromBridge,
  PLM_ANALYTICS_BACKEND_CHANNEL,
} from './plm-backend';

function setUp({ isPlm = true, available = true } = {}) {
  const ipcRenderer = { send: jest.fn() };
  const loadIpcRenderer = jest.fn((): IpcRendererLike | null => (available ? ipcRenderer : null));
  const logger = { warn: jest.fn() };
  const sink = createPlmBackendSink({ isPlm: () => isPlm, loadIpcRenderer, logger });
  return { sink, ipcRenderer, loadIpcRenderer, logger };
}

describe('createPlmBackendSink', () => {
  it('sends on the channel of Photo Location Map, under its category for this app, with the action prefixed', () => {
    const { sink, ipcRenderer } = setUp();
    sink('Loaded Photo', 'Loaded Photo', 'Filename Extension: jpg', '1');
    // The channel is written out here rather than taken from the constant, so that
    // changing it fails this test: it has to match Photo Location Map's.
    expect(ipcRenderer.send).toHaveBeenCalledWith(
      'analytics-backend-track-event',
      'Photo Data Viewer',
      '[PDV] Loaded Photo',
      'Filename Extension: jpg',
      '1'
    );
  });

  it('leaves a missing label and value undefined, which Photo Location Map stores as null', () => {
    const { sink, ipcRenderer } = setUp();
    sink('Environment', 'App Integration Mode');
    expect(ipcRenderer.send).toHaveBeenCalledWith(
      'analytics-backend-track-event',
      'Photo Data Viewer',
      '[PDV] App Integration Mode',
      undefined,
      undefined
    );
  });

  it('sends nothing, and does not look for Electron, when standalone', () => {
    const { sink, ipcRenderer, loadIpcRenderer, logger } = setUp({ isPlm: false });
    sink('Loaded Photo', 'Loaded Photo', 'label');
    expect(loadIpcRenderer).not.toHaveBeenCalled();
    expect(ipcRenderer.send).not.toHaveBeenCalled();
    expect(logger.warn).not.toHaveBeenCalled();
  });

  it('looks for Electron once, on the first event', () => {
    const { sink, ipcRenderer, loadIpcRenderer } = setUp();
    sink('Loaded Photo', 'Loaded Photo', 'first');
    sink('Loaded Photo', 'Loaded Photo', 'second');
    expect(loadIpcRenderer).toHaveBeenCalledTimes(1);
    expect(ipcRenderer.send).toHaveBeenCalledTimes(2);
  });

  it('sends nothing, and warns once, when Electron cannot be had', () => {
    const { sink, loadIpcRenderer, logger } = setUp({ available: false });
    sink('Loaded Photo', 'Loaded Photo', 'first');
    sink('Loaded Photo', 'Loaded Photo', 'second');
    expect(loadIpcRenderer).toHaveBeenCalledTimes(1);
    expect(logger.warn).toHaveBeenCalledTimes(1);
  });
});

describe('loadIpcRendererFromElectron', () => {
  const windowWithRequire = window as unknown as { require?: (id: string) => unknown };

  afterEach(() => {
    delete windowWithRequire.require;
  });

  it('returns null in a browser, which has no require', () => {
    expect(loadIpcRendererFromElectron()).toBeNull();
  });

  it("returns Electron's ipcRenderer in Photo Location Map's window", () => {
    const ipcRenderer = { send: jest.fn() };
    windowWithRequire.require = (id) => (id === 'electron' ? { ipcRenderer } : undefined);
    expect(loadIpcRendererFromElectron()).toBe(ipcRenderer);
  });

  it('returns null when requiring Electron throws', () => {
    windowWithRequire.require = () => {
      throw new Error('Cannot find module');
    };
    expect(loadIpcRendererFromElectron()).toBeNull();
  });
});

describe('loadSenderFromBridge', () => {
  const windowWithBridge = window as unknown as { plmPhotoDataViewer?: unknown };

  afterEach(() => {
    delete windowWithBridge.plmPhotoDataViewer;
  });

  it('is none outside Photo Location Map\'s isolated window', () => {
    expect(loadSenderFromBridge(() => false)).toBeNull();
  });

  it("sends through the window's bridge, looked up at each event, as the bridge can come after the first", () => {
    const sender = loadSenderFromBridge(() => true);
    sender?.send(PLM_ANALYTICS_BACKEND_CHANNEL, 'Photo Data Viewer', '[PDV] Before the bridge', 'label');
    const trackEvent = jest.fn();
    windowWithBridge.plmPhotoDataViewer = { version: 1, trackEvent, readPhoto: jest.fn() };
    sender?.send(PLM_ANALYTICS_BACKEND_CHANNEL, 'Photo Data Viewer', '[PDV] Loaded Photo', 'label', 'value');
    expect(trackEvent).toHaveBeenCalledTimes(1);
    expect(trackEvent).toHaveBeenCalledWith('Photo Data Viewer', '[PDV] Loaded Photo', 'label', 'value');
  });
});
