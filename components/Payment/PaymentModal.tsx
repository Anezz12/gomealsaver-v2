'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';

interface PaymentModalProps {
  snapToken: string;
  orderId: string;
  onSuccess: () => void;
  onError: () => void;
  onPending: () => void;
}

export default function PaymentModal({
  snapToken,
  orderId,
  onSuccess,
  onError,
  onPending,
}: PaymentModalProps) {
  const [isLoading, setIsLoading] = useState(true);

  const openPayment = useCallback(() => {
    if (typeof window !== 'undefined' && (window as any).snap) {
      (window as any).snap.pay(snapToken, {
        onSuccess: async () => {
          toast.success('Payment successful!');

          // Enhanced success handling
          setTimeout(async () => {
            try {
              const response = await fetch(
                `/api/orders/${orderId}/check-payment`,
                {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                }
              );

              if (response.ok) {
                const data = await response.json();

                if (data.order?.paymentStatus === 'paid') {
                  onSuccess();
                  return;
                } else {
                  // Recheck after delay
                  setTimeout(async () => {
                    try {
                      const recheckResponse = await fetch(
                        `/api/orders/${orderId}/check-payment`,
                        {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                        }
                      );
                      if (recheckResponse.ok) {
                        const recheckData = await recheckResponse.json();
                        if (recheckData.order?.paymentStatus === 'paid') {
                          onSuccess();
                          return;
                        }
                      }
                    } catch (error) {
                      // Silent error handling
                      console.error('Recheck payment failed:', error);
                    }
                    // Refresh to show updated status
                    window.location.reload();
                  }, 3000);
                }
              } else {
                // Still call onSuccess as Snap confirmed success
                onSuccess();
              }
            } catch (error) {
              // Still call onSuccess as Snap confirmed success
              console.error('Payment check failed:', error);
              onSuccess();
            }
          }, 2000); // Wait 2 seconds for webhook
        },

        onPending: () => {
          toast('Payment is being processed...', {
            icon: '⏳',
            duration: 4000,
          });
          onPending();
        },

        onError: (result: any) => {
          // Enhanced error handling
          if (result.status_code === '404') {
            toast.error('Transaction not found. Please try again.');
          } else if (result.status_code === '402') {
            toast.error('Payment method not available.');
          } else if (result.status_code === '403') {
            toast.error('Domain not allowed. Please contact support.');
          } else {
            toast.error('Payment failed. Please try again.');
          }

          onError();
        },

        onClose: () => {
          toast('Payment cancelled by user', { icon: '❌' });
        },
      });
    } else {
      toast.error('Payment system not ready. Please try again.');
    }
  }, [snapToken, orderId, onSuccess, onError, onPending]);

  useEffect(() => {
    // Load Midtrans Snap script
    const script = document.createElement('script');

    // Always use sandbox URL
    script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';

    script.setAttribute(
      'data-client-key',
      process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY!
    );

    script.onload = () => {
      setIsLoading(false);
      // Auto-open payment popup
      setTimeout(() => {
        openPayment();
      }, 500);
    };

    script.onerror = () => {
      toast.error('Failed to load payment system');
      setIsLoading(false);
    };

    // Use head for better script loading
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [openPayment]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-8 max-w-md mx-4">
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
        <div className="text-center">
          <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-6 h-6 text-amber-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">
            Complete Your Payment
          </h3>
          <p className="text-gray-400 mb-4">
            Click the button below to proceed with payment
          </p>

          {/* Order Details */}
          <div className="bg-gray-800 rounded-lg p-4 mb-4">
            <p className="text-xs text-gray-500 mb-1">Order ID:</p>
            <p className="text-sm text-white font-mono">{orderId}</p>
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={openPayment}
            className="flex-1 bg-amber-500 hover:bg-amber-600 text-black font-medium py-3 px-4 rounded-lg transition-colors"
          >
            Pay Now
          </button>
          <button
            onClick={onError}
            className="px-4 py-3 text-gray-400 hover:text-white border border-gray-600 hover:border-gray-500 rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
