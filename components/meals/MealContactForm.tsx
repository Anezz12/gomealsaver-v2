'use client';

import { useState, useTransition } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import {
  Send,
  MessageCircle,
  User,
  Mail,
  Phone,
  MessageSquare,
  X,
  Loader2,
} from 'lucide-react';

interface MessageFormProps {
  mealId: string;
  recipientId: string;
  recipientName: string;
  mealTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

interface MessageFormData {
  recipient: string;
  meal: string;
  name: string;
  email: string;
  phone: string;
  message: string;
}

export default function MessageForm({
  mealId,
  recipientId,
  recipientName,
  mealTitle,
  isOpen,
  onClose,
}: MessageFormProps) {
  const { data: session } = useSession();
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState<MessageFormData>({
    recipient: recipientId,
    meal: mealId,
    name: session?.user?.name || '',
    email: session?.user?.email || '',
    phone: '',
    message: '',
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session) {
      toast.error('Please login to send a message');
      return;
    }

    // Validation
    if (!formData.name.trim()) {
      toast.error('Name is required');
      return;
    }
    if (!formData.email.trim()) {
      toast.error('Email is required');
      return;
    }
    if (!formData.message.trim()) {
      toast.error('Message is required');
      return;
    }

    startTransition(async () => {
      try {
        console.log('📤 [CLIENT] Sending message:', formData);

        const response = await fetch('/api/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to send message');
        }

        if (data.submitted) {
          toast.success('Message sent successfully!', {
            duration: 4000,
            position: 'top-center',
            style: {
              background: '#10B981',
              color: '#FFFFFF',
              padding: '12px 16px',
              borderRadius: '8px',
            },
            icon: '✅',
          });

          // Reset form
          setFormData((prev) => ({
            ...prev,
            message: '',
            phone: '',
          }));

          // Close modal
          onClose();
        }
      } catch (error: any) {
        console.error('❌ [CLIENT] Error sending message:', error);
        toast.error(error.message || 'Failed to send message', {
          duration: 4000,
          position: 'top-center',
          style: {
            background: '#EF4444',
            color: '#FFFFFF',
            padding: '12px 16px',
            borderRadius: '8px',
          },
          icon: '❌',
        });
      }
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#141414] rounded-xl border border-gray-800 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <MessageCircle className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Send Message</h3>
              <p className="text-sm text-gray-400">to {recipientName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Meal Info */}
        <div className="p-6 bg-gray-900/50 border-b border-gray-800">
          <p className="text-sm text-gray-400 mb-1">Regarding meal:</p>
          <p className="text-white font-medium truncate">{mealTitle}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <User className="w-4 h-4 inline mr-2" />
              Your Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Enter your name"
            />
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <Mail className="w-4 h-4 inline mr-2" />
              Your Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Enter your email"
            />
          </div>

          {/* Phone Field (Optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <Phone className="w-4 h-4 inline mr-2" />
              Phone Number (Optional)
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Enter your phone number"
            />
          </div>

          {/* Message Field */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <MessageSquare className="w-4 h-4 inline mr-2" />
              Message *
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              required
              rows={4}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
              placeholder="Enter your message..."
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.message.length}/500 characters
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors border border-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className={`flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2 ${
                isPending ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send Message
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
