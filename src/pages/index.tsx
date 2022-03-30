import type { NextPage } from 'next';
import Head from 'next/head';
import { useContext } from 'react';
import PageTitleContext from '../context/page-title/page-title-context';
import Home from '../components/home/Home';

const Index: NextPage = () => {
  const { indexPageTitle } = useContext(PageTitleContext);

  return (
    <>
      <Head>
        <title>{indexPageTitle}</title>
        <meta name='description' content='View your photo data.' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Home />
    </>
  );
};

export default Index;
