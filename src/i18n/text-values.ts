import { getLanguage, isLanguageCode } from './languages';

/** Starts a run of text that keeps its own direction (FIRST STRONG ISOLATE). It is not drawn. */
const isolateStart = '\u2068';
/** Ends that run (POP DIRECTIONAL ISOLATE). It is not drawn. */
const isolateEnd = '\u2069';

/**
 * The values for a text's `{{placeholders}}`, as they are to be given to `t()`
 * for a text in `language`: `t('…', valuesIn(i18n.language, { width, height }))`.
 *
 * TL;DR: In a language written from right to left, each value is kept together
 * as a unit, so that it is read in its own order.
 * Details: A value is often written from left to right there: a number, a
 * file's name, the name of another language. In the middle of a text written
 * the other way, its punctuation would move: a closing parenthesis after an
 * English name to the other side of the text. The two characters around the
 * value (U+2068 and U+2069) make it a unit that keeps its own order. Photo
 * Location Map does the same, so that the two applications show such a text
 * the same way. The app's name, which i18next adds by itself, is not a value
 * given here, so a page's title, which the browser draws, is without those
 * characters.
 */
export function valuesIn<Values extends Record<string, string | number>>(
  language: string,
  values: Values,
): { [Name in keyof Values]: string | number } {
  const isRightToLeft =
    isLanguageCode(language) && getLanguage(language).direction === 'rtl';
  if (!isRightToLeft) return { ...values };
  return Object.fromEntries(
    Object.entries(values).map(([name, value]) => [
      name,
      `${isolateStart}${value}${isolateEnd}`,
    ]),
  ) as { [Name in keyof Values]: string };
}
