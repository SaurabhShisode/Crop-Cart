import React, { useState } from 'react';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { UserIcon, EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { toast, Toaster } from 'react-hot-toast';

const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);



const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    
    await sendEmailVerification(user);


    const res = await fetch('https://crop-cart-backend.onrender.com/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role: 'user' }),
    });

    const data = await res.json();

    if (res.ok) {
      toast.success('Verification email sent. Please verify before logging in.', {
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
    <div className="min-h-screen flex">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="w-1/3 relative overflow-hidden flex items-center justify-center bg-green-900">
        <div className="z-10 text-center px-12">
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight text-white drop-shadow-lg">
            Join Us.<br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-lime-100 to-white animate-pulse">
              Grow together with CropCart
            </span>
          </h1>
        </div>
      </div>

      <div className="w-2/3 flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-100">
        <div className="max-w-md w-full bg-white/80 backdrop-blur-lg p-10 rounded-xl shadow-2xl border border-green-200">
          <h2 className="text-3xl font-bold text-green-800 mb-8 text-center">
            Create Your CropCart Account
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <UserIcon className="w-5 h-5 text-green-500 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-green-300 focus:border-green-900 focus:ring-2 focus:ring-green-400 focus:outline-none transition"
                placeholder="Full Name"
                autoComplete="name"
              />
            </div>

            <div className="relative">
              <EnvelopeIcon className="w-5 h-5 text-green-500 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-green-300 focus:border-green-900 focus:ring-2 focus:ring-green-400 focus:outline-none transition"
                placeholder="Email address"
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
                placeholder="Create a password"
                autoComplete="new-password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg font-semibold transition-all shadow-md ${loading
                  ? 'bg-green-900 text-white cursor-not-allowed'
                  : 'bg-green-900 text-white hover:scale-[1.02]'
                }`}
            >
              {loading ? 'Registering...' : 'Register'}
            </button>

          </form>

          <p className="mt-6 text-center text-green-700">
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
