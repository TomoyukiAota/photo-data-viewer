import type { NextPage } from 'next';
import Head from 'next/head';
import UserSettings from '../components/user-settings/UserSettings';
import { pageTitleDefaultValue } from '../context/page-title/page-title-default-value';

const SettingsPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>{pageTitleDefaultValue.settings}</title>
        <meta name='description' content='View your photo data.' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <UserSettings />
    </>
  );
};

export default SettingsPage;
