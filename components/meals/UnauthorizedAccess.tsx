import Link from 'next/link';
import { FaExclamationTriangle, FaArrowLeft, FaHome } from 'react-icons/fa';

interface UnauthorizedAccessProps {
  type?: 'edit-product' | 'admin' | 'general';
  message?: string;
}

export default function UnauthorizedAccess({
  type = 'general',
  message,
}: UnauthorizedAccessProps) {
  const getContent = () => {
    switch (type) {
      case 'edit-product':
        return {
          title: 'Cannot Edit This Product',
          description:
            'You can only edit products that you created. This product belongs to another user.',
          primaryAction: {
            href: '/dashboard-seller/products',
            text: 'View My Products',
            icon: <FaArrowLeft className="w-4 h-4" />,
          },
        };
      case 'admin':
        return {
          title: 'Admin Access Required',
          description: 'This page is restricted to administrators only.',
          primaryAction: {
            href: '/',
            text: 'Go to Homepage',
            icon: <FaHome className="w-4 h-4" />,
          },
        };
      default:
        return {
          title: 'Access Denied',
          description:
            message || 'You do not have permission to access this resource.',
          primaryAction: {
            href: '/',
            text: 'Go to Homepage',
            icon: <FaHome className="w-4 h-4" />,
          },
        };
    }
  };

  const content = getContent();

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4">
      <div className="max-w-md mx-auto">
        <div className="bg-[#141414] rounded-xl border border-gray-800 p-8 shadow-xl text-center">
          {/* Icon */}
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaExclamationTriangle className="w-10 h-10 text-red-400" />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-white mb-4">
            {content.title}
          </h1>

          {/* Description */}
          <p className="text-gray-400 mb-8 leading-relaxed">
            {content.description}
          </p>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link
              href={content.primaryAction.href}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-lg transition-colors"
            >
              {content.primaryAction.icon}
              {content.primaryAction.text}
            </Link>

            <Link
              href="/"
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-lg border border-gray-700 transition-colors"
            >
              <FaHome className="w-4 h-4" />
              Go to Homepage
            </Link>
          </div>

          {/* Additional Info */}
          <div className="mt-6 p-4 bg-gray-900/50 rounded-lg border border-gray-800">
            <p className="text-xs text-gray-500">
              If you believe this is an error, please contact support or try
              logging in with a different account.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
