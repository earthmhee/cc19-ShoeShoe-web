import axios from "axios";

// get product data
export const getAllProduct = async () => {
  return await axios.get(`http://localhost:8001/api/product/show-product`);
};