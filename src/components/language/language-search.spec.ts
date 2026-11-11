import {
  findByTyping,
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
  flag: 'cz',
  keywords: ['Czech', 'cs', 'チェコ語'],
};

const brazilianPortuguese: LanguageListItem = {
  setting: 'en',
  label: 'Português (Brasil)',
  labelLanguage: 'pt-BR',
  flag: 'br',
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

  it("leaves out the characters that keep a value's direction, which are not drawn", () => {
    const start = String.fromCodePoint(0x2068);
    const end = String.fromCodePoint(0x2069);
    expect(foldForSearch(`(${start}English${end})`)).toBe('(english)');
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
      flag: 'us',
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

describe('findByTyping', () => {
  // A list as the page has it, shortened.
  const names = ['Use browser setting (English)', 'Català', 'Čeština', 'Dansk', 'Deutsch', 'English', 'Русский', '日本語'];
  const items: LanguageListItem[] = names.map((label) => ({
    setting: 'en', // Which setting it stands for, and its flag, make no difference here.
    label,
    labelLanguage: 'en',
    flag: 'us',
    keywords: [],
  }));
  const found = (typed: string, from: number) => names[findByTyping(items, typed, from)];

  it('leads to the next entry that starts with the letter, after the one with the focus', () => {
    expect(found('d', 0)).toBe('Dansk');
    expect(found('d', 3)).toBe('Deutsch');
  });

  it('starts from the top again past the end', () => {
    expect(found('d', 4)).toBe('Dansk');
    expect(found('u', 5)).toBe('Use browser setting (English)');
  });

  it('stays on the entry with the focus when it alone starts with the letter', () => {
    expect(found('e', 5)).toBe('English');
  });

  it('takes several letters together, from the entry with the focus itself', () => {
    expect(found('de', 3)).toBe('Deutsch');
    expect(found('da', 3)).toBe('Dansk');
    expect(found('deu', 4)).toBe('Deutsch');
  });

  it('goes on to the next entry for one letter typed again and again', () => {
    expect(found('dd', 3)).toBe('Deutsch');
    expect(found('ddd', 4)).toBe('Dansk');
  });

  it('compares without regard to case or diacritics, as the search does', () => {
    expect(found('C', 0)).toBe('Català');
    expect(found('c', 1)).toBe('Čeština');
    expect(found('ce', 1)).toBe('Čeština');
    expect(found('č', 0)).toBe('Català');
  });

  it('finds a name written in another script by its own letters', () => {
    expect(found('р', 0)).toBe('Русский');
    expect(found('日', 0)).toBe('日本語');
  });

  it('leads nowhere when no entry starts with what is typed, or nothing is typed', () => {
    expect(findByTyping(items, 'x', 0)).toBe(-1);
    expect(findByTyping(items, 'dx', 3)).toBe(-1);
    expect(findByTyping(items, '', 0)).toBe(-1);
    expect(findByTyping([], 'd', 0)).toBe(-1);
  });

  it('looks at the start of a name alone, not inside it', () => {
    expect(findByTyping(items, 'n', 0)).toBe(-1); // "English" and "Dansk" have an n.
  });
});
