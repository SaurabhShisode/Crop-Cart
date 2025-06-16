import axios from "axios";
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPinIcon,
  MagnifyingGlassIcon,
  UserPlusIcon,
} from '@heroicons/react/24/outline';
import { ShoppingCart, User, ArrowLeft, ArrowRight } from 'lucide-react';
import veggiesImage from '../assets/veggies.jpg';
import logo from '../assets/logo.png';
import Footer from '../components/Footer';
import {
  faBars,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import BouncingDotsLoader from '../components/BouncingDotsLoader';
import { motion } from 'framer-motion';
import NearbyCrops from '../components/NearbyCrops';
import { StandaloneSearchBox } from '@react-google-maps/api';



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
        className="overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-hide flex gap-4 py-2 px-4"
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
  toggleMobileCart: () => void;
  location: string;
  setLocation: React.Dispatch<React.SetStateAction<string>>;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  onLocationSelect?: (coords: { lat: number; lng: number }) => void;
}> = ({
  userName,
  onLogout,
  cartCount,
  toggleCart,
  toggleMobileCart,
  location,
  setLocation,
  searchQuery,
  setSearchQuery,
  onLocationSelect,
}) => {
    const navigate = useNavigate();
    const dropdownRef = useRef<HTMLDivElement>(null);
    const searchBoxRef = useRef<any>(null);

    const handlePlacesChanged = () => {
      const places = searchBoxRef.current?.getPlaces();
      if (places?.length) {
        const place = places[0];
        const locationName = place.formatted_address;
        const lat = place.geometry?.location?.lat();
        const lng = place.geometry?.location?.lng();

        if (locationName && lat !== undefined && lng !== undefined) {
          setLocation(locationName);
          onLocationSelect?.({ lat, lng });
        }
      }
    };

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const placeholders = [
      'Search for wheat...',
      'Search for milk...',
      'Search for butter...',
    ];
    const [placeholderIndex, setPlaceholderIndex] = useState(0);
    const [fade, setFade] = useState(true);

    useEffect(() => {
      const interval = setInterval(() => {
        setFade(false);
        setTimeout(() => {
          setPlaceholderIndex((i) => (i + 1) % placeholders.length);
          setFade(true);
        }, 300);
      }, 3000);
      return () => clearInterval(interval);
    }, []);

    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
          setDropdownOpen(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);






    return (
      <>
        <nav className="flex justify-between items-center px-6 py-6 md:py-7 bg-white shadow-lg sticky top-0 z-50">
          {/* Logo */}
          <div
            className="flex items-center gap-2 text-2xl font-extrabold text-green-700 cursor-pointer"
            onClick={() => navigate('/')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && navigate('/')}
          >
            <img src={logo} alt="CropCart Logo" className="w-8 h-8" />
            <span>CropCart</span>
          </div>

          {/* Desktop Inputs */}
          <div className="hidden lg:flex items-center space-x-8">
            {/* Displayed location */}
            <div className="flex items-center gap-2 bg-green-50 text-green-800 px-4 py-2 rounded-md shadow-sm w-56">
              <MapPinIcon className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
              <span className="font-semibold truncate overflow-hidden whitespace-nowrap">
                {location}
              </span>
            </div>



            {/* Address input with autocomplete */}
            <StandaloneSearchBox
              onLoad={(ref) => (searchBoxRef.current = ref)}
              onPlacesChanged={handlePlacesChanged}
            >
              <input
                type="text"
                placeholder="Select Location"
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 w-full sm:w-64"
              />
            </StandaloneSearchBox>

            {/* Product search bar */}
            <div className="relative">
              <input
                type="text"
                className="px-4 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-transparent text-black placeholder-transparent"
                placeholder="Search for products"
                aria-label="Search for products"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {!searchQuery && (
                <span
                  className={`absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 transition-opacity duration-300 pointer-events-none ${fade ? "opacity-100" : "opacity-0"}`}
                >
                  {placeholders[placeholderIndex]}
                </span>
              )}
              <MagnifyingGlassIcon className="w-5 h-5 absolute right-2 top-2.5 text-gray-500" aria-hidden="true" />
            </div>

            {/* Cart */}
            <div
              className="relative cursor-pointer"
              onClick={toggleCart}
              aria-label="Toggle cart"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && toggleCart()}
            >
              <ShoppingCart className="w-7 h-7 text-green-800 hover:text-green-600" aria-hidden="true" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-green-700 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </div>
          </div>


          {/* Right side */}
          <div className="flex items-center gap-6 md:gap-6">

            <div
              className="relative cursor-pointer lg:hidden"
              onClick={toggleMobileCart}
              aria-label="Toggle cart"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && toggleMobileCart()}
            >
              <ShoppingCart
                className="w-7 h-7 text-green-800 hover:text-green-600 translate-y-[-2.5px]"
                aria-hidden="true"
              />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-green-700 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </div>

            {/* User / Auth Buttons */}
            <div className=" items-center lg:space-x-4">
              {userName ? (
                <div className="flex items-center gap-3">
                  <span className="hidden lg:flex font-semibold text-green-700 text-lg">Hi, {userName}</span>
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
                        className="absolute right-0 mt-2 w-48 bg-white border border-black/20 rounded-md shadow-lg z-50"
                        role="menu"
                        aria-orientation="vertical"
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
                </div>

              ) : (
                <div className=" hidden sm:flex flex items-center gap-4">
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
                </div>

              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button className="lg:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <FontAwesomeIcon icon={mobileMenuOpen ? faTimes : faBars} className="text-green-800 text-xl" />
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden absolute top-20 md:top-[86px] left-0 w-full bg-white shadow-md px-6 py-4 space-y-4 z-50">
              <div className="flex items-center gap-2">
                <MapPinIcon className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-green-800">{location}</span>
              </div>
              <StandaloneSearchBox
              onLoad={(ref) => (searchBoxRef.current = ref)}
              onPlacesChanged={handlePlacesChanged}
            >
              <input
                type="text"
                placeholder="Select Location"
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 w-full sm:w-64"
              />
            </StandaloneSearchBox>


              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className=" w-full px-4 py-2 pr-10 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-transparent text-black placeholder-transparent"
                  placeholder="Search for products"
                />
                {!searchQuery && (
                  <span
                    className={`absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 transition-opacity duration-300 pointer-events-none ${fade ? "opacity-100" : "opacity-0"
                      }`}
                  >
                    {placeholders[placeholderIndex]}
                  </span>
                )}
                <MagnifyingGlassIcon className="w-5 h-5 absolute right-3 top-2.5 text-gray-500" />
              </div>
            </div>
          )}
        </nav>
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
  location: {
    latitude: number;
    longitude: number;
  };
};



type CartItem = Crop & {
  quantityInCart: number;
};

const Home: React.FC = () => {
  const [crops, setCrops] = useState<Crop[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [location, setLocation] = useState<string>('Enter your area or city');
  const [searchQuery, setSearchQuery] = useState('');
  const [mealTime, setMealTime] = useState('lunch');
  const [mealName, setMealName] = useState('');
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loadingIngredients, setLoadingIngredients] = useState(false);
  const [selectedIngredients, setSelectedIngredients] = useState<Set<string>>(new Set());
  const ingredientsRef = useRef<HTMLDivElement | null>(null);
  const [selectedCoords, setSelectedCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [nearbyCrops, setNearbyCrops] = useState<Crop[]>([]);

  const navigate = useNavigate();


  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        ingredientsRef.current &&
        !ingredientsRef.current.contains(event.target as Node)
      ) {
        setIngredients([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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

  useEffect(() => {
    const hour = new Date().getHours();

    if (hour >= 4 && hour < 11) {
      setMealTime("breakfast this morning");
    } else if (hour >= 11 && hour < 16) {
      setMealTime("lunch today");
    } else {
      setMealTime("dinner tonight");
    }
  }, []);

  const BACKEND_URL = 'https://crop-cart-backend.onrender.com';

  type Ingredient = {
    _id: string;
    name: string;
    price: number;
    quantity: string;
  };

  const fetchIngredientsFromBackend = async (mealName: string) => {
    if (mealName.trim().length < 3) {
      setIngredients([]);
      return;
    }
    setLoadingIngredients(true);
    try {
      const res = await axios.post(`${BACKEND_URL}/api/recipes/ingredients-from-meal`, {
        mealName,
      });

      setIngredients(res.data.matchedIngredients || []);
    } catch (error) {
      console.error('Backend fetch ingredients error:', error);
      setIngredients([]);
    } finally {
      setLoadingIngredients(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMealName(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      fetchIngredientsFromBackend(mealName);
    }
  };

  const toggleIngredientSelection = (id: string) => {
    setSelectedIngredients(prev => {
      const updated = new Set(prev);
      updated.has(id) ? updated.delete(id) : updated.add(id);
      return updated;
    });
  };

  const addSelectedIngredientsToCart = () => {
    const selectedIds = Array.from(selectedIngredients);

    selectedIds.forEach((id) => {
      const crop = crops.find((c) => c._id === id || c.name.toLowerCase() === ingredients.find(i => i._id === id)?.name.toLowerCase());
      if (crop) {
        addToCart(crop);
      }
    });

    setSelectedIngredients(new Set());
  };

  useEffect(() => {
    if (userName) {
      const storedUser = localStorage.getItem('cropcartUser');
      if (storedUser) {
        try {
          const data = JSON.parse(storedUser);
          if (data.user && data.user.id) {
            localStorage.setItem(`cart_${data.user.id}`, JSON.stringify(cart));
          }
        } catch { }
      }
    }
  }, [cart, userName]);

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/crops`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data: Crop[]) => {
        setCrops(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching crops:', err);
        setLoading(false);
      });
  }, []);

  const addToCart = (crop: Crop, shouldOpenMobileCart = false) => {
    setCart((prev) => {
      const exists = prev.find((item) => item._id === crop._id);
      if (exists) {
        return prev.map((item) =>
          item._id === crop._id
            ? { ...item, quantityInCart: item.quantityInCart + 1 }
            : item
        );
      } else {
        return [...prev, { ...crop, quantityInCart: 1 }];
      }
    });

    setIsCartOpen(false);

    if (shouldOpenMobileCart && window.innerWidth < 1012) {
      setTimeout(() => {
        setIsMobileCartOpen(true);
      }, 0);
    }
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

  const toggleCart = () => {
    setIsCartOpen((prev) => !prev);
  };

  const toggleMobileCart = () => {
    setIsMobileCartOpen((prev) => !prev);
  };

  const filteredCrops = (selectedCoords ? nearbyCrops : crops).filter((crop) =>
    crop.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );


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
        toggleMobileCart={toggleMobileCart}
        location={location}
        setLocation={setLocation}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onLocationSelect={setSelectedCoords}
      />





      <div className="flex-grow max-w-7xl mx-auto h-150 py-10 px-4">
        <div className="px-6 py-8 bg-white space-y-6">

          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-green-600 to-green-500 text-white p-6 sm:p-10 w-full h-fit sm:h-80 shadow-2xl">
            <img
              src={veggiesImage}
              alt="Fresh produce"
              className="absolute inset-0 w-full h-full object-cover opacity-80 blur-sm brightness-95 pointer-events-none z-0"
            />

            <div className="relative z-10">
              <h1 className="text-2xl sm:text-4xl font-extrabold mb-3 tracking-tight leading-snug drop-shadow-md">
                CropCart Specials
              </h1>
              <p className="text-base sm:text-lg mb-6 font-medium text-white/90 max-w-xl">
                Your trusted platform to buy farm-fresh produce directly from farmers
              </p>
              <button className="text-sm sm:text-base bg-white text-green-700 px-5 py-2 sm:px-6 sm:py-2.5 rounded-xl font-semibold shadow-lg hover:bg-green-100 transition">
                Start Shopping
              </button>
            </div>
          </div>



          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="bg-gradient-to-br from-cyan-100 to-cyan-200 p-6 rounded-3xl shadow-xl hover:scale-[1.03] transition-all duration-300 backdrop-blur-lg">
              <h2 className="text-2xl font-semibold text-cyan-900 mb-2 tracking-tight">
                Fresh Organic Vegetables Delivered
              </h2>
              <p className="mb-5 text-base text-cyan-800">
                Enjoy <span className="font-bold text-cyan-900">10% off</span> on all organic vegetables this week! 🔥
              </p>
              <button className="text-sm sm:text-base bg-white text-cyan-700 px-5 py-2 rounded-xl font-semibold shadow-md hover:bg-cyan-100 transition">
                Shop Now
              </button>
            </div>

            <div className="bg-gradient-to-br from-yellow-200 to-yellow-300 p-6 rounded-3xl shadow-xl hover:scale-[1.03] transition-all duration-300 backdrop-blur-lg">
              <h2 className="text-2xl font-semibold text-yellow-900 mb-2 tracking-tight">
                Free Delivery on Orders Over ₹299
              </h2>
              <p className="mb-5 text-base text-yellow-800">
                Get your fresh produce delivered at no extra cost! 🚚
              </p>
              <button className="text-sm sm:text-base bg-white text-yellow-800 px-5 py-2 rounded-xl font-semibold shadow-md hover:bg-yellow-100 transition">
                Start Shopping
              </button>
            </div>
          </div>


          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#2e1065] via-[#4c1d95] to-[#6b21a8] text-white p-6 sm:p-10 shadow-2xl w-full h-fit sm:h-auto">
            <div className="relative z-10 max-w-4xl mx-auto flex flex-col sm:flex-row items-center gap-8">

              {/* Text Content */}
              <div className="flex-1">
                <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight tracking-tight mb-4">
                  What’s for <span className="text-green-300">{mealTime}?</span>
                </h1>
                <p className="text-base sm:text-lg text-white/80 mb-6">
                  Type in a meal you're thinking of — like <span className="italic text-white/90">"paneer butter masala"</span>
                </p>

                {/* Input Field */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="paneer butter masala"
                    value={mealName}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    className="w-full p-4 rounded-xl border border-white/10 text-black bg-white/80 
            placeholder-gray-500 placeholder:italic placeholder:text-base 
            focus:outline-none focus:ring-4 focus:ring-green-400/60 backdrop-blur-sm transition-all duration-300"
                  />
                </div>

                {/* Loading Spinner */}
                {loadingIngredients && (
                  <div className="flex justify-center items-center mt-8 text-white/80">
                    <BouncingDotsLoader />
                  </div>

                )}

                {/* Ingredients List */}
                {!loadingIngredients && ingredients.length > 0 && (
                  <motion.div
                    ref={ingredientsRef}
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className="mt-6 bg-white/70 border border-white/20 backdrop-blur-xl text-black rounded-2xl p-6 sm:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.1)] transition-all duration-300"
                  >
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-5">
                      Suggested Ingredients
                    </h2>

                    <motion.ul className="space-y-4 max-h-64 overflow-y-auto pr-1 custom-scroll" variants={containerVariants}>
                      {ingredients.map((ing) => (
                        <motion.li
                          key={ing._id}
                          variants={itemVariants}
                          className="flex items-center justify-between bg-white px-4 py-3 rounded-xl border border-gray-200 shadow hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={selectedIngredients.has(ing._id)}
                              onChange={() => toggleIngredientSelection(ing._id)}
                              className="accent-green-600 scale-125 cursor-pointer"
                            />
                            <div className="flex flex-col text-sm sm:text-base">
                              <span className="font-semibold text-gray-900">{ing.name}</span>
                              <span className="text-gray-500 text-xs sm:text-sm">
                                {ing.quantity || '1 unit'}
                              </span>
                            </div>
                          </div>
                          <div className="text-green-700 font-semibold text-sm sm:text-base">
                            ₹{ing.price}
                          </div>
                        </motion.li>
                      ))}
                    </motion.ul>

                    <button
                      onClick={addSelectedIngredientsToCart}
                      className="mt-6 w-full bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold text-base sm:text-lg py-3 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl"
                    >
                      Add Selected to Cart
                    </button>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Soft gradient overlay for depth */}
            <div className="absolute inset-0 z-0 bg-gradient-to-t from-white/5 to-transparent pointer-events-none"></div>
          </div>
          <NearbyCrops
            selectedCoords={selectedCoords}
            onNearbyCropsChange={setNearbyCrops}

          />

        </div>

      </div>


      <div className="hidden lg:flex justify-center">
        <main className="flex-grow max-w-7xl mx-0 sm:mx-40 min-h-screen pb-10 px-4 bg-white">

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <BouncingDotsLoader />
            </div>
          ) : Object.keys(groupedCrops).length === 0 ? (
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
                      className=" snap-start bg-white/80 backdrop-blur-sm border border-black/20 shadow hover:shadow-md hover:scale-[1.02] transition-all duration-200 rounded-lg p-2 flex flex-col w-48 flex-shrink-0"
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
      <div className="lg:hidden pb-6 bg-white min-h-screen mb-10">
        <main className="max-w-4xl mx-auto space-y-10">
          {Object.keys(groupedCrops).length === 0 ? (
            <p className="text-center text-green-900 text-base font-medium">
              No products available right now.
            </p>
          ) : (
            Object.entries(groupedCrops).map(([type, products]) => (
              <section key={type}>
                <h2 className="text-lg font-bold text-green-700 mb-3 capitalize sticky top-0 bg-white z-10 px-4">
                  {type}
                </h2>
                <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2 scrollbar-hide px-4">
                  {products.map((crop) => (
                    <div
                      key={crop._id}
                      className="snap-start bg-white/80 backdrop-blur-sm border border-2 border-green-900/60 shadow hover:shadow-md transition-all duration-200 rounded-lg p-2 flex flex-col w-48 flex-shrink-0"
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
                            addToCart(crop, true);
                          }
                        }}
                        className="mt-auto bg-green-800 text-white py-1 px-2 rounded text-xs font-medium hover:bg-green-600"
                      >
                        🛒 Add
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            ))
          )}
        </main>
      </div>





      <Footer />


      <div
        className={`hidden md:flex fixed top-28 right-0 h-[calc(100vh-8rem)] w-80 bg-white shadow-lg transform transition-transform rounded z-60 ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}
        aria-label="Shopping cart drawer"
      >
        <div className="p-6 flex flex-col h-full w-full min-h-0">
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


      {isMobileCartOpen && (
        <div className="fixed inset-x-0 bottom-5 z-40 bg-green-900 p-2 rounded-xl shadow-2xl mx-4 lg:hidden">
          <div className="grid grid-cols-6 items-center gap-2">
            <div className="col-span-1 flex justify-center bg-green-700 h-full w-10 rounded">
              <ShoppingCart
                className="w-6 h-8 text-white hover:text-green-600"
                aria-hidden="true"
              />
            </div>

            <div className="col-span-2 text-xs font-medium text-white">
              <p className="font-semibold">{cartCount} {cartCount === 1 ? 'item' : 'items'}</p>
              <p className="text-sm font-bold">₹ {totalPrice.toFixed(2)}</p>
            </div>

            <button
              onClick={() => {
                setIsMobileCartOpen(false);
                navigate('/checkout');
              }}
              className="col-span-3 w-full bg-green-700 text-white py-2 rounded-md font-semibold text-sm"
            >
              Checkout
            </button>
          </div>


        </div>
      )}


    </div>
  );
};

export default Home;
