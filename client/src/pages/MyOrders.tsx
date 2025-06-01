import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import logo from '../assets/logo.png'; // Adjust the path based on your project structure
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

interface Order {
  _id: string;
  name: string;
  email: string;
  address: string;
  items: Array<{ name: string; quantity: number }>;
  total: string;
  tax: string;
  deliveryFee: number;
  createdAt: string;
}

const MyOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

        const res = await fetch(`https://crop-cart-backend.onrender.com/api/orders/user/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full bg-white dark:bg-gray-800 shadow-sm z-50 p-4 md:px-6">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center space-x-2 text-2xl font-extrabold text-green-700 dark:text-green-400 cursor-pointer" onClick={() => navigate('/')}>
            <img src={logo} alt="CropCart Logo" className="w-8 h-8" />
            <span>CropCart</span>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-2xl text-green-700 dark:text-green-400 focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <FontAwesomeIcon icon={mobileMenuOpen ? faTimes : faBars} />
          </button>

          {/* Right Side Desktop Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={() => navigate('/login')}
              className="px-5 py-2 font-semibold text-gray-800 dark:text-gray-200 hover:text-green-700 dark:hover:text-green-400 text-lg"
            >
              Log in
            </button>
            <button
              onClick={() => navigate('/register')}
              className="px-5 py-2 bg-green-700 hover:bg-green-800 text-white rounded-md text-lg font-semibold"
            >
              Sign up
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="flex flex-col mt-4 space-y-4 md:hidden">
            <button
              onClick={() => {
                navigate('/login');
                setMobileMenuOpen(false);
              }}
              className="px-4 py-2 font-semibold text-left text-gray-800 dark:text-gray-200 hover:text-green-700 dark:hover:text-green-400"
            >
              Log in
            </button>
            <button
              onClick={() => {
                navigate('/register');
                setMobileMenuOpen(false);
              }}
              className="px-4 py-2 font-semibold text-left text-gray-800 dark:text-gray-200 hover:text-green-700 dark:hover:text-green-400"
            >
              Sign up
            </button>
          </div>
        )}
      </nav>

      {/* Orders Section */}
      <div className="max-w-4xl mx-auto pt-32 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-6 text-green-900 dark:text-green-300">My Orders</h1>

        {loading ? (
          <div className="text-center text-green-800 dark:text-green-200">Loading your orders...</div>
        ) : orders.length === 0 ? (
          <div className="text-center text-green-800 dark:text-green-200">You have no orders yet.</div>
        ) : (
          <ul className="space-y-6">
            {orders.map(order => (
              <li key={order._id} className="border border-green-300 dark:border-green-600 rounded-lg p-4 shadow-sm bg-white dark:bg-gray-800">
                <p><strong>Order ID:</strong> {order._id}</p>
                <p><strong>Placed on:</strong> {new Date(order.createdAt).toLocaleString('en-GB')}</p>
                <p><strong>Delivery Address:</strong> {order.address}</p>
                <p><strong>Items:</strong></p>
                <ul className="ml-4 list-disc">
                  {order.items.map((item, idx) => (
                    <li key={idx}>{item.name} x {item.quantity}</li>
                  ))}
                </ul>
                <p><strong>Total:</strong> ₹{order.total}</p>
                <p><strong>Tax:</strong> ₹{order.tax}</p>
                <p><strong>Delivery Fee:</strong> ₹{order.deliveryFee}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
