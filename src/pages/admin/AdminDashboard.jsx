import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  ShoppingCartIcon, 
  PackageIcon, 
  UsersIcon, 
  DollarSignIcon,
  TrendingUpIcon,
  ArchiveIcon,
  ClipboardCheckIcon
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import AdminLayout from '../../layouts/AdminLayout';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    totalProducts: 0,
    totalRevenue: 0,
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real application, you would fetch this data from your backend
    // For now, we'll simulate the API calls with setTimeout
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch products data
        const productsResponse = await axios.get('http://localhost:8000/api/product/show-product');
        const products = productsResponse.data?.data || [];
        
        // For demo purposes, we'll fake the orders and revenue data
        // In a real app, you would fetch this from your orders endpoint
        setStats({
          totalOrders: 124,
          pendingOrders: 18,
          totalProducts: products.length,
          totalRevenue: 152850,
        });

        // Fake recent orders for display
        setRecentOrders([
          { id: 1, customer: 'John Doe', date: '2025-03-10', status: 'Delivered', total: 3800 },
          { id: 2, customer: 'Jane Smith', date: '2025-03-11', status: 'Pending', total: 6290 },
          { id: 3, customer: 'Robert Johnson', date: '2025-03-11', status: 'Pending', total: 5900 },
          { id: 4, customer: 'Emily Davis', date: '2025-03-12', status: 'Delivered', total: 4590 },
          { id: 5, customer: 'Michael Brown', date: '2025-03-12', status: 'Delivered', total: 2890 },
        ]);

        // Mock data for monthly sales chart
        setSalesData([
          { month: 'Jan', sales: 48000 },
          { month: 'Feb', sales: 52000 },
          { month: 'Mar', sales: 61000 },
          { month: 'Apr', sales: 42780 },
          { month: 'May', sales: 51890 },
          { month: 'Jun', sales: 62390 },
          { month: 'Jul', sales: 73490 },
        ]);

        // Mock data for product categories chart
        setProductData([
          { name: 'Sneakers', value: 45 },
          { name: 'Sports', value: 25 },
          { name: 'Sandals', value: 10 },
          { name: 'Slippers', value: 5 },
        ]);

        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <AdminLayout>
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <ShoppingCartIcon className="text-blue-600" size={24} />
                </div>
                <div className="ml-4">
                  <h3 className="text-gray-500 text-sm font-medium">Total Orders</h3>
                  <p className="text-2xl font-semibold">{stats.totalOrders}</p>
                </div>
              </div>
              <div className="flex items-center mt-4 text-green-500">
                <TrendingUpIcon size={16} />
                <span className="ml-1 text-sm">12% increase this month</span>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="bg-green-100 p-3 rounded-lg">
                  <DollarSignIcon className="text-green-600" size={24} />
                </div>
                <div className="ml-4">
                  <h3 className="text-gray-500 text-sm font-medium">Total Revenue</h3>
                  <p className="text-2xl font-semibold">{formatCurrency(stats.totalRevenue)}</p>
                </div>
              </div>
              <div className="flex items-center mt-4 text-green-500">
                <TrendingUpIcon size={16} />
                <span className="ml-1 text-sm">8% increase this month</span>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="bg-yellow-100 p-3 rounded-lg">
                  <ClipboardCheckIcon className="text-yellow-600" size={24} />
                </div>
                <div className="ml-4">
                  <h3 className="text-gray-500 text-sm font-medium">Pending Orders</h3>
                  <p className="text-2xl font-semibold">{stats.pendingOrders}</p>
                </div>
              </div>
              <div className="flex items-center mt-4 text-red-500">
                <ArchiveIcon size={16} />
                <span className="ml-1 text-sm">Needs attention</span>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <PackageIcon className="text-purple-600" size={24} />
                </div>
                <div className="ml-4">
                  <h3 className="text-gray-500 text-sm font-medium">Total Products</h3>
                  <p className="text-2xl font-semibold">{stats.totalProducts}</p>
                </div>
              </div>
              <div className="flex items-center mt-4 text-purple-500">
                <UsersIcon size={16} />
                <span className="ml-1 text-sm">4 categories</span>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">Monthly Sales</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="sales" 
                      stroke="#3B82F6" 
                      strokeWidth={2} 
                      activeDot={{ r: 8 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">Product Categories</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={productData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#8B5CF6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold">Recent Orders</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.customer}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(order.total)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <a href={`/orders/${order.id}`} className="text-blue-600 hover:text-blue-900">View</a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 border-t">
              <a href="/orders" className="text-blue-600 text-sm hover:underline">View all orders</a>
            </div>
          </div>
        </>
      )}
    </div>
    </AdminLayout>
  );
};

export default AdminDashboard;

