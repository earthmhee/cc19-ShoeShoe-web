import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import axios from 'axios';
import { 
  SaveIcon, 
  XIcon, 
  PlusIcon, 
  TrashIcon,
  ImageIcon,
  ArrowLeftIcon,
  AlertCircleIcon
} from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState({
    productname: '',
    description: '',
    price: '',
    discount: '0',
    brand: '',
    gender: 'Men',
    images: [],
    category_id: '',
  });
  
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [imageUrls, setImageUrls] = useState(['', '', '']); // Store URLs for 3 images
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // In a real app, you would fetch categories from your API
        // For now, we'll use categories from the schema
        setCategories([
          { id: 1, categoryname: 'Sneakers' },
          { id: 2, categoryname: 'Sports' },
          { id: 3, categoryname: 'Sandals' },
          { id: 4, categoryname: 'Slippers' },
        ]);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    
    fetchCategories();
  }, []);
  
  useEffect(() => {
    if (isEditMode) {
      const fetchProduct = async () => {
        try {
          setIsLoading(true);
          const response = await axios.get(`http://localhost:8000/api/product/show-product`);
          const products = response.data?.data || [];
          const product = products.find(p => p.id === parseInt(id));
          
          if (product) {
            // Parse images from the string to array
            let images = [];
            try {
              images = JSON.parse(product.images);
            } catch (error) {
              // If parsing fails, try to split the string
              images = product.images
                ?.replace(/^\[|\]$/g, "")
                .split(",")
                .map((url) => url.replace(/^"|"$/g, "")) || [];
            }
            
            setFormData({
              productname: product.productname,
              description: product.description || '',
              price: product.price.toString(),
              discount: (product.discount || 0).toString(),
              brand: product.brand,
              gender: product.gender,
              category_id: product.category_id.toString(),
              images: images
            });
            
            // Set image URLs (up to 3)
            setImageUrls(images.slice(0, 3).concat(Array(3 - images.length).fill('')));
          }
          setIsLoading(false);
        } catch (error) {
          console.error('Error fetching product details:', error);
          setIsLoading(false);
        }
      };
      
      fetchProduct();
    }
  }, [id, isEditMode]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is modified
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };
  
  const handleImageUrlChange = (index, value) => {
    const updatedUrls = [...imageUrls];
    updatedUrls[index] = value;
    setImageUrls(updatedUrls);
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.productname.trim()) {
      newErrors.productname = 'Product name is required';
    }
    
    if (!formData.price.trim()) {
      newErrors.price = 'Price is required';
    } else if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Price must be a positive number';
    }
    
    if (formData.discount.trim() && (isNaN(formData.discount) || parseFloat(formData.discount) < 0 || parseFloat(formData.discount) > 1)) {
      newErrors.discount = 'Discount must be a number between 0 and 1 (e.g., 0.2 for 20%)';
    }
    
    if (!formData.brand.trim()) {
      newErrors.brand = 'Brand is required';
    }
    
    if (!formData.gender) {
      newErrors.gender = 'Gender is required';
    }
    
    if (!formData.category_id) {
      newErrors.category_id = 'Category is required';
    }
    
    // Validate at least one image URL
    const validImageUrls = imageUrls.filter(url => url.trim() !== '');
    if (validImageUrls.length === 0) {
      newErrors.images = 'At least one image URL is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Filter out empty image URLs
      const validImageUrls = imageUrls.filter(url => url.trim() !== '');
      
      // Prepare data for submission
      const productData = {
        ...formData,
        price: parseInt(formData.price, 10),
        discount: formData.discount ? parseFloat(formData.discount) : 0,
        category_id: parseInt(formData.category_id, 10),
        images: JSON.stringify(validImageUrls)
      };
      
      if (isEditMode) {
        // Update existing product
        await axios.put(`http://localhost:8000/api/product/update-product/${id}`, productData);
        alert('Product updated successfully');
      } else {
        // Create new product
        await axios.post('http://localhost:8000/api/product/add-product', productData);
        alert('Product added successfully');
      }
      
      // Redirect to product list
      navigate('/products');
    } catch (error) {
      console.error('Error saving product:', error);
      alert(`Failed to ${isEditMode ? 'update' : 'add'} product. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <AdminLayout>
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout>
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{isEditMode ? 'Edit Product' : 'Add Product'}</h1>
        <button
          onClick={() => navigate('/products')}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md flex items-center"
        >
          <ArrowLeftIcon size={20} className="mr-2" />
          Back to Products
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="productname" className="block text-sm font-medium text-gray-700 mb-1">
                Product Name*
              </label>
              <input
                type="text"
                id="productname"
                name="productname"
                value={formData.productname}
                onChange={handleChange}
                className={`w-full border rounded-md px-4 py-2 ${errors.productname ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.productname && (
                <p className="mt-1 text-sm text-red-500 flex items-center">
                  <AlertCircleIcon size={14} className="mr-1" />
                  {errors.productname}
                </p>
              )}
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full border border-gray-300 rounded-md px-4 py-2"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                  Price*
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  step="1"
                  className={`w-full border rounded-md px-4 py-2 ${errors.price ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.price && (
                  <p className="mt-1 text-sm text-red-500 flex items-center">
                    <AlertCircleIcon size={14} className="mr-1" />
                    {errors.price}
                  </p>
                )}
              </div>
              
              <div>
                <label htmlFor="discount" className="block text-sm font-medium text-gray-700 mb-1">
                  Discount (0-1)
                </label>
                <input
                  type="number"
                  id="discount"
                  name="discount"
                  value={formData.discount}
                  onChange={handleChange}
                  min="0"
                  max="1"
                  step="0.01"
                  className={`w-full border rounded-md px-4 py-2 ${errors.discount ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.discount && (
                  <p className="mt-1 text-sm text-red-500 flex items-center">
                    <AlertCircleIcon size={14} className="mr-1" />
                    {errors.discount}
                  </p>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">
                  Brand*
                </label>
                <input
                  type="text"
                  id="brand"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  className={`w-full border rounded-md px-4 py-2 ${errors.brand ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.brand && (
                  <p className="mt-1 text-sm text-red-500 flex items-center">
                    <AlertCircleIcon size={14} className="mr-1" />
                    {errors.brand}
                  </p>
                )}
              </div>
              
              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                  Gender*
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className={`w-full border rounded-md px-4 py-2 ${errors.gender ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="Men">Men</option>
                  <option value="Women">Women</option>
                </select>
                {errors.gender && (
                  <p className="mt-1 text-sm text-red-500 flex items-center">
                    <AlertCircleIcon size={14} className="mr-1" />
                    {errors.gender}
                  </p>
                )}
              </div>
            </div>
            
            <div>
              <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-1">
                Category*
              </label>
              <select
                id="category_id"
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                className={`w-full border rounded-md px-4 py-2 ${errors.category_id ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id.toString()}>
                    {category.categoryname}
                  </option>
                ))}
              </select>
              {errors.category_id && (
                <p className="mt-1 text-sm text-red-500 flex items-center">
                  <AlertCircleIcon size={14} className="mr-1" />
                  {errors.category_id}
                </p>
              )}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Product Images*
            </label>
            
            <div className="space-y-4">
              {imageUrls.map((url, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex-grow">
                    <input
                      type="text"
                      value={url}
                      onChange={(e) => handleImageUrlChange(index, e.target.value)}
                      placeholder={`Image ${index + 1} URL`}
                      className="w-full border border-gray-300 rounded-md px-4 py-2"
                    />
                  </div>
                  
                  {url && (
                    <div className="h-10 w-10 rounded-md overflow-hidden border border-gray-300">
                      <img 
                        src={url} 
                        alt={`Product preview ${index + 1}`} 
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/100';
                        }}
                      />
                    </div>
                  )}
                  
                  {!url && (
                    <div className="h-10 w-10 rounded-md overflow-hidden border border-gray-300 bg-gray-100 flex items-center justify-center">
                      <ImageIcon size={20} className="text-gray-400" />
                    </div>
                  )}
                </div>
              ))}
              
              {errors.images && (
                <p className="mt-1 text-sm text-red-500 flex items-center">
                  <AlertCircleIcon size={14} className="mr-1" />
                  {errors.images}
                </p>
              )}
              
              <div className="bg-gray-50 p-4 rounded-md mt-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Product Image Tips</h3>
                <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                  <li>Use high-quality images with good lighting</li>
                  <li>Show the product from multiple angles</li>
                  <li>Maintain a consistent aspect ratio (recommended: 3:4)</li>
                  <li>Use a clean, neutral background</li>
                  <li>Make sure the product takes up most of the frame</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/products')}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center"
            disabled={isSubmitting}
          >
            <XIcon size={20} className="mr-2" />
            Cancel
          </button>
          
          <button
            type="submit"
            className={`px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
            disabled={isSubmitting}
          >
            <SaveIcon size={20} className="mr-2" />
            {isSubmitting ? 'Saving...' : isEditMode ? 'Update Product' : 'Add Product'}
          </button>
        </div>
      </form>
    </div>
    </AdminLayout>
  );
};

export default ProductForm;