import { UserSettingKey } from '../hooks/useUserSettings';
import { AppIntegration } from './app-integration';

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
