// src/components/MyOrders.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

const MyOrders = () => {
	const [orders, setOrders] = useState([]);
	const [error, setError] = useState("");
	const [successMessage, setSuccessMessage] = useState("");
	const { isSignedIn, getToken } = useAuth();
	const navigate = useNavigate();

	// Fetch all orders for the authenticated user
	useEffect(() => {
		if (!isSignedIn) {
			navigate("/sign-in");
			return;
		}

		const fetchOrders = async () => {
			try {
				const token = await getToken();
				const response = await axios.get(
					"http://localhost:8001/api/order/view-order",
					{
						headers: { Authorization: `Bearer ${token}` },
					}
				);
				console.log(response);
				setOrders(response.data.data); // ตั้งค่าคำสั่งซื้อจาก response
			} catch (err) {
				setError(err.response?.data?.msg || "Failed to fetch orders.");
				console.error("Error fetching orders:", err);
			}
		};
		fetchOrders();
	}, [isSignedIn, getToken, navigate]);

	// Handle order deletion
	const handleDeleteOrder = async (orderId) => {
		try {
			const token = await getToken();
			await axios.delete(
				`http://localhost:8001/api/order/delete-order/${orderId}`,
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			setOrders(orders.filter((order) => order.id !== orderId));
			setSuccessMessage("Order deleted successfully!");
			setError("");
		} catch (err) {
			setError(err.response?.data?.msg || "Failed to delete order.");
			setSuccessMessage("");
			console.error("Error deleting order:", err);
		}
	};

	// Handle order detail navigation
	const handleViewOrder = (orderId) => {
		navigate(`/account/orders/${orderId}`);
	};

	return (
		<div className="w-full max-w-4xl mx-auto p-6">
			<div className="border-b border-gray-300 pb-2 mb-6">
				<h1 className="text-2xl font-bold text-gray-800">MY ORDERS</h1>
			</div>

			{/* Display orders as cards */}
			{orders.length === 0 ? (
				<p className="text-gray-500">You have no orders yet.</p>
			) : (
				<div className="space-y-6">
					{orders.map((order) => (
						<div
							key={order.id}
							className="card bg-base-100 shadow-md border border-gray-200 rounded-lg"
						>
							<div className="card-body">
								{/* Order Header */}
								<div className="flex justify-between items-center">
									<h2 className="card-title text-lg font-semibold">
										Order #{order.id} -{" "}
										{new Date(order.order_date).toLocaleDateString()}
									</h2>
									<div className="flex gap-2">
										<span
											className={`badge ${
												order.shipment_status === "Pending"
													? "badge-warning"
													: order.shipment_status === "Shipped"
													? "badge-info"
													: "badge-success"
											}`}
										>
											{order.shipment_status}
										</span>
										<span
											className={`badge ${
												order.payment_status === "Unpaid"
													? "badge-error"
													: "badge-success"
											}`}
										>
											{order.payment_status}
										</span>
									</div>
								</div>

								{/* Order Items */}
								<div className="mt-4">
									<h3 className="text-md font-medium">Items:</h3>
									<ul className="list-disc list-inside">
										{order.orderItems.map((item) => (
											<li key={item.id} className="text-sm text-gray-600">
												{item.product?.name} ({item.quantity} x ฿{item.price})
											</li>
										))}
									</ul>
								</div>

								{/* Total Amount */}
								<p className="mt-2 text-md font-medium">
									Total: ฿{order.total_amount}
								</p>

								{/* Card Actions */}
								<div className="card-actions mt-4">
									<button
										onClick={() => handleViewOrder(order.id)}
										className="btn btn-primary btn-sm"
									>
										View Details
									</button>
									{order.shipment_status === "Pending" &&
										order.payment_status === "Unpaid" && (
											<button
												onClick={() => handleDeleteOrder(order.id)}
												className="btn btn-error btn-sm"
											>
												Delete
											</button>
										)}
									{order.payment_status === "Unpaid" && (
										<button className="btn btn-warning btn-sm">
											Continue to payment
										</button>
									)}
								</div>
							</div>
						</div>
					))}
				</div>
			)}

			{/* Display success or error messages */}
			{error && <p className="text-red-500 mt-4">{error}</p>}
			{successMessage && (
				<p className="text-green-500 mt-4">{successMessage}</p>
			)}
		</div>
	);
};

export default MyOrders;
