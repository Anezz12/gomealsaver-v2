/* eslint-disable react-hooks/exhaustive-deps */
// components/Settings/TransactionDetailPage.tsx
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  User,
  Phone,
  Mail,
  Package,
  Clock,
  CheckCircle2,
  XCircle,
  TruckIcon,
  CreditCard,
  Star,
  MessageSquare,
  Download,
  RefreshCw,
  Copy,
  Check,
  ChevronDown,
} from 'lucide-react';
import Image from 'next/image';
import CheckPaymentButton from '@/components/Orders/CheckPaymentButton';
import { toast } from 'react-hot-toast';

interface TransactionDetail {
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
    description: string;
    owner: {
      _id: string;
      username: string;
      email: string;
      phone?: string;
    };
  };
  owner: {
    _id: string;
    username: string;
    email: string;
    phone?: string;
  };
  quantity: number;
  totalPrice: number;
  status:
    | 'pending'
    | 'awaiting_payment'
    | 'processing'
    | 'completed'
    | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'expired' | 'cancelled';
  paymentMethod?: string;
  orderType: 'dine_in' | 'takeaway';
  specialInstructions?: string;
  midtransOrderId?: string;
  midtransTransactionId?: string;
  paidAt?: string;
  confirmedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export default function TransactionDetailsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('id');

  const [transaction, setTransaction] = useState<TransactionDetail | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [copied, setCopied] = useState(false);

  // Mobile collapsible sections state
  const [expandedSections, setExpandedSections] = useState({
    timeline: false,
    customer: false,
    delivery: false,
    payment: false,
    seller: false,
  });

  // Toggle section expansion
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Fetch transaction details
  const fetchTransactionDetails = async (showRefreshToast = false) => {
    if (!orderId) {
      toast.error('Order ID is required');
      router.push('/profile/transaction');
      return;
    }

    try {
      if (showRefreshToast) setRefreshing(true);

      const response = await fetch(`/api/transactions/user/${orderId}`);
      if (response.ok) {
        const data = await response.json();
        setTransaction(data.order);

        if (showRefreshToast) {
          toast.success('Transaction details refreshed');
        }
      } else if (response.status === 404) {
        toast.error('Transaction not found');
        router.push('/profile/transaction');
      } else {
        toast.error('Failed to fetch transaction details');
      }
    } catch (error) {
      console.error('Error fetching transaction details:', error);
      toast.error('Error loading transaction details');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTransactionDetails();
  }, [orderId]);

  // Copy order ID to clipboard
  const copyOrderId = async () => {
    if (!transaction) return;

    const orderIdDisplay = `ORD-${transaction._id.slice(-8).toUpperCase()}`;
    try {
      await navigator.clipboard.writeText(orderIdDisplay);
      setCopied(true);
      toast.success('Order ID copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy order ID');
    }
  };

  // Get display status
  const getDisplayStatus = (transaction: TransactionDetail) => {
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
    } else {
      return transaction.status;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm bg-amber-900/40 text-amber-300">
            <Clock size={16} /> Awaiting Payment
          </span>
        );
      case 'processing':
        return (
          <span className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm bg-blue-900/40 text-blue-300">
            <TruckIcon size={16} /> Being Prepared
          </span>
        );
      case 'completed':
        return (
          <span className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm bg-green-900/40 text-green-300">
            <CheckCircle2 size={16} /> Completed
          </span>
        );
      case 'cancelled':
        return (
          <span className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm bg-red-900/40 text-red-300">
            <XCircle size={16} /> Cancelled
          </span>
        );
      default:
        return (
          <span className="px-3 py-1.5 rounded-full text-sm bg-gray-900 text-gray-300">
            {status}
          </span>
        );
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatPaymentMethod = (method?: string) => {
    if (!method) return 'Cash on Delivery';

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
      <div className="p-3 sm:p-4 md:p-6 lg:p-8 max-w-6xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
        </div>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="p-3 sm:p-4 md:p-6 lg:p-8 max-w-6xl mx-auto">
        <div className="text-center py-12">
          <h1 className="text-xl sm:text-2xl font-bold text-white mb-2">
            Transaction Not Found
          </h1>
          <p className="text-gray-400 mb-6 text-sm sm:text-base">
            The transaction youre looking for could not be found.
          </p>
          <button
            onClick={() => router.push('/profile/transaction')}
            className="bg-amber-500 hover:bg-amber-600 text-black px-6 py-3 rounded-lg font-medium"
          >
            Back to Transactions
          </button>
        </div>
      </div>
    );
  }

  const orderIdDisplay = `ORD-${transaction._id.slice(-8).toUpperCase()}`;
  const displayStatus = getDisplayStatus(transaction);

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <button
            onClick={() => router.push('/profile/transaction')}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors flex-shrink-0"
          >
            <ArrowLeft size={20} className="text-gray-400" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              Transaction Details
            </h1>
            <p className="text-gray-400 text-sm sm:text-base">
              View complete order information
            </p>
          </div>
        </div>
        <button
          onClick={() => fetchTransactionDetails(true)}
          disabled={refreshing}
          className="flex items-center justify-center space-x-2 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-600 text-white px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm sm:text-base"
        >
          <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
          <span className="hidden sm:inline">
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </span>
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
        {/* Left Column - Main Info */}
        <div className="xl:col-span-2 space-y-4 sm:space-y-6">
          {/* Order Overview */}
          <div className="bg-black border border-gray-800 rounded-xl p-4 sm:p-6">
            <div className="flex flex-col gap-4 mb-4 sm:mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="font-bold text-amber-500 text-base sm:text-lg">
                    {orderIdDisplay}
                  </span>
                  <button
                    onClick={copyOrderId}
                    className="p-1.5 hover:bg-gray-800 rounded transition-colors"
                  >
                    {copied ? (
                      <Check size={16} className="text-green-400" />
                    ) : (
                      <Copy size={16} className="text-gray-400" />
                    )}
                  </button>
                </div>
                {getStatusBadge(displayStatus)}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <h3 className="text-gray-400 text-sm mb-2">Order Date</h3>
                <p className="text-white flex items-center text-sm sm:text-base">
                  <Calendar size={16} className="mr-2 flex-shrink-0" />
                  <span className="break-all">
                    {formatDate(transaction.createdAt)}
                  </span>
                </p>
              </div>
              <div>
                <h3 className="text-gray-400 text-sm mb-2">Order Type</h3>
                <p className="text-white text-sm sm:text-base">
                  {transaction.orderType === 'dine_in' ? 'Dine In' : 'Takeaway'}
                </p>
              </div>
              {transaction.paidAt && (
                <div>
                  <h3 className="text-gray-400 text-sm mb-2">Payment Date</h3>
                  <p className="text-green-400 flex items-center text-sm sm:text-base">
                    <CheckCircle2 size={16} className="mr-2 flex-shrink-0" />
                    <span className="break-all">
                      {formatDate(transaction.paidAt)}
                    </span>
                  </p>
                </div>
              )}
              {transaction.confirmedAt && (
                <div>
                  <h3 className="text-gray-400 text-sm mb-2">Completed Date</h3>
                  <p className="text-green-400 flex items-center text-sm sm:text-base">
                    <CheckCircle2 size={16} className="mr-2 flex-shrink-0" />
                    <span className="break-all">
                      {formatDate(transaction.confirmedAt)}
                    </span>
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-black border border-gray-800 rounded-xl p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold text-white mb-4 flex items-center">
              <Package size={20} className="mr-2" />
              Order Items
            </h2>

            <div className="bg-gray-900 rounded-lg overflow-hidden">
              <div className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-4">
                  <div className="relative w-full sm:w-20 h-32 sm:h-20 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0">
                    {transaction.meal.images &&
                    transaction.meal.images.length > 0 ? (
                      <Image
                        src={transaction.meal.images[0]}
                        alt={transaction.meal.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500">
                        <Package size={24} />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-medium text-white mb-2 break-words">
                      {transaction.meal.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-3">
                      by {transaction.owner.username}
                    </p>

                    {transaction.meal.description && (
                      <p className="text-gray-300 text-sm mb-3 line-clamp-3 sm:line-clamp-2">
                        {transaction.meal.description}
                      </p>
                    )}

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="text-sm text-gray-400">
                        <span className="text-amber-500 font-medium">
                          {transaction.quantity}x
                        </span>
                        {' × '}
                        <span>Rp{transaction.meal.price.toLocaleString()}</span>
                      </div>
                      <div className="text-left sm:text-right">
                        <div className="text-lg font-bold text-white">
                          Rp{transaction.totalPrice.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-400">
                          Total Amount
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Status Timeline - Collapsible on mobile */}
          <div className="bg-black border border-gray-800 rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection('timeline')}
              className="w-full p-4 sm:p-6 flex items-center justify-between xl:cursor-default"
            >
              <h2 className="text-lg sm:text-xl font-bold text-white flex items-center">
                <Clock size={20} className="mr-2" />
                Order Timeline
              </h2>
              <ChevronDown
                size={20}
                className={`text-gray-400 xl:hidden transition-transform ${
                  expandedSections.timeline ? 'rotate-180' : ''
                }`}
              />
            </button>

            <div
              className={`px-4 sm:px-6 pb-4 sm:pb-6 xl:block ${
                expandedSections.timeline ? 'block' : 'hidden xl:block'
              }`}
            >
              <div className="space-y-4">
                {/* Order Placed */}
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle2 size={16} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-white">Order Placed</h3>
                    <p className="text-gray-400 text-sm break-all">
                      {formatDate(transaction.createdAt)}
                    </p>
                    <p className="text-gray-500 text-xs mt-1">
                      Your order has been successfully placed
                    </p>
                  </div>
                </div>

                {/* Payment Status */}
                <div className="flex items-start space-x-4">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${
                      transaction.paymentStatus === 'paid'
                        ? 'bg-green-500'
                        : transaction.paymentStatus === 'pending'
                        ? 'bg-amber-500'
                        : 'bg-red-500'
                    }`}
                  >
                    {transaction.paymentStatus === 'paid' ? (
                      <CheckCircle2 size={16} className="text-white" />
                    ) : transaction.paymentStatus === 'pending' ? (
                      <Clock size={16} className="text-white" />
                    ) : (
                      <XCircle size={16} className="text-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-white">
                      Payment{' '}
                      {transaction.paymentStatus.charAt(0).toUpperCase() +
                        transaction.paymentStatus.slice(1)}
                    </h3>
                    <p className="text-gray-400 text-sm break-all">
                      {transaction.paidAt
                        ? formatDate(transaction.paidAt)
                        : 'Waiting for payment'}
                    </p>
                    <p className="text-gray-500 text-xs mt-1">
                      {transaction.paymentStatus === 'paid'
                        ? 'Payment has been confirmed'
                        : transaction.paymentStatus === 'pending'
                        ? 'Waiting for payment confirmation'
                        : 'Payment was not successful'}
                    </p>
                  </div>
                </div>

                {/* Processing Status */}
                {(transaction.status === 'processing' ||
                  transaction.status === 'completed') && (
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-1">
                      <TruckIcon size={16} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-white">
                        Order Being Prepared
                      </h3>
                      <p className="text-gray-400 text-sm break-all">
                        {transaction.paidAt
                          ? formatDate(transaction.paidAt)
                          : 'In progress'}
                      </p>
                      <p className="text-gray-500 text-xs mt-1">
                        Your order is being prepared by the seller
                      </p>
                    </div>
                  </div>
                )}

                {/* Completed Status */}
                {transaction.status === 'completed' && (
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-1">
                      <CheckCircle2 size={16} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-white">
                        Order Completed
                      </h3>
                      <p className="text-gray-400 text-sm break-all">
                        {transaction.confirmedAt
                          ? formatDate(transaction.confirmedAt)
                          : 'Completed'}
                      </p>
                      <p className="text-gray-500 text-xs mt-1">
                        Your order has been completed. Enjoy your meal!
                      </p>
                    </div>
                  </div>
                )}

                {/* Cancelled Status */}
                {transaction.status === 'cancelled' && (
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0 mt-1">
                      <XCircle size={16} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-white">
                        Order Cancelled
                      </h3>
                      <p className="text-gray-400 text-sm break-all">
                        {formatDate(transaction.updatedAt)}
                      </p>
                      <p className="text-gray-500 text-xs mt-1">
                        This order has been cancelled
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Special Instructions */}
          {transaction.specialInstructions && (
            <div className="bg-black border border-gray-800 rounded-xl p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-white mb-4 flex items-center">
                <MessageSquare size={20} className="mr-2" />
                Special Instructions
              </h2>
              <div className="bg-gray-900 rounded-lg p-4">
                <p className="text-gray-300 text-sm sm:text-base break-words">
                  {transaction.specialInstructions}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Customer & Payment Info */}
        <div className="space-y-4 sm:space-y-6">
          {/* Customer Information - Collapsible on mobile */}
          <div className="bg-black border border-gray-800 rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection('customer')}
              className="w-full p-4 sm:p-6 flex items-center justify-between xl:cursor-default"
            >
              <h2 className="text-lg sm:text-xl font-bold text-white flex items-center">
                <User size={20} className="mr-2" />
                Customer Information
              </h2>
              <ChevronDown
                size={20}
                className={`text-gray-400 xl:hidden transition-transform ${
                  expandedSections.customer ? 'rotate-180' : ''
                }`}
              />
            </button>

            <div
              className={`px-4 sm:px-6 pb-4 sm:pb-6 xl:block ${
                expandedSections.customer ? 'block' : 'hidden xl:block'
              }`}
            >
              <div className="space-y-4">
                <div>
                  <h3 className="text-gray-400 text-sm mb-1">Name</h3>
                  <p className="text-white break-words">{transaction.name}</p>
                </div>

                <div>
                  <h3 className="text-gray-400 text-sm mb-1">Email</h3>
                  <p className="text-white flex items-start">
                    <Mail size={16} className="mr-2 mt-0.5 flex-shrink-0" />
                    <span className="break-all">{transaction.email}</span>
                  </p>
                </div>

                <div>
                  <h3 className="text-gray-400 text-sm mb-1">Phone</h3>
                  <p className="text-white flex items-center">
                    <Phone size={16} className="mr-2 flex-shrink-0" />
                    <span className="break-all">{transaction.phone}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Address - Collapsible on mobile */}
          <div className="bg-black border border-gray-800 rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection('delivery')}
              className="w-full p-4 sm:p-6 flex items-center justify-between xl:cursor-default"
            >
              <h2 className="text-lg sm:text-xl font-bold text-white flex items-center">
                <MapPin size={20} className="mr-2" />
                Delivery Address
              </h2>
              <ChevronDown
                size={20}
                className={`text-gray-400 xl:hidden transition-transform ${
                  expandedSections.delivery ? 'rotate-180' : ''
                }`}
              />
            </button>

            <div
              className={`px-4 sm:px-6 pb-4 sm:pb-6 xl:block ${
                expandedSections.delivery ? 'block' : 'hidden xl:block'
              }`}
            >
              <div className="bg-gray-900 rounded-lg p-4">
                <p className="text-white font-medium mb-2 break-words">
                  {transaction.name}
                </p>
                <p className="text-gray-300 leading-relaxed break-words">
                  {transaction.address}
                  <br />
                  {transaction.city} {transaction.postalCode}
                </p>
              </div>
            </div>
          </div>

          {/* Payment Information - Collapsible on mobile */}
          <div className="bg-black border border-gray-800 rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection('payment')}
              className="w-full p-4 sm:p-6 flex items-center justify-between xl:cursor-default"
            >
              <h2 className="text-lg sm:text-xl font-bold text-white flex items-center">
                <CreditCard size={20} className="mr-2" />
                Payment Information
              </h2>
              <ChevronDown
                size={20}
                className={`text-gray-400 xl:hidden transition-transform ${
                  expandedSections.payment ? 'rotate-180' : ''
                }`}
              />
            </button>

            <div
              className={`px-4 sm:px-6 pb-4 sm:pb-6 xl:block ${
                expandedSections.payment ? 'block' : 'hidden xl:block'
              }`}
            >
              <div className="space-y-4">
                <div>
                  <h3 className="text-gray-400 text-sm mb-1">Payment Method</h3>
                  <p className="text-white break-words">
                    {formatPaymentMethod(transaction.paymentMethod)}
                  </p>
                </div>

                <div>
                  <h3 className="text-gray-400 text-sm mb-1">Payment Status</h3>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      transaction.paymentStatus === 'paid'
                        ? 'bg-green-900/40 text-green-300'
                        : transaction.paymentStatus === 'pending'
                        ? 'bg-amber-900/40 text-amber-300'
                        : 'bg-red-900/40 text-red-300'
                    }`}
                  >
                    {transaction.paymentStatus.toUpperCase()}
                  </span>
                </div>

                {transaction.midtransTransactionId && (
                  <div>
                    <h3 className="text-gray-400 text-sm mb-1">
                      Transaction ID
                    </h3>
                    <p className="text-white text-sm font-mono break-all">
                      {transaction.midtransTransactionId}
                    </p>
                  </div>
                )}

                <div className="border-t border-gray-700 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Total Amount</span>
                    <span className="text-lg sm:text-xl font-bold text-amber-500">
                      Rp{transaction.totalPrice.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Seller Information - Collapsible on mobile */}
          <div className="bg-black border border-gray-800 rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection('seller')}
              className="w-full p-4 sm:p-6 flex items-center justify-between xl:cursor-default"
            >
              <h2 className="text-lg sm:text-xl font-bold text-white flex items-center">
                <User size={20} className="mr-2" />
                Seller Information
              </h2>
              <ChevronDown
                size={20}
                className={`text-gray-400 xl:hidden transition-transform ${
                  expandedSections.seller ? 'rotate-180' : ''
                }`}
              />
            </button>

            <div
              className={`px-4 sm:px-6 pb-4 sm:pb-6 xl:block ${
                expandedSections.seller ? 'block' : 'hidden xl:block'
              }`}
            >
              <div className="space-y-4">
                <div>
                  <h3 className="text-gray-400 text-sm mb-1">Seller Name</h3>
                  <p className="text-white break-words">
                    {transaction.owner.username}
                  </p>
                </div>

                <div>
                  <h3 className="text-gray-400 text-sm mb-1">Contact Email</h3>
                  <p className="text-white break-all">
                    {transaction.owner.email}
                  </p>
                </div>

                {transaction.owner.phone && (
                  <div>
                    <h3 className="text-gray-400 text-sm mb-1">
                      Contact Phone
                    </h3>
                    <p className="text-white break-all">
                      {transaction.owner.phone}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-black border border-gray-800 rounded-xl p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold text-white mb-4">
              Actions
            </h2>

            <div className="space-y-3">
              {/* Check Payment Button */}
              {displayStatus === 'pending' && transaction.midtransOrderId && (
                <CheckPaymentButton
                  orderId={transaction._id}
                  onStatusUpdate={() => fetchTransactionDetails()}
                  variant="large"
                  className="w-full"
                />
              )}

              {/* Rate Order Button */}
              {displayStatus === 'completed' && (
                <button
                  onClick={() =>
                    router.push(
                      `/profile/transaction/rate-order?transactionId=${transaction._id}`
                    )
                  }
                  className="w-full flex items-center justify-center space-x-2 bg-amber-500 hover:bg-amber-600 text-black px-4 py-3 rounded-lg font-medium text-sm sm:text-base"
                >
                  <Star size={16} />
                  <span>Rate This Order</span>
                </button>
              )}

              {/* Download Receipt */}
              <button className="w-full flex items-center justify-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded-lg font-medium text-sm sm:text-base">
                <Download size={16} />
                <span>Download Receipt</span>
              </button>

              {/* Contact Seller */}
              <button className="w-full flex items-center justify-center space-x-2 bg-transparent hover:bg-gray-800 text-white border border-gray-700 px-4 py-3 rounded-lg font-medium text-sm sm:text-base">
                <MessageSquare size={16} />
                <span>Contact Seller</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
