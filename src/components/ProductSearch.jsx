import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { getAllProduct } from '../api/product';
import { SearchIcon } from '../icons';

const ProductSearch = () => {
  const [openSearch, setOpenSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const searchInputRef = useRef(null);
  const searchDropdownRef = useRef(null);
  const navigate = useNavigate();

  // Fetch all products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getAllProduct();
        if (response.data && response.data.data) {
          setAllProducts(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  // Handle search term changes
  useEffect(() => {
    if (searchTerm.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    
    // Search through products (client-side filtering)
    const term = searchTerm.toLowerCase();
    const results = allProducts.filter(product => 
      product.productname.toLowerCase().includes(term) ||
      (product.brand && product.brand.toLowerCase().includes(term)) ||
      (product.description && product.description.toLowerCase().includes(term))
    ).slice(0, 5); // Limit to 5 results for better UX
    
    setSearchResults(results);
    setLoading(false);
  }, [searchTerm, allProducts]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchDropdownRef.current && 
        !searchDropdownRef.current.contains(event.target) &&
        !searchInputRef.current.contains(event.target)
      ) {
        setOpenSearch(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Focus input when dropdown opens
  useEffect(() => {
    if (openSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [openSearch]);

  // Handle opening search dropdown
  const toggleSearch = () => {
    setOpenSearch(!openSearch);
    if (!openSearch) {
      setSearchTerm('');
      setSearchResults([]);
    }
  };

  // Handle clicking on a search result
  const handleResultClick = (productId) => {
    setOpenSearch(false);
    setSearchTerm('');
    navigate(`/product/${productId}`);
  };

  // Parse images from product
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

  // Format price with discount
  const formatPrice = (price, discount) => {
    if (!price) return '฿0';
    
    if (discount) {
      const discountedPrice = discount < 1 
        ? price * (1 - discount) 
        : price * (1 - discount/100);
      return `฿${discountedPrice.toLocaleString()}`;
    }
    
    return `฿${price.toLocaleString()}`;
  };

  // Handle enter key press in search input
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && searchResults.length > 0) {
      handleResultClick(searchResults[0].id);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={toggleSearch}
        className="w-7 p-0 overflow-hidden"
        aria-label="Search products"
        ref={searchInputRef}
      >
        <SearchIcon className="transform transition duration-300 hover:rotate-6" />
      </button>
      
      {openSearch && (
        <div
          ref={searchDropdownRef}
          className="absolute mt-5 right-0 dropdown-content border bg-white rounded-lg z-10 w-[380px] shadow-lg"
        >
          <div className="flex items-center w-full rounded-md px-3 py-2">
            <SearchIcon className="absolute left-4 w-5 text-gray-600" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="WHAT ARE YOU LOOKING FOR?"
              className="pl-8 pr-2 py-2 w-full text-sm text-black outline-none placeholder-gray-500 border-b border-gray-300"
              autoFocus
            />
          </div>
          
          {loading && (
            <div className="flex justify-center py-4">
              <div className="w-6 h-6 border-2 border-gray-300 border-t-black rounded-full animate-spin"></div>
            </div>
          )}
          
          {!loading && searchResults.length > 0 && (
            <ul className="max-h-96 overflow-y-auto p-2">
              {searchResults.map(product => {
                const imageArray = parseImages(product.images);
                const mainImage = imageArray[0] || "";
                
                return (
                  <li 
                    key={product.id}
                    className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded cursor-pointer transition-colors"
                    onClick={() => handleResultClick(product.id)}
                  >
                    <div className="w-12 h-12 bg-gray-50 flex-shrink-0">
                      <img 
                        src={mainImage} 
                        alt={product.productname}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{product.productname}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900">
                          {formatPrice(product.price, product.discount)}
                        </span>
                        {product.discount > 0 && (
                          <span className="text-xs text-gray-500 line-through">
                            ฿{product.price.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
          
          {!loading && searchTerm.trim().length >= 2 && searchResults.length === 0 && (
            <div className="text-center py-4 text-gray-500">
              No products found matching "{searchTerm}"
            </div>
          )}
          
          {searchTerm.trim().length < 2 && (
            <div className="text-center py-4 text-gray-500 text-sm">
              Type at least 2 characters to search
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductSearch;