// See https://stackoverflow.com/a/64634759/7947548 for how to load leaflet in Next.js environment

import { LatLngExpression } from 'leaflet';
import { useContext } from 'react';
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// leaflet-defaulticon-compatibility is required to show the markers on the map.
// See https://github.com/ghybs/leaflet-defaulticon-compatibility
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css'; // Re-uses images from ~leaflet package
import 'leaflet-defaulticon-compatibility';

import PhotoContext from '../../store/photo-context';
import { LoadedPhotoExifData } from '../../store/loaded-photo-exif-data';

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
  const map = useMap();
  map.flyTo(props.latLng, props.zoom);
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
      center={defaultLatLng}
      zoom={defaultZoom}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />
      <UpdateMap latLng={latLng} zoom={zoom} />
      {isLatLngValid && <Marker position={latLng}></Marker>}
    </MapContainer>
  );
};

export default LeafletContent;
