// components/GlobeLocator/page.jsx
'use client';

import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet'; // Import Leaflet explicitly
import 'leaflet/dist/leaflet.css';
import { useEffect, useRef } from 'react';

// Fix for default marker icons
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function GlobeLocator({ city, country }) {
  const mapRef = useRef(null);
  const containerRef = useRef(null);
  const initialized = useRef(false);

  // Cleanup function
  const destroyMap = () => {
    if (mapRef.current) {
      mapRef.current.off();
      mapRef.current.remove();
      mapRef.current = null;
    }
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
    }
    initialized.current = false;
  };

  useEffect(() => {
    if (!city?.lat || !city?.lon) return;

    // Destroy existing map before initialization
    destroyMap();

    // Create new map instance with verification
    if (!containerRef.current.querySelector('.leaflet-container')) {
      const map = L.map(containerRef.current, {
        center: [city.lat, city.lon],
        zoom: 8,
        minZoom: 3,
        maxZoom: 12,
      });

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      // Add marker
      L.marker([city.lat, city.lon], { icon: DefaultIcon })
        .bindPopup(`${city.name}, ${country?.name?.common || ''}`)
        .addTo(map);

      mapRef.current = map;
      initialized.current = true;
    }

    return () => {
      // Force cleanup on unmount
      destroyMap();
    };
  }, [city, country]);

  return (
    <div 
      key={`map-container-${city?.lat}-${city?.lon}`}
      ref={containerRef}
      className="w-full h-[400px] bg-gray-50 rounded-lg overflow-hidden"
    />
  );
}