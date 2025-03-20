import React, { useState, useEffect } from 'react';
import {
  Search,
  SlidersHorizontal,
  Calendar,
  User,
  Mail,
  Phone,
  Eye,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { useAuth } from "@clerk/clerk-react";
import AdminLayout from '../../layouts/AdminLayout';
import createAuthenticatedRequest from '../../services/api'; // Import your API client

const UserManagement = () => {
  const { getToken } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState('id');
  const [sortDirection, setSortDirection] = useState('asc');
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [orderFilter, setOrderFilter] = useState('');
  const [spentRange, setSpentRange] = useState({ min: '', max: '' });

  const itemsPerPage = 10;

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Get token from Clerk
        const token = await getToken();

        // Create the authenticated API client
        const api = createAuthenticatedRequest(token);

        // Fetch users from backend
        const response = await api.getUsers();

        // Set the customer data from the API response
        setCustomers(response || []);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching customers:', error);
        setError('Failed to load user data. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchCustomers();
  }, [getToken]);

  const toggleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const applyFilters = (customer) => {
    // Apply search filter
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (customer.phone && customer.phone.includes(searchTerm));

    if (!matchesSearch) return false;

    // Apply date range filter
    if (dateRange.from && dateRange.to) {
      const regDate = new Date(customer.registrationDate);
      const fromDate = new Date(dateRange.from);
      const toDate = new Date(dateRange.to);
      toDate.setHours(23, 59, 59); // Include the entire end day

      if (regDate < fromDate || regDate > toDate) return false;
    }

    // Apply orders filter
    if (orderFilter === 'has_orders' && customer.ordersCount === 0) return false;
    if (orderFilter === 'no_orders' && customer.ordersCount > 0) return false;

    // Apply total spent filter
    if (spentRange.min && customer.totalSpent < Number(spentRange.min)) return false;
    if (spentRange.max && customer.totalSpent > Number(spentRange.max)) return false;

    return true;
  };

  // Filter customers
  const filteredCustomers = customers.filter(applyFilters);

  // Sort customers
  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    let valueA = a[sortField];
    let valueB = b[sortField];

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
  const indexOfLastCustomer = currentPage * itemsPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - itemsPerPage;
  const currentCustomers = sortedCustomers.slice(indexOfFirstCustomer, indexOfLastCustomer);
  const totalPages = Math.ceil(sortedCustomers.length / itemsPerPage);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleViewDetails = (customerId) => {
    // Navigate to customer details page or open a modal
    alert(`View details for customer ID: ${customerId}`);
    // You could use React Router navigation here
    // navigate(`/admin/customers/${customerId}`);
  };

  // Column definition for table headers
  const columns = [
    { field: 'id', label: 'ID' },
    { field: 'name', label: 'Name' },
    { field: 'email', label: 'Email' },
    { field: 'registrationDate', label: 'Registered' },
    { field: 'ordersCount', label: 'Orders' },
    { field: 'totalSpent', label: 'Total Spent' },
    { field: 'actions', label: 'Actions' }
  ];

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 lg:p-8">
        <h1 className="text-2xl font-bold mb-6">User Management</h1>

        <div className="bg-white rounded-lg shadow mb-8">
          {/* Improved Search Section */}
          <div className="p-4">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search by name, email or phone..."
                  className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center justify-center px-4 py-2 rounded-md border whitespace-nowrap ${showFilters ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
              >
                <SlidersHorizontal size={18} className="mr-2" />
                Filters
              </button>
            </div>
          </div>

          {/* Fixed Filter Section - Matches the Screenshot */}
          {showFilters && (
            <div className="border border-gray-200 rounded-md mx-4 mb-4">
              <div className="grid grid-cols-3 border-b border-gray-200">
                <div className="p-3 text-sm font-medium text-gray-700">Registration Date</div>
                <div className="p-3 text-sm font-medium text-gray-700">Orders</div>
                <div className="p-3 text-sm font-medium text-gray-700">Total Spent</div>
              </div>

              <div className="grid grid-cols-3 p-3 gap-3">
                {/* Date Range - Fixed Layout */}
                <div className="flex items-center space-x-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="dd/mm/yyyy"
                      className="pl-9 pr-2 py-2 border rounded-md w-full focus:outline-none"
                      value={dateRange.from}
                      onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                    />
                    <Calendar size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                  <span className="text-sm text-gray-500">to</span>
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="dd/mm/yyyy"
                      className="pl-9 pr-2 py-2 border rounded-md w-full focus:outline-none"
                      value={dateRange.to}
                      onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                    />
                    <Calendar size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                </div>

                {/* Orders Dropdown - Fixed Layout */}
                <div className="px-2">
                  <select
                    className="border rounded-md px-3 py-2 w-full focus:outline-none appearance-none bg-white"
                    value={orderFilter}
                    onChange={(e) => setOrderFilter(e.target.value)}
                  >
                    <option value="">All Customers</option>
                    <option value="has_orders">Has Orders</option>
                    <option value="no_orders">No Orders</option>
                  </select>
                </div>

                {/* Total Spent Range - Fixed Layout */}
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="Min"
                    className="border rounded-md px-3 py-2 w-full focus:outline-none"
                    value={spentRange.min}
                    onChange={(e) => setSpentRange({ ...spentRange, min: e.target.value })}
                  />
                  <span className="text-sm text-gray-500">-</span>
                  <input
                    type="text"
                    placeholder="Max"
                    className="border rounded-md px-3 py-2 w-full focus:outline-none"
                    value={spentRange.max}
                    onChange={(e) => setSpentRange({ ...spentRange, max: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Responsive Table Section */}
          {isLoading ? (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center py-16">
              <div className="text-red-500">{error}</div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {columns.map((column) => (
                        <th
                          key={column.field}
                          className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {column.field !== 'actions' ? (
                            <button
                              onClick={() => toggleSort(column.field)}
                              className="flex items-center focus:outline-none"
                            >
                              {column.label}
                              {sortField === column.field && (
                                sortDirection === 'asc' ?
                                  <ChevronUp size={14} className="ml-1" /> :
                                  <ChevronDown size={14} className="ml-1" />
                              )}
                            </button>
                          ) : (
                            <span className="text-center block">{column.label}</span>
                          )}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentCustomers.length > 0 ? (
                      currentCustomers.map((customer) => (
                        <tr key={customer.id} className="hover:bg-gray-50">
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            #{customer.id}
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
                                <User size={16} className="text-gray-500" />
                              </div>
                              <div className="ml-3">
                                <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                                <div className="text-xs text-gray-500">{customer.role || 'Customer'}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              <div className="flex items-center">
                                <Mail size={14} className="text-gray-400 mr-1.5" />
                                <span className="truncate max-w-[150px] sm:max-w-xs">{customer.email}</span>
                              </div>
                              {customer.phone && customer.phone !== 'N/A' && (
                                <div className="flex items-center mt-1">
                                  <Phone size={14} className="text-gray-400 mr-1.5" />
                                  {customer.phone}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {customer.registrationDate}
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {customer.ordersCount}
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatCurrency(customer.totalSpent)}
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                            <button
                              className="inline-flex items-center justify-center w-8 h-8 rounded-full text-blue-600 hover:text-blue-800 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              title="View Details"
                              onClick={() => handleViewDetails(customer.id)}
                            >
                              <Eye size={16} />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={columns.length} className="px-6 py-8 text-center text-sm text-gray-500">
                          No customers found matching your criteria
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-4 sm:px-6 py-3 border-t flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="text-sm text-gray-500 order-2 sm:order-1">
                    Showing {indexOfFirstCustomer + 1} to {Math.min(indexOfLastCustomer, sortedCustomers.length)} of {sortedCustomers.length} customers
                  </div>
                  <div className="flex order-1 sm:order-2">
                    <button
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`flex items-center justify-center px-3 py-1 rounded-l-md border ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-blue-600 hover:bg-blue-50'
                        }`}
                    >
                      <ChevronLeft size={16} className="mr-1" />
                      <span className="hidden sm:inline">Previous</span>
                    </button>

                    <div className="hidden sm:flex">
                      {Array.from({ length: totalPages }).map((_, index) => {
                        // Show limited page numbers with ellipsis
                        if (
                          totalPages <= 7 ||
                          index === 0 ||
                          index === totalPages - 1 ||
                          (index >= currentPage - 2 && index <= currentPage + 1)
                        ) {
                          return (
                            <button
                              key={index}
                              onClick={() => setCurrentPage(index + 1)}
                              className={`px-3 py-1 border-t border-b ${currentPage === index + 1
                                  ? 'bg-blue-600 text-white border-blue-600'
                                  : 'bg-white text-blue-600 hover:bg-blue-50'
                                }`}
                            >
                              {index + 1}
                            </button>
                          );
                        } else if (
                          index === 1 ||
                          index === totalPages - 2
                        ) {
                          return (
                            <button
                              key={index}
                              className="px-3 py-1 border-t border-b bg-white text-gray-500"
                              disabled
                            >
                              ...
                            </button>
                          );
                        }
                        return null;
                      })}
                    </div>

                    {/* Mobile pagination indicator */}
                    <div className="flex items-center justify-center px-3 py-1 border-t border-b sm:hidden bg-white">
                      <span className="text-sm text-gray-700">{currentPage} / {totalPages}</span>
                    </div>

                    <button
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`flex items-center justify-center px-3 py-1 rounded-r-md border ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-blue-600 hover:bg-blue-50'
                        }`}
                    >
                      <span className="hidden sm:inline">Next</span>
                      <ChevronRight size={16} className="ml-1" />
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

export default UserManagement;


