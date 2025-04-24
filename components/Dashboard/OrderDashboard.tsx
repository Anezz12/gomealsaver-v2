'use client';

import React, { useState } from 'react';

import {
  Search,
  Filter,
  ArrowDownUp,
  ChevronDown,
  Clock,
  CheckCircle2,
  XCircle,
  TruckIcon,
  CalendarIcon,
  MapPin,
  User,
  Banknote,
  MoreVertical,
  Phone,
} from 'lucide-react';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  customerName: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'completed' | 'cancelled' | 'processing' | 'delivered';
  date: string;
  customerAddress?: string;
  customerPhone?: string;
  paymentMethod?: string;
}

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  // Mock data
  const orders: Order[] = [
    {
      id: 'ORD-001',
      customerName: 'Budi Santoso',
      items: [{ id: '1', name: 'Nasi Goreng', quantity: 2, price: 15000 }],
      total: 30000,
      status: 'pending',
      date: '2025-04-03',
      customerAddress: 'Jl. Kebon Jeruk No. 15, Jakarta Barat',
      customerPhone: '+62811234567',
      paymentMethod: 'Cash on Delivery',
    },
    {
      id: 'ORD-002',
      customerName: 'Siti Nurhaliza',
      items: [
        { id: '2', name: 'Mie Ayam', quantity: 1, price: 12000 },
        { id: '3', name: 'Es Teh', quantity: 1, price: 3000 },
      ],
      total: 15000,
      status: 'completed',
      date: '2025-04-02',
      customerAddress: 'Jl. Sudirman No. 45, Jakarta Pusat',
      customerPhone: '+62822987654',
      paymentMethod: 'Bank Transfer',
    },
    {
      id: 'ORD-003',
      customerName: 'Joko Widodo',
      items: [
        { id: '4', name: 'Ayam Goreng', quantity: 2, price: 18000 },
        { id: '5', name: 'Nasi Putih', quantity: 2, price: 5000 },
      ],
      total: 46000,
      status: 'processing',
      date: '2025-04-02',
      customerAddress: 'Jl. Gatot Subroto No. 10, Jakarta Selatan',
      customerPhone: '+62833456789',
      paymentMethod: 'E-wallet',
    },
    {
      id: 'ORD-004',
      customerName: 'Dewi Fatmawati',
      items: [{ id: '6', name: 'Bakso Spesial', quantity: 3, price: 20000 }],
      total: 60000,
      status: 'cancelled',
      date: '2025-04-01',
      customerAddress: 'Jl. Thamrin No. 25, Jakarta Pusat',
      customerPhone: '+62844123456',
      paymentMethod: 'Credit Card',
    },
    {
      id: 'ORD-005',
      customerName: 'Ahmad Dhani',
      items: [
        { id: '7', name: 'Soto Ayam', quantity: 2, price: 15000 },
        { id: '8', name: 'Es Jeruk', quantity: 2, price: 5000 },
      ],
      total: 40000,
      status: 'delivered',
      date: '2025-04-01',
      customerAddress: 'Jl. Kuningan No. 8, Jakarta Selatan',
      customerPhone: '+62855789012',
      paymentMethod: 'E-wallet',
    },
  ];

  // Filter and sort orders
  const filteredOrders = orders
    .filter((order) => {
      // Filter by search query (order ID or customer name)
      const matchesSearch =
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase());

      // Filter by status
      const matchesStatus =
        filterStatus === 'all' || order.status === filterStatus;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      // Sort by date
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-amber-900/40 text-amber-300">
            <Clock size={12} /> Pending
          </span>
        );
      case 'processing':
        return (
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-blue-900/40 text-blue-300">
            <TruckIcon size={12} /> Processing
          </span>
        );
      case 'completed':
        return (
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-green-900/40 text-green-300">
            <CheckCircle2 size={12} /> Completed
          </span>
        );
      case 'cancelled':
        return (
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-red-900/40 text-red-300">
            <XCircle size={12} /> Cancelled
          </span>
        );
      case 'delivered':
        return (
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-purple-900/40 text-purple-300">
            <TruckIcon size={12} /> Delivered
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs bg-gray-900 text-gray-300">
            {status}
          </span>
        );
    }
  };

  return (
    <main className="md:ml-72 lg:ml-80 pt-16 md:pt-6 min-h-screen">
      <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Orders</h1>
            <p className="text-gray-400">
              Manage and track your customer orders
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-black rounded-xl border border-gray-800 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search
                size={18}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              />
              <input
                type="text"
                placeholder="Search by order ID or customer..."
                className="bg-gray-900 border border-gray-800 rounded-lg pl-10 pr-4 py-2 w-full focus:outline-none focus:border-amber-500 text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex space-x-3">
              {/* Filter Dropdown */}
              <div className="relative">
                <button
                  className="flex items-center justify-between bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 w-full md:w-[150px]"
                  onClick={() => {
                    setIsFilterOpen(!isFilterOpen);
                    setIsSortOpen(false);
                  }}
                >
                  <div className="flex items-center">
                    <Filter size={16} className="mr-2 text-gray-500" />
                    <span className="text-sm text-white">
                      {filterStatus === 'all'
                        ? 'All Status'
                        : filterStatus.charAt(0).toUpperCase() +
                          filterStatus.slice(1)}
                    </span>
                  </div>
                  <ChevronDown size={16} className="ml-2 text-gray-500" />
                </button>

                {isFilterOpen && (
                  <div className="absolute z-10 mt-1 w-full bg-gray-900 border border-gray-800 rounded-lg shadow-lg py-1">
                    <button
                      className={`px-4 py-2 text-sm w-full text-left hover:bg-gray-800 ${
                        filterStatus === 'all' ? 'text-amber-500' : 'text-white'
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
                        filterStatus === 'pending'
                          ? 'text-amber-500'
                          : 'text-white'
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
                        filterStatus === 'processing'
                          ? 'text-amber-500'
                          : 'text-white'
                      }`}
                      onClick={() => {
                        setFilterStatus('processing');
                        setIsFilterOpen(false);
                      }}
                    >
                      Processing
                    </button>
                    <button
                      className={`px-4 py-2 text-sm w-full text-left hover:bg-gray-800 ${
                        filterStatus === 'completed'
                          ? 'text-amber-500'
                          : 'text-white'
                      }`}
                      onClick={() => {
                        setFilterStatus('completed');
                        setIsFilterOpen(false);
                      }}
                    >
                      Completed
                    </button>
                    <button
                      className={`px-4 py-2 text-sm w-full text-left hover:bg-gray-800 ${
                        filterStatus === 'cancelled'
                          ? 'text-amber-500'
                          : 'text-white'
                      }`}
                      onClick={() => {
                        setFilterStatus('cancelled');
                        setIsFilterOpen(false);
                      }}
                    >
                      Cancelled
                    </button>
                    <button
                      className={`px-4 py-2 text-sm w-full text-left hover:bg-gray-800 ${
                        filterStatus === 'delivered'
                          ? 'text-amber-500'
                          : 'text-white'
                      }`}
                      onClick={() => {
                        setFilterStatus('delivered');
                        setIsFilterOpen(false);
                      }}
                    >
                      Delivered
                    </button>
                  </div>
                )}
              </div>

              {/* Sort Dropdown */}
              <div className="relative">
                <button
                  className="flex items-center justify-between bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 w-full md:w-[150px]"
                  onClick={() => {
                    setIsSortOpen(!isSortOpen);
                    setIsFilterOpen(false);
                  }}
                >
                  <div className="flex items-center">
                    <ArrowDownUp size={16} className="mr-2 text-gray-500" />
                    <span className="text-sm text-white">
                      {sortOrder === 'newest' ? 'Newest First' : 'Oldest First'}
                    </span>
                  </div>
                  <ChevronDown size={16} className="ml-2 text-gray-500" />
                </button>

                {isSortOpen && (
                  <div className="absolute right-0 z-10 mt-1 w-full bg-gray-900 border border-gray-800 rounded-lg shadow-lg py-1">
                    <button
                      className={`px-4 py-2 text-sm w-full text-left hover:bg-gray-800 ${
                        sortOrder === 'newest' ? 'text-amber-500' : 'text-white'
                      }`}
                      onClick={() => {
                        setSortOrder('newest');
                        setIsSortOpen(false);
                      }}
                    >
                      Newest First
                    </button>
                    <button
                      className={`px-4 py-2 text-sm w-full text-left hover:bg-gray-800 ${
                        sortOrder === 'oldest' ? 'text-amber-500' : 'text-white'
                      }`}
                      onClick={() => {
                        setSortOrder('oldest');
                        setIsSortOpen(false);
                      }}
                    >
                      Oldest First
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-5">
          {filteredOrders.length === 0 ? (
            <div className="bg-black border border-gray-800 rounded-xl p-10 text-center">
              <div className="mx-auto w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <Search size={24} className="text-gray-500" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">
                No orders found
              </h3>
              <p className="text-gray-400 mb-6">
                {"  We couldn't find any orders matching your search criteria."}
              </p>
              <button
                className="bg-amber-500 hover:bg-amber-600 text-black font-medium py-2 px-4 rounded-lg text-sm"
                onClick={() => {
                  setSearchQuery('');
                  setFilterStatus('all');
                  setSortOrder('newest');
                }}
              >
                Clear filters
              </button>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div
                key={order.id}
                className={`bg-black border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition-colors ${
                  order.id === 'ORD-001' ? 'ring-1 ring-amber-500/30' : ''
                }`}
              >
                {/* Order Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between px-5 py-4 border-b border-gray-800 gap-3">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-amber-500">{order.id}</span>
                    <div className="h-4 w-px bg-gray-700"></div>
                    <span className="text-sm flex items-center text-gray-400">
                      <CalendarIcon size={14} className="mr-1.5" /> {order.date}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(order.status)}
                    <button className="p-1.5 rounded-full hover:bg-gray-800 text-gray-400">
                      <MoreVertical size={16} />
                    </button>
                  </div>
                </div>

                {/* Order Content */}
                <div className="p-5">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Left Column: Customer Info */}
                    <div className="flex-1 space-y-4">
                      <div>
                        <h3 className="font-medium text-gray-400 mb-2 text-sm">
                          Customer Details
                        </h3>
                        <div className="bg-gray-900 rounded-lg p-4 space-y-3">
                          <div className="flex items-start">
                            <User
                              size={16}
                              className="text-gray-400 mr-3 mt-1"
                            />
                            <div>
                              <p className="font-medium text-white">
                                {order.customerName}
                              </p>
                            </div>
                          </div>

                          {order.customerPhone && (
                            <div className="flex items-start">
                              <Phone
                                size={16}
                                className="text-gray-400 mr-3 mt-1"
                              />
                              <p className="text-gray-300">
                                {order.customerPhone}
                              </p>
                            </div>
                          )}

                          {order.customerAddress && (
                            <div className="flex items-start">
                              <MapPin
                                size={16}
                                className="text-gray-400 mr-3 mt-1"
                              />
                              <p className="text-gray-300">
                                {order.customerAddress}
                              </p>
                            </div>
                          )}

                          {order.paymentMethod && (
                            <div className="flex items-start">
                              <Banknote
                                size={16}
                                className="text-gray-400 mr-3 mt-1"
                              />
                              <p className="text-gray-300">
                                {order.paymentMethod}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Order Items */}
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-400 mb-2 text-sm">
                        Order Items
                      </h3>
                      <div className="bg-gray-900 rounded-lg overflow-hidden">
                        <div className="divide-y divide-gray-800">
                          {order.items.map((item, index) => (
                            <div
                              key={index}
                              className="flex justify-between items-center p-4"
                            >
                              <div className="flex items-center">
                                <div className="h-10 w-10 bg-gray-800 rounded flex items-center justify-center mr-3">
                                  <span className="text-amber-500 font-medium text-xs">
                                    {item.quantity}x
                                  </span>
                                </div>
                                <span className="text-white">{item.name}</span>
                              </div>
                              <span className="text-amber-500 font-medium">
                                Rp
                                {(item.price * item.quantity).toLocaleString()}
                              </span>
                            </div>
                          ))}
                        </div>
                        <div className="border-t border-gray-800 p-4 flex justify-between items-center bg-gray-900/50">
                          <span className="font-medium text-white">Total</span>
                          <span className="text-lg font-bold text-amber-500">
                            Rp{order.total.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Footer */}
                <div className="bg-gray-900/30 px-5 py-4 flex flex-col sm:flex-row justify-between gap-4 border-t border-gray-800">
                  {order.id === 'ORD-001' && (
                    <div className="flex flex-wrap gap-2">
                      <button className="bg-amber-500 hover:bg-amber-600 text-black px-4 py-2 rounded-lg text-sm font-medium">
                        Accept Order
                      </button>
                      <button className="bg-transparent hover:bg-gray-800 text-white border border-gray-700 px-4 py-2 rounded-lg text-sm">
                        Reject Order
                      </button>
                    </div>
                  )}
                  {order.status === 'processing' && (
                    <div className="flex flex-wrap gap-2">
                      <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
                        Mark as Delivered
                      </button>
                    </div>
                  )}
                  {order.status === 'pending' && order.id !== 'ORD-001' && (
                    <div className="flex flex-wrap gap-2">
                      <button className="bg-amber-500 hover:bg-amber-600 text-black px-4 py-2 rounded-lg text-sm font-medium">
                        Process Order
                      </button>
                    </div>
                  )}
                  {order.status === 'completed' ||
                  order.status === 'delivered' ||
                  order.status === 'cancelled' ? (
                    <div className="flex flex-wrap gap-2">
                      <button className="bg-transparent hover:bg-gray-800 text-white border border-gray-700 px-4 py-2 rounded-lg text-sm">
                        View Details
                      </button>
                    </div>
                  ) : null}
                  <div className="text-sm text-gray-400 flex items-center">
                    Order placed on {order.date}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
