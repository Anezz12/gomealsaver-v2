'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AdBannerSkeleton from '../Skeleton/AdBannerSkeleton';

export default function AdBanner() {
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout((): void => {
      setIsLoading(false);
    }, 1000); // Simulate loading for 1 second

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const closeBanner = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;
  if (isLoading) return <AdBannerSkeleton />;

  return (
    <div
      role="alert"
      aria-live="polite"
      className="sticky top-0 z-40 bg-amber-500"
    >
      <div className="max-w-7xl mx-auto py-3 px-3 sm:px-6 lg:px-8">
        <div className="pr-16 sm:text-center sm:px-16">
          <p className="font-medium text-white">
            <span className="md:hidden">
              Welcome! Join us to explore amazing features
            </span>
            <span className="hidden md:inline">
              Welcome to our platform! Sign in or create an account to unlock
              all features
            </span>
            <span className="block sm:ml-2 sm:inline-block">
              <Link
                href="/register"
                className="text-white font-bold underline hover:text-indigo-100 transition-colors"
              >
                Get Started <span aria-hidden="true">&rarr;</span>
              </Link>
            </span>
          </p>
        </div>
        <div className="absolute inset-y-0 right-0 pt-1 pr-1 flex items-start sm:pt-1 sm:pr-2 sm:items-start">
          <button
            type="button"
            onClick={closeBanner}
            aria-label="Close announcement"
            className="flex p-2 rounded-md hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-white transition-colors cursor-pointer"
          >
            <svg
              className="h-6 w-6 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
