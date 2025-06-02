import React, { useEffect, useState, useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { UserPlusIcon } from '@heroicons/react/24/outline';
import { User } from 'lucide-react';
import logo from '../assets/logo.png';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface Crop {
  _id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  _id: string;
  cropName: string;
  quantity: number;
  buyerName: string;
  deliveryDate: string;
}

interface StatsData {
  date: string;
  orders: number;
  earnings: number;
}
const Navbar: React.FC = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const userData = localStorage.getItem('cropcartUser');
    if (userData) {
      const user = JSON.parse(userData);
      setUserName(user.user.name);
    }
  }, []);

  const onLogout = () => {
    localStorage.removeItem('cropcartUser');
    toast.success('Logged out successfully');
    navigate('/home');
  };

  return (
    <nav className="flex justify-between items-center px-6 py-7 bg-white shadow-sm sticky top-0 z-50">
      <div
        className="flex items-center space-x-2 text-2xl font-extrabold text-green-700 cursor-pointer select-none dark:text-green-400"
        onClick={() => navigate('/')}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && navigate('/')}
      >
        <img src={logo} alt="CropCart Logo" className="w-8 h-8" />
        <span>CropCart</span>
      </div>

      <div className="flex items-center space-x-4 relative">
        {userName ? (
          <>
            <span className="font-semibold text-green-700 text-lg">
              Hi, {userName}
            </span>

            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="p-2 rounded-full bg-green-100 hover:bg-green-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                aria-haspopup="true"
                aria-expanded={dropdownOpen}
                aria-label="User menu"
              >
                <User className="w-6 h-6 text-green-700" />
              </button>
              {dropdownOpen && (
                <ul
                  className="absolute right-0 mt-2 w-48 bg-white border border-green-200 rounded-md shadow-lg z-50"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu"
                >
                  <li>
                    <button
                      onClick={() => {
                        navigate('/myorders');
                        setDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-green-800 hover:bg-green-100"
                      role="menuitem"
                    >
                      My Orders
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        navigate('/my-account');
                        setDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-green-800 hover:bg-green-100"
                      role="menuitem"
                    >
                      My Account
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        onLogout();
                        setDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-100"
                      role="menuitem"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              )}
            </div>
          </>
        ) : (
          <>
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 font-semibold text-gray-800 hover:text-green-700 text-lg"
              aria-label="Login"
            >
              Log in
            </button>
            <button
              onClick={() => navigate('/register')}
              className="px-5 py-2 bg-green-700 hover:bg-green-800 text-white rounded-md text-lg font-semibold flex items-center gap-2"
              aria-label="Sign up"
            >
              <UserPlusIcon className="w-5 h-5" aria-hidden="true" />
              Sign up
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

const FarmerDashboard: React.FC = () => {
  const [crops, setCrops] = useState<Crop[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<StatsData[]>([]);
  

  useEffect(() => {
    // Simulated fetches – replace with real API calls
    const fetchCrops = async () => {
      const res = await fetch('/api/farmer/crops');
      const data = await res.json();
      setCrops(data);
    };

    const fetchOrders = async () => {
      const res = await fetch('/api/farmer/orders');
      const data = await res.json();
      setOrders(data);
    };

    const fetchStats = async () => {
      const res = await fetch('/api/farmer/stats');
      const data = await res.json();
      setStats(data);
    };

    fetchCrops();
    fetchOrders();
    fetchStats();
  }, []);

  const ordersChartData = {
    labels: stats.map((item) => item.date),
    datasets: [
      {
        label: 'Orders',
        data: stats.map((item) => item.orders),
        backgroundColor: '#34d399',
      },
    ],
  };

  const earningsChartData = {
    labels: stats.map((item) => item.date),
    datasets: [
      {
        label: 'Earnings (₹)',
        data: stats.map((item) => item.earnings),
        backgroundColor: '#059669',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: (ctx: any) => `${ctx.dataset.label}: ₹${ctx.parsed.y}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    
    <div className="min-h-screen p-8 bg-green-50">
      <Navbar />
      <h1 className="text-4xl font-bold text-green-900 mb-8">Farmer Dashboard</h1>

      {/* Crops Uploaded */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-green-800 mb-4">Your Crops</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {crops.map((crop) => (
            <div
              key={crop._id}
              className="bg-white border border-green-200 p-4 rounded-lg shadow hover:shadow-md transition"
            >
              <h3 className="text-lg font-bold text-green-700">{crop.name}</h3>
              <p className="text-sm text-gray-600">Price: ₹{crop.price}</p>
              <p className="text-sm text-gray-600">Quantity: {crop.quantity} kg</p>
            </div>
          ))}
        </div>
      </section>

      {/* Orders to Fulfill */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-green-800 mb-4">Pending Orders</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-green-200 rounded-lg shadow">
            <thead>
              <tr className="bg-green-100 text-left">
                <th className="p-3">Crop</th>
                <th className="p-3">Quantity</th>
                <th className="p-3">Buyer</th>
                <th className="p-3">Delivery Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-t border-green-100">
                  <td className="p-3">{order.cropName}</td>
                  <td className="p-3">{order.quantity} kg</td>
                  <td className="p-3">{order.buyerName}</td>
                  <td className="p-3">{order.deliveryDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Charts Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
        <div className="bg-white p-6 shadow rounded-lg border">
          <h3 className="text-lg font-bold text-green-800 mb-4">Orders Over Last 30 Days</h3>
          <Bar data={ordersChartData} options={chartOptions} />
        </div>

        <div className="bg-white p-6 shadow rounded-lg border">
          <h3 className="text-lg font-bold text-green-800 mb-4">Earnings Over Last 30 Days</h3>
          <Bar data={earningsChartData} options={chartOptions} />
        </div>
      </section>
    </div>
  );
};

export default FarmerDashboard;
