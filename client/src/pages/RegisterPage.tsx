import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { UserIcon, EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { toast, Toaster } from 'react-hot-toast';

const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      toast.success('User registered successfully!', {
        style: { background: '#14532d', color: 'white' },
      });
      navigate('/login');
    } catch (error: any) {
      toast.error(error.message, {
        style: { background: '#14532d', color: 'white' },
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
  <Toaster position="top-center" reverseOrder={false} />

  {/* Left Panel */}
  <div className="w-full md:w-1/3 relative overflow-hidden flex items-center justify-center bg-green-900 py-12 md:py-0">
    <div className="z-10 text-center px-6 md:px-12">
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-white drop-shadow-lg">
        Join Us.<br />
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-lime-100 to-white animate-pulse">
          Grow together with CropCart
        </span>
      </h1>
    </div>
  </div>

  {/* Right Panel */}
  <div className="w-full md:w-2/3 flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-100 px-4 py-12 sm:px-8">
    <div className="w-full max-w-md bg-white/80 backdrop-blur-lg p-6 sm:p-10 rounded-xl shadow-2xl border border-green-200">
      <h2 className="text-2xl sm:text-3xl font-bold text-green-800 mb-6 sm:mb-8 text-center">
        Create Your CropCart Account
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div className="relative">
          <UserIcon className="w-5 h-5 text-green-500 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
          <input
            id="name"
            type="text"
            required
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-green-300 focus:border-green-900 focus:ring-2 focus:ring-green-400 focus:outline-none transition text-sm sm:text-base"
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
            onChange={e => setEmail(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-green-300 focus:border-green-900 focus:ring-2 focus:ring-green-400 focus:outline-none transition text-sm sm:text-base"
            placeholder="Email address"
            autoComplete="email"
          />
        </div>

        {/* Password */}
        <div className="relative">
          <LockClosedIcon className="w-5 h-5 text-green-500 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-green-300 focus:border-green-900 focus:ring-2 focus:ring-green-400 focus:outline-none transition text-sm sm:text-base"
            placeholder="Create a password"
            autoComplete="new-password"
          />
        </div>

        {/* Register Button */}
        <button
          type="submit"
          className="w-full bg-green-900 text-white py-3 rounded-lg font-semibold hover:scale-[1.02] transition-all shadow-md"
        >
          Register
        </button>
      </form>

      {/* Login Redirect */}
      <p className="mt-6 text-center text-green-700 text-sm sm:text-base">
        Already have an account?{' '}
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

export default RegisterPage;
