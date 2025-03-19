import axios from "axios";

// Fix for environment variable access
const API_URL = import.meta.env?.VITE_API_URL || 
                window.env?.REACT_APP_API_URL || 
                "http://localhost:8001/api";

export const getWishlist = async (token) => {
  try {
    console.log("Sending request with token:", token);
    const response = await axios.get(`${API_URL}/wishlist`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    if (error.response) {
      console.log("Response status:", error.response.status);
      console.log("Response data:", error.response.data);
    }
    throw error;
  }
};
/**
 * Fetch the user's wishlist
 * @param {string} token - User's authentication token
 * @returns {Promise} - Response with wishlist data
 */

/**
 * Add a product to the wishlist
 * @param {string} token - User's authentication token
 * @param {number} productId - ID of the product to add
 * @returns {Promise} - Response with success message
 */
export const addToWishlist = async (token, productId) => {
  try {
    const response = await axios.post(`${API_URL}/wishlist`, 
      { product_id: productId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding product to wishlist:", error);
    throw error;
  }
};

/**
 * Remove a product from the wishlist
 * @param {string} token - User's authentication token
 * @param {number} productId - ID of the product to remove
 * @returns {Promise} - Response with success message
 */
export const removeFromWishlist = async (token, productId) => {
  try {
    const response = await axios.delete(`${API_URL}/wishlist/${productId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error removing product from wishlist:", error);
    throw error;
  }
};

/**
 * Clear all items from the wishlist
 * @param {string} token - User's authentication token
 * @returns {Promise} - Response with success message
 */
export const clearWishlist = async (token) => {
  try {
    const response = await axios.delete(`${API_URL}/wishlist`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error clearing wishlist:", error);
    throw error;
  }
};