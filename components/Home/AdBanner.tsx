'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AdBannerSkeleton from '../Skeleton/AdBannerSkeleton';
import { X, Tag } from 'lucide-react';

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
      className="sticky top-0 z-40 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 shadow-md"
    >
      <div className="max-w-7xl mx-auto py-3 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center pr-16 sm:px-16 sm:justify-center">
          <div className="hidden sm:flex shrink-0 mr-3">
            <Tag className="h-5 w-5 text-white" />
          </div>

          <p className="font-medium text-white">
            <span className="md:hidden">Hemat 50% di GoMealSaver!</span>
            <span className="hidden md:inline">
              <span className="font-bold">PROMO SPESIAL:</span> Dapatkan diskon
              hingga 50% untuk makanan pertama Anda di GoMealSaver
            </span>
            <span className="block sm:ml-2 sm:inline-block">
              <Link
                href="/register"
                className="text-white font-bold underline hover:text-amber-100 transition-colors ml-1"
              >
                Gabung Sekarang <span aria-hidden="true">&rarr;</span>
              </Link>
            </span>
          </p>
        </div>

        <div className="absolute inset-y-0 right-0 pt-1 pr-1 flex items-start sm:pt-1 sm:pr-2 sm:items-start">
          <button
            type="button"
            onClick={closeBanner}
            aria-label="Tutup pengumuman"
            className="flex p-2 rounded-md hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-white transition-colors cursor-pointer"
          >
            <X className="h-5 w-5 text-white" />
          </button>
        </div>
      </div>

      {/* Simple subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-amber-500/10 to-transparent pointer-events-none"></div>
    </div>
  );
}
