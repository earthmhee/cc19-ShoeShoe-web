import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import axios from 'axios';
import { 
  SearchIcon, 
  FilterIcon, 
  SlidersIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  TruckIcon,
  CalendarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  RefreshCwIcon
} from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [sortField, setSortField] = useState('id');
  const [sortDirection, setSortDirection] = useState('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const itemsPerPage = 10;

  // Fetch orders (simulated for now)
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        // In a real app, you would fetch from your backend API
        // For now, we'll create sample data
        const sampleOrders = Array.from({ length: 35 }, (_, index) => {
          const id = index + 1;
          const date = new Date();
          date.setDate(date.getDate() - Math.floor(Math.random() * 30));
          
          const statuses = ['Pending', 'Delivered'];
          const paymentStatuses = ['Paid', 'Unpaid'];
          
          return {
            id,
            customer: {
              id: 100 + id,
              name: `Customer ${id}`,
              email: `customer${id}@example.com`
            },
            order_date: date.toISOString().split('T')[0],
            total_amount: Math.floor(Math.random() * 10000) + 1000,
            shipment_status: statuses[Math.floor(Math.random() * statuses.length)],
            payment_status: paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)],
            items: Math.floor(Math.random() * 5) + 1
          };
        });
        
        setOrders(sampleOrders);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

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
        // In a real app, you would call your API to update the order status
        // For example:
        // await axios.put(`http://localhost:8000/api/order/update-status/${orderId}`, { status: newStatus });
        
        // For now, we'll update the local state
        setOrders(orders.map(order => 
          order.id === orderId 
            ? { ...order, shipment_status: newStatus } 
            : order
        ));
        
        alert(`Order #${orderId} marked as ${newStatus}`);
      } catch (error) {
        console.error('Error updating order status:', error);
        alert('Failed to update order status');
      }
    }
  };

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toString().includes(searchTerm) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    
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
      valueA = a.customer.name;
      valueB = b.customer.name;
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

      <div className="bg-white rounded-lg shadow mb-8">
        <div className="p-4 border-b">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search by order ID or customer..."
                className="w-full pl-10 pr-4 py-2 border rounded-md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <SearchIcon size={20} className="absolute left-3 top-2.5 text-gray-400" />
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md flex items-center"
              >
                <FilterIcon size={20} className="mr-2" />
                Filters
              </button>
              
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border rounded-md px-4 py-2 appearance-none pr-10 bg-white"
                >
                  <option value="">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Delivered">Delivered</option>
                </select>
                <SlidersIcon size={16} className="absolute right-3 top-3 text-gray-500" />
              </div>
            </div>
          </div>
          
          {showFilters && (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                <div className="flex items-center space-x-2">
                  <div className="relative flex-1">
                    <CalendarIcon size={16} className="absolute left-3 top-2.5 text-gray-400" />
                    <input 
                      type="date" 
                      value={dateRange.start}
                      onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                      className="pl-10 pr-4 py-2 border rounded-md w-full" 
                    />
                  </div>
                  <span>to</span>
                  <div className="relative flex-1">
                    <CalendarIcon size={16} className="absolute left-3 top-2.5 text-gray-400" />
                    <input 
                      type="date" 
                      value={dateRange.end}
                      onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                      className="pl-10 pr-4 py-2 border rounded-md w-full" 
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
                <select className="border rounded-md px-4 py-2 w-full">
                  <option value="">All Payment Statuses</option>
                  <option value="Paid">Paid</option>
                  <option value="Unpaid">Unpaid</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button 
                        onClick={() => toggleSort('id')}
                        className="flex items-center"
                      >
                        Order ID
                        {sortField === 'id' && (
                          sortDirection === 'asc' ? 
                            <ArrowUpIcon size={14} className="ml-1" /> : 
                            <ArrowDownIcon size={14} className="ml-1" />
                        )}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button 
                        onClick={() => toggleSort('customer')}
                        className="flex items-center"
                      >
                        Customer
                        {sortField === 'customer' && (
                          sortDirection === 'asc' ? 
                            <ArrowUpIcon size={14} className="ml-1" /> : 
                            <ArrowDownIcon size={14} className="ml-1" />
                        )}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button 
                        onClick={() => toggleSort('order_date')}
                        className="flex items-center"
                      >
                        Date
                        {sortField === 'order_date' && (
                          sortDirection === 'asc' ? 
                            <ArrowUpIcon size={14} className="ml-1" /> : 
                            <ArrowDownIcon size={14} className="ml-1" />
                        )}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button 
                        onClick={() => toggleSort('total_amount')}
                        className="flex items-center"
                      >
                        Total
                        {sortField === 'total_amount' && (
                          sortDirection === 'asc' ? 
                            <ArrowUpIcon size={14} className="ml-1" /> : 
                            <ArrowDownIcon size={14} className="ml-1" />
                        )}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button 
                        onClick={() => toggleSort('shipment_status')}
                        className="flex items-center"
                      >
                        Status
                        {sortField === 'shipment_status' && (
                          sortDirection === 'asc' ? 
                            <ArrowUpIcon size={14} className="ml-1" /> : 
                            <ArrowDownIcon size={14} className="ml-1" />
                        )}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button 
                        onClick={() => toggleSort('payment_status')}
                        className="flex items-center"
                      >
                        Payment
                        {sortField === 'payment_status' && (
                          sortDirection === 'asc' ? 
                            <ArrowUpIcon size={14} className="ml-1" /> : 
                            <ArrowDownIcon size={14} className="ml-1" />
                        )}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentOrders.map((order) => (
                    <tr key={order.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>{order.customer.name}</div>
                        <div className="text-xs text-gray-400">{order.customer.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.order_date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatCurrency(order.total_amount)}
                        <div className="text-xs text-gray-400">{order.items} items</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          order.shipment_status === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.shipment_status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          order.payment_status === 'Paid' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {order.payment_status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex justify-center items-center space-x-2">
                          <Link 
                            to={`/orders/${order.id}`}
                            className="text-blue-600 hover:text-blue-900"
                            title="View Details"
                          >
                            <EyeIcon size={18} />
                          </Link>
                          
                          {order.shipment_status === 'Pending' && (
                            <button
                              onClick={() => updateOrderStatus(order.id, 'Delivered')}
                              className="text-green-600 hover:text-green-900"
                              title="Mark as Delivered"
                            >
                              <CheckCircleIcon size={18} />
                            </button>
                          )}
                          
                          {order.shipment_status === 'Delivered' && (
                            <button
                              onClick={() => updateOrderStatus(order.id, 'Pending')}
                              className="text-yellow-600 hover:text-yellow-900"
                              title="Mark as Pending"
                            >
                              <RefreshCwIcon size={18} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="p-4 border-t flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  Showing {indexOfFirstOrder + 1} to {Math.min(indexOfLastOrder, sortedOrders.length)} of {sortedOrders.length} orders
                </div>
                <div className="flex">
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded-l-md border ${
                      currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPage(index + 1)}
                      className={`px-3 py-1 border-t border-b ${
                        currentPage === index + 1 ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 hover:bg-blue-50'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded-r-md border ${
                      currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-blue-600 hover:bg-blue-50'
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