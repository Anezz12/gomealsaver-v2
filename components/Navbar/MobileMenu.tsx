'use client';
import { useRef } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useOutsideClick } from '@/hooks/useOutsideClick';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSignOut: () => Promise<void>;
  onOpenLoginModal: () => void;
}

export default function MobileMenu({
  isOpen,
  onClose,
  onSignOut,
  onOpenLoginModal,
}: MobileMenuProps) {
  const { data: session } = useSession();
  const menuRef = useRef<HTMLDivElement>(null);

  useOutsideClick(menuRef as React.RefObject<HTMLElement>, onClose);

  return (
    <div
      ref={menuRef}
      className={`md:hidden fixed inset-x-0 top-[80px] transition-all duration-300 ease-in-out z-50 ${
        isOpen
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 -translate-y-4 pointer-events-none'
      }`}
    >
      <div className="mx-4 rounded-xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-gray-200 dark:border-gray-800 shadow-lg">
        <div className="px-4 py-3 space-y-3">
          <Link
            href="/"
            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-zinc-800 hover:text-amber-600 dark:hover:text-amber-400 font-semibold"
            onClick={onClose}
          >
            Home
          </Link>
          <Link
            href="/meals"
            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-zinc-800 hover:text-amber-600 dark:hover:text-amber-400 font-semibold"
            onClick={onClose}
          >
            Makanan
          </Link>
          {session && (
            <button
              onClick={() => {
                onSignOut();
                onClose();
              }}
              className="w-full text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/50 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
            >
              Sign Out
            </button>
          )}

          {!session && (
            <button
              onClick={() => {
                onOpenLoginModal();
                onClose();
              }}
              className="w-full text-center bg-amber-500 dark:bg-amber-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-amber-700 dark:hover:bg-amber-600 cursor-pointer"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
