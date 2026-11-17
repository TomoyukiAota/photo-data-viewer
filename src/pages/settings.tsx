import type { NextPage } from 'next';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import UserSettings from '../components/user-settings/UserSettings';
import { searchHeadStaticProps } from '../components/search-head/search-head-props';

// The title the browser shows is translated; GA4 records the English one
// (GA4_PAGE_TITLES in src/analytics/ga4-page.ts).
const SettingsPage: NextPage = () => {
  const { t } = useTranslation();
  return (
    <>
      <Head>
        <title>{t('pageTitle.settings')}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <UserSettings />
    </>
  );
};

// What search engines read of the page, in the language of its address (SearchHead.tsx).
export const getStaticProps = searchHeadStaticProps('/settings');

export default SettingsPage;
