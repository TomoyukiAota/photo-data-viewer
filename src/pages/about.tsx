import type { NextPage } from 'next';
import Head from 'next/head';
import { Fragment } from 'react';
import About from '../components/about/About';

const AboutPage: NextPage = () => {
  return (
    <Fragment>
      <Head>
        <title>Photo Data Viewer</title>
        <meta name='description' content='View your photo data.' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <About />
    </Fragment>
  );
};

export default AboutPage;
