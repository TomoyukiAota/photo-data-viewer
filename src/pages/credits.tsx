import type { NextPage } from 'next';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import Credits from '../components/credits/Credits';
import { searchHeadStaticProps } from '../components/search-head/search-head-props';

// The title the browser shows is translated; GA4 records the English one
// (GA4_PAGE_TITLES in src/analytics/ga4-page.ts).
const CreditsPage: NextPage = () => {
  const { t } = useTranslation();
  return (
    <>
      <Head>
        <title>{t('pageTitle.credits')}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Credits />
    </>
  );
};

// What search engines read of the page, in the language of its address (SearchHead.tsx).
export const getStaticProps = searchHeadStaticProps('/credits');

export default CreditsPage;
