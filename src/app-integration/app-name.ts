import { AppIntegration } from './app-integration';

export const appName = {
  standalone: 'Photo Data Viewer',
  plm: 'Photo Location Map',
} as const;

export function getAppName() {
  return AppIntegration.isPlm ? appName.plm : appName.standalone;
}
