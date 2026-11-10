import { UserSettingKey } from '../utils/user-settings';
import { AppIntegration } from './app-integration';

// The `language` parameter is read where the language is decided
// (src/i18n/resolve-language.ts), as the code that shows the texts loads before
// this runs.
export function loadPlmSettings() {
  if (!AppIntegration.isPlm) return;

  const searchParams = new URL(window.location.href).searchParams;
  const dateFormat = searchParams.get('dateFormat');
  const clockSystemFormat = searchParams.get('clockSystemFormat');
  if (dateFormat && clockSystemFormat) {
    localStorage.setItem(UserSettingKey.DateFormat, dateFormat);
    localStorage.setItem(UserSettingKey.ClockSystemFormat, clockSystemFormat);
  }
}
