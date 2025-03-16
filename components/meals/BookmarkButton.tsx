// 'use client';
// import { useState, useEffect } from 'react';
// import { FaBookmark, FaRegBookmark } from 'react-icons/fa';
// import { useSession } from 'next-auth/react';
// import checkBookmarkStatus from '@/app/actions/checkBookmarkStatus';
// import toast from 'react-hot-toast';
// import bookmarkMeal from '@/app/actions/bookmarkMeal';

// interface Restaurant {
//   name: string;
//   address: string;
// }

// interface Meal {
//   _id: string;
//   name: string;
//   image: string[];
//   restaurant: Restaurant;
// }

// interface BookmarkButtonProps {
//   meal: Meal;
// }

// interface BookmarkResponse {
//   isBookmarked?: boolean;
//   message?: string;
//   error?: string;
// }

// const BookmarkButton = ({ meal }: BookmarkButtonProps) => {
//   const { data: session } = useSession();
//   const userId = session?.user?.id;

//   const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [isProcessing, setIsProcessing] = useState<boolean>(false);

//   useEffect(() => {
//     if (!userId) {
//       setLoading(false);
//       return;
//     }

//     checkBookmarkStatus(meal._id).then((res: BookmarkResponse) => {
//       if (res.error) toast.error(res.error);
//       if (res.isBookmarked) setIsBookmarked(res.isBookmarked);
//       setLoading(false);
//     });
//   }, [meal._id, userId]);

//   const handleClick = async (): Promise<void> => {
//     if (!userId) {
//       toast.error('You need to sign in to bookmark a meal');
//       return;
//     }

//     setIsProcessing(true);
//     try {
//       const res: BookmarkResponse = await bookmarkMeal(meal._id);
//       if (res.error) {
//         toast.error(res.error);
//         return;
//       }
//       setIsBookmarked(res.isBookmarked || false);
//       toast.success(res.message || 'Bookmark updated');
//     } catch (error: any) {
//       toast.error('Failed to update bookmark' + error.message);
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="w-full h-10 bg-gray-200 animate-pulse rounded-full"></div>
//     );
//   }

//   return (
//     <button
//       onClick={handleClick}
//       disabled={isProcessing}
//       className={`
//         relative w-full py-2.5 px-4 rounded-full
//         font-semibold text-sm
//         transition-all duration-200 ease-in-out
//         flex items-center justify-center gap-2
//         ${isProcessing ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'}
//         ${
//           isBookmarked
//             ? 'bg-red-500 hover:bg-red-600 text-white'
//             : 'bg-blue-500 hover:bg-blue-600 text-white'
//         }
//         focus:outline-none focus:ring-2 focus:ring-offset-2
//         ${isBookmarked ? 'focus:ring-red-500' : 'focus:ring-blue-500'}
//         transform hover:scale-[0.98] active:scale-[0.95]
//       `}
//     >
//       {isProcessing ? (
//         <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
//       ) : (
//         <>
//           {isBookmarked ? (
//             <FaBookmark className="text-lg" />
//           ) : (
//             <FaRegBookmark className="text-lg" />
//           )}
//         </>
//       )}
//       <span>
//         {isProcessing
//           ? 'Processing...'
//           : isBookmarked
//           ? 'Remove Bookmark'
//           : 'Bookmark Meal'}
//       </span>
//     </button>
//   );
// };

// export default BookmarkButton;

'use client';
import { useState } from 'react';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';

interface BookmarkButtonProps {
  initialBookmarked?: boolean;
}

const BookmarkButton = ({ initialBookmarked = false }: BookmarkButtonProps) => {
  const [isBookmarked, setIsBookmarked] = useState<boolean>(initialBookmarked);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleClick = (): void => {
    setIsProcessing(true);

    // Simulate processing delay
    setTimeout(() => {
      setIsBookmarked(!isBookmarked);
      setIsProcessing(false);
    }, 500);
  };

  return (
    <button
      onClick={handleClick}
      disabled={isProcessing}
      className={`
        relative w-full py-2.5 px-4 rounded-full
        font-semibold text-sm
        transition-all duration-200 ease-in-out
        flex items-center justify-center gap-2
        ${isProcessing ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'}
        ${
          isBookmarked
            ? 'bg-red-500 hover:bg-red-600 text-white'
            : 'bg-blue-500 hover:bg-blue-600 text-white'
        }
        focus:outline-none focus:ring-2 focus:ring-offset-2
        ${isBookmarked ? 'focus:ring-red-500' : 'focus:ring-blue-500'}
        transform hover:scale-[0.98] active:scale-[0.95]
      `}
    >
      {isProcessing ? (
        <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
      ) : (
        <>
          {isBookmarked ? (
            <FaBookmark className="text-lg" />
          ) : (
            <FaRegBookmark className="text-lg" />
          )}
        </>
      )}
      <span>
        {isProcessing
          ? 'Processing...'
          : isBookmarked
          ? 'Remove Bookmark'
          : 'Bookmark Meal'}
      </span>
    </button>
  );
};

export default BookmarkButton;
