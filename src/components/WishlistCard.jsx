import React from 'react';

function WishlistCard({ product, onRemove }) {
  const productNameStyle = {
    fontFamily: "'Lexend', sans-serif",
    fontWeight: 500
  };
  
  const priceStyle = {
    fontFamily: "'Lexend', sans-serif",
    fontWeight: 500
  };

  const removeButtonStyle = {
    fontFamily: "'Lexend', sans-serif",
    fontWeight: 400,
    color: '#20B2AA' 
  };

  return (
    <div className="flex flex-col w-full max-w-[200px]">
      {/* Product Image */}
      <div className="bg-gray-50 p-2 mb-2 aspect-square flex items-center justify-center">
        <img
          src={product.image}
          alt={product.name}
          className="max-h-full max-w-full object-contain"
        />
      </div>
      
      {/* Product Info */}
      <div className="flex flex-col">
        {/* Product name */}
        <a 
          href={`/product/${product.id}`} 
          className="text-xs font-medium text-gray-900 hover:underline truncate"
          style={productNameStyle}
        >
          {product.name}
        </a>
        
        {/* Price */}
        <div className="mt-1 mb-1">
          <span 
            className="text-sm font-medium text-gray-900"
            style={priceStyle}
          >
            {product.price}
          </span>
        </div>

        {/* Remove button */}
        <button 
          onClick={() => onRemove(product.id)} 
          className="text-xs text-left mt-1"
          style={removeButtonStyle}
        >
          Remove from the product of wishlist
        </button>
      </div>
    </div>
  );
}

export default WishlistCard;