// app/api/orders/[id]/route.ts
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
        { error: 'You must be logged in to view order details' },
        { status: 401 }
      );
    }

    const order = await Order.findById(params.id)
      .populate('owner', 'username email image phone address')
      .populate('user', 'username email image phone address')
      .populate(
        'meal',
        'title price originalPrice images description location'
      );

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Check if user is involved in this order (either buyer or seller)
    const isOwner = order.owner._id.toString() === sessionUser.userId;
    const isUser = order.user._id.toString() === sessionUser.userId;

    if (!isOwner && !isUser) {
      return NextResponse.json(
        { error: 'You are not authorized to view this order' },
        { status: 403 }
      );
    }

    return NextResponse.json({ order }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch order',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
