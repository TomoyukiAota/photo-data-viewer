import { DateTimeFormat } from './date-time-format';

export const UserSettingKey = {
  DateFormat: 'DateFormat',
  ClockSystemFormat: 'ClockSystemFormat',
  WideLayoutPhotoDataPaneFlex: 'WideLayoutPhotoDataPaneFlex',
  WideLayoutPhotoImagePaneFlex: 'WideLayoutPhotoImagePaneFlex',
} as const;

export type UserSettingKeyType = typeof UserSettingKey[keyof typeof UserSettingKey];

export const UserSettingDefaultValue = {
  DateFormat: DateTimeFormat.ForUser.DateFormat_Default,
  ClockSystemFormat: DateTimeFormat.ForUser.ClockSystemFormat_Default,
  WideLayoutPhotoDataPaneFlex: 0.5,
  WideLayoutPhotoImagePaneFlex: 0.5,
} as const;
