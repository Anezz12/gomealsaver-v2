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

export default function PaymentModal({
  snapToken,
  orderId,
  onSuccess,
  onError,
  onPending,
}: PaymentModalProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load Midtrans Snap script
    const script = document.createElement('script');
    script.src =
      process.env.NODE_ENV === 'production'
        ? 'https://app.midtrans.com/snap/snap.js'
        : 'https://app.sandbox.midtrans.com/snap/snap.js';
    script.setAttribute(
      'data-client-key',
      process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY!
    );
    script.onload = () => {
      setIsLoading(false);
      // Auto-open payment popup
      openPayment();
    };
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [snapToken]);

  const openPayment = () => {
    if (typeof window !== 'undefined' && (window as any).snap) {
      (window as any).snap.pay(snapToken, {
        onSuccess: async (result: any) => {
          console.log('✅ Payment success from Snap:', result);
          toast.success('Payment successful!');

          // Wait a bit for webhook to process
          setTimeout(async () => {
            try {
              // Check payment status from our API
              const response = await fetch(
                `/api/orders/${orderId}/payment-status`
              );
              const data = await response.json();

              console.log('📊 Payment status check:', data);

              if (data.order?.paymentStatus === 'paid') {
                console.log('✅ Payment confirmed by webhook');
              } else {
                console.log('⏳ Waiting for webhook confirmation...');
                // Optionally check again after a longer delay
                setTimeout(() => {
                  window.location.reload(); // Refresh to get updated status
                }, 3000);
              }
            } catch (error) {
              console.error('Error checking payment status:', error);
            }

            onSuccess();
          }, 2000); // Wait 2 seconds for webhook
        },
        onPending: (result: any) => {
          console.log('⏳ Payment pending:', result);
          toast('Payment is being processed...');
          onPending();
        },
        onError: (result: any) => {
          console.error('❌ Payment error:', result);
          toast.error('Payment failed. Please try again.');
          onError();
        },
        onClose: () => {
          console.log('❌ Payment popup closed');
          toast('Payment cancelled');
        },
      });
    }
  };

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
