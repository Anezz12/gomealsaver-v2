// components/Messages/MessageCard.tsx
import React, { useState } from 'react';
import Image from 'next/image';
import MessageActions from './MessageActions';
import ReplyForm from './ReplyForm';

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

export interface ReplyData {
  message: string;
  name: string;
  email: string;
  phone?: string;
}

interface MessageCardProps {
  message: Message;
  activeTab: 'received' | 'sent';
  onMarkAsRead: (messageId: string) => void;
  onDeleteMessage: (messageId: string) => void;
  onReplyMessage: (messageId: string, replyData: ReplyData) => void;
}

export default function MessageCard({
  message,
  activeTab,
  onMarkAsRead,
  onDeleteMessage,
  onReplyMessage,
}: MessageCardProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);

  const handleReply = (replyData: ReplyData) => {
    onReplyMessage(message._id, replyData);
    setShowReplyForm(false);
  };

  return (
    <div
      className={`bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border transition-all duration-200 hover:bg-gray-800/70 ${
        !message.read && activeTab === 'received'
          ? 'border-amber-500/50 bg-amber-500/5'
          : 'border-gray-700/50'
      }`}
    >
      {/* Message Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
            {activeTab === 'received' ? (
              message.sender.image ? (
                <Image
                  src={message.sender.image}
                  alt=""
                  className="w-12 h-12 rounded-full"
                  width={48}
                  height={48}
                />
              ) : (
                <span className="text-amber-500 font-semibold">
                  {message.sender.username?.charAt(0).toUpperCase()}
                </span>
              )
            ) : message.recipient.image ? (
              <Image
                src={message.recipient.image}
                alt=""
                className="w-12 h-12 rounded-full"
                width={48}
                height={48}
              />
            ) : (
              <span className="text-amber-500 font-semibold">
                {message.recipient.username?.charAt(0).toUpperCase()}
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

        <MessageActions
          message={message}
          activeTab={activeTab}
          onMarkAsRead={onMarkAsRead}
          onDeleteMessage={onDeleteMessage}
          onShowReply={() => setShowReplyForm(true)}
        />
      </div>

      {/* Meal Info */}
      <div className="mb-4 p-4 bg-gray-900/50 rounded-lg">
        <h4 className="font-semibold text-amber-500 mb-2">
          Regarding: {message.meal.title}
        </h4>
        {message.meal.images && message.meal.images[0] && (
          <Image
            src={message.meal.images[0]}
            alt={message.meal.title}
            className="w-16 h-16 rounded-lg object-cover"
            width={64}
            height={64}
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
          <p className="text-white font-medium">{message.email}</p>
        </div>
        {message.phone && (
          <div>
            <span className="text-gray-400">Phone:</span>
            <p className="text-white font-medium">{message.phone}</p>
          </div>
        )}
      </div>

      {/* Message Content */}
      <div className="bg-gray-900/30 rounded-lg p-4 mb-4">
        <h5 className="text-gray-400 text-sm mb-2">Message:</h5>
        <p className="text-white leading-relaxed">{message.message}</p>
      </div>

      {/* Reply Form */}
      {showReplyForm && (
        <ReplyForm
          onSubmit={handleReply}
          onCancel={() => setShowReplyForm(false)}
          recipientName={
            activeTab === 'received'
              ? message.sender.username
              : message.recipient.username
          }
        />
      )}
    </div>
  );
}
