import type { NextPage } from 'next';
import Head from 'next/head';
import { useContext } from 'react';
import PageTitleContext from '../context/page-title/page-title-context';
import Home from '../components/home/Home';

// The description, and the other tags that search engines read, are in
// SearchHead.tsx.
const Index: NextPage = () => {
  const { indexPageTitle } = useContext(PageTitleContext);

  return (
    <>
      <Head>
        <title>{indexPageTitle}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Home />
    </>
  );
};

export default Index;
