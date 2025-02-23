'use client';
import { useState } from 'react';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '../firebase/config';
import { useRouter } from 'next/navigation';
import Layout from '../components/Layout';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [createUserWithEmailAndPassword] = useCreateUserWithEmailAndPassword(auth);
  const router = useRouter();

  const handleSignUp = async () => {
    if (!email || !password) {
      console.error('Email and password are required.');
      return;
    }
    try {
      const res = await createUserWithEmailAndPassword(email, password);
      sessionStorage.setItem('user', true);
      setEmail('');
      setPassword('');
      router.push('/sign-in');
    } catch (e) {
      console.error('Firebase signup error:', e);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center p-6">
        {/* Sign Up Form */}
        <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg p-10 rounded-lg shadow-xl w-96 border border-white border-opacity-20 transform transition-all duration-300 hover:scale-105">
          <h1 className="text-white text-3xl mb-5 font-bold">Sign Up</h1>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 mb-4 bg-white bg-opacity-20 rounded outline-none text-white placeholder-gray-200 border border-white border-opacity-20"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 mb-4 bg-white bg-opacity-20 rounded outline-none text-white placeholder-gray-200 border border-white border-opacity-20"
          />
          <button
            onClick={handleSignUp}
            className="w-full p-3 bg-blue-600 rounded text-white font-semibold hover:bg-blue-700 transition"
          >
            Sign Up
          </button>
          <button
            onClick={() => router.push('/sign-in')}
            className="w-full mt-3 p-3 bg-white bg-opacity-20 rounded text-white hover:bg-opacity-30 transition"
          >
            Already have an account? Sign In
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default SignUp;