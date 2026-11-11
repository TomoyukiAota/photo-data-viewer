import { LanguageSetting } from '../../i18n/languages';

/** An entry of the list on the Language page. */
export interface LanguageListItem {
  /** The value of the Language setting that the entry stands for. */
  setting: LanguageSetting;
  /** The text of the entry: a language's own name, or the choice to follow the browser. */
  label: string;
  /** The language that the label is written in, by which it is drawn and read aloud. */
  labelLanguage: string;
  /**
   * What the search finds the entry by, besides its label: a language's English
   * name, its code, and its name in the language the page is shown in.
   */
  keywords: readonly string[];
}

/**
 * What gives a language's name in another language, by its code: "ドイツ語" for
 * `de` in Japanese. The browser has the names (`Intl.DisplayNames`), so the app
 * needs no table of them. It gives an empty text where the browser has none.
 */
export function languageNamesIn(language: string): (code: string) => string {
  try {
    const names = new Intl.DisplayNames([language], { type: 'language' });
    return (code) => {
      try {
        return names.of(code) ?? '';
      } catch {
        return ''; // A code that the browser does not take for a language's.
      }
    };
  } catch {
    return () => ''; // A browser without the names, or a language it does not take.
  }
}

/**
 * A text as the search compares it: in lower case and without diacritics, so
 * that "cestina" finds "čeština". The characters that keep a value's direction
 * in a right-to-left language (U+2066 to U+2069), which are not drawn, are
 * left out as well.
 */
export function foldForSearch(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f\u2066-\u2069]/g, '');
}

/** Whether an entry is listed for what is typed in the search field: any part of its label or of its keywords. */
export function matchesSearch(item: LanguageListItem, search: string): boolean {
  const sought = foldForSearch(search.trim());
  if (!sought) return true;
  return [item.label, ...item.keywords].some((text) =>
    foldForSearch(text).includes(sought),
  );
}

/**
 * Where letters typed on the list lead: the place, among the entries listed,
 * of the next one whose text starts with them, or -1 when none does. `from` is
 * the place of the entry that has the keyboard's focus.
 *
 * TL;DR: One letter leads to the next entry that starts with it, and letters
 * typed in quick succession lead to the entry that starts with all of them.
 * Details: One letter is looked for after the entry with the focus, and from
 * the top again past the end, so that the letter typed again goes on to the
 * next language that starts with it; so is one letter typed again and again.
 * Several letters are looked for from the entry with the focus itself, which
 * keeps the focus while it still starts with them. The comparison is the
 * search's: without regard to case or diacritics.
 */
export function findByTyping(
  items: readonly LanguageListItem[],
  typed: string,
  from: number,
): number {
  const letters = [...foldForSearch(typed)];
  if (letters.length === 0) return -1;
  const isOneLetter = letters.every((letter) => letter === letters[0]);
  const sought = isOneLetter ? letters[0] : letters.join('');
  const start = isOneLetter ? from + 1 : from;
  for (let step = 0; step < items.length; step++) {
    const index = (start + step) % items.length;
    if (foldForSearch(items[index].label).startsWith(sought)) return index;
  }
  return -1;
}
