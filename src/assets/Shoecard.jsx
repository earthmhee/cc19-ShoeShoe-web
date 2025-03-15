import React from 'react';

function Shoecard({ product }) {
  const productNameStyle = {
    fontFamily: "'Lexend', sans-serif", // 
    fontWeight: 300 
  };
  
  const priceStyle = {
    fontFamily: "'Lexend', sans-serif", 
    fontWeight: 300
  };

  return (
    <div className="flex flex-col">
      {/* Product Image - Square aspect ratio */}
      <div className="overflow-hidden bg-gray-50 mb-2 aspect-square">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain"
        />
      </div>
      
      {/* Product Info - Using your selected fonts */}
      <div className="flex flex-col items-center text-center">
        {/* Product name with Prompt font */}
        <a 
          href={`/product/${product.id}`} 
          className="text-xs font-normal text-gray-900 hover:underline truncate w-full"
          style={productNameStyle}
        >
          {product.name}
        </a>
        
        {/* Price with Lexend font */}
        <div className="mt-1">
          <span 
            className="text-xs font-light text-gray-900"
            style={priceStyle}
          >
            {product.price}
          </span>
        </div>
      </div>
    </div>
  );
}

export default Shoecard;