import dynamic from 'next/dynamic';
import { useTranslation } from 'react-i18next';

/** Shown while the map's code is being loaded. */
const MapLoading: React.FC = () => {
  const { t } = useTranslation();
  return <p>{t('map.loading')}</p>;
};

const LeafletContent = dynamic(() => import('./LeafletContent'), {
  loading: () => <MapLoading />,
  ssr: false,
});

const LeafletLoader: React.FC<{ mapSize: [number, number] }> = (props) => {
  // Preserve the existing map remount when the containing pane changes size.
  return <LeafletContent key={props.mapSize.join(',')} />;
};

export default LeafletLoader;
