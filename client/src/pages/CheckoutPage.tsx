import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { UserPlusIcon } from '@heroicons/react/24/outline';
import { User } from 'lucide-react';
import Footer from '../components/Footer';
import logo from '../assets/logo.png';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantityInCart: string;
  quantity: string;
}

const CheckoutPage: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [userName, setUserName] = useState<string | null>(null);

  const navigate = useNavigate();

  // Load cart and user info
  useEffect(() => {
    const storedUser = localStorage.getItem('cropcartUser');
    if (storedUser) {
      try {
        const data = JSON.parse(storedUser);
        setUserName(data?.user?.name || null);

        const userId = data?.user?.id;
        if (userId) {
          const cartKey = `cart_${userId}`;
          const storedCart = localStorage.getItem(cartKey);
          if (storedCart) {
            setCart(JSON.parse(storedCart));
          }
        }
      } catch (err) {
        console.error('Error reading from localStorage:', err);
      }
    }
  }, []);

  const totalPrice = cart.reduce((total, item) => {
    const quantityNum = parseFloat(item.quantityInCart) || 0;
    return total + item.price * quantityNum;
  }, 0);

  const toastStyle = { style: { background: '#14532d', color: 'white' } };

  const handlePlaceOrder = async () => {
    if (!name || !email || !address) {
      toast.error('Please fill in all fields.', toastStyle);
      return;
    }

    setLoading(true);

    try {
      const storedUser = localStorage.getItem('cropcartUser');
      const userId = storedUser ? JSON.parse(storedUser)?.user?.id : null;

      const orderData = {
        userId,
        name,
        email,
        phone,
        address,
        items: cart,
        total: (totalPrice * 1.18 + 50).toFixed(2),
        tax: (totalPrice * 0.18).toFixed(2),
        deliveryFee: 50,
      };

      const response = await fetch('https://crop-cart-backend.onrender.com/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to place order');
      }

      toast.success('Order placed successfully!', toastStyle);
      setCart([]);
      // Clear cart from localStorage
      if (userId) localStorage.removeItem(`cart_${userId}`);

      // Redirect or reset form as needed
      navigate('/myorders');
    } catch (error: any) {
      toast.error(error.message || 'Failed to place order', toastStyle);
    } finally {
      setLoading(false);
    }
  };

  const onLogout = () => {
    localStorage.removeItem('cropcartUser');
    toast.success('Logged out successfully', toastStyle);
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Navbar copied from MyOrders */}
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

      {/* Checkout form */}
      <main className="pt-28 pb-28 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Toaster />
        <h1 className="text-3xl font-bold text-green-900 dark:text-green-300 mb-8">Checkout</h1>

        <div className="mb-6">
          <label htmlFor="name" className="block font-semibold mb-1">
            Name
          </label>
          <input
            id="name"
            type="text"
            className="w-full p-2 border rounded-md"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your full name"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="email" className="block font-semibold mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="w-full p-2 border rounded-md"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="phone" className="block font-semibold mb-1">
            Phone
          </label>
          <input
            id="phone"
            type="tel"
            className="w-full p-2 border rounded-md"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Your phone number"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="address" className="block font-semibold mb-1">
            Address
          </label>
          <textarea
            id="address"
            className="w-full p-2 border rounded-md"
            rows={3}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Shipping address"
          />
        </div>

        <div className="mb-6 border-t border-green-700 pt-4 text-lg font-semibold text-green-800 dark:text-green-400">
          <p>Subtotal: ₹{totalPrice.toFixed(2)}</p>
          <p>GST (18%): ₹{(totalPrice * 0.18).toFixed(2)}</p>
          <p>Delivery Fee: ₹50.00</p>
          <p className="mt-2 text-2xl">
            Total: ₹{(totalPrice * 1.18 + 50).toFixed(2)}
          </p>
        </div>

        <button
          onClick={handlePlaceOrder}
          disabled={loading || cart.length === 0}
          className={`w-full py-3 rounded-md text-white font-semibold ${
            loading || cart.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-700 hover:bg-green-800'
          }`}
          aria-busy={loading}
        >
          {loading ? 'Placing order...' : 'Place Order'}
        </button>
      </main>

      <Footer />
    </div>
  );
};

export default CheckoutPage;
