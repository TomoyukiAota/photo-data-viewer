import type { NextPage } from 'next';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import Language from '../components/language/Language';
import { searchHeadStaticProps } from '../components/search-head/search-head-props';

// The title the browser shows is translated; GA4 records the English one
// (GA4_PAGE_TITLES in src/analytics/ga4-page.ts).
const LanguagePage: NextPage = () => {
  const { t } = useTranslation();
  return (
    <>
      <Head>
        <title>{t('pageTitle.language')}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Language />
    </>
  );
};

// What search engines read of the page, in the language of its address (SearchHead.tsx).
export const getStaticProps = searchHeadStaticProps('/language');

export default LanguagePage;
