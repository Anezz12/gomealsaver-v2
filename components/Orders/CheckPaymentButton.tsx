'use client';

import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { RefreshCw, CheckCircle } from 'lucide-react';

interface CheckPaymentButtonProps {
  orderId: string;
  onStatusUpdate?: (newStatus: string) => void;
  className?: string;
  variant?: 'default' | 'large';
}

export default function CheckPaymentButton({
  orderId,
  onStatusUpdate,
  className = '',
  variant = 'default',
}: CheckPaymentButtonProps) {
  const [isChecking, setIsChecking] = useState(false);

  const handleCheckPayment = async () => {
    setIsChecking(true);

    try {
      console.log('🔍 [CHECK PAYMENT] Starting check for order:', orderId);

      const response = await fetch(`/api/orders/${orderId}/check-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      console.log('🔍 [CHECK PAYMENT] Response:', {
        status: response.status,
        data,
      });

      if (response.ok) {
        if (data.updated) {
          // Status was updated
          if (data.order.paymentStatus === 'paid') {
            toast.success('✅ Payment confirmed! Order is now being processed');
            onStatusUpdate?.(data.order.paymentStatus);

            // ✅ Refresh without reload
            setTimeout(() => {
              if (onStatusUpdate) {
                onStatusUpdate('refresh');
              } else {
                window.location.reload();
              }
            }, 2000);
          } else if (data.order.paymentStatus === 'expired') {
            toast.error('⏰ Payment has expired');
            onStatusUpdate?.(data.order.paymentStatus);
          } else if (data.order.paymentStatus === 'failed') {
            toast.error('❌ Payment failed');
            onStatusUpdate?.(data.order.paymentStatus);
          } else {
            toast(
              `ℹ️ Payment status: ${data.order.paymentStatus.toUpperCase()}`
            );
            onStatusUpdate?.(data.order.paymentStatus);
          }
        } else {
          // No update needed
          const statusMessage = data.order.paymentStatus
            .replace('_', ' ')
            .toUpperCase();

          if (data.reason === 'transaction_not_found') {
            toast.error('⚠️ Transaction not found in payment system');
          } else if (data.reason === 'expired_transaction') {
            toast.error('⏰ Payment has expired');
          } else if (data.order.paymentStatus === 'paid') {
            toast.success(`✅ Payment already confirmed: ${statusMessage}`);
          } else if (data.order.paymentStatus === 'pending') {
            toast(`⏳ Payment still pending: ${statusMessage}`);
          } else {
            toast(`ℹ️ Current status: ${statusMessage}`);
          }
        }

        // Show Midtrans transaction info for debugging
        if (data.midtransStatus) {
          console.log('🔍 [CHECK PAYMENT] Midtrans Status:', {
            transaction_status: data.midtransStatus.transaction_status,
            payment_type: data.midtransStatus.payment_type,
            transaction_id: data.midtransStatus.transaction_id,
          });
        }
      } else {
        console.error('❌ Payment check failed:', data);

        if (response.status === 401) {
          toast.error('Please log in to check payment status');
        } else if (response.status === 403) {
          toast.error('You are not authorized to check this payment');
        } else if (response.status === 404) {
          toast.error('Order not found');
        } else {
          toast.error(data.error || 'Failed to check payment status');
        }
      }
    } catch (error) {
      console.error('❌ Error checking payment:', error);
      toast.error('Network error. Please check your connection.');
    } finally {
      setIsChecking(false);
    }
  };

  const buttonSize =
    variant === 'large' ? 'px-6 py-3 text-base' : 'px-4 py-2 text-sm';

  const iconSize = variant === 'large' ? 20 : 16;

  return (
    <button
      onClick={handleCheckPayment}
      disabled={isChecking}
      className={`
        flex items-center justify-center space-x-2 
        bg-amber-500 hover:bg-amber-600 
        disabled:bg-gray-600 disabled:cursor-not-allowed 
        text-white font-medium rounded-lg 
        transition-colors duration-200
        ${buttonSize}
        ${className}
      `}
    >
      {isChecking ? (
        <>
          <RefreshCw size={iconSize} className="animate-spin" />
          <span>Checking Payment...</span>
        </>
      ) : (
        <>
          <CheckCircle size={iconSize} />
          <span>Check Payment Status</span>
        </>
      )}
    </button>
  );
}
