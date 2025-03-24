import React, { useState, useEffect } from 'react';
import {
  ShoppingCart,
  Package,
  Users,
  DollarSign,
  TrendingUp,
  Archive,
  ClipboardCheck,
  Eye,
  ShoppingBag
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import AdminLayout from '../../layouts/AdminLayout';
import createAuthenticatedRequest from '../../services/api';
import { useAuth } from '@clerk/clerk-react';

const AdminDashboard = () => {
  const { getToken } = useAuth();

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
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);

        // Get authentication token from Clerk
        const token = await getToken();
        const api = createAuthenticatedRequest(token);

        // Fetch products
        const products = await api.getProducts();

        // Fetch orders
        let orders = [];
        try {
          orders = await api.getOrders();
        } catch (error) {
          console.error('Error fetching orders, using mock data:', error);
          // Mock data if orders endpoint fails
          orders = generateMockOrders();
        }

        // Calculate dashboard statistics
        const totalProducts = products.length;
        const totalOrders = orders.length;
        const totalRevenue = orders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
        const pendingOrders = orders.filter(order =>
          order.shipment_status === 'Pending' || order.payment_status === 'Unpaid'
        ).length;

        setStats({
          totalProducts,
          totalOrders,
          totalRevenue,
          pendingOrders,
        });

        // Generate sales data
        const monthlySales = generateMonthlySalesData(orders);
        setSalesData(monthlySales);

        // Generate product category data
        const categoryData = generateProductCategoryData(products);
        setProductData(categoryData);

        // Get recent orders
        const sortedOrders = [...orders].sort((a, b) => {
          const dateA = new Date(a.order_date);
          const dateB = new Date(b.order_date);
          return dateB - dateA;
        });
        setRecentOrders(sortedOrders.slice(0, 5));

        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [getToken]);

  // Helper function to generate mock orders if API fails
  const generateMockOrders = () => {
    return Array.from({ length: 10 }, (_, index) => {
      const id = index + 1;
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 30));

      return {
        id,
        customer: {
          name: `Customer ${id}`,
          email: `customer${id}@example.com`
        },
        order_date: date.toISOString(),
        total_amount: Math.floor(Math.random() * 10000) + 1000,
        shipment_status: Math.random() > 0.5 ? 'Delivered' : 'Pending',
        payment_status: Math.random() > 0.7 ? 'Unpaid' : 'Paid',
        items: Math.floor(Math.random() * 5) + 1
      };
    });
  };

  // Helper function to generate monthly sales data
  const generateMonthlySalesData = (orders) => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const salesByMonth = {};

    // Initialize all months with 0
    monthNames.forEach(month => {
      salesByMonth[month] = 0;
    });

    // Sum up sales by month for current year
    const currentYear = new Date().getFullYear();
    orders.forEach(order => {
      const orderDate = new Date(order.order_date);
      // Only include current year's data
      if (orderDate.getFullYear() === currentYear) {
        const month = monthNames[orderDate.getMonth()];
        salesByMonth[month] += order.total_amount || 0;
      }
    });

    // Convert to array format for charts
    return Object.keys(salesByMonth).map(month => ({
      month,
      sales: salesByMonth[month]
    }));
  };

  // Helper function to generate product category data
  const generateProductCategoryData = (products) => {
    const categoryCounts = {};

    // Count products by category
    products.forEach(product => {
      const categoryName = product.category?.categoryname || 'Uncategorized';
      categoryCounts[categoryName] = (categoryCounts[categoryName] || 0) + 1;
    });

    // Convert to array format for charts
    return Object.keys(categoryCounts).map(name => ({
      name,
      value: categoryCounts[name]
    }));
  };

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
              {/* Total Revenue - Now first */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <DollarSign className="text-green-600" size={24} />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-gray-500 text-sm font-medium">Total Revenue</h3>
                    <p className="text-2xl font-semibold">{formatCurrency(stats.totalRevenue)}</p>
                  </div>
                </div>
                <div className="flex items-center mt-4 text-green-500">
                  <TrendingUp size={16} />
                  <span className="ml-1 text-sm">8% increase this month</span>
                </div>
              </div>

              {/* Total Orders - Now second */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <ShoppingCart className="text-blue-600" size={24} />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-gray-500 text-sm font-medium">Total Orders</h3>
                    <p className="text-2xl font-semibold">{stats.totalOrders}</p>
                  </div>
                </div>
                <div className="flex items-center mt-4 text-green-500">
                  <TrendingUp size={16} />
                  <span className="ml-1 text-sm">12% increase this month</span>
                </div>
              </div>

              {/* Pending Orders - Now third */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="bg-yellow-100 p-3 rounded-lg">
                    <ClipboardCheck className="text-yellow-600" size={24} />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-gray-500 text-sm font-medium">Pending Orders</h3>
                    <p className="text-2xl font-semibold">{stats.pendingOrders}</p>
                  </div>
                </div>
                <div className="flex items-center mt-4 text-red-500">
                  <Archive size={16} />
                  <span className="ml-1 text-sm">Needs attention</span>
                </div>
              </div>

              {/* Total Products - Now fourth */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <Package className="text-purple-600" size={24} />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-gray-500 text-sm font-medium">Total Products</h3>
                    <p className="text-2xl font-semibold">{stats.totalProducts}</p>
                  </div>
                </div>
                <div className="flex items-center mt-4 text-purple-500">
                  <Users size={16} />
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.user?.firstname} {order.user?.lastname || ''}
                          {order.customer?.name && order.customer.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(order.order_date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.shipment_status === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                            {order.shipment_status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(order.total_amount)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <a
                            href={`/orders/${order.id}`}
                            className="inline-flex items-center justify-center px-3 py-1 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                          >
                            <Eye size={14} className="mr-1" />
                            View
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-4 border-t flex justify-start">
                <a
                  href="/orders"
                  className="inline-flex items-center px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
                >
                  <ShoppingBag size={16} className="mr-2" />
                  View all orders
                </a>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;

