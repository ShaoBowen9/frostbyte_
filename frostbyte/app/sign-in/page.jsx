'use client';
import { useState, useEffect } from 'react';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '../firebase/config';
import { useRouter } from 'next/navigation';
const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signInWithEmailAndPassword, user, loading, error] = useSignInWithEmailAndPassword(auth);
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState('');

  // Handle authentication errors
  useEffect(() => {
    if (error) {
      console.error('Sign-in error:', error); // Log full error for debugging

      setEmail('');
      setPassword('');

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
          setErrorMessage(error.message || 'An unexpected error occurred. Please try again.');
      }
    }
  }, [error]);

  const handleSignIn = async () => {
    if (!email || !password) {
      setErrorMessage('Email and password are required.');
      return;
    }

    setErrorMessage(''); // Clear previous errors before attempting sign-in
    signInWithEmailAndPassword(email, password);
  };

  // Redirect user if sign-in is successful
  useEffect(() => {
    if (user) {
      sessionStorage.setItem('user', true);
      router.push('../components/Dashboard'); // Redirects to dashboard now
    }
  }, [user, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-10 rounded-lg shadow-xl w-96">
        <h1 className="text-white text-2xl mb-5">Sign In</h1>

        {/* Show error message if there's one */}
        {errorMessage && (
          <div className="bg-red-600 p-2 text-white mb-4 rounded">
            <p>{errorMessage}</p>
          </div>
        )}

        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          className="w-full p-3 mb-4 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          className="w-full p-3 mb-4 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
        />
        <button 
          onClick={handleSignIn}
          className="w-full p-3 bg-indigo-600 rounded text-white hover:bg-indigo-500"
          disabled={loading}
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
        <button 
          onClick={() => router.push('/sign-up')}
          className="w-full mt-3 p-3 bg-gray-600 rounded text-white hover:bg-gray-500"
        >
          Don't have an account? Sign Up Here
        </button>
      </div>
    </div>
  );
};

export default SignIn;
