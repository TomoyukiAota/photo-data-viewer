// GA4's names for the events this app sends. GA4 drops an event whose name breaks its
// rules, without saying so: a letter first, then only letters, digits and _, up to 40
// characters. The actions this app records have spaces and brackets, so GA4 gets a name
// from this table instead, checked by ga4-event-name.spec.ts. A detail that would need
// a name per value, such as which URL was opened, goes in GA4's event parameters.
export const Ga4EventName = {
  LoadedPhoto: 'loaded_photo',
  DisplayedPhoto: 'displayed_photo',
  OpenedUnsupportedFileDialog: 'opened_unsupported_file_dialog',
  RanDemo: 'ran_demo',
  PageHidden: 'page_hidden',
  OpenedUrl: 'opened_url',
  LoadedUserSetting: 'loaded_user_setting',
  ChangedUserSetting: 'changed_user_setting',
  AppLayout: 'app_layout',
  AppIntegrationMode: 'app_integration_mode',
} as const;

export type Ga4EventNameType = typeof Ga4EventName[keyof typeof Ga4EventName];

// GA4's rule for the names of events and of their parameters.
export function isValidGa4Name(name: string): boolean {
  return /^[A-Za-z][A-Za-z0-9_]{0,39}$/.test(name);
}

// Prefixes GA4 keeps for itself. A name starting with one of them is dropped.
export const GA4_RESERVED_PREFIXES = ['google_', 'ga_', 'firebase_'];
