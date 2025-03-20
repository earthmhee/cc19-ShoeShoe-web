import React, { useState } from 'react';

const CheckoutCard = ({ 
  product, 
  quantity: initialQuantity = 1, 
  onClose, 
  onContinue, 
  onViewCart 
}) => {
  const [quantity, setQuantity] = useState(initialQuantity);
  
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };
  
  // Use Thai Baht formatting
  const price = product.discount ? 
    (product.price - (product.price * (product.discount < 1 ? product.discount : product.discount/100))) : 
    product.price;
  
  const formattedPrice = new Intl.NumberFormat('th-TH').format(price * quantity);

  // Get product image
  let productImage = "";
  try {
    if (typeof product.images === "string") {
      const images = JSON.parse(product.images);
      productImage = images[0];
    } else if (Array.isArray(product.images)) {
      productImage = product.images[0];
    } else if (product.image) {
      productImage = product.image;
    }
  } catch (e) {
    console.error("Error parsing product images:", e);
    productImage = "/placeholder-image.jpg";
  }

  // Custom backdrop style using inline style
  const backdropStyle = {
    position: 'fixed',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
    zIndex: 50,
    backgroundColor: 'rgba(240, 240, 240, 0.7)' // Light gray with 70% opacity
  };

  // Custom card style with less rounded corners
  const cardStyle = {
    backgroundColor: 'white',
    width: '100%',
    maxWidth: '28rem',
    padding: '1.5rem',
    borderRadius: '0.75rem', // Sharper corners
    position: 'relative',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
  };

  return (
    <div style={backdropStyle}>
      <div style={cardStyle}>
        {/* Close button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-light"
        >
          ×
        </button>
        
        {/* Product title */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold">{product.productname || product.name}</h2>
          <p className="text-gray-700">has been added to your cart</p>
        </div>
        
        {/* Product image and quantity */}
        <div className="flex justify-between items-center mb-6">
          <img 
            src={productImage} 
            alt={product.productname || product.name} 
            className="w-32 h-auto object-contain"
          />
          
          <div>
            <div className="mb-2 font-medium">Qty</div>
            <div className="flex items-center border border-gray-300 rounded-md">
              <button 
                onClick={decreaseQuantity} 
                className="w-10 h-10 flex items-center justify-center"
              >
                -
              </button>
              <div className="w-10 h-10 flex items-center justify-center border-l border-r border-gray-300">
                {quantity}
              </div>
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
          <p className="mb-1">
            There is {quantity} product in cart
          </p>
          <p className="font-medium">
            Cart Subtotal: <span className="font-bold">฿{formattedPrice}</span>
          </p>
        </div>
        
        {/* Action buttons */}
        <div className="flex gap-4">
          <button 
            onClick={() => onContinue(quantity)}
            className="w-1/2 bg-gray-600 text-white py-3 font-semibold rounded-md"
          >
            CONTINUE({quantity})
          </button>
          <button 
            onClick={onViewCart}
            className="w-1/2 bg-black text-white py-3 font-semibold rounded-md"
          >
            VIEW CART
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutCard;