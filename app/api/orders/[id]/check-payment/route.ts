import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/database';
import Order from '@/models/Orders';
import Meal from '@/models/Meals';
import { getSessionUser } from '@/utils/getSessionUser';
import { coreApi } from '@/config/midtrans';

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

    const order = await Order.findById(params.id);
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Check authorization
    if (order.user.toString() !== sessionUser.userId) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }

    console.log('🔍 [CHECK] Current order status:', {
      orderId: order._id,
      currentStatus: order.status,
      currentPaymentStatus: order.paymentStatus,
      midtransOrderId: order.midtransOrderId,
    });

    // Check payment status from Midtrans directly
    if (order.midtransOrderId) {
      try {
        const midtransStatus = await coreApi.transaction.status(
          order.midtransOrderId
        );

        console.log('🔍 [CHECK] Midtrans response:', {
          order_id: midtransStatus.order_id,
          transaction_status: midtransStatus.transaction_status,
          fraud_status: midtransStatus.fraud_status,
          payment_type: midtransStatus.payment_type,
          transaction_id: midtransStatus.transaction_id,
          status_code: midtransStatus.status_code,
          status_message: midtransStatus.status_message,
          transaction_time: midtransStatus.transaction_time,
          settlement_time: midtransStatus.settlement_time,
        });

        // Update order based on current Midtrans status
        let shouldUpdate = false;
        let stockUpdated = false;

        // ✅ Handle Settlement Status
        if (
          midtransStatus.transaction_status === 'settlement' &&
          order.paymentStatus !== 'paid'
        ) {
          order.paymentStatus = 'paid';
          order.status = 'processing';
          order.paidAt = new Date();
          order.midtransTransactionId = midtransStatus.transaction_id;
          order.paymentMethod = midtransStatus.payment_type;
          shouldUpdate = true;

          // Update meal stock
          try {
            const meal = await Meal.findById(order.meal);
            if (meal && meal.stockQuantity >= order.quantity) {
              meal.stockQuantity -= order.quantity;
              if (meal.stockQuantity === 0) {
                meal.available = false;
              }
              await meal.save();
              stockUpdated = true;
              console.log('📦 [CHECK] Stock updated for meal:', meal._id);
            }
          } catch (stockError) {
            console.error('❌ [CHECK] Error updating stock:', stockError);
          }
        }
        // ✅ Handle Capture Status
        else if (midtransStatus.transaction_status === 'capture') {
          if (
            midtransStatus.fraud_status === 'accept' &&
            order.paymentStatus !== 'paid'
          ) {
            order.paymentStatus = 'paid';
            order.status = 'processing';
            order.paidAt = new Date();
            order.midtransTransactionId = midtransStatus.transaction_id;
            order.paymentMethod = midtransStatus.payment_type;
            shouldUpdate = true;

            // Update meal stock
            try {
              const meal = await Meal.findById(order.meal);
              if (meal && meal.stockQuantity >= order.quantity) {
                meal.stockQuantity -= order.quantity;
                if (meal.stockQuantity === 0) {
                  meal.available = false;
                }
                await meal.save();
                stockUpdated = true;
                console.log('📦 [CHECK] Stock updated for meal:', meal._id);
              }
            } catch (stockError) {
              console.error('❌ [CHECK] Error updating stock:', stockError);
            }
          } else if (midtransStatus.fraud_status === 'challenge') {
            order.paymentStatus = 'pending';
            order.status = 'awaiting_payment';
            shouldUpdate = true;
          }
        }
        // ✅ Handle Authorize Status (untuk beberapa payment method)
        else if (
          midtransStatus.transaction_status === 'authorize' &&
          order.paymentStatus !== 'paid'
        ) {
          order.paymentStatus = 'paid';
          order.status = 'processing';
          order.paidAt = new Date();
          order.midtransTransactionId = midtransStatus.transaction_id;
          order.paymentMethod = midtransStatus.payment_type;
          shouldUpdate = true;

          // Update meal stock
          try {
            const meal = await Meal.findById(order.meal);
            if (meal && meal.stockQuantity >= order.quantity) {
              meal.stockQuantity -= order.quantity;
              if (meal.stockQuantity === 0) {
                meal.available = false;
              }
              await meal.save();
              stockUpdated = true;
              console.log('📦 [CHECK] Stock updated for meal:', meal._id);
            }
          } catch (stockError) {
            console.error('❌ [CHECK] Error updating stock:', stockError);
          }
        }
        // ✅ Handle Pending Status
        else if (midtransStatus.transaction_status === 'pending') {
          if (order.paymentStatus !== 'pending') {
            order.paymentStatus = 'pending';
            order.status = 'awaiting_payment';
            shouldUpdate = true;
          }
        }
        // ✅ Handle Failed/Cancelled Status
        else if (
          ['deny', 'cancel', 'expire', 'failure'].includes(
            midtransStatus.transaction_status
          )
        ) {
          if (order.paymentStatus !== 'failed') {
            order.paymentStatus = 'failed';
            order.status = 'cancelled';
            shouldUpdate = true;
          }
        }

        if (shouldUpdate) {
          await order.save();
          console.log('✅ [CHECK] Order status updated:', {
            orderId: order._id,
            newStatus: order.status,
            newPaymentStatus: order.paymentStatus,
            transactionId: order.midtransTransactionId,
            stockUpdated,
          });
        }

        return NextResponse.json({
          message: shouldUpdate
            ? 'Payment status updated successfully'
            : 'Payment status is current',
          order: {
            _id: order._id,
            status: order.status,
            paymentStatus: order.paymentStatus,
            paidAt: order.paidAt,
            midtransTransactionId: order.midtransTransactionId,
            paymentMethod: order.paymentMethod,
          },
          midtransStatus: {
            order_id: midtransStatus.order_id,
            transaction_status: midtransStatus.transaction_status,
            fraud_status: midtransStatus.fraud_status,
            payment_type: midtransStatus.payment_type,
            transaction_id: midtransStatus.transaction_id,
            status_code: midtransStatus.status_code,
            status_message: midtransStatus.status_message,
            transaction_time: midtransStatus.transaction_time,
            settlement_time: midtransStatus.settlement_time,
          },
          updated: shouldUpdate,
          stockUpdated,
        });
      } catch (midtransError: any) {
        console.error('❌ [CHECK] Midtrans API Error:', {
          message: midtransError.message,
          httpStatusCode: midtransError.httpStatusCode,
          ApiResponse: midtransError.ApiResponse,
        });

        return NextResponse.json(
          {
            order: {
              _id: order._id,
              status: order.status,
              paymentStatus: order.paymentStatus,
              paidAt: order.paidAt,
            },
            error: 'Failed to check Midtrans status',
            details: midtransError.message,
            statusCode: midtransError.httpStatusCode,
            apiResponse: midtransError.ApiResponse,
          },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      message: 'No Midtrans order ID found',
      order: {
        _id: order._id,
        status: order.status,
        paymentStatus: order.paymentStatus,
        paidAt: order.paidAt,
      },
    });
  } catch (error: any) {
    console.error('❌ [CHECK] Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to check payment status',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
