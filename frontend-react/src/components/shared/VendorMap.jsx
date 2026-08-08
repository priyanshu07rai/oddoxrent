import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Navigation, Store, ExternalLink } from 'lucide-react';

// Fix leaflet default icon assets path
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Vendor Shop Red Pin Icon
const vendorIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Custom Customer Blue Pin Icon
const customerIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Map recentering view helper
function RecenterMap({ lat, lon }) {
  const map = useMap();
  useEffect(() => {
    if (lat && lon) {
      map.setView([lat, lon], 14);
    }
  }, [lat, lon, map]);
  return null;
}

const VendorMap = ({ 
  vendorLat = 28.6145, 
  vendorLon = 77.2095, 
  shopName = 'Central Store Pickup Hub', 
  areaName = 'Connaught Place Hub', 
  address = 'Block A, Inner Circle, Connaught Place, New Delhi 110001',
  customerLat = null,
  customerLon = null,
  distanceKm = null
}) => {
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${vendorLat},${vendorLon}`;

  return (
    <div className="w-full rounded-3xl overflow-hidden border-2 border-border-strong bg-bg-elevated shadow-md">
      
      {/* Map Header Card */}
      <div className="p-4 bg-bg-subtle border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-danger/10 text-danger border border-danger/20">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-extrabold text-text text-sm flex items-center gap-1.5">
              {shopName} <span className="text-xs font-bold text-accent">({areaName})</span>
            </h4>
            <p className="text-xs text-text-muted">{address}</p>
          </div>
        </div>

        {distanceKm && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-extrabold bg-accent/10 text-accent border border-accent/20 shrink-0">
            <Navigation className="w-3.5 h-3.5" /> {distanceKm} km from you (Store Pickup)
          </div>
        )}
      </div>

      {/* Leaflet Map Canvas */}
      <div className="h-[280px] w-full relative z-0">
        <MapContainer 
          center={[vendorLat, vendorLon]} 
          zoom={14} 
          scrollWheelZoom={false} 
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Vendor Marker */}
          <Marker position={[vendorLat, vendorLon]} icon={vendorIcon}>
            <Popup>
              <div className="p-1">
                <p className="font-black text-sm text-slate-900 mb-1">{shopName}</p>
                <p className="text-xs text-slate-600 mb-2">{address}</p>
                <a 
                  href={googleMapsUrl} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:underline"
                >
                  Get Directions <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </Popup>
          </Marker>

          {/* Customer Location Marker if available */}
          {customerLat && customerLon && (
            <Marker position={[customerLat, customerLon]} icon={customerIcon}>
              <Popup>
                <div className="p-1">
                  <p className="font-bold text-xs text-slate-800">Your Location</p>
                  {distanceKm && <p className="text-[11px] text-slate-500">{distanceKm} km to Vendor Shop</p>}
                </div>
              </Popup>
            </Marker>
          )}

          <RecenterMap lat={vendorLat} lon={vendorLon} />
        </MapContainer>
      </div>

      {/* Map Footer Action Bar */}
      <div className="p-3 bg-bg-elevated border-t border-border flex justify-between items-center text-xs">
        <span className="text-text-muted font-semibold flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-danger" /> Exact Shop Coordinates: {vendorLat.toFixed(4)}, {vendorLon.toFixed(4)}
        </span>
        <a 
          href={googleMapsUrl} 
          target="_blank" 
          rel="noreferrer" 
          className="font-extrabold text-accent hover:underline flex items-center gap-1"
        >
          Open Maps <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

    </div>
  );
};

export default VendorMap;
