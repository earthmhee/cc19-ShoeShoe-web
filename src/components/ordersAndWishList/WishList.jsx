import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { Link } from 'react-router';
import WishlistCard from '../WishlistCard';
import { getWishlist, removeFromWishlist } from '../../api/wishlist';

function WishList() {
  const { getToken, isSignedIn } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Use the API function to fetch wishlist data
  const fetchWishlist = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (!isSignedIn) {
        setIsLoading(false);
        return;
      }
      
      const token = await getToken();
      const response = await getWishlist(token);
      
      // Use optional chaining for cleaner access to nested properties
      const items = response?.data?.wishlistItems || [];
      console.log("Parsed wishlist items:", items);
      setWishlistItems(items);
    } catch (err) {
      console.error('Failed to fetch wishlist:', err);
      setError('Failed to load your wishlist. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [getToken, isSignedIn]);

  // Fetch wishlist data on component mount
  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  // Remove an item from the wishlist using the API function
  const handleRemoveItem = async (productId) => {
    try {
      if (!isSignedIn) return;
      
      const token = await getToken();
      await removeFromWishlist(token, productId);
      
      // Update state to remove the item
      setWishlistItems(prevItems => 
        prevItems.filter(item => {
          // Check both possible ID locations
          const itemProductId = item.product_id || (item.product && item.product.id);
          return itemProductId !== productId;
        })
      );
    } catch (err) {
      console.error('Failed to remove item from wishlist:', err);
      setError('Failed to remove item from wishlist. Please try again.');
    }
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 text-lg">{error}</p>
        <button 
          onClick={fetchWishlist}
          className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Render empty wishlist
  if (!wishlistItems.length) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-semibold mb-4">Your Wishlist is Empty</h2>
        <p className="text-gray-600 mb-6">Browse our products and add your favorites!</p>
        <a 
          href="/products"
          className="inline-block px-6 py-3 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition"
        >
          Browse Products
        </a>
      </div>
    );
  }

  // Render wishlist with grid layout
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-8 border-b pb-2">My Wishlist</h1>
      
      {/* Grid layout that respects the fixed card width (w-40) */}
      <div className="flex flex-wrap gap-6 justify-center sm:justify-start">
        {wishlistItems.map(item => {
          // Get the correct product ID
          const productId = item.product_id || (item.product && item.product.id);
          
          return (
            <div key={item.id || productId}>
              <WishlistCard
                product={item.product}
                productId={productId}
                onRemove={handleRemoveItem}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default WishList;