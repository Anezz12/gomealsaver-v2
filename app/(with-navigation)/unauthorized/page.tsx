// app/unauthorized/page.tsx
import Link from 'next/link';
import { ShieldX, ArrowLeft } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen  flex items-center justify-center px-4">
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
          <Link
            href="/"
            className="flex items-center justify-center space-x-2 bg-amber-500 hover:bg-amber-600 text-black px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Back to Home</span>
          </Link>

          <p className="text-sm text-gray-500">
            Need seller access? Contact support for assistance.
          </p>
        </div>
      </div>
    </div>
  );
}
