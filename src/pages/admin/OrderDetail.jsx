// src/pages/admin/OrderDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import axios from 'axios';
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

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setIsLoading(true);
        
        // In a real app, you would fetch the order from your API
        // For now, we'll create sample data
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const orderDate = new Date();
        orderDate.setDate(orderDate.getDate() - Math.floor(Math.random() * 10));
        
        const sampleOrder = {
          id: parseInt(id),
          order_date: orderDate.toISOString().split('T')[0],
          shipment_status: Math.random() > 0.5 ? 'Delivered' : 'Pending',
          payment_status: Math.random() > 0.5 ? 'Paid' : 'Unpaid',
          total_amount: Math.floor(Math.random() * 10000) + 1000,
          customer: {
            id: 100 + parseInt(id),
            name: `Customer ${id}`,
            email: `customer${id}@example.com`,
            phone: `+66${Math.floor(Math.random() * 1000000000)}`,
            address: '123 Bangkok Street, Silom, Bangkok 10500, Thailand'
          },
          payment: {
            id: 200 + parseInt(id),
            method: Math.random() > 0.5 ? 'CreditCard' : 'Promptpay',
            date: new Date().toISOString().split('T')[0],
            amount: Math.floor(Math.random() * 10000) + 1000
          },
          items: [
            {
              id: 1,
              product: {
                id: 301,
                productname: 'Samba OG Shoes',
                brand: 'Adidas',
                images: JSON.stringify([
                  "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741702211/Samoa_Shoes_White_JQ0047_01_00_standard_nheewb.jpg"
                ])
              },
              price: 3800,
              quantity: 1
            },
            {
              id: 2,
              product: {
                id: 302,
                productname: 'Hoka Speedgoat 5',
                brand: 'Hoka',
                images: JSON.stringify([
                  "https://res.cloudinary.com/dfmqmyop1/image/upload/v1741750169/9991-HKE1123158CR0CM006-1_kfswf8.jpg"
                ])
              },
              price: 5990,
              quantity: 1
            }
          ]
        };
        
        // Calculate total
        sampleOrder.total_amount = sampleOrder.items.reduce(
          (total, item) => total + (item.price * item.quantity), 
          0
        );
        
        setOrder(sampleOrder);
        setNewStatus(sampleOrder.shipment_status);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching order details:', error);
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);

  const updateOrderStatus = async () => {
    if (newStatus !== order.shipment_status) {
      try {
        // In a real app, you would call your API to update the order status
        // For example:
        // await axios.put(`http://localhost:8000/api/order/update-status/${id}`, { status: newStatus });
        
        // For now, we'll update the local state
        setOrder({ ...order, shipment_status: newStatus });
        alert(`Order status updated to ${newStatus}`);
      } catch (error) {
        console.error('Error updating order status:', error);
        alert('Failed to update order status');
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

  if (isLoading) {
    return (
    <AdminLayout>
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
      </AdminLayout>
    );
  }

  if (!order) {
    return (
        <AdminLayout>
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <AlertCircleIcon size={48} className="mx-auto text-red-500 mb-4" />
        <h2 className="text-xl font-semibold mb-2">Order Not Found</h2>
        <p className="text-gray-500 mb-4">The order you are looking for does not exist or has been removed.</p>
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
                  <div className="font-medium">{order.order_date}</div>
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
                      {order.shipment_status}
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
                      {order.payment_status}
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
                  {order.items.map((item) => {
                    const imageArray = parseImages(item.product.images);
                    const mainImage = imageArray[0] || "";
                    
                    return (
                      <tr key={item.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-12 w-12 rounded-md overflow-hidden bg-gray-100">
                              <img 
                                src={mainImage} 
                                alt={item.product.productname} 
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = 'https://via.placeholder.com/48';
                                }}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{item.product.productname}</div>
                              <div className="text-sm text-gray-500">{item.product.brand}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                          {formatCurrency(item.price)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                          {item.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
                          {formatCurrency(item.price * item.quantity)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan="3" className="px-6 py-4 text-right text-sm font-medium text-gray-500">Subtotal</td>
                    <td className="px-6 py-4 text-right text-sm font-medium text-gray-900">{formatCurrency(order.total_amount)}</td>
                  </tr>
                  <tr>
                    <td colSpan="3" className="px-6 py-4 text-right text-sm font-medium text-gray-500">Shipping</td>
                    <td className="px-6 py-4 text-right text-sm font-medium text-gray-900">฿0</td>
                  </tr>
                  <tr>
                    <td colSpan="3" className="px-6 py-4 text-right text-sm font-bold text-gray-900">Total</td>
                    <td className="px-6 py-4 text-right text-lg font-bold text-gray-900">{formatCurrency(order.total_amount)}</td>
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
                      <div className="font-medium">{order.payment.method}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Payment Date</div>
                      <div className="font-medium">{order.payment.date}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Amount</div>
                      <div className="font-medium">{formatCurrency(order.payment.amount)}</div>
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
                  <div className="font-medium">{order.customer.name}</div>
                </div>
              </div>
              
              <div className="flex items-start mb-4">
                <MailIcon size={20} className="text-gray-400 mr-3 mt-0.5" />
                <div>
                  <div className="text-sm text-gray-500">Email</div>
                  <div className="font-medium">{order.customer.email}</div>
                </div>
              </div>
              
              <div className="flex items-start mb-4">
                <PhoneIcon size={20} className="text-gray-400 mr-3 mt-0.5" />
                <div>
                  <div className="text-sm text-gray-500">Phone</div>
                  <div className="font-medium">{order.customer.phone}</div>
                </div>
              </div>
              
              <div className="flex items-start">
                <MapPinIcon size={20} className="text-gray-400 mr-3 mt-0.5" />
                <div>
                  <div className="text-sm text-gray-500">Address</div>
                  <div className="font-medium">{order.customer.address}</div>
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
                      <div className="text-sm text-gray-500">{order.order_date}</div>
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
                        <div className="text-sm font-medium">Payment {order.payment_status}</div>
                        <div className="text-sm text-gray-500">{order.payment.date}</div>
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