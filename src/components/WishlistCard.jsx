import React from 'react';

function WishlistCard({ product, productId, onRemove }) {
  if (!product) {
    console.error("WishlistCard received null or undefined product");
    return null;
  }

  // Parse images from JSON string to array
  const parseImages = (imagesString) => {
    try {
      if (typeof imagesString === 'string') {
        return JSON.parse(imagesString);
      }
      return imagesString || [];
    } catch (error) {
      console.error("Error parsing images:", error);
      // Fallback if the string isn't valid JSON
      return imagesString
        ?.replace(/^\[|\]$/g, '')
        .split(',')
        .map((url) => url.replace(/^"|"$/g, '')) || [];
    }
  };

  const id = productId || product.id;
  const name = product.productname || "Product Name Not Available";
  const price = product.price || 0;
  
  // Parse discount as a number (convert from string if needed)
  const discount = parseFloat(product.discount) || 0;
  
  // Calculate final price after discount
  const finalPrice = discount > 0 ? price * (1 - discount) : price;
  
  // Format prices - simplify with no decimal places to save space
  const formatPrice = (value) => {
    return `฿${Math.round(value).toLocaleString('th-TH')}`;
  };
  
  const formattedOriginalPrice = formatPrice(price);
  const formattedFinalPrice = formatPrice(finalPrice);
  
  // Check if there's an actual discount
  const hasDiscount = discount > 0;
  
  let imageUrl = null;
  
  // Handle the images field from your data structure (JSON string)
  if (product.images) {
    const parsedImages = parseImages(product.images);
    if (parsedImages.length > 0) {
      imageUrl = parsedImages[0];
    }
  } else if (product.image) {
    imageUrl = product.image;
  } else if (product.image_url) {
    imageUrl = product.image_url;
  }
  
  // Fallback image if none is provided
  const fallbackImage = "https://placehold.co/300x300/e2e8f0/1e293b?text=No+Image";

  return (
    <div className="relative w-40 border border-gray-100 rounded-md shadow-sm bg-white overflow-hidden">
      {/* Discount Badge (if there's a discount) */}
      {hasDiscount && (
        <div className="absolute top-0 left-0 bg-red-600 text-white text-xs px-2 py-1 rounded-br z-10">
          {`-${Math.round(discount * 100)}%`}
        </div>
      )}
      
      {/* Remove Button with Trash Icon */}
      <button
        onClick={(e) => {
          e.preventDefault();
          onRemove(id);
        }}
        className="absolute top-2 right-2 p-2 bg-white/80 rounded-full hover:bg-red-100 transition-colors z-10"
        aria-label="Remove from wishlist"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5 text-gray-700 hover:text-red-600 transition-colors" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
          />
        </svg>
      </button>
      
      {/* Product Image */}
      <a href={`/product/${id}`} className="block">
        <div className="h-36 overflow-hidden">
          <img
            src={imageUrl || fallbackImage}
            alt={name}
            className="w-full h-full object-cover"
            onError={(e) => {
              console.log("Image failed to load, using fallback");
              e.target.src = fallbackImage;
            }}
          />
        </div>
      </a>
      
      {/* Product Details - Using px-2 for narrower padding */}
      <div className="p-2">
        {/* Product Name - With Lexend font */}
        <a href={`/product/${id}`} className="block">
          <h3 
            className="text-sm font-medium text-gray-800 mb-1 h-10 line-clamp-2 hover:text-gray-600 transition-colors"
            style={{ fontFamily: 'Lexend, sans-serif' }}
          >
            {name}
          </h3>
        </a>
        
        {/* Price Section - With Lexend font */}
        <div className="flex flex-col items-center mb-1">
          {hasDiscount ? (
            <>
              {/* Original Price (crossed out) */}
              <p 
                className="text-xs text-gray-500 line-through"
                style={{ fontFamily: 'Lexend, sans-serif' }}
              >
                {formattedOriginalPrice}
              </p>
              
              {/* Discounted Price */}
              <p 
                className="text-sm font-bold text-red-600"
                style={{ fontFamily: 'Lexend, sans-serif' }}
              >
                {formattedFinalPrice}
              </p>
            </>
          ) : (
            // Regular Price (no discount)
            <p 
              className="text-sm font-bold text-gray-900"
              style={{ fontFamily: 'Lexend, sans-serif' }}
            >
              {formattedOriginalPrice}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default WishlistCard;