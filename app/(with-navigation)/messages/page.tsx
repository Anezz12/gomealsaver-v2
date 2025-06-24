'use client';

import React, { useState, useEffect } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { useSession } from 'next-auth/react';

interface Message {
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
}

export default function MessagesPage() {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');

  useEffect(() => {
    fetchMessages();
  }, [activeTab]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/messages?type=${activeTab}`);

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

  const markAsRead = async (messageId: string) => {
    try {
      const response = await fetch(`/api/messages/${messageId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ read: true }),
      });

      if (response.ok) {
        setMessages(
          messages.map((msg) =>
            msg._id === messageId ? { ...msg, read: true } : msg
          )
        );
      }
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const deleteMessage = async (messageId: string) => {
    if (!confirm('Are you sure you want to delete this message?')) {
      return;
    }

    try {
      const response = await fetch(`/api/messages/delete/${messageId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMessages(messages.filter((msg) => msg._id !== messageId));
        toast.success('Message deleted successfully');
      } else {
        toast.error('Failed to delete message');
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error('Failed to delete message');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return 'Today';
    } else if (diffDays === 2) {
      return 'Yesterday';
    } else if (diffDays <= 7) {
      return `${diffDays - 1} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Please Sign In</h1>
          <p className="text-gray-400">
            You need to be logged in to view messages.
          </p>
        </div>
      </div>
    );
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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Your <span className="text-amber-500">Messages</span>
          </h1>
          <p className="text-gray-400">
            Manage your meal requests and communications
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-gray-800/50 rounded-xl p-1 w-fit">
            <button
              onClick={() => setActiveTab('received')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                activeTab === 'received'
                  ? 'bg-amber-500 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Received Messages
            </button>
            <button
              onClick={() => setActiveTab('sent')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                activeTab === 'sent'
                  ? 'bg-amber-500 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Sent Messages
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
          </div>
        ) : (
          <>
            {/* Messages List */}
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-12 h-12 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  No Messages Yet
                </h3>
                <p className="text-gray-400">
                  {activeTab === 'received'
                    ? "You haven't received any messages yet."
                    : "You haven't sent any messages yet."}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message._id}
                    className={`bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border transition-all duration-200 hover:bg-gray-800/70 ${
                      !message.read && activeTab === 'received'
                        ? 'border-amber-500/50 bg-amber-500/5'
                        : 'border-gray-700/50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                          {activeTab === 'received' ? (
                            message.sender.image ? (
                              <img
                                src={message.sender.image}
                                alt=""
                                className="w-12 h-12 rounded-full"
                              />
                            ) : (
                              <span className="text-amber-500 font-semibold">
                                {message.sender.username
                                  ?.charAt(0)
                                  .toUpperCase()}
                              </span>
                            )
                          ) : message.recipient.image ? (
                            <img
                              src={message.recipient.image}
                              alt=""
                              className="w-12 h-12 rounded-full"
                            />
                          ) : (
                            <span className="text-amber-500 font-semibold">
                              {message.recipient.username
                                ?.charAt(0)
                                .toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">
                            {activeTab === 'received'
                              ? message.sender.username
                              : message.recipient.username}
                          </h3>
                          <p className="text-sm text-gray-400">
                            {activeTab === 'received'
                              ? message.sender.email
                              : message.recipient.email}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {!message.read && activeTab === 'received' && (
                          <span className="px-2 py-1 bg-amber-500 text-xs font-semibold rounded-full text-white">
                            NEW
                          </span>
                        )}
                        <span className="text-sm text-gray-500">
                          {formatDate(message.createdAt)}
                        </span>
                        <div className="flex space-x-1">
                          {activeTab === 'received' && !message.read && (
                            <button
                              onClick={() => markAsRead(message._id)}
                              className="p-2 text-gray-400 hover:text-amber-500 transition-colors"
                              title="Mark as read"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            </button>
                          )}
                          <button
                            onClick={() => deleteMessage(message._id)}
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                            title="Delete message"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Meal Info */}
                    <div className="mb-4 p-4 bg-gray-900/50 rounded-lg">
                      <h4 className="font-semibold text-amber-500 mb-2">
                        Regarding: {message.meal.title}
                      </h4>
                      {message.meal.images && message.meal.images[0] && (
                        <img
                          src={message.meal.images[0]}
                          alt={message.meal.title}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                      )}
                    </div>

                    {/* Contact Info */}
                    <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Name:</span>
                        <p className="text-white font-medium">{message.name}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Email:</span>
                        <p className="text-white font-medium">
                          {message.email}
                        </p>
                      </div>
                      {message.phone && (
                        <div>
                          <span className="text-gray-400">Phone:</span>
                          <p className="text-white font-medium">
                            {message.phone}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Message Content */}
                    <div className="bg-gray-900/30 rounded-lg p-4">
                      <h5 className="text-gray-400 text-sm mb-2">Message:</h5>
                      <p className="text-white leading-relaxed">
                        {message.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
