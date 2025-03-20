// src/api/cart.js

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001/api';

// Get cart items
export const getCart = async (token) => {
  return await axios.get(`${API_URL}/cart/view-cart`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

// src/api/cart.js
export const addToCart = async (token, productId, sizeId, quantity) => {
    return await axios.post(
      `${API_URL}/cart/add-cart`, 
      { 
        product_id: productId, 
        sizeId: sizeId,  // This should match what the controller expects
        quantity 
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  };
  
  export const updateCartItem = async (token, cartItemId, quantity) => {
    return await axios.put(
      `${API_URL}/cart/update-cart-item/${cartItemId}`,
      { quantity }, // This is fine as is
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  };

// Remove item from cart
export const removeFromCart = async (token, cartItemId) => {
  console.log('Removing cart item with ID:', cartItemId);
  console.log('Using token:', token);
  
  try {
    const response = await axios.delete(
      `${API_URL}/cart/remove-cart-item/${cartItemId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    console.log('Remove cart item response:', response.data);
    return response;
  } catch (error) {
    console.error('Remove cart item error details:', error.response?.data || error.message);
    throw error;
  }
};

// Clear cart
export const clearCart = async (token) => {
  return await axios.delete(
    `${API_URL}/cart/clear-cart`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
};

// Checkout
export const checkout = async (token, shippingDetails) => {
  return await axios.post(
    `${API_URL}/cart/checkout`,
    shippingDetails,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
};