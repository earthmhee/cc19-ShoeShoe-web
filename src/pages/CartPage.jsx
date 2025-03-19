// src/pages/CartPage.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router"; // Fixed import
import useCartStore from "../stores/useCartStore";
import useUserStore from "../stores/userStore";
import { useAuth } from "@clerk/clerk-react";
import AddressSelect from "../components/accountManage/AddressSelect";

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
				alert("กรุณาเข้าสู่ระบบเพื่อดำเนินการสั่งซื้อ");
				navigate("/login");
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
			alert("การสั่งซื้อล้มเหลว กรุณาลองใหม่อีกครั้ง");
		} finally {
			setCheckoutLoading(false);
		}
	};

	if (loading && items.length === 0) {
		return (
			<div className="max-w-6xl mx-auto p-6 min-h-[60vh] flex flex-col items-center justify-center">
				<div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900 mb-4"></div>
				<p>กำลังโหลดตะกร้าสินค้า...</p>
			</div>
		);
	}

	if (items.length === 0) {
		return (
			<div className="max-w-6xl mx-auto p-6 min-h-[60vh] flex flex-col items-center justify-center">
				<h1 className="text-2xl font-bold mb-4">ตะกร้าสินค้าของคุณว่างเปล่า</h1>
				<p className="text-gray-600 mb-8">
					ดูเหมือนว่าคุณยังไม่ได้เพิ่มสินค้าใดๆ ลงในตะกร้า
				</p>
				<Link
					to="/"
					className="bg-gray-900 text-white py-3 px-8 rounded-md hover:bg-black"
				>
					เลือกซื้อสินค้าต่อ
				</Link>
			</div>
		);
	}

	return (
		<div className="max-w-6xl mx-auto p-6">
			<h1 className="text-2xl font-bold mb-6">ตะกร้าสินค้า</h1>

			{error && (
				<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
					{error}
				</div>
			)}

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				<div className="lg:col-span-2">
					{items.map((item) => (
						<div key={item.id} className="flex border-b py-6">
							<div className="w-24 h-24 flex-shrink-0">
								<img
									src={item.image}
									alt={item.productName}
									className="w-full h-full object-cover rounded"
								/>
							</div>

							<div className="ml-4 flex-grow">
								<div className="flex justify-between">
									<div>
										<p className="text-sm text-gray-500">{item.brand}</p>
										<h3 className="font-medium">{item.productName}</h3>
										<p className="text-sm text-gray-600 mt-1">
											ไซส์: US {item.sizeUS} ({item.sizeGender})
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
													: "hover:bg-gray-100"
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
													: "hover:bg-gray-100"
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
										className="text-gray-500 hover:text-red-500"
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
							className="text-gray-500 hover:text-gray-700"
						>
							ล้างตะกร้า
						</button>

						<Link to="/" className="text-gray-600 hover:text-gray-900">
							เลือกซื้อสินค้าต่อ
						</Link>
					</div>
				</div>
				<div>
					{isSignedIn && (
						<AddressSelect onSelectAddress={setSelectedAddressId} />
					)}
					<div className="bg-gray-50 p-6 rounded-lg h-fit">
						<h2 className="text-lg font-bold mb-4">สรุปคำสั่งซื้อ</h2>

						<div className="space-y-2 mb-4">
							<div className="flex justify-between">
								<span>ยอดรวม ({totalItems} รายการ)</span>
								<span>{formatPrice(totalPrice)}</span>
							</div>
							<div className="flex justify-between">
								<span>ค่าจัดส่ง</span>
								<span>ฟรี</span>
							</div>
						</div>

						<div className="border-t pt-4 mb-6">
							<div className="flex justify-between font-bold">
								<span>ยอดรวมทั้งสิ้น</span>
								<span>{formatPrice(totalPrice)}</span>
							</div>
						</div>

						<button
							onClick={handleCheckout}
							disabled={loading || checkoutLoading || !selectedAddressId}
							className={`w-full py-3 px-4 rounded-md font-medium text-center  ${
								loading || checkoutLoading || !selectedAddressId
									? "bg-gray-300 text-gray-500 cursor-not-allowed "
									: "bg-gray-900 text-white hover:bg-black hover:cursor-pointer"
							}`}
						>
							{checkoutLoading ? "กำลังดำเนินการ..." : "ดำเนินการสั่งซื้อ"}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CartPage;
