import {
  browserLanguage,
  currentLanguage,
  matchLanguage,
  readLanguageSources,
  resolveLanguage,
} from './resolve-language';

afterEach(() => localStorage.clear());

const standalone = {
  isPlm: false,
  languageParam: null,
  languageSetting: 'auto',
  browserLanguages: ['en-US', 'en'],
};

describe('matchLanguage', () => {
  it('matches a tag by its language when the region is not a language of its own', () => {
    expect(matchLanguage(['ja-JP'])).toBe('ja');
    expect(matchLanguage(['en-GB'])).toBe('en');
  });

  it('takes the first tag that has a translation, however its case is written', () => {
    expect(matchLanguage(['de-DE', 'JA', 'en'])).toBe('ja');
    expect(matchLanguage(['en-US', 'ja'])).toBe('en');
  });

  it('gives null when no tag has a translation', () => {
    expect(matchLanguage(['de', 'pt-BR', 'zh-Hant'])).toBeNull();
    expect(matchLanguage([])).toBeNull();
  });
});

describe('resolveLanguage, standalone', () => {
  it("follows the browser's languages when the setting is auto", () => {
    expect(resolveLanguage({ ...standalone, browserLanguages: ['ja-JP', 'en-US'] })).toBe('ja');
    expect(resolveLanguage(standalone)).toBe('en');
  });

  it('is English when the browser asks for languages that have no translation', () => {
    expect(resolveLanguage({ ...standalone, browserLanguages: ['de', 'pt-BR'] })).toBe('en');
  });

  it('follows the setting over the browser', () => {
    expect(resolveLanguage({ ...standalone, languageSetting: 'ja' })).toBe('ja');
    expect(resolveLanguage({ ...standalone, languageSetting: 'en', browserLanguages: ['ja'] })).toBe('en');
  });

  it("follows the browser when the setting is missing or names no translation", () => {
    expect(resolveLanguage({ ...standalone, languageSetting: null, browserLanguages: ['ja'] })).toBe('ja');
    expect(resolveLanguage({ ...standalone, languageSetting: 'xx', browserLanguages: ['ja'] })).toBe('ja');
  });

  it('ignores the language parameter, which is for Photo Location Map', () => {
    expect(resolveLanguage({ ...standalone, languageParam: 'ja' })).toBe('en');
  });
});

describe('resolveLanguage, in Photo Location Map', () => {
  const plm = { ...standalone, isPlm: true, browserLanguages: ['ja-JP'] };

  it('follows the language parameter, matched like a browser language', () => {
    expect(resolveLanguage({ ...plm, languageParam: 'ja' })).toBe('ja');
    expect(resolveLanguage({ ...plm, languageParam: 'ja-JP' })).toBe('ja');
  });

  it("is English without a parameter it has a translation for, whatever the machine's language or a saved setting", () => {
    expect(resolveLanguage(plm)).toBe('en');
    expect(resolveLanguage({ ...plm, languageParam: 'de' })).toBe('en');
    expect(resolveLanguage({ ...plm, languageSetting: 'ja' })).toBe('en');
  });
});

describe('in this browser', () => {
  it('reads the setting from storage and the languages from the browser', () => {
    localStorage.setItem('Language', 'ja');
    expect(readLanguageSources()).toEqual({
      isPlm: false,
      languageParam: null,
      languageSetting: 'ja',
      browserLanguages: navigator.languages,
    });
    expect(currentLanguage()).toBe('ja');
  });

  it('is in English by default, as the test browser asks for English', () => {
    expect(navigator.languages[0]).toMatch(/^en/);
    expect(readLanguageSources().languageSetting).toBeNull();
    expect(currentLanguage()).toBe('en');
    expect(browserLanguage()).toBe('en');
  });
});
