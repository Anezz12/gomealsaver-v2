import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/database';
import Order from '@/models/Orders';
import Meal from '@/models/Meals';
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

    // ✅ Restore meal stock and totalOrders if order was already confirmed/processing
    const shouldRestoreStock = ['confirmed', 'processing'].includes(
      order.status
    );

    if (shouldRestoreStock) {
      const meal = await Meal.findById(order.meal._id);
      if (meal) {
        // ✅ Restore stock quantity
        meal.stockQuantity += order.quantity;

        // ✅ Reduce total orders (kembalikan ke semula)
        meal.totalOrders = Math.max(0, meal.totalOrders - order.quantity);

        // ✅ Make meal available again if stock > 0
        if (meal.stockQuantity > 0) {
          meal.available = true;
        }

        await meal.save();

        console.log('📦 [CANCEL] Stock and totalOrders restored for meal:', {
          mealId: meal._id,
          stockRestored: order.quantity,
          totalOrdersReduced: order.quantity,
          newStock: meal.stockQuantity,
          newTotalOrders: meal.totalOrders,
          availabilityStatus: meal.available,
        });
      }
    }

    // Cancel the order
    order.status = 'cancelled';
    order.paymentStatus = 'cancelled';
    await order.save();

    const populatedOrder = await Order.findById(order._id)
      .populate('user', 'username email')
      .populate('owner', 'username email')
      .populate('meal', 'title price images');

    return NextResponse.json(
      {
        message: 'Order cancelled successfully',
        order: populatedOrder,
        stockRestored: shouldRestoreStock,
        restoredQuantity: shouldRestoreStock ? order.quantity : 0,
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
