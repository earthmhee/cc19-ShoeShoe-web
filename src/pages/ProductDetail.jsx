import React, { useState } from 'react';

const ProductPage = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  
  // Product data
  const product = {
    name: "NIKE REACTX PEGASUS TRAIL 5 GTX SP",
    price: "$190.00",
    originalPrice: "$220.00",
    discount: "Save 14%",
    sku: "FJ4535-100",
    images: [
      "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp",
      "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp",
      "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp",
      "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp",
      "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
    ],
    sizes: ["US 7", "US 7.5", "US 8", "US 8.5", "US 9", "US 9.5", "US 10", "US 10.5", "US 11", "US 11.5", "US 12"],
    availableSizes: ["US 7", "US 8", "US 9", "US 10", "US 11"],
    colors: ["Summit White / Black / Wolf Grey"],
    description: "The Nike Pegasus Trail 5 GORE-TEX is made for those outdoor runs that would otherwise be impossible. The waterproof GORE-TEX upper helps keep your feet dry while the reactive cushioning delivers an energetic ride. Tough traction gives you confidence on the trail.",
    features: [
      "GORE-TEX waterproof upper helps keep your feet dry",
      "ReactX foam provides 13% more energy return than traditional React foam",
      "Midfoot band helps secure your foot on off-road terrain",
      "Pull tab on the heel makes it easy to put on and take off",
      "Toe bumper adds durability for the trail",
      "Rubber outsole for traction on slippery surfaces"
    ]
  };

  // Handle image navigation
  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  // Handle quantity changes
  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  // Toggle wishlist status
  const toggleWishlist = () => {
    setIsWishlisted(prev => !prev);
  };

  return (
    <div className="bg-white flex flex-col lg:flex-row w-full max-w-6xl mx-auto p-4 gap-8">
      <div className="w-full lg:w-1/2">
        <div className="relative">
          <img 
            src={product.images[currentImage]} 
            alt={`${product.name} view ${currentImage + 1}`}
            className="w-full h-auto rounded-lg"
          />
          
          <button 
            onClick={prevImage}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 rounded-full p-2 shadow-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          
          <button 
            onClick={nextImage}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 rounded-full p-2 shadow-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
        
        <div className="flex mt-4 gap-2 overflow-x-auto">
          {product.images.map((img, index) => (
            <button 
              key={index} 
              onClick={() => setCurrentImage(index)}
              className={`border-2 rounded-md min-w-16 h-16 ${currentImage === index ? 'border-black' : 'border-gray-200'}`}
            >
              <img 
                src={img} 
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover rounded"
              />
            </button>
          ))}
        </div>
      </div>
      
      <div className="w-full lg:w-1/2">
        <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
        
        <div className="mt-4 flex items-center">
          <span className="text-xl font-bold text-gray-900">{product.price}</span>
          <span className="ml-2 text-lg line-through text-gray-500">{product.originalPrice}</span>
          <span className="ml-2 text-sm bg-red-100 text-red-700 px-2 py-1 rounded">{product.discount}</span>
        </div>
        
        <div className="mt-6">
          <h3 className="text-md font-medium text-gray-900">Color</h3>
          <p className="text-gray-700">{product.colors[0]}</p>
        </div>
        
        <div className="mt-6">
          <h3 className="text-md font-medium text-gray-900">Size</h3>
          <div className="grid grid-cols-3 gap-2 mt-2">
            {product.sizes.map((size) => {
              const isAvailable = product.availableSizes.includes(size);
              return (
                <button
                  key={size}
                  onClick={() => isAvailable && setSelectedSize(size)}
                  className={`
                    py-2 px-4 border rounded-md text-center
                    ${selectedSize === size ? 'border-black bg-gray-100' : 'border-gray-300'}
                    ${!isAvailable ? 'opacity-50 cursor-not-allowed' : 'hover:border-black'}
                  `}
                  disabled={!isAvailable}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
        
        <div className="mt-6">
          <h3 className="text-md font-medium text-gray-900">Quantity</h3>
          <div className="flex items-center mt-2 w-32 border border-gray-300 rounded-md">
            <button 
              onClick={decreaseQuantity}
              className="px-4 py-2 flex-1 text-lg font-medium border-r border-gray-300 hover:bg-gray-100"
            >
              -
            </button>
            <span className="px-4 py-2 flex-1 text-center">{quantity}</span>
            <button 
              onClick={increaseQuantity}
              className="px-4 py-2 flex-1 text-lg font-medium border-l border-gray-300 hover:bg-gray-100"
            >
              +
            </button>
          </div>
        </div>
        
        <div className="mt-6 flex gap-2">
          <button className="bg-black text-white py-3 px-8 rounded-md font-medium hover:bg-gray-800 w-4/5">
            ADD TO CART
          </button>
          <button 
            onClick={toggleWishlist}
            className="border border-black p-2 rounded-md font-medium hover:bg-gray-100 w-12 h-12 flex items-center justify-center transition-colors duration-200 ease-in-out"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill={isWishlisted ? "#e53e3e" : "none"} 
              stroke={isWishlisted ? "#e53e3e" : "currentColor"} 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="w-6 h-6 transition-colors duration-200 ease-in-out hover:fill-red-500 hover:stroke-red-500"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-4">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Description</h3>
          
          <div className="py-2">
            <p className="text-gray-700">{product.description}</p>
            <ul className="mt-4 list-disc pl-5">
              {product.features.map((feature, index) => (
                <li key={index} className="text-gray-700 mt-1">{feature}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;