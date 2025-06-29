// app/api/orders/[id]/cancel/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/database';
import Order from '@/models/Orders';
import Meal from '@/models/Meals';
import { getSessionUser } from '@/utils/getSessionUser';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    await connectDB();

    const sessionUser = await getSessionUser();
    if (!sessionUser || !sessionUser.userId) {
      return NextResponse.json(
        { error: 'You must be logged in to cancel order' },
        { status: 401 }
      );
    }

    const order = await Order.findById(params.id).populate('meal');
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Check if user can cancel this order
    const isUser = order.user.toString() === sessionUser.userId;
    const isOwner = order.owner.toString() === sessionUser.userId;

    if (!isUser && !isOwner) {
      return NextResponse.json(
        { error: 'You are not authorized to cancel this order' },
        { status: 403 }
      );
    }

    // Check if order can be cancelled
    if (order.status === 'completed') {
      return NextResponse.json(
        { error: 'Cannot cancel completed order' },
        { status: 400 }
      );
    }

    if (order.status === 'cancelled') {
      return NextResponse.json(
        { error: 'Order is already cancelled' },
        { status: 400 }
      );
    }

    // Cancel the order
    order.status = 'cancelled';
    await order.save();

    // Restore meal stock quantity
    const meal = await Meal.findById(order.meal._id);
    if (meal) {
      meal.stockQuantity += order.quantity;
      meal.available = true; // Make meal available again
      await meal.save();
    }

    const populatedOrder = await Order.findById(order._id)
      .populate('user', 'username email')
      .populate('owner', 'username email')
      .populate('meal', 'title price images');

    return NextResponse.json(
      {
        message: 'Order cancelled successfully',
        order: populatedOrder,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error cancelling order:', error);
    return NextResponse.json(
      {
        error: 'Failed to cancel order',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
