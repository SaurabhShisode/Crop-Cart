import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';


ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface Crop {
  _id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  _id: string;
  cropName: string;
  quantity: number;
  buyerName: string;
  deliveryDate: string;
}

interface StatsData {
  date: string;
  orders: number;
  earnings: number;
}

const FarmerDashboard: React.FC = () => {
  const [crops, setCrops] = useState<Crop[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<StatsData[]>([]);
  

  useEffect(() => {
    // Simulated fetches – replace with real API calls
    const fetchCrops = async () => {
      const res = await fetch('/api/farmer/crops'); // Replace with your endpoint
      const data = await res.json();
      setCrops(data);
    };

    const fetchOrders = async () => {
      const res = await fetch('/api/farmer/orders'); // Replace with your endpoint
      const data = await res.json();
      setOrders(data);
    };

    const fetchStats = async () => {
      const res = await fetch('/api/farmer/stats'); // Replace with your endpoint
      const data = await res.json();
      setStats(data);
    };

    fetchCrops();
    fetchOrders();
    fetchStats();
  }, []);

  const ordersChartData = {
    labels: stats.map((item) => item.date),
    datasets: [
      {
        label: 'Orders',
        data: stats.map((item) => item.orders),
        backgroundColor: '#34d399',
      },
    ],
  };

  const earningsChartData = {
    labels: stats.map((item) => item.date),
    datasets: [
      {
        label: 'Earnings (₹)',
        data: stats.map((item) => item.earnings),
        backgroundColor: '#059669',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: (ctx: any) => `${ctx.dataset.label}: ₹${ctx.parsed.y}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="min-h-screen p-8 bg-green-50">
      <h1 className="text-4xl font-bold text-green-900 mb-8">Farmer Dashboard</h1>

      {/* Crops Uploaded */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-green-800 mb-4">Your Crops</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {crops.map((crop) => (
            <div
              key={crop._id}
              className="bg-white border border-green-200 p-4 rounded-lg shadow hover:shadow-md transition"
            >
              <h3 className="text-lg font-bold text-green-700">{crop.name}</h3>
              <p className="text-sm text-gray-600">Price: ₹{crop.price}</p>
              <p className="text-sm text-gray-600">Quantity: {crop.quantity} kg</p>
            </div>
          ))}
        </div>
      </section>

      {/* Orders to Fulfill */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-green-800 mb-4">Pending Orders</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-green-200 rounded-lg shadow">
            <thead>
              <tr className="bg-green-100 text-left">
                <th className="p-3">Crop</th>
                <th className="p-3">Quantity</th>
                <th className="p-3">Buyer</th>
                <th className="p-3">Delivery Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-t border-green-100">
                  <td className="p-3">{order.cropName}</td>
                  <td className="p-3">{order.quantity} kg</td>
                  <td className="p-3">{order.buyerName}</td>
                  <td className="p-3">{order.deliveryDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Charts Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
        <div className="bg-white p-6 shadow rounded-lg border">
          <h3 className="text-lg font-bold text-green-800 mb-4">Orders Over Last 30 Days</h3>
          <Bar data={ordersChartData} options={chartOptions} />
        </div>

        <div className="bg-white p-6 shadow rounded-lg border">
          <h3 className="text-lg font-bold text-green-800 mb-4">Earnings Over Last 30 Days</h3>
          <Bar data={earningsChartData} options={chartOptions} />
        </div>
      </section>
    </div>
  );
};

export default FarmerDashboard;
