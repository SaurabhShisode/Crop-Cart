import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import Footer from '../components/Footer';

interface CartItem {
  _id: string;
  name: string;
  price: number;
  quantityInCart: number;
  quantity: string;
  farmer: string;
  cropId: string;
}

const CheckoutPage: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
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

  const totalPrice = cart.reduce((total, item) => {
    const quantityNum = (item.quantityInCart) || 0;
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

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center  px-6 text-center">
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
      <Toaster position="top-center" reverseOrder={false} />
      <div className="min-h-screen bg-white flex items-center justify-center px-6 py-10 mt-16 sm:mt-0">

        <div className="max-w-6xl w-full  rounded-2xl  grid grid-cols-1 md:grid-cols-3 gap-8   sm:p-10">
          {/* Order Summary */}

          <section className="order-1 md:order-1 md:col-span-1 bg-green-900 border  rounded-xl p-4 md:p-6 shadow-2xl">
            <h2 className="text-lg md:text-2xl font-bold text-white mb-4 md:mb-6">Order Summary</h2>

            <ul className="divide-y divide-white">
              {cart.map(item => {
                const quantityNum = item.quantityInCart || 0;
                return (
                  <li key={item._id} className="py-2 md:py-4 flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-white text-sm md:text-base">
                        {item.name} ({item.quantity})
                      </p>
                      <div className="flex items-center space-x-2 mt-1 bg-green-700 rounded w-[75px]">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item._id, quantityNum - 1)}
                          className="px-2 py-1  text-white rounded text-xs font-bold "
                          disabled={quantityNum <= 0}
                        >
                          −
                        </button>
                        <span className="text-white text-sm font-bold">{quantityNum}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item._id, quantityNum + 1)}
                          className="px-2 py-1  text-white rounded text-xs font-bold "
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <p className="font-semibold text-white text-sm md:text-base">
                      ₹{(item.price * quantityNum).toFixed(2)}
                    </p>
                  </li>
                );
              })}
            </ul>


            <div className="border-t border-white mt-4 md:mt-6 pt-3 md:pt-4 space-y-1 text-white">
              <div className="flex justify-between items-center text-sm md:text-base">
                <span className="font-semibold">Base Price:</span>
                <span className="font-semibold">₹{totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-sm md:text-base">
                <span className="font-semibold">Taxes:</span>
                <span className="font-semibold">₹{(totalPrice * 0.18).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-sm md:text-base">
                <span className="font-semibold">Delivery Fee:</span>
                {totalPrice > 299 ? (
                  <span>
                    <span className="line-through text-white/50 mr-1 md:mr-2 font-semibold">₹50.00</span>
                    <span className="text-white font-semibold">₹0.00</span>
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

          <section className="order-2 md:order-2 md:col-span-2 p-6 bg-green-50 rounded-xl shadow-2xl">

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
                {loading ? 'Placing Order...' : 'Place Order'}
              </button>
            </form>
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CheckoutPage;