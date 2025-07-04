'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Swal from 'sweetalert2';
import { toast } from 'react-hot-toast';
import {
  Search,
  Filter,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  ChevronDown,
  RefreshCw,
} from 'lucide-react';

interface FoodItem {
  _id: string;
  name: string;
  price: number;
  originalPrice: number;
  stockQuantity: number;
  timeRemaining: string;
  image: string[];
  available: boolean;
}

export default function ProductsPage({
  initialMeals,
}: {
  initialMeals: FoodItem[];
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
  const [refreshing, setRefreshing] = useState(false);

  // ✅ Add state for meals data with initialMeals
  const [meals, setMeals] = useState<FoodItem[]>(initialMeals || []);

  // Handle case when meals is undefined or not an array
  const foodItems = Array.isArray(meals) ? meals : [];

  // ✅ Function to refresh meals data
  const refreshMeals = async () => {
    console.log('🔄 [CLIENT] Starting refresh...');
    setRefreshing(true);

    try {
      const response = await fetch('/api/meals/seller', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      });

      console.log('📡 [CLIENT] Refresh response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('✅ [CLIENT] Meals refreshed successfully:', data);

        setMeals(data.meals || []);
        toast.success('Products refreshed successfully!');
      } else {
        const errorData = await response
          .json()
          .catch(() => ({ error: 'Unknown error' }));
        console.error('❌ [CLIENT] Refresh failed:', errorData);
        toast.error(errorData.error || 'Failed to refresh products');
      }
    } catch (error: any) {
      console.error('💥 [CLIENT] Refresh error:', error);
      toast.error(`Refresh failed: ${error.message}`);
    } finally {
      setRefreshing(false);
      console.log('🏁 [CLIENT] Refresh completed');
    }
  };

  // SweetAlert2 theme configuration
  const swalDarkTheme = {
    background: '#1f2937',
    color: '#f9fafb',
    customClass: {
      popup: 'border border-gray-700',
      confirmButton: 'hover:bg-red-600 transition-colors',
      cancelButton: 'hover:bg-gray-600 transition-colors',
    },
  };

  // ✅ Updated handleDelete to update local state instead of reload
  const handleDelete = async (mealId: string, mealName: string) => {
    console.log('🗑️ [CLIENT] Starting delete process for:', mealId);

    setDeletingIds((prev) => new Set(prev).add(mealId));

    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: `You are about to delete "${mealName}". This action cannot be undone.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel',
        ...swalDarkTheme,
      });

      if (!result.isConfirmed) {
        console.log('❌ [CLIENT] Delete cancelled by user');
        setDeletingIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(mealId);
          return newSet;
        });
        return;
      }

      Swal.fire({
        title: 'Deleting...',
        text: 'Please wait while we delete your meal.',
        icon: 'info',
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        ...swalDarkTheme,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const response = await fetch(`/api/delete-meals/${mealId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('📡 [CLIENT] Delete response status:', response.status);

      const data = await response.json();
      console.log('📦 [CLIENT] Delete response data:', data);

      if (response.ok) {
        console.log('✅ [CLIENT] Meal deleted successfully:', data);

        Swal.fire({
          title: 'Deleted!',
          text: `"${mealName}" has been deleted successfully.`,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
          ...swalDarkTheme,
        });

        toast.success(`"${mealName}" deleted successfully!`);

        // ✅ Update local state instead of page reload
        setMeals((prevMeals) =>
          prevMeals.filter((meal) => meal._id !== mealId)
        );
      } else {
        console.error(
          '❌ [CLIENT] Delete failed with status:',
          response.status,
          data
        );

        Swal.fire({
          title: 'Error!',
          text: data.error || 'Failed to delete the meal. Please try again.',
          icon: 'error',
          confirmButtonColor: '#f59e0b',
          ...swalDarkTheme,
          customClass: {
            ...swalDarkTheme.customClass,
            confirmButton: 'hover:bg-amber-600 transition-colors',
          },
        });

        throw new Error(
          data.error || `HTTP ${response.status}: Failed to delete meal`
        );
      }
    } catch (error: any) {
      console.error('💥 [CLIENT] Delete error:', error);

      Swal.fire({
        title: 'Network Error!',
        text: `Failed to delete "${mealName}": ${error.message}`,
        icon: 'error',
        confirmButtonColor: '#f59e0b',
        ...swalDarkTheme,
        customClass: {
          ...swalDarkTheme.customClass,
          confirmButton: 'hover:bg-amber-600 transition-colors',
        },
      });

      toast.error(`Failed to delete "${mealName}": ${error.message}`);
    } finally {
      setDeletingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(mealId);
        return newSet;
      });
    }
  };

  // Status handling functions
  const getStatusLabel = (available: boolean) => {
    return available === true ? 'Tersedia' : 'Tidak Tersedia';
  };

  const getStatusStyle = (status: boolean) => {
    return status === true
      ? 'bg-green-900 text-green-300'
      : 'bg-red-900 text-red-300';
  };

  // Filter function
  const filteredFoodItems = foodItems.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'available' && item.available === true) ||
      (filterStatus === 'unavailable' && item.available === false);

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="md:ml-72 lg:ml-80 pt-16 md:pt-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* ✅ Updated Header with Refresh Button */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-1">Products</h1>
            <p className="text-gray-400">
              Manage your food items • {foodItems.length} total products
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* ✅ Refresh Button */}
            <button
              onClick={refreshMeals}
              disabled={refreshing}
              className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors"
              title="Refresh products"
            >
              <RefreshCw
                size={18}
                className={`${refreshing ? 'animate-spin' : ''}`}
              />
              <span className="hidden sm:inline">
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </span>
            </button>

            {/* Add Product Button */}
            <Link
              href="/dashboard-seller/products/add-meals"
              className="bg-amber-500 hover:bg-amber-600 text-black font-medium py-2 px-4 rounded-lg text-sm flex items-center"
            >
              <Plus size={18} className="mr-1" />
              <span className="hidden sm:inline">Add New Product</span>
              <span className="sm:hidden">Add</span>
            </Link>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-black rounded-xl border border-gray-800 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search
                size={18}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              />
              <input
                type="text"
                placeholder="Search products..."
                className="bg-gray-900 border border-gray-800 rounded-lg pl-10 pr-4 py-2 w-full focus:outline-none focus:border-amber-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="relative">
              <button
                className="flex items-center justify-between bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 w-full md:w-[180px]"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                <div className="flex items-center">
                  <Filter size={16} className="mr-2 text-gray-500" />
                  <span className="text-sm">
                    {filterStatus === 'all'
                      ? 'All Status'
                      : filterStatus === 'available'
                      ? 'Tersedia'
                      : 'Tidak Tersedia'}
                  </span>
                </div>
                <ChevronDown size={16} className="ml-2 text-gray-500" />
              </button>

              {isFilterOpen && (
                <div className="absolute z-10 mt-1 w-full bg-gray-900 border border-gray-800 rounded-lg shadow-lg py-1">
                  <button
                    key="filter-all"
                    className={`px-4 py-2 text-sm w-full text-left hover:bg-gray-800 ${
                      filterStatus === 'all' ? 'text-amber-500' : ''
                    }`}
                    onClick={() => {
                      setFilterStatus('all');
                      setIsFilterOpen(false);
                    }}
                  >
                    All Status
                  </button>
                  <button
                    key="filter-available"
                    className={`px-4 py-2 text-sm w-full text-left hover:bg-gray-800 ${
                      filterStatus === 'available' ? 'text-amber-500' : ''
                    }`}
                    onClick={() => {
                      setFilterStatus('available');
                      setIsFilterOpen(false);
                    }}
                  >
                    Tersedia
                  </button>
                  <button
                    key="filter-unavailable"
                    className={`px-4 py-2 text-sm w-full text-left hover:bg-gray-800 ${
                      filterStatus === 'unavailable' ? 'text-amber-500' : ''
                    }`}
                    onClick={() => {
                      setFilterStatus('unavailable');
                      setIsFilterOpen(false);
                    }}
                  >
                    Tidak Tersedia
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ✅ Loading Overlay saat Refreshing */}
        <div className="relative">
          {refreshing && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-xl z-10 flex items-center justify-center">
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 flex items-center space-x-3">
                <RefreshCw size={20} className="animate-spin text-amber-500" />
                <span className="text-white">Refreshing products...</span>
              </div>
            </div>
          )}

          {/* Products List */}
          <div>
            {/* Desktop view */}
            {filteredFoodItems.length > 0 && (
              <div className="hidden md:block bg-black rounded-xl border border-gray-800 overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-gray-400 border-b border-gray-800">
                      <th className="p-4">Product</th>
                      <th className="p-4">Price</th>
                      <th className="p-4">Quantity</th>
                      <th className="p-4">Expiry Date</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFoodItems.map((item, index) => {
                      const isDeleting = deletingIds.has(item._id);

                      return (
                        <tr
                          key={`${item._id}-${index}`}
                          className={`border-b border-gray-800 hover:bg-gray-900/50 transition-colors ${
                            isDeleting ? 'opacity-50' : ''
                          }`}
                        >
                          <td className="p-4">
                            <div className="flex items-center">
                              <div className="h-12 w-12 rounded bg-gray-800 mr-3 overflow-hidden relative">
                                <Image
                                  src={item.image[0] || '/food/placeholder.jpg'}
                                  alt={item.name}
                                  fill
                                  style={{ objectFit: 'cover' }}
                                  className="rounded"
                                />
                              </div>
                              <span className="font-medium">{item.name}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="text-amber-500 font-medium">
                              Rp{item.price.toLocaleString()}
                            </div>
                            {item.originalPrice !== item.price && (
                              <div className="text-xs text-gray-500 line-through">
                                Rp{item.originalPrice.toLocaleString()}
                              </div>
                            )}
                          </td>
                          <td className="p-4">{item.stockQuantity}</td>
                          <td className="p-4 text-sm">{item.timeRemaining}</td>
                          <td className="p-4">
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${getStatusStyle(
                                item.available
                              )}`}
                            >
                              {getStatusLabel(item.available)}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex space-x-2">
                              <Link
                                href={`/dashboard-seller/products/edit/${item._id}`}
                                className="p-1.5 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-amber-500 transition-colors"
                                title="Edit meal"
                              >
                                <Edit size={16} />
                              </Link>
                              <button
                                onClick={() =>
                                  handleDelete(item._id, item.name)
                                }
                                disabled={isDeleting}
                                className={`p-1.5 rounded-full transition-colors ${
                                  isDeleting
                                    ? 'bg-gray-600 text-gray-500 cursor-not-allowed'
                                    : 'bg-gray-800 hover:bg-red-900 text-gray-400 hover:text-red-400'
                                }`}
                                title={
                                  isDeleting ? 'Deleting...' : 'Delete meal'
                                }
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Mobile view */}
            <div className="md:hidden space-y-4">
              {filteredFoodItems.map((item, index) => {
                const isDeleting = deletingIds.has(item._id);

                return (
                  <div
                    key={`mobile-${item._id}-${index}`}
                    className={`bg-black border border-gray-800 rounded-xl overflow-hidden transition-opacity ${
                      isDeleting ? 'opacity-50' : ''
                    }`}
                  >
                    <div className="p-4">
                      <div className="flex">
                        <div className="h-20 w-20 rounded bg-gray-800 overflow-hidden relative">
                          <Image
                            src={item.image[0] || '/food/placeholder.jpg'}
                            alt={item.name}
                            fill
                            style={{ objectFit: 'cover' }}
                            className="rounded"
                          />
                        </div>
                        <div className="ml-3 flex-1">
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium">{item.name}</h4>
                            <div className="relative group">
                              <button className="p-1 text-gray-400 hover:text-white transition-colors">
                                <MoreVertical size={18} />
                              </button>
                              <div className="absolute right-0 top-full mt-1 hidden group-hover:block bg-gray-800 rounded-lg shadow-lg overflow-hidden z-10">
                                <Link
                                  href={`/dashboard-seller/products/edit/${item._id}`}
                                  className="flex items-center px-4 py-2 text-sm hover:bg-gray-700 w-full text-left transition-colors"
                                >
                                  <Edit size={14} className="mr-2" />
                                  Edit
                                </Link>
                                <button
                                  onClick={() =>
                                    handleDelete(item._id, item.name)
                                  }
                                  disabled={isDeleting}
                                  className={`flex items-center px-4 py-2 text-sm w-full text-left transition-colors ${
                                    isDeleting
                                      ? 'text-gray-500 cursor-not-allowed'
                                      : 'hover:bg-red-900 hover:text-red-400'
                                  }`}
                                >
                                  <Trash2 size={14} className="mr-2" />
                                  {isDeleting ? 'Deleting...' : 'Delete'}
                                </button>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-end mt-1">
                            <span className="text-amber-500 font-medium">
                              Rp{item.price.toLocaleString()}
                            </span>
                            {item.originalPrice !== item.price && (
                              <span className="text-xs text-gray-500 line-through ml-2">
                                Rp{item.originalPrice.toLocaleString()}
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap justify-between items-center gap-y-2 mt-3">
                            <div className="flex items-center text-xs text-gray-400">
                              <span className="mr-3">
                                Qty: {item.stockQuantity}
                              </span>
                              <span>Exp: {item.timeRemaining}</span>
                            </div>
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs ${getStatusStyle(
                                item.available
                              )}`}
                            >
                              {getStatusLabel(item.available)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Empty state */}
            {filteredFoodItems.length === 0 && (
              <div className="bg-black border border-gray-800 rounded-xl p-8 text-center">
                <div className="mx-auto w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                  <Search size={24} className="text-gray-500" />
                </div>
                <h3 className="text-lg font-medium mb-2 text-white">
                  No products found
                </h3>
                <p className="text-gray-400 mb-6">
                  {foodItems.length === 0
                    ? "You don't have any products yet. Add your first product to get started."
                    : "We couldn't find any products matching your search criteria."}
                </p>
                {foodItems.length === 0 ? (
                  <Link
                    href="/dashboard-seller/products/add-meals"
                    className="bg-amber-500 hover:bg-amber-600 text-black font-medium py-2 px-4 rounded-lg text-sm"
                  >
                    Add Product
                  </Link>
                ) : (
                  <button
                    className="bg-amber-500 hover:bg-amber-600 text-black font-medium py-2 px-4 rounded-lg text-sm"
                    onClick={() => {
                      setSearchQuery('');
                      setFilterStatus('all');
                    }}
                  >
                    Clear filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
