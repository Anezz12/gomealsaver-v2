import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/database';
import Review from '@/models/Review';
import Order from '@/models/Orders';
import User from '@/models/User';
import { getSessionUser } from '@/utils/getSessionUser';

export async function POST(request: NextRequest) {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { transactionId, mealId, rating, review, userName } =
      await request.json();

    // Validation
    if (!transactionId || !mealId || !rating || !review || !userName) {
      return NextResponse.json(
        { message: 'Missing required fields' },
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

    // Get user using sessionUser.userId
    const user = await User.findById(sessionUser.userId);
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Verify transaction exists and belongs to user
    const transaction = await Order.findOne({
      _id: transactionId,
      user: sessionUser.userId,
      status: 'completed',
    });

    if (!transaction) {
      return NextResponse.json(
        { message: 'Transaction not found or not completed' },
        { status: 404 }
      );
    }

    // Check if review already exists
    const existingReview = await Review.findOne({
      transaction: transactionId,
      user: sessionUser.userId,
    });

    if (existingReview) {
      return NextResponse.json(
        { message: 'Review already exists for this transaction' },
        { status: 400 }
      );
    }

    // Create new review
    const newReview = new Review({
      meal: mealId,
      transaction: transactionId,
      user: sessionUser.userId,
      name: userName,
      rating,
      review: review.trim(),
    });

    await newReview.save();

    return NextResponse.json(
      {
        message: 'Review created successfully',
        review: newReview,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
