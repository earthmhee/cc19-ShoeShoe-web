import React, { useEffect, useState } from "react";
import { getAllProduct } from "../api/product";
import { Link } from "react-router";

function ProductCard() {
    const [products, setProducts] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await getAllProduct();
                setProducts(response.data?.data);
				
            } catch (error) {
				console.error("Error fetching products:", error);
            }
        };
		
        fetchProducts();
    }, []);
	
	console.log("product state:", products);
    const productNameStyle = {
        fontFamily: "'Lexend', sans-serif",
        fontWeight: 300,
    };

    const priceStyle = {
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

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                        {products.map((product) => {
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
                                            alt={product.name}
                                            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                                        />

                                        {product.isNew && (
                                            <div className="absolute top-2 left-2">
                                                <span
                                                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-light bg-black text-white"
                                                    style={{ fontFamily: "'Lexend', sans-serif" }}
                                                >
                                                    New
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-4 flex flex-col items-center text-center">
                                        <span
                                            className="text-s font-normal text-gray-900 hover:underline truncate w-full"
                                            style={productNameStyle}
                                        >
                                            {product.productname}
                                        </span>

                                        {/* {product.description && (
                                            <p
                                                className="mt-1 text-xs text-gray-500 line-clamp-2"
                                                style={{
                                                    fontFamily: "'Lexend', sans-serif",
                                                    fontWeight: 300,
                                                }}
                                            >
                                                {product.description}
                                            </p>
                                        )} */}
                                        <div className="mt-1">
                                            <span
                                                className="text-s font-light text-gray-900"
                                                style={priceStyle}
                                            >
                                                ฿{product.price}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductCard;