/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Swal from 'sweetalert2';
import PaymentModal from '@/components/Payment/PaymentModal';
import {
  MapPin,
  Phone,
  Mail,
  User,
  CreditCard,
  Wallet,
  ShoppingBag,
  Utensils,
  ChevronRight,
  Plus,
  Minus,
} from 'lucide-react';
import NotFoundImage from '@/public/food/not-found.png';

// Types
interface MealOwner {
  _id: string;
  username: string;
  email: string;
  phone?: string;
  address?: string;
  image?: string;
}

interface Meal {
  _id: string;
  title: string;
  description?: string;
  price: number;
  originalPrice?: number;
  image: string[];
  available: boolean;
  stockQuantity: number;
  location?: string;
  owner: MealOwner;
}

interface SessionUser {
  userId: string;
  user?: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    image?: string;
  };
}

// ✅ Updated to match schema enum values
type PaymentMethodType =
  | 'cash'
  | 'credit_card'
  | 'debit_card'
  | 'bank_transfer'
  | 'gopay'
  | 'shopeepay'
  | 'ovo'
  | 'dana'
  | 'linkaja'
  | 'jenius'
  | 'qris'
  | 'bca_va'
  | 'bni_va'
  | 'bri_va'
  | 'mandiri_va'
  | 'permata_va'
  | 'cimb_va'
  | 'danamon_va'
  | 'other_va'
  | 'alfamart'
  | 'indomaret'
  | 'kioson'
  | 'pos_indonesia'
  | 'cash_on_delivery';

interface CheckoutFormProps {
  meal: Meal;
  quantity: number;
  sessionUser: SessionUser;
  showServiceFee?: boolean;
  serviceFeeRate?: number;
  allowCashOnDelivery?: boolean;
  allowOnlinePayment?: boolean;
  defaultOrderType?: 'takeaway' | 'dine_in';
  defaultPaymentMethod?: 'online' | 'cash_on_delivery'; // Keep simple for props
  onOrderSuccess?: (orderId: string) => void;
  onOrderError?: (error: string) => void;
  onPaymentSuccess?: (orderId: string) => void;
  onPaymentError?: (orderId: string) => void;
  enableOrderTypeSelection?: boolean;
  enableSpecialInstructions?: boolean;
  requiredFields?: string[];
  customValidation?: (formData: any) => { isValid: boolean; error?: string };
  className?: string;
  theme?: 'dark' | 'light';
}

export default function CheckoutForm({
  meal,
  quantity: initialQuantity, // ✅ Rename prop untuk clarity
  sessionUser,
  showServiceFee = true,
  serviceFeeRate = 0.05,
  allowCashOnDelivery = true,
  allowOnlinePayment = true,
  defaultOrderType = 'takeaway',
  defaultPaymentMethod = 'online',
  onOrderSuccess,
  onOrderError,
  onPaymentSuccess,
  onPaymentError,
  enableOrderTypeSelection = true,
  enableSpecialInstructions = true,
  requiredFields = ['name', 'email', 'phone', 'address', 'city', 'postalCode'],
  customValidation,
  className = '',
  theme = 'dark',
}: CheckoutFormProps) {
  const router = useRouter();

  // ✅ Add quantity state (tambahan baru)
  const [quantity, setQuantity] = useState(initialQuantity);
  const [maxQuantity, setMaxQuantity] = useState(meal.stockQuantity);

  // Form state
  const [formData, setFormData] = useState({
    name: sessionUser.user?.name || '',
    email: sessionUser.user?.email || '',
    phone: sessionUser.user?.phone || '',
    address: sessionUser.user?.address || '',
    city: '',
    postalCode: '',
    orderType: defaultOrderType as 'takeaway' | 'dine_in',
    specialInstructions: '',
  });

  // ✅ Available payment categories for UI
  const availablePaymentCategories: ('online' | 'cash_on_delivery')[] = [];
  if (allowOnlinePayment) availablePaymentCategories.push('online');
  if (allowCashOnDelivery) availablePaymentCategories.push('cash_on_delivery');

  // ✅ Get initial payment category
  const getInitialPaymentCategory = (): 'online' | 'cash_on_delivery' => {
    console.log('🔍 Available payment categories:', availablePaymentCategories);
    console.log('🔍 Default payment method:', defaultPaymentMethod);

    if (
      availablePaymentCategories.includes(
        defaultPaymentMethod as 'online' | 'cash_on_delivery'
      )
    ) {
      console.log('✅ Using default payment category:', defaultPaymentMethod);
      return defaultPaymentMethod as 'online' | 'cash_on_delivery';
    }

    const fallback = availablePaymentCategories[0];
    console.log('⚠️ Using fallback payment category:', fallback);
    return fallback;
  };

  // ✅ State for payment category selection
  const [paymentCategory, setPaymentCategory] = useState<
    'online' | 'cash_on_delivery'
  >(getInitialPaymentCategory());

  // ✅ State for specific payment method (will be set by Midtrans)
  const [specificPaymentMethod, setSpecificPaymentMethod] =
    useState<PaymentMethodType>('cash_on_delivery');

  // ✅ Update specific payment method when category changes
  useEffect(() => {
    if (paymentCategory === 'cash_on_delivery') {
      setSpecificPaymentMethod('cash_on_delivery');
    } else {
      // For online payments, we'll let Midtrans determine the specific method
      setSpecificPaymentMethod('credit_card');
    }
  }, [paymentCategory]);

  useEffect(() => {
    console.log('💳 Payment category changed to:', paymentCategory);
    console.log('💳 Specific payment method:', specificPaymentMethod);
  }, [paymentCategory, specificPaymentMethod]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [snapToken, setSnapToken] = useState('');
  const [orderId, setOrderId] = useState('');

  // ✅ Add quantity handlers (tambahan baru)
  const handleQuantityIncrease = () => {
    if (quantity < maxQuantity) {
      setQuantity((prev) => prev + 1);
    } else {
      toast.error(`Only ${maxQuantity} items available in stock`);
    }
  };

  const handleQuantityDecrease = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value >= 1 && value <= maxQuantity) {
      setQuantity(value);
    } else if (value > maxQuantity) {
      toast.error(`Only ${maxQuantity} items available in stock`);
      setQuantity(maxQuantity);
    } else {
      setQuantity(1);
    }
  };

  // ✅ Update pricing calculations to use dynamic quantity
  const itemPrice = meal.price * quantity;
  const serviceFee = showServiceFee
    ? Math.round(itemPrice * serviceFeeRate)
    : 0;
  const totalPrice = itemPrice + serviceFee;
  const discount = meal.originalPrice
    ? (meal.originalPrice - meal.price) * quantity
    : 0;

  // Theme classes
  const themeClasses = {
    dark: {
      container: 'bg-gray-900/50 backdrop-blur-sm border border-gray-800',
      input:
        'bg-gray-800 border border-gray-700 text-white focus:border-amber-500',
      text: 'text-white',
      textSecondary: 'text-gray-400',
      textMuted: 'text-gray-300',
    },
    light: {
      container: 'bg-white border border-gray-200 shadow-sm',
      input:
        'bg-white border border-gray-300 text-gray-900 focus:border-amber-500',
      text: 'text-gray-900',
      textSecondary: 'text-gray-600',
      textMuted: 'text-gray-700',
    },
  };

  const currentTheme = themeClasses[theme];

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Enhanced payment category change handler
  const handlePaymentCategoryChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value as 'online' | 'cash_on_delivery';
    console.log('🔄 Payment category input changed to:', value);

    if (e.target.checked) {
      setPaymentCategory(value);
      console.log('✅ Payment category updated to:', value);
    }
  };

  // Validate form
  const validateForm = () => {
    for (const field of requiredFields) {
      if (!formData[field as keyof typeof formData]) {
        const fieldName =
          field.charAt(0).toUpperCase() +
          field.slice(1).replace(/([A-Z])/g, ' $1');
        toast.error(`${fieldName} is required`);
        return false;
      }
    }

    if (requiredFields.includes('email') && formData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        toast.error('Please enter a valid email address');
        return false;
      }
    }

    if (requiredFields.includes('phone') && formData.phone) {
      const phoneRegex = /^[\+]?[0-9\-\(\)\s]+$/;
      if (!phoneRegex.test(formData.phone)) {
        toast.error('Please enter a valid phone number');
        return false;
      }
    }

    if (customValidation) {
      const validation = customValidation(formData);
      if (!validation.isValid) {
        toast.error(validation.error || 'Validation failed');
        return false;
      }
    }

    return true;
  };

  // Handle order submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    console.log('🚀 Final payment category before submit:', paymentCategory);
    console.log(
      '🚀 Specific payment method before submit:',
      specificPaymentMethod
    );

    // Show confirmation
    const result = await Swal.fire({
      title: 'Confirm Your Order',
      html: `
        <div class="text-left">
          <p><strong>Meal:</strong> ${meal.title}</p>
          <p><strong>Quantity:</strong> ${quantity}</p>
          <p><strong>Total:</strong> Rp${totalPrice.toLocaleString()}</p>
          <p><strong>Payment:</strong> ${
            paymentCategory === 'online' ? 'Online Payment' : 'Cash on Delivery'
          }</p>
          <p><strong>Endpoint:</strong> ${
            paymentCategory === 'online'
              ? '/api/orders/create-payment'
              : '/api/orders/create'
          }</p>
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#f59e0b',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Place Order',
      cancelButtonText: 'Cancel',
      background: theme === 'dark' ? '#1f2937' : '#ffffff',
      color: theme === 'dark' ? '#f9fafb' : '#1f2937',
    });

    if (!result.isConfirmed) return;

    setIsSubmitting(true);

    try {
      // ✅ Select endpoint based on payment category
      const endpoint =
        paymentCategory === 'online'
          ? '/api/orders/create-payment'
          : '/api/orders/create';

      // ✅ Send the specific payment method for the backend
      const payload = {
        mealId: meal._id,
        quantity,
        ...formData,
        paymentMethod: specificPaymentMethod, // ✅ Send actual enum value
        paymentCategory, // ✅ Also send category for backend logic
      };

      console.log('📤 [CHECKOUT] Using endpoint:', endpoint);
      console.log('📤 [CHECKOUT] Sending payload:', payload);

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log('📥 [CHECKOUT] Response status:', response.status);
      console.log('📥 [CHECKOUT] Response data:', data);

      if (response.ok) {
        if (paymentCategory === 'online' && data.snapToken) {
          console.log(
            '💳 [CHECKOUT] Opening payment modal with token:',
            data.snapToken
          );
          setSnapToken(data.snapToken);
          setOrderId(data.order._id);
          setShowPaymentModal(true);
        } else {
          console.log('💰 [CHECKOUT] COD order created successfully');
          toast.success('Order placed successfully!');
          onOrderSuccess?.(data.order._id);
          router.push(`/profile/transaction`);
        }
      } else {
        console.error('❌ [CHECKOUT] API Error:', data);
        const errorMessage = data.error || 'Failed to place order';
        toast.error(errorMessage);
        onOrderError?.(errorMessage);
      }
    } catch (error: any) {
      console.error('❌ [CHECKOUT] Network Error:', error);
      const errorMessage = 'Failed to place order. Please try again.';
      toast.error(errorMessage);
      onOrderError?.(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Payment modal handlers
  const handlePaymentSuccess = (finalPaymentMethod?: string) => {
    setShowPaymentModal(false);
    toast.success('Payment successful!');

    // ✅ Update specific payment method if provided by Midtrans callback
    if (finalPaymentMethod) {
      setSpecificPaymentMethod(finalPaymentMethod as PaymentMethodType);
    }

    onPaymentSuccess?.(orderId);
    router.push(`/profile/transaction`);
  };

  const handlePaymentError = () => {
    setShowPaymentModal(false);
    toast.error('Payment failed. You can retry payment later.');
    onPaymentError?.(orderId);
    router.push(`/profile/transaction`);
  };

  const handlePaymentPending = () => {
    setShowPaymentModal(false);
    toast('Payment is being processed...');
    router.push(`/profile/transaction`);
  };

  return (
    <div className={className}>
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Order Summary */}
        <div className="lg:col-span-1 order-2 lg:order-1">
          <div
            className={`${currentTheme.container} rounded-xl p-6 sticky top-24`}
          >
            <h3 className={`text-xl font-semibold ${currentTheme.text} mb-6`}>
              Order Summary
            </h3>

            {/* ✅ Enhanced Meal Item with Quantity Controls */}
            <div className="flex items-start space-x-4 mb-6">
              <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                <Image
                  src={meal.image[0] || NotFoundImage}
                  alt={meal.title || 'Meal Image'}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className="flex-1">
                <h4 className={`font-medium ${currentTheme.text}`}>
                  {meal.title}
                </h4>

                {/* ✅ Enhanced quantity display with controls */}
                <div className="flex items-center justify-between mt-2">
                  <p className={`text-sm ${currentTheme.textSecondary}`}>
                    Rp{meal.price.toLocaleString()} each
                  </p>

                  {/* ✅ Quantity Controls (TAMBAHAN BARU) */}
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={handleQuantityDecrease}
                      disabled={quantity <= 1}
                      className={`w-8 h-8 rounded-full border ${
                        theme === 'dark'
                          ? 'border-gray-700 hover:border-gray-600'
                          : 'border-gray-300 hover:border-gray-400'
                      } flex items-center justify-center text-sm font-medium transition-colors ${
                        quantity <= 1
                          ? 'opacity-50 cursor-not-allowed'
                          : `${currentTheme.text} hover:bg-gray-${
                              theme === 'dark' ? '800' : '100'
                            }`
                      }`}
                    >
                      <Minus size={14} />
                    </button>

                    <input
                      type="number"
                      value={quantity}
                      onChange={handleQuantityChange}
                      min="1"
                      max={maxQuantity}
                      className={`w-12 h-8 text-center text-sm ${currentTheme.input} rounded border-0 focus:outline-none focus:ring-1 focus:ring-amber-500`}
                    />

                    <button
                      type="button"
                      onClick={handleQuantityIncrease}
                      disabled={quantity >= maxQuantity}
                      className={`w-8 h-8 rounded-full border ${
                        theme === 'dark'
                          ? 'border-gray-700 hover:border-gray-600'
                          : 'border-gray-300 hover:border-gray-400'
                      } flex items-center justify-center text-sm font-medium transition-colors ${
                        quantity >= maxQuantity
                          ? 'opacity-50 cursor-not-allowed'
                          : `${currentTheme.text} hover:bg-gray-${
                              theme === 'dark' ? '800' : '100'
                            }`
                      }`}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                {/* ✅ Total for this item */}
                <p className={`text-sm ${currentTheme.textSecondary} mt-1`}>
                  Total: Rp{(meal.price * quantity).toLocaleString()}
                </p>

                {/* ✅ Stock indicator */}
                <p
                  className={`text-xs ${
                    quantity >= maxQuantity ? 'text-red-400' : 'text-gray-500'
                  } mt-1`}
                >
                  {maxQuantity - quantity} of {maxQuantity} remaining
                </p>

                {discount > 0 && (
                  <p className="text-sm text-green-400 mt-1">
                    Saved: Rp{discount.toLocaleString()}
                  </p>
                )}
              </div>
            </div>

            {/* ✅ Price Breakdown - updated automatically */}
            <div
              className={`space-y-3 mb-6 pt-4 border-t ${
                theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
              }`}
            >
              <div className={`flex justify-between ${currentTheme.textMuted}`}>
                <span>Subtotal ({quantity} items)</span>
                <span>Rp{itemPrice.toLocaleString()}</span>
              </div>
              {showServiceFee && (
                <div
                  className={`flex justify-between ${currentTheme.textMuted}`}
                >
                  <span>
                    Service Fee ({(serviceFeeRate * 100).toFixed(0)}%)
                  </span>
                  <span>Rp{serviceFee.toLocaleString()}</span>
                </div>
              )}
              <div
                className={`flex justify-between text-lg font-semibold ${
                  currentTheme.text
                } pt-3 border-t ${
                  theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                }`}
              >
                <span>Total</span>
                <span className="text-amber-500">
                  Rp{totalPrice.toLocaleString()}
                </span>
              </div>
            </div>

            {/* ✅ Enhanced Payment Method Display */}
            <div
              className={`pt-4 border-t ${
                theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className={`font-medium ${currentTheme.text}`}>
                  Payment Method:
                </span>
                <span className="text-amber-500 font-medium">
                  {paymentCategory === 'online'
                    ? 'Online Payment'
                    : 'Cash on Delivery'}
                </span>
              </div>
            </div>

            {/* Seller Info */}
            <div
              className={`pt-4 border-t ${
                theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
              }`}
            >
              <h4 className={`font-medium ${currentTheme.text} mb-3`}>
                Seller Information
              </h4>
              <div
                className={`space-y-2 text-sm ${currentTheme.textSecondary}`}
              >
                <div className="flex items-center space-x-2">
                  <User size={16} />
                  <span>{meal.owner.username}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail size={16} />
                  <span>{meal.owner.email}</span>
                </div>
                {meal.owner.phone && (
                  <div className="flex items-center space-x-2">
                    <Phone size={16} />
                    <span>{meal.owner.phone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Checkout Form */}
        <div className="lg:col-span-2 order-1 lg:order-2">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Contact Information */}
            <div className={`${currentTheme.container} rounded-xl p-6`}>
              <h3
                className={`text-xl font-semibold ${currentTheme.text} mb-6 flex items-center`}
              >
                <User className="mr-3 text-amber-500" size={24} />
                Contact Information
              </h3>

              <div className="grid md:grid-cols-2 gap-4">
                {requiredFields.includes('name') && (
                  <div>
                    <label
                      className={`block text-sm font-medium ${currentTheme.textMuted} mb-2`}
                    >
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full ${currentTheme.input} rounded-lg px-4 py-3 focus:outline-none transition-colors`}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                )}

                {requiredFields.includes('email') && (
                  <div>
                    <label
                      className={`block text-sm font-medium ${currentTheme.textMuted} mb-2`}
                    >
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full ${currentTheme.input} rounded-lg px-4 py-3 focus:outline-none transition-colors`}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                )}

                {requiredFields.includes('phone') && (
                  <div className="md:col-span-2">
                    <label
                      className={`block text-sm font-medium ${currentTheme.textMuted} mb-2`}
                    >
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full ${currentTheme.input} rounded-lg px-4 py-3 focus:outline-none transition-colors`}
                      placeholder="Enter your phone number"
                      required
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Delivery Information */}
            {(requiredFields.includes('address') ||
              requiredFields.includes('city') ||
              requiredFields.includes('postalCode')) && (
              <div className={`${currentTheme.container} rounded-xl p-6`}>
                <h3
                  className={`text-xl font-semibold ${currentTheme.text} mb-6 flex items-center`}
                >
                  <MapPin className="mr-3 text-amber-500" size={24} />
                  Delivery Information
                </h3>

                <div className="space-y-4">
                  {requiredFields.includes('address') && (
                    <div>
                      <label
                        className={`block text-sm font-medium ${currentTheme.textMuted} mb-2`}
                      >
                        Street Address *
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className={`w-full ${currentTheme.input} rounded-lg px-4 py-3 focus:outline-none transition-colors`}
                        placeholder="Enter your street address"
                        required
                      />
                    </div>
                  )}

                  <div className="grid md:grid-cols-2 gap-4">
                    {requiredFields.includes('city') && (
                      <div>
                        <label
                          className={`block text-sm font-medium ${currentTheme.textMuted} mb-2`}
                        >
                          City *
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className={`w-full ${currentTheme.input} rounded-lg px-4 py-3 focus:outline-none transition-colors`}
                          placeholder="Enter your city"
                          required
                        />
                      </div>
                    )}

                    {requiredFields.includes('postalCode') && (
                      <div>
                        <label
                          className={`block text-sm font-medium ${currentTheme.textMuted} mb-2`}
                        >
                          Postal Code *
                        </label>
                        <input
                          type="text"
                          name="postalCode"
                          value={formData.postalCode}
                          onChange={handleInputChange}
                          className={`w-full ${currentTheme.input} rounded-lg px-4 py-3 focus:outline-none transition-colors`}
                          placeholder="Enter postal code"
                          required
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Order Type */}
            {enableOrderTypeSelection && (
              <div className={`${currentTheme.container} rounded-xl p-6`}>
                <h3
                  className={`text-xl font-semibold ${currentTheme.text} mb-6 flex items-center`}
                >
                  <ShoppingBag className="mr-3 text-amber-500" size={24} />
                  Order Type
                </h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <label
                    className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                      formData.orderType === 'takeaway'
                        ? 'border-amber-500 bg-amber-500/10'
                        : `border-gray-${
                            theme === 'dark' ? '700' : '300'
                          } hover:border-gray-${
                            theme === 'dark' ? '600' : '400'
                          }`
                    }`}
                  >
                    <input
                      type="radio"
                      name="orderType"
                      value="takeaway"
                      checked={formData.orderType === 'takeaway'}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <ShoppingBag size={20} className="mr-3 text-amber-500" />
                    <div>
                      <div className={`font-medium ${currentTheme.text}`}>
                        Takeaway
                      </div>
                      <div className={`text-sm ${currentTheme.textSecondary}`}>
                        Pick up your order
                      </div>
                    </div>
                  </label>

                  <label
                    className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                      formData.orderType === 'dine_in'
                        ? 'border-amber-500 bg-amber-500/10'
                        : `border-gray-${
                            theme === 'dark' ? '700' : '300'
                          } hover:border-gray-${
                            theme === 'dark' ? '600' : '400'
                          }`
                    }`}
                  >
                    <input
                      type="radio"
                      name="orderType"
                      value="dine_in"
                      checked={formData.orderType === 'dine_in'}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <Utensils size={20} className="mr-3 text-amber-500" />
                    <div>
                      <div className={`font-medium ${currentTheme.text}`}>
                        Dine In
                      </div>
                      <div className={`text-sm ${currentTheme.textSecondary}`}>
                        Eat at the restaurant
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* ✅ Enhanced Payment Method Section */}
            {availablePaymentCategories.length > 1 && (
              <div className={`${currentTheme.container} rounded-xl p-6`}>
                <h3
                  className={`text-xl font-semibold ${currentTheme.text} mb-6 flex items-center`}
                >
                  <CreditCard className="mr-3 text-amber-500" size={24} />
                  Payment Method
                </h3>

                <div className="grid md:grid-cols-2 gap-4">
                  {allowOnlinePayment && (
                    <label
                      className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                        paymentCategory === 'online'
                          ? 'border-amber-500 bg-amber-500/10'
                          : `border-gray-${
                              theme === 'dark' ? '700' : '300'
                            } hover:border-gray-${
                              theme === 'dark' ? '600' : '400'
                            }`
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentCategory"
                        value="online"
                        checked={paymentCategory === 'online'}
                        onChange={handlePaymentCategoryChange}
                        className="sr-only"
                      />
                      <CreditCard size={20} className="mr-3 text-amber-500" />
                      <div>
                        <div className={`font-medium ${currentTheme.text}`}>
                          Online Payment
                        </div>
                        <div
                          className={`text-sm ${currentTheme.textSecondary}`}
                        >
                          Credit Card, Bank Transfer, E-wallet, Virtual Account
                        </div>
                      </div>
                    </label>
                  )}

                  {allowCashOnDelivery && (
                    <label
                      className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                        paymentCategory === 'cash_on_delivery'
                          ? 'border-amber-500 bg-amber-500/10'
                          : `border-gray-${
                              theme === 'dark' ? '700' : '300'
                            } hover:border-gray-${
                              theme === 'dark' ? '600' : '400'
                            }`
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentCategory"
                        value="cash_on_delivery"
                        checked={paymentCategory === 'cash_on_delivery'}
                        onChange={handlePaymentCategoryChange}
                        className="sr-only"
                      />
                      <Wallet size={20} className="mr-3 text-amber-500" />
                      <div>
                        <div className={`font-medium ${currentTheme.text}`}>
                          Cash on Delivery
                        </div>
                        <div
                          className={`text-sm ${currentTheme.textSecondary}`}
                        >
                          Pay when you receive
                        </div>
                      </div>
                    </label>
                  )}
                </div>
              </div>
            )}

            {/* Special Instructions */}
            {enableSpecialInstructions && (
              <div className={`${currentTheme.container} rounded-xl p-6`}>
                <h3
                  className={`text-xl font-semibold ${currentTheme.text} mb-6`}
                >
                  Special Instructions
                </h3>

                <textarea
                  name="specialInstructions"
                  value={formData.specialInstructions}
                  onChange={handleInputChange}
                  rows={3}
                  className={`w-full ${currentTheme.input} rounded-lg px-4 py-3 focus:outline-none transition-colors resize-none`}
                  placeholder="Any special requests or notes for the seller..."
                />
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-amber-500 hover:bg-amber-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-4 px-8 rounded-lg transition-colors flex items-center text-lg"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    Place Order (Rp{totalPrice.toLocaleString()})
                    <ChevronRight size={20} className="ml-2" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <PaymentModal
          snapToken={snapToken}
          orderId={orderId}
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
          onPending={handlePaymentPending}
        />
      )}
    </div>
  );
}
