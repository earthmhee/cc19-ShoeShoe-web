import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { getProductById } from '../api/product';
const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  console.log('Product ID from useParams:', id);
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        console.error('Product ID is undefined');
        return;
      }
  
      try {
        const response = await getProductById(id);
        setProduct(response.data.data);
      } catch (error) {
        console.error('Error fetching product:', error);
        if (error.response?.status === 404) {
          navigate('/');
        }
      }
    };
  
    fetchProduct();
  }, [id, navigate]);

  if (!product) {
    return <div>Loading...</div>;
  }

  const imageArray = typeof product.images === 'string' 
    ? JSON.parse(product.images) 
    : product.images || [];

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % imageArray.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + imageArray.length) % imageArray.length);
  };

  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  // Toggle wishlist status
  const toggleWishlist = () => {
    setIsWishlisted(prev => !prev);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <button 
        onClick={() => navigate('/')}
        className="flex items-center gap-2 p-4 text-gray-600 hover:text-black"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Products
      </button>

      <div className="bg-white flex flex-col lg:flex-row w-full max-w-6xl mx-auto p-4 gap-8">
        <div className="w-full lg:w-1/2">
          <div className="relative">
            <img 
              src={imageArray[currentImage]} 
              alt={`${product.name} view ${currentImage + 1}`} 
              className="w-full h-auto rounded-lg"
            />
            
            <button 
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 rounded-full p-2 shadow-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            
            <button 
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 rounded-full p-2 shadow-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
          
          <div className="flex mt-4 gap-2 overflow-x-auto">
            {imageArray.map((img, index) => (
              <button 
                key={index} 
                onClick={() => setCurrentImage(index)}
                className={`border-2 rounded-md min-w-16 h-16 ${currentImage === index ? 'border-black' : 'border-gray-200'}`}
              >
                <img 
                  src={img} 
                  alt={`Thumbnail ${index + 1}`} 
                  className="w-full h-full object-cover rounded"
                />
              </button>
            ))}
          </div>
        </div>
        
        <div className="w-full lg:w-1/2">
          <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
          
          <div className="mt-4 flex items-center">
            <span className="text-xl font-bold text-gray-900">${product.price}</span>
            {product.originalPrice && (
              <span className="ml-2 text-lg line-through text-gray-500">${product.originalPrice}</span>
            )}
            {product.discount && (
              <span className="ml-2 text-sm bg-red-100 text-red-700 px-2 py-1 rounded">{product.discount}% OFF</span>
            )}
          </div>
          
          {product.colors && (
            <div className="mt-6">
              <h3 className="text-md font-medium text-gray-900">Color</h3>
              <p className="text-gray-700">{product.colors[0]}</p>
            </div>
          )}
          
          {product.sizes && (
            <div className="mt-6">
              <h3 className="text-md font-medium text-gray-900">Size</h3>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {product.sizes.map((size) => {
                  const isAvailable = product.availableSizes?.includes(size);
                  return (
                    <button
                      key={size}
                      onClick={() => isAvailable && setSelectedSize(size)}
                      className={`
                        py-2 px-4 border rounded-md text-center
                        ${selectedSize === size ? 'border-black bg-gray-100' : 'border-gray-300'}
                        ${!isAvailable ? 'opacity-50 cursor-not-allowed' : 'hover:border-black'}
                      `}
                      disabled={!isAvailable}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          
          <div className="mt-6">
            <h3 className="text-md font-medium text-gray-900">Quantity</h3>
            <div className="flex items-center mt-2 border border-gray-300 rounded-md">
              <button 
                onClick={decreaseQuantity}
                className="px-3 py-2 border-r border-gray-300"
              >
                -
              </button>
              <span className="px-4 py-2">{quantity}</span>
              <button 
                onClick={increaseQuantity}
                className="px-3 py-2 border-l border-gray-300"
              >
                +
              </button>
            </div>
          </div>
          
          <div className="mt-6 flex gap-4">
            <button className="bg-black text-white py-3 px-8 rounded-md font-medium hover:bg-gray-800 w-full">
              ADD TO CART
            </button>
            <button className="border border-black py-3 px-8 rounded-md font-medium hover:bg-gray-100 w-full">
              Wishlist
            </button>
          </div>

          <div className="mt-8 border-t border-gray-200 pt-4">
            <div className="flex border-b">
              <button 
                onClick={() => setCurrentTab('description')}
                className={`px-4 py-2 font-medium ${currentTab === 'description' ? 'border-b-2 border-black' : ''}`}
              >
                Description
              </button>
              <button 
                onClick={() => setCurrentTab('details')}
                className={`px-4 py-2 font-medium ${currentTab === 'details' ? 'border-b-2 border-black' : ''}`}
              >
                Details
              </button>
              <button 
                onClick={() => setCurrentTab('shipping')}
                className={`px-4 py-2 font-medium ${currentTab === 'shipping' ? 'border-b-2 border-black' : ''}`}
              >
                Shipping
              </button>
            </div>
            
            <div className="py-4">
              {currentTab === 'description' && (
                <div>
                  <p className="text-gray-700">{product.description}</p>
                  {product.features && (
                    <ul className="mt-4 list-disc pl-5">
                      {product.features.map((feature, index) => (
                        <li key={index} className="text-gray-700 mt-1">{feature}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
              
              {currentTab === 'details' && (
                <div>
                  <p className="text-gray-700">
                    <strong>SKU:</strong> {product.sku}
                  </p>
                  <p className="text-gray-700 mt-2">
                    <strong>Material:</strong> {product.material || 'Synthetic upper, rubber outsole'}
                  </p>
                  <p className="text-gray-700 mt-2">
                    <strong>Origin:</strong> {product.origin || 'Imported'}
                  </p>
                </div>
              )}
              
              {currentTab === 'shipping' && (
                <div>
                  <p className="text-gray-700">
                    Free standard shipping on all orders.
                  </p>
                  <p className="text-gray-700 mt-2">
                    Estimated delivery time: 3-7 business days.
                  </p>
                  <p className="text-gray-700 mt-2">
                    Express shipping available at checkout for an additional fee.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
