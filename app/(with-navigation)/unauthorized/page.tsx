import Link from 'next/link';
import { ShieldX, ArrowLeft, UserCog } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <ShieldX size={64} className="mx-auto text-red-500 mb-4" />
          <h1 className="text-3xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-gray-400">
            You dont have permission to access this page. This area is
            restricted to sellers only.
          </p>
        </div>

        <div className="space-y-4">
          {/* Primary action - Back to Home */}
          <Link
            href="/"
            className="flex items-center justify-center space-x-2 bg-amber-500 hover:bg-amber-600 text-black px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Back to Home</span>
          </Link>

          {/* ✅ New action - Become a Seller */}
          <Link
            href="/role-selection"
            className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors border border-blue-500"
          >
            <UserCog size={16} />
            <span>Become a Seller</span>
          </Link>

          {/* ✅ Updated help text */}
          <div className="space-y-2">
            <p className="text-sm text-gray-500">
              Want to start selling? Click <strong>Become a Seller</strong> to
              change your role.
            </p>
            <p className="text-xs text-gray-600">
              Need help? Contact support for assistance.
            </p>
          </div>
        </div>

        {/* ✅ Additional info section */}
        <div className="mt-8 p-4 bg-gray-900/50 rounded-lg border border-gray-800">
          <h3 className="text-sm font-medium text-white mb-2">
            Why become a seller?
          </h3>
          <ul className="text-xs text-gray-400 space-y-1 text-left">
            <li>• Create and manage your own meal listings</li>
            <li>• Set your own prices and delivery options</li>
            <li>• Build your customer base</li>
            <li>• Track your sales and earnings</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
