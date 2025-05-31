import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LockClosedIcon, EnvelopeIcon } from '@heroicons/react/24/solid';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../firebase';
import { toast } from 'react-hot-toast';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
     await signInWithEmailAndPassword(auth, email, password);
    

    const res = await fetch('https://crop-cart-backend.onrender.com/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password }),
});


    const data = await res.json();

    if (res.ok) {
      localStorage.setItem('cropcartUser', JSON.stringify(data));
      toast.success(`Logged in as ${email}`);
      navigate('/home');
    } else {
      toast.error(data.message || 'Login failed');
    }
  } catch (error: any) {
    toast.error(error.message || 'Login failed');
    console.error('Login error:', error.code, error.message);
  }
};


  const handleGoogleLogin = async () => {
    try {
      // Google sign-in popup
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Get Firebase ID token
      const token = await user.getIdToken();

      // Send token to backend same as email/password flow
      const res = await fetch('https://crop-cart-backend.onrender.com/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('cropcartUser', JSON.stringify(data));
        toast.success(`Logged in as ${user.email}`);
        navigate('/home');
      } else {
        toast.error(data.message || 'Google login failed');
      }
    } catch (error: any) {
      toast.error('Google login failed');
      console.error('Google login error:', error.code, error.message);
    }
  };
  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="w-1/3 relative overflow-hidden flex items-center justify-center bg-green-900">
        <div className="z-10 text-center px-12">
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight text-white drop-shadow-lg">
            Welcome Back.<br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-lime-100 to-white animate-pulse">
              Let’s grow together with CropCart
            </span>
          </h1>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-2/3 flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-100">
        <div className="max-w-md w-full bg-white/80 backdrop-blur-lg p-10 rounded-xl shadow-2xl border border-green-200">
          <h2 className="text-3xl font-bold text-green-800 mb-8 text-center">
            Login to CropCart
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <EnvelopeIcon className="w-5 h-5 text-green-500 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-green-300 focus:border-green-900 focus:ring-2 focus:ring-green-400 focus:outline-none transition"
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>

            <div className="relative">
              <LockClosedIcon className="w-5 h-5 text-green-500 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-green-300 focus:border-green-900 focus:ring-2 focus:ring-green-400 focus:outline-none transition"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-green-900 text-white py-3 rounded-lg font-semibold hover:scale-[1.02] transition-all shadow-md"
            >
              Login
            </button>
          </form>

          {/* OR Divider */}
          <div className="mt-6 text-center">
            <p className="text-gray-500 mb-4">or</p>
            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-all shadow-sm"
            >
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google logo"
                className="h-5 w-5"
              />
              Sign in with Google
            </button>
          </div>

          <p className="mt-6 text-center text-green-700">
            Don&apos;t have an account?{' '}
            <button
              onClick={() => navigate('/register')}
              className="font-semibold underline hover:text-green-900"
            >
              Register here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
