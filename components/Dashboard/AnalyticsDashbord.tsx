'use client';

import React, { useState, useEffect } from 'react';
import {
  ShoppingCart,
  DollarSign,
  Package,
  Calendar,
  BarChart3,
  RefreshCw,
  Download,
  ChevronDown,
  Clock,
  CheckCircle,
  XCircle,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import {
  XAxis,
  YAxis,
  Pie,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Cell,
  Area,
  AreaChart,
} from 'recharts';
import { toast } from 'react-hot-toast';
import Image from 'next/image';

interface AnalyticsData {
  summary: {
    totalOrders: number;
    completedOrders: number;
    processingOrders: number;
    cancelledOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
    revenueChange: number;
    ordersChange: number;
  };
  charts: {
    dailySales: Array<{
      date: string;
      orders: number;
      revenue: number;
    }>;
    dailyRevenue: Array<{
      date: string;
      revenue: number;
    }>;
  };
  topMeals: Array<{
    meal: {
      _id: string;
      name: string;
      price: number;
      image?: string[];
    };
    quantity: number;
    revenue: number;
    orders: number;
  }>;
  recentOrders: Array<any>;
  period: number;
}

export default function SellerAnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('30');
  const [isPeriodOpen, setIsPeriodOpen] = useState(false);
  const [activeChart, setActiveChart] = useState<'sales' | 'revenue'>('sales');

  const periodOptions = [
    { value: '7', label: 'Last 7 Days' },
    { value: '30', label: 'Last 30 Days' },
    { value: '90', label: 'Last 3 Months' },
    { value: '365', label: 'Last Year' },
  ];

  // Fetch analytics data
  const fetchAnalytics = async (showRefreshToast = false) => {
    try {
      if (showRefreshToast) setRefreshing(true);

      const response = await fetch(
        `/api/analytics/seller?period=${selectedPeriod}`
      );
      if (response.ok) {
        const data = await response.json();
        setAnalyticsData(data);

        if (showRefreshToast) {
          toast.success('Analytics data refreshed');
        }
      } else {
        toast.error('Failed to fetch analytics data');
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Error loading analytics data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [selectedPeriod]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <span className="flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-green-900/40 text-green-300">
            <CheckCircle size={12} /> Completed
          </span>
        );
      case 'processing':
      case 'awaiting_payment':
        return (
          <span className="flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-amber-900/40 text-amber-300">
            <Clock size={12} /> Processing
          </span>
        );
      case 'cancelled':
        return (
          <span className="flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-red-900/40 text-red-300">
            <XCircle size={12} /> Cancelled
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 rounded-full text-xs bg-gray-900 text-gray-300">
            {status}
          </span>
        );
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-950">
        <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
          </div>
        </div>
      </main>
    );
  }

  if (!analyticsData) {
    return (
      <main className="min-h-screen bg-gray-950">
        <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-white mb-2">
              No Analytics Data
            </h1>
            <p className="text-gray-400 mb-6">Unable to load analytics data.</p>
            <button
              onClick={() => fetchAnalytics()}
              className="bg-amber-500 hover:bg-amber-600 text-black px-6 py-3 rounded-lg font-medium"
            >
              Try Again
            </button>
          </div>
        </div>
      </main>
    );
  }

  const { summary, charts, topMeals, recentOrders } = analyticsData;

  const pieData = [
    { name: 'Completed', value: summary.completedOrders, color: '#10B981' },
    { name: 'Processing', value: summary.processingOrders, color: '#F59E0B' },
    { name: 'Cancelled', value: summary.cancelledOrders, color: '#EF4444' },
  ];

  return (
    <main className="min-h-screen ">
      <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Sales Analytics</h1>
            <p className="text-gray-400">
              Track your sales performance and revenue insights
            </p>
          </div>
          <div className="flex items-center space-x-3">
            {/* Period Filter */}
            <div className="relative">
              <button
                className="flex items-center justify-between bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 min-w-[140px]"
                onClick={() => setIsPeriodOpen(!isPeriodOpen)}
              >
                <div className="flex items-center">
                  <Calendar size={16} className="mr-2 text-gray-400" />
                  <span className="text-sm text-white">
                    {
                      periodOptions.find((p) => p.value === selectedPeriod)
                        ?.label
                    }
                  </span>
                </div>
                <ChevronDown size={16} className="ml-2 text-gray-400" />
              </button>

              {isPeriodOpen && (
                <div className="absolute z-10 mt-1 w-full bg-gray-900 border border-gray-700 rounded-lg shadow-lg py-1">
                  {periodOptions.map((option) => (
                    <button
                      key={option.value}
                      className={`px-4 py-2 text-sm w-full text-left hover:bg-gray-800 ${
                        selectedPeriod === option.value
                          ? 'text-amber-500'
                          : 'text-white'
                      }`}
                      onClick={() => {
                        setSelectedPeriod(option.value);
                        setIsPeriodOpen(false);
                      }}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => fetchAnalytics(true)}
              disabled={refreshing}
              className="flex items-center space-x-2 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <RefreshCw
                size={16}
                className={refreshing ? 'animate-spin' : ''}
              />
              <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
            </button>

            <button className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg">
              <Download size={16} />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-black border border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <ShoppingCart size={24} className="text-blue-400" />
              </div>
              <div
                className={`flex items-center space-x-1 text-sm ${
                  summary.ordersChange >= 0 ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {summary.ordersChange >= 0 ? (
                  <ArrowUpRight size={16} />
                ) : (
                  <ArrowDownRight size={16} />
                )}
                <span>{Math.abs(summary.ordersChange).toFixed(1)}%</span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-white">
                {summary.totalOrders}
              </p>
              <p className="text-gray-400 text-sm">Total Orders</p>
            </div>
          </div>

          <div className="bg-black border border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <DollarSign size={24} className="text-green-400" />
              </div>
              <div
                className={`flex items-center space-x-1 text-sm ${
                  summary.revenueChange >= 0 ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {summary.revenueChange >= 0 ? (
                  <ArrowUpRight size={16} />
                ) : (
                  <ArrowDownRight size={16} />
                )}
                <span>{Math.abs(summary.revenueChange).toFixed(1)}%</span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-white">
                {formatCurrency(summary.totalRevenue)}
              </p>
              <p className="text-gray-400 text-sm">Total Revenue</p>
            </div>
          </div>

          <div className="bg-black border border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-amber-500/20 rounded-lg">
                <BarChart3 size={24} className="text-amber-400" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-white">
                {formatCurrency(summary.averageOrderValue)}
              </p>
              <p className="text-gray-400 text-sm">Average Order Value</p>
            </div>
          </div>

          <div className="bg-black border border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <CheckCircle size={24} className="text-purple-400" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-white">
                {summary.completedOrders}
              </p>
              <p className="text-gray-400 text-sm">Completed Orders</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Sales Chart */}
          <div className="lg:col-span-2 bg-black border border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Sales Trends</h2>
              <div className="flex bg-gray-800 rounded-lg p-1">
                <button
                  onClick={() => setActiveChart('sales')}
                  className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                    activeChart === 'sales'
                      ? 'bg-amber-500 text-black'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Orders
                </button>
                <button
                  onClick={() => setActiveChart('revenue')}
                  className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                    activeChart === 'revenue'
                      ? 'bg-amber-500 text-black'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Revenue
                </button>
              </div>
            </div>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                {activeChart === 'sales' ? (
                  <AreaChart data={charts.dailySales}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis
                      dataKey="date"
                      stroke="#9CA3AF"
                      fontSize={12}
                      tickFormatter={formatDate}
                    />
                    <YAxis stroke="#9CA3AF" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#F3F4F6',
                      }}
                      labelFormatter={(label) => formatDate(label)}
                    />
                    <Area
                      type="monotone"
                      dataKey="orders"
                      stroke="#F59E0B"
                      fill="#F59E0B"
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                  </AreaChart>
                ) : (
                  <AreaChart data={charts.dailyRevenue}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis
                      dataKey="date"
                      stroke="#9CA3AF"
                      fontSize={12}
                      tickFormatter={formatDate}
                    />
                    <YAxis
                      stroke="#9CA3AF"
                      fontSize={12}
                      tickFormatter={(value) => `${value / 1000}k`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#F3F4F6',
                      }}
                      labelFormatter={(label) => formatDate(label)}
                      formatter={(value: number) => [
                        formatCurrency(value),
                        'Revenue',
                      ]}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#10B981"
                      fill="#10B981"
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                  </AreaChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>

          {/* Order Status Distribution */}
          <div className="bg-black border border-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">Order Status</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#F3F4F6',
                    }}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-4">
              {pieData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-gray-300 text-sm">{item.name}</span>
                  </div>
                  <span className="text-white font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Selling Meals */}
          <div className="bg-black border border-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">
              Top Selling Meals
            </h2>
            <div className="space-y-4">
              {topMeals.length === 0 ? (
                <p className="text-gray-400 text-center py-8">
                  No sales data available
                </p>
              ) : (
                topMeals.map((item, index) => (
                  <div
                    key={item.meal._id}
                    className="flex items-center space-x-4 p-3 bg-gray-900 rounded-lg"
                  >
                    <div className="flex-shrink-0">
                      <span className="text-lg font-bold text-amber-500">
                        #{index + 1}
                      </span>
                    </div>
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-800">
                      {item.meal.image && item.meal.image.length > 0 ? (
                        <Image
                          src={item.meal.image[0]}
                          alt={item.meal.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package size={16} className="text-gray-500" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-white">
                        {item.meal.name}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        {item.quantity} sold • {item.orders} orders
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-400">
                        {formatCurrency(item.revenue)}
                      </p>
                      <p className="text-gray-400 text-xs">Revenue</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-black border border-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">Recent Orders</h2>
            <div className="space-y-4">
              {recentOrders.length === 0 ? (
                <p className="text-gray-400 text-center py-8">
                  No recent orders
                </p>
              ) : (
                recentOrders.map((order) => (
                  <div
                    key={order._id}
                    className="flex items-center justify-between p-3 bg-gray-900 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-white">
                          ORD-{order._id.slice(-8).toUpperCase()}
                        </span>
                        {getStatusBadge(order.status)}
                      </div>
                      <p className="text-gray-400 text-sm">
                        {order.meal?.name} • {order.quantity}x
                      </p>
                      <p className="text-gray-500 text-xs">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-white">
                        {formatCurrency(order.totalPrice)}
                      </p>
                      <button className="text-amber-400 hover:text-amber-300 text-sm">
                        View Details
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
