'use client';
import Link from 'next/link';
import { useState, useEffect, useRef, MouseEvent } from 'react';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import LoginForm from '../Login/LoginForm';
import { Menu, X } from 'lucide-react';
import AdBanner from './AdBanner';
import ProfileDefault from '@/public/profile.png';

export default function Navbar() {
  const { data: session, status } = useSession();
  const [isAuthMenuOpen, setIsAuthMenuOpen] = useState<boolean>(false);
  const [isLoginModelOpen, setisLoginModelOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [prevScrollPos, setPrevScrollPos] = useState<number>(0);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  // Tentukan tipe untuk ref
  const authMenuRef = useRef<HTMLDivElement>(null);
  const loginModalRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const dekstopMenuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = (): void => {
      const currentScrollPos = window.scrollY;

      // Determine if we're scrolling up or down
      setIsVisible(
        prevScrollPos > currentScrollPos || // Scrolling up
          currentScrollPos < 10 // At the top
      );

      // Update background opacity based on scroll position
      setIsScrolled(currentScrollPos > 20);

      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | any): void => {
      if (authMenuRef.current && !authMenuRef.current.contains(event.target)) {
        setIsAuthMenuOpen(false);
      }
      if (
        loginModalRef.current &&
        !loginModalRef.current.contains(event.target)
      ) {
        setisLoginModelOpen(false);
      }

      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setIsMobileMenuOpen(false);
      }
      if (
        dekstopMenuRef.current &&
        !dekstopMenuRef.current.contains(event.target)
      ) {
        setIsAuthMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleResize = (): void => {
      setIsMobileMenuOpen(false);
      setisLoginModelOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSignOut = async (): Promise<void> => {
    await signOut({ redirect: true, callbackUrl: '/' });
    setIsAuthMenuOpen(false);
  };

  const renderAuthButton = () => {
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
      );
    }

    return (
      <button
        onClick={() => setisLoginModelOpen(true)}
        className="hidden md:flex items-center space-x-2 bg-amber-500 dark:bg-amber-500 text-white px-6 py-2 rounded-full hover:bg-amber-600 dark:hover:bg-amber-400 transition-all duration-200 cursor-pointer"
      >
        <span className="font-semibold">Sign In</span>
      </button>
    );
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
              <div className="hidden md:flex items-center space-x-8">
                <Link
                  href="/"
                  className={`${
                    pathname === '/'
                      ? 'text-amber-500 dark:text-amber-500'
                      : 'text-gray-700 dark:text-gray-200'
                  } hover:text-amber-600 dark:hover:text-amber-500 px-3 py-2 text-sm font-semibold transition-all duration-200`}
                >
                  Beranda
                </Link>
                <Link
                  href="/meals"
                  className={`${
                    pathname === '/meals'
                      ? 'text-amber-500 dark:text-amber-500'
                      : 'text-gray-700 dark:text-gray-200'
                  } hover:text-amber-600 dark:hover:text-amber-500 px-3 py-2 text-sm font-semibold transition-all duration-200`}
                >
                  Makanan
                </Link>
                <Link
                  href="/promo"
                  className={`${
                    pathname === '/promo'
                      ? 'text-amber-500 dark:text-amber-500'
                      : 'text-gray-700 dark:text-gray-200'
                  } hover:text-amber-600 dark:hover:text-amber-500 px-3 py-2 text-sm font-semibold transition-all duration-200`}
                >
                  Promo
                </Link>
                <Link
                  href="/aboutus"
                  className={`${
                    pathname === '/aboutus'
                      ? 'text-amber-500 dark:text-amber-500'
                      : 'text-gray-700 dark:text-gray-200'
                  } hover:text-amber-600 dark:hover:text-amber-500 px-3 py-2 text-sm font-semibold transition-all duration-200`}
                >
                  About Us
                </Link>
              </div>
              {/* Auth Button */}
              <div className="flex items-center space-x-4">
                <div className="relative" ref={authMenuRef}>
                  {renderAuthButton()}

                  {isAuthMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-gray-800 shadow-lg py-1 z-50">
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-zinc-800 hover:text-amber-600 dark:hover:text-amber-400 font-semibold"
                        onClick={() => setIsAuthMenuOpen(false)}
                      >
                        Profile
                      </Link>
                      {/* <ToggleButton /> */}
                      <button
                        onClick={handleSignOut}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/50 font-semibold"
                      >
                        Sign out
                      </button>
                    </div>
                  )}
                </div>

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
          <div
            ref={mobileMenuRef}
            className={`md:hidden fixed inset-x-0 top-[80px] transition-all duration-300 ease-in-out z-50 ${
              isMobileMenuOpen
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 -translate-y-4 pointer-events-none'
            }`}
          >
            <div className="mx-4 rounded-xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-gray-200 dark:border-gray-800 shadow-lg">
              <div className="px-4 py-3 space-y-3">
                <Link
                  href="/"
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-zinc-800 hover:text-amber-600 dark:hover:text-amber-400 font-semibold"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="/meals"
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-zinc-800 hover:text-amber-600 dark:hover:text-amber-400 font-semibold"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Makanan
                </Link>
                {session && (
                  <>
                    <button
                      onClick={() => {
                        handleSignOut();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/50 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
                    >
                      Sign Out
                    </button>
                  </>
                )}

                <div>
                  {!session && (
                    <button
                      onClick={() => {
                        setisLoginModelOpen(true);
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full text-center bg-amber-500 dark:bg-amber-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-amber-700 dark:hover:bg-amber-600 cursor-pointer"
                    >
                      Sign In
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
      {/* Login Modal */}
      {isLoginModelOpen && (
        <section className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-[60]">
          <div
            ref={loginModalRef}
            className="relative mx-4 w-full max-w-[90%] sm:max-w-[450px] bg-[#141414] shadow-amber-900/10 rounded-xl shadow-xl p-4 sm:p-6 md:p-8 overflow-hidden"
          >
            <button
              onClick={() => setisLoginModelOpen(false)}
              className="absolute top-3 right-3 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400"
            >
              <X className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600 cursor-pointer" />
            </button>
            <div className="flex items-center justify-center mb-4 sm:mb-6">
              <span className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-amber-500">
                GoMealSaver
              </span>
            </div>
            <LoginForm onClose={() => setisLoginModelOpen(false)} />
          </div>
        </section>
      )}
    </>
  );
}
