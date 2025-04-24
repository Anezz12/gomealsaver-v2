'use client';
import React, { useState } from 'react';
import Image from 'next/image';
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
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  quantity: number;
  expiryDate: string;
  image: string;
  status: 'available' | 'pending' | 'sold';
}

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Mock data
  const foodItems: FoodItem[] = [
    {
      id: '1',
      name: 'Nasi Goreng',
      price: 15000,
      originalPrice: 25000,
      quantity: 3,
      expiryDate: '2025-04-04',
      image: '/food/bakso.jpg',
      status: 'available',
    },
    {
      id: '2',
      name: 'Roti Bakar',
      price: 8000,
      originalPrice: 12000,
      quantity: 5,
      expiryDate: '2025-04-05',
      image: '/food/bakso.jpg',
      status: 'pending',
    },
    {
      id: '3',
      name: 'Mie Ayam',
      price: 12000,
      originalPrice: 20000,
      quantity: 2,
      expiryDate: '2025-04-03',
      image: '/food/bakso.jpg',
      status: 'sold',
    },
    {
      id: '4',
      name: 'Bakso Special',
      price: 18000,
      originalPrice: 25000,
      quantity: 8,
      expiryDate: '2025-04-06',
      image: '/food/bakso.jpg',
      status: 'available',
    },
  ];

  const filteredFoodItems = foodItems.filter((item) => {
    // Filter by search query
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    // Filter by status
    const matchesStatus =
      filterStatus === 'all' || item.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'available':
        return 'Tersedia';
      case 'pending':
        return 'Dipesan';
      case 'sold':
        return 'Terjual';
      default:
        return status;
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-900 text-green-300';
      case 'pending':
        return 'bg-amber-900 text-amber-300';
      case 'sold':
        return 'bg-gray-900 text-gray-300';
      default:
        return 'bg-gray-900 text-gray-300';
    }
  };

  return (
    <div className="md:ml-72 lg:ml-80 pt-16 md:pt-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-1">Products</h1>
            <p className="text-gray-400">Manage your food items</p>
          </div>
          <button className="bg-amber-500 hover:bg-amber-600 text-black font-medium py-2 px-4 rounded-lg text-sm flex items-center">
            <Plus size={18} className="mr-1" />
            Add New Product
          </button>
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
                      : getStatusLabel(filterStatus)}
                  </span>
                </div>
                <ChevronDown size={16} className="ml-2 text-gray-500" />
              </button>

              {isFilterOpen && (
                <div className="absolute z-10 mt-1 w-full bg-gray-900 border border-gray-800 rounded-lg shadow-lg py-1">
                  <button
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
                    className={`px-4 py-2 text-sm w-full text-left hover:bg-gray-800 ${
                      filterStatus === 'available' ? 'text-amber-500' : ''
                    }`}
                    onClick={() => {
                      setFilterStatus('available');
                      setIsFilterOpen(false);
                    }}
                  >
                    Available
                  </button>
                  <button
                    className={`px-4 py-2 text-sm w-full text-left hover:bg-gray-800 ${
                      filterStatus === 'pending' ? 'text-amber-500' : ''
                    }`}
                    onClick={() => {
                      setFilterStatus('pending');
                      setIsFilterOpen(false);
                    }}
                  >
                    Pending
                  </button>
                  <button
                    className={`px-4 py-2 text-sm w-full text-left hover:bg-gray-800 ${
                      filterStatus === 'sold' ? 'text-amber-500' : ''
                    }`}
                    onClick={() => {
                      setFilterStatus('sold');
                      setIsFilterOpen(false);
                    }}
                  >
                    Sold
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Products List */}
        <div>
          {/* Desktop view */}
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
                {filteredFoodItems.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-gray-800 hover:bg-gray-900/50"
                  >
                    <td className="p-4">
                      <div className="flex items-center">
                        <div className="h-12 w-12 rounded bg-gray-800 mr-3 overflow-hidden relative">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            style={{ objectFit: 'cover' }}
                            className="rounded"
                          />
                        </div>
                        <span>{item.name}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <div className="text-amber-500 font-medium">
                          Rp{item.price.toLocaleString()}
                        </div>
                        <div className="text-gray-500 text-sm line-through">
                          Rp{item.originalPrice.toLocaleString()}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">{item.quantity}</td>
                    <td className="p-4">{item.expiryDate}</td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${getStatusStyle(
                          item.status
                        )}`}
                      >
                        {getStatusLabel(item.status)}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        <button className="p-1.5 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-amber-500">
                          <Edit size={16} />
                        </button>
                        <button className="p-1.5 rounded-full bg-gray-800 hover:bg-red-900 text-gray-400 hover:text-red-400">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile view */}
          <div className="md:hidden space-y-4">
            {filteredFoodItems.map((item) => (
              <div
                key={item.id}
                className="bg-black border border-gray-800 rounded-xl overflow-hidden"
              >
                <div className="p-4">
                  <div className="flex">
                    <div className="h-20 w-20 rounded bg-gray-800 overflow-hidden relative">
                      <Image
                        src={item.image}
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
                          <button className="p-1 text-gray-400">
                            <MoreVertical size={18} />
                          </button>
                          <div className="absolute right-0 top-full mt-1 hidden group-hover:block bg-gray-800 rounded-lg shadow-lg overflow-hidden z-10">
                            <button className="flex items-center px-4 py-2 text-sm hover:bg-gray-700 w-full text-left">
                              <Edit size={14} className="mr-2" />
                              Edit
                            </button>
                            <button className="flex items-center px-4 py-2 text-sm hover:bg-red-900 hover:text-red-400 w-full text-left">
                              <Trash2 size={14} className="mr-2" />
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-end mt-1">
                        <span className="text-amber-500 font-medium">
                          Rp{item.price.toLocaleString()}
                        </span>
                        <span className="text-xs text-gray-500 line-through ml-2">
                          Rp{item.originalPrice.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex flex-wrap justify-between items-center gap-y-2 mt-3">
                        <div className="flex items-center text-xs text-gray-400">
                          <span className="mr-3">Qty: {item.quantity}</span>
                          <span>Exp: {item.expiryDate}</span>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs ${getStatusStyle(
                            item.status
                          )}`}
                        >
                          {getStatusLabel(item.status)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty state */}
          {filteredFoodItems.length === 0 && (
            <div className="bg-black border border-gray-800 rounded-xl p-8 text-center">
              <div className="mx-auto w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <Search size={24} className="text-gray-500" />
              </div>
              <h3 className="text-lg font-medium mb-2">No products found</h3>
              <p className="text-gray-400 mb-6">
                {"We couldn't find any products matching your search criteria."}
              </p>
              <button
                className="bg-amber-500 hover:bg-amber-600 text-black font-medium py-2 px-4 rounded-lg text-sm"
                onClick={() => {
                  setSearchQuery('');
                  setFilterStatus('all');
                }}
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
