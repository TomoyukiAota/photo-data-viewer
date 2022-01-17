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

const defaultLatLng: LatLngExpression = [0, 0];
const defaultZoom = 1;

const UpdateMap: React.FC<{ latLng: LatLngExpression; zoom: number }> = (
  props
) => {
  const map = useMap();
  map.setView(props.latLng, props.zoom);
  return null;
};

const LeafletContent: React.FC = () => {
  const photoCtx = useContext(PhotoContext);
  const loadedPhotoData = photoCtx.loadedPhotoData;
  let latLng: LatLngExpression = defaultLatLng;
  let zoom = defaultZoom;

  if (loadedPhotoData) {
    latLng = [loadedPhotoData.latitude, loadedPhotoData.longitude];
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
      {loadedPhotoData && <Marker position={latLng}></Marker>}
    </MapContainer>
  );
};

export default LeafletContent;
