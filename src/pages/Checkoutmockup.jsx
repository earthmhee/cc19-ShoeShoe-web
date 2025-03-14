import React, { useState } from 'react';

// This is a standalone mockup that you can use to test the checkout card UI
// without integrating it with your product detail page
const CheckoutCardMockup = () => {
  // State to control if the modal is visible
  const [isModalVisible, setIsModalVisible] = useState(false);
  
  // Mock product data
  const mockProduct = {
    name: "ON Cloudmonster Alloy | Silver M",
    price: 7000.00,
    image: "https://www.carnivalbkk.com/media/catalog/product/cache/420678d58e84bd8881064f80d5d30181/6/1/61.97655.jpg" // Using a placeholder image service
  };
  
  // Toggle the vi                                                                                                                         sibility of the modal
  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };
  
  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Checkout Card Mockup</h1>
      
      {/* Button to show the modal */}
      <button 
        onClick={toggleModal}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Show Add to Cart Popup
      </button>
      
      {/* The actual checkout card component */}
      {isModalVisible && <CheckoutCard 
        product={mockProduct}
        onClose={() => setIsModalVisible(false)}
      />}
    </div>
  );
};

// The actual checkout card component
const CheckoutCard = ({ product, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };
  
  const formattedPrice = new Intl.NumberFormat('ja-JP').format(product.price * quantity);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white w-full max-w-md p-6 rounded relative">
        {/* Close button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-light"
        >
          ×
        </button>
        
        {/* Product title */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold">{product.name}</h2>
          <p className="text-gray-700">has been added to your cart</p>
        </div>
        
        {/* Product image and quantity */}
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
        
        {/* Cart info */}
        <div className="text-center mb-6">
          <p className="mb-1">There is {quantity} product in cart</p>
          <p className="font-medium">Cart Subtotal: <span className="font-bold">¥{formattedPrice}</span></p>
        </div>
        
        {/* Action buttons */}
        <div className="flex gap-4 mb-4">
          <button className="w-1/2 bg-gray-600 text-white py-3 font-semibold">
            CONTINUE({quantity})
          </button>
          <button className="w-1/2 bg-black text-white py-3 font-semibold">
            VIEW CART
          </button>
        </div>
        
        {/* Checkout link */}
        <div className="text-center">
          <button className="text-black underline font-medium">
            Go to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutCardMockup;