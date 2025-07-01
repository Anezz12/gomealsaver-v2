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

  // ✅ Memoize openPayment function with useCallback
  const openPayment = useCallback(() => {
    if (typeof window !== 'undefined' && (window as any).snap) {
      console.log('🚀 [PAYMENT] Opening SANDBOX payment for Order:', orderId);

      (window as any).snap.pay(snapToken, {
        onSuccess: async (result: any) => {
          console.log('✅ [PAYMENT] SANDBOX payment success:', result);
          toast.success('Payment successful! (Sandbox Mode)');

          // Enhanced success handling
          setTimeout(async () => {
            try {
              // ✅ Use correct API endpoint for status check
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
                console.log('📊 [PAYMENT] SANDBOX status check:', data);

                if (data.order?.paymentStatus === 'paid') {
                  console.log(
                    '✅ [PAYMENT] SANDBOX payment confirmed by webhook'
                  );
                  onSuccess();
                  return;
                } else {
                  console.log(
                    '⏳ [PAYMENT] Waiting for SANDBOX webhook confirmation...'
                  );
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
                        console.log(
                          '🔄 [PAYMENT] SANDBOX recheck result:',
                          recheckData
                        );
                        if (recheckData.order?.paymentStatus === 'paid') {
                          onSuccess();
                          return;
                        }
                      }
                    } catch (error) {
                      console.error('Error on SANDBOX recheck:', error);
                    }
                    // Refresh to show updated status
                    window.location.reload();
                  }, 3000);
                }
              } else {
                console.error('Failed to check SANDBOX payment status');
                // Still call onSuccess as Snap confirmed success
                onSuccess();
              }
            } catch (error) {
              console.error('Error checking SANDBOX payment status:', error);
              // Still call onSuccess as Snap confirmed success
              onSuccess();
            }
          }, 2000); // Wait 2 seconds for webhook
        },

        onPending: (result: any) => {
          console.log('⏳ [PAYMENT] SANDBOX payment pending:', result);
          toast('Payment is being processed... (Sandbox Mode)', {
            icon: '⏳',
            duration: 4000,
          });
          onPending();
        },

        onError: (result: any) => {
          console.error('❌ [PAYMENT] SANDBOX payment error:', result);

          // Enhanced error handling for sandbox
          if (result.status_code === '404') {
            toast.error('Transaction not found. Please try again.');
          } else if (result.status_code === '402') {
            toast.error('Payment method not available in sandbox.');
          } else if (result.status_code === '403') {
            toast.error(
              'Domain not allowed. Check Midtrans sandbox configuration.'
            );
          } else {
            toast.error('Sandbox payment failed. Please try again.');
          }

          onError();
        },

        onClose: () => {
          console.log('❌ [PAYMENT] SANDBOX payment popup closed');
          toast('Payment cancelled by user', { icon: '❌' });
          // Don't call onError on manual close
        },
      });
    } else {
      console.error('❌ [PAYMENT] Snap object not available');
      toast.error('Payment system not ready. Please try again.');
    }
  }, [snapToken, orderId, onSuccess, onError, onPending]); // ✅ Include all dependencies

  useEffect(() => {
    // Load Midtrans Snap script
    const script = document.createElement('script');

    // ✅ FORCE SANDBOX: Always use sandbox URL regardless of environment
    script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';

    script.setAttribute(
      'data-client-key',
      process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY!
    );

    console.log('🧪 [PAYMENT] Loading Midtrans SANDBOX script:', {
      url: script.src,
      clientKey:
        process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY?.substring(0, 15) + '...',
      environment: process.env.NODE_ENV,
      mode: 'SANDBOX (FORCED)',
    });

    script.onload = () => {
      console.log('✅ [PAYMENT] Midtrans SANDBOX script loaded successfully');
      setIsLoading(false);
      // Auto-open payment popup
      setTimeout(() => {
        openPayment();
      }, 500);
    };

    script.onerror = (error) => {
      console.error(
        '❌ [PAYMENT] Failed to load Midtrans SANDBOX script:',
        error
      );
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
  }, [openPayment]); // ✅ Include openPayment as dependency

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-8 max-w-md mx-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Loading Payment
            </h3>
            <p className="text-gray-400 mb-2">Preparing secure payment...</p>
            <p className="text-xs text-amber-400">
              🧪 Sandbox Mode (Test Environment)
            </p>
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

          {/* Sandbox Mode Indicator */}
          <div className="bg-gray-800 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-center mb-2">
              <span className="text-amber-400 text-lg">🧪</span>
              <span className="text-amber-400 text-sm font-medium ml-2">
                Test Mode Active
              </span>
            </div>
            <p className="text-xs text-gray-400 mb-3">
              This is a sandbox environment. No real money will be charged.
            </p>
            <div className="bg-gray-700 rounded-lg p-2">
              <p className="text-xs text-gray-500 mb-1">Order ID:</p>
              <p className="text-sm text-white font-mono">{orderId}</p>
            </div>
          </div>

          {/* Test Card Info */}
          <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-3 mb-4">
            <p className="text-xs text-blue-300 font-medium mb-1">
              💳 Test Card Numbers:
            </p>
            <p className="text-xs text-blue-200">
              Success: 4811 1111 1111 1114
            </p>
            <p className="text-xs text-blue-200">
              Failure: 4911 1111 1111 1113
            </p>
            <p className="text-xs text-blue-200">
              CVV: 123 | Expire: Any future date
            </p>
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={openPayment}
            className="flex-1 bg-amber-500 hover:bg-amber-600 text-black font-medium py-3 px-4 rounded-lg transition-colors"
          >
            Pay Now (Test Mode)
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
