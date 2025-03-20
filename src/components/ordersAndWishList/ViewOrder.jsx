import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import OrderImg from "./OrderImg"; // Import the OrderImg component

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
					`http://localhost:8001/api/order/view-order/${id}`,
					{
						headers: { Authorization: `Bearer ${token}` },
					}
				);
				console.log(response.data.data);
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

	const userAddress = order.address;

	return (
		<div className="w-full max-w-4xl mx-auto p-6">
			<div className="border-b border-gray-300 pb-2 mb-6">
				<h1 className="text-2xl font-bold text-gray-800">ORDER DETAILS</h1>
			</div>

			{/* Order Details Card */}
			<div className="card bg-base-100 shadow-md border border-gray-200 rounded-lg">
				<div className="card-body">
					<div className="pb-2">
						<button
							onClick={handleBack}
							className="absolute p-[30px] -top-4 -left-4 text-gray-600 hover:text-gray-800 focus:outline-none hover:cursor-pointer transition delay-50 duration-100 ease-in-out hover:scale-105 "
							aria-label="Back to Orders"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-6 w-6"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								strokeWidth={2}
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M15 19l-7-7 7-7"
								/>
							</svg>
						</button>
					</div>
					{/* Order Header */}
					<div className="flex justify-between items-center mb-4">
						<h2 className="card-title text-lg font-semibold">
							Order #{order.id} -{" "}
							{new Date(order.order_date).toLocaleDateString()}
						</h2>
						<div className="flex gap-2">
							<span
								className={`badge rounded ${
									order.shipment_status === "Pending"
										? "badge-warning"
										: order.shipment_status === "Shipped"
										? "badge-info"
										: "badge-success"
								}`}
							>
								Shipment: <strong>{order.shipment_status}</strong>
							</span>
							<span
								className={`badge rounded  ${
									order.payment_status === "Unpaid"
										? "badge-error"
										: "badge-success"
								}`}
							>
								Payment: <strong>{order.payment_status}</strong>
							</span>
						</div>
					</div>

					{/* User Information */}
					<div className="mb-4">
						<h3 className="text-md font-bold">User Information</h3>
						<p>
							Name:{" "}
							<strong className="font-semibold">
								{order.user?.firstname || "N/A"} {order.user?.lastname || ""}
							</strong>
						</p>
						<p>
							Phone:{" "}
							<strong className="font-semibold">
								{order.user?.phone || "N/A"}
							</strong>
						</p>
					</div>

					{/* Shipping Address */}
					<div className="mb-4">
						<h3 className="text-md font-medium">Shipping Address</h3>

						<p>
							{userAddress.firstname} {userAddress.lastname}
							<br /> {userAddress.homenum}, {userAddress.subdistrict},{" "}
							{userAddress.district},<br />
							{userAddress.province} Thailand{" "}
							{/* <span className="first-letter:uppercase">
								{userAddress.country}
							</span>{" "} */}
							{userAddress.postcode}
							<br />
							{userAddress.phone}
						</p>
					</div>

					{/* Order Items */}
					<div className="mb-4">
						<h3 className="text-md font-medium">Items</h3>
						<OrderImg order={order} /> {/* Use OrderImg component here */}
					</div>

					{/* Payment Information */}
					<div className="mb-4">
						<h3 className="text-md font-bold">Payment Information</h3>
						{order.payment ? (
							<p>
								Payment Status:{" "}
								<strong
									className={`${
										order.payment_status === "Unpaid"
											? "text-red-700"
											: "text-green-700"
									} font-semibold`}
								>
									{order.payment.status}
								</strong>
								<br />
								Payment method:{" "}
								<strong className="font-semibold">
									{order?.payment?.paymentmethod || "N/A"}
								</strong>
							</p>
						) : (
							<p>No payment information available.</p>
						)}
					</div>

					{/* Total Amount */}
					<p className="mt-2 text-md font-medium">
						Total: ฿{Number(order.total_amount).toLocaleString()}
					</p>

					{/* Card Actions */}

					{/* <button onClick={handleBack} className="btn btn-primary btn-sm">
							Back to Orders
						</button> */}

					<div className="card-actions mt-4 flex justify-end">
						{order.payment_status === "Unpaid" && (
							<Link to={`/checkout/${order.id}`}>
								<button className="btn bg-black btn-sm text-white rounded hover:bg-gray-700 transition delay-50 duration-100 ease-in-out hover:scale-105">
									Continue to payment
								</button>
							</Link>
						)}
						{order.shipment_status === "Pending" &&
							order.payment_status === "Unpaid" && (
								<button
									onClick={() => handleDeleteOrder(order.id)}
									className="btn btn-ghost btn-sm bg-gray-300 text-white hover:bg-gray-200 transition delay-50 duration-100 ease-in-out hover:scale-90 "
								>
									Delete
								</button>
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
