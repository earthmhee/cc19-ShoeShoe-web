import React, { useState, useEffect } from 'react';
import { Search, Edit, Save, Filter, ArrowUpDown, Plus } from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout';
import axios from 'axios';

const InventoryManagement = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
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

  // Fetch product, size, and category data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch products with stock information
        const productResponse = await axios.get('http://localhost:8001/api/product/show-product');
        
        if (productResponse.data && productResponse.data.data) {
          setProducts(productResponse.data.data);
          setFilteredProducts(productResponse.data.data);
          
          // Extract unique brands
          const uniqueBrands = Array.from(
            new Set(productResponse.data.data.map(product => product.brand))
          );
          setBrands(uniqueBrands);
        }
        
        // Mock sizes data - ideally this would come from your backend
        // You'll need to create a sizes endpoint in your API
        const mockSizes = [
          { id: 1, us_size: 7, gender: 'Men' },
          { id: 2, us_size: 8, gender: 'Men' },
          { id: 3, us_size: 9, gender: 'Men' },
          { id: 4, us_size: 10, gender: 'Men' },
          { id: 5, us_size: 11, gender: 'Men' },
          { id: 6, us_size: 12, gender: 'Men' },
          { id: 7, us_size: 13, gender: 'Men' },
          { id: 8, us_size: 5, gender: 'Women' },
          { id: 9, us_size: 6, gender: 'Women' },
          { id: 10, us_size: 7, gender: 'Women' },
          { id: 11, us_size: 8, gender: 'Women' },
          { id: 12, us_size: 9, gender: 'Women' },
          { id: 13, us_size: 10, gender: 'Women' },
          { id: 14, us_size: 11, gender: 'Women' },
        ];
        setSizes(mockSizes);
        
        // Fetch categories
        const categoryResponse = await axios.get('http://localhost:8001/api/product/show-product');
        if (categoryResponse.data && categoryResponse.data.data) {
          const uniqueCategories = Array.from(
            new Set(categoryResponse.data.data.map(product => product.category))
          ).filter(Boolean).map(category => ({
            id: category.id,
            categoryname: category.categoryname
          }));
          
          setCategories(uniqueCategories);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

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
      // Find if stock entry already exists
      const existingStockItem = product.stock?.find(s => s.size_id === sizeId);
      
      if (existingStockItem) {
        // Update existing stock
        await axios.patch(`http://localhost:8001/api/stock/update-stock/${existingStockItem.id}`, {
          stock_quantity: newQuantity
        });
      } else {
        // Create new stock entry
        await axios.post('http://localhost:8001/api/stock/add-stock', {
          product_id: product.id,
          size_id: sizeId,
          stock_quantity: newQuantity
        });
      }
      
      // Refresh product data
      const response = await axios.get('http://localhost:8001/api/product/show-product');
      if (response.data && response.data.data) {
        setProducts(response.data.data);
      }
      
      // Clear editing state
      const { [stockKey]: _, ...rest } = editingStock;
      setEditingStock(rest);
    } catch (error) {
      console.error('Error updating stock:', error);
      alert('Failed to update stock. Please try again.');
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
        <button 
          className="px-4 py-2 bg-black text-white rounded-lg flex items-center gap-2 hover:bg-gray-800"
          // This could link to a bulk stock update form
          onClick={() => alert('Bulk stock update feature would go here')}
        >
          <Plus size={18} />
          Bulk Update
        </button>
      </div>
      
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
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
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
                  <option key={index} value={brand}>
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
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => {
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
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {product.productname}
                            </div>
                            <div className="text-sm text-gray-500">
                              ฿{product.price.toLocaleString()}
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
                        <div className="grid grid-cols-4 gap-2">
                          {relevantSizes.map(size => {
                            const stockQuantity = getStockQuantity(product, size.id);
                            const editing = isEditing(product.id, size.id);
                            const stockKey = `${product.id}-${size.id}`;
                            
                            return (
                              <div key={size.id} className="text-center">
                                <div className="text-xs font-medium mb-1">
                                  US {size.us_size}
                                </div>
                                
                                {editing ? (
                                  <div className="flex items-center">
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
                                    className={`text-sm py-1 px-2 rounded ${
                                      stockQuantity === 0 
                                        ? 'bg-red-100 text-red-800' 
                                        : stockQuantity < 10 
                                          ? 'bg-yellow-100 text-yellow-800' 
                                          : 'bg-green-100 text-green-800'
                                    }`}
                                    onClick={() => startEditingStock(product.id, size.id, stockQuantity)}
                                  >
                                    <div className="flex items-center justify-center">
                                      {stockQuantity}
                                      <Edit size={12} className="ml-1" />
                                    </div>
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
      </div>
    </AdminLayout>
  );
};

export default InventoryManagement;