import type { GetStaticProps, InferGetStaticPropsType, NextPage } from 'next';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import { loadBrowserSettingLabels } from '../components/language/browser-setting-labels';
import Language from '../components/language/Language';
import { searchHeadOf } from '../components/search-head/search-head-props';

type LanguagePageProps = InferGetStaticPropsType<typeof getStaticProps>;

// The title the browser shows is translated; GA4 records the English one
// (GA4_PAGE_TITLES in src/analytics/ga4-page.ts).
const LanguagePage: NextPage<LanguagePageProps> = ({
  browserSettingLabels,
}) => {
  const { t } = useTranslation();
  return (
    <>
      <Head>
        <title>{t('pageTitle.language')}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Language browserSettingLabels={browserSettingLabels} />
    </>
  );
};

// What search engines read of the page, in the language of its address
// (SearchHead.tsx), and the text of the list's first entry in every language,
// of which the page shows the browser's (browser-setting-labels.ts).
export const getStaticProps = (async ({ locale }) => ({
  props: {
    searchHead: await searchHeadOf('/language', locale),
    browserSettingLabels: await loadBrowserSettingLabels(),
  },
})) satisfies GetStaticProps;

export default LanguagePage;
