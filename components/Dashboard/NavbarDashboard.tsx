'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { RiDashboardLine } from 'react-icons/ri';
import { MdOutlineInventory2 } from 'react-icons/md';
import { BiHistory } from 'react-icons/bi';
import { IoStatsChartOutline } from 'react-icons/io5';
import { RxHamburgerMenu } from 'react-icons/rx';
import { IoMdClose } from 'react-icons/io';
import { FiChevronRight } from 'react-icons/fi';
import { Bell, User } from 'lucide-react';
import ProfileDefault from '@/public/profile.png';
import Image from 'next/image';

interface NavbarDashboardProps {
  user: {
    name: string;
    image: string;
    email: string;
  };
  children: React.ReactNode;
}

export default function NavbarDashboard({
  user,
  children,
}: NavbarDashboardProps) {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);

    // Close mobile nav when screen size changes to desktop
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsNavOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navItems = [
    {
      name: 'Dashboard',
      href: '/dashboard-seller',
      icon: <RiDashboardLine className="w-5 h-5" />,
    },
    {
      name: 'Products',
      href: '/dashboard-seller/products',
      icon: <MdOutlineInventory2 className="w-5 h-5" />,
    },
    {
      name: 'Orders',
      href: '/dashboard-seller/orders',
      icon: <BiHistory className="w-5 h-5" />,
    },
    {
      name: 'Analytics',
      href: '/dashboard-seller/analytics',
      icon: <IoStatsChartOutline className="w-5 h-5" />,
    },
    // {
    //   name: 'Settings',
    //   href: '/dashboard-seller/settings',
    //   icon: <FiSettings className="w-5 h-5" />,
    // },
  ];

  const toggleNav = () => setIsNavOpen(!isNavOpen);

  // Prevent flash of unstyled content
  if (!isMounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Top Navigation Bar for Mobile */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-black border-b border-gray-800 z-40 px-4 py-3 flex items-center">
        <button
          onClick={toggleNav}
          className="p-2 rounded-full bg-gray-800 text-gray-300 hover:bg-amber-500 hover:text-white transition-all"
          aria-label="Toggle navigation"
        >
          {isNavOpen ? (
            <IoMdClose className="w-5 h-5" />
          ) : (
            <RxHamburgerMenu className="w-5 h-5" />
          )}
        </button>
        <h1 className="text-lg font-bold text-amber-500 mx-auto">
          GoMealSaver
        </h1>
        <div className="flex items-center gap-3">
          <button className="relative text-gray-400 hover:text-amber-500">
            <Bell size={20} />
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-amber-500"></span>
          </button>
          <button className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-300">
            <User size={16} />
          </button>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 bg-black border-r border-gray-800 transform transition-all duration-300 ease-in-out z-50 w-72 lg:w-80 ${
          isNavOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:z-30 overflow-y-auto`}
      >
        <div className="h-full flex flex-col">
          {/* Brand Logo/Title Section */}
          <div className="p-6 border-b border-gray-800 flex items-center justify-center">
            <div className="py-2">
              <h1 className="text-2xl font-bold text-amber-500">GoMealSaver</h1>
              <p className="text-sm text-gray-400 mt-1">Seller Dashboard</p>
            </div>
          </div>

          {/* Navigation Section */}
          <nav className="flex-1 py-6 px-4 space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-4 py-3.5 rounded-lg transition-all ${
                    isActive
                      ? 'bg-amber-500 text-black font-medium'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span>{item.name}</span>
                  {isActive ? (
                    <span className="ml-auto">
                      <FiChevronRight className="h-4 w-4" />
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-gray-800">
            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-amber-500 flex items-center justify-center">
                  <Image
                    src={user.image || ProfileDefault}
                    alt="Profile"
                    width={50}
                    height={50}
                    className="rounded-full ring-2 ring-gray-800"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{user.name}</p>
                  <p className="text-xs text-gray-400">{user.email}</p>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-700">
                <Link
                  href="/"
                  className="flex items-center justify-center px-4 py-2 text-sm rounded-lg bg-transparent border border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-black transition-colors"
                >
                  <span>Return to Home</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 pt-16 md:pt-0 bg-gray-900">
        <div className="container mx-auto px-4 py-6">{children}</div>
      </main>
      {/* Overlay for mobile when nav is open */}
      {isNavOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 z-40 md:hidden"
          onClick={toggleNav}
          aria-hidden="true"
        ></div>
      )}
    </div>
  );
}
