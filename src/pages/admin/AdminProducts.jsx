// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router';
// import { Plus, Edit, Trash2, Search, ChevronLeft, ChevronRight } from 'lucide-react';
// import AdminLayout from '../../layouts/AdminLayout';
// import axios from 'axios';

// const AdminProducts = () => {
//   const [products, setProducts] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const productsPerPage = 10;

//   useEffect(() => {
//     fetchProducts();
//   }, [currentPage]);

//   const fetchProducts = async () => {
//     try {
//       setIsLoading(true);
//       const response = await axios.get('http://localhost:8001/api/product/show-product');
      
//       if (response.data && response.data.data) {
//         setProducts(response.data.data);
//         setTotalPages(Math.ceil(response.data.data.length / productsPerPage));
//       }
//     } catch (error) {
//       console.error('Error fetching products:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const deleteProduct = async (id) => {
//     if (window.confirm('Are you sure you want to delete this product?')) {
//       try {
//         await axios.delete(`http://localhost:8001/api/product/delete-product/${id}`);
//         fetchProducts(); // Refresh the list
//       } catch (error) {
//         console.error('Error deleting product:', error);
//       }
//     }
//   };

//   // Filter products based on search term
//   const filteredProducts = products.filter(product => 
//     product.productname.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     product.brand.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   // Paginate products
//   const indexOfLastProduct = currentPage * productsPerPage;
//   const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
//   const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

//   // Parse images from JSON string
//   const parseImages = (imagesString) => {
//     try {
//       if (typeof imagesString === "string") {
//         return JSON.parse(imagesString);
//       }
//       return imagesString || [];
//     } catch (error) {
//       return [];
//     }
//   };

//   return (
//     <AdminLayout>
//       <div className="mb-6 flex justify-between items-center">
//         <div>
//           <h1 className="text-2xl font-bold">Products</h1>
//           <p className="text-gray-600">Manage your product inventory</p>
//         </div>
//         <Link 
//           to="/admin/products/new" 
//           className="px-4 py-2 bg-black text-white rounded-lg flex items-center gap-2 hover:bg-gray-800"
//         >
//           <Plus size={18} />
//           Add Product
//         </Link>
//       </div>

//       {/* Search and filter */}
//       <div className="bg-white p-4 rounded-lg shadow mb-6">
//         <div className="relative">
//           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//             <Search size={18} className="text-gray-400" />
//           </div>
//           <input
//             type="text"
//             className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
//             placeholder="Search products..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>
//       </div>

//       {/* Products table */}
//       <div className="bg-white rounded-lg shadow overflow-hidden">
//         {isLoading ? (
//           <div className="flex justify-center items-center p-8">
//             <div className="animate-spin h-8 w-8 border-4 border-black rounded-full border-t-transparent"></div>
//           </div>
//         ) : (
//           <>
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Product
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Category
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Price
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Brand
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Gender
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {currentProducts.length > 0 ? (
//                     currentProducts.map((product) => {
//                       const imageArray = parseImages(product.images);
//                       const mainImage = imageArray[0] || "";

//                       return (
//                         <tr key={product.id}>
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             <div className="flex items-center">
//                               <div className="h-10 w-10 flex-shrink-0">
//                                 <img 
//                                   src={mainImage} 
//                                   alt={product.productname} 
//                                   className="h-10 w-10 object-cover rounded"
//                                 />
//                               </div>
//                               <div className="ml-4">
//                                 <div className="text-sm font-medium text-gray-900">
//                                   {product.productname}
//                                 </div>
//                                 <div className="text-sm text-gray-500">
//                                   ID: {product.id}
//                                 </div>
//                               </div>
//                             </div>
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                             {product.category?.categoryname || 'No Category'}
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                             ฿{product.price.toLocaleString()}
//                             {product.discount && product.discount > 0 && (
//                               <span className="ml-2 text-xs text-red-500">
//                                 {product.discount}% OFF
//                               </span>
//                             )}
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                             {product.brand}
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                             {product.gender}
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                             <div className="flex items-center space-x-3">
//                               <Link 
//                                 to={`/admin/products/edit/${product.id}`} 
//                                 className="text-indigo-600 hover:text-indigo-900"
//                               >
//                                 <Edit size={18} />
//                               </Link>
//                               <button 
//                                 onClick={() => deleteProduct(product.id)} 
//                                 className="text-red-600 hover:text-red-900"
//                               >
//                                 <Trash2 size={18} />
//                               </button>
//                             </div>
//                           </td>
//                         </tr>
//                       );
//                     })
//                   ) : (
//                     <tr>
//                       <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
//                         No products found
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
            
//             {/* Pagination */}
//             {filteredProducts.length > productsPerPage && (
//               <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
//                 <div className="flex-1 flex justify-between sm:hidden">
//                   <button
//                     onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//                     disabled={currentPage === 1}
//                     className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
//                   >
//                     Previous
//                   </button>
//                   <button
//                     onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
//                     disabled={currentPage === totalPages}
//                     className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
//                   >
//                     Next
//                   </button>
//                 </div>
//                 <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
//                   <div>
//                     <p className="text-sm text-gray-700">
//                       Showing <span className="font-medium">{indexOfFirstProduct + 1}</span> to{' '}
//                       <span className="font-medium">
//                         {Math.min(indexOfLastProduct, filteredProducts.length)}
//                       </span>{' '}
//                       of <span className="font-medium">{filteredProducts.length}</span> products
//                     </p>
//                   </div>
//                   <div>
//                     <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
//                       <button
//                         onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//                         disabled={currentPage === 1}
//                         className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
//                       >
//                         <span className="sr-only">Previous</span>
//                         <ChevronLeft className="h-5 w-5" aria-hidden="true" />
//                       </button>
//                       {/* Page numbers would go here */}
//                       <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
//                         {currentPage} / {totalPages}
//                       </span>
//                       <button
//                         onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
//                         disabled={currentPage === totalPages}
//                         className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
//                       >
//                         <span className="sr-only">Next</span>
//                         <ChevronRight className="h-5 w-5" aria-hidden="true" />
//                       </button>
//                     </nav>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </>
//         )}
//       </div>
//     </AdminLayout>
//   );
// };

// export default AdminProducts;


// src/pages/admin/ProductList.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import axios from 'axios';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  SearchIcon,
  SlidersIcon,
  FilterIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout'

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filterCategory, setFilterCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [sortField, setSortField] = useState('id');
  const [sortDirection, setSortDirection] = useState('asc');
  const [showFilters, setShowFilters] = useState(false);

  const itemsPerPage = 10;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('http://localhost:8001/api/product/show-product');
        setProducts(response.data?.data || []);
        
        // Extract unique categories
        const uniqueCategories = [...new Set(response.data?.data?.map(product => product.category?.categoryname) || [])];
        setCategories(uniqueCategories);
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const deleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`http://localhost:8001/api/product/delete-product/${id}`);
        setProducts(products.filter(product => product.id !== id));
        alert('Product deleted successfully');
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product');
      }
    }
  };

  const toggleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const parseImages = (imagesString) => {
    try {
      if (typeof imagesString === "string") {
        return JSON.parse(imagesString);
      }
      return imagesString || [];
    } catch (error) {
      // Fallback if the string isn't valid JSON
      return (
        imagesString
          ?.replace(/^\[|\]$/g, "")
          .split(",")
          .map((url) => url.replace(/^"|"$/g, "")) || []
      );
    }
  };

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.productname.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.brand.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === '' || product.category?.categoryname === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    let valueA = a[sortField];
    let valueB = b[sortField];
    
    if (sortField === 'category') {
      valueA = a.category?.categoryname || '';
      valueB = b.category?.categoryname || '';
    }
    
    if (typeof valueA === 'string') {
      if (sortDirection === 'asc') {
        return valueA.localeCompare(valueB);
      } else {
        return valueB.localeCompare(valueA);
      }
    } else {
      if (sortDirection === 'asc') {
        return valueA - valueB;
      } else {
        return valueB - valueA;
      }
    }
  });

  // Pagination
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <AdminLayout>
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link 
          to="/admin/products/new" 
          className="px-4 py-2 bg-black text-white rounded-lg flex items-center gap-2 hover:bg-gray-800"
        >
          <PlusIcon size={18} className="mr-2" />
          Add Product
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow mb-8">
        <div className="p-4 border-b">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 border rounded-md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <SearchIcon size={20} className="absolute left-3 top-2.5 text-gray-400" />
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md flex items-center"
              >
                <FilterIcon size={20} className="mr-2" />
                Filters
              </button>
              
              <div className="relative">
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="border rounded-md px-4 py-2 appearance-none pr-10 bg-white"
                >
                  <option value="">All Categories</option>
                  {categories.map((category, index) => (
                    <option key={index} value={category}>{category}</option>
                  ))}
                </select>
                <SlidersIcon size={16} className="absolute right-3 top-3 text-gray-500" />
              </div>
            </div>
          </div>
          
          {showFilters && (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                <select className="border rounded-md px-4 py-2 w-full">
                  <option value="">All Brands</option>
                  <option value="Nike">Nike</option>
                  <option value="Adidas">Adidas</option>
                  <option value="New Balance">New Balance</option>
                  <option value="Hoka">Hoka</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <select className="border rounded-md px-4 py-2 w-full">
                  <option value="">All</option>
                  <option value="Men">Men</option>
                  <option value="Women">Women</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
                <div className="flex items-center space-x-2">
                  <input type="number" placeholder="Min" className="border rounded-md px-4 py-2 w-full" />
                  <span>-</span>
                  <input type="number" placeholder="Max" className="border rounded-md px-4 py-2 w-full" />
                </div>
              </div>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button 
                        onClick={() => toggleSort('id')}
                        className="flex items-center"
                      >
                        ID
                        {sortField === 'id' && (
                          sortDirection === 'asc' ? 
                            <ArrowUpIcon size={14} className="ml-1" /> : 
                            <ArrowDownIcon size={14} className="ml-1" />
                        )}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button 
                        onClick={() => toggleSort('productname')}
                        className="flex items-center"
                      >
                        Name
                        {sortField === 'productname' && (
                          sortDirection === 'asc' ? 
                            <ArrowUpIcon size={14} className="ml-1" /> : 
                            <ArrowDownIcon size={14} className="ml-1" />
                        )}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button 
                        onClick={() => toggleSort('category')}
                        className="flex items-center"
                      >
                        Category
                        {sortField === 'category' && (
                          sortDirection === 'asc' ? 
                            <ArrowUpIcon size={14} className="ml-1" /> : 
                            <ArrowDownIcon size={14} className="ml-1" />
                        )}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button 
                        onClick={() => toggleSort('price')}
                        className="flex items-center"
                      >
                        Price
                        {sortField === 'price' && (
                          sortDirection === 'asc' ? 
                            <ArrowUpIcon size={14} className="ml-1" /> : 
                            <ArrowDownIcon size={14} className="ml-1" />
                        )}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button 
                        onClick={() => toggleSort('brand')}
                        className="flex items-center"
                      >
                        Brand
                        {sortField === 'brand' && (
                          sortDirection === 'asc' ? 
                            <ArrowUpIcon size={14} className="ml-1" /> : 
                            <ArrowDownIcon size={14} className="ml-1" />
                        )}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button 
                        onClick={() => toggleSort('gender')}
                        className="flex items-center"
                      >
                        Gender
                        {sortField === 'gender' && (
                          sortDirection === 'asc' ? 
                            <ArrowUpIcon size={14} className="ml-1" /> : 
                            <ArrowDownIcon size={14} className="ml-1" />
                        )}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentProducts.map((product) => {
                    const imageArray = parseImages(product.images);
                    const mainImage = imageArray[0] || "";
                    
                    return (
                      <tr key={product.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-10 w-10 rounded-md overflow-hidden">
                            <img 
                              src={mainImage} 
                              alt={product.productname} 
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://via.placeholder.com/40';
                              }}
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate">
                          {product.productname}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {product.category?.categoryname || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatCurrency(product.price)}
                          {product.discount > 0 && (
                            <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full">
                              {(product.discount * 100).toFixed(0)}% OFF
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.brand}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.gender}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                          <div className="flex justify-center items-center space-x-2">
                            <Link 
                              to={`/admin/products/edit/${product.id}`}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <PencilIcon size={18} />
                            </Link>
                            <button 
                              onClick={() => deleteProduct(product.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <TrashIcon size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="p-4 border-t flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  Showing {indexOfFirstProduct + 1} to {Math.min(indexOfLastProduct, sortedProducts.length)} of {sortedProducts.length} products
                </div>
                <div className="flex">
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded-l-md border ${
                      currentPage === 1 ? 'bg-white text-gray-700 cursor-not-allowed' : 'bg-white text-grey-500 hover:bg-white-100'
                    }`}
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPage(index + 1)}
                      className={`px-3 py-1 border-t border-b ${
                        currentPage === index + 1 ? 'bg-white text-gray-700' : 'bg-white text-grey-500 hover:bg-white-100'
                      }`}

                      // border border-gray-300 bg-white text-sm font-medium text-gray-700
                    >
                      {index + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded-r-md border ${
                      currentPage === totalPages ? 'bg-white text-gray-700 cursor-not-allowed' : 'bg-white text-grey-500 hover:bg-white-50'
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
    </AdminLayout>
  );
};

export default ProductList;