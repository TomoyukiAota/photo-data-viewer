import type { NextPage } from 'next';
import Head from 'next/head';
import { Fragment } from 'react';
import Home from '../components/layout/Home';

const Index: NextPage = () => {
  return (
    <Fragment>
      <Head>
        <title>Photo Data Viewer</title>
        <meta name='description' content='View your photo data.' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Home />
    </Fragment>
  );
};

export default Index;
