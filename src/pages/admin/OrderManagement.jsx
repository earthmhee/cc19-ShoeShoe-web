import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { 
  Search, 
  Filter, 
  Sliders,
  Eye,
  CheckCircle,
  XCircle,
  Truck,
  Calendar,
  ArrowUp,
  ArrowDown,
  RefreshCw
} from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout';
import createAuthenticatedRequest from '../../services/api';
import { useAuth } from '@clerk/clerk-react';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [sortField, setSortField] = useState('id');
  const [sortDirection, setSortDirection] = useState('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const itemsPerPage = 10;

  // Get the token from Clerk authentication
  const { getToken } = useAuth();
  const [token, setToken] = useState(null);

  // Get authentication token
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const authToken = await getToken();
        setToken(authToken);
      } catch (err) {
        console.error('Error getting authentication token:', err);
        setError('Authentication error. Please sign in again.');
      }
    };

    fetchToken();
  }, [getToken]);

  // Fetch orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) return; // Don't fetch if we don't have a token yet

      try {
        setIsLoading(true);
        setError(null);

        // Create API client with token
        const api = createAuthenticatedRequest(token);

        // Get filters based on current state
        const filters = {};
        if (statusFilter) {
          filters.status = statusFilter;
        }
        if (dateRange.start) {
          filters.start_date = dateRange.start;
        }
        if (dateRange.end) {
          filters.end_date = dateRange.end;
        }

        // Call the API to get orders
        const ordersData = await api.getOrders(filters);
        setOrders(ordersData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError('Failed to load orders. Please try again.');
        setIsLoading(false);

        // Fallback to empty array on error
        setOrders([]);
      }
    };

    fetchOrders();
  }, [token, statusFilter, dateRange.start, dateRange.end]);

  const toggleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    if (window.confirm(`Are you sure you want to mark this order as ${newStatus}?`)) {
      try {
        setIsLoading(true);

        // Create API client with token
        const api = createAuthenticatedRequest(token);

        // Call the API to update order status
        await api.updateOrderStatus(orderId, newStatus);

        // Refresh orders after update
        const updatedOrders = await api.getOrders();
        setOrders(updatedOrders);

        alert(`Order #${orderId} marked as ${newStatus}`);
        setIsLoading(false);
      } catch (error) {
        console.error('Error updating order status:', error);
        alert('Failed to update order status');
        setIsLoading(false);
      }
    }
  };

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      (order.id && order.id.toString().includes(searchTerm)) ||
      (order.customer?.name && order.customer.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.customer?.email && order.customer.email.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === '' || order.shipment_status === statusFilter;

    const orderDate = new Date(order.order_date);
    const matchesDateStart = !dateRange.start || new Date(dateRange.start) <= orderDate;
    const matchesDateEnd = !dateRange.end || new Date(dateRange.end) >= orderDate;

    return matchesSearch && matchesStatus && matchesDateStart && matchesDateEnd;
  });

  // Sort orders
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    let valueA = a[sortField];
    let valueB = b[sortField];

    if (sortField === 'customer') {
      valueA = a.customer?.name || '';
      valueB = b.customer?.name || '';
    }

    if (typeof valueA === 'string') {
      if (sortDirection === 'asc') {
        return valueA.localeCompare(valueB);
      } else {
        return valueB.localeCompare(valueA);
      }
    } else {
      if (sortDirection === 'asc') {
        return valueA - valueB;
      } else {
        return valueB - valueA;
      }
    }
  });

  // Pagination
  const indexOfLastOrder = currentPage * itemsPerPage;
  const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;
  const currentOrders = sortedOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(sortedOrders.length / itemsPerPage);

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
        <h1 className="text-2xl font-bold mb-6">Order Management</h1>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <XCircle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow mb-8">
          {/* Search and filters - Standardized */}
          <div className="p-4 border-b">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="Search by order ID or customer..."
                  className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search size={20} className="absolute left-3 top-2.5 text-gray-400" />
              </div>

              <div className="flex gap-2">
                {/* Standardized filter button */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md flex items-center ${showFilters ? 'text-gray-900' : 'text-gray-700'
                    }`}
                >
                  <Filter size={20} className="mr-2" />
                  Filters
                </button>

                {/* Standardized dropdown */}
                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border rounded-md px-4 py-2 appearance-none pr-10 bg-white focus:outline-none focus:ring-gray-500 focus:border-gray-500"
                  >
                    <option value="">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                  <Sliders size={16} className="absolute right-3 top-3 text-gray-500 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Advanced filters section */}
            {showFilters && (
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t">
                {/* Date range filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                  <div className="flex items-center space-x-2">
                    <div className="relative flex-1">
                      <Calendar size={16} className="absolute left-3 top-2.5 text-gray-400 pointer-events-none" />
                      <input
                        type="date"
                        value={dateRange.start}
                        onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                        className="pl-10 pr-4 py-2 border rounded-md w-full focus:outline-none focus:ring-gray-500 focus:border-gray-500"
                      />
                    </div>
                    <span className="text-gray-500">to</span>
                    <div className="relative flex-1">
                      <Calendar size={16} className="absolute left-3 top-2.5 text-gray-400 pointer-events-none" />
                      <input
                        type="date"
                        value={dateRange.end}
                        onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                        className="pl-10 pr-4 py-2 border rounded-md w-full focus:outline-none focus:ring-gray-500 focus:border-gray-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Payment status filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
                  <select
                    className="border rounded-md px-4 py-2 w-full focus:outline-none focus:ring-gray-500 focus:border-gray-500"
                  >
                    <option value="">All Payment Statuses</option>
                    <option value="Paid">Paid</option>
                    <option value="Unpaid">Unpaid</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Loading state */}
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <>
              {/* Orders table - Standardized */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      {/* ID Column */}
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <button
                          onClick={() => toggleSort('id')}
                          className="flex items-center"
                        >
                          Order ID
                          {sortField === 'id' && (
                            sortDirection === 'asc' ?
                              <ArrowUp size={14} className="ml-1" /> :
                              <ArrowDown size={14} className="ml-1" />
                          )}
                        </button>
                      </th>

                      {/* Customer Column */}
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <button
                          onClick={() => toggleSort('customer')}
                          className="flex items-center"
                        >
                          Customer
                          {sortField === 'customer' && (
                            sortDirection === 'asc' ?
                              <ArrowUp size={14} className="ml-1" /> :
                              <ArrowDown size={14} className="ml-1" />
                          )}
                        </button>
                      </th>

                      {/* Date Column */}
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <button
                          onClick={() => toggleSort('order_date')}
                          className="flex items-center"
                        >
                          Date
                          {sortField === 'order_date' && (
                            sortDirection === 'asc' ?
                              <ArrowUp size={14} className="ml-1" /> :
                              <ArrowDown size={14} className="ml-1" />
                          )}
                        </button>
                      </th>

                      {/* Total Column */}
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <button
                          onClick={() => toggleSort('total_amount')}
                          className="flex items-center"
                        >
                          Total
                          {sortField === 'total_amount' && (
                            sortDirection === 'asc' ?
                              <ArrowUp size={14} className="ml-1" /> :
                              <ArrowDown size={14} className="ml-1" />
                          )}
                        </button>
                      </th>

                      {/* Status Column */}
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <button
                          onClick={() => toggleSort('shipment_status')}
                          className="flex items-center"
                        >
                          Status
                          {sortField === 'shipment_status' && (
                            sortDirection === 'asc' ?
                              <ArrowUp size={14} className="ml-1" /> :
                              <ArrowDown size={14} className="ml-1" />
                          )}
                        </button>
                      </th>

                      {/* Payment Column */}
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <button
                          onClick={() => toggleSort('payment_status')}
                          className="flex items-center"
                        >
                          Payment
                          {sortField === 'payment_status' && (
                            sortDirection === 'asc' ?
                              <ArrowUp size={14} className="ml-1" /> :
                              <ArrowDown size={14} className="ml-1" />
                          )}
                        </button>
                      </th>

                      {/* Actions Column */}
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  {/* Table body */}
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentOrders.length > 0 ? (
                      currentOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div>{order.customer?.name || 'N/A'}</div>
                            <div className="text-xs text-gray-400">{order.customer?.email || 'N/A'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.order_date || 'N/A'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatCurrency(order.total_amount || 0)}
                            <div className="text-xs text-gray-400">{order.items?.length || 0} items</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${order.shipment_status === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                              }`}>
                              {order.shipment_status || 'Pending'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${order.payment_status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                              {order.payment_status || 'Unpaid'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex justify-center items-center space-x-2">
                              {/* View button - Standardized */}
                              <Link
                                to={`/orders/${order.id}`}
                                className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
                                title="View Details"
                              >
                                <Eye size={18} />
                              </Link>

                              {/* Mark as Delivered button */}
                              {order.shipment_status === 'Pending' && (
                                <button
                                  onClick={() => updateOrderStatus(order.id, 'Delivered')}
                                  className="p-1 text-green-600 hover:text-green-900 hover:bg-green-50 rounded"
                                  title="Mark as Delivered"
                                >
                                  <CheckCircle size={18} />
                                </button>
                              )}

                              {/* Mark as Pending button */}
                              {order.shipment_status === 'Delivered' && (
                                <button
                                  onClick={() => updateOrderStatus(order.id, 'Pending')}
                                  className="p-1 text-yellow-600 hover:text-yellow-900 hover:bg-yellow-50 rounded"
                                  title="Mark as Pending"
                                >
                                  <RefreshCw size={18} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                          No orders found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Standardized pagination */}
              {totalPages > 1 && (
                <div className="p-4 border-t flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    Showing {indexOfFirstOrder + 1} to {Math.min(indexOfLastOrder, sortedOrders.length)} of {sortedOrders.length} orders
                  </div>
                  <div className="flex">
                    {/* Previous button */}
                    <button
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`px-3 py-1 rounded-l-md border ${currentPage === 1
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                      Previous
                    </button>

                    {/* Page buttons */}
                    {Array.from({ length: Math.min(5, totalPages) }).map((_, index) => {
                      // For simplicity, show only 5 page buttons max
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = index + 1;
                      } else if (currentPage <= 3) {
                        pageNum = index + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + index;
                      } else {
                        pageNum = currentPage - 2 + index;
                      }

                      return (
                        <button
                          key={index}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`px-3 py-1 border-t border-b ${currentPage === pageNum
                              ? 'bg-black text-white'
                              : 'bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    {/* Next button */}
                    <button
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`px-3 py-1 rounded-r-md border ${currentPage === totalPages
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default OrderManagement;