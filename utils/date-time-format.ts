export namespace DateTimeFormat {
  export namespace ForLogging {
    export const basicFormat = 'YYYYMMDDTHHmmss.SSS[Z]';         // Not very human-readable format, but this can be used in path.
    export const extendedFormat = 'YYYY-MM-DDTHH:mm:ss.SSS[Z]';  // Human-readable format
  }

  export namespace ForUser {
    export const DateFormat_ISO8601Like = 'YYYY-MM-DD';
    export const DateFormat_YYYYMMDD = 'YYYY/MM/DD';
    export const DateFormat_DDMMYYYY = 'DD/MM/YYYY';
    export const DateFormat_MMDDYYYY = 'MM/DD/YYYY';
    export const DateFormat_Default = ForUser.DateFormat_ISO8601Like;

    export const ClockSystemFormat_12h = '12-hour';
    export const ClockSystemFormat_24h = '24-hour';
    export const ClockSystemFormat_Default = ForUser.ClockSystemFormat_24h;

    export const DateFormat_List = [
      ForUser.DateFormat_ISO8601Like,
      ForUser.DateFormat_YYYYMMDD,
      ForUser.DateFormat_DDMMYYYY,
      ForUser.DateFormat_MMDDYYYY,
    ] as const;

    export const ClockSystemFormat_List = [
      ForUser.ClockSystemFormat_12h,
      ForUser.ClockSystemFormat_24h
    ] as const;

    export type DateFormatType = typeof DateFormat_List[number];
    export type ClockSystemFormatType = typeof ClockSystemFormat_List[number];

    export const getDayjsFormatString = (dateFormat: DateFormatType, clockSystemFormat: ClockSystemFormatType): string => {
      const dateFormatMap = new Map<DateFormatType, string>();
      dateFormatMap.set(ForUser.DateFormat_ISO8601Like, 'YYYY-MM-DD ddd');
      dateFormatMap.set(ForUser.DateFormat_YYYYMMDD, 'YYYY/MM/DD ddd');
      dateFormatMap.set(ForUser.DateFormat_DDMMYYYY, 'DD/MM/YYYY ddd');
      dateFormatMap.set(ForUser.DateFormat_MMDDYYYY, 'MM/DD/YYYY ddd');
      const dayjsDateFormat = dateFormatMap.get(dateFormat);
      const dayjsFormat = clockSystemFormat === ForUser.ClockSystemFormat_24h
        ? `${dayjsDateFormat} HH:mm:ss`
        : `${dayjsDateFormat} hh:mm:ss a`;
      return dayjsFormat;
    };
  }
}
