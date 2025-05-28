
import React, { useEffect, useState } from 'react';

const MyOrders: React.FC = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    
    fetch('/api/orders') 
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch((err) => console.error('Error fetching orders:', err));
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">My Orders</h1>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <ul>
          {orders.map((order) => (
            <li key={order.id} className="mb-2">
              Order #{order.id} - {order.status}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyOrders;
