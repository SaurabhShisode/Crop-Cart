import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import {
  UserIcon, EnvelopeIcon, LockClosedIcon, EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';
import { toast, Toaster } from 'react-hot-toast';

const RegisterFarmerPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);

      const res = await fetch('https://crop-cart-backend.onrender.com/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, role: 'farmer' }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Farmer registered successfully!', {
          style: { background: '#14532d', color: 'white' },
        });
        navigate('/login');
      } else {
        toast.error(data.message || 'Registration failed', {
          style: { background: '#14532d', color: 'white' },
        });
      }
    } catch (error: any) {
      toast.error(error.message, {
        style: { background: '#14532d', color: 'white' },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
  <Toaster position="top-center" reverseOrder={false} />

  {/* Left Panel */}
  <div className="w-full md:w-1/3 flex items-center justify-center bg-green-900 py-10 md:py-0 px-6">
    <div className="z-10 text-center">
      <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-white drop-shadow-lg">
        Welcome Farmer!
        <br />
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-lime-100 to-white animate-pulse">
          Sell smarter. Grow faster with CropCart.
        </span>
      </h1>
    </div>
  </div>

  {/* Right Panel */}
  <div className="w-full md:w-2/3 flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-100 py-12 px-4">
    <div className="w-full max-w-md bg-white/80 backdrop-blur-lg p-6 md:p-10 rounded-xl shadow-2xl border border-green-200">
      <h2 className="text-2xl md:text-3xl font-bold text-green-800 mb-6 md:mb-8 text-center">
        Create Your Farmer Account
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
        {/* Name */}
        <div className="relative">
          <UserIcon className="w-5 h-5 text-green-500 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
          <input
            id="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-green-300 focus:border-green-900 focus:ring-2 focus:ring-green-400 focus:outline-none transition"
            placeholder="Full Name"
            autoComplete="name"
          />
        </div>

        {/* Email */}
        <div className="relative">
          <EnvelopeIcon className="w-5 h-5 text-green-500 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-green-300 focus:border-green-900 focus:ring-2 focus:ring-green-400 focus:outline-none transition"
            placeholder="Email address"
            autoComplete="email"
          />
        </div>

        {/* Password */}
        <div className="relative">
          <LockClosedIcon className="w-5 h-5 text-green-500 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-10 pr-10 py-3 rounded-lg border border-green-300 focus:border-green-900 focus:ring-2 focus:ring-green-400 focus:outline-none transition"
            placeholder="Create a password"
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 focus:outline-none"
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeSlashIcon className="w-5 h-5" />
            ) : (
              <EyeIcon className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg font-semibold transition-all shadow-md ${
            loading
              ? 'bg-green-900 text-white cursor-not-allowed'
              : 'bg-green-900 text-white hover:scale-[1.02]'
          }`}
        >
          {loading ? 'Registering...' : 'Register as Farmer'}
        </button>
      </form>

      {/* Login redirect */}
      <p className="mt-6 text-center text-green-700">
        Already registered?{' '}
        <button
          onClick={() => navigate('/login')}
          className="font-semibold underline hover:text-green-900"
        >
          Log in
        </button>
      </p>
    </div>
  </div>
</div>

  );
};

export default RegisterFarmerPage;
