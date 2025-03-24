import React, { useState } from "react";
import { Link } from "react-router";
import InfiniteScroll from "react-infinite-scroll-component";
import FilterDropdown from "../components/FilterDropdown";
import useProducts from "../hooks/useProducts";

const ProductList = ({ pageType }) => {
	const ITEMS_PER_PAGE = 24;
	const [currentItems, setCurrentItems] = useState(ITEMS_PER_PAGE);
	const [isLoading, setIsLoading] = useState(false); // New loading state

	const {
		filteredProducts,
		brands,
		categories,
		priceRanges,
		sizes,
		filters,
		updateFilter,
	} = useProducts(pageType);

	// Function to fetch more items with 3 second delay
	const fetchMoreData = () => {
		if (isLoading) return; // Prevent multiple simultaneous loads

		setIsLoading(true);
		setTimeout(() => {
			setCurrentItems((prev) => prev + ITEMS_PER_PAGE);
			setIsLoading(false);
		}, 1500); // 1.5 second delay
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

	const pageTitle =
		{
			"new-arrival": "New Arrival",
			"for-men": "For Men",
			"for-women": "For Women",
			"on-sale": "On Sale",
			all: "All Products",
		}[pageType] || "All Products";

	// Get the current slice of products to display
	const displayedProducts = filteredProducts.slice(0, currentItems);

	return (
		<div className="min-h-screen bg-base-100 p-4">
			{/* Filter Section */}
			<section className="max-w-7xl mx-auto mb-8 sticky top-13 lg:top-19 z-50 bg-white py-3">
				<h1
					className="text-2xl font-light mb-2"
					style={{ fontFamily: "'Lexend', sans-serif" }}
				>
					COLLECTION
				</h1>
				<h2
					className="text-3xl font-light mb-4"
					style={{ fontFamily: "'Lexend', sans-serif" }}
				>
					{pageTitle.toUpperCase()}
				</h2>

				<div className="flex justify-between flex-1 gap-6">
					<FilterDropdown
						label="Brand"
						options={brands}
						selected={filters.brand}
						onChange={(value) => {
							updateFilter("brand", value);
							setCurrentItems(ITEMS_PER_PAGE); // Reset items when filter changes
						}}
					/>
					<FilterDropdown
						label="Category"
						options={categories}
						selected={filters.category}
						onChange={(value) => {
							updateFilter("category", value);
							setCurrentItems(ITEMS_PER_PAGE); // Reset items when filter changes
						}}
					/>
					<FilterDropdown
						label="Price"
						options={priceRanges}
						selected={filters.price}
						onChange={(value) => {
							updateFilter("price", value);
							setCurrentItems(ITEMS_PER_PAGE); // Reset items when filter changes
						}}
					/>
					<FilterDropdown
						label="Size"
						options={sizes}
						selected={filters.size}
						onChange={(value) => {
							updateFilter("size", value);
							setCurrentItems(ITEMS_PER_PAGE); // Reset items when filter changes
						}}
					/>
				</div>
			</section>

			{/* Product Grid with Infinite Scroll */}
			<div className="max-w-7xl mx-auto">
				{filteredProducts.length > 0 ? (
					<InfiniteScroll
						dataLength={displayedProducts.length}
						next={fetchMoreData}
						hasMore={currentItems < filteredProducts.length}
						loader={
							<div className="text-center py-8">
								<div className="flex flex-col items-center gap-2">
									<span className="loading loading-spinner loading-lg"></span>
									<p className="text-gray-600">Loading more products...</p>
								</div>
							</div>
						}
						endMessage={
							<p className="text-center text-gray-600 py-8">
								No more products to load.
							</p>
						}
					>
						<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-16">
							{displayedProducts.map((product) => {
								const imageArray = parseImages(product.images);
								const mainImage = imageArray[0] || "";

								return (
									<Link
										to={`/product/${product.id}`}
										key={product.id}
										className="group relative cursor-pointer transition-all duration-300"
									>
										<div className="relative overflow-hidden bg-gray-50 aspect-square">
											<img
												src={mainImage}
												alt={product.productname}
												className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
											/>
											{product.discount && parseFloat(product.discount) > 0 && (
												<div className="absolute top-2 left-2">
													<span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-500 text-white">
														{Math.round(parseFloat(product.discount) * 100)}%
														OFF
													</span>
												</div>
											)}
										</div>
										<div className="mt-4 flex flex-col items-center text-center">
											<span
												className="text-sm font-medium text-gray-900 truncate w-full"
												style={{
													fontFamily: "'Lexend', sans-serif",
													fontWeight: 300,
												}}
											>
												{product.productname}
											</span>
											<div className="mt-1">
												{product.discount &&
												parseFloat(product.discount) > 0 ? (
													<>
														<span
															className="text-lg font-semibold"
															style={{ color: "red", marginRight: "8px" }}
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
					</InfiniteScroll>
				) : (
					<p className="text-center text-lg">No products found.</p>
				)}
			</div>
		</div>
	);
};

export default ProductList;
