import React, { useEffect, useState,  } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import logo from '../assets/logo.png';
import { UserIcon,  } from '@heroicons/react/24/outline';

interface Order {
  _id: string;
  name: string;
  email: string;
  address: string;
  items: Array<{ name: string; quantity: number; quantityInCart: string; }>;
  total: string;
  tax: string;
  deliveryFee: number;
  createdAt: string;

}

const MyOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [userName, setUserName] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userData = localStorage.getItem('cropcartUser');
        if (!userData) {
          toast.error('You must be logged in to view orders');
          navigate('/login');
          return;
        }

        const user = JSON.parse(userData);
        const token = user.token;
        const userId = user.user.id;

        setUserName(user.user.name);

        const res = await fetch(`https://crop-cart-backend.onrender.com/api/orders/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.message || 'Failed to fetch orders');
        }

        const data = await res.json();
        setOrders(data);
      } catch (error: any) {
        toast.error(error.message || 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  const onLogout = () => {
    localStorage.removeItem('cropcartUser');
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
  <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
    {/* Navbar */}
    <nav className="fixed top-0 left-0 w-full bg-white dark:bg-gray-800 shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
        <div
          className="flex items-center space-x-2 text-xl font-bold text-green-700 dark:text-green-400 cursor-pointer"
          onClick={() => navigate('/')}
        >
          <img src={logo} alt="CropCart Logo" className="w-8 h-8" />
          <span>CropCart</span>
        </div>

        <div className="flex items-center gap-4">
          {userName ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2 text-green-800 dark:text-green-300 font-medium hover:text-green-600"
              >
                <UserIcon className="w-6 h-6" />
                <span>{userName}</span>
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md w-48 z-50">
                  <button
                    onClick={() => {
                      navigate('/myorders');
                      setDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    My Orders
                  </button>
                  <button
                    onClick={() => {
                      navigate('/my-account');
                      setDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    My Account
                  </button>
                  <button
                    onClick={() => {
                      onLogout();
                      setDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100 dark:hover:bg-red-900"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                className="text-sm font-semibold text-gray-800 hover:text-green-700 dark:text-gray-200"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/register')}
                className="px-4 py-2 text-sm bg-green-700 hover:bg-green-800 text-white rounded-md font-medium"
              >
                Sign up
              </button>
            </>
          )}
        </div>
      </div>
    </nav>

    {/* Orders Section */}
    <main className="pt-28 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-green-900 dark:text-green-300 mb-8">My Orders</h1>

      {loading ? (
        <div className="text-center text-green-800 dark:text-green-200">Loading your orders...</div>
      ) : orders.length === 0 ? (
        <div className="text-center text-gray-600 dark:text-gray-400 text-lg">You haven’t placed any orders yet.</div>
      ) : (
        <div className="grid gap-6">
          {orders.map((order) => {
            const total = parseFloat(order.total);
            const tax = parseFloat(order.tax);
            const delivery = order.deliveryFee;
            const basePrice = total - tax - delivery;

            return (
              <div
                key={order._id}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow hover:shadow-lg transition-all duration-300"
              >
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Order ID:</p>
                    <p className="text-lg font-semibold text-green-800 dark:text-green-300">{order._id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Placed on</p>
                    <p className="text-md font-medium">{new Date(order.createdAt).toLocaleString('en-GB')}</p>
                  </div>
                </div>

                <p className="mb-2">
                  <span className="font-medium">Delivery Address:</span> {order.address}
                </p>

                <div className="mb-4">
                  <p className="font-medium mb-1">Items:</p>
                  <ul className="list-disc ml-6 space-y-1 text-sm">
                    {order.items.map((item, idx) => (
                      <li key={idx}>
                        <span className="font-medium">{item.name}</span> — {item.quantityInCart} ({item.quantity})
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div>
                    <p className="text-gray-500">Base Price</p>
                    <p className="font-semibold">₹{basePrice.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Tax</p>
                    <p className="font-semibold">₹{tax.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Delivery</p>
                    <p className="font-semibold">₹{delivery.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Total</p>
                    <p className="font-bold text-green-700 dark:text-green-300">₹{total.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  </div>
);

};

export default MyOrders;
