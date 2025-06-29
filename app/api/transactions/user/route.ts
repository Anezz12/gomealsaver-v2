import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/database';
import Order from '@/models/Orders';
import { getSessionUser } from '@/utils/getSessionUser';

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    await connectDB();

    const sessionUser = await getSessionUser();
    if (!sessionUser || !sessionUser.userId) {
      return NextResponse.json(
        { error: 'You must be logged in' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const paymentStatus = searchParams.get('paymentStatus');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const filter: any = { user: sessionUser.userId };

    if (status && status !== 'all') {
      filter.status = status;
    }

    if (paymentStatus && paymentStatus !== 'all') {
      filter.paymentStatus = paymentStatus;
    }

    // ✅ Fix: Populate dengan field yang benar dari Meal model
    const orders = await Order.find(filter)
      .populate('meal', 'name price image description owner') // ✅ 'name' dan 'image'
      .populate('owner', 'username email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalOrders = await Order.countDocuments(filter);
    const totalPages = Math.ceil(totalOrders / limit);

    console.log(
      `📊 [USER TRANSACTIONS] Found ${orders.length} orders for user:`,
      sessionUser.userId
    );

    // ✅ Debug: Log meal data structure
    if (orders.length > 0 && orders[0].meal) {
      console.log('🖼️ [USER TRANSACTIONS] Sample meal data:', {
        mealId: orders[0].meal._id,
        name: orders[0].meal.name,
        image: orders[0].meal.image,
        imageType: typeof orders[0].meal.image,
        imageLength: orders[0].meal.image?.length,
      });
    }

    return NextResponse.json({
      orders,
      pagination: {
        currentPage: page,
        totalPages,
        totalOrders,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error: any) {
    console.error('❌ [USER TRANSACTIONS] Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch transactions',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
