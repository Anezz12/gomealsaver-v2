// app/api/orders/seller/route.ts
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

    // Get orders where current user is the meal owner
    const orders = await Order.find({ owner: sessionUser.userId })
      .populate('meal', 'title price images description')
      .populate('user', 'username email')
      .sort({ createdAt: -1 });

    console.log(
      `📊 [SELLER ORDERS] Found ${orders.length} orders for seller:`,
      sessionUser.userId
    );

    return NextResponse.json({
      orders,
      count: orders.length,
    });
  } catch (error: any) {
    console.error('❌ [SELLER ORDERS] Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch orders',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
