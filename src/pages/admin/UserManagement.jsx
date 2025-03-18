import React, { useState, useEffect } from 'react';
import { 
  SearchIcon, 
  FilterIcon, 
  SlidersIcon,
  UserIcon,
  MailIcon,
  PhoneIcon,
  CalendarIcon,
  EyeIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout';

const UserManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState('id');
  const [sortDirection, setSortDirection] = useState('asc');
  const [showFilters, setShowFilters] = useState(false);

  const itemsPerPage = 10;

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setIsLoading(true);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock customer data
        const mockCustomers = Array.from({ length: 25 }, (_, index) => {
          const id = index + 1;
          const registrationDate = new Date();
          registrationDate.setDate(registrationDate.getDate() - Math.floor(Math.random() * 365));
          
          return {
            id,
            name: `Customer ${id}`,
            email: `customer${id}@example.com`,
            phone: `+66${Math.floor(Math.random() * 1000000000)}`,
            registrationDate: registrationDate.toISOString().split('T')[0],
            ordersCount: Math.floor(Math.random() * 10),
            totalSpent: Math.floor(Math.random() * 50000) + 1000
          };
        });
        
        setCustomers(mockCustomers);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching customers:', error);
        setIsLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const toggleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filter customers
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = 
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm);
    
    return matchesSearch;
  });

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

  return (
    <AdminLayout>
    <div>
      <h1 className="text-2xl font-bold mb-6">User Management</h1>

      <div className="bg-white rounded-lg shadow mb-8">
        <div className="p-4 border-b">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search by name, email or phone..."
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
            </div>
          </div>
          
          {showFilters && (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Registration Date</label>
                <div className="flex items-center space-x-2">
                  <div className="relative flex-1">
                    <CalendarIcon size={16} className="absolute left-3 top-2.5 text-gray-400" />
                    <input type="date" className="pl-10 pr-4 py-2 border rounded-md w-full" />
                  </div>
                  <span>to</span>
                  <div className="relative flex-1">
                    <CalendarIcon size={16} className="absolute left-3 top-2.5 text-gray-400" />
                    <input type="date" className="pl-10 pr-4 py-2 border rounded-md w-full" />
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Orders</label>
                <select className="border rounded-md px-4 py-2 w-full">
                  <option value="">All Customers</option>
                  <option value="has_orders">Has Orders</option>
                  <option value="no_orders">No Orders</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Spent</label>
                <div className="flex items-center space-x-2">
                  <input type="number" placeholder="Min" className="border rounded-md px-4 py-2 w-full" />
                  <span>-</span>
                  <input type="number" placeholder="Max" className="border rounded-md px-4 py-2 w-full" />
                </div>
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
                        ID
                        {sortField === 'id' && (
                          sortDirection === 'asc' ? 
                            <ArrowUpIcon size={14} className="ml-1" /> : 
                            <ArrowDownIcon size={14} className="ml-1" />
                        )}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button 
                        onClick={() => toggleSort('name')}
                        className="flex items-center"
                      >
                        Name
                        {sortField === 'name' && (
                          sortDirection === 'asc' ? 
                            <ArrowUpIcon size={14} className="ml-1" /> : 
                            <ArrowDownIcon size={14} className="ml-1" />
                        )}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button 
                        onClick={() => toggleSort('email')}
                        className="flex items-center"
                      >
                        Email
                        {sortField === 'email' && (
                          sortDirection === 'asc' ? 
                            <ArrowUpIcon size={14} className="ml-1" /> : 
                            <ArrowDownIcon size={14} className="ml-1" />
                        )}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button 
                        onClick={() => toggleSort('registrationDate')}
                        className="flex items-center"
                      >
                        Registered
                        {sortField === 'registrationDate' && (
                          sortDirection === 'asc' ? 
                            <ArrowUpIcon size={14} className="ml-1" /> : 
                            <ArrowDownIcon size={14} className="ml-1" />
                        )}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button 
                        onClick={() => toggleSort('ordersCount')}
                        className="flex items-center"
                      >
                        Orders
                        {sortField === 'ordersCount' && (
                          sortDirection === 'asc' ? 
                            <ArrowUpIcon size={14} className="ml-1" /> : 
                            <ArrowDownIcon size={14} className="ml-1" />
                        )}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button 
                        onClick={() => toggleSort('totalSpent')}
                        className="flex items-center"
                      >
                        Total Spent
                        {sortField === 'totalSpent' && (
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
                  {currentCustomers.map((customer) => (
                    <tr key={customer.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{customer.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                            <UserIcon size={20} className="text-gray-500" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <MailIcon size={16} className="text-gray-400 mr-2" />
                          {customer.email}
                        </div>
                        <div className="flex items-center mt-1">
                          <PhoneIcon size={16} className="text-gray-400 mr-2" />
                          {customer.phone}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.registrationDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.ordersCount}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatCurrency(customer.totalSpent)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                        <button 
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <EyeIcon size={18} />
                        </button>
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
                  Showing {indexOfFirstCustomer + 1} to {Math.min(indexOfLastCustomer, sortedCustomers.length)} of {sortedCustomers.length} customers
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

export default UserManagement;