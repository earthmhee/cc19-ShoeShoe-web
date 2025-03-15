import React, { useState, useEffect } from 'react';
import { Search, Filter, ChevronDown, ChevronUp, Eye, ShoppingBag } from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout';
import axios from 'axios';
import { toast } from 'react-toastify';

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrder, setExpandedOrder] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterOptions, setFilterOptions] = useState({
        status: 'all',
        paymentStatus: 'all',
        date: 'all',
    });
    const [selectedOrders, setSelectedOrders] = useState([]);
    const [bulkAction, setBulkAction] = useState('');
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [orderToUpdate, setOrderToUpdate] = useState(null);
    const [newStatus, setNewStatus] = useState('');

    // Fetch orders on component mount
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);

                // In a real app, you would fetch from your API
                // const response = await axios.get('http://localhost:8001/api/orders');

                // For now, use mock data
                const mockOrders = [
                    {
                        id: 1001,
                        user: {
                            id: 1,
                            username: 'johndoe',
                            email: 'john@example.com',
                            firstname: 'John',
                            lastname: 'Doe',
                        },
                        order_date: '2025-03-12T08:30:00Z',
                        total_amount: 7800,
                        shipment_status: 'Pending',
                        payment_status: 'Paid',
                        orderItems: [
                            {
                                id: 1,
                                product: {
                                    id: 3,
                                    productname: 'Nike Air Jordan 1',
                                    price: 4300,
                                    brand: 'Nike',
                                    images: '["https://res.cloudinary.com/dfmqmyop1/image/upload/v1741703511/9991-NIK55355817200W008-1_xboav9.jpg"]',
                                    gender: 'Men',
                                },
                                quantity: 1,
                                price: 4300,
                            },
                            {
                                id: 2,
                                product: {
                                    id: 7,
                                    productname: 'Converse Star Player 76',
                                    price: 2400,
                                    brand: 'Converse',
                                    images: '["https://res.cloudinary.com/dfmqmyop1/image/upload/v1741703882/9991-CONA09857C00W004-1_agiova.jpg"]',
                                    gender: 'Men',
                                },
                                quantity: 2,
                                price: 3500, // Discounted price
                            },
                        ],
                        payment: {
                            id: 1,
                            payment_date: '2025-03-12T08:35:00Z',
                            paymentmethod: 'CreditCard',
                            amount: 7800,
                        },
                        shipping_address: '123 Main St, Bangkok, Thailand',
                    },
                    {
                        id: 1002,
                        user: {
                            id: 2,
                            username: 'janedoe',
                            email: 'jane@example.com',
                            firstname: 'Jane',
                            lastname: 'Doe',
                        },
                        order_date: '2025-03-13T10:15:00Z',
                        total_amount: 5990,
                        shipment_status: 'Delivered',
                        payment_status: 'Paid',
                        orderItems: [
                            {
                                id: 3,
                                product: {
                                    id: 9,
                                    productname: 'Hoka Clifton 9',
                                    price: 5990,
                                    brand: 'Hoka',
                                    images: '["https://res.cloudinary.com/dfmqmyop1/image/upload/v1741704615/9991-HKE1127895BL005009-1_nyhs84.jpg"]',
                                    gender: 'Men',
                                },
                                quantity: 1,
                                price: 5990,
                            },
                        ],
                        payment: {
                            id: 2,
                            payment_date: '2025-03-13T10:20:00Z',
                            paymentmethod: 'Promptpay',
                            amount: 5990,
                        },
                        shipping_address: '456 Oak St, Bangkok, Thailand',
                    },
                    {
                        id: 1003,
                        user: {
                            id: 3,
                            username: 'bobsmith',
                            email: 'bob@example.com',
                            firstname: 'Bob',
                            lastname: 'Smith',
                        },
                        order_date: '2025-03-14T09:45:00Z',
                        total_amount: 6490,
                        shipment_status: 'Pending',
                        payment_status: 'Unpaid',
                        orderItems: [
                            {
                                id: 4,
                                product: {
                                    id: 10,
                                    productname: 'Hoka Bondi 8',
                                    price: 6490,
                                    brand: 'Hoka',
                                    images: '["https://res.cloudinary.com/dfmqmyop1/image/upload/v1741704790/9991-HKE1123202SBOLI007-1_faoor7.jpg"]',
                                    gender: 'Men',
                                },
                                quantity: 1,
                                price: 6490,
                            },
                        ],
                        payment: null,
                        shipping_address: '789 Pine St, Chiang Mai, Thailand',
                    },
                ];

                setOrders(mockOrders);
                setFilteredOrders(mockOrders);
            } catch (error) {
                console.error('Error fetching orders:', error);
                toast.error('Failed to load orders');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    // Filter orders when criteria change
    useEffect(() => {
        let result = [...orders];

        // Apply search filter
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            result = result.filter(order =>
                order.id.toString().includes(searchLower) ||
                `${order.user.firstname} ${order.user.lastname}`.toLowerCase().includes(searchLower) ||
                order.user.email.toLowerCase().includes(searchLower)
            );
        }

        // Apply status filter
        if (filterOptions.status !== 'all') {
            result = result.filter(order => order.shipment_status === filterOptions.status);
        }

        // Apply payment status filter
        if (filterOptions.paymentStatus !== 'all') {
            result = result.filter(order => order.payment_status === filterOptions.paymentStatus);
        }

        // Apply date filter
        if (filterOptions.date !== 'all') {
            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            const lastWeek = new Date(today);
            lastWeek.setDate(lastWeek.getDate() - 7);
            const lastMonth = new Date(today);
            lastMonth.setMonth(lastMonth.getMonth() - 1);

            result = result.filter(order => {
                const orderDate = new Date(order.order_date);

                switch (filterOptions.date) {
                    case 'today':
                        return orderDate >= today;
                    case 'yesterday':
                        return orderDate >= yesterday && orderDate < today;
                    case 'last7days':
                        return orderDate >= lastWeek;
                    case 'last30days':
                        return orderDate >= lastMonth;
                    default:
                        return true;
                }
            });
        }

        // Sort by most recent
        result.sort((a, b) => new Date(b.order_date) - new Date(a.order_date));

        setFilteredOrders(result);
    }, [orders, searchTerm, filterOptions]);

    const toggleOrderExpansion = (orderId) => {
        setExpandedOrder(expandedOrder === orderId ? null : orderId);
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    const parseImages = (imagesString) => {
        try {
            if (typeof imagesString === "string") {
                return JSON.parse(imagesString)[0];
            }
            return '';
        } catch (error) {
            return '';
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilterOptions(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleOrderSelection = (orderId) => {
        setSelectedOrders(prev => {
            if (prev.includes(orderId)) {
                return prev.filter(id => id !== orderId);
            } else {
                return [...prev, orderId];
            }
        });
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedOrders(filteredOrders.map(order => order.id));
        } else {
            setSelectedOrders([]);
        }
    };

    const openUpdateDialog = (order, status) => {
        setOrderToUpdate(order);
        setNewStatus(status);
        setConfirmDialogOpen(true);
    };

    const handleStatusUpdate = async () => {
        try {
            setLoading(true);

            // In a real app, you would call your API
            // await axios.patch(`http://localhost:8001/api/orders/${orderToUpdate.id}`, {
            //   shipment_status: newStatus
            // });

            // For now, update the state directly
            const updatedOrders = orders.map(order => {
                if (order.id === orderToUpdate.id) {
                    return {
                        ...order,
                        shipment_status: newStatus
                    };
                }
                return order;
            });

            setOrders(updatedOrders);
            toast.success(`Order #${orderToUpdate.id} status updated to ${newStatus}`);

        } catch (error) {
            console.error('Error updating order status:', error);
            toast.error('Failed to update order status');
        } finally {
            setConfirmDialogOpen(false);
            setOrderToUpdate(null);
            setNewStatus('');
            setLoading(false);
        }
    };

    const handleBulkAction = async () => {
        if (!bulkAction || selectedOrders.length === 0) {
            toast.error('Please select an action and at least one order');
            return;
        }

        try {
            setLoading(true);

            // In a real app, you would call your API
            // await axios.post(`http://localhost:8001/api/orders/bulk-update`, {
            //   orderIds: selectedOrders,
            //   action: bulkAction
            // });

            // For now, update the state directly
            const updatedOrders = orders.map(order => {
                if (selectedOrders.includes(order.id)) {
                    return {
                        ...order,
                        shipment_status: bulkAction
                    };
                }
                return order;
            });

            setOrders(updatedOrders);
            toast.success(`${selectedOrders.length} orders updated to ${bulkAction}`);
            setSelectedOrders([]);
            setBulkAction('');

        } catch (error) {
            console.error('Error performing bulk action:', error);
            toast.error('Failed to update orders');
        } finally {
            setLoading(false);
        }
    };

    if (loading && orders.length === 0) {
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return (
        <AdminLayout>
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Order Management</h1>
                <div className="flex space-x-2">
                    <select
                        value={bulkAction}
                        onChange={(e) => setBulkAction(e.target.value)}
                        className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                    >
                        <option value="">Bulk Actions</option>
                        <option value="Pending">Set to Pending</option>
                        <option value="Processing">Set to Processing</option>
                        <option value="Shipped">Set to Shipped</option>
                        <option value="Delivered">Set to Delivered</option>
                        <option value="Cancelled">Set to Cancelled</option>
                    </select>
                    <button
                        onClick={handleBulkAction}
                        disabled={selectedOrders.length === 0 || !bulkAction}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm disabled:bg-blue-300"
                    >
                        Apply
                    </button>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-lg shadow mb-6">
                <div className="p-4 border-b border-gray-200">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                        <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                            <div className="flex items-center space-x-2">
                                <Filter className="w-5 h-5 text-gray-500" />
                                <span className="text-sm font-medium text-gray-700">Filter by:</span>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                <select
                                    name="status"
                                    value={filterOptions.status}
                                    onChange={handleFilterChange}
                                    className="border border-gray-300 rounded-md px-3 py-1.5 text-sm"
                                >
                                    <option value="all">All Statuses</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Processing">Processing</option>
                                    <option value="Shipped">Shipped</option>
                                    <option value="Delivered">Delivered</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>

                                <select
                                    name="paymentStatus"
                                    value={filterOptions.paymentStatus}
                                    onChange={handleFilterChange}
                                    className="border border-gray-300 rounded-md px-3 py-1.5 text-sm"
                                >
                                    <option value="all">All Payment Statuses</option>
                                    <option value="Paid">Paid</option>
                                    <option value="Unpaid">Unpaid</option>
                                    <option value="Cancel">Cancelled</option>
                                </select>

                                <select
                                    name="date"
                                    value={filterOptions.date}
                                    onChange={handleFilterChange}
                                    className="border border-gray-300 rounded-md px-3 py-1.5 text-sm"
                                >
                                    <option value="all">All Time</option>
                                    <option value="today">Today</option>
                                    <option value="yesterday">Yesterday</option>
                                    <option value="last7days">Last 7 Days</option>
                                    <option value="last30days">Last 30 Days</option>
                                </select>
                            </div>
                        </div>

                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search orders..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="border border-gray-300 rounded-md pl-10 pr-4 py-2 w-full sm:w-64"
                            />
                            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                        </div>
                    </div>
                </div>

                {/* Order count */}
                <div className="p-4 bg-gray-50 text-sm text-gray-600">
                    Showing {filteredOrders.length} of {orders.length} orders
                </div>
            </div>

            {/* Orders table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left">
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            onChange={handleSelectAll}
                                            checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                    </div>
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredOrders.length > 0 ? (
                                filteredOrders.map(order => (
                                    <React.Fragment key={order.id}>
                                        <tr className={selectedOrders.includes(order.id) ? 'bg-blue-50' : ''}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedOrders.includes(order.id)}
                                                    onChange={() => handleOrderSelection(order.id)}
                                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <button
                                                        onClick={() => toggleOrderExpansion(order.id)}
                                                        className="mr-2 text-gray-400 hover:text-gray-600"
                                                    >
                                                        {expandedOrder === order.id ? (
                                                            <ChevronUp className="w-5 h-5" />
                                                        ) : (
                                                            <ChevronDown className="w-5 h-5" />
                                                        )}
                                                    </button>
                                                    <div className="font-medium text-gray-900">#{order.id}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{order.user.firstname} {order.user.lastname}</div>
                                                <div className="text-sm text-gray-500">{order.user.email}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{formatDate(order.order_date)}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.shipment_status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                                        order.shipment_status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                            order.shipment_status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                                                                order.shipment_status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                                                                    'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {order.shipment_status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.payment_status === 'Paid' ? 'bg-green-100 text-green-800' :
                                                        order.payment_status === 'Unpaid' ? 'bg-yellow-100 text-yellow-800' :
                                                            'bg-red-100 text-red-800'
                                                    }`}>
                                                    {order.payment_status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                ฿{order.total_amount.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex space-x-2">
                                                    <button
                                                        className="text-indigo-600 hover:text-indigo-900"
                                                        onClick={() => toggleOrderExpansion(order.id)}
                                                    >
                                                        <Eye className="w-5 h-5" />
                                                    </button>
                                                    <div className="relative">
                                                        <select
                                                            onChange={(e) => openUpdateDialog(order, e.target.value)}
                                                            value=""
                                                            className="appearance-none border border-gray-300 rounded px-2 py-1 text-xs cursor-pointer"
                                                        >
                                                            <option value="" disabled>Update</option>
                                                            <option value="Pending">Pending</option>
                                                            <option value="Processing">Processing</option>
                                                            <option value="Shipped">Shipped</option>
                                                            <option value="Delivered">Delivered</option>
                                                            <option value="Cancelled">Cancelled</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>

                                        {/* Expanded order details */}
                                        {expandedOrder === order.id && (
                                            <tr>
                                                <td colSpan="8" className="px-6 py-4 bg-gray-50">
                                                    <div className="space-y-4">
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <div>
                                                                <h4 className="text-sm font-medium text-gray-700 mb-2">Order Details</h4>
                                                                <div className="bg-white p-3 rounded border border-gray-200">
                                                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                                                        <div className="text-gray-500">Order ID:</div>
                                                                        <div>#{order.id}</div>
                                                                        <div className="text-gray-500">Date:</div>
                                                                        <div>{formatDate(order.order_date)}</div>
                                                                        <div className="text-gray-500">Status:</div>
                                                                        <div>{order.shipment_status}</div>
                                                                        <div className="text-gray-500">Payment Status:</div>
                                                                        <div>{order.payment_status}</div>
                                                                        {order.payment && (
                                                                            <>
                                                                                <div className="text-gray-500">Payment Method:</div>
                                                                                <div>{order.payment.paymentmethod}</div>
                                                                                <div className="text-gray-500">Payment Date:</div>
                                                                                <div>{formatDate(order.payment.payment_date)}</div>
                                                                            </>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div>
                                                                <h4 className="text-sm font-medium text-gray-700 mb-2">Customer Information</h4>
                                                                <div className="bg-white p-3 rounded border border-gray-200">
                                                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                                                        <div className="text-gray-500">Name:</div>
                                                                        <div>{order.user.firstname} {order.user.lastname}</div>
                                                                        <div className="text-gray-500">Email:</div>
                                                                        <div>{order.user.email}</div>
                                                                        <div className="text-gray-500">Username:</div>
                                                                        <div>{order.user.username}</div>
                                                                        <div className="text-gray-500">Shipping Address:</div>
                                                                        <div>{order.shipping_address}</div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <h4 className="text-sm font-medium text-gray-700 mb-2">Order Items</h4>
                                                            <div className="bg-white overflow-hidden border border-gray-200 rounded-md">
                                                                <table className="min-w-full divide-y divide-gray-200">
                                                                    <thead className="bg-gray-50">
                                                                        <tr>
                                                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                                                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                                                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                                                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody className="divide-y divide-gray-200">
                                                                        {order.orderItems.map(item => (
                                                                            <tr key={item.id}>
                                                                                <td className="px-4 py-3">
                                                                                    <div className="flex items-center">
                                                                                        <div className="h-10 w-10 flex-shrink-0">
                                                                                            <img
                                                                                                src={parseImages(item.product.images)}
                                                                                                alt={item.product.productname}
                                                                                                className="h-10 w-10 object-cover rounded"
                                                                                            />
                                                                                        </div>
                                                                                        <div className="ml-4">
                                                                                            <div className="text-sm font-medium text-gray-900">{item.product.productname}</div>
                                                                                            <div className="text-sm text-gray-500">{item.product.brand}</div>
                                                                                        </div>
                                                                                    </div>
                                                                                </td>
                                                                                <td className="px-4 py-3 text-sm text-gray-500">฿{item.price.toLocaleString()}</td>
                                                                                <td className="px-4 py-3 text-sm text-gray-500">{item.quantity}</td>
                                                                                <td className="px-4 py-3 text-sm text-gray-500">฿{(item.price * item.quantity).toLocaleString()}</td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                    <tfoot className="bg-gray-50">
                                                                        <tr>
                                                                            <td colSpan="3" className="px-4 py-3 text-sm font-medium text-gray-900 text-right">Total</td>
                                                                            <td className="px-4 py-3 text-sm font-medium text-gray-900">฿{order.total_amount.toLocaleString()}</td>
                                                                        </tr>
                                                                    </tfoot>
                                                                </table>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="px-6 py-10 text-center text-gray-500">
                                        <div className="flex flex-col items-center">
                                            <ShoppingBag className="w-12 h-12 text-gray-400 mb-4" />
                                            <p className="text-lg font-medium mb-1">No orders found</p>
                                            <p className="text-sm">Try adjusting your search or filter to find what you're looking for.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Status Update confirmation dialog */}
            {confirmDialogOpen && (
                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>

                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                                        <Filter className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900">Update Order Status</h3>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500">
                                                Are you sure you want to update Order #{orderToUpdate?.id} status to {newStatus}?
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    onClick={handleStatusUpdate}
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Confirm
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setConfirmDialogOpen(false);
                                        setOrderToUpdate(null);
                                        setNewStatus('');
                                    }}
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
        </AdminLayout>
    );
};

export default OrderManagement;