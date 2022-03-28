import type { NextPage } from 'next';
import Head from 'next/head';
import About from '../components/about/About';

const AboutPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>About - Photo Data Viewer</title>
        <meta name='description' content='View your photo data.' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <About />
    </>
  );
};

export default AboutPage;
