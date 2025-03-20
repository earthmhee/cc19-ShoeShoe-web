// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router';
// import { 
//   PlusIcon, 
//   PencilIcon, 
//   TrashIcon, 
//   SearchIcon,
//   SlidersIcon,
//   FilterIcon,
//   ArrowUpIcon,
//   ArrowDownIcon,
//   AlertTriangle
// } from 'lucide-react';
// import AdminLayout from '../../layouts/AdminLayout';
// import { getProducts, getCategories, deleteProduct } from '../../services/api';

// const AdminProducts = () => {
//   const [products, setProducts] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [filterCategory, setFilterCategory] = useState('');
//   const [categories, setCategories] = useState([]);
//   const [sortField, setSortField] = useState('id');
//   const [sortDirection, setSortDirection] = useState('asc');
//   const [showFilters, setShowFilters] = useState(false);
//   const [brands, setBrands] = useState([]);
//   const [filterBrand, setFilterBrand] = useState('');
//   const [filterGender, setFilterGender] = useState('');

//   const itemsPerPage = 10;

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   const fetchProducts = async () => {
//     try {
//       setIsLoading(true);
//       setError(null);
      
//       // Fetch products from API
//       const productsData = await getProducts();
//       setProducts(productsData);
      
//       // Extract unique categories
//       const uniqueCategories = [...new Set(
//         productsData
//           .map(product => product.category?.categoryname)
//           .filter(Boolean)
//       )];
//       setCategories(uniqueCategories);
      
//       // Extract unique brands
//       const uniqueBrands = [...new Set(
//         productsData
//           .map(product => product.brand)
//           .filter(Boolean)
//       )];
//       setBrands(uniqueBrands);
      
//       setIsLoading(false);
//     } catch (err) {
//       console.error('Error fetching products:', err);
//       setError('Failed to load products. Please try again later.');
//       setIsLoading(false);
//     }
//   };

//   const handleDeleteProduct = async (id) => {
//     if (window.confirm('Are you sure you want to delete this product?')) {
//       try {
//         setIsLoading(true);
//         await deleteProduct(id);
        
//         // Update products list after deletion
//         setProducts(products.filter(product => product.id !== id));
//         alert('Product deleted successfully');
//       } catch (err) {
//         console.error('Error deleting product:', err);
//         alert('Failed to delete product');
//       } finally {
//         setIsLoading(false);
//       }
//     }
//   };

//   const toggleSort = (field) => {
//     if (field === sortField) {
//       setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
//     } else {
//       setSortField(field);
//       setSortDirection('asc');
//     }
//   };

//   const parseImages = (imagesString) => {
//     try {
//       if (typeof imagesString === "string") {
//         return JSON.parse(imagesString);
//       }
//       return imagesString || [];
//     } catch (error) {
//       // Fallback if the string isn't valid JSON
//       return (
//         imagesString
//           ?.replace(/^\[|\]$/g, "")
//           .split(",")
//           .map((url) => url.replace(/^"|"$/g, "")) || []
//       );
//     }
//   };

//   // Filter products
//   const filteredProducts = products.filter(product => {
//     const matchesSearch = product.productname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                           product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                           product.brand?.toLowerCase().includes(searchTerm.toLowerCase());
    
//     const matchesCategory = !filterCategory || 
//                            (product.category?.categoryname === filterCategory);
    
//     const matchesBrand = !filterBrand || product.brand === filterBrand;
    
//     const matchesGender = !filterGender || product.gender === filterGender;
    
//     return matchesSearch && matchesCategory && matchesBrand && matchesGender;
//   });

//   // Sort products
//   const sortedProducts = [...filteredProducts].sort((a, b) => {
//     let valueA = a[sortField];
//     let valueB = b[sortField];
    
//     if (sortField === 'category') {
//       valueA = a.category?.categoryname || '';
//       valueB = b.category?.categoryname || '';
//     }
    
//     if (typeof valueA === 'string') {
//       if (sortDirection === 'asc') {
//         return valueA.localeCompare(valueB);
//       } else {
//         return valueB.localeCompare(valueA);
//       }
//     } else {
//       if (sortDirection === 'asc') {
//         return valueA - valueB;
//       } else {
//         return valueB - valueA;
//       }
//     }
//   });

//   // Pagination
//   const indexOfLastProduct = currentPage * itemsPerPage;
//   const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
//   const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);
//   const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);

//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat('th-TH', {
//       style: 'currency',
//       currency: 'THB',
//       minimumFractionDigits: 0,
//     }).format(amount);
//   };

//   return (
//     <AdminLayout>
//       <div>
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-2xl font-bold">Products</h1>
//           <Link 
//             to="/products/new" 
//             className="px-4 py-2 bg-black text-white rounded-lg flex items-center gap-2 hover:bg-gray-800"
//           >
//             <PlusIcon size={18} className="mr-2" />
//             Add Product
//           </Link>
//         </div>

//         {error && (
//           <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
//             <div className="flex">
//               <div className="flex-shrink-0">
//                 <AlertTriangle className="h-5 w-5 text-yellow-400" />
//               </div>
//               <div className="ml-3">
//                 <p className="text-sm text-yellow-700">{error}</p>
//               </div>
//             </div>
//           </div>
//         )}

//         <div className="bg-white rounded-lg shadow mb-8">
//           <div className="p-4 border-b">
//             <div className="flex flex-col sm:flex-row justify-between gap-4">
//               <div className="relative flex-grow">
//                 <input
//                   type="text"
//                   placeholder="Search products..."
//                   className="w-full pl-10 pr-4 py-2 border rounded-md"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//                 <SearchIcon size={20} className="absolute left-3 top-2.5 text-gray-400" />
//               </div>
              
//               <div className="flex gap-2">
//                 <button 
//                   onClick={() => setShowFilters(!showFilters)}
//                   className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md flex items-center"
//                 >
//                   <FilterIcon size={20} className="mr-2" />
//                   Filters
//                 </button>
                
//                 <div className="relative">
//                   <select
//                     value={filterCategory}
//                     onChange={(e) => setFilterCategory(e.target.value)}
//                     className="border rounded-md px-4 py-2 appearance-none pr-10 bg-white"
//                   >
//                     <option value="">All Categories</option>
//                     {categories.map((category, index) => (
//                       <option key={index} value={category}>{category}</option>
//                     ))}
//                   </select>
//                   <SlidersIcon size={16} className="absolute right-3 top-3 text-gray-500" />
//                 </div>
//               </div>
//             </div>
            
//             {showFilters && (
//               <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
//                   <select 
//                     className="border rounded-md px-4 py-2 w-full"
//                     value={filterBrand}
//                     onChange={(e) => setFilterBrand(e.target.value)}
//                   >
//                     <option value="">All Brands</option>
//                     {brands.map((brand, index) => (
//                       <option key={index} value={brand}>{brand}</option>
//                     ))}
//                   </select>
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
//                   <select 
//                     className="border rounded-md px-4 py-2 w-full"
//                     value={filterGender}
//                     onChange={(e) => setFilterGender(e.target.value)}
//                   >
//                     <option value="">All</option>
//                     <option value="Men">Men</option>
//                     <option value="Women">Women</option>
//                   </select>
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
//                   <div className="flex items-center space-x-2">
//                     <input type="number" placeholder="Min" className="border rounded-md px-4 py-2 w-full" />
//                     <span>-</span>
//                     <input type="number" placeholder="Max" className="border rounded-md px-4 py-2 w-full" />
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>

//           {isLoading ? (
//             <div className="flex justify-center items-center h-64">
//               <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
//             </div>
//           ) : (
//             <>
//               <div className="overflow-x-auto">
//                 <table className="w-full">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         <button 
//                           onClick={() => toggleSort('id')}
//                           className="flex items-center"
//                         >
//                           ID
//                           {sortField === 'id' && (
//                             sortDirection === 'asc' ? 
//                               <ArrowUpIcon size={14} className="ml-1" /> : 
//                               <ArrowDownIcon size={14} className="ml-1" />
//                           )}
//                         </button>
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         <button 
//                           onClick={() => toggleSort('productname')}
//                           className="flex items-center"
//                         >
//                           Name
//                           {sortField === 'productname' && (
//                             sortDirection === 'asc' ? 
//                               <ArrowUpIcon size={14} className="ml-1" /> : 
//                               <ArrowDownIcon size={14} className="ml-1" />
//                           )}
//                         </button>
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         <button 
//                           onClick={() => toggleSort('category')}
//                           className="flex items-center"
//                         >
//                           Category
//                           {sortField === 'category' && (
//                             sortDirection === 'asc' ? 
//                               <ArrowUpIcon size={14} className="ml-1" /> : 
//                               <ArrowDownIcon size={14} className="ml-1" />
//                           )}
//                         </button>
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         <button 
//                           onClick={() => toggleSort('price')}
//                           className="flex items-center"
//                         >
//                           Price
//                           {sortField === 'price' && (
//                             sortDirection === 'asc' ? 
//                               <ArrowUpIcon size={14} className="ml-1" /> : 
//                               <ArrowDownIcon size={14} className="ml-1" />
//                           )}
//                         </button>
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         <button 
//                           onClick={() => toggleSort('brand')}
//                           className="flex items-center"
//                         >
//                           Brand
//                           {sortField === 'brand' && (
//                             sortDirection === 'asc' ? 
//                               <ArrowUpIcon size={14} className="ml-1" /> : 
//                               <ArrowDownIcon size={14} className="ml-1" />
//                           )}
//                         </button>
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         <button 
//                           onClick={() => toggleSort('gender')}
//                           className="flex items-center"
//                         >
//                           Gender
//                           {sortField === 'gender' && (
//                             sortDirection === 'asc' ? 
//                               <ArrowUpIcon size={14} className="ml-1" /> : 
//                               <ArrowDownIcon size={14} className="ml-1" />
//                           )}
//                         </button>
//                       </th>
//                       <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {currentProducts.length > 0 ? (
//                       currentProducts.map((product) => {
//                         const imageArray = parseImages(product.images);
//                         const mainImage = imageArray[0] || "";
                        
//                         return (
//                           <tr key={product.id}>
//                             <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.id}</td>
//                             <td className="px-6 py-4 whitespace-nowrap">
//                               <div className="h-10 w-10 rounded-md overflow-hidden">
//                                 <img 
//                                   src={mainImage} 
//                                   alt={product.productname} 
//                                   className="h-full w-full object-cover"
//                                   onError={(e) => {
//                                     e.target.onerror = null;
//                                     e.target.src = 'https://via.placeholder.com/40';
//                                   }}
//                                 />
//                               </div>
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate">
//                               {product.productname}
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                               {product.category?.categoryname || 'N/A'}
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                               {formatCurrency(product.price)}
//                               {product.discount > 0 && (
//                                 <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full">
//                                   {product.discount * 100}% OFF
//                                 </span>
//                               )}
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.brand}</td>
//                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.gender}</td>
//                             <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
//                               <div className="flex justify-center items-center space-x-2">
//                                 <Link 
//                                   to={`/products/edit/${product.id}`}
//                                   className="text-blue-600 hover:text-blue-900"
//                                 >
//                                   <PencilIcon size={18} />
//                                 </Link>
//                                 <button 
//                                   onClick={() => handleDeleteProduct(product.id)}
//                                   className="text-red-600 hover:text-red-900"
//                                 >
//                                   <TrashIcon size={18} />
//                                 </button>
//                               </div>
//                             </td>
//                           </tr>
//                         );
//                       })
//                     ) : (
//                       <tr>
//                         <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-500">
//                           No products found matching your criteria
//                         </td>
//                       </tr>
//                     )}
//                   </tbody>
//                 </table>
//               </div>
              
//               {/* Pagination */}
//               {totalPages > 1 && (
//                 <div className="p-4 border-t flex justify-between items-center">
//                   <div className="text-sm text-gray-500">
//                     Showing {indexOfFirstProduct + 1} to {Math.min(indexOfLastProduct, sortedProducts.length)} of {sortedProducts.length} products
//                   </div>
//                   <div className="flex">
//                     <button
//                       onClick={() => setCurrentPage(currentPage - 1)}
//                       disabled={currentPage === 1}
//                       className={`px-3 py-1 rounded-l-md border ${
//                         currentPage === 1 ? 'bg-white text-gray-700 cursor-not-allowed' : 'bg-white text-grey-500 hover:bg-white-100'
//                       }`}
//                     >
//                       Previous
//                     </button>
//                     {Array.from({ length: totalPages }).map((_, index) => (
//                       <button
//                         key={index}
//                         onClick={() => setCurrentPage(index + 1)}
//                         className={`px-3 py-1 border-t border-b ${
//                           currentPage === index + 1 ? 'bg-white text-gray-700' : 'bg-white text-grey-500 hover:bg-white-100'
//                         }`}
//                       >
//                         {index + 1}
//                       </button>
//                     ))}
//                     <button
//                       onClick={() => setCurrentPage(currentPage + 1)}
//                       disabled={currentPage === totalPages}
//                       className={`px-3 py-1 rounded-r-md border ${
//                         currentPage === totalPages ? 'bg-white text-gray-700 cursor-not-allowed' : 'bg-white text-grey-500 hover:bg-white-50'
//                       }`}
//                     >
//                       Next
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </>
//           )}
//         </div>
//       </div>
//     </AdminLayout>
//   );
// };

// export default AdminProducts;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { 
  Plus, 
  Pencil, 
  Trash, 
  Search,
  Sliders,
  Filter,
  ArrowUp,
  ArrowDown,
  AlertTriangle
} from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout';
import createAuthenticatedRequest from '../../services/api';
import { useAuth } from '@clerk/clerk-react';

const AdminProducts = () => {
  const { getToken } = useAuth();
  
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filterCategory, setFilterCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [sortField, setSortField] = useState('id');
  const [sortDirection, setSortDirection] = useState('asc');
  const [showFilters, setShowFilters] = useState(false);
  const [brands, setBrands] = useState([]);
  const [filterBrand, setFilterBrand] = useState('');
  const [filterGender, setFilterGender] = useState('');

  const itemsPerPage = 10;

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Get token from Clerk
      const token = await getToken();
      const api = createAuthenticatedRequest(token);
      
      // Fetch products from API
      const productsData = await api.getProducts();
      setProducts(productsData);
      
      // Extract unique categories
      const uniqueCategories = [...new Set(
        productsData
          .map(product => product.category?.categoryname)
          .filter(Boolean)
      )];
      setCategories(uniqueCategories);
      
      // Extract unique brands
      const uniqueBrands = [...new Set(
        productsData
          .map(product => product.brand)
          .filter(Boolean)
      )];
      setBrands(uniqueBrands);
      
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again later.');
      setIsLoading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        setIsLoading(true);
        
        // Get token from Clerk
        const token = await getToken();
        const api = createAuthenticatedRequest(token);
        
        await api.deleteProduct(id);
        
        // Update products list after deletion
        setProducts(products.filter(product => product.id !== id));
        alert('Product deleted successfully');
      } catch (err) {
        console.error('Error deleting product:', err);
        alert('Failed to delete product');
      } finally {
        setIsLoading(false);
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
    const matchesSearch = product.productname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.brand?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !filterCategory || 
                           (product.category?.categoryname === filterCategory);
    
    const matchesBrand = !filterBrand || product.brand === filterBrand;
    
    const matchesGender = !filterGender || product.gender === filterGender;
    
    return matchesSearch && matchesCategory && matchesBrand && matchesGender;
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
            to="/products/new" 
            className="px-4 py-2 bg-black text-white rounded-lg flex items-center gap-2 hover:bg-gray-800"
          >
            <Plus size={18} className="mr-2" />
            Add Product
          </Link>
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
                <Search size={20} className="absolute left-3 top-2.5 text-gray-400" />
              </div>
              
              <div className="flex gap-2">
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md flex items-center"
                >
                  <Filter size={20} className="mr-2" />
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
                  <Sliders size={16} className="absolute right-3 top-3 text-gray-500" />
                </div>
              </div>
            </div>
            
            {showFilters && (
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                  <select 
                    className="border rounded-md px-4 py-2 w-full"
                    value={filterBrand}
                    onChange={(e) => setFilterBrand(e.target.value)}
                  >
                    <option value="">All Brands</option>
                    {brands.map((brand, index) => (
                      <option key={index} value={brand}>{brand}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select 
                    className="border rounded-md px-4 py-2 w-full"
                    value={filterGender}
                    onChange={(e) => setFilterGender(e.target.value)}
                  >
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
                              <ArrowUp size={14} className="ml-1" /> : 
                              <ArrowDown size={14} className="ml-1" />
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
                              <ArrowUp size={14} className="ml-1" /> : 
                              <ArrowDown size={14} className="ml-1" />
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
                              <ArrowUp size={14} className="ml-1" /> : 
                              <ArrowDown size={14} className="ml-1" />
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
                              <ArrowUp size={14} className="ml-1" /> : 
                              <ArrowDown size={14} className="ml-1" />
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
                              <ArrowUp size={14} className="ml-1" /> : 
                              <ArrowDown size={14} className="ml-1" />
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
                              <ArrowUp size={14} className="ml-1" /> : 
                              <ArrowDown size={14} className="ml-1" />
                          )}
                        </button>
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentProducts.length > 0 ? (
                      currentProducts.map((product) => {
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
                                  {product.discount * 100}% OFF
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.brand}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.gender}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                              <div className="flex justify-center items-center space-x-2">
                                <Link 
                                  to={`/products/edit/${product.id}`}
                                  className="text-blue-600 hover:text-blue-900"
                                >
                                  <Pencil size={18} />
                                </Link>
                                <button 
                                  onClick={() => handleDeleteProduct(product.id)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  <Trash size={18} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-500">
                          No products found matching your criteria
                        </td>
                      </tr>
                    )}
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

export default AdminProducts;