'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { MessageCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import MessageForm from './MealContactForm';

interface MessageButtonProps {
  mealId: string;
  recipientId: string;
  recipientName: string;
  mealTitle: string;
  className?: string;
  variant?: 'primary' | 'secondary' | 'icon';
  size?: 'sm' | 'md' | 'lg';
}

export default function MessageButton({
  mealId,
  recipientId,
  recipientName,
  mealTitle,
  className = '',
  variant = 'primary',
  size = 'md',
}: MessageButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: session } = useSession();

  const handleClick = () => {
    if (!session) {
      toast.error('Please login to send a message', {
        duration: 3000,
        position: 'top-center',
      });
      return;
    }

    if (session.user?.id === recipientId) {
      toast.error('You cannot send a message to yourself', {
        duration: 3000,
        position: 'top-center',
      });
      return;
    }

    setIsModalOpen(true);
  };

  // Size configurations
  const sizeConfig = {
    sm: {
      button: 'py-1.5 px-3 text-xs',
      icon: 'w-4 h-4',
    },
    md: {
      button: 'py-2.5 px-4 text-sm',
      icon: 'w-5 h-5',
    },
    lg: {
      button: 'py-3 px-6 text-base',
      icon: 'w-6 h-6',
    },
  };

  // Variant configurations
  const variantConfig = {
    primary: 'bg-blue-500 hover:bg-blue-600 text-white shadow-blue-500/25',
    secondary:
      'bg-gray-800 hover:bg-gray-700 text-white border border-gray-700',
    icon: 'p-2 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white border border-gray-700 rounded-full',
  };

  const config = sizeConfig[size];
  const variantClass = variantConfig[variant];

  if (variant === 'icon') {
    return (
      <>
        <button
          onClick={handleClick}
          className={`${variantClass} transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 ${className}`}
          title="Send message"
        >
          <MessageCircle className={config.icon} />
        </button>

        <MessageForm
          mealId={mealId}
          recipientId={recipientId}
          recipientName={recipientName}
          mealTitle={mealTitle}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </>
    );
  }

  return (
    <>
      <button
        onClick={handleClick}
        className={`
          w-full ${config.button} rounded-full font-semibold
          transition-all duration-200 ease-in-out
          flex items-center justify-center gap-2
          transform hover:scale-[0.98] active:scale-[0.95]
          shadow-lg hover:shadow-xl
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500
          ${variantClass}
          ${className}
        `}
      >
        <MessageCircle className={config.icon} />
        <span>Send Message</span>
      </button>

      <MessageForm
        mealId={mealId}
        recipientId={recipientId}
        recipientName={recipientName}
        mealTitle={mealTitle}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
