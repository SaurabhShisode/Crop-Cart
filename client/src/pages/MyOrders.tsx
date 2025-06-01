import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

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

  if (loading) return <div className="p-6 text-center text-green-800">Loading your orders...</div>;

  if (orders.length === 0) {
    return <div className="p-6 text-center text-green-800">You have no orders yet.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-green-900">My Orders</h1>
      <ul className="space-y-6">
        {orders.map(order => (
          <li key={order._id} className="border border-green-300 rounded-lg p-4 shadow-sm bg-white">
            <p><strong>Order ID:</strong> {order._id}</p>
            <p><strong>Placed on:</strong> {new Date(order.createdAt).toLocaleString()}</p>
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
    </div>
  );
};

export default MyOrders;
