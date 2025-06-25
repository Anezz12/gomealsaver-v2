interface MessagesEmptyProps {
  activeTab: 'received' | 'sent';
}

export default function MessagesEmpty({ activeTab }: MessagesEmptyProps) {
  return (
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
      <h3 className="text-xl font-semibold text-white mb-2">No Messages Yet</h3>
      <p className="text-gray-400">
        {activeTab === 'received'
          ? "You haven't received any messages yet."
          : "You haven't sent any messages yet."}
      </p>
    </div>
  );
}
