import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import logo from '../assets/logo.png';
import { User, Mail, ShieldCheck, Package, ArrowRight, LogOut } from 'lucide-react';
import Footer from '../components/Footer';

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
}

const MyAccount: React.FC = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [orderCount, setOrderCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    const storedUser = localStorage.getItem('cropcartUser');
    if (!storedUser) {
      toast.error('Please log in to view your account');
      navigate('/login');
      return;
    }

    try {
      const data = JSON.parse(storedUser);
      if (data?.user) {
        setUser(data.user);
        fetchOrderCount(data.user.id, data.token);
      } else {
        navigate('/login');
      }
    } catch {
      navigate('/login');
    }
  }, [navigate]);

  const fetchOrderCount = async (userId: string, token: string) => {
    try {
      const res = await fetch(`https://crop-cart-backend.onrender.com/api/orders/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const orders = await res.json();
        setOrderCount(orders.length);
      }
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('cropcartUser');
    toast.success('Logged out successfully', {
    });
    navigate('/');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <nav className="flex justify-between items-center px-4 sm:px-6 py-5 sm:py-7 bg-white shadow-sm sticky top-0 z-50">
          <div className="flex items-center space-x-2 text-xl sm:text-2xl font-extrabold text-green-700 select-none font-heading">
            <img src={logo} alt="CropCart Logo" className="w-7 h-7 sm:w-8 sm:h-8" />
            <span>CropCart</span>
          </div>
          <div className="skeleton h-9 w-20 rounded-lg" />
        </nav>

        <main className="flex-grow max-w-3xl w-full mx-auto px-4 sm:px-6 py-10 sm:py-16">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="h-32 sm:h-40 bg-gradient-to-br from-green-800 via-green-700 to-emerald-600 relative">
              <div className="absolute inset-0 opacity-20">
                <svg className="w-full h-full" viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="50" cy="50" r="80" fill="white" opacity="0.1" />
                  <circle cx="350" cy="150" r="100" fill="white" opacity="0.08" />
                  <circle cx="200" cy="20" r="60" fill="white" opacity="0.06" />
                </svg>
              </div>
            </div>
            <div className="relative px-6 sm:px-8 pb-6">
              <div className="absolute -top-12 sm:-top-14 left-6 sm:left-8">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-green-200 border-4 border-white shadow-xl animate-pulse" />
              </div>
              <div className="pt-14 sm:pt-16">
                <div className="skeleton h-7 w-48 rounded mb-2" />
                <div className="skeleton h-4 w-56 rounded mb-3" />
                <div className="flex gap-2">
                  <div className="skeleton h-6 w-20 rounded-full" />
                  <div className="skeleton h-6 w-24 rounded-full" />
                </div>
              </div>
            </div>
          </div>

          <section className="mt-8">
            <div className="skeleton h-5 w-36 rounded mb-4" />
            <div className="bg-white rounded-2xl shadow-md divide-y divide-gray-100">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 px-6 py-5">
                  <div className="w-10 h-10 rounded-full bg-green-50 flex-shrink-0 animate-pulse" />
                  <div>
                    <div className="skeleton h-2.5 w-20 rounded mb-2" />
                    <div className="skeleton h-4 w-40 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-8">
            <div className="skeleton h-5 w-32 rounded mb-4" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between bg-white rounded-2xl shadow-md px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 animate-pulse" />
                    <div className="skeleton h-4 w-28 rounded" />
                  </div>
                  <div className="skeleton h-4 w-4 rounded" />
                </div>
              ))}
            </div>
          </section>

          <section className="mt-8 mb-8">
            <div className="skeleton h-5 w-36 rounded mb-4" />
            <div className="bg-white rounded-2xl shadow-md">
              <div className="flex items-center justify-between px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-50 animate-pulse" />
                  <div>
                    <div className="skeleton h-4 w-16 rounded mb-1.5" />
                    <div className="skeleton h-2.5 w-40 rounded" />
                  </div>
                </div>
                <div className="skeleton h-4 w-4 rounded" />
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      <nav className="flex justify-between items-center px-4 sm:px-6 py-5 sm:py-7 bg-white shadow-sm sticky top-0 z-50">
        <div
          className="flex items-center space-x-2 text-xl sm:text-2xl font-extrabold text-green-700 cursor-pointer select-none font-heading"
          onClick={() => navigate('/')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && navigate('/')}
        >
          <img src={logo} alt="CropCart Logo" className="w-7 h-7 sm:w-8 sm:h-8" />
          <span>CropCart</span>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </nav>


      <main className="flex-grow max-w-3xl w-full mx-auto px-4 sm:px-6 py-10 sm:py-16">

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

          <div className="h-32 sm:h-40 bg-gradient-to-br from-green-800 via-green-700 to-emerald-600 relative">
            <div className="absolute inset-0 opacity-20">
              <svg className="w-full h-full" viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="80" fill="white" opacity="0.1" />
                <circle cx="350" cy="150" r="100" fill="white" opacity="0.08" />
                <circle cx="200" cy="20" r="60" fill="white" opacity="0.06" />
              </svg>
            </div>
          </div>


          <div className="relative px-6 sm:px-8 pb-6">
            <div className="absolute -top-12 sm:-top-14 left-6 sm:left-8">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-green-700 border-4 border-white shadow-xl flex items-center justify-center">
                <span className="text-3xl sm:text-4xl font-bold text-white font-heading">
                  {getInitials(user.name)}
                </span>
              </div>
            </div>

            <div className="pt-14 sm:pt-16">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 font-heading">{user.name}</h1>
              <p className="text-gray-500 mt-1 flex items-center gap-1.5 text-sm sm:text-base">
                <Mail className="w-4 h-4" />
                {user.email}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs sm:text-sm font-semibold bg-green-100 text-green-800">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {user.role === 'farmer' ? 'Farmer' : 'Customer'}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs sm:text-sm font-semibold bg-blue-100 text-blue-800">
                  <Package className="w-3.5 h-3.5" />
                  {orderCount} {orderCount === 1 ? 'Order' : 'Orders'}
                </span>
              </div>
            </div>
          </div>
        </div>


        <section className="mt-8">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 font-heading">Account Details</h2>
          <div className="bg-white rounded-2xl shadow-md divide-y divide-gray-100">
            <div className="flex items-center gap-4 px-6 py-5">
              <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-green-700" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Full Name</p>
                <p className="text-base sm:text-lg font-semibold text-gray-900 truncate">{user.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 px-6 py-5">
              <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-green-700" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Email Address</p>
                <p className="text-base sm:text-lg font-semibold text-gray-900 truncate">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 px-6 py-5">
              <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-5 h-5 text-green-700" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Account Type</p>
                <p className="text-base sm:text-lg font-semibold text-gray-900">
                  {user.role === 'farmer' ? 'Farmer Account' : 'Customer Account'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 px-6 py-5">
              <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                <Package className="w-5 h-5 text-green-700" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Total Orders</p>
                <p className="text-base sm:text-lg font-semibold text-gray-900">
                  {orderCount} {orderCount === 1 ? 'order' : 'orders'} placed
                </p>
              </div>
            </div>
          </div>
        </section>


        <section className="mt-8">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 font-heading">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => navigate('/myorders')}
              className="group flex items-center justify-between bg-white rounded-2xl shadow-md px-6 py-5 hover:shadow-lg hover:bg-green-50 transition-all duration-300"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                  <Package className="w-5 h-5 text-green-700" />
                </div>
                <span className="font-semibold text-gray-800">My Orders</span>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-green-700 group-hover:translate-x-1 transition-all" />
            </button>

            <button
              onClick={() => navigate('/home')}
              className="group flex items-center justify-between bg-white rounded-2xl shadow-md px-6 py-5 hover:shadow-lg hover:bg-green-50 transition-all duration-300"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                  <svg className="w-5 h-5 text-green-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <path d="M16 10a4 4 0 01-8 0" />
                  </svg>
                </div>
                <span className="font-semibold text-gray-800">Continue Shopping</span>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-green-700 group-hover:translate-x-1 transition-all" />
            </button>

            {user.role === 'farmer' && (
              <button
                onClick={() => navigate('/farmer-dashboard')}
                className="group flex items-center justify-between bg-white rounded-2xl shadow-md px-6 py-5 hover:shadow-lg hover:bg-green-50 transition-all duration-300 sm:col-span-2"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                    <svg className="w-5 h-5 text-green-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 3v18h18" />
                      <path d="M18 17V9" />
                      <path d="M13 17V5" />
                      <path d="M8 17v-3" />
                    </svg>
                  </div>
                  <span className="font-semibold text-gray-800">Farmer Dashboard</span>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-green-700 group-hover:translate-x-1 transition-all" />
              </button>
            )}
          </div>
        </section>


        <section className="mt-8 mb-8">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 font-heading">Account Actions</h2>
          <div className="bg-white rounded-2xl shadow-md">
            <button
              onClick={handleLogout}
              className="group w-full flex items-center justify-between px-6 py-5 hover:bg-red-50 rounded-2xl transition-colors duration-300"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center group-hover:bg-red-100 transition-colors">
                  <LogOut className="w-5 h-5 text-red-600" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-red-600">Log Out</p>
                  <p className="text-xs text-gray-500">Sign out of your CropCart account</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-red-400 group-hover:translate-x-1 transition-all" />
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default MyAccount;
