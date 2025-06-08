import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LockClosedIcon, EnvelopeIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';
import { signInWithPopup } from 'firebase/auth';
import { toast } from 'react-hot-toast';
import { auth, provider } from '../firebase';

const FarmerLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('https://crop-cart-backend.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        if (data.user.role !== 'farmer') {
          toast.error('You are not registered as a farmer.', {
            style: { background: '#14532d', color: 'white' },
          });
          setLoading(false);
          return;
        }

        localStorage.setItem('cropcartUser', JSON.stringify(data));
        toast.success(`Logged in as Farmer ${email}`, {
          style: { background: '#14532d', color: 'white' },
        });
        navigate('/farmer-dashboard');
      } else {
        toast.error(data.message || 'Login failed', {
          style: { background: '#14532d', color: 'white' },
        });
      }
    } catch (error: any) {
      toast.error(error.message || 'Login failed', {
        style: { background: '#14532d', color: 'white' },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const token = await user.getIdToken();

      const res = await fetch('https://crop-cart-backend.onrender.com/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      const data = await res.json();

      if (res.ok) {
        if (data.user.role !== 'farmer') {
          toast.error('You are not registered as a farmer.');
          setLoading(false);
          return;
        }

        localStorage.setItem('cropcartUser', JSON.stringify(data));
        toast.success(`Logged in as Farmer ${user.email}`, {
          style: { background: '#14532d', color: 'white' },
        });
        navigate('/farmer-dashboard');
      } else {
        toast.error(data.message || 'Google login failed', {
          style: { background: '#14532d', color: 'white' },
        });
      }
    } catch (error) {
      toast.error('Google login failed', {
        style: { background: '#14532d', color: 'white' },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
  {/* Left Panel */}
  <div className="w-full md:w-1/3 flex items-center justify-center bg-green-900 py-10 md:py-0">
    <div className="text-center px-8 md:px-12">
      <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-white drop-shadow-lg">
        Welcome Farmer!
        <br />
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-lime-100 to-white animate-pulse">
          Grow More. Earn More. With CropCart.
        </span>
      </h1>
    </div>
  </div>

  {/* Right Panel */}
  <div className="w-full md:w-2/3 flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-100 py-12 px-4">
    <div className="w-full max-w-md bg-white/80 backdrop-blur-lg p-6 md:p-10 rounded-xl shadow-2xl border border-green-200">
      <h2 className="text-2xl md:text-3xl font-bold text-green-800 mb-6 md:mb-8 text-center">
        Farmer Login
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
        <div className="relative">
          <EnvelopeIcon className="w-5 h-5 text-green-500 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-green-300 focus:ring-2 focus:ring-green-400"
            placeholder="you@example.com"
            autoComplete="email"
            disabled={loading}
          />
        </div>

        <div className="relative">
          <LockClosedIcon className="w-5 h-5 text-green-500 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
          <input
            type={showPassword ? 'text' : 'password'}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-10 pr-10 py-3 rounded-lg border border-green-300 focus:ring-2 focus:ring-green-400"
            placeholder="••••••••"
            autoComplete="current-password"
            disabled={loading}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 focus:outline-none"
            onClick={() => setShowPassword((prev) => !prev)}
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeSlashIcon className="w-5 h-5" />
            ) : (
              <EyeIcon className="w-5 h-5" />
            )}
          </button>
        </div>

        <button
          type="submit"
          className={`w-full py-3 rounded-lg font-semibold shadow-md transition-all ${
            loading
              ? 'bg-green-900 text-white cursor-not-allowed'
              : 'bg-green-900 text-white hover:scale-[1.02]'
          }`}
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      {/* Divider */}
      <div className="mt-6 text-center">
        <p className="text-gray-500 mb-4">or</p>
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className={`w-full flex items-center justify-center gap-3 py-2 rounded-lg shadow-sm transition-all ${
            loading
              ? 'bg-gray-300 cursor-not-allowed text-gray-500'
              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            className="h-5 w-5"
          />
          {loading ? 'Please wait...' : 'Sign in with Google'}
        </button>
      </div>

      <p className="mt-6 text-center text-green-700">
        Don&apos;t have a farmer account?{' '}
        <button
          onClick={() => navigate('/farmer-register')}
          className="font-semibold underline hover:text-green-900"
          disabled={loading}
        >
          Register here
        </button>
      </p>
    </div>
  </div>
</div>

  );
};

export default FarmerLoginPage;
