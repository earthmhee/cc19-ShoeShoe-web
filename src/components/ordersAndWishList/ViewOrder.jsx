// src/components/ViewOrder.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

const ViewOrder = () => {
	const { id } = useParams(); // ดึง order ID จาก URL
	const [order, setOrder] = useState(null);
	const [error, setError] = useState("");
	const [successMessage, setSuccessMessage] = useState("");
	const { isSignedIn, getToken } = useAuth();
	const navigate = useNavigate();

	// Fetch order details
	useEffect(() => {
		if (!isSignedIn) {
			navigate("/sign-in");
			return;
		}

		const fetchOrder = async () => {
			try {
				const token = await getToken();
				const response = await axios.get(
					`http://localhost:8000/api/order/view-order/${id}`,
					{
						headers: { Authorization: `Bearer ${token}` },
					}
				);
				setOrder(response.data.data); // ตั้งค่าข้อมูลคำสั่งซื้อจาก response
			} catch (err) {
				setError(err.response?.data?.msg || "Failed to fetch order details.");
				console.error("Error fetching order:", err);
			}
		};
		fetchOrder();
	}, [id, isSignedIn, getToken, navigate]);

	// Handle back navigation
	const handleBack = () => {
		navigate("/account/orders");
	};

	if (!order) {
		return <p className="text-gray-500">Loading order details...</p>;
	}

	return (
		<div className="w-full max-w-4xl mx-auto p-6">
			<div className="border-b border-gray-300 pb-2 mb-6">
				<h1 className="text-2xl font-bold text-gray-800">ORDER DETAILS</h1>
			</div>

			{/* Order Details Card */}
			<div className="card bg-base-100 shadow-md border border-gray-200 rounded-lg">
				<div className="card-body">
					{/* Order Header */}
					<div className="flex justify-between items-center mb-4">
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

					{/* User Information */}
					<div className="mb-4">
						<h3 className="text-md font-medium">User Information:</h3>
						<p>
							<strong>Name:</strong> {order.user.firstname}{" "}
							{order.user.lastname}
						</p>
						<p>
							<strong>Email:</strong> {order.user.email}
						</p>
						<p>
							<strong>Phone:</strong> {order.user.phone}
						</p>
						<p>
							<strong>Address:</strong> {order.user.address}
						</p>
					</div>

					{/* Order Items */}
					<div className="mb-4">
						<h3 className="text-md font-medium">Items:</h3>
						<ul className="list-disc list-inside">
							{order.orderItems.map((item) => (
								<li key={item.id} className="text-sm text-gray-600">
									{item.product?.name} ({item.quantity} x ฿{item.price})
								</li>
							))}
						</ul>
					</div>

					{/* Payment Information */}
					<div className="mb-4">
						<h3 className="text-md font-medium">Payment Information:</h3>
						{order.payment ? (
							<p>
								<strong>Payment Status:</strong> {order.payment.status}
								<br />
								<strong>Transaction ID:</strong> {order.payment.transaction_id}
							</p>
						) : (
							<p>No payment information available.</p>
						)}
					</div>

					{/* Total Amount */}
					<p className="mt-2 text-md font-medium">
						Total: ฿{order.total_amount}
					</p>

					{/* Card Actions */}
					<div className="card-actions mt-4">
						<button onClick={handleBack} className="btn btn-primary btn-sm">
							Back to Orders
						</button>
						{order.payment_status === "Unpaid" && (
							<button className="btn btn-warning btn-sm">Buy Now</button>
						)}
					</div>
				</div>
			</div>

			{/* Display success or error messages */}
			{error && <p className="text-red-500 mt-4">{error}</p>}
			{successMessage && (
				<p className="text-green-500 mt-4">{successMessage}</p>
			)}
		</div>
	);
};

export default ViewOrder;
