'use client';

import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { RefreshCw } from 'lucide-react';

interface CheckPaymentButtonProps {
  orderId: string;
  onStatusUpdate?: (newStatus: string) => void;
}

export default function CheckPaymentButton({
  orderId,
  onStatusUpdate,
}: CheckPaymentButtonProps) {
  const [isChecking, setIsChecking] = useState(false);

  const handleCheckPayment = async () => {
    setIsChecking(true);

    try {
      const response = await fetch(`/api/orders/${orderId}/check-payment`, {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok) {
        if (data.order.paymentStatus === 'paid') {
          toast.success('Payment confirmed!');
          onStatusUpdate?.(data.order.paymentStatus);
          window.location.reload(); // Refresh page to show updated status
        } else {
          toast(`Payment status: ${data.order.paymentStatus}`);
        }
      } else {
        toast.error(data.error || 'Failed to check payment');
      }
    } catch (error) {
      console.error('Error checking payment:', error);
      toast.error('Failed to check payment');
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <button
      onClick={handleCheckPayment}
      disabled={isChecking}
      className="flex items-center space-x-2 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
    >
      <RefreshCw size={16} className={isChecking ? 'animate-spin' : ''} />
      <span>{isChecking ? 'Checking...' : 'Check Payment Status'}</span>
    </button>
  );
}
