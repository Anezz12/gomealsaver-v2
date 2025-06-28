import { formatDate } from '@/utils/dateUtils';

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

interface MessageActionsProps {
  message: Message;
  activeTab: 'received' | 'sent';
  onMarkAsRead: (messageId: string) => void;
  onDeleteMessage: (messageId: string) => void;
  onShowReply: () => void;
}

export default function MessageActions({
  message,
  activeTab,
  onMarkAsRead,
  onDeleteMessage,
  onShowReply,
}: MessageActionsProps) {
  return (
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
        {/* Reply Button */}
        {activeTab === 'received' && (
          <button
            onClick={onShowReply}
            className="p-2 text-gray-400 hover:text-amber-500 transition-colors"
            title="Reply to message"
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
                d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
              />
            </svg>
          </button>
        )}

        {/* Mark as Read Button */}
        {activeTab === 'received' && !message.read && (
          <button
            onClick={() => onMarkAsRead(message._id)}
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

        {/* Delete Button */}
        <button
          onClick={() => onDeleteMessage(message._id)}
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
  );
}
