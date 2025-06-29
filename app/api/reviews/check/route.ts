import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/database';
import Review from '@/models/Review';
import { getSessionUser } from '@/utils/getSessionUser';

export async function GET(request: NextRequest) {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const transactionId = searchParams.get('transactionId');

    if (!transactionId) {
      return NextResponse.json(
        { message: 'Transaction ID is required' },
        { status: 400 }
      );
    }

    await connectDB();

    const existingReview = await Review.findOne({
      transaction: transactionId,
      user: sessionUser.userId,
    });

    return NextResponse.json({
      review: existingReview,
      exists: !!existingReview,
    });
  } catch (error) {
    console.error('Error checking review:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
