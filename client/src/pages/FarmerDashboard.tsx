import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';

import DashboardSkeleton from '../components/skeletons/DashboardSkeleton';

import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { UserPlusIcon } from '@heroicons/react/24/outline';
import { User } from 'lucide-react';
import logo from '../assets/logo.png';
import Footer from '../components/Footer';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import NoOrderIcon from '../assets/icons/noOrders.svg';

const ScrollableSection: React.FC<{
  children: React.ReactNode;
  sectionId: string;
}> = ({ children, sectionId }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      const amount = scrollRef.current.clientWidth * 0.8;
      scrollRef.current.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative group">
      <button
        onClick={() => scroll('left')}
        aria-label="Scroll left"
        className="hidden group-hover:flex absolute left-0 top-1/2 transform -translate-y-1/2 bg-white/80 shadow-md hover:bg-white rounded-full z-10 p-2"
      >
        <ArrowLeft className="text-green-800 w-5 h-5" />
      </button>

      <div
        ref={scrollRef}
        id={sectionId}
        className="overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-hide flex gap-4 py-2 px-1"
      >
        {children}
      </div>

      <button
        onClick={() => scroll('right')}
        aria-label="Scroll right"
        className="hidden group-hover:flex absolute right-0 top-1/2 transform -translate-y-1/2 bg-white/80 shadow-md hover:bg-white rounded-full z-10 p-2"
      >
        <ArrowRight className="text-green-800 w-5 h-5" />
      </button>
    </div>
  );
};

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);
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
  buyer: {
    name: string;
    email: string;
  };
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  farmerId: string;
  address: string;
  phone: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  items: {
    _id: string;
    cropId: string;
    crop: { name: string };
    price: number;
    quantity: string;
    quantityInCart: number;
  }[];
  tax: number;
  deliveryFee: number;
  total: number;
  basePrice: number;
  fulfilled: boolean;
  fulfilledAt?: string | null;
}



interface StatsData {
  date: string;
  orders: number;
  earnings: number;
}
interface MostSoldCrop {
  cropName: string;
  totalSold: number;

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
    toast.success('Logged out successfully', {
      style: { background: '#14532d', color: 'white' },
    });
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
            <span className="hidden sm:flex font-semibold text-green-700 text-lg">
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
  const [currentMonthEarnings, setCurrentMonthEarnings] = useState(0);
  const [currentMonthOrders, setCurrentMonthOrders] = useState(0);
  const [mostSoldCrop, setMostSoldCrop] = useState<MostSoldCrop | null>(null);
  const [filterStatus, setFilterStatus] = useState<'pending' | 'completed'>('pending');

  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<StatsData[]>([]);
  const [weeklyEarnings, setWeeklyEarnings] = useState<number[]>([]);
  const [weeklyOrders, setWeeklyOrders] = useState<number[]>([]);
  const [weeklyLabels, setWeeklyLabels] = useState<string[]>([]);
  const [currentWeekEarnings, setCurrentWeekEarnings] = useState(0);
  const [currentWeekOrders, setCurrentWeekOrders] = useState(0);
  const [viewMode, setViewMode] = useState<'monthly' | 'weekly'>('monthly');
  const [orderGrowth, setOrderGrowth] = useState(0);
  const [earningsGrowth, setEarningsGrowth] = useState(0);

  const [loading, setLoading] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [cropToDelete, setCropToDelete] = useState<Crop | null>(null);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrderId((prevId) => (prevId === orderId ? null : orderId));
  };




  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = JSON.parse(localStorage.getItem('cropcartUser') || '{}')?.token;

        const [cropsRes, ordersRes, statsRes] = await Promise.all([
          fetch('https://crop-cart-backend.onrender.com/api/farmer/crops', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch('https://crop-cart-backend.onrender.com/api/farmer/orders', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch('https://crop-cart-backend.onrender.com/api/farmer/analytics', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);


        if (cropsRes.ok) {
          const cropsData = await cropsRes.json();
          setCrops(cropsData);
        }


        if (ordersRes.ok) {
          const ordersData = await ordersRes.json();

          const formattedOrders: Order[] = ordersData
            .map((order: any) => {
              const items = order.items
                .filter(
                  (item: any) =>
                    item.farmerId ===
                    JSON.parse(localStorage.getItem('cropcartUser') || '{}')?.user?.id
                )
                .map((item: any) => ({
                  _id: item._id,
                  cropId: item.cropId,
                  crop: { name: item.name },
                  price: item.price,
                  quantity: item.quantity,
                  quantityInCart: Number(item.quantityInCart),
                }));

              if (items.length === 0) return null;

              const basePrice = items.reduce(
                (total: number, item: any) =>
                  total + item.price * item.quantityInCart,
                0
              );

              const tax = parseFloat((basePrice * 0.18).toFixed(2));
              const deliveryFee = 50;
              const total = parseFloat((basePrice + tax + deliveryFee).toFixed(2));

              return {
                _id: order._id,
                buyer: { name: order.name, email: order.email },
                userId: {
                  _id: order.userId?._id || '',
                  name: order.userId?.name || '',
                  email: order.userId?.email || '',
                },
                farmerId: order.farmerId,
                address: order.address,
                phone: order.phone,
                email: order.email,
                createdAt: order.createdAt,
                updatedAt: order.updatedAt,
                items,
                tax,
                deliveryFee,
                total,
                basePrice,
                fulfilled: order.fulfilled || false,
                fulfilledAt: order.fulfilledAt || null,
              };
            })
            .filter((order: any) => order !== null);

          setOrders(formattedOrders);
        }



        if (statsRes.ok) {
          const statsData = await statsRes.json();

          setCurrentMonthEarnings(statsData.currentMonthEarnings);
          setCurrentMonthOrders(statsData.currentMonthOrders);

          const currentMonthIndex = new Date().getMonth();
          const lastMonthIndex = currentMonthIndex - 1;

          const lastMonthOrders =
            lastMonthIndex >= 0 ? statsData.monthlyOrders[lastMonthIndex] : 0;
          const lastMonthEarnings =
            lastMonthIndex >= 0 ? statsData.monthlyEarnings[lastMonthIndex] : 0;

          const orderPercentChange =
            lastMonthOrders === 0
              ? statsData.currentMonthOrders > 0 ? 100 : 0
              : ((statsData.currentMonthOrders - lastMonthOrders) / lastMonthOrders) * 100;

          const earningsPercentChange =
            lastMonthEarnings === 0
              ? statsData.currentMonthEarnings > 0 ? 100 : 0
              : ((statsData.currentMonthEarnings - lastMonthEarnings) / lastMonthEarnings) * 100;

          const orderChangeRounded = Math.round(orderPercentChange * 10) / 10;
          const earningsChangeRounded = Math.round(earningsPercentChange * 10) / 10;

          setOrderGrowth(orderChangeRounded);
          setEarningsGrowth(earningsChangeRounded);

          const totalWeeklyEarnings = statsData.weeklyEarnings.reduce((sum: number, val: number) => sum + val, 0);
          const totalWeeklyOrders = statsData.weeklyOrders.reduce((sum: number, val: number) => sum + val, 0);

          setCurrentWeekEarnings(totalWeeklyEarnings);
          setCurrentWeekOrders(totalWeeklyOrders);

          const labels = viewMode === 'weekly'
            ? statsData.weeklyLabels
            : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

          const statsFormatted = labels.map((label: string, idx: number) => ({
            date: label,
            earnings: viewMode === 'weekly' ? statsData.weeklyEarnings[idx] : statsData.monthlyEarnings[idx],
            orders: viewMode === 'weekly' ? statsData.weeklyOrders[idx] : statsData.monthlyOrders[idx],
          }));

          setStats(statsFormatted);
          setWeeklyLabels(statsData.weeklyLabels || []);
          setWeeklyEarnings(statsData.weeklyEarnings || []);
          setWeeklyOrders(statsData.weeklyOrders || []);
          setMostSoldCrop(statsData.mostSoldCrop || null);

        }
      } catch (error) {
        toast.error('Failed to fetch data', {
          style: { background: '#14532d', color: 'white' },
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  const chartLabels = viewMode === 'monthly'
    ? stats.map((item) => item.date)
    : weeklyLabels;

  const earningsData = viewMode === 'monthly'
    ? stats.map((item) => item.earnings)
    : weeklyEarnings;

  const ordersData = viewMode === 'monthly'
    ? stats.map((item) => item.orders)
    : weeklyOrders;

  const ordersChartData = {
    labels: chartLabels,
    datasets: [
      {
        label: 'Orders',
        data: ordersData,
        borderColor: '#34d399',
        backgroundColor: '#34d399',
        fill: false,
        tension: 0.4,
      },
    ],

  };

  const earningsChartData = {
    labels: chartLabels,
    datasets: [
      {
        label: 'Earnings (₹)',
        data: earningsData,
        borderColor: '#34d399',
        backgroundColor: '#34d399',
        fill: false,
        tension: 0.4,
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
          label: (ctx: any) => {
            const label = ctx.dataset.label || '';
            const value = ctx.parsed.y;
            return label.includes('Earnings') ? `${label}: ₹${value}` : `${label}: ${value}`;
          },
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

  const filteredOrders = orders.filter((order) =>
    filterStatus === 'completed' ? order.fulfilled : !order.fulfilled
  );
  const [currentPage, setCurrentPage] = useState(1);
  const ORDERS_PER_PAGE = 5;

  const totalPages = Math.ceil(filteredOrders.length / ORDERS_PER_PAGE);

  const paginatedOrders = [...filteredOrders].reverse().slice(
    (currentPage - 1) * ORDERS_PER_PAGE,
    currentPage * ORDERS_PER_PAGE
  );




  return (
    <>
      <Navbar />
      <div className="min-h-screen sm:p-28 bg-green-50">
        <h1 className="text-2xl sm:text-4xl font-bold text-green-900 mb-2 sm:mb-4 px-4 sm:px-4 pb-2 sm:pb-0 pt-10 sm:pt-0 font-heading">Farmer Dashboard</h1>

        {loading ? (
          <DashboardSkeleton />
        ) : (
          <>
            <div className="grid grid-cols-6 gap-6 text-white p-4 sm:px-4">

              <div className="col-span-3 row-span-2 bg-gradient-to-br from-green-900 to-emerald-800 rounded-2xl p-3 sm:p-6 shadow-xl flex flex-col justify-between hover:scale-[1.02] transition">
                <div className="flex items-center  sm:justify-between">
                  <h3 className="text-lg sm:text-xl font-semibold">This Month's Earnings</h3>

                </div>
                <p className="text-2xl sm:text-4xl font-bold mt-2">₹<CountUp end={currentMonthEarnings} decimals={2} duration={1.5} /></p>
                <p
                  className={`text-sm mt-3 font-medium ${earningsGrowth > 0
                    ? 'text-lime-100'
                    : earningsGrowth < 0
                      ? 'text-red-200'
                      : 'text-white/90'
                    }`}
                >
                  {earningsGrowth > 0
                    ? `↑ ${Math.abs(earningsGrowth)}% from last month`
                    : earningsGrowth < 0
                      ? `↓ ${Math.abs(earningsGrowth)}% from last month`
                      : `→ 0% change from last month`}
                </p>
              </div>

              {/* Orders */}
              <div className="col-span-3 row-span-2 bg-gradient-to-br from-green-900 to-emerald-800 rounded-2xl p-4 sm:p-6 shadow-xl flex flex-col justify-between hover:scale-[1.02] transition">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg sm:text-xl font-semibold">This Month's Orders</h3>

                </div>
                <p className="text-2xl sm:text-4xl font-bold mt-2"><CountUp end={currentMonthOrders} duration={1.5} /></p>
                <p
                  className={`text-sm mt-3 font-medium ${orderGrowth > 0
                    ? 'text-lime-100'
                    : orderGrowth < 0
                      ? 'text-red-200'
                      : 'text-white/90'
                    }`}
                >
                  {orderGrowth > 0
                    ? `↑ ${Math.abs(orderGrowth)}% from last month`
                    : orderGrowth < 0
                      ? `↓ ${Math.abs(orderGrowth)}% from last month`
                      : `→ 0% change from last month`}
                </p>
              </div>

              {/* Most Sold Crop */}
              <div className="col-span-6 row-span-2 bg-gradient-to-br from-green-900 to-emerald-800 rounded-2xl p-4 sm:p-6 shadow-xl flex flex-col justify-between hover:scale-[1.02] transition">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg sm:text-xl font-semibold">Most Sold Crop</h3>

                </div>
                <div className="text-center">
                  {mostSoldCrop ? (
                    <>
                      <p className="text-3xl font-bold">{mostSoldCrop.cropName}</p>
                      <p className="text-sm mt-3 font-medium text-lime-100">Sold {mostSoldCrop.totalSold} times</p>
                    </>
                  ) : (
                    <p className="text-green-100">No crop sales data yet.</p>
                  )}
                </div>
              </div>
            </div>





            {/* Crops Section */}
            <section className="my-10 sm:px-4 ">
              <h2 className="text-xl sm:text-2xl font-semibold text-green-800 mb-2 sm:mb-4 px-4 sm:px-0 font-heading">Your Products</h2>

              {/* Crop Cards */}
              <ScrollableSection sectionId="crops-section">
                {[...crops].reverse().map((crop) => (
                  <div
                    key={crop._id}
                    className="first:ml-4 snap-start bg-white border border-2 border-green-900/60 sm:border sm:border-green-800/20 p-4 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col w-60 flex-shrink-0 "
                    style={{ maxWidth: '240px' }}
                  >
                    {crop.image && (
                      <img
                        src={crop.image}
                        alt={crop.name}
                        className="w-full h-28 sm:h-36 object-cover rounded-xl mb-3 border border-gray-100"
                      />
                    )}

                    <h3 className="text-md sm:text-lg font-semibold text-green-800 mb-1 truncate">{crop.name}</h3>

                    <div className="text-xs sm:text-sm text-gray-600 space-y-1 mb-3">
                      <p><span className="font-medium text-gray-700">Price:</span> ₹{crop.price}</p>
                      <p><span className="font-medium text-gray-700">Quantity:</span> {crop.quantity}</p>
                      <p><span className="font-medium text-gray-700">Type:</span> {crop.type}</p>
                      <p><span className="font-medium text-gray-700">Availability:</span> {crop.availability}</p>
                      <p className="truncate">
                        <span className="font-medium text-gray-700">Regions:</span> {crop.regionPincodes?.join(', ')}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setCropToDelete(crop);
                        setDeleteModalOpen(true);
                      }}
                      className="mt-auto bg-red-600 hover:bg-red-700 text-white py-2 rounded-xl text-xs sm:text-sm font-medium transition"
                    >
                      Remove
                    </button>
                  </div>

                ))}
              </ScrollableSection>



              <div className='px-4 sm:px-0'>
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
                      toast.error('Image upload failed', {
                        style: { background: '#14532d', color: 'white' },
                      });
                      return;
                    }

                    const address = formData.get('location') as string;
                    let latitude = null;
                    let longitude = null;

                    try {
                      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

                      const geocodeRes = await fetch(
                        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
                          address
                        )}&key=${apiKey}`
                      );

                      const geocodeData = await geocodeRes.json();
                      console.log('Geocode response:', geocodeData);

                      if (
                        geocodeData.status === 'OK' &&
                        geocodeData.results &&
                        geocodeData.results.length > 0
                      ) {
                        latitude = geocodeData.results[0].geometry.location.lat;
                        longitude = geocodeData.results[0].geometry.location.lng;
                      } else {
                        throw new Error('Invalid location');
                      }
                    } catch (error) {
                      console.error('Geocoding Error:', error);
                      toast.error('Failed to fetch coordinates for location', {
                        style: { background: '#14532d', color: 'white' },
                      });
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
                      location: {
                        latitude: Number(latitude),
                        longitude: Number(longitude),
                      },
                    };

                    const token = JSON.parse(localStorage.getItem('cropcartUser') || '{ }')?.token;

                    const res = await fetch('https://crop-cart-backend.onrender.com/api/farmer/crops', {
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
                      toast.success('Crop added successfully', {
                        style: { background: '#14532d', color: 'white' },
                      });
                    } else {
                      toast.error('Failed to add crop', {
                        style: { background: '#14532d', color: 'white' },
                      });
                    }
                  }}
                  className="bg-white p-8 sm:p-10 rounded-3xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 shadow-xl  
                  border border-2 border-green-900/60 sm:border sm:border-green-800/20 mt-8 transition-all"
                >
                  <h2 className="col-span-full text-2xl font-bold text-green-800 tracking-tight">Add New Product</h2>

                  <input
                    name="name"
                    required
                    placeholder="Crop Name"
                    className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-green-600 focus:outline-none transition"
                  />
                  <input
                    name="price"
                    type="number"
                    required
                    placeholder="Price (₹)"
                    className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-green-600 focus:outline-none transition"
                  />
                  <input
                    name="quantity"
                    required
                    placeholder="Quantity (e.g., 20 kg)"
                    className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-green-600 focus:outline-none transition"
                  />

                  <select
                    name="type"
                    required
                    className="w-full border border-gray-300 rounded-xl p-3 text-sm text-gray-700 bg-white focus:ring-2 focus:ring-green-600 focus:outline-none transition"
                  >
                    <option value="" disabled>Select Crop Type</option>
                    <option value="crop">Crop</option>
                    <option value="dairy">Dairy</option>
                    <option value="grocery">Grocery</option>
                    <option value="spice">Spice</option>
                    <option value="vegetable">Vegetable</option>
                    <option value="fruit">Fruit</option>
                  </select>

                  <input
                    name="availability"
                    required
                    placeholder="Availability"
                    className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-green-600 focus:outline-none transition"
                  />
                  <input
                    name="regionPincodes"
                    required
                    placeholder="Region Pincodes (comma separated)"
                    className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-green-600 focus:outline-none transition"
                  />

                  <input
                    name="location"
                    required
                    placeholder="Crop Location (Full Address)"
                    className="w-full col-span-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-green-600 focus:outline-none transition"
                  />

                  <div className="flex flex-col col-span-full sm:col-span-1">

                    <div className="relative group">
                      <input
                        id="image-upload"
                        name="image"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const fileName = e.target.files?.[0]?.name;
                          const label = document.getElementById('file-name-label');
                          if (label && fileName) label.textContent = fileName;
                        }}
                      />
                      <label
                        htmlFor="image-upload"
                        className="flex items-center gap-2 w-full py-3  text-black font-semibold rounded-xl hover:text-green-900 transition-all duration-200 ease-in-out cursor-pointer"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12V4m0 0L8 8m4-4l4 4"
                          />
                        </svg>
                        <span>Upload Image</span>
                      </label>
                      <span id="file-name-label" className="block text-sm text-gray-500 truncate"></span>
                    </div>
                  </div>

                  <div className="col-span-full sm:col-span-1 flex items-end">
                    <button
                      type="submit"
                      className="w-full bg-gradient-to-br from-green-900 to-emerald-800 rounded-xl text-white py-3 text-base font-semibold shadow-md hover:shadow-lg hover:from-green-800 hover:to-emerald-700 transition duration-300"
                    >
                      Add Product
                    </button>
                  </div>
                </form>

              </div>





            </section>

            {/* Orders Section */}
            <section className="mb-10 px-4 sm:px-4 lg:px-4">
              <h2 className="text-xl sm:text-2xl font-semibold text-green-800 mb-4 font-heading">
                Orders Received
              </h2>

              <div className="flex mb-6 mt-4 gap-4">
                <button
                  onClick={() => setFilterStatus('pending')}
                  className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-semibold text-sm sm:text-base ${filterStatus === 'pending'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-700'
                    }`}
                >
                  Pending
                </button>
                <button
                  onClick={() => setFilterStatus('completed')}
                  className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-semibold text-sm sm:text-base ${filterStatus === 'completed'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-700'
                    }`}
                >
                  Completed
                </button>
              </div>

              {filteredOrders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <img src={NoOrderIcon} alt="No orders" className="w-32 h-32 mb-4 opacity-70" />
                  <p className="text-gray-600 text-sm sm:text-base font-medium">
                    No {filterStatus} orders found.
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 gap-6">
                    {paginatedOrders.map((order, index) => {
                      const isExpanded = expandedOrderId === order._id;

                      return (
                        <motion.div
                          key={order._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.08 }}
                          onClick={() => toggleOrderDetails(order._id)}
                          className="relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 sm:p-6 
                shadow hover:shadow-lg transition-all duration-300 cursor-pointer border-2 border-green-900/60 sm:border-green-800/20"
                        >

                          <span
                            className={`absolute top-2 right-2 text-xs px-2 py-1 rounded-full font-semibold ${order.fulfilled
                              ? 'bg-green-100 text-green-700'
                              : 'bg-yellow-100 text-yellow-800'
                              }`}
                          >
                            {order.fulfilled ? 'Completed' : 'Pending'}
                          </span>


                          <div className="flex flex-col sm:flex-row sm:justify-between mt-4 gap-2">
                            <div>
                              <p className="text-xs sm:text-sm text-gray-500">Order ID:</p>
                              <p className="text-base sm:text-lg font-semibold text-green-800 dark:text-green-300 break-all mb-2">
                                {order._id}
                              </p>
                              <p className="text-sm sm:text-base mb-2">
                                <span className="font-medium">Buyer:</span> {order.buyer?.name}
                              </p>
                              <p className="text-sm sm:text-base break-all">
                                <span className="font-medium">Email:</span> {order.buyer?.email}
                              </p>
                            </div>
                            <div className="text-left sm:text-right">
                              <p className="text-xs sm:text-sm text-gray-500">Placed on</p>
                              <p className="text-sm sm:text-base font-medium">
                                {new Date(order.createdAt).toLocaleString('en-GB')}
                              </p>
                              {order.fulfilled && order.fulfilledAt && (
                                <>
                                  <p className="text-xs sm:text-sm text-gray-500 mt-1">Delivered on</p>
                                  <p className="text-sm sm:text-base font-medium">
                                    {new Date(order.fulfilledAt).toLocaleString('en-GB')}
                                  </p>
                                </>
                              )}
                            </div>
                          </div>


                          <div
                            className={`transition-all duration-500 ease-in-out overflow-hidden ${isExpanded ? 'max-h-[9999px] opacity-100 mt-4' : 'max-h-0 opacity-0'
                              }`}
                          >
                            {order.address && (
                              <p className="text-sm mb-2 break-words">
                                <span className="font-medium">Delivery Address:</span> {order.address}
                              </p>
                            )}
                            {order.phone && (
                              <p className="text-sm mb-2">
                                <span className="font-medium">Phone:</span> {order.phone}
                              </p>
                            )}


                            <div className="mb-4">
                              <p className="font-medium text-sm mb-1">Items:</p>
                              <ul className="list-disc ml-5 space-y-1 text-sm">
                                {order.items.map((item, idx) => (
                                  <li key={idx}>
                                    <span className="font-medium">{item.crop?.name || 'Unknown Crop'}</span> —{' '}
                                    {item.quantityInCart} ({item.quantity}) × ₹
                                    {item.price.toFixed(2)} = ₹
                                    {(item.price * item.quantityInCart).toFixed(2)}
                                  </li>
                                ))}
                              </ul>
                            </div>


                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                              <div>
                                <p className="text-gray-500">Order Price</p>
                                <p className="font-semibold">₹{order.basePrice.toFixed(2)}</p>
                              </div>
                              <div>
                                <p className="text-gray-500">Tax</p>
                                <p className="font-semibold">₹{order.tax.toFixed(2)}</p>
                              </div>
                              <div className="hidden md:block"></div>
                              <div>
                                <p className="text-gray-500">Total</p>
                                <p className="font-bold text-green-700 dark:text-green-300">
                                  ₹{(order.basePrice + order.tax).toFixed(2)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>


                  {totalPages > 1 && (
                    <div className="flex  mt-4 gap-1 sm:gap-3">
                      <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-1.5 text-xs sm:text-sm bg-gray-200 text-gray-800 rounded hover:bg-green-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>

                      <span className="px-3 py-1 text-xs sm:text-sm font-medium text-gray-700">
                        Page {currentPage} of {totalPages}
                      </span>
                      <button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-1.5 text-xs sm:text-sm bg-gray-200 text-gray-800 rounded hover:bg-green-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              )}
            </section>






            <section className='px-4 sm:px-4'>
              <h2 className="text-xl sm:text-2xl font-semibold text-green-800 mb-4 font-heading">Statistics</h2>


              <div className="flex justify-start mb-4">
                <button
                  onClick={() => setViewMode('monthly')}
                  className={`px-3 py-1.5 text-sm sm:px-4 sm:py-2 sm:text-base mr-2 rounded ${viewMode === 'monthly' ? 'bg-green-600 text-white' : 'bg-gray-200'
                    }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setViewMode('weekly')}
                  className={`px-3 py-1.5 text-sm sm:px-4 sm:py-2 sm:text-base rounded ${viewMode === 'weekly' ? 'bg-green-600 text-white' : 'bg-gray-200'
                    }`}
                >
                  Weekly
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-2 border-green-900/60 sm:border sm:border-green-800/20  bg-white p-4 rounded-lg shadow">
                  <div className="flex-1 bg-green-100 p-6 rounded-lg shadow-md flex flex-col justify-center items-center mb-6 sm:mb-10">
                    <h3 className="text-lg sm:text-xl font-bold text-green-900 mb-2">
                      Earnings This {viewMode === 'weekly' ? 'Week' : 'Month'}
                    </h3>
                    <p className="text-3xl sm:text-4xl font-extrabold text-green-800">
                      ₹{(viewMode === 'weekly' ? currentWeekEarnings : currentMonthEarnings).toLocaleString()}
                    </p>
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-green-700">Earnings Over Time</h3>
                  <Line data={earningsChartData} options={chartOptions} />
                </div>

                <div className="bg-white border border-2 border-green-900/60 sm:border sm:border-green-800/20 p-4 rounded-lg shadow mb-10 sm:mb-0">
                  <div className="flex-1 bg-green-100 p-6 rounded-lg shadow-md flex flex-col justify-center items-center mb-6 sm:mb-10">
                    <h3 className="text-lg sm:text-xl font-bold text-green-900 mb-2">
                      Orders This {viewMode === 'weekly' ? 'Week' : 'Month'}
                    </h3>
                    <p className="text-3xl sm:text-4xl font-extrabold text-green-800">
                      {viewMode === 'weekly' ? currentWeekOrders : currentMonthOrders}
                    </p>
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-green-700">Orders Over Time</h3>
                  <Line data={ordersChartData} options={chartOptions} />
                </div>
              </div>

            </section>

          </>
        )}
      </div >
      <Footer />
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={async () => {
          if (!cropToDelete) return;

          try {
            const token = JSON.parse(localStorage.getItem('cropcartUser') || '{}')?.token;

            const res = await fetch(`https://crop-cart-backend.onrender.com/api/farmer/crops/${cropToDelete._id}`, {
              method: 'DELETE',
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            if (res.ok) {
              setCrops((prev) => prev.filter((c) => c._id !== cropToDelete._id));
              toast.success('Crop deleted successfully', {
                style: { background: '#14532d', color: 'white' },
              });
            } else {
              const errorData = await res.json();
              toast.error(`Failed to delete crop: ${errorData.message || res.statusText}`, {
                style: { background: '#14532d', color: 'white' },
              });
            }
          } catch (error) {
            toast.error('Failed to delete crop', {
              style: { background: '#14532d', color: 'white' },
            });
          } finally {
            setDeleteModalOpen(false);
            setCropToDelete(null);
          }
        }}
        cropName={cropToDelete?.name || ''}
      />

    </>
  );
};



export default FarmerDashboard;

