import { languageSettingAuto } from '../i18n/languages';
import { DateTimeFormat } from './date-time-format';

export const UserSettingKey = {
  DateFormat: 'DateFormat',
  ClockSystemFormat: 'ClockSystemFormat',
  /** How the Home page lays out its panes (LayoutMode); chosen with the button before the menu's. */
  LayoutMode: 'LayoutMode',
  /** The sizes of the split panes, the layout that the code calls wide. */
  WideLayoutPhotoDataPaneFlex: 'WideLayoutPhotoDataPaneFlex',
  WideLayoutPhotoImagePaneFlex: 'WideLayoutPhotoImagePaneFlex',
  SendUsageData: 'SendUsageData',
  /** `auto` for the browser's language, or a language code of src/i18n/languages.ts; chosen on the Language page. */
  Language: 'Language',
} as const;

export type UserSettingKeyType = typeof UserSettingKey[keyof typeof UserSettingKey];

/**
 * How the Home page lays out the photo, the map and the data: `splitPanes`,
 * the photo and the map in one column and the data in another
 * (HomeWideLayout); `singlePane`, one of the three at a time, chosen with tabs
 * (HomeNarrowLayout); or `auto`, split panes in a window wider than 1200
 * pixels and a single pane otherwise, as the window's width alone decided
 * before the user could choose.
 */
export const LayoutMode = {
  Auto: 'auto',
  SplitPanes: 'splitPanes',
  SinglePane: 'singlePane',
} as const;

export type LayoutModeType = typeof LayoutMode[keyof typeof LayoutMode];

/** The modes, in the order that the menu lists them. */
export const layoutModes: readonly LayoutModeType[] = [
  LayoutMode.Auto,
  LayoutMode.SplitPanes,
  LayoutMode.SinglePane,
];

export function isLayoutMode(value: unknown): value is LayoutModeType {
  return layoutModes.includes(value as LayoutModeType);
}

export const wideLayoutPaneFlexDefaultValue = 0.5;

export const UserSettingDefaultValue = {
  DateFormat: DateTimeFormat.ForUser.DateFormat_Default,
  ClockSystemFormat: DateTimeFormat.ForUser.ClockSystemFormat_Default,
  LayoutMode: LayoutMode.Auto as LayoutModeType,
  WideLayoutPhotoDataPaneFlex: wideLayoutPaneFlexDefaultValue,
  WideLayoutPhotoImagePaneFlex: wideLayoutPaneFlexDefaultValue,
  SendUsageData: true,
  Language: languageSettingAuto,
} as const;

export function readUserSettingAsNumber(key: UserSettingKeyType, defaultValue: number): number {
  return Number(localStorage.getItem(key) ?? defaultValue);
}
