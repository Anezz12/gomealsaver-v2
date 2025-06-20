'use client';
import { useState, useRef, RefObject } from 'react';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import ProfileDefault from '@/public/profile.png';
import { useOutsideClick } from '@/hooks/useOutsideClick';

interface AuthMenuProps {
  onOpenLoginModal: () => void;
}

export default function AuthMenu({ onOpenLoginModal }: AuthMenuProps) {
  const { data: session, status } = useSession();
  const [isAuthMenuOpen, setIsAuthMenuOpen] = useState(false);
  const authMenuRef = useRef<HTMLDivElement>(null);

  useOutsideClick(authMenuRef as RefObject<HTMLElement>, () =>
    setIsAuthMenuOpen(false)
  );

  const handleSignOut = async (): Promise<void> => {
    await signOut({ redirect: true, callbackUrl: '/' });
    setIsAuthMenuOpen(false);
  };

  if (status === 'loading') {
    return (
      <div className="flex items-center space-x-2 animate-pulse">
        <div className="h-8 w-8 bg-gray-700 rounded-full"></div>
        <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded hidden md:block"></div>
      </div>
    );
  }

  if (session) {
    return (
      <div className="relative" ref={authMenuRef}>
        <button
          onClick={() => setIsAuthMenuOpen(!isAuthMenuOpen)}
          className="flex items-center space-x-2 bg-amber-500 dark:bg-amber-600 text-white px-4 py-2 rounded-full hover:bg-amber-600 dark:hover:bg-amber-700 transition-all duration-200"
        >
          <Image
            src={session.user?.image || ProfileDefault}
            alt="Profile"
            width={32}
            height={32}
            className="rounded-full border-2 border-white dark:border-gray-800"
          />
          <span className="hidden md:block">{session.user?.name}</span>
        </button>

        {isAuthMenuOpen && (
          <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-gray-800 shadow-lg py-1 z-50">
            <Link
              href="/profile"
              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-zinc-800 hover:text-amber-600 dark:hover:text-amber-400 font-semibold"
              onClick={() => setIsAuthMenuOpen(false)}
            >
              Profile
            </Link>
            <Link
              href="/bookmarks"
              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-zinc-800 hover:text-amber-600 dark:hover:text-amber-400 font-semibold"
              onClick={() => setIsAuthMenuOpen(false)}
            >
              Bookmarks
            </Link>
            <button
              onClick={handleSignOut}
              className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/50 font-semibold"
            >
              Sign out
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={onOpenLoginModal}
      className="hidden md:flex items-center space-x-2 bg-amber-500 dark:bg-amber-500 text-white px-6 py-2 rounded-full hover:bg-amber-600 dark:hover:bg-amber-400 transition-all duration-200 cursor-pointer"
    >
      <span className="font-semibold">Sign In</span>
    </button>
  );
}
