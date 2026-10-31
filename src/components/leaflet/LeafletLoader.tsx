import dynamic from 'next/dynamic';

const LeafletContent = dynamic(() => import('./LeafletContent'), {
  loading: () => <p>A map is loading</p>,
  ssr: false,
});

const LeafletLoader: React.FC<{ mapSize: [number, number] }> = (props) => {
  // Preserve the existing map remount when the containing pane changes size.
  return <LeafletContent key={props.mapSize.join(',')} />;
};

export default LeafletLoader;
