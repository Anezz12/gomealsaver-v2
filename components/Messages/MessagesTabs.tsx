interface MessagesTabsProps {
  activeTab: 'received' | 'sent';
  onTabChange: (tab: 'received' | 'sent') => void;
}

export default function MessagesTabs({
  activeTab,
  onTabChange,
}: MessagesTabsProps) {
  return (
    <div className="mb-8">
      <div className="flex space-x-1 bg-gray-800/50 rounded-xl p-1 w-fit">
        <button
          onClick={() => onTabChange('received')}
          className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
            activeTab === 'received'
              ? 'bg-amber-500 text-white shadow-lg'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Received Messages
        </button>
        <button
          onClick={() => onTabChange('sent')}
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
  );
}
