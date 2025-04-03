import { useEffect, RefObject } from 'react';

type Handler = () => void;

export function useOutsideClick(
  ref: RefObject<HTMLElement>,
  handler: Handler
): void {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [ref, handler]);
}
