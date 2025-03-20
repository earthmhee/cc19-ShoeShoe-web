import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, User, Mail, Phone, Calendar, ShoppingBag, AlertTriangle, Home, Package, CreditCard } from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout';
import { useAuth } from "@clerk/clerk-react";
import createAuthenticatedRequest from '../../services/api';


const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getToken } = useAuth();
  
  const [user, setUser] = useState(null);
  const [userOrders, setUserOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get token from Clerk
        const token = await getToken();
        
        // Create the authenticated API client
        const api = createAuthenticatedRequest(token);
        
        // Fetch user data
        const userData = await api.getUserById(id);
        
        if (userData && userData.status === 'success') {
          setUser(userData.data);
          
          // Set orders from the user data
          setUserOrders(userData.data.orders || []);
        } else {
          throw new Error("Failed to load user data");
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load user data. Please try again later.');
        
        // Set mock data for development
        setUser({
          id: parseInt(id),
          username: 'user' + id,
          firstname: 'Test',
          lastname: 'User',
          email: `user${id}@example.com`,
          phone: '+6681234567',
          role: 'Customer',
          status: 'Active',
          created_at: new Date().toISOString()
        });
        
        // Mock orders
        setUserOrders([
          {
            id: 1001,
            order_date: new Date().toISOString(),
            total_amount: 2500,
            shipment_status: 'Delivered',
            payment_status: 'Paid'
          },
          {
            id: 1002,
            order_date: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
            total_amount: 4800,
            shipment_status: 'Shipped',
            payment_status: 'Paid'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [id, getToken]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const calculateTotalSpent = (orders) => {
    if (!orders || orders.length === 0) return 0;
    return orders
      .filter(order => order.payment_status === 'Paid')
      .reduce((total, order) => total + order.total_amount, 0);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin h-8 w-8 border-4 border-black rounded-full border-t-transparent"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!user && !loading) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-800">User Not Found</h2>
          <p className="mt-2 text-gray-600">The user you're looking for doesn't exist or you don't have permission to view it.</p>
          <button 
            onClick={() => navigate('/users')}
            className="mt-4 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
          >
            Back to User List
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-6">
        <button
          onClick={() => navigate('/users')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Users
        </button>
        <h1 className="text-2xl font-bold">User Profile</h1>
      </div>
      
      {error && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="bg-gray-100 p-6 flex flex-col items-center">
              <div className="h-24 w-24 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
                <User size={48} />
              </div>
              <h2 className="mt-4 text-xl font-bold text-gray-900">{user.firstname} {user.lastname}</h2>
              <p className="text-gray-500">@{user.username}</p>
              <div className="mt-2">
                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  user.role === 'Admin' 
                    ? 'bg-purple-100 text-purple-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {user.role}
                </span>
                <span className={`ml-2 px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  user.status === 'Active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {user.status || 'Active'}
                </span>
              </div>
            </div>
            
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              <dl className="space-y-4">
                <div className="flex items-center">
                  <dt className="text-sm font-medium text-gray-500 w-8">
                    <Mail size={16} />
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 ml-2">{user.email}</dd>
                </div>
                
                <div className="flex items-center">
                  <dt className="text-sm font-medium text-gray-500 w-8">
                    <Phone size={16} />
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 ml-2">{user.phone || 'Not provided'}</dd>
                </div>
                
                <div className="flex items-center">
                  <dt className="text-sm font-medium text-gray-500 w-8">
                    <Calendar size={16} />
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 ml-2">Joined {formatDate(user.created_at)}</dd>
                </div>

                <div className="flex items-center">
                  <dt className="text-sm font-medium text-gray-500 w-8">
                    <ShoppingBag size={16} />
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 ml-2">
                    Total Spent: ฿{calculateTotalSpent(userOrders).toLocaleString()}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
        
        {/* Right Side Content */}
        <div className="lg:col-span-2">
          {/* Order History */}
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Order History</h3>
            </div>
            
            <div className="overflow-x-auto">
              {userOrders && userOrders.length > 0 ? (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Payment
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {userOrders.map((order) => (
                      <tr key={order.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          #{order.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(order.order_date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            order.shipment_status === 'Delivered' 
                              ? 'bg-green-100 text-green-800' 
                              : order.shipment_status === 'Pending' 
                                ? 'bg-yellow-100 text-yellow-800' 
                                : order.shipment_status === 'Shipped' 
                                  ? 'bg-blue-100 text-blue-800' 
                                  : 'bg-gray-100 text-gray-800'
                          }`}>
                            {order.shipment_status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            order.payment_status === 'Paid' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {order.payment_status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ฿{order.total_amount?.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-600">
                          <button 
                            onClick={() => navigate(`/orders/${order.id}`)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="py-8 text-center">
                  <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No orders</h3>
                  <p className="mt-1 text-sm text-gray-500">This user hasn't placed any orders yet.</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Address Information */}
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Address Information</h3>
            </div>
            
            <div className="px-6 py-4">
              {user.address && user.address.length > 0 ? (
                <div className="space-y-4">
                  {user.address.map((addr, index) => (
                    <div key={addr.id || index} className="p-3 border rounded-md">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mt-1">
                          <Home size={18} className="text-gray-500" />
                        </div>
                        <div className="ml-3 text-sm text-gray-600">
                          <p className="font-medium">{addr.firstname} {addr.lastname}</p>
                          <p>{addr.phone}</p>
                          <p>{addr.homenum}</p>
                          <p>{addr.subdistrict}, {addr.district}</p>
                          <p>{addr.province}, {addr.country} {addr.postcode}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No address information available.</p>
              )}
            </div>
          </div>
          
          {/* Account Activity */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
            </div>
            
            <div className="px-6 py-4">
              <div className="space-y-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <User size={16} className="text-blue-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">Account created</p>
                    <p className="text-xs text-gray-500">{formatDate(user.created_at)}</p>
                  </div>
                </div>
                
                {userOrders && userOrders.length > 0 && (
                  <>
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                          <ShoppingBag size={16} className="text-green-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">Last order placed</p>
                        <p className="text-xs text-gray-500">{formatDate(userOrders[0].order_date)}</p>
                      </div>
                    </div>

                    {userOrders.some(order => order.payment_status === 'Paid') && (
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                            <CreditCard size={16} className="text-purple-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-900">Last payment completed</p>
                          <p className="text-xs text-gray-500">
                            {formatDate(
                              userOrders.filter(order => order.payment_status === 'Paid')[0]?.order_date
                            )}
                          </p>
                        </div>
                      </div>
                    )}

                    {userOrders.some(order => order.shipment_status === 'Delivered') && (
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <Package size={16} className="text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-900">Last delivery completed</p>
                          <p className="text-xs text-gray-500">
                            {formatDate(
                              userOrders.filter(order => order.shipment_status === 'Delivered')[0]?.order_date
                            )}
                          </p>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default UserDetail;