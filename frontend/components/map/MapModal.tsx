'use client';

import { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import dynamic from 'next/dynamic';
import { useMapEvents } from 'react-leaflet';
import type { Location } from '@/types/ui.types';

const MapContainer = dynamic(
  () => import('react-leaflet').then(mod => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then(mod => mod.TileLayer),
  { ssr: false }
);

interface MapModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialLocation?: Location;
  onSave: (location: Location) => void;
}

// Sub-component untuk handle map events (update draft location on moveend)
function MapEventsHandler({
  onLocationChange,
}: {
  onLocationChange: (loc: Location) => void;
}) {
  const map = useMapEvents({
    moveend: () => {
      const center = map.getCenter();
      const newLocation = { lat: center.lat, lng: center.lng };
      onLocationChange(newLocation);
    },
  });

  return null;
}

export function MapModal({ isOpen, onClose, initialLocation, onSave }: MapModalProps) {
  const [mounted, setMounted] = useState(false);
  const [draftLocation, setDraftLocation] = useState<Location>(
    initialLocation || { lat: -6.2088, lng: 106.8456 }
  );
  const [initialSnapshot, setInitialSnapshot] = useState<Location | null>(null);
  const [L, setL] = useState<any>(null);
  const [portalElement, setPortalElement] = useState<HTMLElement | null>(null);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    setMounted(true);
    setPortalElement(document.body);
    import('leaflet').then(leaflet => setL(leaflet));
  }, []);

  // Capture initial snapshot when modal opens
  useEffect(() => {
    if (isOpen && initialLocation) {
      setInitialSnapshot({ ...initialLocation });
      setDraftLocation({ ...initialLocation });
    }
  }, [isOpen, initialLocation]);

  const handleRecenter = () => {
    if (initialSnapshot && mapRef.current) {
      mapRef.current.flyTo([initialSnapshot.lat, initialSnapshot.lng], 15, {
        duration: 1,
      });
      setDraftLocation({ ...initialSnapshot });
    }
  };

  const handleSave = () => {
    onSave(draftLocation);
    onClose();
  };

  if (!isOpen || !mounted || !portalElement) return null;

  const modalContent = (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" 
      onClick={onClose}
    >
      <div 
        className="w-full max-w-4xl h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col relative z-[9999]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 bg-white z-10">
          <h2 className="text-2xl font-bold text-gray-800">Pilih Lokasi Pengiriman</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
            aria-label="Tutup modal"
            type="button"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Map Container */}
        <div className="flex-1 relative min-h-0">
          {!mounted || !L ? (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">Memuat peta...</p>
              </div>
            </div>
          ) : (
            <>
              <MapContainer
                ref={mapRef}
                center={[draftLocation.lat, draftLocation.lng]}
                zoom={15}
                scrollWheelZoom={true}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapEventsHandler 
                  onLocationChange={setDraftLocation}
                />
              </MapContainer>

              {/* Center Pin (Gojek Style) */}
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

              {/* Recenter Button */}
              {initialSnapshot && (
                <button
                  type="button"
                  onClick={handleRecenter}
                  className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3 z-[401] hover:bg-gray-50 transition"
                  aria-label="Kembalikan ke posisi awal"
                  title="Kembalikan ke posisi awal"
                >
                  <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              )}

              {/* Coordinate Display */}
              <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-4 z-[401] pointer-events-none">
                <p className="text-xs text-gray-600 mb-1">Koordinat Terpilih</p>
                <p className="text-sm font-semibold text-gray-900 font-mono">
                  {draftLocation.lat.toFixed(6)}, {draftLocation.lng.toFixed(6)}
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer with Info and Actions */}
        <div className="border-t border-gray-200 bg-gray-50 px-6 py-4 z-10">
          <div className="mb-4 p-3 rounded-lg bg-blue-50 border border-blue-100">
            <p className="text-xs text-blue-700 mb-2 font-medium">
              💡 Geser peta untuk memilih titik lokasi pengiriman yang tepat
            </p>
            <p className="text-sm font-medium text-gray-700">
              <span className="text-gray-600">Latitude:</span>{' '}
              <span className="font-mono font-semibold text-gray-900">{draftLocation.lat.toFixed(6)}</span>
            </p>
            <p className="text-sm font-medium text-gray-700">
              <span className="text-gray-600">Longitude:</span>{' '}
              <span className="font-mono font-semibold text-gray-900">{draftLocation.lng.toFixed(6)}</span>
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-gray-700 font-semibold transition hover:bg-gray-100"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex-1 rounded-lg bg-primary-600 px-4 py-3 text-white font-semibold transition hover:bg-primary-700"
            >
              Simpan Lokasi
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, portalElement);
}
