import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Plus, X, Upload } from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout';
import axios from 'axios';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  // Form state
  const [formData, setFormData] = useState({
    productname: '',
    description: '',
    price: '',
    discount: '',
    brand: '',
    gender: 'Men',
    category_id: '',
    images: []
  });

  // UI state
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [error, setError] = useState('');

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // You'll need to create this endpoint in your backend
        const response = await axios.get('http://localhost:8001/api/category/show-category');
        if (response.data && response.data.data) {
          setCategories(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError('Failed to load categories. Please try refreshing the page.');
      }
    };

    fetchCategories();

    // If editing, fetch product data
    if (isEditMode) {
      fetchProductData();
    }
  }, [id]);

  const fetchProductData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8001/api/product/show-product/${id}`);
      
      if (response.data && response.data.data) {
        const productData = response.data.data;
        
        // Parse images from JSON string if necessary
        let parsedImages = [];
        try {
          if (typeof productData.images === 'string') {
            parsedImages = JSON.parse(productData.images);
          } else if (Array.isArray(productData.images)) {
            parsedImages = productData.images;
          }
        } catch (e) {
          console.error('Error parsing images:', e);
          parsedImages = [];
        }
        
        setFormData({
          productname: productData.productname || '',
          description: productData.description || '',
          price: productData.price?.toString() || '',
          discount: productData.discount?.toString() || '',
          brand: productData.brand || '',
          gender: productData.gender || 'Men',
          category_id: productData.category_id?.toString() || '',
          images: parsedImages
        });
        
        setImageUrls(parsedImages);
      }
    } catch (error) {
      console.error('Error fetching product data:', error);
      setError('Failed to load product data. Please try refreshing the page.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      // Store the files for later submission
      setImageFiles(prev => [...prev, ...files]);
      
      // Create local URLs for preview
      const newImageUrls = files.map(file => URL.createObjectURL(file));
      setImageUrls(prev => [...prev, ...newImageUrls]);
    }
  };

  const removeImage = (index) => {
    setImageUrls(prev => prev.filter((_, i) => i !== index));
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    
    // If we're editing and removing an existing image
    if (isEditMode && index < formData.images.length) {
      setFormData(prev => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index)
      }));
    }
  };

  const uploadImagesToCloudinary = async () => {
    const uploadedUrls = [];
    
    // Keep existing images if editing
    if (isEditMode) {
      uploadedUrls.push(...formData.images);
    }
    
    // Upload each new image to Cloudinary (or your preferred image hosting)
    for (const file of imageFiles) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'shoeshoe_uploads'); // Replace with your upload preset
      
      try {
        const response = await axios.post(
          'https://api.cloudinary.com/v1_1/your-cloud-name/image/upload', // Replace with your Cloudinary cloud name
          formData
        );
        
        if (response.data && response.data.secure_url) {
          uploadedUrls.push(response.data.secure_url);
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        throw new Error('Failed to upload images. Please try again.');
      }
    }
    
    return uploadedUrls;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError('');
      
      // Validate form data
      if (!formData.productname || !formData.price || !formData.brand || !formData.category_id) {
        setError('Please fill in all required fields');
        setSaving(false);
        return;
      }
      
      // When submitting, we need to convert the images to a JSON string
      // In a real implementation, you would upload the images to a server or cloud storage
      
      // Mock image upload - in a real app, use uploadImagesToCloudinary()
      // const imageUrls = await uploadImagesToCloudinary();
      
      // For now, we'll use the existing URLs in our formData
      const productData = {
        ...formData,
        price: parseInt(formData.price),
        discount: formData.discount ? parseInt(formData.discount) : 0,
        images: JSON.stringify(imageUrls)
      };
      
      if (isEditMode) {
        // Update existing product
        await axios.patch(
          `http://localhost:8001/api/product/update-product/${id}`,
          productData
        );
      } else {
        // Create new product
        await axios.post(
          'http://localhost:8001/api/product/add-product',
          productData
        );
      }
      
      // Navigate back to products list
      navigate('/admin/products');
    } catch (error) {
      console.error('Error saving product:', error);
      setError('Failed to save product. Please try again.');
    } finally {
      setSaving(false);
    }
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
      <div className="mb-6">
        <button
          onClick={() => navigate('/admin/products')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Products
        </button>
        <h1 className="text-2xl font-bold">{isEditMode ? 'Edit Product' : 'Add New Product'}</h1>
      </div>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <X className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Product Name */}
            <div>
              <label htmlFor="productname" className="block text-sm font-medium text-gray-700 mb-1">
                Product Name *
              </label>
              <input
                type="text"
                id="productname"
                name="productname"
                value={formData.productname}
                onChange={handleChange}
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                required
              />
            </div>
            
            {/* Price */}
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                Price (฿) *
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                min="0"
                required
              />
            </div>
            
            {/* Discount */}
            <div>
              <label htmlFor="discount" className="block text-sm font-medium text-gray-700 mb-1">
                Discount (%)
              </label>
              <input
                type="number"
                id="discount"
                name="discount"
                value={formData.discount}
                onChange={handleChange}
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                min="0"
                max="100"
              />
            </div>
            
            {/* Brand */}
            <div>
              <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">
                Brand *
              </label>
              <input
                type="text"
                id="brand"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                required
              />
            </div>
            
            {/* Gender */}
            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                Gender *
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                required
              >
                <option value="Men">Men</option>
                <option value="Women">Women</option>
              </select>
            </div>
            
            {/* Category */}
            <div>
              <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                id="category_id"
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                required
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.categoryname}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Description */}
          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
            />
          </div>
          
          {/* Image Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Images
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="image-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                  >
                    <span>Upload images</span>
                    <input
                      id="image-upload"
                      name="image-upload"
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
            </div>
            
            {/* Image Previews */}
            {imageUrls.length > 0 && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {imageUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`Product preview ${index + 1}`}
                      className="h-24 w-24 object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Submit Button */}
          <div className="flex justify-end mt-8">
            <button
              type="button"
              onClick={() => navigate('/admin/products')}
              className="mr-4 bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-black text-white py-2 px-4 rounded-md shadow-sm text-sm font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black flex items-center"
              disabled={saving}
            >
              {saving ? (
                <>
                  <div className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : isEditMode ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default ProductForm;