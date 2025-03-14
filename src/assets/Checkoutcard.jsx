import React, { useState } from 'react';

const CheckoutCard = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [quantity, setQuantity] = useState(1);
  
  const product = {
    name: "ON Cloudmonster Alloy | Silver M",
    price: 7000.00,
    image: "/api/placeholder/200/150"  
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };
  
  const closeModal = () => {
    setIsOpen(false);
  };
  
  const formattedPrice = new Intl.NumberFormat('ja-JP').format(product.price);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white w-full max-w-md p-6 rounded relative">
        {/* Close button */}
        <button 
          onClick={closeModal} 
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-light"
        >
          ×
        </button>
        
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold">{product.name}</h2>
          <p className="text-gray-700">has been added to your cart</p>
        </div>
        
        <div className="flex justify-between items-center mb-6">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-32 h-auto object-contain"
          />
          
          <div className="flex flex-col">
            <span className="mb-2 font-medium">Qty</span>
            <div className="flex border border-gray-300 rounded">
              <button 
                onClick={decreaseQuantity} 
                className="w-10 h-10 flex items-center justify-center"
              >
                -
              </button>
              <span className="w-10 h-10 flex items-center justify-center border-l border-r border-gray-300">
                {quantity}
              </span>
              <button 
                onClick={increaseQuantity} 
                className="w-10 h-10 flex items-center justify-center"
              >
                +
              </button>
            </div>
          </div>
        </div>
        
        <div className="text-center mb-6">
          <p className="mb-1">There is {quantity} product in cart</p>
          <p className="font-medium">Cart Subtotal: <span className="font-bold">¥{formattedPrice}</span></p>
        </div>
        
        <div className="flex gap-4 mb-4">
          <button className="w-1/2 bg-gray-600 text-white py-3 font-semibold">
            CONTINUE({quantity})
          </button>
          <button className="w-1/2 bg-black text-white py-3 font-semibold">
            VIEW CART
          </button>
        </div>
        
        <div className="text-center">
          <button className="text-black underline font-medium">
            Go to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutCard;