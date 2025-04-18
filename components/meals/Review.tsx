import connectDB from '@/config/database';
import Review from '@/models/Review';
import { convertToObject } from '@/utils/convertToObject';
import { Star, MessageCircle, Calendar, AlertCircle } from 'lucide-react';
import Image from 'next/image';

interface Review {
  _id: string;
  name: string;
  rating: number;
  review: string;
  createdAt: string;
  user?: {
    image?: string;
  };
}

interface ReviewProps {
  meal: Review;
}

export default async function MealReview({ meal }: ReviewProps) {
  if (!meal) {
    console.log('No meal provided');
    return null;
  }

  try {
    await connectDB();

    const reviewDocs = await Review.find({ meal: meal }).lean();

    if (!reviewDocs || reviewDocs.length === 0) {
      return (
        <div className="bg-[#141414] border-2 border-gray-800 rounded-2xl shadow-xl shadow-amber-900/10 overflow-hidden mt-8">
          <div className="p-8">
            <div className="flex flex-col items-center justify-center h-40 space-y-3">
              <div className="w-16 h-16 rounded-full bg-amber-900/10 flex items-center justify-center">
                <MessageCircle className="h-8 w-8 text-amber-500" />
              </div>
              <p className="text-gray-400 dark:text-gray-400 text-center">
                No reviews available yet. Be the first to share your experience!
              </p>
            </div>
          </div>
        </div>
      );
    }

    const reviews = reviewDocs.map((doc) => convertToObject(doc));

    return (
      <div className="bg-[#141414] border-2 border-gray-800 rounded-2xl shadow-xl shadow-amber-900/10 overflow-hidden mt-8">
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-amber-900/20 rounded-full">
                <MessageCircle className="h-5 w-5 text-amber-500" />
              </div>
              <h2 className="text-xl font-bold text-white">Customer Reviews</h2>
            </div>
            <span className="bg-amber-900/20 text-amber-500 text-sm font-medium px-3 py-1 rounded-full">
              {reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}
            </span>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="bg-[#1A1A1A] rounded-xl border border-gray-800 hover:border-amber-900/50 transition-all duration-300"
              >
                <div className="p-5">
                  {/* Header Section */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-start space-x-3">
                      <div className="relative h-10 w-10 rounded-full overflow-hidden bg-amber-900/20 flex items-center justify-center">
                        {review.user?.image ? (
                          <Image
                            src={review.user.image}
                            alt={review.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <span className="text-amber-500 font-medium text-sm">
                            {review.name.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">
                          {review.name}
                        </h3>
                        <div className="flex items-center mt-1">
                          {[...Array(5)].map((_, index) => (
                            <Star
                              key={index}
                              size={14}
                              className={`${
                                index < review.rating
                                  ? 'fill-amber-500 text-amber-500'
                                  : 'fill-gray-800 text-gray-800'
                              }`}
                            />
                          ))}
                          <span className="ml-2 text-sm text-gray-400">
                            {review.rating.toFixed(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-amber-900/10 text-amber-500 text-xs px-2 py-1 rounded-md font-medium">
                      {new Date(review.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </div>
                  </div>

                  {/* Review Content */}
                  <div className="py-2 border-t border-gray-800">
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {review.review}
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-800">
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar size={12} className="mr-1" />
                      <time dateTime={review.createdAt}>
                        Posted{' '}
                        {new Date(review.createdAt).toLocaleDateString(
                          'en-US',
                          {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          }
                        )}
                      </time>
                    </div>
                    <button className="text-amber-500 hover:text-amber-400 text-xs font-medium transition-colors">
                      Helpful?
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return (
      <div className="bg-[#141414] border-2 border-gray-800 rounded-2xl shadow-xl shadow-amber-900/10 overflow-hidden mt-8">
        <div className="p-6">
          <div className="flex items-center justify-center space-x-2 text-red-500">
            <AlertCircle size={18} />
            <span className="font-medium">Error loading reviews</span>
          </div>
        </div>
      </div>
    );
  }
}
