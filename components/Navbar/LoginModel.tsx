'use client';
import { useRef } from 'react';
import { X } from 'lucide-react';
import LoginForm from '../Login/LoginForm';
import { useOutsideClick } from '@/hooks/useOutsideClick';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useOutsideClick(modalRef as React.RefObject<HTMLElement>, onClose);

  if (!isOpen) return null;

  return (
    <section className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-[60]">
      <div
        ref={modalRef}
        className="relative mx-4 w-full max-w-[90%] sm:max-w-[450px] bg-[#141414] shadow-amber-900/10 rounded-xl shadow-xl p-4 sm:p-6 md:p-8 overflow-hidden"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400"
        >
          <X className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600 cursor-pointer" />
        </button>
        <div className="flex items-center justify-center mb-4 sm:mb-6">
          <span className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-amber-500">
            GoMealSaver
          </span>
        </div>
        <LoginForm onClose={onClose} />
      </div>
    </section>
  );
}
