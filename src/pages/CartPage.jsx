// src/pages/CartPage.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router"; // Fixed import
import useCartStore from "../stores/useCartStore";
import useUserStore from "../stores/userStore";
import { useAuth, SignInButton } from "@clerk/clerk-react";
import AddressSelect from "../components/accountManage/AddressSelect";
import UnPaidOrder from "../components/ordersAndWishList/UnPaidModal";

const CartPage = () => {
	const {
		items,
		totalItems,
		totalPrice,
		loading,
		error,
		fetchCart,
		removeFromCart,
		updateQuantity,
		clearCart,
		checkout,
	} = useCartStore();
	const { user } = useUserStore();
	const [checkoutLoading, setCheckoutLoading] = useState(false);
	const [selectedAddressId, setSelectedAddressId] = useState(null);
	const navigate = useNavigate();
	const { getToken, isSignedIn } = useAuth();

	useEffect(() => {
		fetchCart();
	}, [fetchCart]);

	// Format price with Thai Baht symbol
	const formatPrice = (price) => {
		if (price === undefined || price === null) return "฿0";
		return `฿${Number(price).toLocaleString()}`;
	};

	const handleCheckout = async () => {
		if (items.length === 0) return;

		setCheckoutLoading(true);
		try {
			if (!isSignedIn) {
				alert("Please sign in to proceed with the purchase");
				navigate("/");
				return;
			}
			const token = await getToken();

			const result = await checkout({
				shippingDetails: selectedAddressId,
			});

			if (result) {
				console.log(result);
				<Link to={`checkout/${result.order.id}`} />;
			}
		} catch (error) {
			console.error("Checkout failed:", error);
			alert("Checkout failed. Please try again.");
		} finally {
			setCheckoutLoading(false);
		}
	};

	if (loading && items.length === 0) {
		return (
			<div className="max-w-6xl mx-auto p-6 min-h-[60vh] flex flex-col items-center justify-center">
				<div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900 mb-4"></div>
				<p>Loading cart...</p>
			</div>
		);
	}

	if (items.length === 0) {
		return (
			<div className="max-w-6xl mx-auto p-6 min-h-[80vh] flex flex-col items-center justify-center">
				<h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
				<p className="text-gray-600 mb-8">
					It looks like you haven't added any items to your cart yet.
				</p>
				<Link
					to="/"
					className="bg-gray-900 text-white py-3 px-8 mb-4 rounded-md hover:bg-black"
				>
					Continue Shopping
				</Link>

				{isSignedIn && <UnPaidOrder />}
			</div>
		);
	}
	console.log(items);

	return (
		<div className="max-w-6xl mx-auto p-6">
			<h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>

			{error && (
				<div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-6">
					{error}
				</div>
			)}

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				<div className="lg:col-span-2">
					{items.map((item) => (
						<div key={item.id} className="flex border-b py-6">
							<div className="w-24 h-24 flex-shrink-0">
								<Link to={`/product/${item.productId}`}>
									<img
										src={item.image}
										alt={item.productName}
										className="w-full h-full object-cover rounded"
									/>
								</Link>
							</div>

							<div className="ml-4 flex-grow">
								<div className="flex justify-between">
									<div>
										<p className="text-sm text-gray-500 ">{item.brand}</p>
										<Link to={`/product/${item.productId}`}>
											<h3 className="font-medium hover:text-red-600">
												{item.productName}
											</h3>
										</Link>
										<p className="text-sm text-gray-600 mt-1">
											Size: US {item.sizeUS} ({item.sizeGender})
										</p>
									</div>

									<div className="text-right">
										<p className="font-medium">
											{formatPrice(item.discountedPrice * item.quantity)}
										</p>
										{item.price !== item.discountedPrice && (
											<p className="text-sm text-gray-500 line-through">
												{formatPrice(item.price * item.quantity)}
											</p>
										)}
									</div>
								</div>

								<div className="flex justify-between items-center mt-4">
									<div className="flex items-center border border-gray-300 rounded-md">
										<button
											onClick={async () => {
												const token = isSignedIn ? await getToken() : null;
												updateQuantity(item.id, item.quantity - 1, token);
											}}
											disabled={item.quantity <= 1 || loading}
											className={`px-3 py-1 text-gray-600 ${
												item.quantity <= 1 || loading
													? "bg-gray-100 cursor-not-allowed"
													: "hover:bg-gray-100 hover:cursor-pointer"
											}`}
										>
											-
										</button>
										<span className="px-3 py-1 border-x border-gray-300">
											{item.quantity}
										</span>
										<button
											onClick={async () => {
												const token = isSignedIn ? await getToken() : null;
												updateQuantity(item.id, item.quantity + 1, token);
											}}
											disabled={loading}
											className={`px-3 py-1 text-gray-600 ${
												loading
													? "bg-gray-100 cursor-not-allowed"
													: "hover:bg-gray-100 hover:cursor-pointer"
											}`}
										>
											+
										</button>
									</div>

									<button
										onClick={async () => {
											const token = isSignedIn ? await getToken() : null;
											const success = await removeFromCart(item.id, token);
										}}
										disabled={loading}
										className="text-gray-500 hover:text-red-500 hover:cursor-pointer"
									>
										Remove
									</button>
								</div>
							</div>
						</div>
					))}

					<div className="flex justify-between mt-6">
						<button
							onClick={async () => {
								const token = isSignedIn ? await getToken() : null;
								clearCart(token);
							}}
							disabled={loading}
							className="text-gray-500 hover:text-gray-700 hover:cursor-pointer"
						>
							Clear Cart
						</button>

						<Link to="/" className="text-gray-600 hover:text-gray-900">
							Continue Shopping
						</Link>
					</div>
				</div>
				<div>
					{isSignedIn && (
						<AddressSelect onSelectAddress={setSelectedAddressId} />
					)}
					<div className="bg-gray-50 p-6 rounded-lg h-fit">
						<h2 className="text-lg font-bold mb-4">Order Summary</h2>

						<div className="space-y-2 mb-4">
							<div className="flex justify-between">
								<span>Subtotal ({totalItems} items)</span>
								<span>{formatPrice(totalPrice)}</span>
							</div>
							<div className="flex justify-between">
								<span>Shipping Fee</span>
								<span>Free</span>
							</div>
						</div>

						<div className="border-t pt-4 mb-6">
							<div className="flex justify-between font-bold">
								<span>Total</span>
								<span>{formatPrice(totalPrice)}</span>
							</div>
						</div>

						{isSignedIn ? (
							<button
								onClick={handleCheckout}
								disabled={loading || checkoutLoading || !selectedAddressId}
								className={`w-full py-3 px-4 rounded-md font-medium text-center  ${
									loading || checkoutLoading || !selectedAddressId
										? "bg-gray-300 text-gray-500 cursor-not-allowed "
										: "bg-gray-900 text-white hover:bg-black hover:cursor-pointer"
								}`}
							>
								{checkoutLoading ? "Processing..." : "Proceed to Checkout"}
							</button>
						) : (
							<SignInButton
								mode="modal"
								appearance={{
									elements: {
										// footer: { display: "initial" },
										// footerAction: { display: "initial" },
										// footerAction__signIn: { display: "initial" },
									},
								}}
							>
								<button
									className={`w-full py-3 px-4 rounded-md font-medium text-center bg-gray-900 text-white hover:bg-black hover:cursor-pointer`}
								>
									Proceed to Checkout
								</button>
							</SignInButton>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default CartPage;
