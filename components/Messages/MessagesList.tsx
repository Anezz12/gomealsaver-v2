import MessageCard from './MessageCard';

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

interface MessagesListProps {
  messages: Message[];
  activeTab: 'received' | 'sent';
  onMarkAsRead: (messageId: string) => void;
  onDeleteMessage: (messageId: string) => void;
  onReplyMessage: (messageId: string, replyData: ReplyData) => void;
}

export default function MessagesList({
  messages,
  activeTab,
  onMarkAsRead,
  onDeleteMessage,
  onReplyMessage,
}: MessagesListProps) {
  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <MessageCard
          key={message._id}
          message={message}
          activeTab={activeTab}
          onMarkAsRead={onMarkAsRead}
          onDeleteMessage={onDeleteMessage}
          onReplyMessage={onReplyMessage}
        />
      ))}
    </div>
  );
}
