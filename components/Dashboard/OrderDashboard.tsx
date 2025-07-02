'use client';

import React, { useState, useEffect } from 'react';
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
  RefreshCw,
  DollarSign,
} from 'lucide-react';
import CheckPaymentButton from '@/components/Orders/CheckPaymentButton';
import { toast } from 'react-hot-toast';
import Swal from 'sweetalert2';

interface Order {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  meal: {
    _id: string;
    title: string;
    price: number;
    images: string[];
  };
  quantity: number;
  totalPrice: number;
  status:
    | 'pending'
    | 'awaiting_payment'
    | 'confirmed'
    | 'in_progress'
    | 'processing'
    | 'ready'
    | 'completed'
    | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'expired' | 'cancelled';
  paymentMethod?: string;
  orderType: 'pickup' | 'delivery';
  specialInstructions?: string;
  midtransOrderId?: string;
  midtransTransactionId?: string;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
}

export default function OrderDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [acceptingPayment, setAcceptingPayment] = useState<string | null>(null);

  // Fetch orders from API
  const fetchOrders = async (showRefreshToast = false) => {
    try {
      if (showRefreshToast) setRefreshing(true);

      const response = await fetch('/api/orders/seller');
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);

        if (showRefreshToast) {
          toast.success('Orders refreshed successfully');
        }
      } else {
        console.error('Failed to fetch orders');
        toast.error('Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Error fetching orders');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Convert database status to display status
  const getDisplayStatus = (order: Order) => {
    // COD Orders
    if (order.paymentMethod === 'cash_on_delivery') {
      if (order.status === 'pending' && order.paymentStatus === 'pending') {
        return 'pending_cod'; // New COD order
      } else if (
        order.status === 'confirmed' &&
        order.paymentStatus === 'pending'
      ) {
        return 'confirmed_cod'; // COD order confirmed but payment not received
      } else if (
        order.status === 'processing' &&
        order.paymentStatus === 'paid'
      ) {
        return 'processing'; // COD paid, in processing
      } else if (
        order.status === 'completed' &&
        order.paymentStatus === 'paid'
      ) {
        return 'completed'; // COD completed
      }
    }

    // Online Payment Orders
    if (order.paymentStatus === 'paid' && order.status === 'processing') {
      return 'processing';
    } else if (order.paymentStatus === 'paid' && order.status === 'completed') {
      return 'completed';
    } else if (
      order.status === 'cancelled' ||
      order.paymentStatus === 'failed'
    ) {
      return 'cancelled';
    } else if (
      order.status === 'awaiting_payment' ||
      (order.paymentStatus === 'pending' &&
        order.paymentMethod !== 'cash_on_delivery')
    ) {
      return 'pending';
    } else {
      return order.status;
    }
  };

  // Filter and sort orders
  const filteredOrders = orders
    .filter((order) => {
      // Filter by search query (order ID or customer name)
      const orderIdDisplay = `ORD-${order._id.slice(-8).toUpperCase()}`;
      const matchesSearch =
        orderIdDisplay.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.meal.title.toLowerCase().includes(searchQuery.toLowerCase());

      // Filter by status
      const displayStatus = getDisplayStatus(order);
      let matchesStatus = filterStatus === 'all';

      if (filterStatus === 'pending') {
        matchesStatus =
          displayStatus === 'pending' || displayStatus === 'pending_cod';
      } else if (filterStatus === 'confirmed') {
        matchesStatus = displayStatus === 'confirmed_cod';
      } else if (filterStatus !== 'all') {
        matchesStatus = displayStatus === filterStatus;
      }

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      // Sort by date
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

  const getStatusBadge = (order: Order) => {
    const displayStatus = getDisplayStatus(order);

    switch (displayStatus) {
      case 'pending':
        return (
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-amber-900/40 text-amber-300">
            <Clock size={12} /> Pending Payment
          </span>
        );
      case 'pending_cod':
        return (
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-orange-900/40 text-orange-300 animate-pulse">
            <DollarSign size={12} /> New COD Order
          </span>
        );
      case 'confirmed_cod':
        return (
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-purple-900/40 text-purple-300">
            <Clock size={12} /> Awaiting COD Payment
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
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs bg-gray-900 text-gray-300">
            {displayStatus}
          </span>
        );
    }
  };

  // Handle order status update
  const handleOrderStatusUpdate = async (
    orderId: string,
    newStatus: string
  ) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/update-status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        toast.success(`Order ${newStatus} successfully`);
        fetchOrders(); // Refresh orders
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Error updating order status');
    }
  };

  // ✅ Handle COD Payment Acceptance
  const handleAcceptCODPayment = async (orderId: string, notes?: string) => {
    try {
      setAcceptingPayment(orderId);

      console.log('💰 [DASHBOARD] Accepting COD payment for order:', orderId);

      const response = await fetch(
        `/api/orders/${orderId}/accept-cod-payment`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            notes: notes || '',
            paymentReceivedAt: new Date().toISOString(),
          }),
        }
      );

      const data = await response.json();
      console.log('📥 [DASHBOARD] COD acceptance response:', data);

      if (response.ok) {
        toast.success(data.message || 'COD payment accepted successfully!');

        // Show detailed success info
        if (data.changes) {
          console.log('✅ [DASHBOARD] Order status updated:', data.changes);
        }

        fetchOrders(); // Refresh orders list
      } else {
        console.error('❌ [DASHBOARD] COD acceptance failed:', data);

        // More specific error messages
        if (response.status === 400) {
          toast.error(
            data.details ||
              data.error ||
              'Invalid order state for payment acceptance'
          );
        } else if (response.status === 403) {
          toast.error(
            'You are not authorized to accept payment for this order'
          );
        } else {
          toast.error(data.error || 'Failed to accept COD payment');
        }
      }
    } catch (error) {
      console.error(
        '❌ [DASHBOARD] Network error accepting COD payment:',
        error
      );
      toast.error('Network error - please try again');
    } finally {
      setAcceptingPayment(null);
    }
  };

  // ✅ Add optional notes dialog for COD payment acceptance
  const handleAcceptCODPaymentWithNotes = async (orderId: string) => {
    const { value: notes } = await Swal.fire({
      title: 'Accept COD Payment',
      input: 'textarea',
      inputLabel: 'Payment Notes (Optional)',
      inputPlaceholder: 'Any notes about the payment received...',
      showCancelButton: true,
      confirmButtonText: 'Accept Payment',
      confirmButtonColor: '#f59e0b',
      cancelButtonColor: '#6b7280',
      background: 'rgb(17 24 39)',
      color: 'rgb(243 244 246)',
      inputAttributes: {
        'aria-label': 'Payment notes',
      },
    });

    if (notes !== undefined) {
      // User clicked confirm (even with empty notes)
      await handleAcceptCODPayment(orderId, notes);
    }
  };

  // ✅ Handle COD Order Confirmation (TAMBAHAN BARU)
  const handleConfirmCODOrder = async (orderId: string) => {
    try {
      setAcceptingPayment(orderId);

      console.log('✅ [DASHBOARD] Confirming COD order:', orderId);

      const response = await fetch(`/api/orders/${orderId}/confirm-cod`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          confirmationNotes: 'Order confirmed by seller',
          confirmedAt: new Date().toISOString(),
        }),
      });

      const data = await response.json();
      console.log('📥 [DASHBOARD] COD confirmation response:', data);

      if (response.ok) {
        toast.success(data.message || 'COD order confirmed successfully!');

        // Show stock reservation info if available
        if (data.stockReservation) {
          console.log('📦 [DASHBOARD] Stock reserved:', data.stockReservation);
        }

        fetchOrders(); // Refresh orders list
      } else {
        console.error('❌ [DASHBOARD] COD confirmation failed:', data);

        if (response.status === 400) {
          toast.error(data.error || 'Invalid order state for confirmation');
        } else if (response.status === 403) {
          toast.error('You are not authorized to confirm this order');
        } else {
          toast.error(data.error || 'Failed to confirm COD order');
        }
      }
    } catch (error) {
      console.error(
        '❌ [DASHBOARD] Network error confirming COD order:',
        error
      );
      toast.error('Network error - please try again');
    } finally {
      setAcceptingPayment(null);
    }
  };

  // ✅ Handle COD Order Rejection (TAMBAHAN BARU)
  const handleRejectCODOrder = async (orderId: string) => {
    const { value: rejectionReason } = await Swal.fire({
      title: 'Reject COD Order',
      input: 'textarea',
      inputLabel: 'Rejection Reason (Optional)',
      inputPlaceholder: 'Reason for rejecting this order...',
      showCancelButton: true,
      confirmButtonText: 'Reject Order',
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      background: 'rgb(17 24 39)',
      color: 'rgb(243 244 246)',
      inputAttributes: {
        'aria-label': 'Rejection reason',
      },
    });

    if (rejectionReason !== undefined) {
      try {
        console.log('❌ [DASHBOARD] Rejecting COD order:', orderId);

        const response = await fetch(`/api/orders/${orderId}/update-status`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: 'cancelled',
            rejectionReason: rejectionReason || 'Order rejected by seller',
            cancelledAt: new Date().toISOString(),
          }),
        });

        const data = await response.json();

        if (response.ok) {
          toast.success('Order rejected successfully');
          fetchOrders();
        } else {
          toast.error(data.error || 'Failed to reject order');
        }
      } catch (error) {
        console.error('❌ [DASHBOARD] Error rejecting order:', error);
        toast.error('Network error - please try again');
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const formatPaymentMethod = (method?: string) => {
    if (!method || method === 'cash_on_delivery') return 'Cash on Delivery';

    const methodMap: { [key: string]: string } = {
      credit_card: 'Credit Card',
      bank_transfer: 'Bank Transfer',
      gopay: 'GoPay',
      shopeepay: 'ShopeePay',
      ovo: 'OVO',
      dana: 'DANA',
      qris: 'QRIS',
    };

    return methodMap[method] || method.replace('_', ' ').toUpperCase();
  };

  if (loading) {
    return (
      <main className="md:ml-72 lg:ml-80 pt-16 md:pt-6 min-h-screen">
        <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="md:ml-72 lg:ml-80 pt-16 md:pt-6 min-h-screen">
      <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Orders</h1>
            <p className="text-gray-400">
              Manage and track your customer orders ({orders.length} total)
            </p>
          </div>
          <button
            onClick={() => fetchOrders(true)}
            disabled={refreshing}
            className="flex items-center space-x-2 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
            <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
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
                placeholder="Search by order ID, customer, or meal..."
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
                        : filterStatus === 'confirmed'
                        ? 'Awaiting Payment'
                        : filterStatus.charAt(0).toUpperCase() +
                          filterStatus.slice(1)}
                    </span>
                  </div>
                  <ChevronDown size={16} className="ml-2 text-gray-500" />
                </button>

                {isFilterOpen && (
                  <div className="absolute z-10 mt-1 w-full bg-gray-900 border border-gray-800 rounded-lg shadow-lg py-1">
                    {[
                      'all',
                      'pending',
                      'confirmed',
                      'processing',
                      'completed',
                      'cancelled',
                    ].map((status) => (
                      <button
                        key={status}
                        className={`px-4 py-2 text-sm w-full text-left hover:bg-gray-800 ${
                          filterStatus === status
                            ? 'text-amber-500'
                            : 'text-white'
                        }`}
                        onClick={() => {
                          setFilterStatus(status);
                          setIsFilterOpen(false);
                        }}
                      >
                        {status === 'all'
                          ? 'All Status'
                          : status === 'confirmed'
                          ? 'Awaiting Payment'
                          : status.charAt(0).toUpperCase() + status.slice(1)}
                      </button>
                    ))}
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
                {orders.length === 0
                  ? "You haven't received any orders yet."
                  : "We couldn't find any orders matching your search criteria."}
              </p>
              {orders.length > 0 && (
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
              )}
            </div>
          ) : (
            filteredOrders.map((order) => {
              const orderIdDisplay = `ORD-${order._id.slice(-8).toUpperCase()}`;
              const displayStatus = getDisplayStatus(order);
              const isNewOrder = displayStatus === 'pending_cod';

              return (
                <div
                  key={order._id}
                  className={`bg-black border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition-colors ${
                    isNewOrder ? 'ring-1 ring-orange-500/30' : ''
                  }`}
                >
                  {/* Order Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between px-5 py-4 border-b border-gray-800 gap-3">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-amber-500">
                        {orderIdDisplay}
                      </span>
                      <div className="h-4 w-px bg-gray-700"></div>
                      <span className="text-sm flex items-center text-gray-400">
                        <CalendarIcon size={14} className="mr-1.5" />{' '}
                        {formatDate(order.createdAt)}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(order)}
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
                                  {order.name}
                                </p>
                                <p className="text-gray-400 text-sm">
                                  {order.email}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-start">
                              <Phone
                                size={16}
                                className="text-gray-400 mr-3 mt-1"
                              />
                              <p className="text-gray-300">{order.phone}</p>
                            </div>

                            <div className="flex items-start">
                              <MapPin
                                size={16}
                                className="text-gray-400 mr-3 mt-1"
                              />
                              <p className="text-gray-300">
                                {order.address}, {order.city} {order.postalCode}
                              </p>
                            </div>

                            <div className="flex items-start">
                              <Banknote
                                size={16}
                                className="text-gray-400 mr-3 mt-1"
                              />
                              <div>
                                <p className="text-gray-300">
                                  {formatPaymentMethod(order.paymentMethod)}
                                </p>
                                <p className="text-xs text-gray-500">
                                  Payment Status:{' '}
                                  {order.paymentStatus.toUpperCase()}
                                </p>
                              </div>
                            </div>

                            {order.specialInstructions && (
                              <div className="pt-2 border-t border-gray-800">
                                <p className="text-xs text-gray-500 mb-1">
                                  Special Instructions:
                                </p>
                                <p className="text-gray-300 text-sm">
                                  {order.specialInstructions}
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
                            <div className="flex justify-between items-center p-4">
                              <div className="flex items-center">
                                <div className="h-10 w-10 bg-gray-800 rounded flex items-center justify-center mr-3">
                                  <span className="text-amber-500 font-medium text-xs">
                                    {order.quantity}x
                                  </span>
                                </div>
                                <div>
                                  <span className="text-white">
                                    {order.meal.title}
                                  </span>
                                  <p className="text-xs text-gray-400">
                                    Rp{order.meal.price.toLocaleString()} each
                                  </p>
                                </div>
                              </div>
                              <span className="text-amber-500 font-medium">
                                Rp
                                {(
                                  order.meal.price * order.quantity
                                ).toLocaleString()}
                              </span>
                            </div>
                          </div>
                          <div className="border-t border-gray-800 p-4 flex justify-between items-center bg-gray-900/50">
                            <span className="font-medium text-white">
                              Total
                            </span>
                            <span className="text-lg font-bold text-amber-500">
                              Rp{order.totalPrice.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Footer - Action Buttons */}
                  <div className="bg-gray-900/30 px-5 py-4 flex flex-col sm:flex-row justify-between gap-4 border-t border-gray-800">
                    <div className="flex flex-wrap gap-2">
                      {/* Online Payment - Check Payment Button */}
                      {displayStatus === 'pending' && order.midtransOrderId && (
                        <CheckPaymentButton
                          orderId={order._id}
                          onStatusUpdate={() => fetchOrders()}
                        />
                      )}

                      {/* ✅ NEW COD Order - Confirm Order Button (TAMBAHAN BARU) */}
                      {displayStatus === 'pending_cod' && (
                        <>
                          <button
                            className="bg-amber-500 hover:bg-amber-600 text-black px-4 py-2 rounded-lg text-sm font-medium disabled:bg-gray-600 disabled:text-gray-400"
                            onClick={() => handleConfirmCODOrder(order._id)}
                            disabled={acceptingPayment === order._id}
                          >
                            {acceptingPayment === order._id ? (
                              <div className="flex items-center gap-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                                Confirming...
                              </div>
                            ) : (
                              <>
                                <CheckCircle2
                                  size={16}
                                  className="inline mr-1"
                                />
                                Confirm Order
                              </>
                            )}
                          </button>
                          <button
                            className="bg-transparent hover:bg-gray-800 text-white border border-gray-700 px-4 py-2 rounded-lg text-sm"
                            onClick={() => handleRejectCODOrder(order._id)}
                          >
                            <XCircle size={16} className="inline mr-1" />
                            Reject Order
                          </button>
                        </>
                      )}

                      {/* COD - Accept Payment (goes to processing) */}
                      {displayStatus === 'confirmed_cod' && (
                        <>
                          <button
                            className="bg-amber-500 hover:bg-amber-600 text-black px-4 py-2 rounded-lg text-sm font-medium disabled:bg-gray-600 disabled:text-gray-400"
                            onClick={() =>
                              handleAcceptCODPaymentWithNotes(order._id)
                            }
                            disabled={acceptingPayment === order._id}
                          >
                            {acceptingPayment === order._id ? (
                              <div className="flex items-center gap-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                                Processing...
                              </div>
                            ) : (
                              <>
                                <DollarSign size={16} className="inline mr-1" />
                                Accept COD Payment
                              </>
                            )}
                          </button>
                          <button
                            className="bg-transparent hover:bg-gray-800 text-white border border-gray-700 px-4 py-2 rounded-lg text-sm"
                            onClick={() =>
                              handleOrderStatusUpdate(order._id, 'cancelled')
                            }
                          >
                            Cancel Order
                          </button>
                        </>
                      )}

                      {/* Online Payment - Accept/Reject */}
                      {displayStatus === 'pending' &&
                        order.paymentStatus === 'paid' && (
                          <>
                            <button
                              className="bg-amber-500 hover:bg-amber-600 text-black px-4 py-2 rounded-lg text-sm font-medium"
                              onClick={() =>
                                handleOrderStatusUpdate(order._id, 'processing')
                              }
                            >
                              Accept Order
                            </button>
                            <button
                              className="bg-transparent hover:bg-gray-800 text-white border border-gray-700 px-4 py-2 rounded-lg text-sm"
                              onClick={() =>
                                handleOrderStatusUpdate(order._id, 'cancelled')
                              }
                            >
                              Reject Order
                            </button>
                          </>
                        )}

                      {/* Processing - Mark as Completed (both COD and Online) */}
                      {displayStatus === 'processing' && (
                        <button
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                          onClick={() =>
                            handleOrderStatusUpdate(order._id, 'completed')
                          }
                        >
                          Mark as Completed
                        </button>
                      )}
                    </div>

                    <div className="text-sm text-gray-400 flex items-center">
                      Order placed on {formatDate(order.createdAt)}
                      {order.paidAt && (
                        <span className="ml-2 text-green-400">
                          • Paid on {formatDate(order.paidAt)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </main>
  );
}
