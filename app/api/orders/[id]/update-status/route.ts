import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/database';
import Order from '@/models/Orders';
import Meal from '@/models/Meals';
import { getSessionUser } from '@/utils/getSessionUser';

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

    // ✅ Keep only these valid statuses
    const validStatuses = [
      'pending',
      'awaiting_payment',
      'confirmed',
      'in_progress',
      'processing',
      'ready',
      'completed',
      'cancelled',
    ];

    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        {
          error: 'Invalid status',
          validStatuses,
        },
        { status: 400 }
      );
    }

    // ✅ Status transition validation
    const currentStatus = order.status;
    const currentPaymentStatus = order.paymentStatus;
    const paymentMethod = order.paymentMethod;

    console.log('🔄 [UPDATE STATUS] Status transition attempt:', {
      orderId: order._id,
      currentStatus,
      currentPaymentStatus,
      paymentMethod,
      requestedStatus: status,
      updatedBy: sessionUser.userId,
    });

    // ✅ Handle different status transitions based on payment method
    let stockUpdated = false;
    let shouldUpdateStock = false;
    let shouldRestoreStock = false;

    // ✅ CANCELLATION HANDLING - Restore stock if needed
    if (status === 'cancelled') {
      // Check if we need to restore stock
      const needsStockRestore = ['confirmed', 'processing'].includes(
        currentStatus
      );

      if (needsStockRestore) {
        try {
          const meal = await Meal.findById(order.meal);
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
            shouldRestoreStock = true;

            console.log(
              '📦 [UPDATE STATUS] Stock and totalOrders restored due to cancellation:',
              {
                mealId: meal._id,
                stockRestored: order.quantity,
                totalOrdersReduced: order.quantity,
                newStock: meal.stockQuantity,
                newTotalOrders: meal.totalOrders,
                availabilityStatus: meal.available,
              }
            );
          }
        } catch (stockError) {
          console.error(
            '❌ [UPDATE STATUS] Error restoring stock:',
            stockError
          );
          return NextResponse.json(
            {
              error: 'Failed to restore meal stock',
              details:
                stockError instanceof Error
                  ? stockError.message
                  : 'Unknown error occurred',
            },
            { status: 500 }
          );
        }
      }

      // Update order to cancelled
      order.status = 'cancelled';
      order.paymentStatus = 'cancelled';
    }
    // COD Order Status Transitions (using only validStatuses)
    else if (paymentMethod === 'cash_on_delivery') {
      if (status === 'confirmed' && currentStatus === 'pending') {
        // COD Order accepted by seller - confirmed with stock reduction
        shouldUpdateStock = true;
        order.status = 'confirmed';
        order.paymentStatus = 'pending'; // Still awaiting cash payment
      } else if (status === 'processing' && currentStatus === 'pending') {
        // COD Order accepted by seller - directly to processing
        shouldUpdateStock = true;
        order.status = 'processing';
        order.paymentStatus = 'pending'; // Still awaiting cash payment
      } else if (status === 'completed' && currentStatus === 'processing') {
        // COD Order completed
        order.status = 'completed';
        order.confirmedAt = new Date();
      } else {
        return NextResponse.json(
          {
            error: 'Invalid status transition for cash on delivery order',
            currentStatus,
            requestedStatus: status,
            validTransitions: getValidTransitions(currentStatus, paymentMethod),
          },
          { status: 400 }
        );
      }
    }
    // Online Payment Order Status Transitions
    else {
      if (status === 'processing' && currentPaymentStatus === 'paid') {
        // Online payment order accepted after payment
        order.status = 'processing';
      } else if (status === 'completed' && currentStatus === 'processing') {
        // Online payment order completed
        order.status = 'completed';
        order.confirmedAt = new Date();
      } else {
        return NextResponse.json(
          {
            error: 'Invalid status transition for online payment order',
            currentStatus,
            currentPaymentStatus,
            requestedStatus: status,
            validTransitions: getValidTransitions(
              currentStatus,
              paymentMethod,
              currentPaymentStatus
            ),
          },
          { status: 400 }
        );
      }
    }

    // ✅ Update meal stock if needed (for COD confirmed/processing orders)
    if (shouldUpdateStock) {
      try {
        const meal = await Meal.findById(order.meal);
        if (meal) {
          if (meal.stockQuantity >= order.quantity) {
            meal.stockQuantity -= order.quantity;
            meal.totalOrders += order.quantity;

            if (meal.stockQuantity === 0) {
              meal.available = false;
            }

            await meal.save();
            stockUpdated = true;

            console.log('📦 [UPDATE STATUS] Stock updated for meal:', {
              mealId: meal._id,
              stockReduced: order.quantity,
              totalOrdersIncreased: order.quantity,
              newStock: meal.stockQuantity,
              newTotalOrders: meal.totalOrders,
              availabilityStatus: meal.available,
            });
          } else {
            return NextResponse.json(
              {
                error: 'Insufficient stock for this order',
                availableStock: meal.stockQuantity,
                requestedQuantity: order.quantity,
              },
              { status: 400 }
            );
          }
        }
      } catch (stockError) {
        console.error('❌ [UPDATE STATUS] Error updating stock:', stockError);
        return NextResponse.json(
          {
            error: 'Failed to update meal stock',
            details:
              stockError instanceof Error
                ? stockError.message
                : 'Unknown error occurred',
          },
          { status: 500 }
        );
      }
    }

    // Save the order
    await order.save();

    console.log('✅ [UPDATE STATUS] Order updated successfully:', {
      orderId: order._id,
      oldStatus: currentStatus,
      newStatus: order.status,
      oldPaymentStatus: currentPaymentStatus,
      newPaymentStatus: order.paymentStatus,
      stockUpdated,
      stockRestored: shouldRestoreStock,
      confirmedAt: order.confirmedAt,
    });

    return NextResponse.json({
      message: 'Order status updated successfully',
      order: {
        _id: order._id,
        status: order.status,
        paymentStatus: order.paymentStatus,
        paymentMethod: order.paymentMethod,
        confirmedAt: order.confirmedAt,
        paidAt: order.paidAt,
      },
      stockUpdated,
      stockRestored: shouldRestoreStock,
      transition: {
        from: currentStatus,
        to: order.status,
        paymentMethod,
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

// ✅ Helper function using only validStatuses
function getValidTransitions(
  currentStatus: string,
  paymentMethod: string,
  paymentStatus?: string
): string[] {
  if (paymentMethod === 'cash_on_delivery') {
    switch (currentStatus) {
      case 'pending':
        return ['confirmed', 'processing', 'cancelled'];
      case 'confirmed':
        return ['processing', 'cancelled'];
      case 'processing':
        return ['completed', 'cancelled'];
      case 'completed':
        return [];
      case 'cancelled':
        return [];
      default:
        return [];
    }
  } else {
    // Online payment
    switch (currentStatus) {
      case 'awaiting_payment':
        return paymentStatus === 'paid'
          ? ['processing', 'cancelled']
          : ['cancelled'];
      case 'processing':
        return ['completed', 'cancelled'];
      case 'completed':
        return [];
      case 'cancelled':
        return [];
      default:
        return [];
    }
  }
}
