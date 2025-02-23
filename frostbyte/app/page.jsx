'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useRouter } from 'next/navigation';
import Layout from './components/Layout';

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

const Home = () => {
  const router = useRouter();
  const [userLocation] = useState([43.4516, -80.4925]); // Hardcoded to Kitchener, ON

  // Custom marker icon for Leaflet
  const customIcon = new L.Icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  return (
    <Layout>
      <div className="min-h-screen flex flex-col items-center justify-center text-white p-6">
        <h1 className="text-4xl font-bold mb-8">Welcome to Frostbyte</h1>

        {/* Main Section */}
        <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg p-6 rounded-lg shadow-xl flex flex-col md:flex-row items-center w-full max-w-4xl border border-white border-opacity-20 transform transition-all duration-300 hover:scale-105">
          {/* Map Section */}
          <div className="w-full md:w-1/2 h-96">
            <MapContainer
              center={userLocation}
              zoom={13}
              style={{ height: '100%', width: '100%', borderRadius: '0.5rem' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={userLocation} icon={customIcon}>
                <Popup>You are here!</Popup>
              </Marker>
            </MapContainer>
          </div>

          {/* Text Section */}
          <div className="w-full md:w-1/2 md:pl-6 mt-4 md:mt-0">
            <h2 className="text-2xl font-semibold mb-2">Track Frostbite Risk</h2>
            <p className="text-gray-300">
              Frostbyte helps you assess the risk of frostbite based on real-time weather data.
              Stay safe and informed before heading outdoors.
            </p>
          </div>
        </div>

        {/* Get Started Button */}
        <button
          onClick={() => router.push('/sign-up')}
          className="mt-6 px-6 py-3 bg-indigo-600 rounded-lg text-white font-semibold hover:bg-indigo-500 transition"
        >
          Get Started
        </button>
      </div>
    </Layout>
  );
};

export default Home;