import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/database';
import Order from '@/models/Orders';
import Meal from '@/models/Meals';
import { getSessionUser } from '@/utils/getSessionUser';

// Helper function to reserve stock for confirmed COD order
const reserveStock = async (mealId: string, quantity: number) => {
  try {
    const meal = await Meal.findById(mealId);
    if (!meal) {
      throw new Error('Meal not found');
    }

    if (meal.stockQuantity < quantity) {
      throw new Error(
        `Insufficient stock. Available: ${meal.stockQuantity}, Required: ${quantity}`
      );
    }

    // Reserve stock by reducing it
    meal.stockQuantity -= quantity;

    // Mark as unavailable if stock reaches zero
    if (meal.stockQuantity === 0) {
      meal.available = false;
    }

    await meal.save();

    console.log('📦 [COD-CONFIRM] Stock reserved:', {
      mealId: meal._id,
      reservedQuantity: quantity,
      remainingStock: meal.stockQuantity,
      stillAvailable: meal.available,
    });

    return {
      success: true,
      reservedQuantity: quantity,
      remainingStock: meal.stockQuantity,
      stillAvailable: meal.available,
    };
  } catch (error) {
    console.error('❌ [COD-CONFIRM] Stock reservation failed:', error);
    throw error;
  }
};

export async function POST(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const params = await props.params;

  try {
    await connectDB();

    const sessionUser = await getSessionUser();
    if (!sessionUser || !sessionUser.userId) {
      return NextResponse.json(
        { error: 'You must be logged in' },
        { status: 401 }
      );
    }

    console.log(
      '✅ [COD-CONFIRM] Processing COD order confirmation for:',
      params.id
    );

    const order = await Order.findById(params.id)
      .populate('meal', 'title price stockQuantity available')
      .populate('user', 'username email')
      .populate('owner', 'username email');

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // ✅ Verify user is the seller/owner
    if (order.owner._id.toString() !== sessionUser.userId) {
      return NextResponse.json(
        {
          error: 'Unauthorized',
          details: 'Only the meal owner can confirm COD orders',
        },
        { status: 403 }
      );
    }

    // ✅ Validate this is a COD order
    if (order.paymentMethod !== 'cash_on_delivery') {
      return NextResponse.json(
        {
          error: 'Invalid payment method',
          details: 'This endpoint only handles COD orders',
        },
        { status: 400 }
      );
    }

    // ✅ Validate order is pending
    if (order.status !== 'pending') {
      return NextResponse.json(
        {
          error: 'Invalid order status',
          details: `Order must be pending. Current: ${order.status}`,
        },
        { status: 400 }
      );
    }

    // ✅ Reserve stock for this order
    try {
      const stockResult = await reserveStock(order.meal._id, order.quantity);

      // Update order status
      order.status = 'confirmed';
      order.confirmedAt = new Date();

      await order.save();

      console.log('✅ [COD-CONFIRM] COD order confirmed successfully:', {
        orderId: order._id,
        stockResult,
        confirmedAt: order.confirmedAt,
      });

      return NextResponse.json({
        message: 'COD order confirmed successfully',
        order: {
          _id: order._id,
          status: order.status,
          paymentStatus: order.paymentStatus,
          confirmedAt: order.confirmedAt,
        },
        stockReserved: true,
        stockResult,
      });
    } catch (stockError) {
      console.error('❌ [COD-CONFIRM] Stock reservation failed:', stockError);

      return NextResponse.json(
        {
          error: 'Failed to confirm order',
          details:
            stockError instanceof Error
              ? stockError.message
              : 'Stock reservation failed',
          stockError: true,
        },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('❌ [COD-CONFIRM] Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
