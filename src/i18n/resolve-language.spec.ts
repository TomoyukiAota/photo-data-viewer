import { languageCodes } from './languages';
import {
  browserLanguage,
  currentLanguage,
  matchLanguage,
  readLanguageSources,
  resolveLanguage,
} from './resolve-language';

afterEach(() => localStorage.clear());

// Languages the app has no translation for are written as tags that no language
// has (xx, yy-YY), so that adding a translation never breaks these tests.

const standalone = {
  isPlm: false,
  languageParam: null,
  languageSetting: 'auto',
  browserLanguages: ['en-US', 'en'],
};

describe('matchLanguage', () => {
  it('matches every code of the list as it is, which Photo Location Map passes', () => {
    for (const code of languageCodes) {
      expect(matchLanguage([code])).toBe(code);
    }
  });

  it('matches a tag by its language when the region is not a language of its own', () => {
    expect(matchLanguage(['ja-JP'])).toBe('ja');
    expect(matchLanguage(['en-GB'])).toBe('en');
    expect(matchLanguage(['es-419'])).toBe('es');
    expect(matchLanguage(['fr-CA'])).toBe('fr');
    expect(matchLanguage(['nb-NO'])).toBe('nb');
  });

  it('matches a tag without its last parts when the list has it so', () => {
    expect(matchLanguage(['zh-Hant-TW'])).toBe('zh-Hant');
    expect(matchLanguage(['zh-Hans-HK'])).toBe('zh-Hans');
    expect(matchLanguage(['sr-Latn-RS'])).toBe('sr-Latn');
  });

  it('takes Chinese by the script that its region writes', () => {
    expect(matchLanguage(['zh-TW'])).toBe('zh-Hant');
    expect(matchLanguage(['zh-HK'])).toBe('zh-Hant');
    expect(matchLanguage(['zh-MO'])).toBe('zh-Hant');
    expect(matchLanguage(['zh-CN'])).toBe('zh-Hans');
    expect(matchLanguage(['zh-SG'])).toBe('zh-Hans');
    expect(matchLanguage(['zh'])).toBe('zh-Hans');
  });

  it('takes Portuguese as that of Brazil, or of Portugal for any other region', () => {
    expect(matchLanguage(['pt'])).toBe('pt-BR');
    expect(matchLanguage(['pt-BR'])).toBe('pt-BR');
    expect(matchLanguage(['pt-PT'])).toBe('pt-PT');
    expect(matchLanguage(['pt-AO'])).toBe('pt-PT');
  });

  it('takes Norwegian as Bokmål, and Serbian in Latin letters', () => {
    expect(matchLanguage(['no'])).toBe('nb');
    expect(matchLanguage(['no-NO'])).toBe('nb');
    expect(matchLanguage(['nn-NO'])).toBe('nb');
    expect(matchLanguage(['sr'])).toBe('sr-Latn');
    expect(matchLanguage(['sr-RS'])).toBe('sr-Latn');
    expect(matchLanguage(['sr-Cyrl-RS'])).toBe('sr-Latn');
  });

  it('takes the first tag that has a translation, however its case is written', () => {
    expect(matchLanguage(['xx-XX', 'JA', 'en'])).toBe('ja');
    expect(matchLanguage(['en-US', 'ja'])).toBe('en');
    expect(matchLanguage(['ZH-tw'])).toBe('zh-Hant');
    expect(matchLanguage(['PT-br'])).toBe('pt-BR');
    expect(matchLanguage(['sr-latn'])).toBe('sr-Latn');
  });

  it('gives null when no tag has a translation', () => {
    expect(matchLanguage(['xx', 'yy-YY', 'zz-Zzzz'])).toBeNull();
    expect(matchLanguage([])).toBeNull();
    expect(matchLanguage([''])).toBeNull();
  });
});

describe('resolveLanguage, standalone', () => {
  it("follows the browser's languages when the setting is auto", () => {
    expect(resolveLanguage({ ...standalone, browserLanguages: ['ja-JP', 'en-US'] })).toBe('ja');
    expect(resolveLanguage(standalone)).toBe('en');
  });

  it('is English when the browser asks for languages that have no translation', () => {
    expect(resolveLanguage({ ...standalone, browserLanguages: ['xx', 'yy-YY'] })).toBe('en');
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
    expect(resolveLanguage({ ...plm, languageParam: 'zh-Hant' })).toBe('zh-Hant');
    expect(resolveLanguage({ ...plm, languageParam: 'pt-BR' })).toBe('pt-BR');
    expect(resolveLanguage({ ...plm, languageParam: 'sr-Latn' })).toBe('sr-Latn');
  });

  it("is English without a parameter it has a translation for, whatever the machine's language or a saved setting", () => {
    expect(resolveLanguage(plm)).toBe('en');
    expect(resolveLanguage({ ...plm, languageParam: 'xx' })).toBe('en');
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
