// src/components/ordersAndWishList/UnPaidOrder.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { format, parseISO } from "date-fns";

const UnPaidOrder = () => {
	const [unpaidOrders, setUnpaidOrders] = useState([]);
	const [error, setError] = useState("");
	const [successMessage, setSuccessMessage] = useState("");
	const [latestOrderId, setLatestOrderId] = useState(null);
	const { isSignedIn, getToken } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (!isSignedIn) {
			return;
		}

		const fetchUnpaidOrders = async () => {
			try {
				const token = await getToken();
				const response = await axios.get(
					"http://localhost:8001/api/order/view-order",
					{
						headers: { Authorization: `Bearer ${token}` },
					}
				);
				const unpaid = response.data.data.orders.filter(
					(order) => order.payment_status === "Unpaid"
				);
				setUnpaidOrders(unpaid);
			} catch (err) {
				setError(err.response?.data?.msg || "Failed to fetch unpaid orders.");
			}
		};
		fetchUnpaidOrders();
	}, [isSignedIn, getToken, navigate]);

	const handleDeleteOrder = async (orderId) => {
		try {
			const token = await getToken();
			await axios.delete(
				`http://localhost:8001/api/order/delete-order/${orderId}`,
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			setUnpaidOrders(unpaidOrders.filter((order) => order.id !== orderId));
			setSuccessMessage("Order deleted successfully!");
			setError("");
		} catch (err) {
			setError(err.response?.data?.msg || "Failed to delete order.");
			setSuccessMessage("");
		}
	};

	const handleViewOrder = (orderId) => {
		navigate(`/account/orders/${orderId}`);
	};

	if (unpaidOrders.length === 0) {
		return <></>;
	}
	return (
		<div className="w-fit max-w-4xl mx-auto p-6 rounded bg-gray-50 shadow-lg">
			<div className="border-gray-300">
				<h1 className="text-sm mb-2 font-bold text-gray-800">Unpaid Orders</h1>
			</div>

			{unpaidOrders.length === 0 ? (
				<p className="text-gray-500">You have no unpaid orders.</p>
			) : (
				<div className="max-h-45 border px-3 py-1 rounded overflow-y-auto space-y-3">
					{unpaidOrders.map((order) => (
						<div
							key={order.id}
							className="card mb-4  w-2xl mx-auto bg-gray-100 shadow-md border border-gray-200 rounded-lg hover:bg-white hover:cursor-pointer transition delay-50 duration-100 ease-in-out"
							onClick={() => handleViewOrder(order.id)}
						>
							<div className="p-4">
								<div className="flex justify-between items-center">
									<h2 className="card-title text-sm font-semibold">
										Order #{order.id} -{" "}
										{format(parseISO(order.order_date), "dd/MM/yyyy hh:mm a")}
									</h2>
								</div>
								<div className="flex justify-between items-center">
									<div className="mt-0">
										<h3 className="text-sm pb-1 font-medium">Items:</h3>
										{order.orderItems.map((item) => (
											<ul key={item.id} className="text-sm list-disc pl-4 mb-2">
												<li className="">
													{item.product.productname} ( ฿
													{Number(item.price).toLocaleString()} )
												</li>
											</ul>
										))}
									</div>
									<div>
										<p className="mt-2 text-sm font-medium">
											Total: ฿{Number(order.total_amount).toLocaleString()}
										</p>
									</div>
								</div>

								<div className="card-actions flex justify-end">
									{order.payment_status === "Unpaid" && (
										<Link to={`/checkout/${order.id}`}>
											<button
												onClick={(e) => {
													e.stopPropagation();
												}}
												className="btn bg-black btn-sm text-white rounded hover:bg-gray-700 transition delay-50 duration-100 ease-in-out hover:scale-105"
											>
												Continue to Payment
											</button>
										</Link>
									)}
									{order.shipment_status === "Pending" &&
										order.payment_status === "Unpaid" && (
											<button
												onClick={(e) => {
													e.stopPropagation();
													handleDeleteOrder(order.id);
												}}
												className="btn btn-ghost btn-sm bg-gray-300 text-white hover:bg-gray-200 transition delay-50 duration-100 ease-in-out hover:scale-90"
											>
												Delete
											</button>
										)}
								</div>
							</div>
						</div>
					))}
				</div>
			)}

			{error && <p className="text-red-500 mt-4">{error}</p>}
			{successMessage && (
				<p className="text-green-500 mt-4">{successMessage}</p>
			)}
		</div>
	);
};

export default UnPaidOrder;
