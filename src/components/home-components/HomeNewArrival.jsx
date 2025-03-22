import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { getAllProduct } from '../../api/product';
import { Locate } from 'lucide-react';

function HomeNewArrivals() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const locate = await getAllProduct();
        
        // Filter for new arrivals (no discount)
        const newArrivals = locate.data.data
          .filter(product => !product.discount || product.discount === '0')
          .sort((a, b) => b.id - a.id) // Sort by newest (assuming higher ID = newer)
          .slice(0, 8); 
        
        setProducts(newArrivals);
      } catch (error) {
        console.error('Error fetching new arrivals:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Parse images function from your ProductList component
  const parseImages = (imagesString) => {
    try {
      if (typeof imagesString === "string") {
        return JSON.parse(imagesString);
      }
      return imagesString || [];
    } catch (error) {
      return (
        imagesString
          ?.replace(/^\[|\]$/g, "")
          .split(",")
          .map((url) => url.replace(/^"|"$/g, "")) || []
      );
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="text-center mb-6">
          <p className="text-gray-700 text-xs">FRESH DROPS</p>
          <h2 className="text-black text-3xl">NEW ARRIVALS</h2>
          <div className="mt-2 mb-6 w-20 h-1 bg-black mx-auto"></div>
        </div>
        <div className="flex justify-center py-10">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="text-center mb-6">
        <p className="text-gray-700 text-xs">FRESH DROPS</p>
        <h2 className="text-black text-3xl">NEW ARRIVALS</h2>
        <div className="mt-2 mb-6 w-20 h-1 bg-black mx-auto"></div>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product) => {
            const imageArray = parseImages(product.images);
            const mainImage = imageArray[0] || "";

            return (
              <Link
                to={`/product/${product.id}`}
                key={product.id}
                className="group relative cursor-pointer transition-all duration-300"
              >
                <div className="relative overflow-hidden bg-gray-50 aspect-square">
                  <img
                    src={mainImage}
                    alt={product.productname}
                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="mt-4 flex flex-col items-center text-center">
                  <span
                    className="text-sm font-medium text-gray-900 truncate w-full"
                    style={{
                      fontFamily: "'Lexend', sans-serif",
                      fontWeight: 300,
                    }}
                  >
                    {product.productname}
                  </span>
                  <div className="mt-1">
                    <span className="text-lg font-semibold text-gray-900">
                      ฿{product.price.toLocaleString()}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <p className="text-center">No new arrivals found.</p>
      )}
      
      <div className="text-center mt-8">
        <Link 
          to="/new-arrival" 
          className="inline-block px-6 py-2 border border-black text-sm font-medium transition-colors duration-300 hover:bg-black hover:text-white"
        >
          VIEW ALL
        </Link>
      </div>
    </div>
  );
}

export default HomeNewArrivals;