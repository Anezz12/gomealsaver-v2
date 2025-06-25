// app/(with-navigation)/messages/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import MessagesHeader from '@/components/Messages/MessagesHeader';
import MessagesTabs from '@/components/Messages/MessagesTabs';
import MessagesList from '@/components/Messages/MessagesList';
import MessagesEmpty from '@/components/Messages/MessagesEmpty';
import LoadingSpinner from '@/components/UI/LoadingSpinner';
import AuthRequired from '@/components/Login/AuthRequired';

export interface Message {
  _id: string;
  sender: {
    _id: string;
    username: string;
    email: string;
    image?: string;
  };
  recipient: {
    _id: string;
    username: string;
    email: string;
    image?: string;
  };
  meal: {
    _id: string;
    title: string;
    images?: string[];
  };
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
  read: boolean;
  originalMessage?: string;
  isReply?: boolean;
}

export default function MessagesPage() {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');

  useEffect(() => {
    if (session) {
      fetchMessages();
    }
  }, [activeTab, session]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/messages/read?type=${activeTab}`);

      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }

      const data = await response.json();
      setMessages(data.messages || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (messageId: string) => {
    try {
      const response = await fetch(`/api/messages/read/${messageId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ read: true }),
      });

      if (response.ok) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg._id === messageId ? { ...msg, read: true } : msg
          )
        );
        toast.success('Message marked as read');
      }
    } catch (error) {
      console.error('Error marking message as read:', error);
      toast.error('Failed to mark as read');
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!confirm('Are you sure you want to delete this message?')) {
      return;
    }

    try {
      const response = await fetch(`/api/messages/delete/${messageId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
        toast.success('Message deleted successfully');
      } else {
        toast.error('Failed to delete message');
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error('Failed to delete message');
    }
  };

  const handleReplyMessage = async (
    originalMessageId: string,
    replyData: {
      message: string;
      name: string;
      email: string;
      phone?: string;
    }
  ) => {
    try {
      const response = await fetch('/api/messages/reply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          originalMessageId,
          ...replyData,
        }),
      });

      if (response.ok) {
        toast.success('Reply sent successfully');
        fetchMessages(); // Refresh messages
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to send reply');
      }
    } catch (error) {
      console.error('Error sending reply:', error);
      toast.error('Failed to send reply');
    }
  };

  if (!session) {
    return <AuthRequired />;
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-20">
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1F2937',
            color: '#F9FAFB',
            border: '1px solid #374151',
          },
          success: {
            style: {
              background: '#059669',
              color: '#FFFFFF',
            },
          },
          error: {
            style: {
              background: '#DC2626',
              color: '#FFFFFF',
            },
          },
        }}
      />

      <div className="container mx-auto px-4 md:px-6 py-8">
        <MessagesHeader />

        <MessagesTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {loading ? (
          <LoadingSpinner />
        ) : messages.length === 0 ? (
          <MessagesEmpty activeTab={activeTab} />
        ) : (
          <MessagesList
            messages={messages}
            activeTab={activeTab}
            onMarkAsRead={handleMarkAsRead}
            onDeleteMessage={handleDeleteMessage}
            onReplyMessage={handleReplyMessage}
          />
        )}
      </div>
    </div>
  );
}
