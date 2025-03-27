import Link from 'next/link';
import { AlertTriangle, ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <section className="min-h-screen flex items-center justify-center px-4 sm:px-8 bg-[#0A0A0A] text-white py-16">
      <div className="w-full max-w-2xl mx-auto">
        <div className="bg-[#141414] border border-gray-800 px-8 py-14 rounded-xl shadow-md transform hover:shadow-amber-900/10 transition-all duration-300">
          <div className="flex justify-center mb-8">
            <div className="p-4 rounded-full bg-amber-900/20">
              <AlertTriangle className="text-amber-500 w-16 h-16" />
            </div>
          </div>

          <div className="space-y-6 text-center">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-amber-600 sm:text-5xl">
              Page Not Found
            </h1>

            <p className="text-gray-400 text-lg leading-relaxed">
              {
                "Sorry, we couldn't find the page you're looking for. Please check the URL or navigate back home."
              }
            </p>

            <div className="pt-6">
              <Link
                href="/"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-6 py-3 rounded-lg transition-all duration-200 hover:shadow-lg font-medium"
              >
                <span>Return Home</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
