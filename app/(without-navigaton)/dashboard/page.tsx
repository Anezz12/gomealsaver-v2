'use client';
import React, { useState, useEffect } from 'react';
import {
  Menu,
  ShoppingBag,
  Settings,
  LogOut,
  Bell,
  Package,
  TrendingUp,
  Clock,
  CreditCard,
  ChevronLeft,
  X,
  MoreVertical,
  User,
} from 'lucide-react';
import Image from 'next/image';
// import { usePathname } from 'next/navigation';

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

interface Order {
  id: string;
  customerName: string;
  items: {
    id: string;
    name: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  status: 'pending' | 'processing' | 'completed';
  date: string;
}

const SellerDashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Detect mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Mock data for demonstration
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
  ];

  const orders: Order[] = [
    {
      id: 'ORD-001',
      customerName: 'Budi Santoso',
      items: [{ id: '1', name: 'Nasi Goreng', quantity: 2, price: 15000 }],
      total: 30000,
      status: 'pending',
      date: '2025-04-03',
    },
    {
      id: 'ORD-002',
      customerName: 'Siti Rahayu',
      items: [{ id: '2', name: 'Roti Bakar', quantity: 3, price: 8000 }],
      total: 24000,
      status: 'completed',
      date: '2025-04-02',
    },
  ];

  // Stats for overview
  const stats = {
    revenue: 540000,
    orders: 15,
    pendingOrders: 3,
    foodSaved: 25,
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-900 text-white">
      {/* Mobile Header */}
      {isMobile && (
        <header className="sticky top-0 z-20 bg-black border-b border-gray-800 px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-800"
          >
            <Menu size={22} />
          </button>
          <h1 className="text-xl font-bold text-amber-500">GoMealSaver</h1>
          <div className="flex items-center gap-3">
            <button className="relative text-gray-300 hover:text-amber-500">
              <Bell size={20} />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-amber-500"></span>
            </button>
            <button className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
              <User size={18} className="text-gray-300" />
            </button>
          </div>
        </header>
      )}

      {/* Mobile Menu Overlay */}
      {isMobile && mobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-80"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="w-64 h-full bg-gray-900 p-4 animate-slide-in-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-amber-500">Dashboard</h2>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-full hover:bg-gray-800"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex flex-col space-y-1">
              <div className="flex items-center space-x-3 p-3 mb-4 bg-gray-800 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center">
                  <span className="font-bold text-black">RB</span>
                </div>
                <div>
                  <p className="font-medium">Restoran Bahagia</p>
                  <p className="text-sm text-gray-400">Lihat profil</p>
                </div>
              </div>

              <button
                onClick={() => {
                  setActiveTab('overview');
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center py-3 px-4 rounded-lg ${
                  activeTab === 'overview'
                    ? 'bg-amber-500 text-black'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                <TrendingUp size={20} className="mr-3" />
                <span>Ikhtisar</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('products');
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center py-3 px-4 rounded-lg ${
                  activeTab === 'products'
                    ? 'bg-amber-500 text-black'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                <ShoppingBag size={20} className="mr-3" />
                <span>Produk</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('orders');
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center py-3 px-4 rounded-lg ${
                  activeTab === 'orders'
                    ? 'bg-amber-500 text-black'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                <Package size={20} className="mr-3" />
                <span>Pesanan</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('settings');
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center py-3 px-4 rounded-lg ${
                  activeTab === 'settings'
                    ? 'bg-amber-500 text-black'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                <Settings size={20} className="mr-3" />
                <span>Pengaturan</span>
              </button>

              <div className="mt-auto pt-6">
                <button className="flex items-center py-3 px-4 text-gray-300 hover:bg-gray-800 w-full rounded-lg">
                  <LogOut size={20} className="mr-3" />
                  <span>Keluar</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      {!isMobile && (
        <aside
          className={`${
            sidebarOpen ? 'w-64' : 'w-20'
          } bg-black transition-all duration-300 flex flex-col sticky top-0 h-screen`}
        >
          <div className="p-4 flex items-center justify-between">
            {sidebarOpen ? (
              <h1 className="text-amber-500 font-bold text-xl">GoMealSaver</h1>
            ) : (
              <h1 className="text-amber-500 font-bold text-xl">GS</h1>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-amber-500 hover:bg-gray-800 rounded-full p-1"
            >
              {sidebarOpen ? <ChevronLeft size={24} /> : <Menu size={24} />}
            </button>
          </div>

          <div className="flex flex-col flex-1 mt-6 px-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center py-3 px-4 rounded-lg mb-1 ${
                activeTab === 'overview'
                  ? 'bg-amber-500 text-black'
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              <TrendingUp size={20} className={sidebarOpen ? 'mr-3' : ''} />
              {sidebarOpen && <span>Ikhtisar</span>}
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`flex items-center py-3 px-4 rounded-lg mb-1 ${
                activeTab === 'products'
                  ? 'bg-amber-500 text-black'
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              <ShoppingBag size={20} className={sidebarOpen ? 'mr-3' : ''} />
              {sidebarOpen && <span>Produk</span>}
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`flex items-center py-3 px-4 rounded-lg mb-1 ${
                activeTab === 'orders'
                  ? 'bg-amber-500 text-black'
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              <Package size={20} className={sidebarOpen ? 'mr-3' : ''} />
              {sidebarOpen && <span>Pesanan</span>}
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center py-3 px-4 rounded-lg mb-1 ${
                activeTab === 'settings'
                  ? 'bg-amber-500 text-black'
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              <Settings size={20} className={sidebarOpen ? 'mr-3' : ''} />
              {sidebarOpen && <span>Pengaturan</span>}
            </button>
          </div>

          <div className="mt-auto mb-4 px-2">
            <button className="flex items-center py-3 px-4 text-gray-300 hover:bg-gray-800 w-full rounded-lg">
              <LogOut size={20} className={sidebarOpen ? 'mr-3' : ''} />
              {sidebarOpen && <span>Keluar</span>}
            </button>
          </div>
        </aside>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navigation - Desktop Only */}
        {!isMobile && (
          <header className="bg-black border-b border-gray-800 py-4 px-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Dashboard Penjual</h2>

            <div className="flex items-center space-x-4">
              <button className="relative text-gray-300 hover:text-amber-500">
                <Bell size={20} />
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-amber-500"></span>
              </button>

              <div className="flex items-center">
                <div className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center mr-2">
                  <span className="font-semibold text-amber-500">RB</span>
                </div>
                <div className="ml-1">
                  <span className="text-sm font-medium">Restoran Bahagia</span>
                </div>
              </div>
            </div>
          </header>
        )}

        {/* Dashboard content */}
        <main className="flex-1 overflow-y-auto bg-gray-900 p-4 lg:p-6">
          {/* Current tab title - Mobile only */}
          {isMobile && (
            <h2 className="text-xl font-bold mb-4 mt-2">
              {activeTab === 'overview' && 'Ikhtisar'}
              {activeTab === 'products' && 'Produk'}
              {activeTab === 'orders' && 'Pesanan'}
              {activeTab === 'settings' && 'Pengaturan'}
            </h2>
          )}

          {activeTab === 'overview' && (
            <div>
              {!isMobile && (
                <h2 className="text-2xl font-bold mb-6">Ikhtisar</h2>
              )}

              {/* Stats grid - Responsive */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-black rounded-xl p-5 border border-gray-800 hover:border-gray-700 transition-all">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Pendapatan Total</p>
                      <h3 className="text-xl lg:text-2xl font-bold mt-1">
                        Rp{stats.revenue.toLocaleString()}
                      </h3>
                    </div>
                    <div className="bg-amber-500 bg-opacity-20 p-3 rounded-full">
                      <CreditCard size={22} className="text-amber-500" />
                    </div>
                  </div>
                </div>

                <div className="bg-black rounded-xl p-5 border border-gray-800 hover:border-gray-700 transition-all">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total Pesanan</p>
                      <h3 className="text-xl lg:text-2xl font-bold mt-1">
                        {stats.orders}
                      </h3>
                    </div>
                    <div className="bg-amber-500 bg-opacity-20 p-3 rounded-full">
                      <ShoppingBag size={22} className="text-amber-500" />
                    </div>
                  </div>
                </div>

                <div className="bg-black rounded-xl p-5 border border-gray-800 hover:border-gray-700 transition-all">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Pesanan Tertunda</p>
                      <h3 className="text-xl lg:text-2xl font-bold mt-1">
                        {stats.pendingOrders}
                      </h3>
                    </div>
                    <div className="bg-amber-500 bg-opacity-20 p-3 rounded-full">
                      <Clock size={22} className="text-amber-500" />
                    </div>
                  </div>
                </div>

                <div className="bg-black rounded-xl p-5 border border-gray-800 hover:border-gray-700 transition-all">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">
                        Makanan Terselamatkan
                      </p>
                      <h3 className="text-xl lg:text-2xl font-bold mt-1">
                        {stats.foodSaved} porsi
                      </h3>
                    </div>
                    <div className="bg-amber-500 bg-opacity-20 p-3 rounded-full">
                      <Package size={22} className="text-amber-500" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent orders - More mobile friendly */}
              <div className="bg-black rounded-xl border border-gray-800 overflow-hidden">
                <div className="p-4 lg:p-5 border-b border-gray-800 flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Pesanan Terbaru</h3>
                  <button className="text-sm text-amber-500 hover:text-amber-400 font-medium">
                    Lihat Semua
                  </button>
                </div>

                {/* Desktop table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-gray-400 border-b border-gray-800">
                        <th className="px-5 py-3">ID Pesanan</th>
                        <th className="px-5 py-3">Pelanggan</th>
                        <th className="px-5 py-3">Total</th>
                        <th className="px-5 py-3">Status</th>
                        <th className="px-5 py-3">Tanggal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr
                          key={order.id}
                          className="border-b border-gray-800 hover:bg-gray-900/50"
                        >
                          <td className="px-5 py-4">{order.id}</td>
                          <td className="px-5 py-4">{order.customerName}</td>
                          <td className="px-5 py-4">
                            Rp{order.total.toLocaleString()}
                          </td>
                          <td className="px-5 py-4">
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                order.status === 'completed'
                                  ? 'bg-green-900 text-green-300'
                                  : order.status === 'processing'
                                  ? 'bg-blue-900 text-blue-300'
                                  : 'bg-amber-900 text-amber-300'
                              }`}
                            >
                              {order.status === 'completed'
                                ? 'Selesai'
                                : order.status === 'processing'
                                ? 'Diproses'
                                : 'Menunggu'}
                            </span>
                          </td>
                          <td className="px-5 py-4">{order.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile cards */}
                <div className="md:hidden">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="p-4 border-b border-gray-800"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">
                          {order.customerName}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            order.status === 'completed'
                              ? 'bg-green-900 text-green-300'
                              : order.status === 'processing'
                              ? 'bg-blue-900 text-blue-300'
                              : 'bg-amber-900 text-amber-300'
                          }`}
                        >
                          {order.status === 'completed'
                            ? 'Selesai'
                            : order.status === 'processing'
                            ? 'Diproses'
                            : 'Menunggu'}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-400">
                        <span>{order.id}</span>
                        <span>{order.date}</span>
                      </div>
                      <div className="mt-2 font-medium text-amber-500">
                        Rp{order.total.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div>
              <div className="flex justify-between items-center mb-5">
                {!isMobile && <h2 className="text-2xl font-bold">Produk</h2>}
                <button className="ml-auto bg-amber-500 hover:bg-amber-600 text-black font-medium py-2 px-4 rounded-lg text-sm">
                  + Tambah Produk
                </button>
              </div>

              {/* Desktop table */}
              <div className="hidden md:block bg-black rounded-xl border border-gray-800 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-gray-400 border-b border-gray-800">
                        <th className="p-4">Produk</th>
                        <th className="p-4">Harga</th>
                        <th className="p-4">Qty</th>
                        <th className="p-4">Kadaluarsa</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {foodItems.map((item) => (
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
                              className={`px-2 py-1 rounded-full text-xs ${
                                item.status === 'available'
                                  ? 'bg-green-900 text-green-300'
                                  : item.status === 'pending'
                                  ? 'bg-amber-900 text-amber-300'
                                  : 'bg-gray-900 text-gray-300'
                              }`}
                            >
                              {item.status === 'available'
                                ? 'Tersedia'
                                : item.status === 'pending'
                                ? 'Dipesan'
                                : 'Terjual'}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex space-x-2">
                              <button className="p-1 text-gray-400 hover:text-amber-500">
                                <Settings size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile product cards */}
              <div className="md:hidden space-y-3">
                {foodItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-black border border-gray-800 rounded-xl overflow-hidden"
                  >
                    <div className="flex items-start p-3">
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
                          <button className="p-1 text-gray-400">
                            <MoreVertical size={18} />
                          </button>
                        </div>
                        <div className="flex items-end mt-1">
                          <span className="text-amber-500 font-medium">
                            Rp{item.price.toLocaleString()}
                          </span>
                          <span className="text-xs text-gray-500 line-through ml-2">
                            Rp{item.originalPrice.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between mt-2">
                          <div className="text-xs text-gray-400">
                            Stok: {item.quantity} • Exp: {item.expiryDate}
                          </div>
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs ${
                              item.status === 'available'
                                ? 'bg-green-900 text-green-300'
                                : item.status === 'pending'
                                ? 'bg-amber-900 text-amber-300'
                                : 'bg-gray-900 text-gray-300'
                            }`}
                          >
                            {item.status === 'available'
                              ? 'Tersedia'
                              : item.status === 'pending'
                              ? 'Dipesan'
                              : 'Terjual'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab === 'orders' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Pesanan</h2>

              <div className="bg-black rounded-lg border border-gray-800 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-gray-400 border-b border-gray-800">
                        <th className="p-4">ID Pesanan</th>
                        <th className="p-4">Pelanggan</th>
                        <th className="p-4">Item</th>
                        <th className="p-4">Total</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Tanggal</th>
                        <th className="p-4">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order.id} className="border-b border-gray-800">
                          <td className="p-4">{order.id}</td>
                          <td className="p-4">{order.customerName}</td>
                          <td className="p-4">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="text-sm">
                                {item.quantity}x {item.name}
                              </div>
                            ))}
                          </td>
                          <td className="p-4">
                            Rp{order.total.toLocaleString()}
                          </td>
                          <td className="p-4">
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                order.status === 'completed'
                                  ? 'bg-green-900 text-green-300'
                                  : order.status === 'processing'
                                  ? 'bg-blue-900 text-blue-300'
                                  : 'bg-amber-900 text-amber-300'
                              }`}
                            >
                              {order.status === 'completed'
                                ? 'Selesai'
                                : order.status === 'processing'
                                ? 'Diproses'
                                : 'Menunggu'}
                            </span>
                          </td>
                          <td className="p-4">{order.date}</td>
                          <td className="p-4">
                            <button className="p-1 text-gray-400 hover:text-amber-500">
                              <Settings size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Pengaturan</h2>

              <div className="bg-black rounded-lg border border-gray-800 p-6">
                <h3 className="text-xl font-semibold mb-4">Profil Restoran</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-400 mb-1">
                      Nama Restoran
                    </label>
                    <input
                      type="text"
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2"
                      defaultValue="Restoran Bahagia"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 mb-1">Alamat</label>
                    <textarea
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2"
                      rows={3}
                      defaultValue="Jl. Merdeka No. 123, Jakarta"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 mb-1">
                      Nomor Telepon
                    </label>
                    <input
                      type="text"
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2"
                      defaultValue="0812-3456-7890"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 mb-1">Email</label>
                    <input
                      type="email"
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2"
                      defaultValue="info@restoranbahagia.com"
                    />
                  </div>

                  <div className="pt-4">
                    <button className="bg-amber-500 hover:bg-amber-600 text-black font-medium py-2 px-4 rounded-lg">
                      Simpan Perubahan
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Add these styles to your global CSS */}
      <style jsx global>{`
        @keyframes slide-in-left {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }

        .animate-slide-in-left {
          animation: slide-in-left 0.3s forwards;
        }

        /* For smoother scrolling */
        html,
        body {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
};

export default SellerDashboard;
