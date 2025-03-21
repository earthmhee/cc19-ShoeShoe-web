import React, { useEffect, useState, useRef, useCallback } from "react";
import { getAllProduct } from "../api/product";
import { Link } from "react-router";

function ProductCard() {
	const [allProducts, setAllProducts] = useState([]);
	const [displayedProducts, setDisplayedProducts] = useState([]);
	const [isOpen, setIsOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [hasMore, setHasMore] = useState(true);
	const observer = useRef();
	const ITEMS_PER_PAGE = 12;
	const currentPage = useRef(1);
	const LOADING_DELAY = 1000; // 1 second delay to see loading state

	// Fetch all products once
	useEffect(() => {
		const fetchProducts = async () => {
			try {
				setLoading(true);
				const response = await getAllProduct();

				// Simulate network delay
				await new Promise((resolve) => setTimeout(resolve, LOADING_DELAY));

				const products = response.data?.data || [];
				setAllProducts(products);

				// Initialize with first page of products
				const initialProducts = products.slice(0, ITEMS_PER_PAGE);
				setDisplayedProducts(initialProducts);
				setHasMore(products.length > ITEMS_PER_PAGE);
				setLoading(false);
			} catch (error) {
				console.error("Error fetching products:", error);
				setLoading(false);
			}
		};

		fetchProducts();
	}, []);

	// Load more products (client-side pagination)
	const loadMoreProducts = useCallback(() => {
		if (loading || !hasMore) return;

		setLoading(true);

		// Simulate network delay
		setTimeout(() => {
			// Calculate next page
			const nextPage = currentPage.current + 1;
			const startIndex = (nextPage - 1) * ITEMS_PER_PAGE;
			const endIndex = nextPage * ITEMS_PER_PAGE;

			// Get next batch of products
			const nextProducts = allProducts.slice(startIndex, endIndex);

			// Update state
			if (nextProducts.length > 0) {
				setDisplayedProducts((prev) => [...prev, ...nextProducts]);
				currentPage.current = nextPage;
				setHasMore(endIndex < allProducts.length);
			} else {
				setHasMore(false);
			}

			setLoading(false);
		}, LOADING_DELAY);
	}, [allProducts, loading, hasMore]);

	// Setup the intersection observer for infinite scrolling
	const lastProductElementRef = useCallback(
		(node) => {
			if (loading) return;

			if (observer.current) observer.current.disconnect();

			observer.current = new IntersectionObserver(
				(entries) => {
					if (entries[0].isIntersecting && hasMore) {
						loadMoreProducts();
					}
				},
				{ threshold: 0.5 }
			);

			if (node) observer.current.observe(node);
		},
		[loading, hasMore, loadMoreProducts]
	);

	const productNameStyle = {
		fontFamily: "'Lexend', sans-serif",
		fontWeight: 300,
	};

	const parseImages = (imagesString) => {
		try {
			if (typeof imagesString === "string") {
				return JSON.parse(imagesString);
			}
			return imagesString || [];
		} catch (error) {
			return (
				imagesString
					?.replace(/^\[|\]$/g, "")
					.split(",")
					.map((url) => url.replace(/^"|"$/g, "")) || []
			);
		}
	};

	return (
		<div
			className={`flex-1 bg-white transition-all duration-200 ${
				isOpen ? "lg:ml-0" : "ml-0"
			} lg:pt-0 pt-16`}
		>
			<div className="max-w-7xl mx-auto p-4">
				<div className="mt-8">
					<h1
						className="text-2xl font-light mb-2"
						style={{ fontFamily: "'Lexend', sans-serif" }}
					>
						NEW COLLECTION
					</h1>
					<h2
						className="text-3xl font-light mb-8"
						style={{ fontFamily: "'Lexend', sans-serif" }}
					>
						NEW ARRIVAL
					</h2>

					{/* Initial loading state */}
					{loading && displayedProducts.length === 0 && (
						<div className="flex flex-col items-center justify-center py-20">
							<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
							<p className="text-gray-600">Loading products...</p>
						</div>
					)}

					{/* Products grid */}
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-16">
						{displayedProducts.map((product, index) => {
							const imageArray = parseImages(product.images);
							const mainImage = imageArray[0] || "";

							// Add ref to the last element for infinite scrolling
							const isLastElement = displayedProducts.length === index + 1;

							return (
								<Link
									to={`/product/${product.id}`}
									key={product.id}
									className="group relative cursor-pointer transition-all duration-300"
									ref={isLastElement ? lastProductElementRef : null}
								>
									<div className="relative overflow-hidden bg-gray-50 aspect-square">
										<img
											src={mainImage}
											alt={product.name}
											className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
										/>

										{product.discount && parseFloat(product.discount) > 0 && (
											<div className="absolute top-2 left-2">
												<span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-500 text-white">
													{Math.round(parseFloat(product.discount) * 100)}% OFF
												</span>
											</div>
										)}
									</div>

									<div className="mt-4 flex flex-col items-center text-center">
										<span
											className="text-sm font-medium text-gray-900 truncate w-full"
											style={productNameStyle}
										>
											{product.productname}
										</span>
										<div className="mt-1">
											{product.discount && parseFloat(product.discount) > 0 ? (
												<>
													<span
														className="text-lg font-semibold"
														style={{
															color: "red",
															marginRight: "8px",
														}}
													>
														฿
														{(
															product.price *
															(1 - parseFloat(product.discount))
														).toLocaleString()}
													</span>
													<span className="line-through text-gray-400 text-sm">
														฿{product.price.toLocaleString()}
													</span>
												</>
											) : (
												<span className="text-lg font-semibold text-gray-900">
													฿{product.price.toLocaleString()}
												</span>
											)}
										</div>
									</div>
								</Link>
							);
						})}
					</div>

					{/* Loading more indicator */}
					{loading && displayedProducts.length > 0 && (
						<div className="flex justify-center mt-12 mb-8">
							<div className="flex flex-col items-center">
								<div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900 mb-2"></div>
								<p className="text-gray-600 text-sm">
									Loading more products...
								</p>
							</div>
						</div>
					)}

					{/* End of results message */}
					{!hasMore && displayedProducts.length > 0 && !loading && (
						<div className="text-center mt-12 mb-8 py-4 border-t border-gray-200">
							<p className="text-gray-500">
								You've reached the end of the collection
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

export default ProductCard;
