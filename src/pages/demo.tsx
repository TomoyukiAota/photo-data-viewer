import type { NextPage } from 'next';
import Head from 'next/head';
import Demo from '../components/demo/Demo';
import { pageTitleDefaultValue } from '../context/page-title/page-title-default-value';

const DemoPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>{pageTitleDefaultValue.demo}</title>
        <meta name='description' content='View your photo data.' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Demo />
    </>
  );
};

export default DemoPage;
