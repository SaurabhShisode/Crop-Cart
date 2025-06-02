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
import Footer from '../components/Footer';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface Crop {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  type: string;
  availability: string;
  regionPincodes: string[];
  image?: string;
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
    navigate('/');
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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = JSON.parse(localStorage.getItem('cropcartUser') || '{}')?.token;

        const [cropsRes, ordersRes, statsRes] = await Promise.all([
          fetch('/api/farmer/crops', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch('/api/farmer/orders', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch('/api/farmer/stats', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        if (cropsRes.ok) {
          const cropsData = await cropsRes.json();
          setCrops(cropsData);
        }
        if (ordersRes.ok) {
          const ordersData = await ordersRes.json();
          setOrders(ordersData);
        }
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }
      } catch (error) {
        toast.error('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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

  const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  async function uploadImageToCloudinary(file: File): Promise<string> {
    const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    const res = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) throw new Error('Image upload failed');

    const data = await res.json();
    return data.secure_url;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen p-8 bg-green-50">
        <h1 className="text-4xl font-bold text-green-900 mb-8">Farmer Dashboard</h1>

        {loading ? (
          <div className="text-center text-xl text-green-700">Loading data...</div>
        ) : (
          <>
            {/* Crops Section */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-green-800 mb-4">Your Crops</h2>

              {/* Add Crop Form */}
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const form = e.currentTarget;
                  const formData = new FormData(form);

                  const imageFile = formData.get('image') as File | null;

                  let imageUrl = '';
                  try {
                    if (imageFile && imageFile.name) {
                      imageUrl = await uploadImageToCloudinary(imageFile);
                    }
                  } catch (error) {
                    toast.error('Image upload failed');
                    return;
                  }

                  const newCrop = {
                    name: formData.get('name'),
                    price: Number(formData.get('price')),
                    quantity: formData.get('quantity'),
                    type: formData.get('type'),
                    availability: formData.get('availability'),
                    regionPincodes: (formData.get('regionPincodes') as string)
                      .split(',')
                      .map((p) => p.trim()),
                    image: imageUrl,
                  };

                  const token = JSON.parse(localStorage.getItem('cropcartUser') || '{}')?.token;

                  const res = await fetch('/api/farmer/crop', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(newCrop),
                  });

                  if (res.ok) {
                    const addedCrop = await res.json();
                    setCrops((prev) => [...prev, addedCrop]);
                    form.reset();
                    toast.success('Crop added successfully');
                  } else {
                    toast.error('Failed to add crop');
                  }
                }}
                className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-end"
              >
                <input name="name" required placeholder="Crop Name" className="p-2 border border-green-300 rounded-md" />
                <input name="price" type="number" required placeholder="Price (₹)" className="p-2 border border-green-300 rounded-md" />
                <input name="quantity" required placeholder="Quantity (e.g., 20 kg)" className="p-2 border border-green-300 rounded-md" />
                <select name="type" required className="p-2 border border-green-300 rounded-md">
                  <option value="">Select Crop Type</option>
                  <option value="Vegetable">Vegetable</option>
                  <option value="Crop">Crop</option>
                  <option value="Dairy">Dairy</option>
                  <option value="Grocery">Grocery</option>
                </select>
                <input name="availability" required placeholder="Availability" className="p-2 border border-green-300 rounded-md" />
                <input name="regionPincodes" required placeholder="Region Pincodes (comma separated)" className="p-2 border border-green-300 rounded-md" />
                <input name="image" type="file" accept="image/*" className="col-span-1 md:col-span-3" />
                <button type="submit" className="col-span-1 md:col-span-3 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md">Add Crop</button>
              </form>

              {/* Crop Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {crops.map((crop) => (
                  <div key={crop._id} className="bg-white border border-green-200 p-4 rounded-lg shadow hover:shadow-md transition">
                    {crop.image && <img src={crop.image} alt={crop.name} className="w-full h-40 object-cover rounded mb-2" />}
                    <h3 className="text-lg font-bold text-green-700">{crop.name}</h3>
                    <p className="text-sm text-gray-600">Price: ₹{crop.price}</p>
                    <p className="text-sm text-gray-600">Quantity: {crop.quantity}</p>
                    <p className="text-sm text-gray-600">Type: {crop.type}</p>
                    <p className="text-sm text-gray-600">Availability: {crop.availability}</p>
                    <p className="text-sm text-gray-600">Regions: {crop.regionPincodes?.join(', ')}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Orders Section */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-green-800 mb-4">Orders Received</h2>
              {orders.length === 0 ? (
                <p>No orders received yet.</p>
              ) : (
                <table className="w-full border border-green-300 rounded-md text-left">
                  <thead className="bg-green-200">
                    <tr>
                      <th className="px-4 py-2 border border-green-300">Crop</th>
                      <th className="px-4 py-2 border border-green-300">Quantity</th>
                      <th className="px-4 py-2 border border-green-300">Buyer</th>
                      <th className="px-4 py-2 border border-green-300">Delivery Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order._id} className="even:bg-green-50">
                        <td className="px-4 py-2 border border-green-300">{order.cropName}</td>
                        <td className="px-4 py-2 border border-green-300">{order.quantity}</td>
                        <td className="px-4 py-2 border border-green-300">{order.buyerName}</td>
                        <td className="px-4 py-2 border border-green-300">{order.deliveryDate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </section>

            {/* Stats Section */}
            <section>
              <h2 className="text-2xl font-semibold text-green-800 mb-4">Statistics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded-lg shadow">
                  <h3 className="text-lg font-bold mb-2 text-green-700">Orders Over Time</h3>
                  <Bar data={ordersChartData} options={chartOptions} />
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <h3 className="text-lg font-bold mb-2 text-green-700">Earnings Over Time</h3>
                  <Bar data={earningsChartData} options={chartOptions} />
                </div>
              </div>
            </section>
          </>
        )}
      </div>
      <Footer />
    </>
  );
};



export default FarmerDashboard;
