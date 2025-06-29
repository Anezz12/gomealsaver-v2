'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Star,
  Package,
  User,
  CheckCircle2,
  Send,
  Loader2,
} from 'lucide-react';
import Image from 'next/image';
import { toast } from 'react-hot-toast';

interface TransactionDetail {
  _id: string;
  name: string;
  email: string;
  meal: {
    _id: string;
    title: string;
    price: number;
    images: string[];
    description: string;
    owner: {
      _id: string;
      username: string;
    };
  };
  quantity: number;
  totalPrice: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  confirmedAt?: string;
}

interface ExistingReview {
  _id: string;
  rating: number;
  review: string;
  createdAt: string;
}

export default function RateOrderContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const transactionId = searchParams.get('transactionId');

  const [transaction, setTransaction] = useState<TransactionDetail | null>(
    null
  );
  const [existingReview, setExistingReview] = useState<ExistingReview | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [review, setReview] = useState('');

  // Fetch transaction details and existing review
  useEffect(() => {
    const fetchData = async () => {
      if (!transactionId) {
        toast.error('Transaction ID is required');
        router.push('/profile/transaction');
        return;
      }

      try {
        // Fetch transaction details
        const transactionResponse = await fetch(
          `/api/transactions/user/${transactionId}`
        );
        if (!transactionResponse.ok) {
          throw new Error('Failed to fetch transaction details');
        }
        const transactionData = await transactionResponse.json();
        setTransaction(transactionData.order);

        // Check if review already exists
        const reviewResponse = await fetch(
          `/api/reviews/check?transactionId=${transactionId}`
        );
        if (reviewResponse.ok) {
          const reviewData = await reviewResponse.json();
          if (reviewData.review) {
            setExistingReview(reviewData.review);
            setRating(reviewData.review.rating);
            setReview(reviewData.review.review);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load transaction details');
        router.push('/profile/transaction');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [transactionId, router]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    if (review.trim().length < 10) {
      toast.error('Review must be at least 10 characters long');
      return;
    }

    setSubmitting(true);

    try {
      const method = existingReview ? 'PUT' : 'POST';
      const url = existingReview
        ? `/api/reviews/${existingReview._id}`
        : '/api/reviews';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transactionId,
          mealId: transaction?.meal._id,
          rating,
          review: review.trim(),
          userName: transaction?.name,
        }),
      });

      if (response.ok) {
        toast.success(
          existingReview
            ? 'Review updated successfully!'
            : 'Review submitted successfully!'
        );
        router.push(`/profile/transaction/details?id=${transactionId}`);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="p-3 sm:p-4 md:p-6 lg:p-8 max-w-4xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
        </div>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="p-3 sm:p-4 md:p-6 lg:p-8 max-w-4xl mx-auto">
        <div className="text-center py-12">
          <h1 className="text-xl sm:text-2xl font-bold text-white mb-2">
            Transaction Not Found
          </h1>
          <p className="text-gray-400 mb-6">
            The transaction youre looking for could not be found.
          </p>
          <button
            onClick={() => router.push('/profile/transaction')}
            className="bg-amber-500 hover:bg-amber-600 text-black px-6 py-3 rounded-lg font-medium"
          >
            Back to Transactions
          </button>
        </div>
      </div>
    );
  }

  const orderIdDisplay = `ORD-${transaction._id.slice(-8).toUpperCase()}`;

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-6">
        <button
          onClick={() =>
            router.push(`/profile/transaction/details?id=${transactionId}`)
          }
          className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-400" />
        </button>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">
            {existingReview ? 'Update Review' : 'Rate Your Order'}
          </h1>
          <p className="text-gray-400 text-sm sm:text-base">
            Share your experience with this meal
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Review Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmitReview} className="space-y-6">
            {/* Order Summary */}
            <div className="bg-black border border-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                <Package size={20} className="mr-2" />
                Order Details
              </h2>

              <div className="bg-gray-900 rounded-lg p-4">
                <div className="flex items-start space-x-4">
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0">
                    {transaction.meal.images &&
                    transaction.meal.images.length > 0 ? (
                      <Image
                        src={transaction.meal.images[0]}
                        alt={transaction.meal.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500">
                        <Package size={24} />
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-white mb-1">
                      {transaction.meal.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-2">
                      by {transaction.meal.owner.username}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">
                        Order: {orderIdDisplay}
                      </span>
                      <span className="text-amber-500 font-medium">
                        Rp{transaction.totalPrice.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Rating Section */}
            <div className="bg-black border border-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">Rating</h2>
              <div className="text-center">
                <p className="text-gray-400 mb-4">
                  How would you rate this meal?
                </p>
                <div className="flex justify-center items-center space-x-2 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="transition-all duration-200 hover:scale-110"
                    >
                      <Star
                        size={40}
                        className={`${
                          star <= (hoveredRating || rating)
                            ? 'text-amber-500 fill-amber-500'
                            : 'text-gray-600 hover:text-amber-400'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                {rating > 0 && (
                  <p className="text-amber-500 font-medium">
                    {rating === 1 && 'Poor'}
                    {rating === 2 && 'Fair'}
                    {rating === 3 && 'Good'}
                    {rating === 4 && 'Very Good'}
                    {rating === 5 && 'Excellent'}
                  </p>
                )}
              </div>
            </div>

            {/* Review Section */}
            <div className="bg-black border border-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">Your Review</h2>
              <div>
                <label
                  htmlFor="review"
                  className="block text-gray-400 text-sm mb-2"
                >
                  Tell others about your experience (minimum 10 characters)
                </label>
                <textarea
                  id="review"
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  rows={5}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 resize-none"
                  placeholder="Share your thoughts about the meal quality, taste, presentation, delivery..."
                  required
                  minLength={10}
                />
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-500">
                    {review.length}/500 characters
                  </span>
                  <span className="text-xs text-gray-500">
                    {review.length >= 10
                      ? '✓'
                      : `${10 - review.length} more needed`}
                  </span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() =>
                  router.push(
                    `/profile/transaction/details?id=${transactionId}`
                  )
                }
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={
                  submitting || rating === 0 || review.trim().length < 10
                }
                className="flex-1 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-black px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
              >
                {submitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    <span>
                      {existingReview ? 'Update Review' : 'Submit Review'}
                    </span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column - Order Info */}
        <div className="space-y-6">
          {/* Order Status */}
          <div className="bg-black border border-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              <CheckCircle2 size={20} className="mr-2" />
              Order Status
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Status</span>
                <span className="text-green-400 font-medium">Completed</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Order Date</span>
                <span className="text-white">
                  {formatDate(transaction.createdAt)}
                </span>
              </div>
              {transaction.confirmedAt && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Completed</span>
                  <span className="text-white">
                    {formatDate(transaction.confirmedAt)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Customer Info */}
          <div className="bg-black border border-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              <User size={20} className="mr-2" />
              Your Information
            </h2>
            <div className="space-y-3">
              <div>
                <span className="text-gray-400 text-sm">Name</span>
                <p className="text-white">{transaction.name}</p>
              </div>
              <div>
                <span className="text-gray-400 text-sm">Email</span>
                <p className="text-white">{transaction.email}</p>
              </div>
            </div>
          </div>

          {/* Existing Review Info */}
          {existingReview && (
            <div className="bg-black border border-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">
                Current Review
              </h2>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={16}
                        className={
                          star <= existingReview.rating
                            ? 'text-amber-500 fill-amber-500'
                            : 'text-gray-600'
                        }
                      />
                    ))}
                  </div>
                  <span className="text-gray-400 text-sm">
                    Reviewed on {formatDate(existingReview.createdAt)}
                  </span>
                </div>
                <p className="text-gray-300 text-sm bg-gray-900 rounded p-3">
                  {existingReview.review}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
