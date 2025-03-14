import axios from "axios";

// get product data
export const getAllProduct = async () => {
  return await axios.get(`http://localhost:8001/api/product/show-product`);
};


export const getProductById = async (id) => {
  if (!id) throw new Error('Product ID is required');
  
  try {
    const response = await axios.get(`http://localhost:8001/api/product/products/${id}`);
    return response;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};