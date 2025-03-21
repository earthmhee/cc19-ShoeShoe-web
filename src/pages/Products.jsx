import React from "react";
import ProductCard from "../components/ProductCard";
import ProductList from "./ProductList";
function Products() {
	return (
		<>
			{/* <ProductCard/> */}
			<ProductList pageType="all" />
		</>
	);
}

export default Products;
