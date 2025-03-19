import React, { useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import WishlistCard from '../../components/WishlistCard';
import axios from 'axios';

// Hardcoded API URL - replace this with your actual API URL
const API_URL = "http://localhost:8001/api";

function WishList() {
  const { getToken, isSignedIn } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch wishlist data on component mount
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        if (!isSignedIn) {
          setIsLoading(false);
          return;
        }
        
        const token = await getToken();
        console.log("Fetching wishlist with token...");
        
        const response = await axios.get(`${API_URL}/wishlist`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        console.log("Wishlist response:", response.data);
        
        if (response.data && response.data.data && response.data.data.wishlistItems) {
          setWishlistItems(response.data.data.wishlistItems);
        } else {
          setWishlistItems([]);
        }
      } catch (err) {
        console.error('Failed to fetch wishlist:', err);
        setError('Failed to load your wishlist. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchWishlist();
  }, [getToken, isSignedIn]);

  // Remove an item from the wishlist
  const handleRemoveItem = async (productId) => {
    try {
      if (!isSignedIn) return;
      
      setIsLoading(true);
      const token = await getToken();
      
      await axios.delete(`${API_URL}/wishlist/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Update state to remove the item
      setWishlistItems(prevItems => 
        prevItems.filter(item => item.product_id !== productId)
      );
    } catch (err) {
      console.error('Failed to remove item from wishlist:', err);
      setError('Failed to remove item from wishlist. Please try again.');
    } finally {
      setIsLoading(false);
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
          onClick={() => window.location.reload()}
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
          href="/"
          className="inline-block px-6 py-3 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition"
        >
          Browse Products
        </a>
      </div>
    );
  }

  // Render wishlist
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-8 border-b pb-2">My Wishlist</h1>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {wishlistItems.map(item => (
          <WishlistCard
            key={item.id}
            product={item.product}
            onRemove={handleRemoveItem}
          />
        ))}
      </div>
    </div>
  );
}

export default WishList;