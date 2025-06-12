'use client';

import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Footer() {
  // Daftar path yang tidak menampilkan footer
  const pathname = usePathname();
  const excludedPaths = [
    '/register',
    '/forgot-password',
    '/dashboard',
    '/profile/setting',
    '/profile',
  ];

  // Periksa apakah halaman saat ini dalam daftar hideNavbarPaths
  const isExcludedPath = excludedPaths.some((path) =>
    pathname?.startsWith(path)
  );

  // Jika halaman saat ini dalam daftar, jangan render navbar
  if (isExcludedPath) {
    return null; // Kembalikan null tanpa menjalankan hooks
  }

  return (
    <footer className="mt-[100px] space-y-[30px] md:space-y-[50px] bg-[#141414] py-[50px] md:py-[100px]">
      <div className="mx-auto max-w-[1280px] px-4 md:px-[75px]">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4 md:flex md:justify-between">
          {/* Solutions Column */}
          <div className="space-y-3">
            <h1 className="text-base font-semibold text-white">Solutions</h1>
            <ul className="space-y-3 text-base text-[#A8A8AB]">
              <li className="hover:text-amber-500">Solusi alokasi makanan sisa menjadi uang </li>
              <li className="hover:text-amber-500">P2P Renting</li>
              <li className="hover:text-amber-500">Open for Listing</li>
              <li className="hover:text-amber-500">AI Automation</li>
              <li className="hover:text-amber-500">APIs Developer</li>
            </ul>
          </div>

          {/* Product Column */}
          <div className="space-y-3">
            <h1 className="text-base font-semibold text-white">Product</h1>
            <ul className="space-y-3 text-base text-[#A8A8AB]">
              <li className="hover:text-amber-500 cursor-pointer">
                Featured Meals
              </li>
              <li className="hover:text-amber-500 cursor-pointer">
                Browse Categories
              </li>
              <li className="hover:text-amber-500 cursor-pointer">
                Special Offers
              </li>
              <li className="hover:text-amber-500 cursor-pointer">
                Local Restaurants
              </li>
              <li className="hover:text-amber-500 cursor-pointer">
                Exclusive Dishes
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div className="space-y-3">
            <h1 className="text-base font-semibold text-white">Company</h1>
            <ul className="space-y-3 text-base text-[#A8A8AB]">
              <li className="hover:text-amber-500 cursor-pointer">About Us</li>
              <li className="hover:text-amber-500 cursor-pointer">
                Our Partners
              </li>
              <li className="hover:text-amber-500 cursor-pointer">
                Missions 2025
              </li>
              <li className="hover:text-amber-500 cursor-pointer">Careers</li>
              <li className="hover:text-amber-500 cursor-pointer">
                Media Press
              </li>
            </ul>
          </div>

          {/* Subscribe Column */}
          <div className="space-y-[20px] md:space-y-[30px] sm:col-span-2 md:col-span-1">
            <div className="space-y-3">
              <h1 className="text-base font-semibold text-white">
                Subscribe & Free Rewards
              </h1>
              <div className="relative flex items-center">
                <Image
                  src="/images/icons/sms.svg"
                  className="absolute left-5 top-0 translate-y-1/2"
                  alt="SMS Icon"
                  height={10}
                  width={20}
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full md:w-[367px] rounded-full px-[54px] py-3 focus:outline-none"
                />
                <button className="absolute right-2 bg-amber-500 hover:bg-amber-600 text-white font-medium px-4 py-2 rounded-full transition-colors">
                  Subscribe
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <h1 className="text-base font-semibold text-white">
                Choose Language
              </h1>
              <div className="flex items-center space-x-[10px] text-white">
                <Image
                  src="/images/icons/uk.svg"
                  alt="UK Flag"
                  height={100}
                  width={20}
                />
                <p>English (UK)</p>
                <span>&#9662;</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1280px] px-4 md:px-[75px]">
        <hr className="h-px border-0 bg-[#353535]" />
      </div>

      <div className="mx-auto flex flex-col md:flex-row max-w-[1280px] items-center justify-between px-4 md:px-[75px] text-[#A8A8A8] space-y-4 md:space-y-0">
        <Image
          src="/images/logos/logo.svg"
          alt="Logo"
          height={100}
          width={200}
        />
        <p className="text-center md:text-left text-sm md:text-base">
          All Rights Reserved GoMealSaver 2025
        </p>
      </div>
    </footer>
  );
}
