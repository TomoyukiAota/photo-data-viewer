import type { NextPage } from 'next';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import Language from '../components/language/Language';

// The title the browser shows is translated; GA4 records the English one
// (GA4_PAGE_TITLES in src/analytics/ga4-page.ts).
const LanguagePage: NextPage = () => {
  const { t } = useTranslation();
  return (
    <>
      <Head>
        <title>{t('pageTitle.language')}</title>
        <meta name='description' content='View your photo data.' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Language />
    </>
  );
};

export default LanguagePage;
