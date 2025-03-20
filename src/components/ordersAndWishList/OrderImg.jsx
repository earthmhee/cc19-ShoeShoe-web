import React from "react";

function OrderImg({ order }) {
	return (
		<>
			<ul className="list-disc list-inside">
				{order.orderItems.map((item) => (
					<li
						key={item.id}
						className="text-sm text-gray-600 flex items-center gap-4 mb-4"
					>
						{/* Stack container for images */}
						<div className="stack w-24">
							{/* Handle images as a JSON string and parse it */}
							{item.product?.images
								? (() => {
										try {
											const imageUrls = JSON.parse(item.product.images);
											return Array.isArray(imageUrls) ? (
												imageUrls.map((imageUrl, index) => (
													<img
														key={index}
														src={imageUrl}
														alt={`${item.product.productname} image ${
															index + 1
														}`}
														className="rounded-box"
													/>
												))
											) : (
												<img
													src={imageUrls}
													alt={item.product.productname}
													className="rounded-box"
												/>
											);
										} catch (e) {
											console.error("Failed to parse images:", e);
											return (
												<img
													src={item.product.images}
													alt={item.product.productname}
													className="rounded-box"
												/>
											); // Fallback to raw string if parsing fails
										}
								  })()
								: null}
						</div>
						{/* Product details */}
						<div>
							{item.product?.productname} ({item.quantity} x ฿
							{Number(item.price).toLocaleString()})
						</div>
					</li>
				))}
			</ul>
		</>
	);
}

export default OrderImg;
