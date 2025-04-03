'use client';
import { useState, useEffect } from 'react';

export function useNavbarScroll() {
  const [isVisible, setIsVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

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
  return { isVisible, isScrolled };
}
