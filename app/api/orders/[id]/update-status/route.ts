// app/api/orders/[id]/update-status/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/database';
import Order from '@/models/Orders';
import { getSessionUser } from '@/utils/getSessionUser';

export async function POST(
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

    const { status } = await request.json();

    const order = await Order.findById(params.id);
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Check if user is the meal owner
    if (order.owner.toString() !== sessionUser.userId) {
      return NextResponse.json(
        { error: 'Not authorized to update this order' },
        { status: 403 }
      );
    }

    // Validate status transition
    const validStatuses = ['processing', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    // Update order status
    order.status = status;

    if (status === 'completed') {
      order.confirmedAt = new Date();
    }

    await order.save();

    console.log('✅ [UPDATE STATUS] Order updated:', {
      orderId: order._id,
      newStatus: status,
      updatedBy: sessionUser.userId,
    });

    return NextResponse.json({
      message: 'Order status updated successfully',
      order: {
        _id: order._id,
        status: order.status,
        confirmedAt: order.confirmedAt,
      },
    });
  } catch (error: any) {
    console.error('❌ [UPDATE STATUS] Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to update order status',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
