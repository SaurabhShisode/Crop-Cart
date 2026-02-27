import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Footer from '../components/Footer';
import logo from '../assets/logo.png';
import { UserPlusIcon } from '@heroicons/react/24/outline';
import { User, ShoppingCart, Truck, CheckCircle, ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { DirectionsService } from '@react-google-maps/api';

interface CartItem {
  _id: string;
  name: string;
  price: number;
  quantityInCart: number;
  quantity: string;
  farmer: string;
  cropId: string;
  image?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
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

  const [deliveryCoords, setDeliveryCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const navigate = useNavigate();
  const [deliveryDuration, setDeliveryDuration] = useState<number | null>(null);
  const [debouncedAddress, setDebouncedAddress] = useState('');
  const directionsRequested = useRef(false);
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [orderSuccess, setOrderSuccess] = useState(false);

  useEffect(() => window.scrollTo(0, 0), []);

  useEffect(() => {
    document.title = 'Checkout | CropCart';
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
        console.error('Error reading user or cart from localStorage:', err);
      }
    }
  }, []);


  const getDeliveryCoords = async (address: string) => {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
    );
    const data = await response.json();
    if (data.status === 'OK') {
      const location = data.results[0].geometry.location;
      return {
        latitude: location.lat,
        longitude: location.lng,
      };
    } else {
      throw new Error('Failed to geocode address');
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedAddress(address);
    }, 500);
    return () => clearTimeout(timer);
  }, [address]);

  useEffect(() => {
    const fetchCoords = async () => {
      if (!debouncedAddress) return;
      directionsRequested.current = false;
      try {
        const coords = await getDeliveryCoords(debouncedAddress);
        setDeliveryCoords(coords);
      } catch (err) {
        console.error('Geocoding error:', err);
        toast.error('Invalid address', { style: { background: '#7f1d1d', color: 'white' } });
      }
    };

    fetchCoords();
  }, [debouncedAddress]);

  const totalPrice = cart.reduce((total, item) => {
    const quantityNum = item.quantityInCart || 0;
    return total + item.price * quantityNum;
  }, 0);



  const handlePlaceOrder = async () => {
    if (!name || !email || !address || !cart.length) {
      toast.error('Please fill in all fields and add items to cart.');
      return;
    }

    setLoading(true);

    try {
      const storedUser = localStorage.getItem('cropcartUser');
      const userId = storedUser ? JSON.parse(storedUser)?.user?.id : null;

      const tax = parseFloat((totalPrice * 0.18).toFixed(2));
      const deliveryFee = totalPrice > 299 ? 0 : 50;
      const total = parseFloat((totalPrice + tax + deliveryFee).toFixed(2));

      const orderData = {
        userId,
        name,
        email,
        phone,
        address,
        items: cart.map((item) => ({
          cropId: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          quantityInCart: item.quantityInCart,
          farmerId: item.farmer,
        })),
        total,
        tax,
        deliveryFee,
        fulfilled: false,
        fulfilledAt: null,
        deliveryTime: deliveryDuration ?? 30,

      };

      const response = await fetch('https://crop-cart-backend.onrender.com/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) throw new Error('Failed to place order.');

      if (userId) localStorage.removeItem(`cart_${userId}`);
      setCart([]);
      setName('');
      setEmail('');
      setAddress('');
      setOrderSuccess(true);
      setCheckoutStep(3);
    } catch (err) {
      console.error(err);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onLogout = () => {
    localStorage.removeItem('cropcartUser');
    toast.success('Logged out successfully', {
      style: { background: '#14532d', color: 'white' },
    });
    navigate('/home');
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    let updatedCart;
    if (newQuantity <= 0) {
      updatedCart = cart.filter(item => item._id !== itemId);
    } else {
      updatedCart = cart.map(item =>
        item._id === itemId
          ? { ...item, quantityInCart: newQuantity }
          : item
      );
    }
    setCart(updatedCart);
    const storedUser = localStorage.getItem('cropcartUser');
    const userId = storedUser ? JSON.parse(storedUser)?.user?.id : null;
    if (userId) {
      localStorage.setItem(`cart_${userId}`, JSON.stringify(updatedCart));
    }
  };

  const steps = [
    { num: 1, label: 'Cart', icon: ShoppingCart },
    { num: 2, label: 'Shipping', icon: Truck },
    { num: 3, label: 'Confirm', icon: CheckCircle },
  ];

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex flex-col">
        <nav className="flex justify-between items-center px-3 sm:px-6 py-5 sm:py-7 bg-white shadow-sm sticky top-0 z-50">
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
        </nav>
        <div className="flex-grow flex items-center justify-center px-6">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="text-center max-w-md"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.4, type: 'spring', stiffness: 200 }}
              className="w-24 h-24 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center"
            >
              <CheckCircle className="w-14 h-14 text-green-600" />
            </motion.div>
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 font-heading"
            >
              Order Placed!
            </motion.h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-gray-500 mb-8 text-base sm:text-lg"
            >
              Your fresh produce is on its way. You can track your order from the My Orders page.
            </motion.p>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-3 justify-center"
            >
              <button
                onClick={() => navigate('/myorders')}
                className="px-6 py-3 bg-green-700 hover:bg-green-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                View My Orders
              </button>
              <button
                onClick={() => navigate('/home')}
                className="px-6 py-3 bg-white text-green-700 font-semibold rounded-xl border-2 border-green-700 hover:bg-green-50 transition-all duration-300"
              >
                Continue Shopping
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex flex-col items-center justify-center px-6 text-center">
        <ShoppingCart className="w-16 h-16 text-gray-300 mb-4" />
        <h2 className="text-3xl font-semibold text-gray-700 mb-4 font-heading">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Please add some items to your cart before checking out.</p>
        <button
          onClick={() => navigate('/home')}
          className="px-6 py-3 bg-green-700 hover:bg-green-800 text-white font-semibold rounded-xl transition-all"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <>
      <nav className="flex justify-between items-center px-3 sm:px-6 py-5 sm:py-7 bg-white shadow-sm sticky top-0 z-50">
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

        <div className="flex items-center space-x-2 sm:space-x-4">
          {userName ? (
            <div className="flex items-center space-x-2 sm:space-x-4">
              <span className="hidden sm:flex font-semibold text-green-700 text-sm sm:text-lg">
                Hi, {userName}
              </span>
              <div ref={dropdownRef} className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="p-1.5 sm:p-2 rounded-full bg-green-100 hover:bg-green-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                  aria-haspopup="true"
                  aria-expanded={dropdownOpen}
                  aria-label="User menu"
                >
                  <User className="w-5 h-5 sm:w-6 sm:h-6 text-green-700" />
                </button>
                {dropdownOpen && (
                  <ul className="absolute right-0 mt-2 w-44 sm:w-48 bg-white border border-green-200 rounded-md shadow-lg z-50 text-sm sm:text-base">
                    <li>
                      <button
                        onClick={() => {
                          navigate('/my-account');
                          setDropdownOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-green-800 hover:bg-green-100"
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
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => navigate('/login')}
                className="px-3 py-1.5 text-sm sm:text-lg font-semibold text-gray-800 hover:text-green-700"
              >
                Log in
              </button>
              <button
                onClick={() => navigate('/register')}
                className="px-4 sm:px-5 py-1.5 sm:py-2 bg-green-700 hover:bg-green-800 text-white rounded-md text-sm sm:text-lg font-semibold flex items-center gap-2"
              >
                <UserPlusIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                Sign up
              </button>
            </div>
          )}
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-center mb-10">
          {steps.map((step, i) => (
            <React.Fragment key={step.num}>
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-300 ${checkoutStep >= step.num
                    ? 'bg-green-700 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-400'
                    }`}
                >
                  <step.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <span className={`text-xs sm:text-sm mt-2 font-semibold ${checkoutStep >= step.num ? 'text-green-700' : 'text-gray-400'
                  }`}>{step.label}</span>
              </div>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 sm:mx-4 mt-[-20px] transition-all duration-300 ${checkoutStep > step.num ? 'bg-green-700' : 'bg-gray-200'
                  }`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {checkoutStep === 1 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 font-heading">Your Cart</h2>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-100">
              {cart.map((item) => (
                <div key={item._id} className="flex items-center gap-4 p-4 sm:p-5">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-gradient-to-br from-green-100 to-emerald-50 flex items-center justify-center flex-shrink-0">
                      <ShoppingCart className="w-6 h-6 text-green-300" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{item.name}</h3>
                    <p className="text-xs sm:text-sm text-gray-500">{item.quantity}</p>
                    <p className="text-green-700 font-bold text-sm sm:text-base mt-0.5">₹{item.price}</p>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-2 py-1">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item._id, item.quantityInCart - 1)}
                      className="w-7 h-7 rounded-md bg-white shadow-sm text-gray-600 font-bold text-sm hover:bg-gray-100 transition"
                    >
                      −
                    </button>
                    <span className="text-sm font-bold text-gray-800 w-6 text-center">{item.quantityInCart}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item._id, item.quantityInCart + 1)}
                      className="w-7 h-7 rounded-md bg-white shadow-sm text-gray-600 font-bold text-sm hover:bg-gray-100 transition"
                    >
                      +
                    </button>
                  </div>
                  <p className="font-bold text-gray-900 text-sm sm:text-base w-20 text-right">
                    ₹{(item.price * item.quantityInCart).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mt-4 p-5">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Subtotal</span>
                <span className="font-semibold">₹{totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Tax (18%)</span>
                <span className="font-semibold">₹{(totalPrice * 0.18).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 mb-3">
                <span>Delivery</span>
                {totalPrice > 299 ? (
                  <span>
                    <span className="line-through text-gray-400 mr-1">₹50</span>
                    <span className="text-green-600 font-semibold">Free</span>
                  </span>
                ) : (
                  <span className="font-semibold">₹50.00</span>
                )}
              </div>
              <div className="border-t border-gray-100 pt-3 flex justify-between">
                <span className="font-bold text-gray-900">Total</span>
                <span className="font-bold text-green-700 text-lg">
                  ₹{(totalPrice * 1.18 + (totalPrice > 299 ? 0 : 50)).toFixed(2)}
                </span>
              </div>
            </div>

            <button
              onClick={() => setCheckoutStep(2)}
              className="w-full mt-6 bg-green-700 hover:bg-green-800 text-white py-3.5 rounded-xl font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Proceed to Shipping
            </button>
          </motion.div>
        )}

        {checkoutStep === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <button
              onClick={() => setCheckoutStep(1)}
              className="flex items-center gap-1 text-green-700 font-semibold text-sm mb-6 hover:text-green-800 transition"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Cart
            </button>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 font-heading">Shipping Details</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handlePlaceOrder();
              }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 space-y-5"
            >
              <div>
                <label htmlFor="name" className="block text-gray-700 font-semibold mb-1.5 text-sm">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="John Doe"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition text-sm"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-gray-700 font-semibold mb-1.5 text-sm">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="john@example.com"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition text-sm"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-gray-700 font-semibold mb-1.5 text-sm">
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  placeholder="e.g., 9876543210"
                  pattern="[0-9]{10}"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition text-sm"
                />
              </div>
              <div>
                <label htmlFor="address" className="block text-gray-700 font-semibold mb-1.5 text-sm">
                  Shipping Address
                </label>
                <textarea
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  rows={3}
                  placeholder="123, Green Street, City, Country"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none transition text-sm"
                />
              </div>

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 flex items-center gap-4">
                <Truck className="w-8 h-8 text-green-600 flex-shrink-0" />
                <p className="text-sm font-semibold text-gray-800">
                  {deliveryDuration ? (
                    <>Estimated delivery in <span className="text-green-700">{deliveryDuration} mins</span></>
                  ) : (
                    <span className="text-gray-500">Enter your delivery address to get estimated delivery time</span>
                  )}
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal ({cart.reduce((a, i) => a + i.quantityInCart, 0)} items)</span>
                  <span className="font-semibold">₹{totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Tax (18%)</span>
                  <span className="font-semibold">₹{(totalPrice * 0.18).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Delivery</span>
                  {totalPrice > 299 ? (
                    <span>
                      <span className="line-through text-gray-400 mr-1">₹50</span>
                      <span className="text-green-600 font-semibold">Free</span>
                    </span>
                  ) : (
                    <span className="font-semibold">₹50.00</span>
                  )}
                </div>
                <div className="border-t border-gray-200 pt-2 flex justify-between">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="font-bold text-green-700 text-lg">₹{(totalPrice * 1.18 + (totalPrice > 299 ? 0 : 50)).toFixed(2)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-green-700 text-white py-3.5 rounded-xl font-semibold shadow-lg hover:bg-green-800 hover:shadow-xl transition-all duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Placing Order...
                  </span>
                ) : (
                  'Place Order'
                )}
              </button>
            </form>
          </motion.div>
        )}
      </div>

      <Footer />
      {deliveryCoords &&
        cart.length > 0 &&
        cart.every(item => item.location) &&
        !directionsRequested.current && (
          <DirectionsService
            options={{
              origin: {
                lat: cart[0].location!.latitude,
                lng: cart[0].location!.longitude,
              },
              destination: {
                lat: deliveryCoords.latitude,
                lng: deliveryCoords.longitude,
              },
              waypoints: cart.slice(1).map(item => ({
                location: {
                  lat: item.location!.latitude,
                  lng: item.location!.longitude,
                },
                stopover: true,
              })),
              travelMode: window.google.maps.TravelMode.DRIVING,
              optimizeWaypoints: true,
            }}
            callback={(response, status) => {
              directionsRequested.current = true;
              if (status === 'OK' && response?.routes?.length) {
                const totalDuration = response.routes[0].legs.reduce((acc, leg) => {
                  return acc + (leg.duration?.value ?? 0);
                }, 0);
                const durationInMinutes = Math.round(totalDuration / 60);
                setDeliveryDuration(durationInMinutes);
              } else {
                console.error('DirectionsService error:', status, response);
              }
            }}
          />
        )}




    </>
  );
};

export default CheckoutPage;