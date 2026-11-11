import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { languages } from './languages';

/**
 * The languages whose flag is not that of the country that Unicode gives them
 * as their likeliest, and why (languages.ts).
 */
const flagsOfTheirOwn: Readonly<Record<string, string>> = {
  ca: 'es-ct', // Catalonia, not Spain.
  eu: 'es-pv', // The Basque Country, not Spain.
  gl: 'es-ga', // Galicia, not Spain.
  ar: 'arab', // The Arab League, not Egypt.
};

const root = join(__dirname, '..', '..');
const flagIcons = join(root, 'node_modules', 'flag-icons');

/** The flags that the styles of the list of languages include, which the build puts among the app's files. */
function flagsInStyles(): string[] {
  const styles = readFileSync(
    join(root, 'src', 'components', 'language', 'LanguageList.module.scss'),
    'utf8',
  );
  const included = /\$flag-icons-included-countries:\s*\(([^)]*)\)/.exec(styles);
  if (!included) {
    throw new Error('LanguageList.module.scss lists no $flag-icons-included-countries');
  }
  return [...included[1].matchAll(/'([^']+)'/g)].map(([, flag]) => flag);
}

it('gives each language the flag of the country that Unicode gives it, but for the languages with flags of their own', () => {
  const flags = Object.fromEntries(languages.map(({ code, flag }) => [code, flag]));
  const expected = Object.fromEntries(
    languages.map(({ code }) => [
      code,
      flagsOfTheirOwn[code] ??
        new Intl.Locale(code).maximize().region?.toLowerCase(),
    ]),
  );
  expect(flags).toEqual(expected);
});

it('has each flag in the flag-icons package, in its rectangular shape', () => {
  const missing = languages
    .filter(({ flag }) => !existsSync(join(flagIcons, 'flags', '4x3', `${flag}.svg`)))
    .map(({ code, flag }) => `${flag}.svg of ${code}`);
  expect(missing).toEqual([]);
});

it('includes in the styles the flags of the languages, and no others, so that the app has each of them', () => {
  expect(flagsInStyles().sort()).toEqual(
    [...new Set(languages.map((language) => language.flag))].sort(),
  );
});

it("has the package's license among the app's files, as the package has it", () => {
  // The flags are the package's work, which its license asks to be passed on
  // with. The copy is a file of this repository, so this tells when a new
  // version of the package changes the text. The lines are compared however
  // they end: Git ends them as Windows does where it checks the copy out there.
  const lines = (file: string) => readFileSync(file, 'utf8').split(/\r?\n/);
  expect(
    lines(join(root, 'public', 'licenses', 'flag-icons', 'LICENSE')),
  ).toEqual(lines(join(flagIcons, 'LICENSE')));
});
