import type { NextPage } from 'next';
import Head from 'next/head';
import { Fragment } from 'react';
import Settings from '../components/settings/Settings';

const SettingsPage: NextPage = () => {
  return (
    <Fragment>
      <Head>
        <title>Photo Data Viewer</title>
        <meta name='description' content='View your photo data.' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Settings />
    </Fragment>
  );
};

export default SettingsPage;
