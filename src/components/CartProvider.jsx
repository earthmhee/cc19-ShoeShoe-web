// src/components/CartProvider.jsx
import { useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { setTokenGetter } from '../stores/useCartStore';
import useCartStore from '../stores/useCartStore';

export const CartProvider = ({ children }) => {
  const { getToken, isSignedIn } = useAuth();
  const fetchCart = useCartStore(state => state.fetchCart);
  
  useEffect(() => {
    // Set the token getter function
    setTokenGetter(async () => {
      if (isSignedIn) {
        return await getToken();
      }
      return null;
    });
    
    // Fetch cart on mount or when auth state changes
    fetchCart();
  }, [getToken, isSignedIn, fetchCart]);
  
  return children;
};