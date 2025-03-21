import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import axios from "axios";

function ShopByCategory() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [brands, setBrands] = useState([]);
  
  // Filters state
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedGender, setSelectedGender] = useState("all");
  const [selectedPriceRange, setSelectedPriceRange] = useState("all");
  const [selectedSize, setSelectedSize] = useState("all");
  const [selectedBrand, setSelectedBrand] = useState("all");
  
  // UI state
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    collection: false,
    brand: true,
    category: true,
    gender: true,
    price: true,
    size: true
  });
  
  // Sort options
  const [sortBy, setSortBy] = useState("default");
  const [productCount, setProductCount] = useState(0);
  
  // Gender options
  const genderOptions = [
    { id: "Men", label: "Men" },
    { id: "Women", label: "Women" }
  ];
  
  // Price ranges
  const priceRanges = [
    { id: "range1", min: 0, max: 2000, label: "฿0.00 - ฿2,000.00" },
    { id: "range2", min: 2001, max: 4000, label: "฿2,001.00 - ฿4,000.00" },
    { id: "range3", min: 4001, max: 6000, label: "฿4,001.00 - ฿6,000.00" },
    { id: "range4", min: 6001, max: 8000, label: "฿6,001.00 - ฿8,000.00" },
    { id: "range5", min: 8001, max: 100000, label: "฿8,001.00+" }
  ];

  // API base URL
  const API_URL = 'http://localhost:8001/api';

  // Toggle filter section expansion
  const toggleSection = (section) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section]
    });
  };
  
  // Parse images function
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

  // Extract unique brands from products
  const extractBrands = (products) => {
    return [...new Set(products.map(product => product.brand))].filter(Boolean);
  };

  // Fetch categories, sizes, and initial products
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch categories
        const categoriesResponse = await axios.get(`${API_URL}/category`);
        if (categoriesResponse.data && categoriesResponse.data.data) {
          setCategories(categoriesResponse.data.data);
        }
        
        // Fetch sizes
        const sizesResponse = await axios.get(`${API_URL}/stock/sizes`);
        if (sizesResponse.data && sizesResponse.data.data) {
          setSizes(sizesResponse.data.data);
        }
        
        // Fetch all products initially
        const productsResponse = await axios.get(`${API_URL}/product/show-product`);
        if (productsResponse.data && productsResponse.data.data) {
          const productData = productsResponse.data.data;
          
          // Set brands from product data
          setBrands(extractBrands(productData));
          
          // Set initial products
          setProducts(productData);
          setProductCount(productData.length);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching initial data:", error);
        setError("Failed to load data. Please try again later.");
        setIsLoading(false);
      }
    };
    
    fetchInitialData();
  }, []);

  // Apply filters locally
  const applyFilters = () => {
    let filtered = [...products];
    
    // Apply category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(product => 
        product.category && product.category.id === parseInt(selectedCategory)
      );
    }
    
    // Apply gender filter
    if (selectedGender !== "all") {
      filtered = filtered.filter(product => product.gender === selectedGender);
    }
    
    // Apply brand filter
    if (selectedBrand !== "all") {
      filtered = filtered.filter(product => product.brand === selectedBrand);
    }
    
    // Apply price range filter
    if (selectedPriceRange !== "all") {
      const range = priceRanges.find(range => range.id === selectedPriceRange);
      if (range) {
        filtered = filtered.filter(product => 
          product.price >= range.min && product.price <= range.max
        );
      }
    }
    
    // Apply size filter
    if (selectedSize !== "all") {
      filtered = filtered.filter(product => {
        if (product.stock && Array.isArray(product.stock)) {
          return product.stock.some(stockItem => 
            stockItem.size_id === parseInt(selectedSize) && stockItem.stock_quantity > 0
          );
        }
        return false;
      });
    }
    
    // Apply sorting
    if (sortBy === "price-low-high") {
      filtered.sort((a, b) => {
        const priceA = a.discount ? a.price * (1 - parseFloat(a.discount)) : a.price;
        const priceB = b.discount ? b.price * (1 - parseFloat(b.discount)) : b.price;
        return priceA - priceB;
      });
    } else if (sortBy === "price-high-low") {
      filtered.sort((a, b) => {
        const priceA = a.discount ? a.price * (1 - parseFloat(a.discount)) : a.price;
        const priceB = b.discount ? b.price * (1 - parseFloat(b.discount)) : b.price;
        return priceB - priceA;
      });
    } else if (sortBy === "newest") {
      filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
    
    return filtered;
  };

  const filteredProducts = applyFilters();

  // Get sizes filtered by selected gender
  const getFilteredSizes = () => {
    if (!sizes.length) return [];
    
    return sizes.filter(size => 
      selectedGender === "all" || size.gender === selectedGender
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 lg:pt-8 pt-20">
      {/* Breadcrumb */}
      <div className="mb-4 text-sm text-gray-500">
        <Link to="/" className="hover:text-gray-700">หน้าหลัก</Link> &gt; SHOP BY CATEGORY
      </div>
      
      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-2xl font-light" style={{ fontFamily: "'Lexend', sans-serif" }}>
          Shop By Category
        </h1>
        <p className="text-gray-600">
          สินค้าทั้งหมด {filteredProducts.length} รายการ
        </p>
      </div>
      
      {/* Filters and Product Grid */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters Panel */}
        <div className="lg:w-1/4 w-full">
          {/* Filter Sections */}
          
          {/* COLLECTION */}
          <div className="border mb-4">
            <div 
              className="flex justify-between items-center p-4 cursor-pointer"
              onClick={() => toggleSection('collection')}
            >
              <h3 className="font-medium">COLLECTION</h3>
              <span>{expandedSections.collection ? '−' : '+'}</span>
            </div>
            {expandedSections.collection && (
              <div className="p-4 border-t">
                {/* Collection filters would go here */}
                <p className="text-gray-500">No collections available</p>
              </div>
            )}
          </div>
          
          {/* CATEGORY */}
          <div className="border mb-4">
            <div 
              className="flex justify-between items-center p-4 cursor-pointer"
              onClick={() => toggleSection('category')}
            >
              <h3 className="font-medium">CATEGORY</h3>
              <span>{expandedSections.category ? '−' : '+'}</span>
            </div>
            {expandedSections.category && (
              <div className="p-4 border-t">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="category-all"
                      name="category-filter"
                      checked={selectedCategory === "all"}
                      onChange={() => setSelectedCategory("all")}
                      className="mr-2"
                    />
                    <label htmlFor="category-all" className="flex-grow cursor-pointer">
                      All Categories
                    </label>
                  </div>
                  
                  {categories.map(category => (
                    <div key={category.id} className="flex items-center">
                      <input
                        type="radio"
                        id={`category-${category.id}`}
                        name="category-filter"
                        checked={selectedCategory === category.id.toString()}
                        onChange={() => setSelectedCategory(category.id.toString())}
                        className="mr-2"
                      />
                      <label htmlFor={`category-${category.id}`} className="flex-grow cursor-pointer">
                        {category.categoryname}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* BRAND */}
          <div className="border mb-4">
            <div 
              className="flex justify-between items-center p-4 cursor-pointer"
              onClick={() => toggleSection('brand')}
            >
              <h3 className="font-medium">BRAND</h3>
              <span>{expandedSections.brand ? '−' : '+'}</span>
            </div>
            {expandedSections.brand && (
              <div className="p-4 border-t">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="brand-all"
                      name="brand-filter"
                      checked={selectedBrand === "all"}
                      onChange={() => setSelectedBrand("all")}
                      className="mr-2"
                    />
                    <label htmlFor="brand-all" className="flex-grow cursor-pointer">
                      All Brands
                    </label>
                  </div>
                  
                  {brands.map(brand => (
                    <div key={brand} className="flex items-center">
                      <input
                        type="radio"
                        id={`brand-${brand}`}
                        name="brand-filter"
                        checked={selectedBrand === brand}
                        onChange={() => setSelectedBrand(brand)}
                        className="mr-2"
                      />
                      <label htmlFor={`brand-${brand}`} className="flex-grow cursor-pointer">
                        {brand}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* GENDER */}
          <div className="border mb-4">
            <div 
              className="flex justify-between items-center p-4 cursor-pointer"
              onClick={() => toggleSection('gender')}
            >
              <h3 className="font-medium">GENDER</h3>
              <span>{expandedSections.gender ? '−' : '+'}</span>
            </div>
            {expandedSections.gender && (
              <div className="p-4 border-t">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="gender-all"
                      name="gender-filter"
                      checked={selectedGender === "all"}
                      onChange={() => {
                        setSelectedGender("all");
                        setSelectedSize("all"); // Reset size when gender changes
                      }}
                      className="mr-2"
                    />
                    <label htmlFor="gender-all" className="flex-grow cursor-pointer">
                      All Genders
                    </label>
                  </div>
                  
                  {genderOptions.map(gender => (
                    <div key={gender.id} className="flex items-center">
                      <input
                        type="radio"
                        id={`gender-${gender.id}`}
                        name="gender-filter"
                        checked={selectedGender === gender.id}
                        onChange={() => {
                          setSelectedGender(gender.id);
                          setSelectedSize("all"); // Reset size when gender changes
                        }}
                        className="mr-2"
                      />
                      <label htmlFor={`gender-${gender.id}`} className="flex-grow cursor-pointer">
                        {gender.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* PRICE */}
          <div className="border mb-4">
            <div 
              className="flex justify-between items-center p-4 cursor-pointer"
              onClick={() => toggleSection('price')}
            >
              <h3 className="font-medium">PRICE</h3>
              <span>{expandedSections.price ? '−' : '+'}</span>
            </div>
            {expandedSections.price && (
              <div className="p-4 border-t">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="price-all"
                      name="price-filter"
                      checked={selectedPriceRange === "all"}
                      onChange={() => setSelectedPriceRange("all")}
                      className="mr-2"
                    />
                    <label htmlFor="price-all" className="flex-grow cursor-pointer">
                      All Prices
                    </label>
                  </div>
                  
                  {priceRanges.map(range => (
                    <div key={range.id} className="flex items-center">
                      <input
                        type="radio"
                        id={`price-${range.id}`}
                        name="price-filter"
                        checked={selectedPriceRange === range.id}
                        onChange={() => setSelectedPriceRange(range.id)}
                        className="mr-2"
                      />
                      <label htmlFor={`price-${range.id}`} className="flex-grow cursor-pointer">
                        {range.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* SIZE */}
          <div className="border mb-4">
            <div 
              className="flex justify-between items-center p-4 cursor-pointer"
              onClick={() => toggleSection('size')}
            >
              <h3 className="font-medium">SIZE</h3>
              <span>{expandedSections.size ? '−' : '+'}</span>
            </div>
            {expandedSections.size && (
              <div className="p-4 border-t">
                <div className="mb-4">
                  <button
                    onClick={() => setSelectedSize("all")}
                    className={`px-4 py-2 text-sm mb-3 w-full border ${
                      selectedSize === "all" 
                        ? "bg-black text-white border-black" 
                        : "hover:border-gray-500"
                    }`}
                  >
                    All Sizes
                  </button>
                  
                  {selectedGender !== "all" && (
                    <div className="text-sm text-gray-600 mb-2">
                      Showing {selectedGender}'s sizes
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  {getFilteredSizes().map(size => (
                    <div 
                      key={size.id}
                      className={`border p-2 text-center cursor-pointer ${
                        selectedSize === size.id.toString() ? 'border-black bg-black text-white' : 'hover:border-gray-500'
                      }`}
                      onClick={() => setSelectedSize(size.id === parseInt(selectedSize) ? "all" : size.id.toString())}
                    >
                      {size.us_size} US {size.gender}
                    </div>
                  ))}
                </div>
                
                {getFilteredSizes().length === 0 && (
                  <p className="text-gray-500 text-center py-2">
                    {selectedGender === "all" 
                      ? "Select a gender to see available sizes" 
                      : "No sizes available"}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Products Display */}
        <div className="lg:w-3/4 w-full">
          {/* Sorting and View Options */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-sm">{filteredProducts.length} products</p>
            
            <div className="flex items-center">
              <label htmlFor="sort-select" className="mr-2 text-sm">เรียงตาม:</label>
              <select 
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border p-2 text-sm"
              >
                <option value="default">สินค้าใหม่</option>
                <option value="price-low-high">ราคาต่ำ-สูง</option>
                <option value="price-high-low">ราคาสูง-ต่ำ</option>
              </select>
            </div>
          </div>
          
          {/* Active filters display */}
          {(selectedCategory !== "all" || selectedGender !== "all" || selectedPriceRange !== "all" || selectedSize !== "all" || selectedBrand !== "all") && (
            <div className="mb-6 p-3 bg-gray-50 rounded">
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-sm font-medium">Active Filters:</span>
                
                {selectedCategory !== "all" && (
                  <div className="bg-gray-200 px-3 py-1 rounded-full text-sm flex items-center">
                    <span>Category: {categories.find(c => c.id.toString() === selectedCategory)?.categoryname}</span>
                    <button 
                      onClick={() => setSelectedCategory("all")}
                      className="ml-2 text-gray-500 hover:text-gray-700"
                    >
                      ✕
                    </button>
                  </div>
                )}
                
                {selectedBrand !== "all" && (
                  <div className="bg-gray-200 px-3 py-1 rounded-full text-sm flex items-center">
                    <span>Brand: {selectedBrand}</span>
                    <button 
                      onClick={() => setSelectedBrand("all")}
                      className="ml-2 text-gray-500 hover:text-gray-700"
                    >
                      ✕
                    </button>
                  </div>
                )}
                
                {selectedGender !== "all" && (
                  <div className="bg-gray-200 px-3 py-1 rounded-full text-sm flex items-center">
                    <span>Gender: {selectedGender}</span>
                    <button 
                      onClick={() => {
                        setSelectedGender("all");
                        setSelectedSize("all"); // Reset size when gender changes
                      }}
                      className="ml-2 text-gray-500 hover:text-gray-700"
                    >
                      ✕
                    </button>
                  </div>
                )}
                
                {selectedPriceRange !== "all" && (
                  <div className="bg-gray-200 px-3 py-1 rounded-full text-sm flex items-center">
                    <span>Price: {priceRanges.find(r => r.id === selectedPriceRange)?.label}</span>
                    <button 
                      onClick={() => setSelectedPriceRange("all")}
                      className="ml-2 text-gray-500 hover:text-gray-700"
                    >
                      ✕
                    </button>
                  </div>
                )}
                
                {selectedSize !== "all" && (
                  <div className="bg-gray-200 px-3 py-1 rounded-full text-sm flex items-center">
                    <span>Size: {sizes.find(s => s.id === parseInt(selectedSize))?.us_size} US {sizes.find(s => s.id === parseInt(selectedSize))?.gender}</span>
                    <button 
                      onClick={() => setSelectedSize("all")}
                      className="ml-2 text-gray-500 hover:text-gray-700"
                    >
                      ✕
                    </button>
                  </div>
                )}
                
                <button 
                  onClick={() => {
                    setSelectedCategory("all");
                    setSelectedGender("all");
                    setSelectedPriceRange("all");
                    setSelectedSize("all");
                    setSelectedBrand("all");
                  }}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Clear All
                </button>
              </div>
            </div>
          )}
          
          {/* Products Grid */}
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
            </div>
          ) : (
            <>
              {error ? (
                <div className="text-center py-6">
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                  </div>
                  <button 
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
                  >
                    Try Again
                  </button>
                </div>
              ) : (
                <>
                  {filteredProducts.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-lg text-gray-600">No products found with the selected filters.</p>
                      <button 
                        onClick={() => {
                          setSelectedCategory("all");
                          setSelectedGender("all");
                          setSelectedPriceRange("all");
                          setSelectedSize("all");
                          setSelectedBrand("all");
                        }}
                        className="mt-4 px-6 py-2 bg-black text-white text-sm uppercase hover:bg-gray-800 transition-colors"
                      >
                        Clear Filters
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {filteredProducts.map((product) => {
                        const imageArray = parseImages(product.images);
                        const mainImage = imageArray[0] || "";
                        
                        // Calculate actual price after discount
                        const originalPrice = product.price;
                        const discount = parseFloat(product.discount) || 0;
                        const discountedPrice = originalPrice * (1 - discount);
                        
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
                              
                              {discount > 0 && (
                                <div className="absolute top-2 left-2">
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-500 text-white">
                                    {Math.round(discount * 100)}% OFF
                                  </span>
                                </div>
                              )}
                            </div>
                            
                            <div className="mt-4 flex flex-col">
                              <span className="text-sm font-medium text-gray-600">
                                {product.brand}
                              </span>
                              <span
                                className="text-sm font-medium text-gray-900 truncate w-full"
                                style={{ fontFamily: "'Lexend', sans-serif", fontWeight: 300 }}
                              >
                                {product.productname}
                              </span>
                              <div className="mt-1">
                                {discount > 0 ? (
                                  <>
                                    <span
                                      className="text-lg font-semibold"
                                      style={{ color: "red", marginRight: "8px" }}
                                    >
                                      ฿{discountedPrice.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}
                                    </span>
                                    <span className="line-through text-gray-400 text-sm">
                                      ฿{originalPrice.toLocaleString()}
                                    </span>
                                  </>
                                ) : (
                                  <span className="text-lg font-semibold text-gray-900">
                                    ฿{originalPrice.toLocaleString()}
                                  </span>
                                )}
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ShopByCategory;