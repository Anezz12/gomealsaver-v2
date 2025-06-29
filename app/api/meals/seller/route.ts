import { NextResponse } from 'next/server';
import connectDB from '@/config/database';
import Meal from '@/models/Meals';
import { getSessionUser } from '@/utils/getSessionUser';

export async function GET(): Promise<NextResponse> {
  try {
    await connectDB();

    const sessionUser = await getSessionUser();
    if (!sessionUser || !sessionUser.userId) {
      return NextResponse.json(
        { error: 'You must be logged in' },
        { status: 401 }
      );
    }

    const meals = await Meal.find({ owner: sessionUser.userId })
      .sort({ createdAt: -1 })
      .lean();

    console.log(
      `✅ [API] Found ${meals.length} meals for seller ${sessionUser.userId}`
    );

    return NextResponse.json({
      meals: meals.map((meal: any) => ({
        ...meal,
        _id: meal._id.toString(),
        owner: meal.owner.toString(),
      })),
    });
  } catch (error: any) {
    console.error('❌ [API] Error fetching meals:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch meals',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
