import { UserSettingKey } from '../utils/user-settings';

// Whether usage data is sent, from the setting on the Settings page. It is sent unless
// the setting is off, so a browser that never saw the setting sends. The setting is in
// this browser's storage, so it covers what this browser sends: Photo Location Map's
// window has a storage of its own, and no Settings page.
export function isUsageDataSent(): boolean {
  if (typeof window === 'undefined') {
    return false; // Nothing is sent during Next.js SSR.
  }

  try {
    return window.localStorage.getItem(UserSettingKey.SendUsageData) !== 'false';
  } catch {
    return true; // Storage that cannot be read holds no setting either.
  }
}
