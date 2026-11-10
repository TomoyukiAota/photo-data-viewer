import { LanguageSetting } from '../../i18n/languages';

/** An entry of the list on the Language page. */
export interface LanguageListItem {
  /** The value of the Language setting that the entry stands for. */
  setting: LanguageSetting;
  /** The text of the entry: a language's own name, or the choice to follow the browser. */
  label: string;
  /** The language that the label is written in, by which it is drawn and read aloud. */
  labelLanguage: string;
  /** What the search finds the entry by, besides its label: a language's English name and its code. */
  keywords: readonly string[];
}

/** A text as the search compares it: in lower case and without diacritics, so that "cestina" finds "čeština". */
export function foldForSearch(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

/** Whether an entry is listed for what is typed in the search field: any part of its label or of its keywords. */
export function matchesSearch(item: LanguageListItem, search: string): boolean {
  const sought = foldForSearch(search.trim());
  if (!sought) return true;
  return [item.label, ...item.keywords].some((text) =>
    foldForSearch(text).includes(sought),
  );
}
