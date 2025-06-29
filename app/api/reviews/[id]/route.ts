import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/database';
import Review from '@/models/Review';
import { getSessionUser } from '@/utils/getSessionUser';

export async function PUT(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { rating, review } = await request.json();

    // Validation
    if (!rating || !review) {
      return NextResponse.json(
        { message: 'Rating and review are required' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { message: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    if (review.trim().length < 10) {
      return NextResponse.json(
        { message: 'Review must be at least 10 characters long' },
        { status: 400 }
      );
    }

    await connectDB();

    // Find and update review
    const existingReview = await Review.findOne({
      _id: params.id,
      user: sessionUser.userId,
    });

    if (!existingReview) {
      return NextResponse.json(
        { message: 'Review not found or not authorized' },
        { status: 404 }
      );
    }

    existingReview.rating = rating;
    existingReview.review = review.trim();
    await existingReview.save();

    return NextResponse.json({
      message: 'Review updated successfully',
      review: existingReview,
    });
  } catch (error) {
    console.error('Error updating review:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
