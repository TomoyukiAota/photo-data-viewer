import { languageSettingAuto } from '../i18n/languages';
import { DateTimeFormat } from './date-time-format';

export const UserSettingKey = {
  DateFormat: 'DateFormat',
  ClockSystemFormat: 'ClockSystemFormat',
  WideLayoutPhotoDataPaneFlex: 'WideLayoutPhotoDataPaneFlex',
  WideLayoutPhotoImagePaneFlex: 'WideLayoutPhotoImagePaneFlex',
  SendUsageData: 'SendUsageData',
  /** `auto` for the browser's language, or a language code of src/i18n/languages.ts. */
  Language: 'Language',
} as const;

export type UserSettingKeyType = typeof UserSettingKey[keyof typeof UserSettingKey];

export const wideLayoutPaneFlexDefaultValue = 0.5;

export const UserSettingDefaultValue = {
  DateFormat: DateTimeFormat.ForUser.DateFormat_Default,
  ClockSystemFormat: DateTimeFormat.ForUser.ClockSystemFormat_Default,
  WideLayoutPhotoDataPaneFlex: wideLayoutPaneFlexDefaultValue,
  WideLayoutPhotoImagePaneFlex: wideLayoutPaneFlexDefaultValue,
  SendUsageData: true,
  Language: languageSettingAuto,
} as const;

export function readUserSettingAsNumber(key: UserSettingKeyType, defaultValue: number): number {
  return Number(localStorage.getItem(key) ?? defaultValue);
}
