import React, { useState, useEffect } from 'react';
import { Search, Edit, Save, Filter, ArrowUpDown, Plus, AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout';
import createAuthenticatedRequest from '../../services/api';
import { useAuth } from '@clerk/clerk-react';

const InventoryManagement = () => {
  const { getToken } = useAuth();
  
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sizes, setSizes] = useState([]);
  const [editingStock, setEditingStock] = useState({});
  const [filterOptions, setFilterOptions] = useState({
    category: 'all',
    gender: 'all',
    brand: 'all',
    stock: 'all'
  });
  const [sortOption, setSortOption] = useState({ field: 'id', direction: 'asc' });
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  // Fetch product, size, and category data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get token from Clerk
        const token = await getToken();
        const api = createAuthenticatedRequest(token);
        
        // Fetch products with stock information
        const productsData = await api.getProducts();
        
        if (productsData) {
          setProducts(productsData);
          setFilteredProducts(productsData);
          
          // Extract unique brands
          const uniqueBrands = Array.from(
            new Set(productsData.map(product => product.brand))
          ).filter(Boolean);
          setBrands(uniqueBrands);
        }
        
        // Fetch sizes for both genders
        const allSizes = await api.getSizes();
        setSizes(allSizes);
        
        // Fetch categories
        const categoriesData = await api.getCategories();
        setCategories(categoriesData);
        
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load inventory data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [getToken]);

  // Filter and sort products when criteria change
  useEffect(() => {
    let result = [...products];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(product => 
        product.productname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply category filter
    if (filterOptions.category !== 'all') {
      result = result.filter(product => 
        product.category && product.category.id === parseInt(filterOptions.category)
      );
    }
    
    // Apply gender filter
    if (filterOptions.gender !== 'all') {
      result = result.filter(product => product.gender === filterOptions.gender);
    }
    
    // Apply brand filter
    if (filterOptions.brand !== 'all') {
      result = result.filter(product => product.brand === filterOptions.brand);
    }
    
    // Apply stock filter
    if (filterOptions.stock === 'low') {
      result = result.filter(product => 
        product.stock && product.stock.some(stock => stock.stock_quantity < 10)
      );
    } else if (filterOptions.stock === 'out') {
      result = result.filter(product => 
        product.stock && product.stock.some(stock => stock.stock_quantity === 0)
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let valueA, valueB;
      
      switch(sortOption.field) {
        case 'productname':
          valueA = a.productname.toLowerCase();
          valueB = b.productname.toLowerCase();
          break;
        case 'brand':
          valueA = a.brand.toLowerCase();
          valueB = b.brand.toLowerCase();
          break;
        case 'price':
          valueA = a.price;
          valueB = b.price;
          break;
        default: // id
          valueA = a.id;
          valueB = b.id;
      }
      
      if (sortOption.direction === 'asc') {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });
    
    setFilteredProducts(result);
    // Reset to first page when filters change
    setCurrentPage(1);
  }, [products, searchTerm, filterOptions, sortOption]);

  const handleSort = (field) => {
    setSortOption(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const parseImages = (imagesString) => {
    try {
      if (typeof imagesString === "string") {
        return JSON.parse(imagesString);
      }
      return imagesString || [];
    } catch (error) {
      return [];
    }
  };

  const handleStockChange = (productId, sizeId, value) => {
    const stockKey = `${productId}-${sizeId}`;
    setEditingStock(prev => ({
      ...prev,
      [stockKey]: parseInt(value) || 0
    }));
  };

  const startEditingStock = (productId, sizeId, currentValue) => {
    const stockKey = `${productId}-${sizeId}`;
    setEditingStock(prev => ({
      ...prev,
      [stockKey]: currentValue
    }));
  };

  const saveStockChange = async (product, sizeId) => {
    const stockKey = `${product.id}-${sizeId}`;
    const newQuantity = editingStock[stockKey];
    
    try {
      setLoading(true);
      
      // Get token from Clerk
      const token = await getToken();
      const api = createAuthenticatedRequest(token);
      
      // Find if stock entry already exists
      const existingStockItem = product.stock?.find(s => s.size_id === sizeId);
      
      if (existingStockItem) {
        // Update existing stock
        await api.updateStock(existingStockItem.id, newQuantity);
      } else {
        // Create new stock entry
        await api.addStock({ 
          product_id: product.id, 
          size_id: sizeId, 
          stock_quantity: newQuantity 
        });
      }
      
      // Refresh product data
      const updatedProducts = await api.getProducts();
      setProducts(updatedProducts);
      
      // Clear editing state
      const { [stockKey]: _, ...rest } = editingStock;
      setEditingStock(rest);
    } catch (err) {
      console.error('Error updating stock:', err);
      alert('Failed to update stock. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStockQuantity = (product, sizeId) => {
    const stockItem = product.stock?.find(s => s.size_id === sizeId);
    return stockItem ? stockItem.stock_quantity : 0;
  };

  const isEditing = (productId, sizeId) => {
    const stockKey = `${productId}-${sizeId}`;
    return stockKey in editingStock;
  };

  // Pagination logic
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin h-8 w-8 border-4 border-black rounded-full border-t-transparent"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Inventory Management</h1>
          <p className="text-gray-600">Manage product sizes and stock quantities</p>
        </div>
      </div>
      
      {error && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Search and filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            {/* Category filter */}
            <div className="relative">
              <select
                value={filterOptions.category}
                onChange={(e) => setFilterOptions(prev => ({ ...prev, category: e.target.value }))}
                className="appearance-none pl-10 pr-8 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-black focus:border-black sm:text-sm"
              >
                <option value="all">All Categories</option>
                {categories.map((category, index) => (
                  <option key={`category-${category.id || index}`} value={category.id}>
                    {category.categoryname}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter size={18} className="text-gray-400" />
              </div>
            </div>
            
            {/* Gender filter */}
            <div className="relative">
              <select
                value={filterOptions.gender}
                onChange={(e) => setFilterOptions(prev => ({ ...prev, gender: e.target.value }))}
                className="appearance-none pl-10 pr-8 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-black focus:border-black sm:text-sm"
              >
                <option value="all">All Genders</option>
                <option value="Men">Men</option>
                <option value="Women">Women</option>
              </select>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter size={18} className="text-gray-400" />
              </div>
            </div>
            
            {/* Brand filter */}
            <div className="relative">
              <select
                value={filterOptions.brand}
                onChange={(e) => setFilterOptions(prev => ({ ...prev, brand: e.target.value }))}
                className="appearance-none pl-10 pr-8 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-black focus:border-black sm:text-sm"
              >
                <option value="all">All Brands</option>
                {brands.map((brand, index) => (
                  <option key={`brand-${index}`} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter size={18} className="text-gray-400" />
              </div>
            </div>
            
            {/* Stock status filter */}
            <div className="relative">
              <select
                value={filterOptions.stock}
                onChange={(e) => setFilterOptions(prev => ({ ...prev, stock: e.target.value }))}
                className="appearance-none pl-10 pr-8 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-black focus:border-black sm:text-sm"
              >
                <option value="all">All Stock</option>
                <option value="low">Low Stock ({'<'} 10)</option>
                <option value="out">Out of Stock</option>
              </select>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter size={18} className="text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Inventory table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('id')}
                >
                  <div className="flex items-center">
                    ID
                    {sortOption.field === 'id' && (
                      <ArrowUpDown size={14} className="ml-1" />
                    )}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('productname')}
                >
                  <div className="flex items-center">
                    Product
                    {sortOption.field === 'productname' && (
                      <ArrowUpDown size={14} className="ml-1" />
                    )}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('brand')}
                >
                  <div className="flex items-center">
                    Brand
                    {sortOption.field === 'brand' && (
                      <ArrowUpDown size={14} className="ml-1" />
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gender
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sizes & Stock
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentProducts.length > 0 ? (
                currentProducts.map((product) => {
                  const imageArray = parseImages(product.images);
                  const mainImage = imageArray[0] || "";
                  
                  // Filter sizes by product gender
                  const relevantSizes = sizes.filter(size => size.gender === product.gender);

                  return (
                    <tr key={product.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        #{product.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <img 
                              src={mainImage} 
                              alt={product.productname} 
                              className="h-10 w-10 object-cover rounded"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://via.placeholder.com/40';
                              }}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {product.productname}
                            </div>
                            <div className="text-sm text-gray-500">
                              ฿{product.price?.toLocaleString() || 0}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.brand}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.gender}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.category?.categoryname || 'No Category'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap justify-center gap-2 max-w-lg mx-auto">
                          {relevantSizes.map((size, index) => {
                            const stockQuantity = getStockQuantity(product, size.id);
                            const editing = isEditing(product.id, size.id);
                            const stockKey = `${product.id}-${size.id}`;
                            
                            // Determine the appropriate background color
                            const bgColor = stockQuantity === 0 
                              ? 'bg-red-100 text-red-800' 
                              : stockQuantity < 10 
                                ? 'bg-yellow-100 text-yellow-800' 
                                : 'bg-green-100 text-green-800';
                            
                            return (
                              <div 
                                key={`size-${size.id}-${index}`} 
                                className="relative group"
                              >
                                {editing ? (
                                  <div className="flex items-center p-2 border border-gray-300 rounded-md bg-white shadow-sm">
                                    <span className="text-sm font-medium text-gray-600 mr-2">
                                      US {size.us_size}
                                    </span>
                                    <input
                                      type="number"
                                      min="0"
                                      value={editingStock[stockKey]}
                                      onChange={(e) => handleStockChange(product.id, size.id, e.target.value)}
                                      className="w-16 p-1 text-center border border-gray-300 rounded"
                                    />
                                    <button
                                      onClick={() => saveStockChange(product, size.id)}
                                      className="ml-1 p-1 text-green-600 hover:text-green-900"
                                    >
                                      <Save size={16} />
                                    </button>
                                  </div>
                                ) : (
                                  <div 
                                    className={`flex items-center py-1 px-3 rounded-md cursor-pointer hover:shadow-md transition-all ${bgColor}`}
                                    onClick={() => startEditingStock(product.id, size.id, stockQuantity)}
                                  >
                                    <span className="text-sm font-medium">US {size.us_size}</span>
                                    <span className="ml-2 font-medium">{stockQuantity}</span>
                                    <Edit size={12} className="ml-1 opacity-0 group-hover:opacity-100" />
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {filteredProducts.length > itemsPerPage && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{indexOfFirstProduct + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(indexOfLastProduct, filteredProducts.length)}
                  </span>{' '}
                  of <span className="font-medium">{filteredProducts.length}</span> products
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">Previous</span>
                    <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                  </button>
                  
                  {/* Page numbers */}
                  {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                    // For simplicity, show only 5 page buttons max
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={`page-${pageNum}`}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`relative inline-flex items-center px-4 py-2 border ${
                          currentPage === pageNum
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        } text-sm font-medium`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">Next</span>
                    <ChevronRight className="h-5 w-5" aria-hidden="true" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default InventoryManagement;