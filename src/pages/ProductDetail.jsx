import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { getProductById } from "../api/product";
import useCartStore from "../stores/useCartStore";
import { useAuth, useClerk } from "@clerk/clerk-react";
import axios from "axios";
import CheckoutCard from "../assets/Checkoutcard";

// API URL - replace with your actual API URL
const API_URL = "http://localhost:8001/api";

const ProductDetail = () => {
  const { openSignIn } = useClerk();
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, loading: cartLoading } = useCartStore();
  const { isSignedIn, getToken } = useAuth();
  const [product, setProduct] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Checkout popup state
  const [showCheckoutPopup, setShowCheckoutPopup] = useState(false);
  
  // Toast notification states
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState(""); // "success", "error", "info"

  // Helper function to show toast messages
  const showToastMessage = (message, type = "info") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    
    // Auto-hide toast after 3 seconds
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  // Checkout popup handlers
  const handleClosePopup = () => {
    setShowCheckoutPopup(false);
  };

  const handleContinueShopping = (newQuantity) => {
    // Update quantity if changed in popup
    if (newQuantity !== quantity) {
      setQuantity(newQuantity);
    }
    setShowCheckoutPopup(false);
  };

  const handleViewCart = () => {
    setShowCheckoutPopup(false);
    navigate("/cart");
  };

  // Check if product is in wishlist on component mount
  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (!isSignedIn || !product) return;
      
      try {
        const token = await getToken();
        const response = await axios.get(`${API_URL}/wishlist`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (response.data && response.data.data && response.data.data.wishlistItems) {
          // Check if current product is in wishlist
          const isInWishlist = response.data.data.wishlistItems.some(
            item => item.product_id === parseInt(id)
          );
          setIsWishlisted(isInWishlist);
        }
      } catch (err) {
        console.error("Error checking wishlist status:", err);
      }
    };

    checkWishlistStatus();
  }, [id, isSignedIn, getToken, product]);

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

  // Toggle wishlist status
  const toggleWishlist = async () => {
    // If user is not logged in, show a toast message
    if (!isSignedIn) {
      openSignIn();
      showToastMessage("Please sign in to add items to your wishlist.", "info");
      return;
    }

    try {
      setWishlistLoading(true);
      const token = await getToken();
      
      if (isWishlisted) {
        // Remove from wishlist
        await axios.delete(`${API_URL}/wishlist/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setIsWishlisted(false);
        showToastMessage("Item removed from wishlist", "success");
      } else {
        // Add to wishlist
        await axios.post(`${API_URL}/wishlist`, 
          { product_id: id },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        setIsWishlisted(true);
        showToastMessage("Item added to wishlist", "success");
      }
    } catch (err) {
      console.error("Error toggling wishlist:", err);
      showToastMessage("Failed to update wishlist. Please try again.", "error");
    } finally {
      setWishlistLoading(false);
    }
  };

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
      showToastMessage('Please select a size', 'error');
      return;
    }
    
    const selectedSizeObj = getAvailableSizes().find(size => size.id === selectedSize);
    
    if (!selectedSizeObj) {
      showToastMessage('Invalid size selection', 'error');
      return;
    }
    
    const success = await addToCart(product, selectedSizeObj, quantity, token);
    
    if (success) {
      // Show checkout popup instead of toast
      setShowCheckoutPopup(true);
    }
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
      {/* Breadcrumb navigation */}
      <div className="mb-8">
        <div className="flex items-center text-gray-600 mb-2">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center hover:text-gray-900"
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
            HOME
          </button>
        </div>
        <div className="text-sm text-gray-500 flex items-center">
          <button onClick={() => navigate("/")} className="hover:text-gray-700">HOME</button>
          <span className="mx-2">&gt;</span>
          <span className="uppercase">{product.productname}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-7 gap-8">
        {/* Left Column - Product Images - spanning 4 columns */}
        <div className="md:col-span-4">
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

        {/* Right Column - Product Details - spanning 3 columns */}
        <div className="md:col-span-3">
          {/* Product title */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold uppercase tracking-wide">{product.productname}</h1>
          </div>
          
          {/* Price display */}
          <div className="mb-8">
            <div className="flex items-center gap-3">
              {hasDiscount() ? (
                <>
                  <span className="text-3xl font-bold text-red-700">
                    {formatPrice(getDiscountedPrice())}
                  </span>
                  <span className="text-xl text-gray-500 line-through">
                    {formatPrice(getPrice())}
                  </span>
                  <span className="bg-green-100 text-green-600 text-sm px-2 py-1 rounded">
                    -{getDiscountPercentage()}%
                  </span>
                </>
              ) : (
                <span className="text-3xl font-bold">
                  {formatPrice(getPrice())}
                </span>
              )}
            </div>
          </div>

          {/* Size Selection */}
          <div className="mb-8">
            <div className="mb-2 flex items-center">
              <label className="font-medium">Size</label>
              <span className="text-red-500 ml-1">*</span>
            </div>
            <div className="flex flex-wrap gap-2 mb-2">
              {getAvailableSizes().map((size) => (
                <button
                  key={size.id}
                  onClick={() => size.available && setSelectedSize(size.id)}
                  disabled={!size.available}
                  className={`
                    min-w-[40px] h-10 border flex items-center justify-center px-3
                    ${selectedSize === size.id ? "border-2 border-black font-medium" : "border-gray-300"}
                    ${!size.available ? "opacity-50 bg-gray-100 cursor-not-allowed" : "hover:border-black"}
                  `}
                >
                  {size.us_size}
                </button>
              ))}
            </div>
            <div className="mt-1">
              <button 
                className="text-sm text-gray-600 hover:underline"
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
          <div className="mb-8">
            <div className="mb-2">
              <label className="font-medium">Qty</label>
            </div>
            <div className="flex">
              <button
                onClick={decreaseQuantity}
                disabled={quantity <= 1}
                className="w-10 h-10 flex items-center justify-center border border-gray-300 hover:bg-gray-50"
              >
                -
              </button>
              <div className="w-16 h-10 flex items-center justify-center border-t border-b border-gray-300">
                {quantity}
              </div>
              <button
                onClick={increaseQuantity}
                disabled={!selectedSize || quantity >= getStockForSize(selectedSize)}
                className="w-10 h-10 flex items-center justify-center border border-gray-300 hover:bg-gray-50"
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart and Wishlist */}
          <div className="flex gap-2 mb-8">
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock() || !selectedSize || cartLoading}
              className={`flex-1 py-3 px-4 font-medium text-center uppercase ${
                isOutOfStock() || !selectedSize || cartLoading
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gray-900 text-white hover:bg-black"
              }`}
            >
              {isOutOfStock() 
                ? "Out of Stock" 
                : cartLoading 
                  ? "Adding..." 
                  : "Add to Cart"}
            </button>
            
            <button
              onClick={toggleWishlist}
              className="p-3 border border-gray-300 hover:bg-gray-50"
              aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              style={{ transition: "none" }} /* Disable any transition */
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                viewBox="0 0 24 24"
                stroke={isWishlisted ? "none" : "currentColor"}
                strokeWidth={isWishlisted ? "0" : "2"}
                fill={isWishlisted ? "#DC143C" : "none"}
                style={{ transition: "none" }} /* Disable any transition */
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>
          </div>
          
          {/* Product Description */}
          <div className="mt-8 border-t pt-6">
            <div className="border-b mb-4">
              <h2 className="pb-2 font-medium">Description</h2>
            </div>
            
            <div className="py-2">
              <div className="text-sm text-gray-700 leading-relaxed">
                <p>{product.description || "No description available"}</p>
              </div>
            </div>
          </div>

          {/* Debug Information - Remove in production */}
          {process.env.NODE_ENV === "development" && (
            <div className="mt-8 p-4 bg-gray-100 rounded-md">
              <h3 className="font-bold">Debug Info:</h3>
              <p>Product ID: {product.id}</p>
              <p>Stock Items: {product.stock ? product.stock.length : 0}</p>
              <p>Selected Size: {selectedSize}</p>
              <details>
                <summary>Raw Product Data</summary>
                <pre className="text-xs mt-2 overflow-auto max-h-40">
                  {JSON.stringify(product, null, 2)}
                </pre>
              </details>
            </div>
          )}
        </div>
      </div>
      
      {/* Checkout Popup */}
      {showCheckoutPopup && product && (
        <CheckoutCard
          product={product}
          quantity={quantity}
          onClose={handleClosePopup}
          onContinue={handleContinueShopping}
          onViewCart={handleViewCart}
        />
      )}
      
      {/* Toast notification */}
      {showToast && (
        <div className="fixed bottom-5 right-5 z-50 animate-fade-in-up">
          <div className={`px-4 py-3 rounded-md shadow-lg max-w-md ${
            toastType === 'success' ? 'bg-green-50 text-green-800 border border-green-200' :
            toastType === 'error' ? 'bg-red-50 text-red-800 border border-red-200' :
            'bg-blue-50 text-blue-800 border border-blue-200'
          }`}>
            <div className="flex items-center">
              {toastType === 'success' && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
              {toastType === 'error' && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              )}
              {toastType === 'info' && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 9a1 1 0 01-1-1v-4a1 1 0 112 0v4a1 1 0 01-1 1z" clipRule="evenodd" />
                </svg>
              )}
              <p>{toastMessage}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Extra padding at the bottom */}
      <div className="mt-20"></div>
    </div>
  );
};

// Add CSS animation for toast
const fadeInUpAnimation = `
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.3s ease-out forwards;
}
`;

// Add style to document if not exists
if (typeof document !== 'undefined') {
  const existingStyle = document.getElementById('toast-animation-style');
  if (!existingStyle) {
    const style = document.createElement('style');
    style.id = 'toast-animation-style';
    style.innerHTML = fadeInUpAnimation;
    document.head.appendChild(style);
  }
}

export default ProductDetail;