'use client';
import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';

export default function ErrorPage({ error }: { error: Error }) {
  return (
    <section className="min-h-screen flex items-center justify-center px-4 sm:px-8 bg-[#0A0A0A] text-white">
      <div className="w-full max-w-2xl mx-auto">
        <div className="bg-[#141414] border border-gray-800 px-8 py-14 rounded-xl shadow-lg shadow-amber-900/10 transform ">
          <div className="flex justify-center mb-8">
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-full bg-amber-600/30 blur-xl scale-150"></div>

              {/* Icon */}
              <div className="relative z-10 p-4 bg-[#1A1A1A] rounded-full border border-gray-800">
                <AlertTriangle className="text-amber-500 w-12 h-12 animate-pulse" />
              </div>
            </div>
          </div>

          <div className="space-y-6 text-center">
            <h1 className="text-4xl font-bold text-white sm:text-5xl">
              Something Went Wrong
            </h1>

            <div className="bg-[#1A1A1A] border border-gray-800 rounded-lg p-4">
              <p className="text-gray-400 text-lg leading-relaxed">
                {error.toString()}
              </p>
            </div>

            <div className="pt-6">
              <Link
                href="/"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white px-6 py-3 rounded-lg hover:from-amber-700 hover:to-amber-800  font-semibold"
              >
                <span>Return Home</span>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-amber-600/5 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-amber-600/5 rounded-full blur-3xl -z-10"></div>
      </div>
    </section>
  );
}
