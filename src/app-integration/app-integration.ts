import { ProcessIdentifier } from './process-identifier';

const isDuringSsrOrSsg = typeof window === 'undefined';

function isPhotoLocationMap(): boolean {
  // Assume being used in Photo Location Map if running in Electron renderer process.
  return ProcessIdentifier.isElectronRenderer;
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
