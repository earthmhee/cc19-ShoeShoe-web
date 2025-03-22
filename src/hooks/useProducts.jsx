import { useState, useEffect } from "react";
import { getAllProduct } from "../api/product";

const useProducts = (pageType) => {
	const [products, setProducts] = useState([]);
	const [filteredProducts, setFilteredProducts] = useState([]);
	const [filters, setFilters] = useState({
		brand: "",
		category: "",
		price: "",
		size: "",
	});

	useEffect(() => {
		const fetchProducts = async () => {
			try {
				const response = await getAllProduct();
				let fetchedProducts = response.data?.data || [];

				// กรองสินค้าตาม pageType
				if (pageType === "new-arrival") {
					const thirtyDaysAgo = new Date();
					thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
					fetchedProducts = fetchedProducts.filter(
						(product) => new Date(product.created_at) >= thirtyDaysAgo
					);
				} else if (pageType === "for-men") {
					fetchedProducts = fetchedProducts.filter(
						(product) => product.gender === "Men"
					);
				} else if (pageType === "for-women") {
					fetchedProducts = fetchedProducts.filter(
						(product) => product.gender === "Women"
					);
				} else if (pageType === "on-sale") {
					fetchedProducts = fetchedProducts.filter(
						(product) => product.discount && parseFloat(product.discount) > 0
					);
				}

				setProducts(fetchedProducts);
				setFilteredProducts(fetchedProducts);
			} catch (error) {
				console.error("Error fetching products:", error);
			}
		};

		fetchProducts();
	}, [pageType]);

	// dropdown
	const brands = [...new Set(products.map((product) => product.brand))];
	const categories = [
		...new Set(products.map((product) => product.category?.categoryname)),
	];
	const priceRanges = ["Below ฿3,000", "฿3,000 - ฿5,000", "Above ฿5,000"];
	const sizes = [
		...new Set(
			products.flatMap((product) =>
				product.stock.map((stock) => stock.size?.us_size.toString())
			)
		),
	].filter((size) => size);

	useEffect(() => {
		let filtered = [...products];

		if (filters.brand) {
			filtered = filtered.filter((product) => product.brand === filters.brand);
		}

		if (filters.category) {
			filtered = filtered.filter(
				(product) => product.category?.categoryname === filters.category
			);
		}

		if (filters.price) {
			filtered = filtered.filter((product) => {
				const price = parseFloat(product.price);
				if (filters.price === "Below ฿3,000") return price < 3000;
				if (filters.price === "฿3,000 - ฿5,000")
					return price >= 3000 && price <= 5000;
				if (filters.price === "Above ฿5,000") return price > 5000;
				return true;
			});
		}

		if (filters.size) {
			filtered = filtered.filter((product) =>
				product.stock.some(
					(stock) => stock.size?.us_size.toString() === filters.size
				)
			);
		}

		setFilteredProducts(filtered);
	}, [filters, products]);

	const updateFilter = (key, value) => {
		setFilters((prev) => ({ ...prev, [key]: value }));
	};

	return {
		filteredProducts,
		brands,
		categories,
		priceRanges,
		sizes,
		filters,
		updateFilter,
	};
};

export default useProducts;
