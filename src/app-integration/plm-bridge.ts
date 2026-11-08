// What Photo Location Map's window gives this app since the window is isolated, without Node.js: the photo to show
// and the analytics of that install, through window.plmPhotoDataViewer, which the window's preload gives the page.
// This is a copy of version 1 of the bridge, which is declared in
// src-shared/photo-data-viewer/photo-data-viewer-bridge.ts of https://github.com/TomoyukiAota/photo-location-map.
// An earlier Photo Location Map gave this app Node.js instead (see LoadPhotoInPlm.tsx), and still works.

/** The photo: a URL to fetch it from, which only this page may use, or its bytes. `type` is '' for an unknown one. */
export type PlmPhoto = { name: string; type: string } & (
  { url: string } | { bytes: Uint8Array }
);

export interface PlmBridge {
  readonly version: 1;
  readPhoto(): Promise<PlmPhoto>;
  trackEvent(
    category: string,
    action: string,
    label?: string,
    value?: string,
  ): void;
}

/** The parameter of the address with which Photo Location Map says that its window gives this page a bridge. */
export const PLM_BRIDGE_PARAM = 'plmBridge';
/** What the preload dispatches on window once window.plmPhotoDataViewer is there. */
export const PLM_BRIDGE_READY_EVENT = 'plm-photo-data-viewer-bridge-ready';

type WindowWithBridge = Window & { plmPhotoDataViewer?: { version?: unknown } };

/**
 * Whether this page is in an isolated window of Photo Location Map. The address says so, as the window's preload can
 * give the bridge after the page's scripts ran, which a debugger can make happen.
 */
export function isInBridgeWindow(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    (window as WindowWithBridge).plmPhotoDataViewer !== undefined ||
    new URL(window.location.href).searchParams.get(PLM_BRIDGE_PARAM) === '1'
  );
}

/** The bridge, if the window gave one of the version that this app knows. */
export function plmBridge(): PlmBridge | null {
  if (typeof window === 'undefined') return null;
  const bridge = (window as WindowWithBridge).plmPhotoDataViewer;
  return bridge?.version === 1 ? (bridge as PlmBridge) : null;
}

/**
 * The bridge, once the window's preload gave it: at once, or when the preload, run after the page's scripts, says
 * so. Rejects after `timeoutMs`, or for a version of the bridge that this app does not know.
 */
export function whenPlmBridgeReady(timeoutMs = 10000): Promise<PlmBridge> {
  return new Promise((resolve, reject) => {
    const settle = () => {
      const bridge = plmBridge();
      if (bridge) resolve(bridge);
      else
        reject(
          new Error(
            "Photo Location Map's window gave a bridge of a version that this app does not know.",
          ),
        );
    };
    if ((window as WindowWithBridge).plmPhotoDataViewer !== undefined) {
      settle();
      return;
    }
    const timer = setTimeout(() => {
      window.removeEventListener(PLM_BRIDGE_READY_EVENT, onReady);
      reject(
        new Error(
          `Photo Location Map's window gave no bridge within ${timeoutMs} ms.`,
        ),
      );
    }, timeoutMs);
    const onReady = () => {
      clearTimeout(timer);
      settle();
    };
    window.addEventListener(PLM_BRIDGE_READY_EVENT, onReady, { once: true });
  });
}

/** The photo as a File, from the bridge: fetched from its URL, or made of its bytes. */
export async function readPhotoFile(
  bridge: PlmBridge,
  fetchPhoto: typeof fetch = fetch,
  onName: (name: string) => void = () => {},
): Promise<File> {
  const photo = await bridge.readPhoto();
  onName(photo.name);
  if ('bytes' in photo) {
    return new File([photo.bytes as BlobPart], photo.name, {
      type: photo.type,
    });
  }
  // Photo Location Map gives the photo to this page only, which it tells by the request's referrer, so the referrer
  // is sent whatever the page's policy (src-main/photo-data-viewer/photo-delivery.ts of
  // https://github.com/TomoyukiAota/photo-location-map).
  const response = await fetchPhoto(photo.url, {
    mode: 'cors',
    referrerPolicy: 'origin',
  });
  if (!response.ok) {
    throw new Error(
      `Photo Location Map did not give the photo: ${response.status}.`,
    );
  }
  return new File([await response.blob()], photo.name, { type: photo.type });
}
