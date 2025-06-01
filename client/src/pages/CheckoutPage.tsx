import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantityInCart: string;
  quantity: string;
}

interface DeliveryAddress {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  latitude: number;
  longitude: number;
}

const CheckoutPage: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  // New address fields:
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Google autocomplete ref
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const addressInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    // Load cart from localStorage same as before
    const storedUser = localStorage.getItem('cropcartUser');
    if (storedUser) {
      try {
        const data = JSON.parse(storedUser);
        const userId = data?.user?.id;
        if (userId) {
          const cartKey = `cart_${userId}`;
          const storedCart = localStorage.getItem(cartKey);
          if (storedCart) {
            setCart(JSON.parse(storedCart));
          }
        }
      } catch (err) {
        console.error('Error reading cart from localStorage:', err);
      }
    }
  }, []);

  // Initialize Google Places Autocomplete when input is ready
  useEffect(() => {
    if (addressInputRef.current && !autocompleteRef.current && window.google) {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(addressInputRef.current, {
        types: ['address'],
        componentRestrictions: { country: 'in' }, // restrict to India, adjust as needed
      });

      autocompleteRef.current.setFields(['address_component', 'geometry']);

      autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current?.getPlace();

        if (!place || !place.geometry || !place.geometry.location) {
          toast.error('Please select a valid address from suggestions.');
          return;
        }

        // Reset fields before filling
        setStreet('');
        setCity('');
        setState('');
        setPostalCode('');
        setLatitude(place.geometry.location.lat());
        setLongitude(place.geometry.location.lng());


        // Parse address components
        if (place.address_components) {
          const comp = place.address_components;

          // Helper to get component by type
          const getComp = (type: string) => comp.find(c => c.types.includes(type))?.long_name || '';

          setStreet(
            [
              getComp('street_number'),
              getComp('route'),
            ].filter(Boolean).join(' ').trim()
          );
          setCity(getComp('locality') || getComp('sublocality') || '');
          setState(getComp('administrative_area_level_1'));
          setPostalCode(getComp('postal_code'));
        }
      });
    }
  }, []);

  const totalPrice = cart.reduce((total, item) => {
    const quantityNum = parseFloat(item.quantityInCart) || 0;
    return total + item.price * quantityNum;
  }, 0);

  const handlePlaceOrder = async () => {
    // Validate required fields + lat/lng
    if (!name || !email || !street || !city || !state || !postalCode || latitude === null || longitude === null) {
      toast.error('Please fill in all address fields and select a valid address.');
      return;
    }

    setLoading(true);

    try {
      const storedUser = localStorage.getItem('cropcartUser');
      const userId = storedUser ? JSON.parse(storedUser)?.user?.id : null;

      const deliveryAddress: DeliveryAddress = {
        street,
        city,
        state,
        postalCode,
        latitude,
        longitude,
      };

      const orderData = {
        userId,
        name,
        email,
        deliveryAddress,
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

      if (!response.ok) throw new Error('Failed to place order.');

      toast.success('Order placed successfully!');
      if (userId) {
        localStorage.removeItem(`cart_${userId}`);
      }
      setCart([]);
      setName('');
      setEmail('');
      setStreet('');
      setCity('');
      setState('');
      setPostalCode('');
      setLatitude(null);
      setLongitude(null);
      navigate('/home');
    } catch (err) {
      console.error(err);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 px-6 text-center">
        <h2 className="text-3xl font-semibold text-gray-700 mb-4">Your cart is empty</h2>
        <p className="text-gray-500">Please add some items to your cart before checking out.</p>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="min-h-screen bg-green-50 flex items-center justify-center px-6 py-10">
        <div className="max-w-6xl w-full bg-white rounded-2xl shadow-lg grid grid-cols-1 md:grid-cols-3 gap-8 p-10">
          {/* Order Summary */}
          <aside className="md:col-span-1 bg-green-100 border border-green-200 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-green-900 mb-6">Order Summary</h2>
            <ul className="divide-y divide-green-300">
              {cart.map(item => {
                const quantityNum = parseFloat(item.quantityInCart) || 0;
                return (
                  <li key={item.id} className="py-4 flex justify-between">
                    <div>
                      <p className="font-semibold text-green-800">{item.name} ({item.quantity})</p>
                      <p className="text-sm text-green-700">Qty: {item.quantityInCart}</p>
                    </div>
                    <p className="font-semibold text-green-900">
                      ₹{(item.price * quantityNum).toFixed(2)}
                    </p>
                  </li>
                );
              })}
            </ul>
            <div className="border-t border-green-300 mt-6 pt-4 space-y-1 text-green-900">
              <div className="flex justify-between items-center">
                <span className="text-base">Base Price:</span>
                <span>₹{totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-base">Taxes:</span>
                <span>₹{(totalPrice * 0.18).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-base">Delivery Fee:</span>
                <span>₹50.00</span>
              </div>
              <div className="flex justify-between items-center font-bold text-xl border-t border-green-300 pt-2 mt-2">
                <span>Total:</span>
                <span>₹{(totalPrice * 1.18 + 50).toFixed(2)}</span>
              </div>
            </div>
          </aside>

          {/* Shipping Details */}
          <section className="md:col-span-2 p-6 border border-green-200 rounded-xl">
            <h2 className="text-2xl font-bold text-green-900 mb-6">Shipping Details</h2>
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
                  className="w-full border border-green-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-600 transition"
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
                  className="w-full border border-green-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-600 transition"
                />
              </div>

              {/* Address autocomplete input */}
              <div>
                <label htmlFor="address-autocomplete" className="block text-green-800 font-medium mb-2">
                  Search Address (Autocomplete)
                </label>
                <input
                  id="address-autocomplete"
                  type="text"
                  ref={addressInputRef}
                  placeholder="Start typing your address..."
                  className="w-full border border-green-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-600 transition"
                />
                <p className="text-sm text-green-700 mt-1 italic">
                  Please select an address from the suggestions.
                </p>
              </div>

              {/* Show detailed address fields (read-only, filled from autocomplete) */}
              <div>
                <label className="block text-green-800 font-medium mb-2">Street Address</label>
                <input
                  type="text"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  required
                  placeholder="Street Address"
                  className="w-full border border-green-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-600 transition"
                />
              </div>

              <div>
                <label className="block text-green-800 font-medium mb-2">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                  placeholder="City"
                  className="w-full border border-green-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-600 transition"
                />
              </div>

              <div>
                <label className="block text-green-800 font-medium mb-2">State</label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  required
                  placeholder="State"
                  className="w-full border border-green-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-600 transition"
                />
              </div>

              <div>
                <label className="block text-green-800 font-medium mb-2">Postal Code</label>
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  required
                  placeholder="Postal Code"
                  className="w-full border border-green-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-600 transition"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-green-900 text-white py-3 rounded-lg font-semibold shadow hover:bg-green-800 transition duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
              >
                {loading ? 'Placing Order...' : 'Place Order'}
              </button>
            </form>
          </section>
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;
