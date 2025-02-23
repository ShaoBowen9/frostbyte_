'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const Home = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6">
      <h1 className="text-4xl font-bold mb-8">Welcome to Frostbyte</h1>

      {/* Main Section */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl flex flex-col md:flex-row items-center w-full max-w-4xl">
        {/* Map Image */}
        <div className="w-full md:w-1/2">
          <Image
            src="/map-placeholder.jpg" // Replace with your actual map image URL
            alt="Map"
            width={500}
            height={300}
            className="rounded-lg"
          />
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
        onClick={() => router.push('/sign-up')} // Redirects to sign-up page
        className="mt-6 px-6 py-3 bg-indigo-600 rounded-lg text-white font-semibold hover:bg-indigo-500 transition"
      >
        Get Started
      </button>
    </div>
  );
};

export default Home;
