import React, { useEffect, useState } from "react";
import { getAllProduct } from "../api/product";

function ProductCard() {
  const [products, setProducts] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  
  useEffect(() => {
    // Fetch products when component mounts
    const fetchProducts = async () => {
      try {
        const response = await getAllProduct();
        setProducts(response.data?.data);
        console.log(response.data?.data);
        console.log(products);
        
        
        
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    
    fetchProducts();
  }, []);
  console.log(products);
  
  const parseImages = (imagesString) => {
    try {
      if (typeof imagesString === "string") {
        return JSON.parse(imagesString);
      }
      return imagesString || [];
    } catch (error) {
      // Fallback if the string isn't valid JSON
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
      className={`flex-1 bg-gray-100 transition-all duration-200 ${
        isOpen ? "lg:ml-0" : "ml-0"
      } lg:pt-0 pt-16`}
    >
      <div className="max-w-7xl mx-auto p-4">
        {/* Content */}
        <div className="mt-8">
          <h1 className="text-2xl font-bold mb-2">NEW COLLECTION</h1>
          <h2 className="text-3xl font-bold mb-8">NEW ARRIVAL</h2>

          {/* Product grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {products.map((product) => {
              // Parse the images string into an array
              const imageArray = parseImages(product.images);
              // Use the first image as the main display image
              const mainImage = imageArray[0] || "";

              return (
                <div 
                  key={product.id} 
                  className="group relative cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                >
                  <div className="relative overflow-hidden rounded-lg bg-gray-100 aspect-[3/4]">
                    <img
                      src={mainImage}
                      alt={product.name}
                      className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
                    />

                    {/* Overlay on hover - CSS only */}
                    <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-end justify-center p-4">
                      <div className="flex gap-2 mb-4 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                        <button className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors shadow-md">
                          <span
                            className="text-gray-700 text-lg"
                            style={{ fontFamily: "Arial, sans-serif" }}
                          >
                            ♥
                          </span>
                        </button>
                        <button className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors shadow-md">
                          <span className="text-gray-700 text-sm">
                            Quick View
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* Optional: Sale or New badge */}
                    {product.isNew && (
                      <div className="absolute top-2 left-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-black text-white">
                          New
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 flex flex-col items-center text-center transition-all duration-300 group-hover:text-indigo-600">
                    <a className="text-sm font-medium text-gray-900 group-hover:text-indigo-600 hover:underline truncate w-full transition-colors duration-300">
                      {product.name}
                    </a>

                    {product.description && (
                      <p className="mt-1 text-xs text-gray-500 line-clamp-2 transition-colors duration-300">
                        {product.description}
                      </p>
                    )}
                    <div className="mt-1">
                      <span className="text-sm font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300">
                        {product.price}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;