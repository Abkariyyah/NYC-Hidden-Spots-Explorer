import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Link } from 'react-router-dom';

// Fix default marker icons in Vite/React
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const NYC_CENTER = [40.7128, -74.006];

export default function MapView({ spots = [], singleSpot = null, height = '400px' }) {
  const markers = singleSpot ? [singleSpot] : spots.filter((s) => s.latitude && s.longitude);

  const center = singleSpot
    ? [singleSpot.latitude, singleSpot.longitude]
    : markers.length > 0
      ? [markers[0].latitude, markers[0].longitude]
      : NYC_CENTER;

  const zoom = singleSpot ? 15 : 12;

  return (
    <div style={{ height }} className="w-full overflow-hidden rounded-xl border border-slate-200">
      <MapContainer center={center} zoom={zoom} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.map((spot) => (
          <Marker key={spot.id} position={[spot.latitude, spot.longitude]}>
            <Popup>
              <strong>{spot.name}</strong>
              <br />
              {spot.address}
              {!singleSpot && (
                <>
                  <br />
                  <Link to={`/spots/${spot.id}`} className="text-emerald-600">
                    View details
                  </Link>
                </>
              )}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
