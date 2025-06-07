
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPinIcon,
  MagnifyingGlassIcon,
  UserPlusIcon,
} from '@heroicons/react/24/outline';
import { ShoppingCart, User, ArrowLeft, ArrowRight } from 'lucide-react';
import homeheroImage from '../assets/home_hero.png';
import veggiesImage from '../assets/veggies.jpg';
import logo from '../assets/logo.png';
import Footer from '../components/Footer';

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

const style = document.createElement('style');
style.innerHTML = `
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
`;
document.head.appendChild(style);
const Navbar: React.FC<{
  userName: string | null;
  onLogout: () => void;
  cartCount: number;
  toggleCart: () => void;
  pincode: string;

  setPincode: React.Dispatch<React.SetStateAction<string>>;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}> = ({
  userName,
  onLogout,
  cartCount,
  toggleCart,
  pincode,
  setPincode,
  searchQuery,
  setSearchQuery,
}) => {
    const navigate = useNavigate();
    const [location, setLocation] = useState('Enter Pincode');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const fetchLocation = async (pin: string) => {
      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
        const data = await res.json();
        if (data[0].Status === 'Success') {
          const postOffice = data[0].PostOffice[0];
          setLocation(`${postOffice.District}, ${postOffice.State}`);
        } else {
          setLocation('Invalid Pincode');
        }
      } catch {
        setLocation('Error fetching location');
      }
    };

    useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setDropdownOpen(false);
        }
      }
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const placeholders = ["Search for wheat...", "Search for milk...", "Search for butter..."];
    const [placeholderIndex, setPlaceholderIndex] = useState(0);
    const [fade, setFade] = useState(true);

    useEffect(() => {
      const interval = setInterval(() => {
        setFade(false);
        setTimeout(() => {
          setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
          setFade(true);
        }, 300);
      }, 3000);
      return () => clearInterval(interval);
    }, []);






    return (
      <>
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

          <div className="hidden md:flex items-center space-x-8">
            <div className="flex items-center gap-2 bg-green-50 text-green-800 px-4 py-2 rounded-md shadow-sm">
              <MapPinIcon className="w-5 h-5" aria-hidden="true" />
              <span className="font-semibold">{location}</span>
            </div>
            <input
              type="text"
              maxLength={6}
              placeholder="Enter Pincode"
              value={pincode}
              onChange={(e) => {
                const val = e.target.value;
                if (/^\d{0,6}$/.test(val)) {
                  setPincode(val);
                  if (val.length === 6) fetchLocation(val);
                }
              }}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              aria-label="Enter Pincode"
            />
            <div className="relative ">
              <input
                type="text"
                className="px-4 py-2 pr-10 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-transparent text-black placeholder-transparent"
                aria-label="Search for products"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {!searchQuery && (
                <span
                  className={`absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 transition-opacity duration-300 pointer-events-none ${fade ? "opacity-100" : "opacity-0"
                    }`}
                >
                  {placeholders[placeholderIndex]}
                </span>
              )}





              <MagnifyingGlassIcon
                className="w-5 h-5 text-gray-500 absolute right-2 top-2.5"
                aria-hidden="true"
              />
            </div>
            <div
              className="relative cursor-pointer"
              onClick={toggleCart}
              aria-label="Toggle cart"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && toggleCart()}
            >
              <ShoppingCart
                className="w-7 h-7 text-green-800 hover:text-green-600"
                aria-hidden="true"
              />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-green-700 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4 relative">
            {userName ? (
              <>
                <span className="font-semibold text-green-700 text-lg">
                  Hi, {userName}
                </span>

                <div
                  ref={dropdownRef}
                  className="relative"
                >
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

        <div className="bg-yellow-400 text-black py-2 overflow-hidden sticky top-[85px] z-40 shadow-md">
          <div className="w-[200%] animate-marquee whitespace-nowrap font-semibold text-sm">
            <span className="mx-10">🔥 10% off on all vegetables this week!</span>
            <span className="mx-10">🚚 Free delivery for orders above ₹299</span>
            <span className="mx-10">🌾 Support local farmers. Shop fresh, shop local!</span>

            <span className="mx-10">🔥 10% off on all vegetables this week!</span>
            <span className="mx-10">🚚 Free delivery for orders above ₹299</span>
            <span className="mx-10">🌾 Support local farmers. Shop fresh, shop local!</span>
          </div>
        </div>



      </>
    );
  };
type Crop = {
  _id: string;
  name: string;
  type: string;
  price: number;
  regionPincodes: string[];
  image?: string;
  availability: string;
  quantity: string;
  farmer: string;
};



type CartItem = Crop & {
  quantityInCart: number;
};

const Home: React.FC = () => {
  const [crops, setCrops] = useState<Crop[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [pincode, setPincode] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('cropcartUser');
    if (storedUser) {
      try {
        const data = JSON.parse(storedUser);
        if (data.user && data.user.name && data.user.id) {
          setUserName(data.user.name);

          const cartKey = `cart_${data.user.id}`;
          const userCart = JSON.parse(localStorage.getItem(cartKey) || '[]');
          setCart(userCart);
        }
      } catch (err) {
        console.error('Failed to parse cropcartUser from localStorage:', err);
        setUserName(null);
        setCart([]);
      }
    }
  }, []);



  const [heroOpacity, setHeroOpacity] = useState(1);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const fadeStart = 0;
          const fadeEnd = 400;
          const newOpacity = Math.max(1 - (scrollY - fadeStart) / (fadeEnd - fadeStart), 0);
          setHeroOpacity(newOpacity);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (userName) {
      const storedUser = localStorage.getItem('cropcartUser');
      if (storedUser) {
        try {
          const data = JSON.parse(storedUser);
          if (data.user && data.user.id) {
            localStorage.setItem(`cart_${data.user.id}`, JSON.stringify(cart));
          }
        } catch {

        }
      }
    }
  }, [cart, userName]);

  useEffect(() => {
    fetch('https://crop-cart-backend.onrender.com/api/crops')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data: Crop[]) => setCrops(data))
      .catch((err) => console.error('Error fetching crops:', err));
  }, []);

  const addToCart = (crop: Crop) => {


    setCart((prev) => {
      const exists = prev.find((item) => item._id === crop._id);
      if (exists) {
        return prev.map((item) =>
          item._id === crop._id
            ? { ...item, quantityInCart: item.quantityInCart + 1 }
            : item
        );
      } else {
        return [
          ...prev,
          {
            ...crop,
            quantityInCart: 1,
          },
        ];
      }
    });

    setIsCartOpen(false);
  };


  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item._id !== id));
  };

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantityInCart,
    0
  );


  const cartCount = cart.reduce((acc, item) => acc + item.quantityInCart, 0);


  const handleLogout = () => {
    localStorage.removeItem('cropcartUser');
    setUserName(null);
    setCart([]);
  };



  const toggleCart = () => setIsCartOpen((prev) => !prev);

  const filteredCrops = crops.filter((crop) => {
    const matchesPincode =
      pincode.length === 6 ? crop.regionPincodes.includes(pincode) : true;
    const matchesSearch =
      searchQuery.trim() === '' ||
      crop.name.toLowerCase().includes(searchQuery.trim().toLowerCase());

    return matchesPincode && matchesSearch;
  });

  const groupedCrops = filteredCrops.reduce<Record<string, Crop[]>>(
    (acc, crop) => {
      if (!acc[crop.type]) {
        acc[crop.type] = [];
      }
      acc[crop.type].push(crop);
      return acc;
    },
    {}
  );
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar
        userName={userName}
        onLogout={handleLogout}
        cartCount={cartCount}
        toggleCart={toggleCart}
        pincode={pincode}
        setPincode={setPincode}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />



      <div className='bg-white'>
        <section
          className="relative bg-green-900 text-white overflow-hidden w-full"
          style={{ opacity: heroOpacity, transition: 'opacity 0.1s linear' }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between px-10 py-24 w-full mx-auto">
            <div className="w-full md:w-1/2 space-y-8 pl-24 md:pl-32 md:px-0">
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                Products <br />nearby you.
              </h1>
              <p className="text-base md:text-lg text-gray-200 leading-relaxed font-semibold">
                Order fresh, locally-sourced produce with ease and get it delivered straight to your doorstep.
              </p>
            </div>
            <div className="w-full md:w-1/2 max-w-sm mx-auto transition-all duration-700 ease-out transform">
              <img
                src={homeheroImage}
                alt="Hero"
                className="w-full object-contain drop-shadow-2xl scale-125 translate-y-20 rounded"
              />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] pointer-events-none">
            <svg
              className="relative block w-[calc(100%+1.3px)] h-[83px]"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1200 120"
              preserveAspectRatio="none"
            >
              <path d="M0 0 C 600 120 600 120 1200 0 L1200 120 L0 120 Z" fill="#FFFFFF" />
            </svg>
          </div>

        </section>
      </div>
      <div className="flex-grow max-w-7xl mx-auto h-150 py-10 px-4">
        <div className="px-6 py-8 bg-white space-y-6">

          <div className="relative rounded-3xl overflow-hidden bg-green-500 text-white p-8 w-full h-80">

            <img
              src={veggiesImage}
              alt="Fresh produce"
              className="absolute inset-0 w-full h-full object-cover opacity-90 blur-sm brightness-90 pointer-events-none z-0"
            />


            <div className="relative z-10">
              <h1 className="text-4xl font-bold mb-2">CropCart Specials</h1>
              <p className="text-lg mb-4">Your trusted platform to buy farm-fresh produce directly from farmers</p>
              <button className="bg-white text-green-600 px-4 py-2 rounded-md font-semibold shadow hover:bg-green-100">
                Start Shopping
              </button>
            </div>
          </div>




          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div className="bg-cyan-200 p-6 rounded-2xl shadow-md hover:scale-105 transition">
              <h2 className="text-xl font-semibold text-cyan-900 mb-2">Organic Vegetables at Your Doorstep</h2>
              <p className="mb-4 text-sm text-cyan-800">Handpicked greens and veggies from nearby farms</p>
              <button className="bg-white text-cyan-700 font-medium px-4 py-2 rounded-md">Order Now</button>
            </div>


            <div className="bg-yellow-300 p-6 rounded-2xl shadow-md hover:scale-105 transition">
              <h2 className="text-xl font-semibold text-yellow-900 mb-2">Fresh Dairy & Grains</h2>
              <p className="mb-4 text-sm text-yellow-800">Pure milk, ghee, wheat, pulses and more—straight from the source</p>
              <button className="bg-white text-yellow-800 font-medium px-4 py-2 rounded-md">Order Now</button>
            </div>
          </div>

        </div>
      </div>

      <div className="flex justify-center">
        <main className="flex-grow max-w-7xl mx-40 min-h-screen pb-10 px-4 bg-white">

          {Object.keys(groupedCrops).length === 0 ? (
            <p className="text-center text-green-900 text-base font-medium">
              No products available right now.
            </p>
          ) : (
            Object.entries(groupedCrops).map(([type, products]) => (
              <section key={type} className="mb-12">
                <h2 className="text-xl font-bold text-green-700 mb-4 capitalize">
                  {type}
                </h2>
                <ScrollableSection sectionId={`section-${type}`}>
                  {products.map((crop) => (
                    <div
                      key={crop._id}
                      className="snap-start bg-white/80 backdrop-blur-sm border border-green-100 shadow hover:shadow-md hover:scale-[1.02] transition-all duration-200 rounded-lg p-2 flex flex-col w-48 flex-shrink-0"
                    >
                      <img
                        src={crop.image}
                        alt={crop.name}
                        className="w-full h-24 object-cover rounded-md mb-2"
                        loading="lazy"
                      />
                      <h3 className="text-sm font-semibold text-gray-800 mb-1 truncate">
                        {crop.name}
                      </h3>
                      <p className="text-green-700 text-sm font-bold mb-1">
                        ₹{crop.price}
                      </p>


                      <p className="text-xs text-gray-600 mb-2">
                        {crop.quantity}
                      </p>

                      <button
                        onClick={() => {
                          if (!userName) {
                            navigate('/login');
                          } else {
                            addToCart(crop);
                          }
                        }}
                        className="mt-auto bg-green-800 text-white py-1 px-2 rounded text-xs font-medium hover:bg-green-600"
                      >
                        🛒 Add
                      </button>

                    </div>
                  ))}
                </ScrollableSection>
              </section>

            ))
          )}
        </main>

      </div>




      <Footer />


      <div
        className={`fixed top-28 right-0 h-[calc(100vh-8rem)] w-80 bg-white shadow-lg transform transition-transform rounded z-20 ${isCartOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        aria-label="Shopping cart drawer"
      >
        <div className="p-6 flex flex-col h-full min-h-0">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-green-900">Your Cart</h2>
            <button
              onClick={() => setIsCartOpen(false)}
              aria-label="Close Cart"
              className="text-green-900 font-bold text-xl hover:text-green-700"
            >
              &times;
            </button>
          </div>

          {cart.length === 0 ? (
            <p className="text-gray-600 flex-grow flex items-center justify-center">
              Your cart is empty.
            </p>
          ) : (
            <div className="flex-grow overflow-y-auto">
              {cart.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between mb-4 border-b pb-2"
                >
                  <div>
                    <h3 className="font-semibold text-green-900">
                      {item.name} ({item.quantity})
                    </h3>
                    <p className="text-sm text-gray-600">
                      Qty: {item.quantityInCart} × ₹{item.price}
                    </p>

                  </div>
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="text-red-500 font-semibold hover:text-red-700"
                    aria-label={`Remove ${item.name} from cart`}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 border-t pt-4">
            <p className="text-lg font-bold text-green-900">
              Total: ₹{totalPrice.toFixed(2)}
            </p>
            <button
              disabled={cart.length === 0}
              onClick={() => {
                navigate('/checkout');
                setIsCartOpen(false);
              }}
              className={`w-full mt-3 py-3 rounded-lg font-bold text-white ${cart.length === 0
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-700 hover:bg-green-800'
                }`}
              aria-disabled={cart.length === 0}
              aria-label="Proceed to Checkout"
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
