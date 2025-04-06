'use client';
import { useState, useRef } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { User, Settings, LucideBadgeDollarSign } from 'lucide-react';
import Link from 'next/link';
import ProfileDefault from '@/public/profile.png';

interface ProfilePageProps {
  user: {
    name: string;
    image: string;
  };
  children: React.ReactNode;
}

export default function SideBarNavbar({ user, children }: ProfilePageProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const navigation = [
    { name: 'Profile', href: '/profile', icon: User },
    { name: 'Settings', href: '/profile/setting', icon: Settings },
    {
      name: 'Transaction',
      href: '/profile/transaction',
      icon: LucideBadgeDollarSign,
    },
    { name: 'Dashboard', href: '/dashboard', icon: User },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] sm:px-8 px-8 pt-16 sm:pt-20 sm:mt-0">
      <div className="flex flex-col lg:flex-row">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block lg:w-64 bg-[#141414] border border-gray-800 shadow-md shadow-amber-900/10 rounded-xl">
          <div className="p-5">
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={toggleDropdown}
                className="flex items-center space-x-4 mb-6 w-full hover:bg-[#1A1A1A] p-2 rounded-lg transition-colors"
              >
                <Image
                  src={user?.image || ProfileDefault}
                  alt="Profile"
                  width={50}
                  height={50}
                  className="rounded-full ring-2 ring-gray-800"
                />
                <div className="text-left">
                  <h2 className="font-semibold text-gray-100">{user?.name}</h2>
                </div>
              </button>
            </div>

            <nav className="space-y-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-colors
                        ${
                          isActive
                            ? 'bg-amber-900/20 text-amber-500'
                            : 'text-gray-300 hover:bg-[#1A1A1A]'
                        }`}
                  >
                    <Icon size={20} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Floating Mobile Navigation */}
        <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 lg:hidden z-50">
          <nav className="flex items-center gap-3 px-6 py-3 rounded-full bg-[#141414] shadow-lg border border-gray-800">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex flex-col items-center justify-center p-2 rounded-full transition-colors duration-200 ${
                    isActive
                      ? 'text-amber-500'
                      : 'text-gray-400 hover:text-gray-300'
                  }`}
                >
                  <Icon size={20} />
                  <span className="text-xs mt-1">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="lg:pl-8">{children}</div>
      </div>
    </div>
  );
}
