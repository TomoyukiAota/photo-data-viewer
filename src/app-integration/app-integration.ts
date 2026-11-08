import { isInBridgeWindow } from './plm-bridge';
import { ProcessIdentifier } from './process-identifier';

const isDuringSsrOrSsg = typeof window === 'undefined';

function isPhotoLocationMap(): boolean {
  // In Photo Location Map's isolated window, which gives a bridge (plm-bridge.ts), or, in an earlier Photo Location
  // Map, its window with Node.js: an Electron renderer process.
  return isInBridgeWindow() || ProcessIdentifier.isElectronRenderer;
}

const isPlm = isPhotoLocationMap();

export type AppIntegrationMode = 'Standalone' | 'Photo Location Map' | 'N/A (During SSR/SSG)';

export class AppIntegration {
  public static get isDuringSsrOrSsg(): boolean { return isDuringSsrOrSsg; }
  public static get isPlm(): boolean { return isDuringSsrOrSsg ? false : isPlm; }
  public static get isStandalone(): boolean { return isDuringSsrOrSsg ? false : !isPlm; }
  public static get mode(): AppIntegrationMode {
    if (isDuringSsrOrSsg) {
      return 'N/A (During SSR/SSG)';
    }
    return isPlm ? 'Photo Location Map' : 'Standalone';
  }
}
