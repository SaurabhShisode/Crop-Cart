import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import Footer from '../components/Footer';
import logo from '../assets/logo.png';
import { UserPlusIcon } from '@heroicons/react/24/outline';
import { User } from 'lucide-react';

import { DirectionsService } from '@react-google-maps/api';

interface CartItem {
  _id: string;
  name: string;
  price: number;
  quantityInCart: number;
  quantity: string;
  farmer: string;
  cropId: string;
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


  useEffect(() => window.scrollTo(0, 0), []);

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
    const fetchCoords = async () => {
      if (!address) return;
      try {
        const coords = await getDeliveryCoords(address);
        setDeliveryCoords(coords);
      } catch (err) {
        console.error('Geocoding error:', err);
        toast.error('Invalid address', { style: { background: '#7f1d1d', color: 'white' } });
      }
    };

    fetchCoords();
  }, [address]);

  const totalPrice = cart.reduce((total, item) => {
    const quantityNum = item.quantityInCart || 0;
    return total + item.price * quantityNum;
  }, 0);

  const toastStyle = { style: { background: '#14532d', color: 'white' } };

  const handlePlaceOrder = async () => {
    if (!name || !email || !address || !cart.length) {
      toast.error('Please fill in all fields and add items to cart.', toastStyle);
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

      toast.success('Order placed successfully!', toastStyle);
      if (userId) localStorage.removeItem(`cart_${userId}`);
      setCart([]);
      setName('');
      setEmail('');
      setAddress('');
      navigate('/home');
    } catch (err) {
      console.error(err);
      toast.error('Failed to place order. Please try again.', toastStyle);
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

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center  px-6 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-16">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
        </svg>

        <h2 className="text-3xl font-semibold text-gray-700 mb-4">Your cart is empty</h2>
        <p className="text-gray-500">Please add some items to your cart before checking out.</p>
      </div>
    );
  }
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


  return (
    <>
      <nav className="flex justify-between items-center px-3 sm:px-6 py-5 sm:py-7 bg-white shadow-lg sticky top-0 z-50">
        <div
          className="flex items-center space-x-2 text-xl sm:text-2xl font-extrabold text-green-700 cursor-pointer select-none dark:text-green-400 font-heading"
          onClick={() => navigate('/')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && navigate('/')}
        >
          <img src={logo} alt="CropCart Logo" className="w-7 h-7 sm:w-8 sm:h-8" />
          <span>CropCart</span>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4 flex-col sm:flex-row">
          {userName ? (
            <div className="flex items-center space-x-2 sm:space-x-4 flex-col sm:flex-row">
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
      <Toaster position="top-center" reverseOrder={false} />
      <div className="min-h-screen bg-white flex items-center justify-center px-6 pt-10 mt-16 sm:mt-0">

        <div className="max-w-6xl w-full  rounded-2xl  grid grid-cols-1 md:grid-cols-3 gap-8 pb-10  sm:p-10">
          {/* Order Summary */}

          <section className="order-1 md:order-1 md:col-span-1 bg-green-900 border  rounded-xl p-4 md:p-6 shadow-2xl">
            <h2 className="text-lg md:text-2xl font-bold text-white mb-4 md:mb-6 font-heading">Order Summary</h2>

            <ul className="divide-y divide-white">
              {cart.map((item) => {
                const quantityNum = item.quantityInCart || 0;


                return (
                  <li
                    key={item._id}
                    className="py-3 md:py-4 flex flex-col sm:flex-row justify-between gap-2 sm:gap-4"
                  >
                    <div className="flex flex-col">
                      <p className="font-semibold text-white text-sm md:text-base">
                        {item.name} ({item.quantity})
                      </p>



                      <div className="flex items-center space-x-2 mt-2 bg-green-700 rounded w-fit px-2 py-1">
                        <button
                          type="button"
                          aria-label={`Decrease quantity of ${item.name}`}
                          onClick={() => updateQuantity(item._id, quantityNum - 1)}
                          className="px-2 py-1 text-white text-xs font-bold"
                          disabled={quantityNum <= 0}
                        >
                          −
                        </button>
                        <span className="text-white text-sm font-bold">{quantityNum}</span>
                        <button
                          type="button"
                          aria-label={`Increase quantity of ${item.name}`}
                          onClick={() => updateQuantity(item._id, quantityNum + 1)}
                          className="px-2 py-1 text-white text-xs font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <p className="font-semibold text-white text-sm md:text-base self-end sm:self-center">
                      ₹{(item.price * quantityNum).toFixed(2)}
                    </p>
                  </li>
                );
              })}
            </ul>



            <div className=" border-t border-white mt-8 md:mt-6 pt-3 md:pt-4 space-y-4 text-white">
              <div className="flex justify-between items-center text-sm md:text-base">
                <span className="flex items-center gap-2 font-semibold">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-circle-dollar-sign-icon lucide-circle-dollar-sign"><circle cx="12" cy="12" r="10" /><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" /><path d="M12 18V6" /></svg>Base Price:</span>
                <span className="font-semibold">₹{totalPrice.toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center text-sm md:text-base">
                <span className="flex items-center gap-2 font-semibold">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-landmark-icon lucide-landmark"><path d="M10 18v-7" /><path d="M11.12 2.198a2 2 0 0 1 1.76.006l7.866 3.847c.476.233.31.949-.22.949H3.474c-.53 0-.695-.716-.22-.949z" /><path d="M14 18v-7" /><path d="M18 18v-7" /><path d="M3 22h18" /><path d="M6 18v-7" /></svg>Taxes:</span>
                <span className="font-semibold">₹{(totalPrice * 0.18).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-sm md:text-base">
                <span className="flex items-center gap-2 font-semibold">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-truck-icon lucide-truck"
                  >
                    <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
                    <path d="M15 18H9" />
                    <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
                    <circle cx="17" cy="18" r="2" />
                    <circle cx="7" cy="18" r="2" />
                  </svg>
                  Delivery Fee:
                </span>

                {totalPrice > 299 ? (
                  <span>
                    <span className="line-through text-white/50 mr-1 md:mr-2 font-semibold">₹50.00</span>
                    <span className="text-green-200 font-semibold">Free</span>
                  </span>
                ) : (
                  <span className="font-semibold">₹50.00</span>
                )}
              </div>

              <div className="flex justify-between items-center font-bold text-base md:text-xl border-t border-white pt-2 mt-2">
                <span>Total:</span>
                <span>
                  ₹{(totalPrice * 1.18 + (totalPrice > 299 ? 0 : 50)).toFixed(2)}
                </span>
              </div>
            </div>
          </section>


          {/* Shipping Details */}

          <section className="order-2 md:order-2 md:col-span-2 p-6 bg-green-50 rounded-xl shadow-2xl border border-2 border-green-900">

            <h2 className="text-2xl font-bold text-green-900 mb-6 font-heading">Shipping Details</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handlePlaceOrder();
              }}
              className="space-y-6"
            >
              <div>
                <label htmlFor="name" className="block text-green-800 font-medium mb-2">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="John Doe"
                  className="w-full border border-green-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-900 transition"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-green-800 font-medium mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="john@example.com"
                  className="w-full border border-green-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-900 transition"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-green-800 font-medium mb-2">
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
                  className="w-full border border-green-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-900 transition"
                />
              </div>


              <div>
                <label htmlFor="address" className="block text-green-800 font-medium mb-2">
                  Shipping Address
                </label>
                <textarea
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  rows={4}
                  placeholder="123, Green Street, City, Country"
                  className="w-full border border-green-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-900 resize-none transition"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-green-900 text-white py-3 rounded-lg font-semibold shadow hover:bg-green-800 transition duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
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

              <div className="bg-white flex items-center justify-center">

                <div className="max-w-6xl w-full rounded-xl bg-gradient-to-br from-green-100 via-emerald-200 to-green-50 border border-2 border-green-900 shadow-xl p-2 sm:p-4 flex items-center justify-center gap-6 ">


                  <div className="relative flex-shrink-0">
                    <img
                      src="https://images.vexels.com/media/users/3/153665/isolated/preview/85caec2546a1e9eaaabadfb301945221-fast-delivery-colored-stroke-icon.png"
                      alt="Fast Delivery"
                      className="w-12 h-12 sm:w-16 sm:h-16 "
                    />


                  </div>


                  <p className="text-md sm:text-lg font-semibold text-gray-800 text-center sm:text-left">
                    {deliveryDuration ? (
                      <>
                        Your order will arrive in&nbsp;
                        <span className="text-green-800">{deliveryDuration} mins</span>
                      </>
                    ) : (
                      <span className="text-gray-600">Enter your delivery address to get estimated delivery time</span>
                    )}
                  </p>
                </div>

              </div>

            </form>



          </section>

        </div>



      </div>





      <Footer />
      {deliveryCoords &&
        cart.length > 0 &&
        cart.every(item => item.location) && (
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