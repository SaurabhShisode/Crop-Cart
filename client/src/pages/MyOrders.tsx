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
import BouncingDotsLoader from '../components/BouncingDotsLoader';
import NoOrderIcon from '../assets/icons/noOrders.svg';


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
  fulfilled: boolean;
  fulfilledAt: string | null;
  deliveryTime: number;
}
const downloadInvoice = (order: Order) => {
  const doc = new jsPDF();

 
  const marginLeft = 20;
  const marginRight = 190;
  let currentY = 20;


  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('CropCart Invoice', 105, currentY, { align: 'center' });
  currentY += 8;
  doc.setDrawColor(54, 69, 173);
  doc.setLineWidth(1);
  doc.line(marginLeft, currentY, marginRight, currentY);
  currentY += 8;


  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  const details = [
    `Order ID: ${order._id}`,
    `Name: ${order.name}`,
    `Email: ${order.email}`,
    `Phone: ${order.phone}`,
    `Address: ${order.address}`,
    `Order Date: ${new Date(order.createdAt).toLocaleString('en-GB')}`,
    order.fulfilledAt ? `Fulfilled At: ${new Date(order.fulfilledAt).toLocaleString('en-GB')}` : undefined,
    `Delivery Time: ${order.deliveryTime} min`
  ].filter(Boolean) as string[];

  details.forEach((line, i) => {
    doc.text(line, marginLeft, currentY + i * 7);
  });
  currentY += details.length * 7 + 10;

  
  const itemRows = order.items.map((item, idx) => [
    idx + 1,
    item.name,
    item.quantityInCart,
    item.quantity
  ]);
  autoTable(doc, {
    head: [['#', 'Item', 'Qty in Cart', 'Unit Qty']],
    body: itemRows,
    startY: currentY,
    margin: { left: marginLeft, right: 20 },
    theme: 'grid',
    headStyles: { fillColor: [54, 69, 173], textColor: 255, fontStyle: 'bold', halign: 'center' },
    bodyStyles: { halign: 'center', fontSize: 11 },
    alternateRowStyles: { fillColor: [245, 245, 245] },
    styles: { cellPadding: 3 },
    tableLineColor: [200, 200, 200],
    tableLineWidth: 0.5,
  });


  const finalY = (doc as any).lastAutoTable.finalY + 12;
  const basePrice = parseFloat(order.total) - parseFloat(order.tax) - order.deliveryFee;
  const lineHeight = 9;

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60);


  doc.text('Base Price:', marginLeft, finalY);
  doc.text('Tax:', marginLeft, finalY + lineHeight);
  doc.text('Delivery Fee:', marginLeft, finalY + 2 * lineHeight);


  doc.text(`Rs ${basePrice.toFixed(2)}`, marginRight, finalY, { align: 'right' });
  doc.text(`Rs ${parseFloat(order.tax).toFixed(2)}`, marginRight, finalY + lineHeight, { align: 'right' });
  doc.text(`Rs ${order.deliveryFee.toFixed(2)}`, marginRight, finalY + 2 * lineHeight, { align: 'right' });


  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('Total:', marginLeft, finalY + 3 * lineHeight + 4);
  doc.text(`Rs ${parseFloat(order.total).toFixed(2)}`, marginRight, finalY + 3 * lineHeight + 4, { align: 'right' });

  
  doc.setFontSize(10);
  doc.setTextColor(120);
  doc.text('Thank you for shopping with CropCart!', 105, 285, { align: 'center' });
  doc.text('For support: cropcartorder@gmail.com | +91-12345-67890', 105, 292, { align: 'center' });

  doc.save(`Invoice_${order._id}.pdf`);
};
const MyOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'pending' | 'completed'>('pending');

  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);

  const handleDeleteClick = (orderId: string) => {
    const order = orders.find((o) => o._id === orderId);
    if (order) {
      setOrderToDelete(order);
      setShowDeleteModal(true);
    }
  };


  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
  };

  const handleConfirmDelete = async () => {
    if (!orderToDelete) return;

    try {
      const userData = localStorage.getItem('cropcartUser');
      if (!userData) throw new Error('User not authenticated');

      const user = JSON.parse(userData);
      const token = user.token;

      const res = await fetch(`https://crop-cart-backend.onrender.com/api/orders/${orderToDelete._id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Failed to cancel order');
      }

      toast.success('Order deleted successfully');
      setOrders((prev) => prev.filter((o) => o._id !== orderToDelete._id));
      setShowDeleteModal(false);
      setOrderToDelete(null);
    } catch (err: any) {
      toast.error(err.message || 'Error cancelling order', {
        style: { background: '#14532d', color: 'white' },
      });
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

        await Promise.all(
          data.map(async (order: Order) => {
            if (order.fulfilled) return;

            const createdAt = new Date(order.createdAt).getTime();
            const deliveryMs = (order.deliveryTime || 30) * 60 * 1000;
            const now = Date.now();

            const shouldBeFulfilled = now >= createdAt + deliveryMs;

            if (shouldBeFulfilled) {
              try {
                const fulfillRes = await fetch(`https://crop-cart-backend.onrender.com/api/orders/${order._id}/fulfill`, {
                  method: 'PATCH',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                  },
                });

                if (!fulfillRes.ok) {
                  const errorData = await fulfillRes.json();
                  if (errorData.message !== 'Order already fulfilled') {
                    console.warn(`Failed to fulfill order ${order._id}: ${errorData.message}`);
                  }
                }
              } catch (err) {
                console.error(`Error fulfilling order ${order._id}:`, err);
              }
            }
          })
        );

      } catch (error: any) {
        toast.error(error.message || 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  const isOrderCompleted = (order: Order) => {
    const placedTime = new Date(order.createdAt).getTime();
    const now = new Date().getTime();
    const deliveryTimeMs = order.deliveryTime * 60 * 1000;

    return now >= placedTime + deliveryTimeMs;
  };


  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const onLogout = () => {
    localStorage.removeItem('cropcartUser');
    toast.success('Logged out successfully');
    navigate('/home');
  };


  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <nav className="flex justify-between items-center px-3 sm:px-6 py-5 sm:py-7 bg-white shadow-sm sticky top-0 z-50">
        <div
          className="flex items-center space-x-2 text-xl sm:text-2xl font-extrabold text-green-700 cursor-pointer select-none dark:text-green-400"
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




      {/* Orders Section */}
      <main className="pt-12 sm:pt-22 pb-24 sm:pb-28 max-w-6xl mx-auto px-3 sm:px-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-green-900 dark:text-green-300 mb-6 sm:mb-8">
          My Orders
        </h1>
        <div className="flex mb-6 mt-4 gap-4">
  <button
    onClick={() => setFilterStatus('pending')}
    className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-semibold text-sm sm:text-base ${
      filterStatus === 'pending'
        ? 'bg-green-600 text-white'
        : 'bg-gray-200 text-gray-700'
    }`}
  >
    Pending
  </button>
  <button
    onClick={() => setFilterStatus('completed')}
    className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-semibold text-sm sm:text-base ${
      filterStatus === 'completed'
        ? 'bg-green-600 text-white'
        : 'bg-gray-200 text-gray-700'
    }`}
  >
    Completed
  </button>
</div>

        {loading ? (
          <div className="flex justify-center items-center">

            <BouncingDotsLoader />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center text-gray-600 dark:text-gray-400 text-sm sm:text-lg">
            <img
              src={NoOrderIcon}
              alt="No orders"
              className="mx-auto w-36 h-36"
            />
            You haven’t placed any orders yet.
          </div>

        ) : (
          <div className="grid gap-6">
            {orders
              .filter(order => {
                const completed = isOrderCompleted(order);
                return filterStatus === 'completed' ? completed : !completed;
              })

              .map((order) => {
                const total = parseFloat(order.total);
                const tax = parseFloat(order.tax);
                const delivery = order.deliveryFee;
                const basePrice = total - tax - delivery;
                const isExpanded = expandedOrderId === order._id;
                const completed = isOrderCompleted(order);
                const status = completed ? 'completed' : 'pending';


                return (
                  <div
                    key={order._id}
                    onClick={() => toggleOrderDetails(order._id)}
                    className={`relative bg-white border border-2 border-green-900/60 sm:border-none rounded-xl p-6 sm:p-6 sm:pt-9 shadow hover:shadow-lg transition-all duration-300 text-sm sm:text-base cursor-pointer`}
                  >

                    <span
                      className={`absolute top-2 right-2 text-xs px-2 py-1 rounded-full font-semibold  ${status === 'completed'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-800'
                        }`}
                    >
                      {status === 'completed' ? 'Completed' : 'Pending'}
                    </span>

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 sm:mb-4 gap-2">
                      <div>
                        <p className="text-xs sm:text-sm text-gray-500">Order ID:</p>
                        <p className="text-sm sm:text-lg font-semibold text-green-800 dark:text-green-300 break-all">
                          {order._id}
                        </p>
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="text-xs sm:text-sm text-gray-500">Placed on</p>
                        <p className="text-sm sm:text-base font-medium">
                          {new Date(order.createdAt).toLocaleString('en-GB')}
                        </p>

                        {status === 'completed' && order.fulfilledAt && (
                          <>
                            <p className="text-xs sm:text-sm text-gray-500">Delivered on</p>
                            <p className="text-sm sm:text-base font-medium">
                              {new Date(order.fulfilledAt).toLocaleString('en-GB')}
                            </p>
                          </>
                        )}


                      </div>
                    </div>

                    {/* ✅ Expanded Details */}
                    <div
                      className={`transition-all duration-500 ease-in-out overflow-hidden ${isExpanded ? 'max-h-[9999px] opacity-100 mt-4' : 'max-h-0 opacity-0'
                        }`}
                    >
                      <p className="mb-2 text-sm sm:text-base">
                        <span className="font-medium">Delivery Address:</span> {order.address}
                      </p>
                      <p className="mb-2 text-sm sm:text-base">
                        <span className="font-medium">Phone:</span> {order.phone}
                      </p>

                      <div className="mb-4">
                        <p className="font-medium mb-1">Items:</p>
                        <ul className="list-disc ml-6 space-y-1 text-xs sm:text-sm">
                          {order.items.map((item, idx) => (
                            <li key={idx}>
                              <span className="font-medium">{item.name}</span> — {item.quantityInCart} ({item.quantity})
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs sm:text-sm mt-4 border-t border-gray-200 pt-4">
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
                      </div>

                      {/* ✅ Action Buttons */}
                      <div className="flex flex-col sm:flex-row justify-start gap-2 sm:gap-3 mt-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            downloadInvoice(order);
                          }}
                          className="bg-gradient-to-br from-green-900 to-emerald-800 hover:from-green-800 hover:to-emerald-700 text-white font-medium py-1.5 px-3 rounded text-xs sm:text-sm transition duration-300"
                        >
                          Download Invoice
                        </button>

                        {status === 'pending' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteClick(order._id);
                            }}
                            className="bg-gradient-to-br from-red-900 to-red-800 hover:from-red-800 hover:to-red-700 text-white font-medium py-1.5 px-3 rounded text-xs sm:text-sm transition duration-300"
                          >
                            Cancel Order
                          </button>
                        )}
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
