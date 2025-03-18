// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router";
// import { getProductById } from "../api/product";
// import { useCart } from "../stores/CartStore";


// const ProductDetail = () => {
//   const { id } = useParams();
//   const { dispatch } = useCart ();
//   const navigate = useNavigate();
//   const [product, setProduct] = useState(null);
//   const [currentImage, setCurrentImage] = useState(0);
//   const [selectedSize, setSelectedSize] = useState(null);
//   const [quantity, setQuantity] = useState(1);
//   const [isWishlisted, setIsWishlisted] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchProduct = async () => {
//       if (!id) {
//         console.error("Product ID is undefined");
//         setError("Product ID is missing");
//         setLoading(false);
//         return;
//       }

//       try {
//         setLoading(true);
//         const response = await getProductById(id);
//         console.log("API Response:", response);

//         if (!response || !response.data) {
//           throw new Error("Invalid response from server");
//         }

//         const productData = response.data.data;
//         console.log("Product data:", productData);
//         setProduct(productData);

//         // If product has stock, pre-select the first available size
//         if (productData.stock && productData.stock.length > 0) {
//           const firstAvailableSize = productData.stock.find(
//             (item) => item.stock_quantity > 0
//           );
//           if (firstAvailableSize) {
//             setSelectedSize(firstAvailableSize.size_id);
//           }
//         }
//       } catch (error) {
//         console.error("Error fetching product:", error);
//         setError(error.message || "Failed to load product");
//         if (error.response?.status === 404) {
//           navigate("/");
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProduct();
//   }, [id, navigate]);

//   // Add to cart function
//   const addToCart = () => {
//     if (!selectedSize) {
//       alert('Please select a size');
//       return;
//     }
    
//     const selectedSizeObj = getAvailableSizes().find(size => size.id === selectedSize);
    
//     if (!selectedSizeObj) {
//       alert('Invalid size selection');
//       return;
//     }
    
//     dispatch({
//       type: 'ADD_TO_CART',
//       payload: {
//         product,
//         size: selectedSizeObj,
//         quantity
//       }
//     });
    
//     // Show success message
//     setAddedToCart(true);
//     setTimeout(() => setAddedToCart(false), 3000);
//   };

//   // Check if product is completely out of stock
//   const isOutOfStock = () => {
//     if (!product || !product.stock || product.stock.length === 0) return true;

//     // Check if all sizes have zero stock
//     return product.stock.every((item) => item.stock_quantity <= 0);
//   };

//   // Get stock quantity for a specific size
//   const getStockForSize = (sizeId) => {
//     if (!product || !product.stock) return 0;

//     const stockItem = product.stock.find((item) => item.size_id === sizeId);
//     return stockItem ? stockItem.stock_quantity : 0;
//   };

//   // Check if a specific size is available
//   const isSizeAvailable = (sizeId) => {
//     return getStockForSize(sizeId) > 0;
//   };

//   // Get all available sizes for the product's gender
//   const getAvailableSizes = () => {
//     if (!product || !product.gender) return [];

//     // Define size ranges based on gender
//     // This maps size_id to US sizes based on your database structure
//     const sizeMap = [
//       { id: 1, us_size: 7, gender: "Men" },
//       { id: 2, us_size: 8, gender: "Men" },
//       { id: 3, us_size: 9, gender: "Men" },
//       { id: 4, us_size: 10, gender: "Men" },
//       { id: 5, us_size: 11, gender: "Men" },
//       { id: 6, us_size: 12, gender: "Men" },
//       { id: 7, us_size: 13, gender: "Men" },
//       { id: 8, us_size: 6, gender: "Women" },
//       { id: 9, us_size: 7, gender: "Women" },
//       { id: 10, us_size: 8, gender: "Women" },
//       { id: 11, us_size: 9, gender: "Women" },
//       { id: 12, us_size: 10, gender: "Women" },
//       { id: 13, us_size: 11, gender: "Women" },
//     ];

//     // Filter sizes based on product gender
//     // For unisex products, show both men's and women's sizes
//     let genderFilter = ["Men"]; // Default to Men's sizes

//     if (product.gender) {
//       if (product.gender.toLowerCase() === "unisex") {
//         genderFilter = ["Men", "Women"];
//       } else {
//         genderFilter = [product.gender];
//       }
//     }

//     const relevantSizes = sizeMap.filter((size) =>
//       genderFilter.includes(size.gender)
//     );

//     // Map sizes to include availability information
//     return relevantSizes.map((size) => ({
//       id: size.id,
//       us_size: size.us_size,
//       gender: size.gender,
//       available: isSizeAvailable(size.id),
//       stock: getStockForSize(size.id),
//     }));
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
//         <span className="ml-3">Loading product information...</span>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex flex-col justify-center items-center h-screen">
//         <div className="text-red-500 text-xl mb-4">Error: {error}</div>
//         <button
//           onClick={() => navigate("/")}
//           className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
//         >
//           Return to Home
//         </button>
//       </div>
//     );
//   }

//   if (!product) {
//     return (
//       <div className="flex flex-col justify-center items-center h-screen">
//         <div className="text-xl mb-4">Product not found</div>
//         <button
//           onClick={() => navigate("/")}
//           className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
//         >
//           Return to Home
//         </button>
//       </div>
//     );
//   }

//   // Parse images array if it's a string
//   let imageArray = [];
//   try {
//     if (typeof product.images === "string") {
//       imageArray = JSON.parse(product.images);
//     } else if (Array.isArray(product.images)) {
//       imageArray = product.images;
//     }
//   } catch (e) {
//     console.error("Error parsing product images:", e);
//     imageArray = [];
//   }

//   // Ensure imageArray is valid
//   if (!Array.isArray(imageArray) || imageArray.length === 0) {
//     imageArray = ["/placeholder-image.jpg"]; // Fallback to placeholder
//   }

//   const nextImage = () => {
//     setCurrentImage((prev) => (prev + 1) % imageArray.length);
//   };

//   const prevImage = () => {
//     setCurrentImage(
//       (prev) => (prev - 1 + imageArray.length) % imageArray.length
//     );
//   };

//   const increaseQuantity = () => {
//     if (selectedSize) {
//       const maxStock = getStockForSize(selectedSize);
//       if (quantity < maxStock) {
//         setQuantity((prev) => prev + 1);
//       }
//     }
//   };

//   const decreaseQuantity = () => {
//     if (quantity > 1) {
//       setQuantity((prev) => prev - 1);
//     }
//   };

//   // Toggle wishlist status
//   const toggleWishlist = () => {
//     setIsWishlisted((prev) => !prev);
//   };

  

//   // Format price with currency symbol - safely handle undefined or non-numeric values
//   const formatPrice = (price) => {
//     if (price === undefined || price === null || isNaN(price)) {
//       return "฿0";
//     }
//     return `฿${price.toLocaleString()}`;
//   };

//   // Calculate discounted price if applicable - safely handle undefined values
//   const getPrice = () => {
//     if (!product || product.price === undefined || product.price === null) {
//       return 0;
//     }
//     return product.price;
//   };

//   // Updated to handle decimal form of percentage (0.15 = 15%)
//   const getDiscountedPrice = () => {
//     const price = getPrice();
//     if (!product || !product.discount) {
//       return price;
//     }

//     // Check if discount is in decimal form (less than 1) or percentage form
//     const discountMultiplier =
//       product.discount < 1 ? product.discount : product.discount / 100;
//     return price - price * discountMultiplier;
//   };

//   // Check if product has a discount - updated to handle decimal form
//   const hasDiscount = () => {
//     return product && product.discount && product.discount > 0;
//   };

//   // Get discount percentage for display - converts decimal to percentage
//   const getDiscountPercentage = () => {
//     if (!product || !product.discount) {
//       return 0;
//     }

//     // If discount is already in percentage form (greater than or equal to 1), return as is
//     // Otherwise convert from decimal to percentage
//     return product.discount < 1
//       ? Math.round(product.discount * 100)
//       : Math.round(product.discount);
//   };

//   return (
//     <div className="max-w-7xl mx-auto">
//       <button
//         onClick={() => navigate("/")}
//         className="flex items-center gap-2 p-4 text-gray-600 hover:text-black"
//       >
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           className="h-6 w-6"
//           fill="none"
//           viewBox="0 0 24 24"
//           stroke="currentColor"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={2}
//             d="M10 19l-7-7m0 0l7-7m-7 7h18"
//           />
//         </svg>
//         Back to Products
//       </button>

//       {/* Main product container with more space */}
//       <div className="bg-white flex flex-col lg:flex-row w-full max-w-6xl mx-auto p-6 gap-12 mb-16">
//         {/* Product Images - Larger display */}
//         <div className="w-full lg:w-3/5">
//           <div className="relative">
//             <img
//               src={imageArray[currentImage]}
//               alt={`${product.productname || "Product"} view ${
//                 currentImage + 1
//               }`}
//               className="w-full h-auto rounded-lg"
//             />

//             {imageArray.length > 1 && (
//               <>
//                 <button
//                   onClick={prevImage}
//                   className="absolute left-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 rounded-full p-2 shadow-md"
//                 >
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     width="24"
//                     height="24"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     className="w-6 h-6"
//                   >
//                     <path d="M15 18l-6-6 6-6" />
//                   </svg>
//                 </button>

//                 <button
//                   onClick={nextImage}
//                   className="absolute right-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 rounded-full p-2 shadow-md"
//                 >
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     width="24"
//                     height="24"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     className="w-6 h-6"
//                   >
//                     <path d="M9 18l6-6-6-6" />
//                   </svg>
//                 </button>
//               </>
//             )}
//           </div>

//           {imageArray.length > 1 && (
//             <div className="flex mt-6 gap-3 overflow-x-auto">
//               {imageArray.map((img, index) => (
//                 <button
//                   key={index}
//                   onClick={() => setCurrentImage(index)}
//                   className={`border-2 rounded-md min-w-20 h-20 ${
//                     currentImage === index ? "border-black" : "border-gray-200"
//                   }`}
//                 >
//                   <img
//                     src={img}
//                     alt={`Thumbnail ${index + 1}`}
//                     className="w-full h-full object-cover rounded"
//                   />
//                 </button>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* Product Details - More compact and organized */}
//         <div className="w-full lg:w-2/5">
//           {product.brand && (
//             <p className="text-sm text-gray-500 uppercase mb-2">
//               {product.brand}
//             </p>
//           )}
//           <h1 className="text-2xl font-bold text-gray-900 mb-4">
//             {product.productname || "Product Name"}
//           </h1>

//           {/* Improved price display with better discount visualization */}
//           <div className="mt-4 mb-6">
//             {hasDiscount() ? (
//               <div className="flex items-center gap-3">
//                 <span className="text-2xl font-bold text-red-600">
//                   {formatPrice(getDiscountedPrice())}
//                 </span>
//                 <span className="text-lg text-gray-500 line-through">
//                   {formatPrice(getPrice())}
//                 </span>
//                 <span className="px-2 py-1 bg-red-100 text-red-600 text-sm font-medium rounded">
//                   -{getDiscountPercentage()}%
//                 </span>
//               </div>
//             ) : (
//               <span className="text-2xl font-bold text-gray-900">
//                 {formatPrice(getPrice())}
//               </span>
//             )}

//             {isOutOfStock() && (
//               <span className="block mt-2 text-sm font-medium text-red-600 uppercase">
//                 Out of stock
//               </span>
//             )}
//           </div>

//           {/* Size Selection - Improved layout */}
//           <div className="mt-6">
//             <h3 className="text-sm font-medium text-gray-900 mb-3">Size *</h3>
//             <div className="flex flex-wrap gap-2 mb-2">
//               {getAvailableSizes().map((sizeItem) => (
//                 <button
//                   key={sizeItem.id}
//                   onClick={() =>
//                     sizeItem.available && setSelectedSize(sizeItem.id)
//                   }
//                   className={`
//                     py-2 px-4 border rounded-md text-center min-w-[60px]
//                     ${
//                       selectedSize === sizeItem.id
//                         ? "border-black bg-gray-100"
//                         : "border-gray-300"
//                     }
//                     ${
//                       !sizeItem.available
//                         ? "opacity-50 cursor-not-allowed bg-gray-100"
//                         : "hover:border-black"
//                     }
//                   `}
//                   disabled={!sizeItem.available}
//                   title={
//                     !sizeItem.available
//                       ? "Out of stock"
//                       : `${sizeItem.stock} in stock`
//                   }
//                 >
//                   {sizeItem.us_size}
//                 </button>
//               ))}
//             </div>
//             <div className="mt-1 mb-6">
//               <a
//                 href="#"
//                 className="text-xs text-gray-500 hover:underline"
//                 onClick={(e) => {
//                   e.preventDefault();
//                   // You could show a size chart modal here
//                   alert("Size chart would open here");
//                 }}
//               >
//                 Size Chart
//               </a>
//             </div>
//           </div>

//           {/* Quantity Selection - Improved styling */}
//           <div className="mt-6 mb-6">
//             <h3 className="text-sm font-medium text-gray-900 mb-3">Qty</h3>
//             <div className="flex items-center border border-gray-300 rounded-md w-32">
//               <button
//                 onClick={decreaseQuantity}
//                 className="px-4 py-2 text-gray-600 hover:bg-gray-100"
//                 disabled={isOutOfStock() || !selectedSize || quantity <= 1}
//               >
//                 -
//               </button>
//               <span className="px-4 py-2 flex-1 text-center border-x border-gray-300">
//                 {quantity}
//               </span>
//               <button
//                 onClick={increaseQuantity}
//                 className="px-4 py-2 text-gray-600 hover:bg-gray-100"
//                 disabled={
//                   isOutOfStock() ||
//                   !selectedSize ||
//                   (selectedSize && getStockForSize(selectedSize) <= quantity)
//                 }
//               >
//                 +
//               </button>
//             </div>
//           </div>

//           {/* Add to Cart and Wishlist - Improved buttons */}
//           <div className="mt-8 flex gap-3">
//             <button
//               onClick={addToCart}
//               className={`py-3 px-8 rounded-md font-medium flex-grow text-center ${
//                 isOutOfStock() || !selectedSize
//                   ? "bg-gray-200 text-gray-500 cursor-not-allowed"
//                   : "bg-gray-900 text-white hover:bg-black"
//               }`}
//               disabled={isOutOfStock() || !selectedSize}
//             >
//               ADD TO CART
//             </button>
//             <button
//               onClick={toggleWishlist}
//               className={`border p-3 rounded-md hover:bg-gray-100 ${
//                 isWishlisted ? "border-red-300 text-red-500" : "border-gray-300"
//               }`}
//               aria-label="Add to wishlist"
//             >
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-6 w-6"
//                 fill={isWishlisted ? "currentColor" : "none"}
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
//                 />
//               </svg>
//             </button>
//           </div>

//           {/* Product Description - Simplified with more space */}
//           <div className="mt-10 pt-6 border-t border-gray-200">
//             <h3 className="font-medium text-gray-900 mb-4">Description</h3>
//             <div className="text-sm text-gray-700 leading-relaxed">
//               <p>{product.description || "No description available"}</p>
//             </div>
//           </div>

//           {/* Debug Information - Remove in production */}
//           {process.env.NODE_ENV === "development" && (
//             <div className="mt-8 p-4 bg-gray-100 rounded-md">
//               <h3 className="font-bold">Debug Info:</h3>
//               <p>Product ID: {product.id}</p>
//               <p>Stock Items: {product.stock ? product.stock.length : 0}</p>
//               <p>Selected Size: {selectedSize}</p>
//               <details>
//                 <summary>Raw Product Data</summary>
//                 <pre className="text-xs mt-2 overflow-auto max-h-40">
//                   {JSON.stringify(product, null, 2)}
//                 </pre>
//               </details>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Footer with more padding */}
//       <div className="mt-20 py-12"></div>
//     </div>
//   );
// };

// export default ProductDetail;

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { getProductById } from "../api/product";
import useCartStore from "../stores/useCartStore";
import { useAuth } from "@clerk/clerk-react";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, loading: cartLoading } = useCartStore();
  const {isSignedIn,getToken} = useAuth();
  const [product, setProduct] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addedToCart, setAddedToCart] = useState(false);
  const [activeTab, setActiveTab] = useState("description");

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        console.error("Product ID is undefined");
        setError("Product ID is missing");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await getProductById(id);
        console.log("API Response:", response);

        if (!response || !response.data) {
          throw new Error("Invalid response from server");
        }

        const productData = response.data.data;
        console.log("Product data:", productData);
        setProduct(productData);

        // If product has stock, pre-select the first available size
        if (productData.stock && productData.stock.length > 0) {
          const firstAvailableSize = productData.stock.find(
            (item) => item.stock_quantity > 0
          );
          if (firstAvailableSize) {
            setSelectedSize(firstAvailableSize.size_id);
          }
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        setError(error.message || "Failed to load product");
        if (error.response?.status === 404) {
          navigate("/");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  // Check if product is completely out of stock
  const isOutOfStock = () => {
    if (!product || !product.stock || product.stock.length === 0) return true;
    return product.stock.every((item) => item.stock_quantity <= 0);
  };

  // Get stock quantity for a specific size
  const getStockForSize = (sizeId) => {
    if (!product || !product.stock) return 0;
    const stockItem = product.stock.find((item) => item.size_id === sizeId);
    return stockItem ? stockItem.stock_quantity : 0;
  };

  // Check if a specific size is available
  const isSizeAvailable = (sizeId) => {
    return getStockForSize(sizeId) > 0;
  };

  // Get all available sizes for the product's gender
  const getAvailableSizes = () => {
    if (!product || !product.gender) return [];

    // Define size ranges based on gender
    const sizeMap = [
      { id: 1, us_size: "7", gender: "Men" },
      { id: 2, us_size: "8", gender: "Men" },
      { id: 3, us_size: "9", gender: "Men" },
      { id: 4, us_size: "10", gender: "Men" },
      { id: 5, us_size: "11", gender: "Men" },
      { id: 6, us_size: "12", gender: "Men" },
      { id: 7, us_size: "13", gender: "Men" },
      { id: 8, us_size: "6", gender: "Women" },
      { id: 9, us_size: "7", gender: "Women" },
      { id: 10, us_size: "8", gender: "Women" },
      { id: 11, us_size: "9", gender: "Women" },
      { id: 12, us_size: "10", gender: "Women" },
      { id: 13, us_size: "11", gender: "Women" },
    ];

    // Filter sizes based on product gender
    let genderFilter = ["Men"]; // Default to Men's sizes

    if (product.gender) {
      if (product.gender.toLowerCase() === "unisex") {
        genderFilter = ["Men", "Women"];
      } else {
        genderFilter = [product.gender];
      }
    }

    const relevantSizes = sizeMap.filter((size) =>
      genderFilter.includes(size.gender)
    );

    // Map sizes to include availability information
    return relevantSizes.map((size) => ({
      id: size.id,
      us_size: size.us_size,
      gender: size.gender,
      available: isSizeAvailable(size.id),
      stock: getStockForSize(size.id),
    }));
  };

  // Format price with currency symbol
  const formatPrice = (price) => {
    if (price === undefined || price === null || isNaN(price)) {
      return "฿0";
    }
    return `฿${price.toLocaleString()}`;
  };

  // Get regular price
  const getPrice = () => {
    if (!product || product.price === undefined || product.price === null) {
      return 0;
    }
    return product.price;
  };

  // Get discounted price
  const getDiscountedPrice = () => {
    const price = getPrice();
    if (!product || !product.discount) {
      return price;
    }

    // Check if discount is in decimal form (less than 1) or percentage form
    const discountMultiplier =
      product.discount < 1 ? product.discount : product.discount / 100;
    return price - price * discountMultiplier;
  };

  // Check if product has a discount
  const hasDiscount = () => {
    return product && product.discount && product.discount > 0;
  };

  // Get discount percentage for display
  const getDiscountPercentage = () => {
    if (!product || !product.discount) {
      return 0;
    }

    return product.discount < 1
      ? Math.round(product.discount * 100)
      : Math.round(product.discount);
  };

  // Parse images array
  const getImageArray = () => {
    let imageArray = [];
    try {
      if (typeof product.images === "string") {
        imageArray = JSON.parse(product.images);
      } else if (Array.isArray(product.images)) {
        imageArray = product.images;
      }
    } catch (e) {
      console.error("Error parsing product images:", e);
      imageArray = [];
    }

    // Ensure imageArray is valid
    if (!Array.isArray(imageArray) || imageArray.length === 0) {
      imageArray = ["/placeholder-image.jpg"]; // Fallback to placeholder
    }

    return imageArray;
  };

  // Handle add to cart
  const handleAddToCart = async () => {
    const token = await getToken();
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }
    
    const selectedSizeObj = getAvailableSizes().find(size => size.id === selectedSize);
    
    if (!selectedSizeObj) {
      alert('Invalid size selection');
      return;
    }
    
    const success = await addToCart(product, selectedSizeObj, quantity,token);
    
    if (success) {
      // Show success message
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 3000);
    }
  };

  // Toggle wishlist status
  const toggleWishlist = () => {
    setIsWishlisted((prev) => !prev);
  };

  // Quantity controls
  const increaseQuantity = () => {
    if (selectedSize) {
      const maxStock = getStockForSize(selectedSize);
      if (quantity < maxStock) {
        setQuantity((prev) => prev + 1);
      }
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6 min-h-[60vh] flex flex-col items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900 mb-4"></div>
        <p>Loading product information...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error || 'Product not found'}
        </div>
        <button
          onClick={() => navigate("/")}
          className="mt-4 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
        >
          Return to Home
        </button>
      </div>
    );
  }

  const imageArray = getImageArray();

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="mb-6">
        <button
          onClick={() => navigate("/")}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Products
        </button>
      </div>

      {product.brand && (
        <div className="text-sm text-gray-500 uppercase mb-1">
          {product.brand}
        </div>
      )}

      <h1 className="text-2xl font-bold mb-4">{product.productname}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column - Product Images */}
        <div>
          <div className="relative mb-4 bg-gray-100 rounded-lg">
            <img
              src={imageArray[currentImage]}
              alt={product.productname}
              className="w-full h-auto object-contain aspect-square"
            />
            
            {imageArray.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentImage((prev) => (prev - 1 + imageArray.length) % imageArray.length)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md"
                  aria-label="Previous image"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => setCurrentImage((prev) => (prev + 1) % imageArray.length)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md"
                  aria-label="Next image"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </>
            )}
          </div>

          {imageArray.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {imageArray.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImage(index)}
                  className={`border rounded w-20 h-20 flex-shrink-0 ${
                    currentImage === index ? "border-black" : "border-gray-200"
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.productname} thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column - Product Details */}
        <div>
          {/* Price */}
          <div className="mb-6">
            {hasDiscount() ? (
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-red-600">
                  {formatPrice(getDiscountedPrice())}
                </span>
                <span className="text-gray-500 line-through">
                  {formatPrice(getPrice())}
                </span>
                <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded">
                  -{getDiscountPercentage()}%
                </span>
              </div>
            ) : (
              <span className="text-xl font-bold">
                {formatPrice(getPrice())}
              </span>
            )}
            
            {isOutOfStock() && (
              <div className="mt-2 text-red-600 font-medium">OUT OF STOCK</div>
            )}
          </div>

          {/* Size Selection */}
          <div className="mb-6">
            <div className="mb-2">
              <label className="font-medium">Size*</label>
            </div>
            <div className="flex flex-wrap gap-2">
              {getAvailableSizes().map((size) => (
                <button
                  key={size.id}
                  onClick={() => size.available && setSelectedSize(size.id)}
                  disabled={!size.available}
                  className={`
                    min-w-[40px] h-10 border rounded-md flex items-center justify-center px-3
                    ${selectedSize === size.id ? "border-black bg-gray-100" : "border-gray-300"}
                    ${!size.available ? "opacity-50 bg-gray-100 cursor-not-allowed" : "hover:border-black"}
                  `}
                >
                  {size.us_size}
                </button>
              ))}
            </div>
            <div className="mt-2">
              <button 
                className="text-sm text-gray-500 hover:underline"
                onClick={(e) => {
                  e.preventDefault();
                  // Size chart functionality would go here
                  alert("Size chart would open here");
                }}
              >
                Size Chart
              </button>
            </div>
          </div>

          {/* Quantity */}
          <div className="mb-6">
            <div className="mb-2">
              <label className="font-medium">Qty</label>
            </div>
            <div className="flex items-center">
              <button
                onClick={decreaseQuantity}
                disabled={quantity <= 1}
                className={`w-8 h-8 flex items-center justify-center border border-gray-300 ${
                  quantity <= 1 ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "hover:bg-gray-100"
                }`}
              >
                -
              </button>
              <input
                type="number"
                min="1"
                max={selectedSize ? getStockForSize(selectedSize) : 1}
                value={quantity}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (val >= 1 && selectedSize && val <= getStockForSize(selectedSize)) {
                    setQuantity(val);
                  }
                }}
                className="w-12 h-8 text-center border-y border-gray-300"
              />
              <button
                onClick={increaseQuantity}
                disabled={!selectedSize || quantity >= getStockForSize(selectedSize)}
                className={`w-8 h-8 flex items-center justify-center border border-gray-300 ${
                  !selectedSize || quantity >= getStockForSize(selectedSize)
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "hover:bg-gray-100"
                }`}
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart and Wishlist */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock() || !selectedSize || cartLoading}
              className={`flex-1 py-3 px-4 rounded-md font-medium text-center ${
                isOutOfStock() || !selectedSize || cartLoading
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gray-900 text-white hover:bg-black"
              }`}
            >
              {isOutOfStock() 
                ? "OUT OF STOCK" 
                : cartLoading 
                  ? "ADDING..." 
                  : "ADD TO CART"}
            </button>
            
            <button
              onClick={toggleWishlist}
              className="p-3 border border-gray-300 rounded-md hover:bg-gray-50"
              aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill={isWishlisted ? "currentColor" : "none"}
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>
          </div>

          {/* Success Message */}
          {addedToCart && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
              Product added to cart successfully!
            </div>
          )}

          {/* Product Information Tabs */}
          <div className="mt-8">
            <div className="flex border-b">
              <button
                onClick={() => setActiveTab("description")}
                className={`pb-2 px-4 font-medium ${
                  activeTab === "description"
                    ? "border-b-2 border-black text-black"
                    : "text-gray-500 hover:text-black"
                }`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab("details")}
                className={`pb-2 px-4 font-medium ${
                  activeTab === "details"
                    ? "border-b-2 border-black text-black"
                    : "text-gray-500 hover:text-black"
                }`}
              >
                Details
              </button>
              <button
                onClick={() => setActiveTab("shipping")}
                className={`pb-2 px-4 font-medium ${
                  activeTab === "shipping"
                    ? "border-b-2 border-black text-black"
                    : "text-gray-500 hover:text-black"
                }`}
              >
                Shipping
              </button>
            </div>
            
            <div className="py-4">
              {activeTab === "description" && (
                <div className="text-sm text-gray-700 leading-relaxed">
                  <p>{product.description || "No description available"}</p>
                </div>
              )}
              {activeTab === "details" && (
                <div className="text-sm text-gray-700 leading-relaxed">
                  <p>Product details information would be displayed here.</p>
                </div>
              )}
              {activeTab === "shipping" && (
                <div className="text-sm text-gray-700 leading-relaxed">
                  <p>Shipping information would be displayed here.</p>
                </div>
              )}
            </div>
          </div>

          {/* Debug Information - Only in development */}
          {process.env.NODE_ENV === "development" && (
            <div className="mt-8 p-4 bg-gray-100 rounded-md">
              <h3 className="font-bold">Debug Info:</h3>
              <p>Product ID: {product.id}</p>
              <p>Stock Items: {product.stock ? product.stock.length : 0}</p>
              <p>Selected Size: {selectedSize}</p>
              <details>
                <summary className="cursor-pointer">Raw Product Data</summary>
                <pre className="text-xs mt-2 overflow-auto max-h-40">
                  {JSON.stringify(product, null, 2)}
                </pre>
              </details>
            </div>
          )}
        </div>
      </div>
      
      {/* Extra padding at the bottom */}
      <div className="mt-20"></div>
    </div>
  );
};

export default ProductDetail;