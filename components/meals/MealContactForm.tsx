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
  Loader2,
} from 'lucide-react';

interface MealContactFormProps {
  mealId: string;
  recipientId: string;
  recipientName: string;
  mealTitle: string;
  className?: string;
}

interface MessageFormData {
  recipient: string;
  meal: string;
  name: string;
  email: string;
  phone: string;
  body: string; // Changed from 'message' to 'body' to match API
}

export default function MealContactForm({
  mealId,
  recipientId,
  recipientName,
  mealTitle,
  className = '',
}: MealContactFormProps) {
  const { data: session } = useSession();
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState<MessageFormData>({
    recipient: recipientId,
    meal: mealId,
    name: session?.user?.name || '',
    email: session?.user?.email || '',
    phone: '',
    body: '',
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
      toast.error('Please login to send a message', {
        duration: 3000,
        position: 'top-center',
      });
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
    if (!formData.body.trim()) {
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
          body: JSON.stringify({
            sender: session.user?.id,
            recipient: formData.recipient,
            meal: formData.meal,
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            body: formData.body,
          }),
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
            body: '',
            phone: '',
          }));
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

  return (
    <div
      className={`bg-black/50 border border-gray-800 rounded-xl p-6 ${className}`}
    >
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <MessageCircle className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">Contact Seller</h3>
            <p className="text-sm text-gray-400">{recipientName}</p>
          </div>
        </div>

        {/* Meal Info */}
        <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
          <p className="text-sm text-gray-400 mb-1">Regarding:</p>
          <p className="text-white font-medium">{mealTitle}</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
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
            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="Enter your phone number"
          />
        </div>

        {/* Message Field */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <MessageSquare className="w-4 h-4 inline mr-2" />
            Your Message *
          </label>
          <textarea
            name="body"
            value={formData.body}
            onChange={handleInputChange}
            required
            rows={5}
            maxLength={500}
            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
            placeholder="Hi! I'm interested in this meal. Can you provide more details about availability and pickup time?"
          />
          <div className="flex justify-between items-center mt-2">
            <p className="text-xs text-gray-500">
              {formData.body.length}/500 characters
            </p>
            {formData.body.length > 450 && (
              <p className="text-xs text-amber-400">
                {500 - formData.body.length} characters left
              </p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isPending || !session}
            className={`
              w-full py-4 px-6 rounded-lg font-semibold text-white
              transition-all duration-200 ease-in-out
              flex items-center justify-center gap-3
              ${
                !session
                  ? 'bg-gray-700 cursor-not-allowed opacity-50'
                  : isPending
                  ? 'bg-blue-400 cursor-not-allowed opacity-75'
                  : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-blue-500/20 hover:-translate-y-0.5'
              }
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900
            `}
          >
            {!session ? (
              <>
                <User className="w-5 h-5" />
                Please Login to Send Message
              </>
            ) : isPending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Sending Message...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Send Message to Seller
              </>
            )}
          </button>
        </div>

        {/* Help Text */}
        {session && (
          <div className="mt-4 p-4 bg-blue-900/20 border border-blue-800/30 rounded-lg">
            <h4 className="text-sm font-medium text-blue-300 mb-2">
              💡 Tips for contacting seller:
            </h4>
            <ul className="text-xs text-blue-200 space-y-1">
              <li>• Ask about meal availability and pickup times</li>
              <li>• Inquire about portion sizes and ingredients</li>
              <li>• Confirm pickup location and payment methods</li>
              <li>• Be polite and specific about your needs</li>
            </ul>
          </div>
        )}
      </form>
    </div>
  );
}
