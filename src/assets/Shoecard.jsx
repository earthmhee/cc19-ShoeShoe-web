import React, { useState } from 'react';

function Shoecard({ product }) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden rounded-lg bg-gray-100 aspect-[3/4]">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Wishlist (optional)
        {isHovered && (
          <div className="absolute inset-0 bg-black bg-opacity-20 flex items-end justify-center p-4 transition-opacity duration-300">
            <div className="flex gap-2 mb-4">
              <button className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors">
                <span className="text-gray-700 text-lg" style={{ fontFamily: 'Arial, sans-serif' }}>♥</span>
              </button>
            </div>
          </div>
        )} */}
        
        {/* New badge */}
        {/* <div className="absolute top-2 left-2">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-black text-white">
            New
          </span>
        </div> */}
      </div>
      
      <div className="mt-4 flex flex-col items-center text-center">
        <a 
          href={`/product/${product.id}`} 
          className="text-sm font-medium text-gray-900 hover:underline truncate w-full"
        >
          {product.name}
        </a>

        {product.description && (
          <p className="mt-1 text-xs text-gray-500 line-clamp-2">{product.description}</p>
        )}
        <div className="mt-1">
          <span className="text-sm font-semibold text-gray-900">{product.price}</span>
        </div>
      </div>
    </div>
  );
}

export default Shoecard;