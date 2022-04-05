import dayjs from 'dayjs';
import { DateTimeFormat } from './date-time-format';
import { UserSettingKey } from './user-settings';

function getDateTimeFormat(): DateTimeFormat.ForUser.DateFormatType {
  const savedStr = localStorage.getItem(UserSettingKey.DateFormat);
  const format = savedStr ?? DateTimeFormat.ForUser.DateFormat_Default
  return format as DateTimeFormat.ForUser.DateFormatType;
}

function getClockSystemFormat(): DateTimeFormat.ForUser.ClockSystemFormatType {
  const savedStr = localStorage.getItem(UserSettingKey.ClockSystemFormat);
  const format = savedStr ?? DateTimeFormat.ForUser.ClockSystemFormat_Default;
  return format as DateTimeFormat.ForUser.ClockSystemFormatType;
}

export function formatDate(dateTime: Parameters<typeof dayjs>[0]): string {
  const dateFormat = getDateTimeFormat();
  const clockSystemFormat = getClockSystemFormat();
  const dayjsFormatStr = DateTimeFormat.ForUser.getDayjsFormatString(dateFormat, clockSystemFormat);
  return dateTime
    ? dayjs(dateTime).format(dayjsFormatStr)
    : '';
}
