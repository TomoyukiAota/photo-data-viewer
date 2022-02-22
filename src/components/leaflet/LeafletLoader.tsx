// See https://stackoverflow.com/a/64634759/7947548 for how to load leaflet in Next.js environment

import dynamic from 'next/dynamic';
import React from 'react';

const LeafletLoader: React.FC<{ mapSize: [number, number] }> = (props) => {
  const [mapWidth, mapHeight] = props.mapSize;

  const LeafletContent = React.useMemo(
    () =>
      dynamic(() => import('./LeafletContent'), {
        loading: () => <p>A map is loading</p>,
        ssr: false,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      /* list variables which should trigger a re-render here */
      mapWidth,
      mapHeight,
    ]
  );
  return <LeafletContent />;
};

export default LeafletLoader;
