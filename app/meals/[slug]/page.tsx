// import { isValidObjectId } from 'mongoose';
// import connectDB from '@/config/database';
// import Meal from '@/models/Meals';
// import MealDetail from '@/components/meals/MealDetail';
// import Link from 'next/link';
// import { FaArrowLeft } from 'react-icons/fa';
// import { convertToObject } from '@/utils/convertToObject';
// import MealsHeaderImage from '@/components/meals/MealHeaderImage';
// import BookmarkButton from '@/components/meals/BookmarkButton';
// import ShareButton from '@/components/meals/ShareButton';
// // import MealContactForm from '@/components/MealContactForm';
// // import ReviewPage from '@/components/Review';
// import MealsImages from '@/components/meals/MealsImage';

// interface Params {
//   slug: string;
// }

// export default async function MealPage({ params }: { params: Params }) {
//   await connectDB();

//   // Invalid Meal ID Handler
//   if (!isValidObjectId(params.slug)) {
//     return (
//       <div className="flex min-h-screen items-center justify-center bg-red-50 p-4">
//         <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
//           <div className="text-center">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="mx-auto mb-4 h-16 w-16 text-red-500"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
//               />
//             </svg>
//             <h2 className="text-2xl font-bold text-red-600">Invalid Meal ID</h2>
//             <p className="mt-2 text-gray-600">
//               The meal identifier you provided is not valid.
//             </p>
//             <Link
//               href="/meals"
//               className="mt-4 inline-block rounded-full bg-red-500 px-4 py-2 text-white hover:bg-red-600 transition-colors"
//             >
//               Return to Meals
//             </Link>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   try {
//     const mealDoc = await Meal.findById(params.slug).lean();

//     // Meal Not Found Handler
//     if (!mealDoc) {
//       return (
//         <div className="flex min-h-screen items-center justify-center bg-amber-50 p-4">
//           <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
//             <div className="text-center">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="mx-auto mb-4 h-16 w-16 text-amber-500"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//                 />
//               </svg>
//               <h2 className="text-2xl font-bold text-amber-600">
//                 Meal Not Found
//               </h2>
//               <p className="mt-2 text-gray-600">
//                 The meal you are looking for does not exist.
//               </p>
//               <Link
//                 href="/meals"
//                 className="mt-4 inline-block rounded-full bg-amber-500 px-4 py-2 text-white hover:bg-amber-600 transition-colors"
//               >
//                 Back to Meals
//               </Link>
//             </div>
//           </div>
//         </div>
//       );
//     }

//     const meal = convertToObject(mealDoc);

//     return (
//       <div className="min-h-screen bg-gradient-to-b from-white to-green-50">
//         <MealsHeaderImage image={meal.image[0]} />

//         <div className="container mx-auto px-4 py-8">
//           {/* Navigation Back Button */}
//           <div className="mb-6">
//             <Link
//               href="/meals"
//               className="inline-flex items-center rounded-full bg-green-500 px-4 py-2 text-white shadow-md hover:bg-green-600 transition-all"
//             >
//               <FaArrowLeft className="mr-2" />
//               <span className="font-medium">Back to Meals</span>
//             </Link>
//           </div>

//           {/* Main Content Grid */}
//           <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 mb-8">
//             {/* Meal Details Section */}
//             <div className="lg:col-span-2">
//               <div className="rounded-2xl bg-white p-8 shadow-xl">
//                 <MealDetail meal={meal} />
//               </div>
//             </div>

//             {/* Sidebar Section */}
//             <div className="lg:col-span-1">
//               {/* Booking and Interaction Buttons */}
//               <div className="rounded-2xl bg-white p-6 shadow-xl">
//                 <div className="space-y-4">
//                   {/* <BookmarkButton meal={meal} /> */}
//                   <BookmarkButton />
//                   <ShareButton meal={meal} />
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div>
//             <MealsImages images={meal.image} />
//           </div>

//           {/* Reviews Section - Now at the bottom */}
//           <div className="w-full shadow-xl"></div>
//         </div>
//       </div>
//     );
//   } catch (error) {
//     console.error('Error fetching meal:', error);

//     // Error Handling UI
//     return (
//       <div className="flex min-h-screen items-center justify-center bg-red-50 p-4">
//         <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
//           <div className="text-center">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="mx-auto mb-4 h-16 w-16 text-red-500"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//               />
//             </svg>
//             <h2 className="text-2xl font-bold text-red-600">
//               Error Loading Meal
//             </h2>
//             <p className="mt-2 text-gray-600">
//               We encountered an issue while retrieving the meal details.
//             </p>
//             <Link
//               href="/meals"
//               className="mt-4 inline-block rounded-full bg-red-500 px-4 py-2 text-white hover:bg-red-600 transition-colors"
//             >
//               Return to Meals
//             </Link>
//           </div>
//         </div>
//       </div>
//     );
//   }
// }

import { isValidObjectId } from 'mongoose';
import connectDB from '@/config/database';
import Meal from '@/models/Meals';
import MealDetail from '@/components/meals/MealDetail';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';
import { convertToObject } from '@/utils/convertToObject';
// import MealsHeaderImage from '@/components/meals/MealHeaderImage';
import BookmarkButton from '@/components/meals/BookmarkButton';
import ShareButton from '@/components/meals/ShareButton';
import MealsImages from '@/components/meals/MealsImage';

interface Params {
  slug: string;
}

export default async function MealPage({ params }: { params: Params }) {
  await connectDB();

  // Invalid Meal ID Handler
  if (!isValidObjectId(params.slug)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0A0A0A] p-4">
        <div className="w-full max-w-md rounded-xl bg-[#141414] p-8 shadow-xl border border-gray-800">
          <div className="text-center">
            <div className="mx-auto mb-6 h-16 w-16 rounded-full bg-amber-500/20 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-amber-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-amber-500">
              Invalid Meal ID
            </h2>
            <p className="mt-2 text-gray-400">
              The meal identifier you provided is not valid.
            </p>
            <Link
              href="/meals"
              className="mt-6 inline-block rounded-full bg-amber-500 px-6 py-2.5 text-white hover:bg-amber-600 transition-all shadow-lg hover:shadow-amber-500/20"
            >
              Return to Meals
            </Link>
          </div>
        </div>
      </div>
    );
  }

  try {
    const mealDoc = await Meal.findById(params.slug).lean();

    // Meal Not Found Handler
    if (!mealDoc) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-[#0A0A0A] p-4">
          <div className="w-full max-w-md rounded-xl bg-[#141414] p-8 shadow-xl border border-gray-800">
            <div className="text-center">
              <div className="mx-auto mb-6 h-16 w-16 rounded-full bg-amber-500/20 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-amber-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-amber-500">
                Meal Not Found
              </h2>
              <p className="mt-2 text-gray-400">
                The meal you are looking for does not exist.
              </p>
              <Link
                href="/meals"
                className="mt-6 inline-block rounded-full bg-amber-500 px-6 py-2.5 text-white hover:bg-amber-600 transition-all shadow-lg hover:shadow-amber-500/20"
              >
                Back to Meals
              </Link>
            </div>
          </div>
        </div>
      );
    }

    const meal = convertToObject(mealDoc);

    return (
      <div className="min-h-screen bg-[#0A0A0A] pt-32">
        {/* Hero Image Section */}
        {/* <MealsHeaderImage image={meal.image[0]} /> */}

        <div className="container mx-auto px-4 py-8 -mt-16 relative z-10">
          {/* Navigation Back Button */}
          <div className="mb-6 flex flex-wrap gap-4 justify-between items-center">
            <Link
              href="/meals"
              className="inline-flex items-center rounded-full bg-amber-500 px-4 py-2 text-white shadow-md hover:bg-amber-600 transition-all hover:-translate-y-0.5"
            >
              <FaArrowLeft className="mr-2" />
              <span className="font-medium">Back to Meals</span>
            </Link>

            {/* Mobile Share Button (Only visible on small screens) */}
            <div className="block sm:hidden">
              <ShareButton meal={meal} isMobile={true} />
            </div>
          </div>

          {/* Main Content Grid with improved responsiveness */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-8">
            {/* Meal Details Section */}
            <div className="lg:col-span-2 order-2 lg:order-1">
              <div className="rounded-xl bg-[#141414] p-4 sm:p-6 md:p-8 shadow-xl border border-gray-800">
                <MealDetail meal={meal} />
              </div>
            </div>

            {/* Sidebar Section - Moved above on mobile for better UX */}
            <div className="lg:col-span-1 order-1 lg:order-2">
              {/* Booking and Interaction Buttons */}
              <div className="rounded-xl bg-[#141414] p-4 sm:p-6 shadow-xl sticky top-20 border border-gray-800">
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-white mb-4">Actions</h3>
                  <BookmarkButton />

                  {/* Desktop Share Button (Hidden on mobile) */}
                  <div className="hidden sm:block">
                    <ShareButton meal={meal} />
                  </div>

                  {/* Order Button */}
                  <button className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold rounded-full flex items-center justify-center gap-2 transition-all duration-300 shadow-lg hover:shadow-amber-500/20 hover:-translate-y-0.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    Order Now
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Image Gallery Section */}
          <div className="bg-[#141414] rounded-xl p-4 sm:p-6 md:p-8 shadow-xl mb-8 border border-gray-800">
            <h2 className="text-2xl font-bold text-white mb-6">Gallery</h2>
            <MealsImages images={meal.image} />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching meal:', error);

    // Error Handling UI
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0A0A0A] p-4">
        <div className="w-full max-w-md rounded-xl bg-[#141414] p-8 shadow-xl border border-gray-800">
          <div className="text-center">
            <div className="mx-auto mb-6 h-16 w-16 rounded-full bg-amber-500/20 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-amber-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-amber-500">
              Error Loading Meal
            </h2>
            <p className="mt-2 text-gray-400">
              We encountered an issue while retrieving the meal details.
            </p>
            <Link
              href="/meals"
              className="mt-6 inline-block rounded-full bg-amber-500 px-6 py-2.5 text-white hover:bg-amber-600 transition-all shadow-lg hover:shadow-amber-500/20"
            >
              Return to Meals
            </Link>
          </div>
        </div>
      </div>
    );
  }
}
