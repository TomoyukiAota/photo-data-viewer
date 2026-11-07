// See https://stackoverflow.com/a/64634759/7947548 for how to load leaflet in Next.js environment

import { LatLngExpression } from 'leaflet';
import { useContext } from 'react';
import {
  AttributionControl,
  MapContainer,
  Marker,
  TileLayer,
  useMap,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// leaflet-defaulticon-compatibility is required to show the markers on the map.
// See https://github.com/ghybs/leaflet-defaulticon-compatibility
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css'; // Re-uses images from ~leaflet package
import 'leaflet-defaulticon-compatibility';

import PhotoContext from '../../context/photo/photo-context';
import { useThrottledAppLayout } from '../../hooks/useAppLayout';

const defaultLatLng: LatLngExpression = [0, 0];
const defaultZoom = 1;

const UpdateMap: React.FC<{ latLng: LatLngExpression; zoom: number }> = (
  props
) => {
  const appLayout = useThrottledAppLayout();
  const map = useMap();
  if (appLayout.isWideLayout) {
    map.flyTo(props.latLng, props.zoom);
  } else {
    map.setView(props.latLng, props.zoom); // For the narrow layout, flyTo effect bothers when showing the Map tab.
  }
  return null;
};

const LeafletContent: React.FC = () => {
  const photoCtx = useContext(PhotoContext);
  const exif = photoCtx.loadedPhotoData?.exif;

  let latLng: LatLngExpression = defaultLatLng;
  let zoom = defaultZoom;

  // The same check as the rest of the page, which says when the location is not
  // available: only numbers within range, as Leaflet throws on anything else.
  const isLatLngValid = !!exif?.isLatLngAvailable;
  if (isLatLngValid) {
    latLng = [exif?.latitude as number, exif?.longitude as number];
    zoom = 12;
  }

  return (
    <MapContainer
      center={latLng}
      zoom={zoom}
      style={{ height: '100%', width: '100%' }}
      attributionControl={false}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />
      <AttributionControl prefix='Leaflet' />
      <UpdateMap latLng={latLng} zoom={zoom} />
      {isLatLngValid && <Marker position={latLng} />}
    </MapContainer>
  );
};

export default LeafletContent;
