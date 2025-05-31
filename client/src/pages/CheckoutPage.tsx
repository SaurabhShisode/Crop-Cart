import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

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
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
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

  // Convert quantityInCart string to a number for calculations, default 0 if parse fails
  const totalPrice = cart.reduce((total, item) => {
    const quantityNum = parseFloat(item.quantityInCart) || 0;
    return total + item.price * quantityNum;
  }, 0);

  const handlePlaceOrder = () => {
    if (!name || !email || !address) {
      toast.error('Please fill in all fields.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success('Order placed successfully!');
      localStorage.removeItem('cart');
      setCart([]);
      setName('');
      setEmail('');
      setAddress('');
      navigate('/home');
    }, 1500);
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
                  className="w-full border border-green-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-600 resize-none transition"
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
