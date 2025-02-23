'use client';
import { useState, useEffect } from 'react';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '../firebase/config';
import { useRouter } from 'next/navigation';
import Layout from '../components/Layout';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signInWithEmailAndPassword, user, loading, error] = useSignInWithEmailAndPassword(auth);
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (error) {
      switch (error.code) {
        case 'auth/invalid-credential':
        case 'auth/wrong-password':
        case 'auth/user-not-found':
          setErrorMessage('Invalid email or password.');
          break;
        case 'auth/too-many-requests':
          setErrorMessage('Too many failed attempts. Try again later.');
          break;
        default:
          setErrorMessage('An unexpected error occurred. Please try again.');
      }
    }
  }, [error]);

  const handleSignIn = async () => {
    if (!email || !password) {
      setErrorMessage('Email and password are required.');
      return;
    }
    setErrorMessage('');
    signInWithEmailAndPassword(email, password);
  };

  useEffect(() => {
    if (user) {
      sessionStorage.setItem('user', true);
      router.push('./components/Dashboard');
    }
  }, [user, router]);

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center p-6">
        {/* Sign In Form */}
        <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg p-10 rounded-lg shadow-xl w-96 border border-white border-opacity-20 transform transition-all duration-300 hover:scale-105">
          <h1 className="text-white text-3xl mb-5 font-bold">Sign In</h1>

          {errorMessage && (
            <div className="bg-red-500 p-3 mb-4 rounded text-white">
              {errorMessage}
            </div>
          )}

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
            onClick={handleSignIn}
            className="w-full p-3 bg-blue-600 rounded text-white font-semibold hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
          <button
            onClick={() => router.push('/sign-up')}
            className="w-full mt-3 p-3 bg-white bg-opacity-20 rounded text-white hover:bg-opacity-30 transition"
          >
            Don't have an account? Sign Up Here
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default SignIn;