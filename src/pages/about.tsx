import type { NextPage } from 'next';
import Head from 'next/head';
import About from '../components/about/About';
import { documentTitleDefaultValue } from '../context/document-title/document-title-default-value';

const AboutPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>{`About - ${documentTitleDefaultValue}`}</title>
        <meta name='description' content='View your photo data.' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <About />
    </>
  );
};

export default AboutPage;
