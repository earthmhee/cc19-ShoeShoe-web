import axios from 'axios';

const API_URL = 'http://localhost:8001/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Create authenticated API calls with token
const createAuthenticatedRequest = (token) => {
  // Configure request headers with the token
  const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

  return {
    // Product APIs
    getProducts: async (filters = {}) => {
      try {
        const response = await apiClient.get('/product/show-product', {
          params: filters,
          headers
        });
        return response.data?.data || [];
      } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
      }
    },

    getProductById: async (id) => {
      try {
        const response = await apiClient.get(`/product/products/${id}`, { headers });
        return response.data?.data;
      } catch (error) {
        console.error(`Error fetching product ${id}:`, error);
        throw error;
      }
    },

    createProduct: async (productData) => {
      try {
        const response = await apiClient.post('/product/add-product', productData, { headers });
        return response.data;
      } catch (error) {
        console.error('Error creating product:', error);
        throw error;
      }
    },

    updateProduct: async (id, productData) => {
      try {
        const response = await apiClient.patch(`/product/update-product/${id}`, productData, { headers });
        return response.data;
      } catch (error) {
        console.error(`Error updating product ${id}:`, error);
        throw error;
      }
    },

    deleteProduct: async (id) => {
      try {
        const response = await apiClient.delete(`/product/delete-product/${id}`, { headers });
        return response.data;
      } catch (error) {
        console.error(`Error deleting product ${id}:`, error);
        throw error;
      }
    },

    // Category APIs
    getCategories: async () => {
      try {
        const response = await apiClient.get('/product/show-product', { headers });
        const products = response.data?.data || [];

        // Extract unique categories
        const categories = [];
        const categoryIds = new Set();

        products.forEach(product => {
          if (product.category && !categoryIds.has(product.category.id)) {
            categories.push(product.category);
            categoryIds.add(product.category.id);
          }
        });

        return categories;
      } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
      }
    },

    // Admin Order APIs
    getOrders: async (filters = {}) => {
      try {
        // Convert filters to URL parameters
        const params = new URLSearchParams();

        if (filters.status) {
          params.append('status', filters.status);
        }

        if (filters.payment_status) {
          params.append('payment_status', filters.payment_status);
        }

        if (filters.start_date) {
          params.append('start_date', filters.start_date);
        }

        if (filters.end_date) {
          params.append('end_date', filters.end_date);
        }

        if (filters.page) {
          params.append('page', filters.page);
        }

        if (filters.limit) {
          params.append('limit', filters.limit);
        }

        if (filters.sortField) {
          params.append('sortField', filters.sortField);
        }

        if (filters.sortDirection) {
          params.append('sortDirection', filters.sortDirection);
        }

        const queryString = params.toString();
        const endpoint = `/admin/orders${queryString ? `?${queryString}` : ''}`;

        const response = await apiClient.get(endpoint, { headers });
        return response.data?.data || [];
      } catch (error) {
        console.error('Error fetching orders:', error);
        throw error;
      }
    },

    searchOrders: async (query) => {
      try {
        const response = await apiClient.get(`/admin/orders/search?query=${encodeURIComponent(query)}`, { headers });
        return response.data?.data || [];
      } catch (error) {
        console.error('Error searching orders:', error);
        throw error;
      }
    },

    getOrderById: async (orderId) => {
      try {
        const response = await apiClient.get(`/admin/orders/${orderId}`, { headers });
        return response.data?.data;
      } catch (error) {
        console.error(`Error fetching order ${orderId}:`, error);
        throw error;
      }
    },

    updateOrderStatus: async (orderId, status) => {
      try {
        const response = await apiClient.patch(`/admin/orders/${orderId}/status`, { status }, { headers });
        return response.data;
      } catch (error) {
        console.error(`Error updating order status ${orderId}:`, error);
        throw error;
      }
    },

    // Stock APIs
    getProductStock: async (productId) => {
      try {
        const response = await apiClient.get(`/stock/product/${productId}`, { headers });
        return response.data?.data || [];
      } catch (error) {
        console.error(`Error fetching stock for product ${productId}:`, error);
        return [];
      }
    },

    addStock: async (stockData) => {
      try {
        const response = await apiClient.post('/stock', stockData, { headers });
        return response.data;
      } catch (error) {
        console.error('Error adding stock:', error);
        throw error;
      }
    },

    updateStock: async (stockId, quantity) => {
      try {
        const response = await apiClient.patch(`/stock/${stockId}`, { stock_quantity: quantity }, { headers });
        return response.data;
      } catch (error) {
        console.error(`Error updating stock ${stockId}:`, error);
        throw error;
      }
    },

    // Size APIs
    getSizes: async (gender) => {
      try {
        const params = gender ? { gender } : {};
        const response = await apiClient.get('/stock/sizes', {
          params,
          headers
        });
        return response.data?.data || [];
      } catch (error) {
        console.error('Error fetching sizes:', error);

        // If API fails, fallback to hardcoded sizes
        const menSizes = Array.from({ length: 7 }, (_, i) => ({ id: i + 1, us_size: i + 7, gender: 'Men' }));
        const womenSizes = Array.from({ length: 7 }, (_, i) => ({ id: i + 8, us_size: i + 5, gender: 'Women' }));

        if (gender === 'Men') return menSizes;
        if (gender === 'Women') return womenSizes;
        return [...menSizes, ...womenSizes];
      }
    },

    // User APIs
    getUsers: async () => {
      try {
        // This is a mock endpoint, replace with your actual endpoint
        const response = await apiClient.get('/user/all', { headers });
        return response.data?.data || [];
      } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
      }
    },

    getUserById: async (id) => {
      try {
        // Call the backend API endpoint to get user by ID
        const response = await apiClient.get(`/user/${id}`, { headers });
        
        // If the response has the expected structure with data property
        if (response.data) {
          // Return the response data
          return response.data;
        } else {
          throw new Error("Invalid response format");
        }
      } catch (error) {
        console.error(`Error fetching user ${id}:`, error);
        throw error;
      }
    }
  };
};

export default createAuthenticatedRequest;