import { DateTimeFormat } from './date-time-format';

export const UserSettingKey = {
  DateFormat: 'DateFormat',
  ClockSystemFormat: 'ClockSystemFormat',
  WideLayoutPhotoDataPaneFlex: 'WideLayoutPhotoDataPaneFlex',
  WideLayoutPhotoImagePaneFlex: 'WideLayoutPhotoImagePaneFlex',
} as const;

export type UserSettingKeyType = typeof UserSettingKey[keyof typeof UserSettingKey];

export const wideLayoutPaneFlexDefaultValue = 0.5;

export const UserSettingDefaultValue = {
  DateFormat: DateTimeFormat.ForUser.DateFormat_Default,
  ClockSystemFormat: DateTimeFormat.ForUser.ClockSystemFormat_Default,
  WideLayoutPhotoDataPaneFlex: wideLayoutPaneFlexDefaultValue,
  WideLayoutPhotoImagePaneFlex: wideLayoutPaneFlexDefaultValue,
} as const;

export function readUserSettingAsNumber(key: UserSettingKeyType, defaultValue: number): number {
  return Number(localStorage.getItem(key) ?? defaultValue);
}
