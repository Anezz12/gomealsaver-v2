'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  ChevronDown,
  Clock,
  CheckCircle2,
  XCircle,
  TruckIcon,
  CalendarIcon,
  MapPin,
  User,
  Banknote,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Eye,
  Star,
  RefreshCw,
  DollarSign,
} from 'lucide-react';
import CheckPaymentButton from '@/components/Orders/CheckPaymentButton';
import { toast } from 'react-hot-toast';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
interface Transaction {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  meal: {
    _id: string;
    name: string;
    price: number;
    image: string[];
    owner: {
      username: string;
      email: string;
    };
  };
  owner: {
    username: string;
    email: string;
  };
  quantity: number;
  totalPrice: number;
  status:
    | 'pending'
    | 'awaiting_payment'
    | 'processing'
    | 'completed'
    | 'cancelled';
  paymentStatus:
    | 'pending'
    | 'paid'
    | 'failed'
    | 'expired'
    | 'cancelled'
    | 'pending_cod';
  paymentMethod?: string;
  orderType: 'dine_in' | 'takeaway';
  specialInstructions?: string;
  midtransOrderId?: string;
  midtransTransactionId?: string;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalOrders: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export default function TransactionPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPaymentStatus, setFilterPaymentStatus] = useState<string>('all');

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPaymentFilterOpen, setIsPaymentFilterOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    totalPages: 1,
    totalOrders: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  // Loading states for actions
  const [cancellingOrders, setCancellingOrders] = useState<Set<string>>(
    new Set()
  );
  const [confirmingPayments, setConfirmingPayments] = useState<Set<string>>(
    new Set()
  );

  // Cancel Order Function
  const handleCancelOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    setCancellingOrders((prev) => new Set(prev).add(orderId));

    try {
      const response = await fetch(`/api/orders/${orderId}/cancel`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reason: 'Cancelled by customer',
        }),
      });

      if (response.ok) {
        toast.success('Order cancelled successfully');
        fetchTransactions(); // Refresh transactions
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to cancel order');
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      toast.error('Failed to cancel order');
    } finally {
      setCancellingOrders((prev) => {
        const newSet = new Set(prev);
        newSet.delete(orderId);
        return newSet;
      });
    }
  };

  // Confirm Cash Payment Function
  const handleConfirmCashPayment = async (orderId: string) => {
    if (
      !confirm(
        'Confirm that you have received the cash payment for this order?'
      )
    ) {
      return;
    }

    setConfirmingPayments((prev) => new Set(prev).add(orderId));

    try {
      const response = await fetch(
        `/api/orders/${orderId}/confirm-cash-payment`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        toast.success('Cash payment confirmed successfully');
        fetchTransactions(); // Refresh transactions
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to confirm payment');
      }
    } catch (error) {
      console.error('Error confirming cash payment:', error);
      toast.error('Failed to confirm payment');
    } finally {
      setConfirmingPayments((prev) => {
        const newSet = new Set(prev);
        newSet.delete(orderId);
        return newSet;
      });
    }
  };

  // Fetch transactions
  const fetchTransactions = async (showRefreshToast = false) => {
    try {
      if (showRefreshToast) setRefreshing(true);

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
      });

      if (filterStatus !== 'all') params.append('status', filterStatus);
      if (filterPaymentStatus !== 'all')
        params.append('paymentStatus', filterPaymentStatus);

      const response = await fetch(`/api/transactions/user?${params}`);
      if (response.ok) {
        const data = await response.json();
        setTransactions(data.orders || []);
        setPagination(data.pagination);

        if (showRefreshToast) {
          toast.success('Transactions refreshed successfully');
        }
      } else {
        console.error('Failed to fetch transactions');
        toast.error('Failed to fetch transactions');
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast.error('Error fetching transactions');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [currentPage, filterStatus, filterPaymentStatus]);

  // Get display status
  const getDisplayStatus = (transaction: Transaction) => {
    if (
      transaction.paymentStatus === 'paid' &&
      transaction.status === 'processing'
    ) {
      return 'processing';
    } else if (
      transaction.paymentStatus === 'paid' &&
      transaction.status === 'completed'
    ) {
      return 'completed';
    } else if (
      transaction.status === 'cancelled' ||
      transaction.paymentStatus === 'failed'
    ) {
      return 'cancelled';
    } else if (
      transaction.status === 'awaiting_payment' ||
      transaction.paymentStatus === 'pending'
    ) {
      return 'pending';
    } else if (transaction.paymentStatus === 'pending_cod') {
      return 'pending_cod';
    } else {
      return transaction.status;
    }
  };

  // Check if order can be cancelled
  const canCancelOrder = (transaction: Transaction) => {
    const nonCancellableStatuses = ['completed', 'cancelled'];
    return (
      !nonCancellableStatuses.includes(transaction.status) &&
      !nonCancellableStatuses.includes(transaction.paymentStatus)
    );
  };

  // Check if cash payment can be confirmed
  const canConfirmCashPayment = (transaction: Transaction) => {
    return (
      transaction.paymentStatus === 'pending_cod' &&
      transaction.status === 'processing' &&
      (!transaction.paymentMethod ||
        transaction.paymentMethod === 'cash_on_delivery')
    );
  };

  // Filter transactions by search query
  const filteredTransactions = transactions.filter((transaction) => {
    const orderIdDisplay = `ORD-${transaction._id.slice(-8).toUpperCase()}`;
    const matchesSearch =
      orderIdDisplay.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.meal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.owner.username
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  const getStatusBadge = (transaction: Transaction) => {
    const displayStatus = getDisplayStatus(transaction);

    switch (displayStatus) {
      case 'pending':
        return (
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-amber-900/40 text-amber-300">
            <Clock size={12} /> Awaiting Payment
          </span>
        );
      case 'pending_cod':
        return (
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-blue-900/40 text-blue-300">
            <DollarSign size={12} /> Cash on Delivery
          </span>
        );
      case 'processing':
        return (
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-blue-900/40 text-blue-300">
            <TruckIcon size={12} /> Being Prepared
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
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
      <main className="md:ml-72 lg:ml-0 pt-16 md:pt-0 min-h-screen">
        <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="md:ml-72 lg:ml-0 pt-20 md:pt-0 min-h-screen">
      <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">My Transactions</h1>
            <p className="text-gray-400">
              Track your orders and payment history ({pagination.totalOrders}{' '}
              total)
            </p>
          </div>
          <button
            onClick={() => fetchTransactions(true)}
            disabled={refreshing}
            className="flex items-center space-x-2 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
            <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
        </div>

        {/* Search and Filters - Same as before */}
        <div className="bg-black rounded-xl border border-gray-800 p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-grow">
              <Search
                size={18}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              />
              <input
                type="text"
                placeholder="Search by order ID, meal, or seller..."
                className="bg-gray-900 border border-gray-800 rounded-lg pl-10 pr-4 py-2 w-full focus:outline-none focus:border-amber-500 text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-3">
              {/* Order Status Filter */}
              <div className="relative">
                <button
                  className="flex items-center justify-between bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 w-full md:w-[150px]"
                  onClick={() => {
                    setIsFilterOpen(!isFilterOpen);
                    setIsPaymentFilterOpen(false);
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
                    {[
                      'all',
                      'pending',
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
                          setCurrentPage(1);
                        }}
                      >
                        {status === 'all'
                          ? 'All Status'
                          : status.charAt(0).toUpperCase() + status.slice(1)}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Payment Status Filter */}
              <div className="relative">
                <button
                  className="flex items-center justify-between bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 w-full md:w-[150px]"
                  onClick={() => {
                    setIsPaymentFilterOpen(!isPaymentFilterOpen);
                    setIsFilterOpen(false);
                    setIsSortOpen(false);
                  }}
                >
                  <div className="flex items-center">
                    <Banknote size={16} className="mr-2 text-gray-500" />
                    <span className="text-sm text-white">
                      {filterPaymentStatus === 'all'
                        ? 'All Payment'
                        : filterPaymentStatus.charAt(0).toUpperCase() +
                          filterPaymentStatus.slice(1)}
                    </span>
                  </div>
                  <ChevronDown size={16} className="ml-2 text-gray-500" />
                </button>

                {isPaymentFilterOpen && (
                  <div className="absolute z-10 mt-1 w-full bg-gray-900 border border-gray-800 rounded-lg shadow-lg py-1">
                    {[
                      'all',
                      'pending',
                      'paid',
                      'failed',
                      'expired',
                      'pending_cod',
                    ].map((status) => (
                      <button
                        key={status}
                        className={`px-4 py-2 text-sm w-full text-left hover:bg-gray-800 ${
                          filterPaymentStatus === status
                            ? 'text-amber-500'
                            : 'text-white'
                        }`}
                        onClick={() => {
                          setFilterPaymentStatus(status);
                          setIsPaymentFilterOpen(false);
                          setCurrentPage(1);
                        }}
                      >
                        {status === 'all'
                          ? 'All Payment'
                          : status === 'pending_cod'
                          ? 'Cash on Delivery'
                          : status.charAt(0).toUpperCase() + status.slice(1)}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Transactions List */}
        <div className="space-y-5">
          {filteredTransactions.length === 0 ? (
            <div className="bg-black border border-gray-800 rounded-xl p-10 text-center">
              <div className="mx-auto w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <Search size={24} className="text-gray-500" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">
                No transactions found
              </h3>
              <p className="text-gray-400 mb-6">
                {transactions.length === 0
                  ? "You haven't made any orders yet."
                  : "We couldn't find any transactions matching your search criteria."}
              </p>
              {transactions.length > 0 && (
                <button
                  className="bg-amber-500 hover:bg-amber-600 text-black font-medium py-2 px-4 rounded-lg text-sm"
                  onClick={() => {
                    setSearchQuery('');
                    setFilterStatus('all');
                    setFilterPaymentStatus('all');
                  }}
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            filteredTransactions.map((transaction) => {
              const orderIdDisplay = `ORD-${transaction._id
                .slice(-8)
                .toUpperCase()}`;
              const displayStatus = getDisplayStatus(transaction);
              const isCancelling = cancellingOrders.has(transaction._id);
              const isConfirmingPayment = confirmingPayments.has(
                transaction._id
              );

              return (
                <div
                  key={transaction._id}
                  className="bg-black border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition-colors"
                >
                  {/* Transaction Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between px-5 py-4 border-b border-gray-800 gap-3">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-amber-500">
                        {orderIdDisplay}
                      </span>
                      <div className="h-4 w-px bg-gray-700"></div>
                      <span className="text-sm flex items-center text-gray-400">
                        <CalendarIcon size={14} className="mr-1.5" />
                        {formatDate(transaction.createdAt)}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(transaction)}
                      <button className="p-1.5 rounded-full hover:bg-gray-800 text-gray-400">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Transaction Content - Same as before */}
                  <div className="p-5">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Left: Meal Info */}
                      <div className="flex-1">
                        <div className="flex items-start space-x-4 mb-4">
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-800">
                            {transaction.meal.image &&
                            transaction.meal.image.length > 0 ? (
                              <Image
                                src={transaction.meal.image[0]}
                                alt={transaction.meal.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-500">
                                <span className="text-xs">No Image</span>
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-white mb-1">
                              {transaction.meal.name}
                            </h3>
                            <p className="text-gray-400 text-sm mb-2">
                              by {transaction.owner.username}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-amber-500 font-medium">
                                {transaction.quantity}x Rp
                                {transaction.meal.price.toLocaleString()}
                              </span>
                              <span className="text-lg font-bold text-white">
                                Rp{transaction.totalPrice.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Order Details */}
                        <div className="bg-gray-900 rounded-lg p-4 space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-400">Order Type:</span>
                            <span className="text-white">
                              {transaction.orderType === 'dine_in'
                                ? 'Dine In'
                                : 'Takeaway'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-400">
                              Payment Method:
                            </span>
                            <span className="text-white">
                              {formatPaymentMethod(transaction.paymentMethod)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-400">
                              Payment Status:
                            </span>
                            <span
                              className={`font-medium ${
                                transaction.paymentStatus === 'paid'
                                  ? 'text-green-400'
                                  : transaction.paymentStatus === 'pending' ||
                                    transaction.paymentStatus === 'pending_cod'
                                  ? 'text-amber-400'
                                  : 'text-red-400'
                              }`}
                            >
                              {transaction.paymentStatus === 'pending_cod'
                                ? 'CASH ON DELIVERY'
                                : transaction.paymentStatus.toUpperCase()}
                            </span>
                          </div>
                          {transaction.paidAt && (
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-400">Paid At:</span>
                              <span className="text-green-400">
                                {formatDate(transaction.paidAt)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right: Delivery Info - Same as before */}
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-400 mb-2 text-sm pt-0 md:pt-20">
                          Delivery Information
                        </h3>
                        <div className="bg-gray-900 rounded-lg p-4 space-y-3">
                          <div className="flex items-start">
                            <User
                              size={16}
                              className="text-gray-400 mr-3 mt-1"
                            />
                            <div>
                              <p className="font-medium text-white">
                                {transaction.name}
                              </p>
                              <p className="text-gray-400 text-sm">
                                {transaction.email}
                              </p>
                              <p className="text-gray-400 text-sm">
                                {transaction.phone}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start">
                            <MapPin
                              size={16}
                              className="text-gray-400 mr-3 mt-1"
                            />
                            <p className="text-gray-300">
                              {transaction.address}, {transaction.city}{' '}
                              {transaction.postalCode}
                            </p>
                          </div>

                          {transaction.specialInstructions && (
                            <div className="pt-2 border-t border-gray-800">
                              <p className="text-xs text-gray-500 mb-1">
                                Special Instructions:
                              </p>
                              <p className="text-gray-300 text-sm">
                                {transaction.specialInstructions}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Transaction Footer with Enhanced Action Buttons */}
                  <div className="bg-gray-900/30 px-5 py-4 flex flex-col sm:flex-row justify-between gap-4 border-t border-gray-800">
                    <div className="flex flex-wrap gap-2">
                      {/* Pending Payment - Show Check Payment Button */}
                      {displayStatus === 'pending' &&
                        transaction.midtransOrderId && (
                          <CheckPaymentButton
                            orderId={transaction._id}
                            onStatusUpdate={() => fetchTransactions()}
                            variant="default"
                          />
                        )}

                      {/* Cash on Delivery - Confirm Payment Button */}
                      {canConfirmCashPayment(transaction) && (
                        <button
                          onClick={() =>
                            handleConfirmCashPayment(transaction._id)
                          }
                          disabled={isConfirmingPayment}
                          className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
                        >
                          <DollarSign size={16} />
                          <span>
                            {isConfirmingPayment
                              ? 'Confirming...'
                              : 'Confirm Cash Payment'}
                          </span>
                        </button>
                      )}

                      {/* Cancel Order Button */}
                      {canCancelOrder(transaction) && (
                        <button
                          onClick={() => handleCancelOrder(transaction._id)}
                          disabled={isCancelling}
                          className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
                        >
                          <XCircle size={16} />
                          <span>
                            {isCancelling ? 'Cancelling...' : 'Cancel Order'}
                          </span>
                        </button>
                      )}

                      {/* Completed - Rate Order */}
                      {displayStatus === 'completed' && (
                        <button
                          onClick={() =>
                            router.push(
                              `/profile/transaction/rate-order?transactionId=${transaction._id}`
                            )
                          }
                          className="flex items-center space-x-2 bg-amber-500 hover:bg-amber-600 text-black px-4 py-2 rounded-lg text-sm font-medium"
                        >
                          <Star size={16} />
                          <span>Rate Order</span>
                        </button>
                      )}

                      {/* View Details */}
                      <Link
                        href={`/profile/transaction/details?id=${transaction._id}`}
                      >
                        <button className="flex items-center space-x-2 bg-transparent hover:bg-gray-800 text-white border border-gray-700 px-4 py-2 rounded-lg text-sm">
                          <Eye size={16} />
                          <span>View Details</span>
                        </button>
                      </Link>
                    </div>

                    <div className="text-sm text-gray-400 flex items-center">
                      Order placed on {formatDate(transaction.createdAt)}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Pagination - Same as before */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between mt-8">
            <div className="text-sm text-gray-400">
              Showing page {pagination.currentPage} of {pagination.totalPages}(
              {pagination.totalOrders} total transactions)
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={!pagination.hasPrevPage}
                className="flex items-center space-x-1 px-3 py-2 rounded-lg border border-gray-700 text-white disabled:text-gray-500 disabled:cursor-not-allowed hover:bg-gray-800 disabled:hover:bg-transparent"
              >
                <ChevronLeft size={16} />
                <span>Previous</span>
              </button>

              <div className="flex items-center space-x-1">
                {Array.from(
                  { length: Math.min(5, pagination.totalPages) },
                  (_, i) => {
                    let pageNum;
                    if (pagination.totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= pagination.totalPages - 2) {
                      pageNum = pagination.totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-2 rounded-lg text-sm ${
                          currentPage === pageNum
                            ? 'bg-amber-500 text-black font-medium'
                            : 'text-white hover:bg-gray-800 border border-gray-700'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  }
                )}
              </div>

              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={!pagination.hasNextPage}
                className="flex items-center space-x-1 px-3 py-2 rounded-lg border border-gray-700 text-white disabled:text-gray-500 disabled:cursor-not-allowed hover:bg-gray-800 disabled:hover:bg-transparent"
              >
                <span>Next</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
