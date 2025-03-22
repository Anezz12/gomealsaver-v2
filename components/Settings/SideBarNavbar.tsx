'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { User, Settings, FileText, LogOut } from 'lucide-react';
import Link from 'next/link';
import defaultAfatar from '@/public/profile.png';

interface ProfilePageProps {
  user: {
    name: string;
    image: string;
  };
  children: React.ReactNode;
}

export default function ProfilePage({ user, children }: ProfilePageProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  // Change this line
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navigation = [
    { name: 'Profile', href: '/profile', icon: User },
    { name: 'Blogs', href: '/profile/blogs', icon: FileText },
    { name: 'Settings', href: '/profile/setting', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 sm:px-8 pt-20 sm:mt-0 pb-24 lg:pb-0">
      <div className="flex flex-col lg:flex-row">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block lg:w-64 bg-white dark:bg-zinc-800 shadow-sm rounded-xl">
          <div className="p-5">
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={toggleDropdown}
                className="flex items-center space-x-4 mb-6 w-full hover:bg-gray-50 dark:hover:bg-zinc-700/50 p-2 rounded-lg transition-colors"
              >
                <Image
                  src={user?.image || defaultAfatar}
                  alt="Profile"
                  width={50}
                  height={50}
                  className="rounded-full ring-2 ring-gray-200 dark:ring-zinc-700"
                />
                <div className="text-left">
                  <h2 className="font-semibold text-gray-800 dark:text-gray-100">
                    {user?.name}
                  </h2>
                </div>
              </button>

              {isDropdownOpen && (
                <div className="absolute top-full left-0 w-full bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg shadow-lg mt-2 py-2 z-50">
                  <Link
                    href="/profile"
                    className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-700/50"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <User size={16} className="mr-2" />
                    View Profile
                  </Link>
                  <button className="flex items-center w-full px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-700/50">
                    <LogOut size={16} className="mr-2" />
                    Sign out
                  </button>
                </div>
              )}
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
                            ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400'
                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-700/50'
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
          <nav className="flex items-center gap-3 px-6 py-3 rounded-full bg-white dark:bg-zinc-800 shadow-lg border border-gray-200 dark:border-zinc-700">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex flex-col items-center justify-center p-2 rounded-full transition-colors duration-200 ${
                    isActive
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
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
        <div className="flex-1 lg:pl-8">{children}</div>
      </div>
    </div>
  );
}
