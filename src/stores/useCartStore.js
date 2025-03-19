
// src/stores/useCartStore.js
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { 
  getCart, 
  addToCart as apiAddToCart, 
  updateCartItem as apiUpdateCartItem,
  removeFromCart as apiRemoveFromCart,
  clearCart as apiClearCart,
  checkout as apiCheckout
} from "../api/cart";

// Create a function to get the token from Clerk
// This will be used outside of React components
let getTokenFunction = null;

// Function to set the token getter from a component
export const setTokenGetter = (tokenFn) => {
  getTokenFunction = tokenFn;
};

// Function to get the token
const getToken = async () => {
  if (getTokenFunction) {
    try {
      return await getTokenFunction();
    } catch (error) {
      console.error("Failed to get token:", error);
      return null;
    }
  }
  return null;
};

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      totalItems: 0,
      totalPrice: 0,
      loading: false,
      error: null,
         
      // Set loading state
      setLoading: (loading) => set({ loading }),
      
      // Set error state
      setError: (error) => set({ error }),
      
      // Fetch cart from API
      fetchCart: async () => {
        try {
          set({ loading: true, error: null });
          const token = await getToken();
          
          if (token) {
            // If logged in, try to fetch from API
            const response = await getCart(token);
            set({ 
              items: response.data.items || [], 
              totalItems: response.data.totalItems || 0, 
              totalPrice: response.data.totalPrice || 0,
              loading: false 
            });
          } else {
            // If not logged in, just load from localStorage (handled by persist)
            set({ loading: false });
          }
        } catch (error) {
          console.error('Failed to fetch cart:', error);
          set({ 
            error: error.response?.data?.msg || 'Failed to load cart',
            loading: false
          });
        }
      },
      
      // Add item to cart
      addToCart: async (product, size, quantity) => {
        try {
          set({ loading: true, error: null });
          const token = await getToken();
          
          if (token) {
            // If logged in, try API first
            const response = await apiAddToCart(token, product.id, size.id, quantity);
            
            set({ 
              items: response.data.items || [], 
              totalItems: response.data.totalItems || 0, 
              totalPrice: response.data.totalPrice || 0,
              loading: false 
            });
          } else {
            // If not logged in, use local state
            const { items } = get();
            const existingItemIndex = items.findIndex(
                item => item.productId === product.id && item.sizeId === size.id
              );

            let newItems;
            if (existingItemIndex >= 0) {
              // Update quantity if item already exists
              newItems = [...items];
              newItems[existingItemIndex].quantity += quantity;
            } else {
              // Add new item
              newItems = [
                ...items,
                {
                  id: Date.now().toString(),
                  productId: product.id,
                  sizeId: size.id,
                  productName: product.productname,
                  brand: product.brand,
                  price: product.price,
                  discountedPrice: product.discount ? 
                    (product.discount < 1 ? 
                      product.price - (product.price * product.discount) : 
                      product.price - (product.price * (product.discount / 100))
                    ) : 
                    product.price,
                  image: Array.isArray(product.images) ? 
                    product.images[0] : 
                    (typeof product.images === 'string' ? 
                      JSON.parse(product.images)[0] : 
                      ''),
                  sizeUS: size.us_size,
                  sizeGender: size.gender,
                  quantity
                }
              ];
            }

            // Calculate totals
            const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
            const totalPrice = newItems.reduce(
              (sum, item) => sum + (item.discountedPrice * item.quantity), 
              0
            );

            set({
              items: newItems,
              totalItems,
              totalPrice,
              loading: false
            });
          }
          
          return true;
        } catch (error) {
          console.error('Failed to add to cart:', error);
          set({ 
            error: error.response?.data?.msg || 'Failed to add item to cart',
            loading: false
          });
          return false;
        }
      },
      
      // Remove item from cart
      removeFromCart: async (itemId, token = null) => {
        try {
          set({ loading: true, error: null });
          
          // Use provided token or get it from the token getter
          const actualToken = token || await getToken();
          
          if (actualToken) {
            // If logged in, try API first
            try {
              const response = await apiRemoveFromCart(actualToken, itemId);
              
              set({ 
                items: response.data.items || [], 
                totalItems: response.data.totalItems || 0, 
                totalPrice: response.data.totalPrice || 0,
                loading: false 
              });
            } catch (apiError) {
              console.error('API error removing from cart:', apiError);
              
              // If API fails, fall back to local state
              const { items } = get();
              const newItems = items.filter(item => item.id !== itemId);
              
              // Calculate totals
              const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
              const totalPrice = newItems.reduce(
                (sum, item) => sum + (item.discountedPrice * item.quantity), 
                0
              );
      
              set({
                items: newItems,
                totalItems,
                totalPrice,
                loading: false,
                error: apiError.response?.data?.msg || 'Failed to remove item from cart on server, using local cart'
              });
            }
          } else {
            // If not logged in, use local state
            const { items } = get();
            const newItems = items.filter(item => item.id !== itemId);
            
            // Calculate totals
            const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
            const totalPrice = newItems.reduce(
              (sum, item) => sum + (item.discountedPrice * item.quantity), 
              0
            );
      
            set({
              items: newItems,
              totalItems,
              totalPrice,
              loading: false
            });
          }
          
          return true;
        } catch (error) {
          console.error('Failed to remove from cart:', error);
          set({ 
            error: error.response?.data?.msg || 'Failed to remove item from cart',
            loading: false
          });
          return false;
        }
      },
      
      // Update item quantity
      updateQuantity: async (itemId, quantity) => {
        if (quantity < 1) return false;
        
        try {
          set({ loading: true, error: null });
          const token = await getToken();
          
          if (token) {
            // If logged in, try API first
            const response = await apiUpdateCartItem(token, itemId, quantity);
            
            set({ 
              items: response.data.items || [], 
              totalItems: response.data.totalItems || 0, 
              totalPrice: response.data.totalPrice || 0,
              loading: false 
            });
          } else {
            // If not logged in, use local state
            const { items } = get();
            const newItems = items.map(item => 
              item.id === itemId ? { ...item, quantity } : item
            );

            // Calculate totals
            const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
            const totalPrice = newItems.reduce(
              (sum, item) => sum + (item.discountedPrice * item.quantity), 
              0
            );

            set({
              items: newItems,
              totalItems,
              totalPrice,
              loading: false
            });
          }
          
          return true;
        } catch (error) {
          console.error('Failed to update quantity:', error);
          set({ 
            error: error.response?.data?.msg || 'Failed to update quantity',
            loading: false
          });
          return false;
        }
      },
      
      // Clear cart
      clearCart: async () => {
        try {
          set({ loading: true, error: null });
          const token = await getToken();
          
          if (token) {
            // If logged in, try API first
            await apiClearCart(token);
          }
          
          set({ 
            items: [],
            totalItems: 0,
            totalPrice: 0,
            loading: false 
          });
          
          return true;
        } catch (error) {
          console.error('Failed to clear cart:', error);
          set({ 
            error: error.response?.data?.msg || 'Failed to clear cart',
            loading: false,
            items: [],
            totalItems: 0,
            totalPrice: 0
          });
          return false;
        }
      },
      
      // Checkout
      checkout: async (shippingDetails) => {
        const token = await getToken();
        
        if (!token) {
          set({ 
            error: 'You must be logged in to checkout' 
          });
          return false;
        }
        
        try {
          set({ loading: true, error: null });
          const response = await apiCheckout(token, shippingDetails);
          
          set({ 
            items: [],
            totalItems: 0,
            totalPrice: 0,
            loading: false 
          });
          
          return response.data;
        } catch (error) {
          console.error('Failed to checkout:', error);
          set({ 
            error: error.response?.data?.msg || 'Failed to complete checkout',
            loading: false
          });
          return false;
        }
      }
    }),
    {
      name: 'cart',
      storage: createJSONStorage(() => localStorage)
    }
  )
);

export default useCartStore;