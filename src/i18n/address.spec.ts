import {
  DEFAULT_LOCALE,
  languageOfLocale,
  languageOfPath,
  pageOfPath,
} from './address';
import { languageCodes } from './languages';

describe('languageOfPath', () => {
  it('reads the language that the first part of a path names, of every language', () => {
    for (const code of languageCodes) {
      expect(languageOfPath(`/${code}`)).toBe(code);
      expect(languageOfPath(`/${code}/about`)).toBe(code);
    }
  });

  it('reads it in any case, as Next.js does', () => {
    expect(languageOfPath('/JA/about')).toBe('ja');
    expect(languageOfPath('/pt-br')).toBe('pt-BR');
    expect(languageOfPath('/ZH-HANT/language')).toBe('zh-Hant');
  });

  it('gives null for a path that names no language, or names it later or in part', () => {
    expect(languageOfPath('/')).toBeNull();
    expect(languageOfPath('/about')).toBeNull();
    expect(languageOfPath('/default/about')).toBeNull();
    expect(languageOfPath('/about/ja')).toBeNull();
    expect(languageOfPath('/japan')).toBeNull();
    expect(languageOfPath('/pt')).toBeNull();
    expect(languageOfPath('/zh-TW')).toBeNull();
  });
});

describe('pageOfPath', () => {
  it('leaves the language out of a path', () => {
    expect(pageOfPath('/ja')).toBe('/');
    expect(pageOfPath('/ja/about')).toBe('/about');
    expect(pageOfPath('/sr-Latn/language')).toBe('/language');
    expect(pageOfPath('/PT-br/settings')).toBe('/settings');
  });

  it('leaves a path without a language as it is', () => {
    expect(pageOfPath('/')).toBe('/');
    expect(pageOfPath('/about')).toBe('/about');
    expect(pageOfPath('/japan')).toBe('/japan');
  });
});

describe('languageOfLocale', () => {
  it("gives the language of a page's locale, and null for an address without a language", () => {
    expect(languageOfLocale('ja')).toBe('ja');
    expect(languageOfLocale('zh-Hant')).toBe('zh-Hant');
    expect(languageOfLocale(DEFAULT_LOCALE)).toBeNull();
    expect(languageOfLocale(undefined)).toBeNull(); // The deployment for Photo Location Map has no locales.
  });
});
