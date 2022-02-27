// See https://stackoverflow.com/a/64634759/7947548 for how to load leaflet in Next.js environment

import { LatLngExpression } from 'leaflet';
import { useContext } from 'react';
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// leaflet-defaulticon-compatibility is required to show the markers on the map.
// See https://github.com/ghybs/leaflet-defaulticon-compatibility
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css'; // Re-uses images from ~leaflet package
import 'leaflet-defaulticon-compatibility';

import PhotoContext from '../../store/photo/photo-context';
import { LoadedPhotoExifData } from '../../store/photo/loaded-photo-exif-data';
import { useThrottledAppLayout } from '../../hooks/useAppLayout';

const defaultLatLng: LatLngExpression = [0, 0];
const defaultZoom = 1;

function isLagLngValid(exif?: LoadedPhotoExifData | null): boolean {
  if (!exif) return false;
  if (exif.latitude === 0 && exif.longitude === 0) return true;
  return !!exif.latitude && !!exif.longitude;
}

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

  const isLatLngValid = isLagLngValid(exif);
  if (isLatLngValid) {
    latLng = [exif?.latitude as number, exif?.longitude as number];
    zoom = 12;
  }

  return (
    <MapContainer
      center={latLng}
      zoom={zoom}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />
      <UpdateMap latLng={latLng} zoom={zoom} />
      {isLatLngValid && <Marker position={latLng} />}
    </MapContainer>
  );
};

export default LeafletContent;
