'use client';

import React, {
  useState,
  useRef,
  ChangeEvent,
  FormEvent,
  useEffect,
} from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import {
  ArrowLeft,
  Check,
  TagIcon,
  CameraIcon,
  Clock,
  Utensils,
  Store,
  Trash2,
} from 'lucide-react';

interface UpdateMealFormProps {
  meal: {
    id: string;
    name: string;
    description: string;
    price: number;
    originalPrice: number;
    discountPercentage: number;
    stockQuantity: number;
    cuisine: string;
    portionSize: string;
    timeRemaining: string;
    features: string[];
    image: string[];
    restaurant: {
      name: string;
      address: string;
      city: string;
      state: string;
      phone: string;
      email: string;
    };
  };
}

export default function UpdateMealForm({ meal }: UpdateMealFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImages, setPreviewImages] = useState<string[]>(
    meal.image || []
  );
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(
    meal.features || []
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form data initialized with existing meal data
  const [formData, setFormData] = useState({
    name: meal.name,
    stockQuantity: meal.stockQuantity,
    cuisine: meal.cuisine,
    description: meal.description,
    price: meal.price,
    discountPercentage: meal.discountPercentage,
    originalPrice: meal.originalPrice,
    portionSize: meal.portionSize,
    timeRemaining: meal.timeRemaining,
    'restaurant.name': meal.restaurant.name,
    'restaurant.address': meal.restaurant.address,
    'restaurant.city': meal.restaurant.city,
    'restaurant.state': meal.restaurant.state,
    'restaurant.phone': meal.restaurant.phone,
    'restaurant.email': meal.restaurant.email,
  });

  // Available features for selection
  const availableFeatures = [
    'Spicy',
    'Vegetarian',
    'Vegan',
    'Halal',
    'Gluten-Free',
    'Best Seller',
    'New',
    'Limited',
    'Organic',
    'Popular',
  ];

  useEffect(() => {
    console.log('🖥️ [CLIENT] UpdateMealForm loaded with meal:', meal.name);
  }, [meal]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (
      name === 'price' ||
      name === 'originalPrice' ||
      name === 'discountPercentage' ||
      name === 'stockQuantity'
    ) {
      // Convert to number for numeric fields
      setFormData((prev) => ({
        ...prev,
        [name]: value === '' ? 0 : Number(value),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleFeatureToggle = (feature: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(feature)
        ? prev.filter((f) => f !== feature)
        : [...prev, feature]
    );
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);

      // Store new files separately
      setNewImageFiles((prev) => [...prev, ...newFiles]);

      // Create preview URLs for the new files
      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
      setPreviewImages((prev) => [...prev, ...newPreviews]);

      // Clear any previous image errors
      if (errors.image) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.image;
          return newErrors;
        });
      }
    }
  };

  const removeImage = (index: number) => {
    const imageUrl = previewImages[index];

    // Remove from preview
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));

    // If it's a new image (blob URL), also remove from newImageFiles
    if (imageUrl.startsWith('blob:')) {
      // Find the corresponding file index
      const blobUrls = previewImages.filter((img) => img.startsWith('blob:'));
      const blobIndex = blobUrls.indexOf(imageUrl);
      if (blobIndex !== -1) {
        setNewImageFiles((prev) => prev.filter((_, i) => i !== blobIndex));
      }
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Required fields
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.description.trim())
      newErrors.description = 'Description is required';
    if (formData.price < 0) newErrors.price = 'Price must be greater than 0';
    if (formData.originalPrice <= 0)
      newErrors.originalPrice = 'Original price must be greater than 0';
    if (formData.stockQuantity <= 0)
      newErrors.stockQuantity = 'Quantity must be greater than 0';
    if (!formData['restaurant.name'].trim())
      newErrors['restaurant.name'] = 'Restaurant name is required';

    // Image validation
    if (previewImages.length === 0) {
      newErrors.image = 'At least one image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateOriginalPrice = () => {
    if (formData.price && formData.discountPercentage) {
      const calculatedOriginal = Math.round(
        formData.price / (1 - formData.discountPercentage / 100)
      );
      setFormData((prev) => ({
        ...prev,
        originalPrice: calculatedOriginal,
      }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    console.log('🖥️ [CLIENT] Submitting update form for meal:', meal.id);

    if (!validateForm()) {
      const firstErrorField = document.querySelector('[aria-invalid="true"]');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsSubmitting(true);

    try {
      const submitFormData = new FormData();

      // Add all text/number form fields
      Object.entries(formData).forEach(([key, value]) => {
        submitFormData.append(key, value.toString());
      });

      // Add all selected features
      selectedFeatures.forEach((feature) => {
        submitFormData.append('features', feature);
      });

      // Add existing images (URLs)
      previewImages.forEach((imageUrl) => {
        if (imageUrl.startsWith('http') || imageUrl.startsWith('/')) {
          submitFormData.append('existingImages', imageUrl);
        }
      });

      // Add new image files
      newImageFiles.forEach((file) => {
        submitFormData.append('image', file);
      });

      console.log('🚀 [CLIENT] Sending update request...');

      const response = await fetch(`/api/update-meals/${meal.id}`, {
        method: 'PUT',
        body: submitFormData,
      });

      const data = await response.json();
      console.log('📦 [CLIENT] Update response:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update meal');
      }

      console.log('✅ [CLIENT] Meal updated successfully');
      toast.success('Meal updated successfully! 🎉', {
        duration: 5000,
        position: 'top-center',
        style: {
          background: '#10B981',
          color: '#FFFFFF',
          padding: '16px',
          borderRadius: '10px',
        },
        icon: '👍',
      });

      // Redirect to products page
      router.push('/dashboard-seller/products');
    } catch (error: any) {
      console.error('💥 [CLIENT] Update error:', error);
      toast.error(`Failed to update meal: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="md:ml-72 lg:ml-80 pt-16 md:pt-6 min-h-screen">
      <div className="p-4 md:p-6 lg:p-8 max-w-5xl mx-auto">
        <div className="flex items-center mb-6">
          <button
            onClick={() => router.back()}
            className="mr-4 p-2 rounded-full hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">Update Product</h1>
            <p className="text-gray-400 mt-1">
              Update information for {meal.name}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload Section */}
          <div className="bg-black rounded-xl border border-gray-800 p-6">
            <h2 className="text-lg font-medium mb-4 text-white">
              Product Images
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-4">
              {/* Preview images */}
              {previewImages.map((preview, index) => (
                <div
                  key={index}
                  className="relative aspect-square rounded-lg border border-gray-800 bg-gray-900 overflow-hidden group"
                >
                  <Image
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    fill
                    style={{ objectFit: 'cover' }}
                    className="rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-red-600/90 hover:bg-red-600 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 className="w-3 h-3 text-white" />
                  </button>
                  {/* Show indicator for existing vs new images */}
                  <div className="absolute bottom-2 left-2">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        preview.startsWith('blob:')
                          ? 'bg-green-600/80 text-green-100'
                          : 'bg-blue-600/80 text-blue-100'
                      }`}
                    >
                      {preview.startsWith('blob:') ? 'New' : 'Existing'}
                    </span>
                  </div>
                </div>
              ))}

              {/* Upload button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square rounded-lg border-2 border-dashed border-gray-700 flex flex-col items-center justify-center hover:border-amber-500 transition-colors"
              >
                <CameraIcon className="w-8 h-8 text-gray-500 mb-2" />
                <span className="text-sm text-gray-400">Add Photo</span>
              </button>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                multiple
                accept="image/*"
                className="hidden"
                aria-invalid={errors.image ? 'true' : 'false'}
              />
            </div>

            {errors.image && (
              <p className="text-red-500 text-sm mt-1">{errors.image}</p>
            )}

            <p className="text-gray-500 text-sm">
              Upload up to 5 images. First image will be used as the cover.
              <br />
              <span className="text-amber-400">Blue labels</span> = existing
              images,
              <span className="text-green-400"> Green labels</span> = new images
            </p>
          </div>

          {/* Basic Information */}
          <div className="bg-black rounded-xl border border-gray-800 p-6">
            <h2 className="text-lg font-medium mb-4 text-white">
              Basic Information
            </h2>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-400 mb-1"
                >
                  Product Name*
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="e.g. Nasi Goreng Special"
                  aria-invalid={errors.name ? 'true' : 'false'}
                  required
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium text-gray-400 mb-1"
                  >
                    Discounted Price (Rp)*
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                    placeholder="e.g. 25000"
                    aria-invalid={errors.price ? 'true' : 'false'}
                    required
                  />
                  {errors.price && (
                    <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="originalPrice"
                    className="block text-sm font-medium text-gray-400 mb-1"
                  >
                    Original Price (Rp)*
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      id="originalPrice"
                      name="originalPrice"
                      value={formData.originalPrice}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                      placeholder="e.g. 35000"
                      aria-invalid={errors.originalPrice ? 'true' : 'false'}
                      required
                    />
                    <button
                      type="button"
                      onClick={calculateOriginalPrice}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded hover:bg-gray-700 transition-colors"
                    >
                      Calculate
                    </button>
                  </div>
                  {errors.originalPrice && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.originalPrice}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="discountPercentage"
                    className="block text-sm font-medium text-gray-400 mb-1"
                  >
                    Discount Percentage (%)
                  </label>
                  <input
                    type="number"
                    id="discountPercentage"
                    name="discountPercentage"
                    value={formData.discountPercentage}
                    onChange={handleInputChange}
                    min="0"
                    max="100"
                    className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                    placeholder="e.g. 30"
                  />
                </div>

                <div>
                  <label
                    htmlFor="stockQuantity"
                    className="block text-sm font-medium text-gray-400 mb-1"
                  >
                    Quantity in Stock*
                  </label>
                  <input
                    type="number"
                    id="stockQuantity"
                    name="stockQuantity"
                    value={formData.stockQuantity}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                    placeholder="e.g. 10"
                    aria-invalid={errors.stockQuantity ? 'true' : 'false'}
                    required
                  />
                  {errors.stockQuantity && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.stockQuantity}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-400 mb-1"
                >
                  Description*
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="Describe your food item"
                  aria-invalid={errors.description ? 'true' : 'false'}
                  required
                ></textarea>
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.description}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-black rounded-xl border border-gray-800 p-6">
            <h2 className="text-lg font-medium mb-4 text-white">
              Additional Information
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label
                    htmlFor="cuisine"
                    className="block text-sm font-medium text-gray-400 mb-1"
                  >
                    <Utensils className="inline-block w-4 h-4 mr-1" />
                    Cuisine
                  </label>
                  <input
                    type="text"
                    id="cuisine"
                    name="cuisine"
                    value={formData.cuisine}
                    onChange={handleInputChange}
                    className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                    placeholder="e.g. Indonesian, Italian, etc."
                  />
                </div>

                <div>
                  <label
                    htmlFor="portionSize"
                    className="block text-sm font-medium text-gray-400 mb-1"
                  >
                    Portion Size
                  </label>
                  <select
                    id="portionSize"
                    name="portionSize"
                    value={formData.portionSize}
                    onChange={handleInputChange}
                    className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                  >
                    <option value="Small">Small</option>
                    <option value="Medium">Medium</option>
                    <option value="Large">Large</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="timeRemaining"
                    className="block text-sm font-medium text-gray-400 mb-1"
                  >
                    <Clock className="inline-block w-4 h-4 mr-1" />
                    Time Remaining
                  </label>
                  <select
                    id="timeRemaining"
                    name="timeRemaining"
                    value={formData.timeRemaining}
                    onChange={handleInputChange}
                    className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                  >
                    <option value="1 hour">1 hour</option>
                    <option value="2 hours">2 hours</option>
                    <option value="3 hours">3 hours</option>
                    <option value="4 hours">4 hours</option>
                    <option value="Today">Today</option>
                    <option value="Tomorrow">Tomorrow</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  <TagIcon className="inline-block w-4 h-4 mr-1" />
                  Features
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableFeatures.map((feature) => (
                    <button
                      key={feature}
                      type="button"
                      onClick={() => handleFeatureToggle(feature)}
                      className={`text-sm px-3 py-1.5 rounded-full transition-colors ${
                        selectedFeatures.includes(feature)
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-gray-900 text-gray-400 border border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      {selectedFeatures.includes(feature) && (
                        <Check className="inline-block w-3 h-3 mr-1" />
                      )}
                      {feature}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Restaurant Information */}
          <div className="bg-black rounded-xl border border-gray-800 p-6">
            <h2 className="text-lg font-medium mb-4 text-white">
              <Store className="inline-block w-5 h-5 mr-1" />
              Restaurant Information
            </h2>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="restaurant.name"
                  className="block text-sm font-medium text-gray-400 mb-1"
                >
                  Restaurant Name*
                </label>
                <input
                  type="text"
                  id="restaurant.name"
                  name="restaurant.name"
                  value={formData['restaurant.name']}
                  onChange={handleInputChange}
                  className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="e.g. Warung Makan Enak"
                  aria-invalid={errors['restaurant.name'] ? 'true' : 'false'}
                  required
                />
                {errors['restaurant.name'] && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors['restaurant.name']}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="restaurant.address"
                    className="block text-sm font-medium text-gray-400 mb-1"
                  >
                    Address
                  </label>
                  <input
                    type="text"
                    id="restaurant.address"
                    name="restaurant.address"
                    value={formData['restaurant.address']}
                    onChange={handleInputChange}
                    className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                    placeholder="e.g. Jl. Makan Enak No. 123"
                  />
                </div>

                <div>
                  <label
                    htmlFor="restaurant.city"
                    className="block text-sm font-medium text-gray-400 mb-1"
                  >
                    City
                  </label>
                  <input
                    type="text"
                    id="restaurant.city"
                    name="restaurant.city"
                    value={formData['restaurant.city']}
                    onChange={handleInputChange}
                    className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                    placeholder="e.g. Jakarta"
                  />
                </div>

                <div>
                  <label
                    htmlFor="restaurant.phone"
                    className="block text-sm font-medium text-gray-400 mb-1"
                  >
                    Phone
                  </label>
                  <input
                    type="text"
                    id="restaurant.phone"
                    name="restaurant.phone"
                    value={formData['restaurant.phone']}
                    onChange={handleInputChange}
                    className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                    placeholder="e.g. 08123456789"
                  />
                </div>

                <div>
                  <label
                    htmlFor="restaurant.email"
                    className="block text-sm font-medium text-gray-400 mb-1"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="restaurant.email"
                    name="restaurant.email"
                    value={formData['restaurant.email']}
                    onChange={handleInputChange}
                    className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                    placeholder="e.g. contact@restaurant.com"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2.5 border border-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-2.5 bg-amber-500 text-black font-medium rounded-lg hover:bg-amber-600 transition-colors flex items-center justify-center ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Updating...' : 'Update Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
