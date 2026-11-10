import dayjs from 'dayjs';

import i18next, { applyLanguage, isLanguageLoaded, languageReady, loadLanguage } from './i18n';

afterEach(async () => {
  localStorage.clear();
  jest.restoreAllMocks();
  await applyLanguage('en');
});

describe('in English, which is part of the app', () => {
  it('is ready from the start, as the test browser asks for English', async () => {
    expect(isLanguageLoaded('en')).toBe(true);
    await languageReady;
    expect(i18next.language).toBe('en');
    expect(i18next.t('menu.home')).toBe('Home');
    expect(document.documentElement.lang).toBe('en');
    expect(document.documentElement.dir).toBe('ltr');
  });
});

describe('another language', () => {
  it('is fetched when it is first shown: its texts and its days of the week', async () => {
    expect(isLanguageLoaded('ja')).toBe(false);

    await applyLanguage('ja');

    expect(isLanguageLoaded('ja')).toBe(true);
    expect(i18next.language).toBe('ja');
    expect(i18next.t('menu.home')).toBe('ホーム');
    expect(dayjs('2019-11-25').format('ddd')).toBe('月');
    expect(document.documentElement.lang).toBe('ja');
    expect(document.documentElement.dir).toBe('ltr');
  });

  it('is shown at once the next time, and English again after it', async () => {
    await loadLanguage('ja');
    await applyLanguage('ja');
    await applyLanguage('en');
    expect(i18next.t('menu.home')).toBe('Home');
    expect(dayjs('2019-11-25').format('ddd')).toBe('Mon');
    expect(document.documentElement.lang).toBe('en');
  });

  it('shows the English text for a text that it does not have', () => {
    // A language of this test's own, with one text.
    i18next.addResourceBundle('xx', 'translation', { menu: { demo: 'Demo in xx' } });
    const t = i18next.getFixedT('xx');
    expect(t('menu.demo')).toBe('Demo in xx');
    expect(t('menu.home')).toBe('Home');
  });
});

// The app's code is loaded anew for each of these, as a browser loads it.
describe('when the app starts in another language', () => {
  it('is not ready until the language has arrived, and shows it then', async () => {
    localStorage.setItem('Language', 'ja');
    await jest.isolateModulesAsync(async () => {
      const i18n = await import('./i18n');
      expect(i18n.isLanguageLoaded('ja')).toBe(false);
      expect(i18n.default.language).toBe('en');

      await i18n.languageReady;

      expect(i18n.default.language).toBe('ja');
      expect(i18n.default.t('menu.home')).toBe('ホーム');
      expect(document.documentElement.lang).toBe('ja');
    });
  });

  it('is shown in English when the language cannot be fetched, and reports why', async () => {
    localStorage.setItem('Language', 'ja');
    const reported = jest.spyOn(console, 'error').mockImplementation(() => {});
    await jest.isolateModulesAsync(async () => {
      jest.doMock('../locales/ja.json', () => {
        throw new Error('Loading chunk failed');
      });
      const i18n = await import('./i18n');

      await i18n.languageReady;

      expect(i18n.default.language).toBe('en');
      expect(i18n.default.t('menu.home')).toBe('Home');
      expect(document.documentElement.lang).toBe('en');
      expect(i18n.isLanguageLoaded('ja')).toBe(false);
      expect(reported).toHaveBeenCalledWith(new Error('Loading chunk failed'));
      // The setting stays, to be tried again the next time the app is opened.
      expect(localStorage.getItem('Language')).toBe('ja');

      // Asking again tries again, and is rejected while it still cannot be fetched.
      await expect(i18n.loadLanguage('ja')).rejects.toThrow('Loading chunk failed');
      jest.dontMock('../locales/ja.json');
    });
  });
});
