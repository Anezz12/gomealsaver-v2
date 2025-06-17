'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import {
  Search,
  Filter,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  ChevronDown,
} from 'lucide-react';

interface FoodItem {
  _id: string;
  name: string;
  price: number;
  originalPrice: number;
  stockQuantity: number;
  expiryDate: string;
  image: string[];
  available: boolean; // Updated status values
}

export default function ProductsPage({ meals }: { meals: FoodItem[] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());

  // Handle case when meals is undefined or not an array
  const foodItems = Array.isArray(meals) ? meals : [];

  // Function to handle delete action
  const handleDelete = async (mealId: string, mealName: string) => {
    // Confirmation dialog
    if (
      !confirm(
        `Are you sure you want to delete "${mealName}"?\n\nThis action cannot be undone.`
      )
    ) {
      return;
    }

    console.log('🗑️ [CLIENT] Starting delete process for:', mealId);

    // Add to deleting set to show loading state
    setDeletingIds((prev) => new Set(prev).add(mealId));

    try {
      const response = await fetch(`/api/delete-meals/${mealId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('📡 [CLIENT] Delete response status:', response.status);

      const data = await response.json();
      console.log('📦 [CLIENT] Delete response data:', data);

      if (!response.ok) {
        throw new Error(
          data.error || `HTTP ${response.status}: Failed to delete meal`
        );
      }

      console.log('✅ [CLIENT] Meal deleted successfully');
      toast.success(`"${mealName}" deleted successfully!`);

      // Refresh the page to update the list
      window.location.reload();
    } catch (error: any) {
      console.error('💥 [CLIENT] Delete error:', error);
      toast.error(`Failed to delete "${mealName}": ${error.message}`);
    } finally {
      // Remove from deleting set
      setDeletingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(mealId);
        return newSet;
      });
    }
  };

  // Then update the status handling functions
  const getStatusLabel = (available: boolean) => {
    return available === true ? 'Tersedia' : 'Tidak Tersedia';
  };

  const getStatusStyle = (status: boolean) => {
    return status === true
      ? 'bg-green-900 text-green-300'
      : 'bg-red-900 text-red-300';
  };

  // Update the filter code
  const filteredFoodItems = foodItems.filter((item) => {
    // Filter by search query
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    // Filter by status
    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'available' && item.available === true) ||
      (filterStatus === 'unavailable' && item.available === false);

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="md:ml-72 lg:ml-80 pt-16 md:pt-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-1">Products</h1>
            <p className="text-gray-400">Manage your food items</p>
          </div>
          <Link
            href="/dashboard-seller/products/add"
            className="bg-amber-500 hover:bg-amber-600 text-black font-medium py-2 px-4 rounded-lg text-sm flex items-center"
          >
            <Plus size={18} className="mr-1" />
            Add New Product
          </Link>
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
                        <td className="p-4 text-sm text-gray-400">
                          {item.expiryDate}
                        </td>
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
                              onClick={() => handleDelete(item._id, item.name)}
                              disabled={isDeleting}
                              className={`p-1.5 rounded-full transition-colors ${
                                isDeleting
                                  ? 'bg-gray-600 text-gray-500 cursor-not-allowed'
                                  : 'bg-gray-800 hover:bg-red-900 text-gray-400 hover:text-red-400'
                              }`}
                              title={isDeleting ? 'Deleting...' : 'Delete meal'}
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
                            <span>Exp: {item.expiryDate}</span>
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
                  href="/dashboard-seller/products/add"
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
  );
}
