import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { 
  ArrowLeftIcon,
  CheckCircleIcon,
  XCircleIcon,
  TruckIcon,
  CalendarIcon,
  UserIcon,
  MailIcon,
  PhoneIcon,
  MapPinIcon,
  CreditCardIcon,
  PrinterIcon,
  ClipboardCheckIcon,
  AlertCircleIcon
} from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout';
import createAuthenticatedRequest from '../../services/api';
import { useAuth } from '@clerk/clerk-react';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newStatus, setNewStatus] = useState('');

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

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!token) return; // Don't fetch if we don't have a token yet
      
      try {
        setIsLoading(true);
        setError(null);
        
        // Create API client with token
        const api = createAuthenticatedRequest(token);
        
        // Fetch order details from API
        const orderData = await api.getOrderById(id);
        
        if (orderData) {
          console.log("Fetched order data:", orderData);
          setOrder(orderData);
          setNewStatus(orderData.shipment_status || 'Pending');
        } else {
          setError('Order not found');
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching order details:', error);
        setError('Failed to load order details. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id, token]);

  const updateOrderStatus = async () => {
    if (!token) {
      alert('Authentication required. Please sign in again.');
      return;
    }
    
    if (newStatus !== order.shipment_status) {
      try {
        setIsLoading(true);
        
        // Create API client with token
        const api = createAuthenticatedRequest(token);
        
        // Call API to update order status
        await api.updateOrderStatus(id, newStatus);
        
        // Fetch updated order
        const updatedOrder = await api.getOrderById(id);
        setOrder(updatedOrder);
        
        alert(`Order status updated to ${newStatus}`);
        setIsLoading(false);
      } catch (error) {
        console.error('Error updating order status:', error);
        alert('Failed to update order status');
        setIsLoading(false);
      }
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const parseImages = (imagesString) => {
    try {
      if (typeof imagesString === "string") {
        return JSON.parse(imagesString);
      }
      return imagesString || [];
    } catch (error) {
      // Fallback if the string isn't valid JSON
      return (
        imagesString
          ?.replace(/^\[|\]$/g, "")
          .split(",")
          .map((url) => url.replace(/^"|"$/g, "")) || []
      );
    }
  };

  // Function to parse address based on different possible formats
  const parseCustomerAddress = (customer) => {
    if (!customer) return 'N/A';

    // Log the customer object for debugging
    console.log("Customer object:", customer);
    
    const address = customer.address;
    
    // Log the address property for debugging
    console.log("Address property:", address);
    
    // If address is undefined or null
    if (!address) return 'N/A';
    
    // If address is already a string, return it directly
    if (typeof address === 'string') return address;
    
    // If address is an object
    if (address !== null && typeof address === 'object') {
      // Don't try to stringify if it's an empty object
      if (Object.keys(address).length === 0) return 'N/A';
      
      // Try common address field patterns
      
      // Pattern 1: homenum, subdistrict, district, province, postcode
      if (address.homenum || address.subdistrict || address.district || address.province) {
        const parts = [
          address.homenum,
          address.subdistrict,
          address.district,
          address.province,
          address.postcode
        ].filter(Boolean); // Remove undefined, null, or empty strings
        
        return parts.join(', ');
      }
      
      // Pattern 2: street, city, state, zip
      if (address.street || address.city || address.state) {
        const parts = [
          address.street,
          address.city,
          address.state,
          address.zip || address.zipCode || address.postal_code
        ].filter(Boolean);
        
        return parts.join(', ');
      }
      
      // Pattern 3: line1, line2, city, state, zip
      if (address.line1) {
        const parts = [
          address.line1,
          address.line2,
          address.city,
          address.state,
          address.zip || address.zipCode || address.postal_code
        ].filter(Boolean);
        
        return parts.join(', ');
      }
      
      // If the object has a toString method that's not the default Object.toString()
      if (address.toString && address.toString !== Object.prototype.toString) {
        const addrStr = address.toString();
        if (addrStr !== '[object Object]') {
          return addrStr;
        }
      }
      
      // Try to create a meaningful string from the object's properties
      try {
        const addressParts = [];
        
        // Go through all the keys and try to create a meaningful address string
        for (const key in address) {
          const value = address[key];
          
          // Skip empty values and functions
          if (!value || typeof value === 'function') continue;
          
          // If the value is a primitive (string, number, etc.), add it
          if (typeof value !== 'object' || value === null) {
            addressParts.push(value.toString());
          } 
          // If the value is an object, try to process it (could be nested address parts)
          else if (Object.keys(value).length > 0) {
            // Try to get meaningful values from the nested object
            const nestedValues = Object.values(value)
              .filter(v => v && typeof v !== 'function' && typeof v !== 'object')
              .map(v => v.toString());
              
            if (nestedValues.length > 0) {
              addressParts.push(nestedValues.join(' '));
            }
          }
        }
        
        // Join all parts with commas
        if (addressParts.length > 0) {
          return addressParts.join(', ');
        }
        
        // If we couldn't extract meaningful parts, return the keys and values
        return Object.entries(address)
          .filter(([_, v]) => v && typeof v !== 'function')
          .map(([k, v]) => typeof v === 'object' ? k : `${v}`)
          .join(', ');
      } catch (e) {
        console.error('Error processing address object:', e);
        return 'Address format not recognized';
      }
    }
    
    // Last resort: if it's an object but we couldn't parse it with other methods
    if (address && typeof address === 'object') {
      return JSON.stringify(address);
    }
    
    // If none of the above conditions are met
    return 'Address format not recognized';
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </AdminLayout>
    );
  }

  if (error || !order) {
    return (
      <AdminLayout>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <AlertCircleIcon size={48} className="mx-auto text-red-500 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Order Not Found</h2>
          <p className="text-gray-500 mb-4">{error || "The order you are looking for does not exist or has been removed."}</p>
          <button 
            onClick={() => navigate('/orders')}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Back to Orders
          </button>
        </div>
      </AdminLayout>
    );
  }

  // Determine items to display - use order.items if available
  const orderItems = order.items || [];
  
  // Get formatted customer address
  const customerAddress = parseCustomerAddress(order.customer);

  return (
    <AdminLayout>
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Order #{order.id}</h1>
        <button
          onClick={() => navigate('/orders')}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md flex items-center"
        >
          <ArrowLeftIcon size={20} className="mr-2" />
          Back to Orders
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow lg:col-span-2">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold">Order Summary</h2>
          </div>
          
          <div className="p-6">
            <div className="flex flex-wrap justify-between mb-6">
              <div className="flex items-center mb-4 mr-6">
                <CalendarIcon size={20} className="text-gray-400 mr-2" />
                <div>
                  <div className="text-sm text-gray-500">Order Date</div>
                  <div className="font-medium">{order.order_date || 'N/A'}</div>
                </div>
              </div>
              
              <div className="flex items-center mb-4 mr-6">
                <TruckIcon size={20} className="text-gray-400 mr-2" />
                <div>
                  <div className="text-sm text-gray-500">Delivery Status</div>
                  <div>
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      order.shipment_status === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.shipment_status || 'Pending'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center mb-4">
                <CreditCardIcon size={20} className="text-gray-400 mr-2" />
                <div>
                  <div className="text-sm text-gray-500">Payment Status</div>
                  <div>
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      order.payment_status === 'Paid' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {order.payment_status || 'Unpaid'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Order Items */}
            <div className="border rounded-lg overflow-hidden mb-6">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orderItems.map((item) => {
                    const product = item.product;
                    const imageArray = product && product.images ? parseImages(product.images) : [];
                    const mainImage = imageArray[0] || "";
                    
                    return (
                      <tr key={item.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-12 w-12 rounded-md overflow-hidden bg-gray-100">
                              <img 
                                src={mainImage} 
                                alt={product?.productname || 'Product'} 
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = 'https://via.placeholder.com/48';
                                }}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{product?.productname || 'Product'}</div>
                              <div className="text-sm text-gray-500">{product?.brand || 'N/A'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                          {formatCurrency(item.price || 0)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                          {item.quantity || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
                          {formatCurrency((item.price || 0) * (item.quantity || 0))}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan="3" className="px-6 py-4 text-right text-sm font-medium text-gray-500">Subtotal</td>
                    <td className="px-6 py-4 text-right text-sm font-medium text-gray-900">{formatCurrency(order.total_amount || 0)}</td>
                  </tr>
                  <tr>
                    <td colSpan="3" className="px-6 py-4 text-right text-sm font-medium text-gray-500">Shipping</td>
                    <td className="px-6 py-4 text-right text-sm font-medium text-gray-900">฿0</td>
                  </tr>
                  <tr>
                    <td colSpan="3" className="px-6 py-4 text-right text-sm font-bold text-gray-900">Total</td>
                    <td className="px-6 py-4 text-right text-lg font-bold text-gray-900">{formatCurrency(order.total_amount || 0)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
            
            {/* Payment Information */}
            {order.payment && (
              <div className="mb-6">
                <h3 className="text-md font-semibold mb-2">Payment Information</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <div className="text-sm text-gray-500">Payment Method</div>
                      <div className="font-medium">{order.payment.method || 'N/A'}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Payment Date</div>
                      <div className="font-medium">{order.payment.date || 'N/A'}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Amount</div>
                      <div className="font-medium">{formatCurrency(order.payment.amount || 0)}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Information */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b">
              <h2 className="text-lg font-semibold">Customer Information</h2>
            </div>
            <div className="p-6">
              <div className="flex items-start mb-4">
                <UserIcon size={20} className="text-gray-400 mr-3 mt-0.5" />
                <div>
                  <div className="text-sm text-gray-500">Name</div>
                  <div className="font-medium">{order.customer?.name || 'N/A'}</div>
                </div>
              </div>
              
              <div className="flex items-start mb-4">
                <MailIcon size={20} className="text-gray-400 mr-3 mt-0.5" />
                <div>
                  <div className="text-sm text-gray-500">Email</div>
                  <div className="font-medium">{order.customer?.email || 'N/A'}</div>
                </div>
              </div>
              
              <div className="flex items-start mb-4">
                <PhoneIcon size={20} className="text-gray-400 mr-3 mt-0.5" />
                <div>
                  <div className="text-sm text-gray-500">Phone</div>
                  <div className="font-medium">{order.customer?.phone || 'N/A'}</div>
                </div>
              </div>
              
              <div className="flex items-start">
                <MapPinIcon size={20} className="text-gray-400 mr-3 mt-0.5" />
                <div>
                  <div className="text-sm text-gray-500">Address</div>
                  <div className="font-medium break-words">{customerAddress}</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Update Order Status */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b">
              <h2 className="text-lg font-semibold">Update Order Status</h2>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Order Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-4 py-2"
                >
                  <option value="Pending">Pending</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>
              
              <button
                onClick={updateOrderStatus}
                disabled={newStatus === order.shipment_status}
                className={`w-full px-4 py-2 rounded-md text-white ${
                  newStatus === order.shipment_status 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                Update Status
              </button>
            </div>
          </div>
          
          {/* Order Timeline */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b">
              <h2 className="text-lg font-semibold">Order Timeline</h2>
            </div>
            <div className="p-6">
              <div className="relative">
                <div className="absolute top-0 left-4 h-full w-0.5 bg-gray-200"></div>
                
                <div className="relative mb-6">
                  <div className="flex items-start">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-600 mr-4 z-10">
                      <CalendarIcon size={16} />
                    </div>
                    <div>
                      <div className="text-sm font-medium">Order Placed</div>
                      <div className="text-sm text-gray-500">{order.order_date || 'N/A'}</div>
                    </div>
                  </div>
                </div>
                
                {order.payment && (
                  <div className="relative mb-6">
                    <div className="flex items-start">
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-600 mr-4 z-10">
                        <CreditCardIcon size={16} />
                      </div>
                      <div>
                        <div className="text-sm font-medium">Payment {order.payment_status || 'Processing'}</div>
                        <div className="text-sm text-gray-500">{order.payment.date || 'N/A'}</div>
                      </div>
                    </div>
                  </div>
                )}
                
                {order.shipment_status === 'Delivered' && (
                  <div className="relative">
                    <div className="flex items-start">
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-green-100 text-green-600 mr-4 z-10">
                        <TruckIcon size={16} />
                      </div>
                      <div>
                        <div className="text-sm font-medium">Order Delivered</div>
                        <div className="text-sm text-gray-500">The order has been delivered</div>
                      </div>
                    </div>
                  </div>
                )}
                
                {order.shipment_status !== 'Delivered' && (
                  <div className="relative">
                    <div className="flex items-start">
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-100 text-gray-400 mr-4 z-10">
                        <TruckIcon size={16} />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-400">Order Processing</div>
                        <div className="text-sm text-gray-500">Pending delivery</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </AdminLayout>
  );
};

export default OrderDetail;


