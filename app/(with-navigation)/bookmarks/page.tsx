import { getSessionUser } from '@/utils/getSessionUser';
import { redirect } from 'next/navigation';
import connectDB from '@/config/database';
import User from '@/models/User';
import { convertToObject } from '@/utils/convertToObject';
import SavedMealsGrid from '@/components/meals/BookmarkGrid';
import { Bookmark, Heart, Clock } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

// ✅ Define types for populated user
interface PopulatedUser {
  _id: string;
  name: string;
  email: string;
  image?: string;
  bookmarks: string[];
  createdAt: Date;
  updatedAt: Date;
}

export default async function SavedMealsPage() {
  // Check authentication
  const sessionUser = await getSessionUser();
  if (!sessionUser) {
    redirect('/login');
  }

  try {
    await connectDB();

    const user = (await User.findById(sessionUser.userId)
      .populate({
        path: 'bookmarks',
        model: 'Meal',
        match: { isActive: { $ne: false } },
      })
      .lean()) as PopulatedUser | null;

    if (!user) {
      redirect('/login');
    }

    // Convert bookmarked meals to plain objects
    const bookmarkedMeals = user.bookmarks.map((meal: any) =>
      convertToObject(meal)
    );
    console.log('📚 [SERVER] Found bookmarked meals:', bookmarkedMeals.length);

    return (
      <div className="md:ml-72 lg:ml-80 pt-16 md:pt-20 min-h-screen">
        <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-amber-500/20 rounded-xl">
                <Bookmark className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Saved Meals</h1>
                <p className="text-gray-400 mt-1">
                  Your bookmarked meals • {bookmarkedMeals.length} items saved
                </p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-black/50 border border-gray-800 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <Bookmark className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Total Saved</p>
                    <p className="text-xl font-bold text-white">
                      {bookmarkedMeals.length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-black/50 border border-gray-800 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <Heart className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Available Now</p>
                    <p className="text-xl font-bold text-white">
                      {
                        bookmarkedMeals.filter(
                          (meal: any) => meal.stockQuantity > 0
                        ).length
                      }
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-black/50 border border-gray-800 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-500/20 rounded-lg">
                    <Clock className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Expiring Soon</p>
                    <p className="text-xl font-bold text-white">
                      {
                        bookmarkedMeals.filter(
                          (meal: any) =>
                            meal.timeRemaining === '1 hour' ||
                            meal.timeRemaining === '2 hours'
                        ).length
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Meals Grid */}
          {bookmarkedMeals.length > 0 ? (
            <SavedMealsGrid meals={bookmarkedMeals} />
          ) : (
            <EmptyBookmarks />
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error('❌ [SERVER] Error loading saved meals:', error);
    return (
      <div className="md:ml-72 lg:ml-80 pt-16 md:pt-6 min-h-screen">
        <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
          <ErrorState />
        </div>
      </div>
    );
  }
}

// Empty state component
const EmptyBookmarks = () => (
  <div className="text-center py-16">
    <div className="max-w-md mx-auto">
      <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
        <Bookmark className="w-10 h-10 text-gray-500" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">
        No Saved Meals Yet
      </h3>
      <p className="text-gray-400 mb-8">
        Start bookmarking meals you like to see them here. Browse our collection
        and save your favorites!
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/meals"
          className="bg-amber-500 hover:bg-amber-600 text-black font-medium py-3 px-6 rounded-lg transition-colors"
        >
          Browse Meals
        </Link>
        <a
          href="/restaurants"
          className="bg-gray-800 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-lg transition-colors border border-gray-700"
        >
          Explore Restaurants
        </a>
      </div>
    </div>
  </div>
);

// Error state component
const ErrorState = () => (
  <div className="text-center py-16">
    <div className="max-w-md mx-auto">
      <div className="w-24 h-24 bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
        <span className="text-3xl">⚠️</span>
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">
        Something Went Wrong
      </h3>
      <p className="text-gray-400 mb-8">
        {"We couldn't load your saved meals. Please try refreshing the page."}
      </p>
      <button
        onClick={() => window.location.reload()}
        className="bg-amber-500 hover:bg-amber-600 text-black font-medium py-3 px-6 rounded-lg transition-colors"
      >
        Refresh Page
      </button>
    </div>
  </div>
);

export async function generateMetadata() {
  return {
    title: 'Saved Meals - GoMealSaver',
    description: 'View and manage your bookmarked meals',
  };
}
