import type { NextPage } from 'next';
import Head from 'next/head';
import { Fragment } from 'react';

const About: NextPage = () => {
  return (
    <Fragment>
      <Head>
        <title>Photo Data Viewer</title>
        <meta name='description' content='View your photo data.' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <div>About Page</div>
    </Fragment>
  );
};

export default About;
