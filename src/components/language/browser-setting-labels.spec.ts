/**
 * @jest-environment node
 */
import type { GetStaticPropsContext } from 'next';

import { languages } from '../../i18n/languages';
import { getStaticProps } from '../../pages/language';
import { loadBrowserSettingLabels } from './browser-setting-labels';

// Next.js calls the Language page's getStaticProps on Node.js when the app is
// built, once for each locale (next.config.js).

it("has the first entry of the Language page in each language, with that language's own name", async () => {
  const labels = await loadBrowserSettingLabels();
  expect(labels.en).toBe('Use browser setting (English)');
  expect(labels.ja).toBe('ブラウザの設定に従う（日本語）');
});

it('keeps the name together in a language written from right to left, as the app does with a value (text-values.ts)', async () => {
  const labels = await loadBrowserSettingLabels();
  expect(labels.ar).toBe('استخدام إعداد المتصفح (\u2068العربية\u2069)');
});

it('has a text for every language, with its name filled in', async () => {
  const labels = await loadBrowserSettingLabels();
  expect(Object.keys(labels)).toEqual(
    languages.map((language) => language.code),
  );
  for (const language of languages) {
    expect(labels[language.code]).toContain(language.name);
    expect(labels[language.code]).not.toMatch(/\{\{/);
  }
});

it('is given to the Language page with its head, at the address of each language and at the one without', async () => {
  const labels = await loadBrowserSettingLabels();
  for (const locale of ['ja', 'default']) {
    const { props } = await getStaticProps({
      locale,
    } as GetStaticPropsContext);
    expect(props.browserSettingLabels).toEqual(labels);
    expect(props.searchHead?.page).toBe('/language');
  }
});
