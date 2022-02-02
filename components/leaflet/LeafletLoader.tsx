// See https://stackoverflow.com/a/64634759/7947548 for how to load leaflet in Next.js environment

import dynamic from 'next/dynamic';
import React from 'react';

const LeafletLoader: React.FC = () => {
  const LeafletContent = React.useMemo(
    () =>
      dynamic(() => import('./LeafletContent'), {
        loading: () => <p>A map is loading</p>,
        ssr: false,
      }),
    [
      /* list variables which should trigger a re-render here */
    ]
  );
  return <LeafletContent />;
};

export default LeafletLoader;
