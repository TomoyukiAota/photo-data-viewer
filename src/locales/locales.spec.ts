import { readdirSync, readFileSync } from 'node:fs';
import { basename, join } from 'node:path';

import { languages } from '../i18n/languages';
import en from './en.json';

// What a translation pull request is checked against (docs/TRANSLATING.md).
// Every file in this directory is read, so that one missing from languages.ts
// is found too.
const files = readdirSync(__dirname)
  .filter((file) => file.endsWith('.json'))
  .sort();

type Texts = Record<string, string>;

/** The texts of a file, each under its full key, such as `settings.dateTime.title`. */
function flatten(value: unknown, prefix = ''): Texts {
  if (typeof value === 'string') return { [prefix]: value };
  if (value === null || typeof value !== 'object') {
    throw new Error(`${prefix} is neither a text nor an object of texts`);
  }
  return Object.assign(
    {},
    ...Object.entries(value).map(([key, child]) =>
      flatten(child, prefix ? `${prefix}.${key}` : key),
    ),
  );
}

/** The `{{placeholders}}` of a text, sorted. */
function placeholders(text: string): string {
  return (text.match(/\{\{[^}]*\}\}/g) ?? [])
    .map((placeholder) => placeholder.replace(/\s/g, ''))
    .sort()
    .join(' ');
}

/** The `<tags>` of a text, sorted, except `<br/>`, which a translation may drop or move. */
function tags(text: string): string {
  return (text.match(/<\/?[a-zA-Z][^>]*>/g) ?? [])
    .map((tag) => tag.replace(/\s/g, ''))
    .filter((tag) => tag !== '<br/>')
    .sort()
    .join(' ');
}

const english = flatten(en);

it('lists every language in src/i18n/languages.ts once, with a file for each', () => {
  const codes = languages.map((language) => language.code);
  expect(new Set(codes).size).toBe(codes.length);
  for (const code of codes) expect(files).toContain(`${code}.json`);
});

describe.each(files)('%s', (file) => {
  const code = basename(file, '.json');
  const texts = flatten(JSON.parse(readFileSync(join(__dirname, file), 'utf8')));
  const missing = Object.keys(english).filter((key) => !(key in texts));
  if (missing.length) {
    console.info(
      `${file}: ${missing.length} text(s) not translated yet are shown in English: ${missing.join(', ')}`,
    );
  }

  it('is listed in src/i18n/languages.ts', () => {
    expect(languages.map((language) => language.code)).toContain(code);
  });

  it('has only keys that en.json has', () => {
    const unknown = Object.keys(texts).filter((key) => !(key in english));
    expect(unknown).toEqual([]);
  });

  it('has no empty text: a text not translated yet is left out, and shown in English', () => {
    const empty = Object.keys(texts).filter((key) => texts[key].trim() === '');
    expect(empty).toEqual([]);
  });

  it('keeps the {{placeholders}} of each English text', () => {
    const different = Object.keys(texts).filter(
      (key) => key in english && placeholders(texts[key]) !== placeholders(english[key]),
    );
    expect(different).toEqual([]);
  });

  it('keeps the <tags> of each English text', () => {
    const different = Object.keys(texts).filter(
      (key) => key in english && tags(texts[key]) !== tags(english[key]),
    );
    expect(different).toEqual([]);
  });
});
