import {
  foldForSearch,
  LanguageListItem,
  languageNamesIn,
  matchesSearch,
} from './language-search';

// As the list has them in a page shown in Japanese.
const czech: LanguageListItem = {
  setting: 'en', // Which setting it stands for makes no difference to the search.
  label: 'Čeština',
  labelLanguage: 'cs',
  keywords: ['Czech', 'cs', 'チェコ語'],
};

const brazilianPortuguese: LanguageListItem = {
  setting: 'en',
  label: 'Português (Brasil)',
  labelLanguage: 'pt-BR',
  keywords: ['Portuguese (Brazil)', 'pt-BR', 'ポルトガル語 (ブラジル)'],
};

describe('foldForSearch', () => {
  it('compares without regard to case', () => {
    expect(foldForSearch('ENGLISH')).toBe('english');
    expect(foldForSearch('РУССКИЙ')).toBe(foldForSearch('русский'));
    expect(foldForSearch('ΕΛΛΗΝΙΚΆ')).toBe(foldForSearch('Ελληνικά'));
  });

  it('compares without regard to diacritics', () => {
    expect(foldForSearch('čeština')).toBe('cestina');
    expect(foldForSearch('Türkçe')).toBe('turkce');
    expect(foldForSearch('Tiếng Việt')).toBe('tieng viet');
    expect(foldForSearch('norsk bokmål')).toBe('norsk bokmal');
    expect(foldForSearch('Ελληνικά')).toBe('ελληνικα');
  });

  it('leaves a text without case or diacritics as it is', () => {
    expect(foldForSearch('日本語')).toBe('日本語');
    expect(foldForSearch('עברית')).toBe('עברית');
  });
});

describe('matchesSearch', () => {
  it("finds a language by any part of its own name, however it is typed", () => {
    expect(matchesSearch(czech, 'češ')).toBe(true);
    expect(matchesSearch(czech, 'ces')).toBe(true);
    expect(matchesSearch(czech, 'TINA')).toBe(true);
    expect(matchesSearch(brazilianPortuguese, 'portugues (br')).toBe(true);
  });

  it('finds a language by its English name', () => {
    expect(matchesSearch(czech, 'czech')).toBe(true);
    expect(matchesSearch(brazilianPortuguese, 'brazil')).toBe(true);
  });

  it('finds a language by its name in the language the page is shown in', () => {
    expect(matchesSearch(czech, 'チェコ')).toBe(true);
    expect(matchesSearch(brazilianPortuguese, 'ポルトガル語')).toBe(true);
    expect(matchesSearch(czech, 'ポルトガル語')).toBe(false);
  });

  it('finds a language by its code', () => {
    expect(matchesSearch(czech, 'cs')).toBe(true);
    expect(matchesSearch(brazilianPortuguese, 'PT-br')).toBe(true);
  });

  it('lists every entry while nothing is typed, or only spaces', () => {
    expect(matchesSearch(czech, '')).toBe(true);
    expect(matchesSearch(czech, '   ')).toBe(true);
  });

  it('ignores spaces around what is typed', () => {
    expect(matchesSearch(czech, '  czech ')).toBe(true);
  });

  it('leaves out an entry that has what is typed nowhere', () => {
    expect(matchesSearch(czech, 'german')).toBe(false);
    expect(matchesSearch(brazilianPortuguese, 'pt-pt')).toBe(false);
  });

  it('finds the entry that follows the browser by its text alone', () => {
    const browser: LanguageListItem = {
      setting: 'auto',
      label: 'Use browser setting (English)',
      labelLanguage: 'en',
      keywords: [],
    };
    expect(matchesSearch(browser, 'browser')).toBe(true);
    expect(matchesSearch(browser, 'eng')).toBe(true);
    expect(matchesSearch(browser, 'en-US')).toBe(false);
  });
});

describe('languageNamesIn', () => {
  it("gives a language's name in another language, which the browser knows", () => {
    expect(languageNamesIn('ja')('de')).toBe('ドイツ語');
    expect(languageNamesIn('en')('de')).toBe('German');
    expect(languageNamesIn('de')('ja')).toBe('Japanisch');
  });

  it('names the languages that the list has under a script or a region', () => {
    const inEnglish = languageNamesIn('en');
    expect(inEnglish('zh-Hant')).toContain('Chinese');
    expect(inEnglish('pt-BR')).toContain('Portuguese');
    expect(inEnglish('sr-Latn')).toContain('Serbian');
  });

  it('gives an empty text for what is no language code, or in what is no language', () => {
    expect(languageNamesIn('ja')('not a code')).toBe('');
    expect(languageNamesIn('not a language')('de')).toBe('');
  });
});
