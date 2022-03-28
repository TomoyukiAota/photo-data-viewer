import type { NextPage } from 'next';
import Head from 'next/head';
import { useContext } from 'react';
import DocumentTitleContext from '../context/document-title/document-title-context';
import Home from '../components/home/Home';

const Index: NextPage = () => {
  const { documentTitle } = useContext(DocumentTitleContext);

  return (
    <>
      <Head>
        <title>{documentTitle}</title>
        <meta name='description' content='View your photo data.' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Home />
    </>
  );
};

export default Index;
