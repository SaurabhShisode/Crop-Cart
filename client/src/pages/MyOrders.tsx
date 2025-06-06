import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { toast } from 'react-hot-toast';
import logo from '../assets/logo.png';
import {
  UserPlusIcon,
} from '@heroicons/react/24/outline';
import { User, } from 'lucide-react';
import Footer from '../components/Footer';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';


interface Order {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  items: Array<{ name: string; quantity: string; quantityInCart: string; }>;
  total: string;
  tax: string;
  deliveryFee: number;
  createdAt: string;
  farmerId: string;
}

const downloadInvoice = (order: Order) => {
  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('CropCart Invoice', 14, 20);

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  const details = [
    `Order ID: ${order._id}`,
    `Name: ${order.name}`,
    `Phone: ${order.phone}`,
    `Address: ${order.address}`,
    `Date: ${new Date(order.createdAt).toLocaleString('en-GB')}`,
  ];
  details.forEach((line, i) => {
    doc.text(line, 14, 30 + i * 7);
  });

  const itemRows = order.items.map((item, idx) => [
    idx + 1,
    item.name,
    item.quantityInCart,
    item.quantity,
  ]);

  autoTable(doc, {
    head: [['#', 'Item', 'Quantity in Cart', 'Quantity']],
    body: itemRows,
    startY: 30 + details.length * 7 + 10,
    headStyles: {
      fillColor: [54, 69, 173],
      textColor: 255,
      halign: 'center',
    },
    bodyStyles: {
      halign: 'center',
    },
    alternateRowStyles: { fillColor: [240, 240, 240] },
  });

  const finalY = (doc as any).lastAutoTable.finalY + 10;
  const basePrice = parseFloat(order.total) - parseFloat(order.tax) - order.deliveryFee;

  const marginLeft = 14;
  const marginRight = 200;
  const lineHeight = 8;

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60);

  doc.text('Base Price:', marginLeft, finalY);
  doc.text(`\u20B9${basePrice.toFixed(2)}`, marginRight, finalY, { align: 'right' });

  doc.text('Tax:', marginLeft, finalY + lineHeight);
  doc.text(`\u20B9${parseFloat(order.tax).toFixed(2)}`, marginRight, finalY + lineHeight, { align: 'right' });

  doc.text('Delivery Fee:', marginLeft, finalY + 2 * lineHeight);
  doc.text(`\u20B9${order.deliveryFee.toFixed(2)}`, marginRight, finalY + 2 * lineHeight, { align: 'right' });

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('Total:', marginLeft, finalY + 3 * lineHeight + 4);
  doc.text(`\u20B9${parseFloat(order.total).toFixed(2)}`, marginRight, finalY + 3 * lineHeight + 4, { align: 'right' });

  doc.save(`Invoice_${order._id}.pdf`);
};




const MyOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const [userName, setUserName] = useState<string | null>(null);

  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);

  const handleDeleteClick = (orderId: string) => {
    const order = orders.find(o => o._id === orderId);
    if (order) {
      setOrderToDelete(order);
      setShowDeleteModal(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (!orderToDelete) return;
    try {
      const userData = localStorage.getItem('cropcartUser');
      if (!userData) throw new Error('User not authenticated');

      const { token } = JSON.parse(userData);

      const res = await fetch(`https://crop-cart-backend.onrender.com/api/orders/${orderToDelete._id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Failed to delete order');
      }

      toast.success('Order deleted successfully');
      setOrders(prev => prev.filter(o => o._id !== orderToDelete._id));
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete order');
    } finally {
      setShowDeleteModal(false);
      setOrderToDelete(null);
    }
  };

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

        setUserName(user.user.name);

        const res = await fetch(`https://crop-cart-backend.onrender.com/api/orders/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
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

  const onLogout = () => {
    localStorage.removeItem('cropcartUser');
    toast.success('Logged out successfully');
    navigate('/home');
  };


  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">

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

      {/* Orders Section */}
      <main className="pt-28 pb-28 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-green-900 dark:text-green-300 mb-8">My Orders</h1>

        {loading ? (
          <div className="text-center text-green-800 dark:text-green-200">Loading your orders...</div>
        ) : orders.length === 0 ? (
          <div className="text-center text-gray-600 dark:text-gray-400 text-lg">You haven’t placed any orders yet.</div>
        ) : (
          <div className="grid gap-6">
            {orders.map((order) => {
              const total = parseFloat(order.total);
              const tax = parseFloat(order.tax);
              const delivery = order.deliveryFee;
              const basePrice = total - tax - delivery;

              return (
                <div
                  key={order._id}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Order ID:</p>
                      <p className="text-lg font-semibold text-green-800 dark:text-green-300">{order._id}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Placed on</p>
                      <p className="text-md font-medium">{new Date(order.createdAt).toLocaleString('en-GB')}</p>
                    </div>
                  </div>

                  <p className="mb-2">
                    <span className="font-medium">Delivery Address:</span> {order.address}
                  </p>
                  <p className="mb-2">
                    <span className="font-medium">Phone:</span> {order.phone}
                  </p>


                  <div className="mb-4">
                    <p className="font-medium mb-1">Items:</p>
                    <ul className="list-disc ml-6 space-y-1 text-sm">
                      {order.items.map((item, idx) => (
                        <li key={idx}>
                          <span className="font-medium">{item.name}</span> — {item.quantityInCart} ({item.quantity})
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                    <div>
                      <p className="text-gray-500">Base Price</p>
                      <p className="font-semibold">₹{basePrice.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Tax</p>
                      <p className="font-semibold">₹{tax.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Delivery</p>
                      <p className="font-semibold">₹{delivery.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Total</p>
                      <p className="font-bold text-green-700 dark:text-green-300">₹{total.toFixed(2)}</p>
                    </div>
                    <div className="flex justify-end space-x-4 mt-4">
                      <button
                        onClick={() => downloadInvoice(order)}
                        className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded transition duration-300"
                      >
                        Download Invoice
                      </button>

                      <button
                        onClick={() => handleDeleteClick(order._id)}
                        className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded transition duration-300"
                      >
                        Delete Order
                      </button>
                    </div>


                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
      {showDeleteModal && orderToDelete && (
        <ConfirmDeleteModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleConfirmDelete}
          cropName={`Order ID: ${orderToDelete._id}`}
        />
      )}
    </div>

  );

};

export default MyOrders;
