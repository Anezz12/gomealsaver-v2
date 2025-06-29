import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/database';
import Order from '@/models/Orders';
import { getSessionUser } from '@/utils/getSessionUser';

export async function PATCH(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const params = await props.params;
  try {
    await connectDB();

    const sessionUser = await getSessionUser();
    if (!sessionUser || !sessionUser.userId) {
      return NextResponse.json(
        { error: 'You must be logged in to update order status' },
        { status: 401 }
      );
    }

    const { status } = await request.json();

    // Validate status
    if (!['pending', 'processing', 'completed', 'cancelled'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    // Find the order
    const order = await Order.findById(params.id);
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Check if user is the meal owner (seller)
    if (order.owner.toString() !== sessionUser.userId) {
      return NextResponse.json(
        { error: 'You can only update orders for your own meals' },
        { status: 403 }
      );
    }

    // Update status
    const oldStatus = order.status;
    order.status = status;

    // Set confirmedAt timestamp when status changes to processing
    if (status === 'processing' && oldStatus === 'pending') {
      order.confirmedAt = new Date();
    }

    await order.save();

    // Populate the updated order
    const populatedOrder = await Order.findById(order._id)
      .populate('user', 'username email image')
      .populate('meal', 'title price images');

    return NextResponse.json(
      {
        message: 'Order status updated successfully',
        order: populatedOrder,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error updating order status:', error);
    return NextResponse.json(
      {
        error: 'Failed to update order status',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
