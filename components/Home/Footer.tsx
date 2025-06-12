'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();
  const excludedPaths = [
    '/register',
    '/forgot-password',
    '/dashboard',
    '/profile/setting',
    '/profile',
  ];

  const isExcludedPath = excludedPaths.some((path) =>
    pathname?.startsWith(path)
  );

  if (isExcludedPath) {
    return null;
  }

  return (
    <footer className="mt-16 md:mt-20 bg-[#141414] py-8 md:py-16">
      <div className="container mx-auto px-4 md:px-[75px] max-w-[1280px]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {/* GoMealSaver Column */}
          <div className="space-y-4 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start space-x-3">
              <h2 className="text-lg md:text-2xl font-bold text-white">GoMealSaver</h2>
            </div>
            <p className="text-sm md:text-base text-gray-300 px-6 sm:px-0">
              Solusi transaksi makanan sisa yang tidak terjual dengan mudah menggunakan aplikasi GoMealSaver.
            </p>
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="text-blue-300">✉️</span>
              <Link
                href="mailto:contact@gomealsaver.com"
                className="text-sm md:text-base text-gray-300 hover:text-blue-300 transition-colors"
              >
                contact@gomealsaver.com
              </Link>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="space-y-4 text-center sm:text-left sm:pl-25 pl-0">
            <h3 className="text-lg font-semibold text-white">Quick Links</h3>
            <ul className="space-y-3 text-sm md:text-base text-gray-300">
              {['Beranda', 'Makanan', 'Promo', 'About Us'].map((item) => (
                <li key={item}>
                  <Link
                    href={`/${item.toLowerCase().replace(' ', '-')}`}
                    className="hover:text-amber-500 transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect With Us */}
          <div className="space-y-4 text-center sm:text-left">
            <h3 className="text-lg font-semibold text-white border-b border-yellow-600 pb-2">
              Connect With Us
            </h3>
            <p className="text-sm md:text-base text-gray-300 px-6 sm:px-0">
              Follow us on social media to get the latest updates.
            </p>
            <div className="flex gap-4 justify-center sm:justify-start">
              {[
                {
                  href: 'https://instagram.com/gomealsaver',
                  path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z',
                },
                {
                  href: 'https://linkedin.com/company/gomealsaver',
                  path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
                },
                {
                  href: 'https://twitter.com/gomealsaver',
                  path: 'M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z',
                },
              ].map((social, index) => (
                <Link
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white p-2 rounded-full text-yellow-600 hover:bg-blue-300 hover:scale-110 transition-all duration-300"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5"
                  >
                    <path d={social.path} />
                  </svg>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="container mx-auto px-4 md:px-[75px] my-6 md:my-8 max-w-[1280px]">
        <hr className="h-px border-0 bg-[#353535]" />
      </div>

      {/* Footer Bottom */}
      <div className="container mx-auto px-4 md:px-[75px] max-w-[1280px]">
        <div className="flex flex-col md:flex-row items-center md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Image
              src="/images/logos/GMS-transparent.png"
              alt="Logo"
              height={35}
              width={35}
              className="w-auto h-auto"
            />
            <h1 className="text-lg md:text-xl font-semibold text-[#ea8500]">GoMealSaver</h1>
          </div>
          <p className="text-center md:text-right text-sm md:text-base text-[#A8A8A8]">
            All Rights Reserved GoMealSaver 2025
          </p>
        </div>
      </div>
    </footer>
  );
}