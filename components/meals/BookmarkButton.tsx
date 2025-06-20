'use client';

import { useState, useTransition, useEffect } from 'react';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import bookmarkMeal from '@/app/action/bookmarkMeal';
import checkBookmarkStatus from '@/app/action/checkBookmarkSatatus';

// interface Meal {
//   _id: string;
// }

interface BookmarkButtonProps {
  meal: string;
  initialBookmarked?: boolean;
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const BookmarkButton = ({
  meal,
  initialBookmarked = false,
  className = '',
  showText = true,
  size = 'md',
}: BookmarkButtonProps) => {
  const [isBookmarked, setIsBookmarked] = useState<boolean>(initialBookmarked);
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Size configurations
  const sizeConfig = {
    sm: {
      button: 'py-1.5 px-3 text-xs',
      icon: 'text-sm',
      spinner: 'h-3 w-3 border',
    },
    md: {
      button: 'py-2.5 px-4 text-sm',
      icon: 'text-lg',
      spinner: 'h-4 w-4 border-2',
    },
    lg: {
      button: 'py-3 px-6 text-base',
      icon: 'text-xl',
      spinner: 'h-5 w-5 border-2',
    },
  };

  const config = sizeConfig[size];

  // Check initial bookmark status
  useEffect(() => {
    const checkInitialStatus = async () => {
      if (!meal) {
        setIsLoading(false);
        return;
      }

      try {
        console.log('🔍 [CLIENT] Checking initial bookmark status');
        const response = await checkBookmarkStatus(meal);

        if (response.error) {
          console.warn(
            '⚠️ [CLIENT] Error checking bookmark status:',
            response.error
          );
          // Don't show error toast for initial check, just use fallback
          setIsBookmarked(initialBookmarked);
        } else {
          setIsBookmarked(response.isBookmarked);
          console.log(
            '✅ [CLIENT] Initial bookmark status:',
            response.isBookmarked
          );
        }
      } catch (error) {
        console.error('❌ [CLIENT] Failed to check bookmark status:', error);
        setIsBookmarked(initialBookmarked);
      } finally {
        setIsLoading(false);
      }
    };

    checkInitialStatus();
  }, [meal, initialBookmarked]);

  const handleClick = async (): Promise<void> => {
    if (!meal) {
      toast.error('Invalid meal ID', {
        duration: 3000,
        position: 'top-center',
        style: {
          background: '#EF4444',
          color: '#FFFFFF',
          padding: '12px 16px',
          borderRadius: '8px',
        },
        icon: '❌',
      });
      return;
    }

    startTransition(async () => {
      try {
        console.log('🔖 [CLIENT] Bookmark action started for meal:', meal);

        const response = await bookmarkMeal(meal);

        if (response.error) {
          console.error('❌ [CLIENT] Bookmark error:', response.error);
          toast.error(response.error, {
            duration: 4000,
            position: 'top-center',
            style: {
              background: '#EF4444',
              color: '#FFFFFF',
              padding: '12px 16px',
              borderRadius: '8px',
              fontSize: '14px',
            },
            icon: '❌',
          });
          return;
        }

        // Success case
        if (response.isBookmarked !== undefined) {
          setIsBookmarked(response.isBookmarked);

          // Success toast with different messages
          if (response.isBookmarked) {
            toast.success(response.message || 'Meal bookmarked!', {
              duration: 3000,
              position: 'top-center',
              style: {
                background: '#10B981',
                color: '#FFFFFF',
                padding: '12px 16px',
                borderRadius: '8px',
                fontSize: '14px',
              },
              icon: '🔖',
            });
          } else {
            toast.success(response.message || 'Bookmark removed!', {
              duration: 3000,
              position: 'top-center',
              style: {
                background: '#6B7280',
                color: '#FFFFFF',
                padding: '12px 16px',
                borderRadius: '8px',
                fontSize: '14px',
              },
              icon: '🗑️',
            });
          }

          console.log(
            '✅ [CLIENT] Bookmark action completed:',
            response.message
          );
        }
      } catch (error: any) {
        console.error('❌ [CLIENT] Unexpected error:', error);
        toast.error('Something went wrong. Please try again.', {
          duration: 4000,
          position: 'top-center',
          style: {
            background: '#DC2626',
            color: '#FFFFFF',
            padding: '12px 16px',
            borderRadius: '8px',
            fontSize: '14px',
          },
          icon: '⚠️',
        });
      }
    });
  };

  // Show loading state while checking initial status
  if (isLoading) {
    return (
      <button
        disabled
        className={`
          relative w-full ${config.button} rounded-full
          font-semibold bg-gray-700 text-gray-400
          cursor-not-allowed opacity-75
          flex items-center justify-center gap-2
          ${className}
        `}
      >
        <div
          className={`animate-spin ${config.spinner} border-gray-400 border-t-transparent rounded-full`}
        />
        {showText && <span>Loading...</span>}
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className={`
        relative w-full ${config.button} rounded-full
        font-semibold
        transition-all duration-200 ease-in-out
        flex items-center justify-center gap-2
        ${isPending ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'}
        ${
          isBookmarked
            ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/25'
            : 'bg-blue-500 hover:bg-blue-600 text-white shadow-blue-500/25'
        }
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900
        ${isBookmarked ? 'focus:ring-amber-500' : 'focus:ring-blue-500'}
        transform hover:scale-[0.98] active:scale-[0.95]
        shadow-lg hover:shadow-xl
        disabled:transform-none disabled:shadow-lg
        ${className}
      `}
      title={
        isPending
          ? 'Processing...'
          : isBookmarked
          ? 'Remove from bookmarks'
          : 'Add to bookmarks'
      }
    >
      {isPending ? (
        <>
          <div
            className={`animate-spin ${config.spinner} border-white border-t-transparent rounded-full`}
          />
          {showText && <span>Processing...</span>}
        </>
      ) : (
        <>
          {isBookmarked ? (
            <FaBookmark className={`${config.icon} drop-shadow-sm`} />
          ) : (
            <FaRegBookmark className={`${config.icon} drop-shadow-sm`} />
          )}
          {showText && (
            <span className="font-medium">
              {isBookmarked ? 'Bookmarked' : 'Bookmark'}
            </span>
          )}
        </>
      )}
    </button>
  );
};

export default BookmarkButton;
