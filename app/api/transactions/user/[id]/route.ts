// app/api/transactions/user/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/database';
import Order from '@/models/Orders';
import { getSessionUser } from '@/utils/getSessionUser';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    await connectDB();

    const sessionUser = await getSessionUser();
    if (!sessionUser || !sessionUser.userId) {
      return NextResponse.json(
        { error: 'You must be logged in' },
        { status: 401 }
      );
    }

    const order = await Order.findOne({
      _id: params.id,
      user: sessionUser.userId, // Ensure user can only access their own orders
    })
      .populate('meal', 'title price images description owner')
      .populate('owner', 'username email phone')
      .populate({
        path: 'meal',
        populate: {
          path: 'owner',
          select: 'username email phone',
        },
      });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    console.log(`📋 [TRANSACTION DETAILS] Order found for user:`, {
      orderId: order._id,
      userId: sessionUser.userId,
      orderStatus: order.status,
      paymentStatus: order.paymentStatus,
    });

    return NextResponse.json({
      order,
      message: 'Transaction details retrieved successfully',
    });
  } catch (error: any) {
    console.error('❌ [TRANSACTION DETAILS] Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch transaction details',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
