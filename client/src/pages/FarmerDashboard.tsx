import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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
  ArcElement,
  Filler,
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
  const [memberSinceIso, setMemberSinceIso] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [cropToDelete, setCropToDelete] = useState<Crop | null>(null);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [editingCrop, setEditingCrop] = useState<Crop | null>(null);

  const [productSearch, setProductSearch] = useState('');
  const [productTypeFilter, setProductTypeFilter] = useState('');
  const previousOrderCount = useRef<number>(0);

  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrderId((prevId) => (prevId === orderId ? null : orderId));
  };

  useEffect(() => {
    let userId: string | null = null;
    let createdAt: string | null = null;
    try {
      const raw = localStorage.getItem('cropcartUser');
      if (raw) {
        const parsed = JSON.parse(raw);
        userId = parsed?.user?.id || null;
        createdAt = parsed?.user?.createdAt || parsed?.user?.created_at || parsed?.user?.createdOn || null;
      }
    } catch {
    }

    const key = userId ? `cropcartMemberSince_${userId}` : 'cropcartMemberSince';
    const existing = localStorage.getItem(key);
    if (existing) {
      setMemberSinceIso(existing);
      return;
    }

    const iso = createdAt ? new Date(createdAt).toISOString() : new Date().toISOString();
    localStorage.setItem(key, iso);
    setMemberSinceIso(iso);
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowAddProductModal(false);
        setShowEditProductModal(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);




  useEffect(() => {
    document.title = 'Farmer Dashboard | CropCart';
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
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchOrders = useCallback(async () => {
    try {
      const token = JSON.parse(localStorage.getItem('cropcartUser') || '{}')?.token;
      const ordersRes = await fetch('https://crop-cart-backend.onrender.com/api/farmer/orders', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        const farmerId = JSON.parse(localStorage.getItem('cropcartUser') || '{}')?.user?.id;
        const formattedOrders: Order[] = ordersData
          .map((order: any) => {
            const items = order.items
              .filter((item: any) => item.farmerId === farmerId)
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
              (total: number, item: any) => total + item.price * item.quantityInCart, 0
            );
            const tax = parseFloat((basePrice * 0.18).toFixed(2));
            const deliveryFee = 50;
            const total = parseFloat((basePrice + tax + deliveryFee).toFixed(2));
            return {
              _id: order._id,
              buyer: { name: order.name, email: order.email },
              userId: { _id: order.userId?._id || '', name: order.userId?.name || '', email: order.userId?.email || '' },
              farmerId: order.farmerId,
              address: order.address,
              phone: order.phone,
              email: order.email,
              createdAt: order.createdAt,
              updatedAt: order.updatedAt,
              items, tax, deliveryFee, total, basePrice,
              fulfilled: order.fulfilled || false,
              fulfilledAt: order.fulfilledAt || null,
            };
          })
          .filter((order: any) => order !== null);

        const prevCount = previousOrderCount.current;
        if (prevCount > 0 && formattedOrders.length > prevCount) {
          const newCount = formattedOrders.length - prevCount;
          toast.success(`You have ${newCount} new order${newCount > 1 ? 's' : ''}!`, {
            style: { background: '#14532d', color: 'white' },
            icon: '🔔',
          });
        }
        previousOrderCount.current = formattedOrders.length;
        setOrders(formattedOrders);
      }
    } catch {
    }
  }, []);

  useEffect(() => {
    previousOrderCount.current = orders.length;
    const interval = setInterval(fetchOrders, 60000);
    return () => clearInterval(interval);
  }, [fetchOrders, orders.length]);


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


  const lifetimeEarnings = orders.reduce((sum, order) => sum + order.basePrice, 0);
  const memberSinceLabel = memberSinceIso
    ? new Date(memberSinceIso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    : '—';

  const filteredCrops = crops.filter((crop) => {
    const matchesSearch = crop.name.toLowerCase().includes(productSearch.toLowerCase());
    const matchesType = productTypeFilter === '' || crop.type === productTypeFilter;
    return matchesSearch && matchesType;
  });
  const cropTypes = [...new Set(crops.map((c) => c.type))];

  const revenuePerType: Record<string, number> = {};
  orders.forEach((order) => {
    order.items.forEach((item) => {
      const cropMatch = crops.find((c) => c._id === item.cropId);
      const type = cropMatch?.type || 'Other';
      revenuePerType[type] = (revenuePerType[type] || 0) + item.price * item.quantityInCart;
    });
  });
  const donutColors = ['#065f46', '#047857', '#10b981', '#34d399', '#6ee7b7', '#a7f3d0', '#d1fae5'];
  const donutChartData = {
    labels: Object.keys(revenuePerType),
    datasets: [{
      data: Object.values(revenuePerType),
      backgroundColor: donutColors.slice(0, Object.keys(revenuePerType).length),
      borderWidth: 2,
      borderColor: '#fff',
    }],
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.setTextColor(6, 95, 70);
    doc.text('CropCart — Farm Report', 14, 20);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on ${new Date().toLocaleString()}`, 14, 28);

    doc.setFontSize(13);
    doc.setTextColor(0);
    doc.text('Summary', 14, 40);
    doc.setFontSize(11);
    doc.text(`Total Products: ${crops.length}`, 14, 48);
    doc.text(`Total Orders: ${orders.length}`, 14, 55);
    doc.text(`Lifetime Earnings: ₹${lifetimeEarnings.toLocaleString()}`, 14, 62);
    doc.text(`This Month Earnings: ₹${currentMonthEarnings.toLocaleString()}`, 14, 69);
    doc.text(`This Month Orders: ${currentMonthOrders}`, 14, 76);

    if (orders.length > 0) {
      doc.setFontSize(13);
      doc.text('Orders', 14, 90);
      autoTable(doc, {
        startY: 95,
        head: [['Order ID', 'Buyer', 'Items', 'Base Price', 'Status', 'Date']],
        body: orders.map((o) => [
          o._id.slice(-8),
          o.buyer?.name || 'N/A',
          o.items.map((i) => i.crop?.name).join(', '),
          `₹${o.basePrice.toFixed(2)}`,
          o.fulfilled ? 'Completed' : 'Pending',
          new Date(o.createdAt).toLocaleDateString(),
        ]),
        styles: { fontSize: 8 },
        headStyles: { fillColor: [6, 95, 70] },
      });
    }

    doc.save('CropCart_Farm_Report.pdf');
    toast.success('Report downloaded!', { style: { background: '#14532d', color: 'white' }, icon: '📄' });
  };

  const TrendArrow = ({ value }: { value: number }) => {
    if (value > 0) return (
      <svg className="inline w-4 h-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L10 6.414l-3.293 3.293a1 1 0 01-1.414 0z" clipRule="evenodd" />
      </svg>
    );
    if (value < 0) return (
      <svg className="inline w-4 h-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L10 13.586l3.293-3.293a1 1 0 011.414 0z" clipRule="evenodd" />
      </svg>
    );
    return (
      <svg className="inline w-4 h-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
      </svg>
    );
  };



  const handleEditProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingCrop) return;
    const form = e.currentTarget;
    const formData = new FormData(form);
    const imageFile = formData.get('image') as File | null;

    let imageUrl = editingCrop.image || '';
    try {
      if (imageFile && imageFile.name && imageFile.size > 0) {
        imageUrl = await uploadImageToCloudinary(imageFile);
      }
    } catch {
      toast.error('Image upload failed', { style: { background: '#14532d', color: 'white' } });
      return;
    }

    const updatedCrop = {
      name: formData.get('name'),
      price: Number(formData.get('price')),
      quantity: formData.get('quantity'),
      type: formData.get('type'),
      availability: formData.get('availability'),
      regionPincodes: (formData.get('regionPincodes') as string).split(',').map((p) => p.trim()),
      image: imageUrl,
    };

    const token = JSON.parse(localStorage.getItem('cropcartUser') || '{}')?.token;
    try {
      const res = await fetch(`https://crop-cart-backend.onrender.com/api/farmer/crops/${editingCrop._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(updatedCrop),
      });
      if (res.ok) {
        const updated = await res.json();
        setCrops((prev) => prev.map((c) => c._id === editingCrop._id ? { ...c, ...updated } : c));
        setShowEditProductModal(false);
        setEditingCrop(null);
        toast.success('Product updated!', { style: { background: '#14532d', color: 'white' } });
      } else {
        toast.error('Failed to update product', { style: { background: '#14532d', color: 'white' } });
      }
    } catch {
      toast.error('Failed to update product', { style: { background: '#14532d', color: 'white' } });
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen sm:p-28 bg-green-50">
        <div className="px-4 sm:px-4 pb-4 sm:pb-0 pt-10 sm:pt-0 mb-10">
          <h1 className="text-2xl sm:text-4xl font-bold text-green-900 font-heading">Farmer Dashboard</h1>
          <p className="text-sm sm:text-base text-gray-500 mt-1">Manage your products, track orders, and monitor performance</p>
        </div>

        {loading ? (
          <DashboardSkeleton />
        ) : (
          <>


            <div className="grid grid-cols-3 gap-3 sm:gap-4 px-4 sm:px-4 mb-6">
              <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow duration-300">
                <p className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-widest font-semibold">Products</p>
                <p className="text-2xl sm:text-3xl font-extrabold text-green-800 mt-1.5">{crops.length}</p>
              </div>
              <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow duration-300">
                <p className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-widest font-semibold">Lifetime Earnings</p>
                <p className="text-2xl sm:text-3xl font-extrabold text-green-800 mt-1.5">₹{lifetimeEarnings.toLocaleString()}</p>
              </div>
              <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow duration-300">
                <p className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-widest font-semibold">Member Since</p>
                <p className="text-2xl sm:text-3xl font-extrabold text-green-800 mt-1.5">{memberSinceLabel}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 text-white p-4 sm:px-4">
              <div className="col-span-1 bg-gradient-to-br from-green-900 via-green-800 to-emerald-700 rounded-2xl p-4 sm:p-6 shadow-xl relative overflow-hidden hover:shadow-2xl transition-all duration-300">
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/5 rounded-full" />
                <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-white/5 rounded-full" />
                <p className="text-xs sm:text-sm font-medium text-green-200 uppercase tracking-wider">Monthly Earnings</p>
                <p className="text-2xl sm:text-4xl font-bold mt-2">₹<CountUp key={`earn-${viewMode}`} end={currentMonthEarnings} decimals={2} duration={1.5} /></p>
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
                  <TrendArrow value={earningsGrowth} />
                </p>
              </div>


              <div className="col-span-1 bg-gradient-to-br from-emerald-800 via-teal-700 to-cyan-800 rounded-2xl p-4 sm:p-6 shadow-xl relative overflow-hidden hover:shadow-2xl transition-all duration-300">
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/5 rounded-full" />
                <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-white/5 rounded-full" />
                <p className="text-xs sm:text-sm font-medium text-emerald-200 uppercase tracking-wider">Monthly Orders</p>
                <p className="text-2xl sm:text-4xl font-bold mt-2"><CountUp key={`ord-${viewMode}`} end={currentMonthOrders} duration={1.5} /></p>
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
                  <TrendArrow value={orderGrowth} />
                </p>
              </div>


              <div className="col-span-2 lg:col-span-1 bg-gradient-to-br from-amber-700 via-orange-700 to-yellow-800 rounded-2xl p-4 sm:p-6 shadow-xl relative overflow-hidden hover:shadow-2xl transition-all duration-300">
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/5 rounded-full" />
                <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-white/5 rounded-full" />
                <p className="text-xs sm:text-sm font-medium text-amber-200 uppercase tracking-wider">Best Seller</p>
                {mostSoldCrop ? (
                  <>
                    <p className="text-2xl sm:text-3xl font-bold mt-2">{mostSoldCrop.cropName}</p>
                    <p className="text-xs sm:text-sm mt-3 font-medium text-amber-100">Sold {mostSoldCrop.totalSold} times</p>
                  </>
                ) : (
                  <p className="text-amber-100 mt-2 text-sm">No crop sales data yet.</p>
                )}
              </div>
            </div>

            <section className="my-10 sm:px-4">
              <div className="flex items-center justify-between px-4 sm:px-0 mb-4">
                <h2 className="text-xl sm:text-2xl font-semibold text-green-800 font-heading">Your Products</h2>
                <button
                  onClick={() => setShowAddProductModal(true)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-700 to-emerald-600 text-white rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl hover:from-green-600 hover:to-emerald-500 transition-all duration-300"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                  Add Product
                </button>
              </div>

              {crops.length > 0 && (
                <div className="flex flex-wrap gap-3 px-4 sm:px-0 mb-4">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="flex-1 min-w-[180px] border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none bg-white"
                  />
                  <select
                    value={productTypeFilter}
                    onChange={(e) => setProductTypeFilter(e.target.value)}
                    className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none bg-white text-gray-700"
                  >
                    <option value="">All Types</option>
                    {cropTypes.map((t) => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                  </select>
                </div>
              )}


              {crops.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center px-4">
                  <div className="w-32 h-32 mb-4 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-16 h-16 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">No products yet</h3>
                  <p className="text-gray-500 text-sm mb-4">Start by adding your first product to your store.</p>
                  <button
                    onClick={() => setShowAddProductModal(true)}
                    className="px-6 py-2.5 bg-gradient-to-r from-green-700 to-emerald-600 text-white rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl transition-all"
                  >
                    + Add Your First Product
                  </button>
                </div>
              ) : (
                <ScrollableSection sectionId="crops-section">
                  {[...filteredCrops].reverse().map((crop) => (
                    <div
                      key={crop._id}
                      className="first:ml-4 snap-start bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col w-64 flex-shrink-0 group overflow-hidden"
                    >
                      {crop.image ? (
                        <div className="overflow-hidden">
                          <img
                            src={crop.image}
                            alt={crop.name}
                            className="w-full h-36 sm:h-40 object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                      ) : (
                        <div className="w-full h-36 sm:h-40 bg-gradient-to-br from-green-100 to-emerald-50 flex items-center justify-center">
                          <svg className="w-12 h-12 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                        </div>
                      )}

                      <div className="p-4 flex flex-col flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-base font-bold text-gray-900 truncate flex-1 mr-2">{crop.name}</h3>
                          <p className="text-lg font-extrabold text-green-700 whitespace-nowrap">₹{crop.price}</p>
                        </div>

                        <div className="flex items-center gap-1.5 mb-3">
                          <span className="text-[10px] uppercase tracking-wider font-semibold text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-md">{crop.type}</span>
                          <span className="text-[10px] uppercase tracking-wider font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">{crop.availability}</span>
                        </div>

                        <div className="text-xs text-gray-500 space-y-1 mb-4">
                          <p>Qty: <span className="font-semibold text-gray-700">{crop.quantity}</span></p>
                          <p className="truncate">Regions: <span className="font-semibold text-gray-700">{crop.regionPincodes?.join(', ')}</span></p>
                        </div>

                        <div className="mt-auto flex gap-2">
                          <button
                            onClick={() => {
                              setEditingCrop(crop);
                              setShowEditProductModal(true);
                            }}
                            className="flex-1 bg-green-50 hover:bg-green-100 text-green-700 py-2 rounded-lg text-xs font-semibold transition-all border border-green-200 hover:border-green-300"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              setCropToDelete(crop);
                              setDeleteModalOpen(true);
                            }}
                            className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-2 rounded-lg text-xs font-semibold transition-all border border-red-200 hover:border-red-300"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </ScrollableSection>
              )}

            </section>


            <section className="mb-10 px-4 sm:px-4 lg:px-4">
              <h2 className="text-xl sm:text-2xl font-semibold text-green-800 mb-4 font-heading">
                Orders Received
              </h2>

              <div className="flex mb-6 mt-4 gap-3">
                <button
                  onClick={() => setFilterStatus('pending')}
                  className={`px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${filterStatus === 'pending'
                    ? 'bg-gradient-to-r from-green-700 to-emerald-600 text-white shadow-md'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-green-300 hover:text-green-700'
                    }`}
                >
                  Pending
                </button>
                <button
                  onClick={() => setFilterStatus('completed')}
                  className={`px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${filterStatus === 'completed'
                    ? 'bg-gradient-to-r from-green-700 to-emerald-600 text-white shadow-md'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-green-300 hover:text-green-700'
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
                          className="relative bg-white rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-100 hover:border-green-200"
                        >
                          <span
                            className={`absolute top-3 right-3 text-xs px-3 py-1 rounded-full font-semibold ${order.fulfilled
                              ? 'bg-green-100 text-green-700'
                              : 'bg-amber-50 text-amber-700'
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
                    <div className="flex items-center mt-6 gap-2 sm:gap-3">
                      <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 text-sm bg-white text-gray-700 rounded-xl border border-gray-200 hover:border-green-300 hover:text-green-700 font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:text-gray-700"
                      >
                        ← Previous
                      </button>
                      <span className="px-3 py-1 text-sm font-medium text-gray-500">
                        {currentPage} / {totalPages}
                      </span>
                      <button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 text-sm bg-white text-gray-700 rounded-xl border border-gray-200 hover:border-green-300 hover:text-green-700 font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:text-gray-700"
                      >
                        Next →
                      </button>
                    </div>
                  )}
                </>
              )}
            </section>






            <section className='px-4 sm:px-4'>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl sm:text-2xl font-semibold text-green-800 font-heading">Statistics</h2>
                <button
                  onClick={handleExportPDF}
                  className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-700 to-emerald-600 text-white rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl hover:from-green-600 hover:to-emerald-500 transition-all duration-300"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  Download Report
                </button>
              </div>


              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setViewMode('monthly')}
                  className={`px-4 py-2 text-sm rounded-xl font-semibold transition-all duration-200 ${viewMode === 'monthly'
                    ? 'bg-gradient-to-r from-green-700 to-emerald-600 text-white shadow-md'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-green-300 hover:text-green-700'
                    }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setViewMode('weekly')}
                  className={`px-4 py-2 text-sm rounded-xl font-semibold transition-all duration-200 ${viewMode === 'weekly'
                    ? 'bg-gradient-to-r from-green-700 to-emerald-600 text-white shadow-md'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-green-300 hover:text-green-700'
                    }`}
                >
                  Weekly
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl flex flex-col justify-center items-center mb-6">
                    <h3 className="text-sm sm:text-base font-semibold text-green-700 uppercase tracking-wider mb-2">
                      Earnings This {viewMode === 'weekly' ? 'Week' : 'Month'}
                    </h3>
                    <p className="text-3xl sm:text-4xl font-extrabold text-green-800">
                      ₹<CountUp key={`stat-earn-${viewMode}`} end={viewMode === 'weekly' ? currentWeekEarnings : currentMonthEarnings} duration={1.5} separator="," />
                    </p>
                  </div>
                  <h3 className="text-base font-bold mb-3 text-green-700">Earnings Over Time</h3>
                  <Line data={earningsChartData} options={chartOptions} />
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 mb-10 sm:mb-0">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl flex flex-col justify-center items-center mb-6">
                    <h3 className="text-sm sm:text-base font-semibold text-green-700 uppercase tracking-wider mb-2">
                      Orders This {viewMode === 'weekly' ? 'Week' : 'Month'}
                    </h3>
                    <p className="text-3xl sm:text-4xl font-extrabold text-green-800">
                      <CountUp key={`stat-ord-${viewMode}`} end={viewMode === 'weekly' ? currentWeekOrders : currentMonthOrders} duration={1.5} />
                    </p>
                  </div>
                  <h3 className="text-base font-bold mb-3 text-green-700">Orders Over Time</h3>
                  <Line data={ordersChartData} options={chartOptions} />
                </div>
              </div>

              {Object.keys(revenuePerType).length > 0 && (
                <div className="mt-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                  <h3 className="text-base font-bold mb-4 text-green-700">Revenue Breakdown by Crop Type</h3>
                  <div className="max-w-xs mx-auto">
                    <Doughnut
                      data={donutChartData}
                      options={{
                        responsive: true,
                        plugins: {
                          legend: { position: 'bottom' },
                          tooltip: {
                            callbacks: {
                              label: (ctx: any) => `${ctx.label}: ₹${ctx.parsed.toLocaleString()}`,
                            },
                          },
                        },
                      }}
                    />
                  </div>
                </div>
              )}

            </section>

          </>
        )}
      </div >
      <Footer />
      {
        showAddProductModal && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            onClick={() => setShowAddProductModal(false)}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white rounded-t-2xl px-6 sm:px-8 pt-6 pb-4 border-b border-gray-100 flex items-center justify-between z-10">
                <h2 className="text-xl sm:text-2xl font-bold text-green-800 font-heading">Add New Product</h2>
                <button
                  onClick={() => setShowAddProductModal(false)}
                  className="p-2 rounded-full hover:bg-gray-100 transition"
                >
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

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
                      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`
                    );
                    const geocodeData = await geocodeRes.json();


                    if (geocodeData.status === 'OK' && geocodeData.results && geocodeData.results.length > 0) {
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
                    setShowAddProductModal(false);
                    toast.success('Crop added successfully', {
                      style: { background: '#14532d', color: 'white' },
                    });
                  } else {
                    toast.error('Failed to add crop', {
                      style: { background: '#14532d', color: 'white' },
                    });
                  }
                }}
                className="px-6 sm:px-8 py-6 grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                <input
                  name="name"
                  required
                  placeholder="Crop Name"
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition bg-gray-50 hover:bg-white"
                />
                <input
                  name="price"
                  type="number"
                  required
                  placeholder="Price (₹)"
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition bg-gray-50 hover:bg-white"
                />
                <input
                  name="quantity"
                  required
                  placeholder="Quantity (e.g., 20 kg)"
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition bg-gray-50 hover:bg-white"
                />
                <select
                  name="type"
                  required
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm text-gray-700 bg-gray-50 hover:bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition"
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
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition bg-gray-50 hover:bg-white"
                />
                <input
                  name="regionPincodes"
                  required
                  placeholder="Region Pincodes (comma separated)"
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition bg-gray-50 hover:bg-white"
                />
                <input
                  name="location"
                  required
                  placeholder="Crop Location (Full Address)"
                  className="w-full col-span-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition bg-gray-50 hover:bg-white"
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
                      className="flex items-center gap-2 w-full py-3 px-4 text-gray-700 font-medium rounded-xl border border-dashed border-gray-300 hover:border-green-500 hover:text-green-700 bg-gray-50 hover:bg-green-50 transition-all duration-200 cursor-pointer"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12V4m0 0L8 8m4-4l4 4" />
                      </svg>
                      <span>Upload Image</span>
                    </label>
                    <span id="file-name-label" className="block text-xs text-gray-500 truncate mt-1"></span>
                  </div>
                </div>

                <div className="col-span-full flex items-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddProductModal(false)}
                    className="flex-1 py-3 rounded-xl text-gray-700 font-semibold border border-gray-300 hover:bg-gray-50 transition duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-br from-green-800 to-emerald-700 rounded-xl text-white py-3 text-base font-semibold shadow-md hover:shadow-lg hover:from-green-700 hover:to-emerald-600 transition duration-300"
                  >
                    Add Product
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )
      }

      {showEditProductModal && editingCrop && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={() => { setShowEditProductModal(false); setEditingCrop(null); }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white rounded-t-2xl px-6 sm:px-8 pt-6 pb-4 border-b border-gray-100 flex items-center justify-between z-10">
              <h2 className="text-xl sm:text-2xl font-bold text-green-800 font-heading">Edit Product</h2>
              <button
                onClick={() => { setShowEditProductModal(false); setEditingCrop(null); }}
                className="p-2 rounded-full hover:bg-gray-100 transition"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form
              onSubmit={handleEditProduct}
              className="px-6 sm:px-8 py-6 grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              <input
                name="name"
                required
                defaultValue={editingCrop.name}
                placeholder="Crop Name"
                className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition bg-gray-50 hover:bg-white"
              />
              <input
                name="price"
                type="number"
                required
                defaultValue={editingCrop.price}
                placeholder="Price (₹)"
                className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition bg-gray-50 hover:bg-white"
              />
              <input
                name="quantity"
                required
                defaultValue={editingCrop.quantity}
                placeholder="Quantity (e.g., 20 kg)"
                className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition bg-gray-50 hover:bg-white"
              />
              <select
                name="type"
                required
                defaultValue={editingCrop.type}
                className="w-full border border-gray-200 rounded-xl p-3 text-sm text-gray-700 bg-gray-50 hover:bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition"
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
                defaultValue={editingCrop.availability}
                placeholder="Availability"
                className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition bg-gray-50 hover:bg-white"
              />
              <input
                name="regionPincodes"
                required
                defaultValue={editingCrop.regionPincodes?.join(', ')}
                placeholder="Region Pincodes (comma separated)"
                className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition bg-gray-50 hover:bg-white"
              />

              <div className="flex flex-col col-span-full sm:col-span-1">
                <div className="relative group">
                  <input
                    id="edit-image-upload"
                    name="image"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const fileName = e.target.files?.[0]?.name;
                      const label = document.getElementById('edit-file-name-label');
                      if (label && fileName) label.textContent = fileName;
                    }}
                  />
                  <label
                    htmlFor="edit-image-upload"
                    className="flex items-center gap-2 w-full py-3 px-4 text-gray-700 font-medium rounded-xl border border-dashed border-gray-300 hover:border-green-500 hover:text-green-700 bg-gray-50 hover:bg-green-50 transition-all duration-200 cursor-pointer"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12V4m0 0L8 8m4-4l4 4" />
                    </svg>
                    <span>Change Image (optional)</span>
                  </label>
                  <span id="edit-file-name-label" className="block text-xs text-gray-500 truncate mt-1"></span>
                </div>
              </div>

              <div className="col-span-full flex items-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setShowEditProductModal(false); setEditingCrop(null); }}
                  className="flex-1 py-3 rounded-xl text-gray-700 font-semibold border border-gray-300 hover:bg-gray-50 transition duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-br from-green-800 to-emerald-700 rounded-xl text-white py-3 text-base font-semibold shadow-md hover:shadow-lg hover:from-green-700 hover:to-emerald-600 transition duration-300"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

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

