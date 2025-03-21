import React from 'react';

function WishlistCard({ product, productId, onRemove }) {

  if (!product) {
    console.error("WishlistCard received null or undefined product");
    return null;
  }

  const id = product.id || productId;
  const name = product.name || "Product Name Not Available";
  const price = product.price || 0;
  const formattedPrice = typeof price === 'number' 
  ? `฿${price.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  : price;
  
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
    <div className="mb-8" style={{ fontFamily: 'Lexend, sans-serif' }}>
      {/* Product Image */}
      <a href={`/product/${id}`} className="block mb-2">
        <img
          src={imageUrl || fallbackImage}
          alt={name}
          className="max-w-full h-auto"
          style={{ maxHeight: '150px' }}
          onError={(e) => {
            console.log("Image failed to load, using fallback");
            e.target.src = fallbackImage;
          }}
        />
      </a>
      
      {/* Product Name - Element #1 */}
      <a href={`/product/${id}`} className="block">
        <h3 className="text-md font-medium text-gray-800 mb-1 truncate">
          {name}
        </h3>
      </a>
      
      {/* Price - Element #2 */}
      <p className="text-lg font-bold text-gray-900 mb-2">
        {formattedPrice}
      </p>
      
      {/* Remove Button - Element #3 */}
      <button
        onClick={() => onRemove(id)}
        className="text-teal-500 hover:text-teal-600 text-sm font-normal"
      >
        Remove from the product of wishlist
      </button>
    </div>
  );
}

export default WishlistCard;