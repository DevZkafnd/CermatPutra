'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useMap } from 'react-leaflet';
import type { Location } from '@/types/ui.types';

// Dynamic import untuk menghindari issue server-side rendering
const MapContainer = dynamic(
  () => import('react-leaflet').then(mod => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then(mod => mod.TileLayer),
  { ssr: false }
);

interface MapComponentProps {
  location?: Location;
  onMapClick?: () => void;
  interactive?: boolean;
}

// Sub-component untuk update peta secara reaktif saat props location berubah
function MapUpdater({ location }: { location: Location }) {
  const map = useMap();

  useEffect(() => {
    if (location) {
      const currentCenter = map.getCenter();
      // Only update if location actually changed
      if (
        Math.abs(currentCenter.lat - location.lat) > 0.00001 ||
        Math.abs(currentCenter.lng - location.lng) > 0.00001
      ) {
        map.setView([location.lat, location.lng], map.getZoom());
      }
    }
  }, [location, map]);

  return null;
}

export function MapComponent({ location, onMapClick, interactive = false }: MapComponentProps) {
  const [mounted, setMounted] = useState(false);
  const [L, setL] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    import('leaflet').then(leaflet => setL(leaflet));
  }, []);

  // NO DEFAULT LOCATION - only show map if valid location provided
  if (!location) {
    return (
      <div className="w-full h-80 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-center">
        <div className="text-center px-4">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          <p className="text-sm font-medium text-gray-600">Lokasi peta akan muncul setelah alamat berhasil ditemukan</p>
        </div>
      </div>
    );
  }

  if (!mounted || !L) {
    return (
      <div className="w-full h-80 bg-gray-100 rounded-xl border border-gray-200 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">Memuat peta...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="map-wrapper w-full h-80 rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer relative"
      onClick={onMapClick}
      style={{ isolation: 'isolate' }}
    >
      <MapContainer
        center={[location.lat, location.lng]}
        zoom={15}
        scrollWheelZoom={false}
        dragging={false}
        doubleClickZoom={false}
        zoomControl={false}
        touchZoom={false}
        boxZoom={false}
        keyboard={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapUpdater location={location} />
      </MapContainer>

      {/* Center Pin (Static) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full pointer-events-none z-[400]">
        <svg 
          width="48" 
          height="48" 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-lg"
        >
          <path 
            d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" 
            fill="#DC2626"
            stroke="#FFF"
            strokeWidth="1"
          />
          <circle cx="12" cy="9" r="2.5" fill="#FFF" />
        </svg>
      </div>

      {/* Overlay untuk mengindikasikan peta adalah clickable */}
      <div className="absolute inset-0 bg-transparent hover:bg-black/5 transition-colors pointer-events-none" />
    </div>
  );
}
