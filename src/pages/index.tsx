import type { NextPage } from 'next';
import Head from 'next/head';
import { useContext } from 'react';
import PageTitleContext from '../context/page-title/page-title-context';
import Home from '../components/home/Home';
import { searchHeadStaticProps } from '../components/search-head/search-head-props';

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

// What search engines read of the page, in the language of its address (SearchHead.tsx).
export const getStaticProps = searchHeadStaticProps('/');

export default Index;
