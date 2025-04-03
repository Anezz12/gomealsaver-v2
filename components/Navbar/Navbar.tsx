'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { Menu, X } from 'lucide-react';
import AdBanner from '@/components/Home/AdBanner';
import DesktopNav from './DesktopNav';
import AuthMenu from './AuthMenu';
import MobileMenu from './MobileMenu';
import LoginModal from './LoginModel';
import { useNavbarScroll } from '@/hooks/useNavbarScroll';

export default function Navbar() {
  const { data: session } = useSession();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isVisible, isScrolled } = useNavbarScroll();

  useEffect(() => {
    const handleResize = (): void => {
      setIsMobileMenuOpen(false);
      setIsLoginModalOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSignOut = async (): Promise<void> => {
    await signOut({ redirect: true, callbackUrl: '/' });
  };

  return (
    <>
      <header>
        <nav
          className={`fixed w-full z-50 transition-all duration-300 ${
            isScrolled
              ? 'bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-lg'
              : 'bg-transparent'
          } ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}
        >
          {!session && <AdBanner />}
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="relative flex h-20 items-center justify-between">
              {/* Logo Section */}
              <div className="flex items-center">
                <Link
                  className="flex items-center space-x-2 transition-transform"
                  href="/"
                >
                  <p className="text-xl font-bold bg-amber-500 bg-clip-text text-transparent">
                    GoMealSaver
                  </p>
                </Link>
              </div>

              {/* Desktop Navigation */}
              <DesktopNav />

              {/* Auth Button & Mobile Menu */}
              <div className="flex items-center space-x-4">
                <AuthMenu onOpenLoginModal={() => setIsLoginModalOpen(true)} />

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="md:hidden p-2 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                >
                  {isMobileMenuOpen ? (
                    <X className="h-6 w-6 text-black dark:text-gray-200" />
                  ) : (
                    <Menu className="h-6 w-6 text-black dark:text-gray-200" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          <MobileMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
            onSignOut={handleSignOut}
            onOpenLoginModal={() => setIsLoginModalOpen(true)}
          />
        </nav>
      </header>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  );
}
