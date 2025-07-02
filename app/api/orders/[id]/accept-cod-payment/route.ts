import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/database';
import Order from '@/models/Orders';
import Meal from '@/models/Meals';
import { getSessionUser } from '@/utils/getSessionUser';

// Helper function to update meal stock and statistics
const updateMealStock = async (mealId: string, quantity: number) => {
  try {
    const meal = await Meal.findById(mealId);
    if (!meal) {
      throw new Error('Meal not found');
    }

    // Update statistics
    meal.totalOrders = (meal.totalOrders || 0) + quantity;

    // Note: For COD, stock was already reduced when order was confirmed
    // This is just for updating statistics
    await meal.save();

    console.log('📊 [COD-ACCEPT] Meal statistics updated:', {
      mealId: meal._id,
      totalOrders: meal.totalOrders,
      currentStock: meal.stockQuantity,
    });

    return {
      success: true,
      totalOrders: meal.totalOrders,
      currentStock: meal.stockQuantity,
    };
  } catch (error) {
    console.error('❌ [COD-ACCEPT] Failed to update meal statistics:', error);
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
      '💰 [COD-ACCEPT] Processing COD payment acceptance for order:',
      params.id
    );

    // Find order with populated data
    const order = await Order.findById(params.id)
      .populate('meal', 'title price stockQuantity totalOrders')
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
          details: 'Only the meal owner can accept COD payment',
        },
        { status: 403 }
      );
    }

    console.log('🔍 [COD-ACCEPT] Current order state:', {
      orderId: order._id,
      paymentMethod: order.paymentMethod,
      status: order.status,
      paymentStatus: order.paymentStatus,
      customerName: order.user?.username,
      mealTitle: order.meal?.title,
    });

    // ✅ Validate this is a COD order
    if (order.paymentMethod !== 'cash_on_delivery') {
      return NextResponse.json(
        {
          error: 'Invalid payment method',
          details: `This endpoint only accepts COD orders. Current method: ${order.paymentMethod}`,
        },
        { status: 400 }
      );
    }

    // ✅ Validate order is in correct state for payment acceptance
    if (order.status !== 'confirmed') {
      return NextResponse.json(
        {
          error: 'Invalid order status',
          details: `Order must be confirmed before accepting payment. Current status: ${order.status}`,
          allowedStatus: 'confirmed',
          currentStatus: order.status,
        },
        { status: 400 }
      );
    }

    if (order.paymentStatus !== 'pending') {
      return NextResponse.json(
        {
          error: 'Payment already processed',
          details: `Payment status is already ${order.paymentStatus}`,
          currentPaymentStatus: order.paymentStatus,
        },
        { status: 400 }
      );
    }

    // ✅ Parse request body for additional options
    const body = await request.json().catch(() => ({}));
    const { notes, paymentReceivedAt } = body;

    const now = new Date();
    const paymentTime = paymentReceivedAt ? new Date(paymentReceivedAt) : now;

    // ✅ Update order status - COD payment accepted
    const originalStatus = {
      status: order.status,
      paymentStatus: order.paymentStatus,
    };

    order.paymentStatus = 'paid';
    order.status = 'processing'; // Move to processing after payment
    order.paidAt = paymentTime;

    // Add seller notes if provided
    if (notes) {
      order.sellerNotes = notes;
    }

    // Save order updates
    await order.save();

    console.log('✅ [COD-ACCEPT] Order updated successfully:', {
      orderId: order._id,
      statusChange: `${originalStatus.status} → ${order.status}`,
      paymentStatusChange: `${originalStatus.paymentStatus} → ${order.paymentStatus}`,
      paidAt: order.paidAt,
      sellerNotes: order.sellerNotes || 'None',
    });

    // ✅ Update meal statistics
    let mealStatsUpdated = false;
    try {
      await updateMealStock(order.meal._id, order.quantity);
      mealStatsUpdated = true;
    } catch (statsError) {
      console.error(
        '⚠️ [COD-ACCEPT] Failed to update meal statistics:',
        statsError
      );
      // Don't fail the entire operation for statistics update failure
    }

    // ✅ Prepare response data
    const responseData = {
      message: 'COD payment accepted successfully',
      order: {
        _id: order._id,
        status: order.status,
        paymentStatus: order.paymentStatus,
        paymentMethod: order.paymentMethod,
        paidAt: order.paidAt,
        sellerNotes: order.sellerNotes,
        totalPrice: order.totalPrice,
        customer: {
          name: order.user?.username,
          email: order.user?.email,
        },
        meal: {
          title: order.meal?.title,
          price: order.meal?.price,
        },
      },
      changes: {
        statusChange: `${originalStatus.status} → ${order.status}`,
        paymentStatusChange: `${originalStatus.paymentStatus} → ${order.paymentStatus}`,
        paymentAcceptedAt: order.paidAt,
      },
      mealStatsUpdated,
      timestamp: now.toISOString(),
    };

    console.log('🎉 [COD-ACCEPT] COD payment acceptance completed:', {
      orderId: order._id,
      newStatus: order.status,
      newPaymentStatus: order.paymentStatus,
      mealStatsUpdated,
    });

    return NextResponse.json(responseData, { status: 200 });
  } catch (error: any) {
    console.error('❌ [COD-ACCEPT] Unexpected error:', error);

    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error.message,
        orderId: params.id,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// ✅ Optional: GET method to check if order is eligible for COD payment acceptance
export async function GET(
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

    const order = await Order.findById(params.id).populate(
      'owner',
      'username email'
    );

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (order.owner._id.toString() !== sessionUser.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const isEligible =
      order.paymentMethod === 'cash_on_delivery' &&
      order.status === 'confirmed' &&
      order.paymentStatus === 'pending';

    return NextResponse.json({
      eligible: isEligible,
      order: {
        _id: order._id,
        status: order.status,
        paymentStatus: order.paymentStatus,
        paymentMethod: order.paymentMethod,
      },
      reason: !isEligible
        ? `Order not eligible: status=${order.status}, paymentStatus=${order.paymentStatus}, method=${order.paymentMethod}`
        : 'Order is eligible for COD payment acceptance',
    });
  } catch (error: any) {
    console.error('❌ [COD-ACCEPT] GET Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
