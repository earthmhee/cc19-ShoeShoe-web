import React from 'react';
// Use <a> tags instead of Link since react-router-dom isn't available
// If you install react-router-dom later, you can switch back to using Link

function WishlistCard({ product, productId, onRemove }) {
  // Debugging - log what we received
  console.log("WishlistCard received product:", product);
  console.log("WishlistCard received productId:", productId);

  // Handle the case where product might be null or undefined
  if (!product) {
    console.error("WishlistCard received null or undefined product");
    return null;
  }

  // Extract product details with fallbacks
  const id = product.id || productId;
  const name = product.name || "Product Name Not Available";
  const price = product.price || 0;
  const formattedPrice = typeof price === 'number' ? `$${price.toFixed(2)}` : price;
  
  // Handle various image property possibilities
  let imageUrl = null;
  if (product.image) {
    imageUrl = product.image;
  } else if (product.image_url) {
    imageUrl = product.image_url;
  } else if (product.images && product.images.length > 0) {
    imageUrl = product.images[0];
  }
  
  // Fallback image if none is provided
  const fallbackImage = "https://placehold.co/300x300/e2e8f0/1e293b?text=No+Image";

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
      <a href={`/product/${id}`} className="block relative">
        <div className="aspect-square overflow-hidden">
          <img
            src={imageUrl || fallbackImage}
            alt={name}
            className="object-cover w-full h-full"
            onError={(e) => {
              console.log("Image failed to load, using fallback");
              e.target.src = fallbackImage;
            }}
          />
        </div>
      </a>
      
      <div className="p-4">
        <a href={`/product/${id}`} className="block">
          <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1 h-10">
            {name}
          </h3>
          <p className="text-lg font-semibold text-gray-900 mb-2">
            {formattedPrice}
          </p>
        </a>
        
        <button
          onClick={() => onRemove(id)}
          className="w-full py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          Remove
        </button>
      </div>
    </div>
  );
}

export default WishlistCard;