'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function DesktopNav() {
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Beranda' },
    { href: '/meals', label: 'Makanan' },
    { href: '/promo', label: 'Promo' },
    { href: '/aboutus', label: 'About Us' },
  ];

  return (
    <div className="hidden md:flex items-center space-x-8">
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`${
            pathname === link.href
              ? 'text-amber-500 dark:text-amber-500'
              : 'text-gray-700 dark:text-gray-200'
          } hover:text-amber-600 dark:hover:text-amber-500 px-3 py-2 text-sm font-semibold transition-all duration-200`}
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
}
