import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router';
import {
  Save,
  X,
  ArrowLeft,
  AlertCircle,
  Image,
  Upload,
  Trash2
} from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout';
import createAuthenticatedRequest from '../../services/api';
import { useAuth } from '@clerk/clerk-react';

// Cloudinary configuration
const CLOUDINARY_CLOUD_NAME = "dfmqmyop1";
const CLOUDINARY_UPLOAD_PRESET = "shoeshoe";

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getToken } = useAuth();

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
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cloudinaryWidget, setCloudinaryWidget] = useState(null);

  // Function to load Cloudinary script dynamically
  const loadCloudinaryScript = useCallback(() => {
    return new Promise((resolve, reject) => {
      // Check if script is already loaded
      if (window.cloudinary) {
        resolve();
        return;
      }

      // Create script element
      const script = document.createElement('script');
      script.src = 'https://upload-widget.cloudinary.com/global/all.js';
      script.async = true;

      // Set up event listeners for load and error
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Could not load Cloudinary script'));

      // Append the script to the document
      document.body.appendChild(script);
    });
  }, []);

  // Initialize Cloudinary widget
  useEffect(() => {
    const initCloudinary = async () => {
      try {
        // First load the script
        await loadCloudinaryScript();

        // Then create the widget once script is loaded
        if (window.cloudinary) {
          const widget = window.cloudinary.createUploadWidget(
            {
              cloudName: CLOUDINARY_CLOUD_NAME,
              uploadPreset: CLOUDINARY_UPLOAD_PRESET,
              maxFiles: 3,
              sources: ['local', 'url', 'camera'],
              multiple: true,
              cropping: false,
              styles: {
                palette: {
                  window: "#FFFFFF",
                  windowBorder: "#90A0B3",
                  tabIcon: "#0078FF",
                  menuIcons: "#5A616A",
                  textDark: "#000000",
                  textLight: "#FFFFFF",
                  link: "#0078FF",
                  action: "#FF620C",
                  inactiveTabIcon: "#0E2F5A",
                  error: "#F44235",
                  inProgress: "#0078FF",
                  complete: "#20B832",
                  sourceBg: "#E4EBF1"
                }
              }
            },
            (error, result) => {
              if (!error && result && result.event === "success") {
                // Add the uploaded image URL to our state
                setUploadedImages(prev => {
                  // Limit to 3 images
                  const newImages = [...prev, result.info.secure_url].slice(0, 3);
                  return newImages;
                });
              }
            }
          );
          setCloudinaryWidget(widget);
        }
      } catch (error) {
        console.error("Failed to initialize Cloudinary widget:", error);
      }
    };

    initCloudinary();

    // Cleanup function
    return () => {
      if (cloudinaryWidget) {
        cloudinaryWidget.close();
      }
    };
  }, [loadCloudinaryScript]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);

        // Get token from Clerk
        const token = await getToken();
        const api = createAuthenticatedRequest(token);

        // Try to fetch categories from API
        const categoriesData = await api.getCategories();
        setCategories(categoriesData);

        // If editing, fetch product details
        if (isEditMode) {
          const product = await api.getProductById(id);

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

            // Set uploaded images from the fetched product
            setUploadedImages(images);
          }
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        // In case of API error, use hardcoded categories
        setCategories([
          { id: 1, categoryname: 'Sneakers' },
          { id: 2, categoryname: 'Sports' },
          { id: 3, categoryname: 'Sandals' },
          { id: 4, categoryname: 'Slippers' },
        ]);
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [id, isEditMode, getToken]);

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

  const openCloudinaryWidget = useCallback(() => {
    if (cloudinaryWidget) {
      cloudinaryWidget.open();
    } else {
      console.error("Cloudinary widget not initialized");
    }
  }, [cloudinaryWidget]);

  const removeImage = (index) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
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

    // Validate at least one image is uploaded
    if (uploadedImages.length === 0) {
      newErrors.images = 'At least one image is required';
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

      // Get token from Clerk
      const token = await getToken();
      const api = createAuthenticatedRequest(token);

      // Prepare data for submission, using uploaded image URLs
      const productData = {
        ...formData,
        price: parseInt(formData.price, 10),
        discount: formData.discount ? parseFloat(formData.discount) : 0,
        category_id: parseInt(formData.category_id, 10),
        images: JSON.stringify(uploadedImages)
      };

      if (isEditMode) {
        // Update existing product
        await api.updateProduct(id, productData);
        alert('Product updated successfully');
      } else {
        // Create new product
        await api.createProduct(productData);
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
          {/* Standardized loader with black/gray */}
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{isEditMode ? 'Edit Product' : 'Add Product'}</h1>
          {/* Standardized secondary button */}
          <button
            onClick={() => navigate('/products')}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md flex items-center"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Products
          </button>
        </div>

        {/* Cloudinary script is loaded dynamically in useEffect */}

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {/* Product Name Field */}
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
                  className={`w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-1 ${errors.productname
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-gray-500 focus:border-gray-500'
                    }`}
                />
                {errors.productname && (
                  <p className="mt-1 text-sm text-red-500 flex items-center">
                    <AlertCircle size={14} className="mr-1" />
                    {errors.productname}
                  </p>
                )}
              </div>

              {/* Description Field */}
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
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-gray-500 focus:border-gray-500"
                />
              </div>

              {/* Price and Discount Fields */}
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
                    className={`w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-1 ${errors.price
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-gray-500 focus:border-gray-500'
                      }`}
                  />
                  {errors.price && (
                    <p className="mt-1 text-sm text-red-500 flex items-center">
                      <AlertCircle size={14} className="mr-1" />
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
                    className={`w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-1 ${errors.discount
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-gray-500 focus:border-gray-500'
                      }`}
                  />
                  {errors.discount && (
                    <p className="mt-1 text-sm text-red-500 flex items-center">
                      <AlertCircle size={14} className="mr-1" />
                      {errors.discount}
                    </p>
                  )}
                </div>
              </div>

              {/* Brand and Gender Fields */}
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
                    className={`w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-1 ${errors.brand
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-gray-500 focus:border-gray-500'
                      }`}
                  />
                  {errors.brand && (
                    <p className="mt-1 text-sm text-red-500 flex items-center">
                      <AlertCircle size={14} className="mr-1" />
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
                    className={`w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-1 ${errors.gender
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-gray-500 focus:border-gray-500'
                      }`}
                  >
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                  </select>
                  {errors.gender && (
                    <p className="mt-1 text-sm text-red-500 flex items-center">
                      <AlertCircle size={14} className="mr-1" />
                      {errors.gender}
                    </p>
                  )}
                </div>
              </div>

              {/* Category Field */}
              <div>
                <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-1">
                  Category*
                </label>
                <select
                  id="category_id"
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  className={`w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-1 ${errors.category_id
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-gray-500 focus:border-gray-500'
                    }`}
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
                    <AlertCircle size={14} className="mr-1" />
                    {errors.category_id}
                  </p>
                )}
              </div>
            </div>

            {/* Images Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Product Images* (Max 3)
              </label>

              <div className="space-y-4">
                {/* Image upload section - Standardized */}
                <div className="border border-dashed border-gray-300 rounded-md p-4">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    {/* Standardized button - changed from blue to gray/black */}
                    <button
                      type="button"
                      onClick={openCloudinaryWidget}
                      className="px-4 py-2 bg-gray-800 text-white rounded-md flex items-center hover:bg-black transition-colors"
                      disabled={uploadedImages.length >= 3}
                    >
                      <Upload size={20} className="mr-2" />
                      {uploadedImages.length === 0 ? 'Upload Images' : 'Add More Images'}
                    </button>
                    <p className="text-xs text-gray-500">
                      {uploadedImages.length >= 3
                        ? 'Maximum of 3 images reached'
                        : `${uploadedImages.length}/3 images uploaded`}
                    </p>
                  </div>
                </div>

                {/* Display uploaded images */}
                <div className="grid grid-cols-3 gap-3">
                  {uploadedImages.map((url, index) => (
                    <div key={index} className="relative">
                      <div className="h-32 rounded-md overflow-hidden border border-gray-300">
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
                      {/* Image delete button */}
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-100 text-red-600 rounded-full p-1 hover:bg-red-200 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}

                  {/* Placeholder for empty slots */}
                  {Array.from({ length: Math.max(0, 3 - uploadedImages.length) }).map((_, index) => (
                    <div key={`empty-${index}`} className="h-32 rounded-md border border-gray-300 bg-gray-50 flex items-center justify-center">
                      <Image size={24} className="text-gray-400" />
                    </div>
                  ))}
                </div>

                {errors.images && (
                  <p className="mt-1 text-sm text-red-500 flex items-center">
                    <AlertCircle size={14} className="mr-1" />
                    {errors.images}
                  </p>
                )}

                {/* Image tips box */}
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

          {/* Form buttons - Standardized */}
          <div className="mt-8 pt-6 border-t flex justify-end space-x-3">
            {/* Cancel button */}
            <button
              type="button"
              onClick={() => navigate('/products')}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center"
              disabled={isSubmitting}
            >
              <X size={20} className="mr-2" />
              Cancel
            </button>

            {/* Submit button - changed from blue to black */}
            <button
              type="submit"
              className={`px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 flex items-center ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              disabled={isSubmitting}
            >
              <Save size={20} className="mr-2" />
              {isSubmitting ? 'Saving...' : isEditMode ? 'Update Product' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default ProductForm;