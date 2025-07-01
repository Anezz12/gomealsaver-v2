'use client';

import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

interface PaymentModalProps {
  snapToken: string;
  orderId: string;
  onSuccess: () => void;
  onError: () => void;
  onPending: () => void;
}

// 🔧 FIX: Add proper type declaration
declare global {
  interface Window {
    snap: {
      pay: (token: string, options: any) => void;
    };
  }
}

export default function PaymentModal({
  snapToken,
  orderId,
  onSuccess,
  onError,
  onPending,
}: PaymentModalProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 🔧 FIX: Validate environment first
    console.log('🔧 [DEBUG] Environment Info:', {
      nodeEnv: process.env.NODE_ENV,
      clientKey:
        process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY?.substring(0, 10) + '...',
      snapToken: snapToken?.substring(0, 10) + '...',
      isProduction: process.env.NODE_ENV === 'production',
    });

    // 🔧 FIX: Validate required data
    if (!snapToken || snapToken.trim() === '') {
      setError('Invalid payment token received from server');
      setIsLoading(false);
      return;
    }

    if (!process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY) {
      setError('Payment configuration missing');
      setIsLoading(false);
      return;
    }

    // 🔧 FIX: Determine correct Midtrans environment
    const isProduction = process.env.NODE_ENV === 'production';
    const snapUrl = isProduction
      ? 'https://app.midtrans.com/snap/snap.js'
      : 'https://app.stg.midtrans.com/snap/snap.js';

    console.log('🔧 [MIDTRANS] Using URL:', snapUrl);

    // 🔧 FIX: Remove existing script if any
    const existingScript = document.querySelector(
      'script[src*="midtrans.com"]'
    );
    if (existingScript) {
      existingScript.remove();
    }

    // Load Midtrans Snap script
    const script = document.createElement('script');
    script.src = snapUrl;
    script.setAttribute(
      'data-client-key',
      process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY
    );
    script.type = 'text/javascript';

    script.onload = () => {
      console.log('✅ [MIDTRANS] Snap script loaded successfully');
      setIsLoading(false);

      // 🔧 FIX: Wait for script to fully initialize
      setTimeout(() => {
        if (window.snap) {
          console.log('✅ [MIDTRANS] Snap object ready');
          openPayment();
        } else {
          console.error(
            '❌ [MIDTRANS] Snap object not available after script load'
          );
          setError('Payment gateway failed to initialize');
        }
      }, 1000);
    };

    script.onerror = (e) => {
      console.error('❌ [MIDTRANS] Failed to load script:', e);
      setError('Failed to load payment gateway');
      setIsLoading(false);
    };

    // 🔧 FIX: Append to head instead of body
    document.head.appendChild(script);

    return () => {
      // Cleanup
      const scriptToRemove = document.querySelector(
        'script[src*="midtrans.com"]'
      );
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [snapToken]);

  const openPayment = () => {
    if (typeof window === 'undefined') {
      console.error('❌ [MIDTRANS] Window not available');
      return;
    }

    if (!window.snap) {
      console.error('❌ [MIDTRANS] Snap not available');
      setError('Payment gateway not ready');
      return;
    }

    console.log('🚀 [MIDTRANS] Opening payment...');

    try {
      window.snap.pay(snapToken, {
        onSuccess: async (result: any) => {
          console.log('✅ [MIDTRANS] Payment success:', result);
          toast.success('Payment successful!');

          // 🔧 FIX: Better status check with retry logic
          const checkPaymentStatus = async (retries = 3) => {
            for (let i = 0; i < retries; i++) {
              try {
                console.log(`🔍 [STATUS CHECK] Attempt ${i + 1}/${retries}`);

                const response = await fetch(
                  `/api/orders/${orderId}/payment-status`,
                  {
                    method: 'GET',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                  }
                );

                if (!response.ok) {
                  throw new Error(`HTTP ${response.status}`);
                }

                const data = await response.json();
                console.log('📊 [STATUS CHECK] Response:', data);

                if (data.order?.paymentStatus === 'paid') {
                  console.log('✅ [WEBHOOK] Payment confirmed');
                  onSuccess();
                  return;
                }

                // Wait before retry
                if (i < retries - 1) {
                  await new Promise((resolve) => setTimeout(resolve, 2000));
                }
              } catch (error) {
                console.error(
                  `❌ [STATUS CHECK] Attempt ${i + 1} failed:`,
                  error
                );
                if (i < retries - 1) {
                  await new Promise((resolve) => setTimeout(resolve, 2000));
                }
              }
            }

            // If all retries failed, still call onSuccess but with warning
            console.log(
              '⚠️ [WEBHOOK] Payment status check failed, but payment was successful'
            );
            toast('Payment successful! Your order is being processed.');
            onSuccess();
          };

          // Start status check after small delay
          setTimeout(() => {
            checkPaymentStatus();
          }, 1000);
        },

        onPending: (result: any) => {
          console.log('⏳ [MIDTRANS] Payment pending:', result);
          toast('Payment is being processed...');
          onPending();
        },

        onError: (result: any) => {
          console.error('❌ [MIDTRANS] Payment error:', result);

          // 🔧 FIX: Handle specific error codes
          if (result.status_code === '404') {
            toast.error(
              'Transaction not found. Please try creating a new order.'
            );
          } else if (result.status_code === '400') {
            toast.error('Invalid transaction. Please refresh and try again.');
          } else {
            toast.error('Payment failed. Please try again.');
          }

          onError();
        },

        onClose: () => {
          console.log('❌ [MIDTRANS] Payment popup closed');
          toast('Payment cancelled');
        },
      });
    } catch (error) {
      console.error('❌ [MIDTRANS] Error opening payment:', error);
      setError('Failed to open payment gateway');
    }
  };

  // 🔧 FIX: Error state UI
  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-gray-900 border border-red-500 rounded-xl p-8 max-w-md mx-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Payment Error
            </h3>
            <p className="text-red-400 mb-6">{error}</p>
            <div className="flex space-x-4">
              <button
                onClick={() => {
                  setError(null);
                  setIsLoading(true);
                  window.location.reload();
                }}
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Retry
              </button>
              <button
                onClick={onError}
                className="px-4 py-2 text-gray-400 hover:text-white border border-gray-600 hover:border-gray-500 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Loading Payment
            </h3>
            <p className="text-gray-400">Preparing secure payment...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 max-w-md mx-4">
        <h3 className="text-lg font-semibold text-white mb-4">
          Complete Your Payment
        </h3>
        <p className="text-gray-400 mb-6">
          Click the button below to proceed with payment
        </p>
        <div className="flex space-x-4">
          <button
            onClick={openPayment}
            className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Pay Now
          </button>
          <button
            onClick={onError}
            className="px-4 py-2 text-gray-400 hover:text-white border border-gray-600 hover:border-gray-500 rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
