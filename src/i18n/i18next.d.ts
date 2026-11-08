import en from '../locales/en.json';

// Makes `t('…')` and `<Trans i18nKey='…'>` accept only the keys of en.json, and
// require the `{{placeholders}}` of a text, so that `npm run typecheck` catches a
// misspelled key or a forgotten value. `appName` is filled in by default (i18n.ts).
declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation';
    resources: { translation: typeof en };
    defaultVariables: { appName: string };
  }
}
