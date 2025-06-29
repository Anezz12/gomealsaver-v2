// app/api/orders/[id]/check-payment/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/database';
import Order from '@/models/Orders';
import Meal from '@/models/Meals';
import { getSessionUser } from '@/utils/getSessionUser';
import { coreApi } from '@/config/midtrans';

// ✅ Helper function to map Midtrans payment types to our enum
const mapPaymentMethod = (midtransPaymentType: string): string => {
  const paymentMethodMap: { [key: string]: string } = {
    qris: 'qris',
    credit_card: 'credit_card',
    debit_card: 'debit_card',
    bank_transfer: 'bank_transfer',
    echannel: 'bank_transfer',
    gopay: 'gopay',
    shopeepay: 'shopeepay',
    ovo: 'ovo',
    dana: 'dana',
    linkaja: 'linkaja',
    jenius: 'jenius',
    bca_va: 'bca_va',
    bni_va: 'bni_va',
    bri_va: 'bri_va',
    mandiri_va: 'mandiri_va',
    permata_va: 'permata_va',
    cimb_va: 'cimb_va',
    danamon_va: 'danamon_va',
    other_va: 'other_va',
    alfamart: 'alfamart',
    indomaret: 'indomaret',
    kioson: 'kioson',
    pos_indonesia: 'pos_indonesia',
  };

  return paymentMethodMap[midtransPaymentType] || 'bank_transfer';
};

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

    console.log('🔍 [CHECK] Authorization check:', {
      orderId: order._id,
      orderUser: order.user?.toString(),
      orderOwner: order.owner?.toString(),
      sessionUser: sessionUser.userId,
      userRole: sessionUser.role || 'user',
    });

    // Authorization logic
    const isOrderUser = order.user?.toString() === sessionUser.userId;
    const isOrderOwner = order.owner?.toString() === sessionUser.userId;

    if (!isOrderUser && !isOrderOwner) {
      return NextResponse.json(
        {
          error: 'Not authorized to check this payment',
          details: 'You must be either the customer or the seller',
        },
        { status: 403 }
      );
    }

    console.log('🔍 [CHECK] Current order status:', {
      orderId: order._id,
      currentStatus: order.status,
      currentPaymentStatus: order.paymentStatus,
      midtransOrderId: order.midtransOrderId,
    });

    // Check payment status from Midtrans
    if (order.midtransOrderId) {
      try {
        const midtransStatus = await coreApi.transaction.status(
          order.midtransOrderId
        );

        console.log('✅ [CHECK] Midtrans response:', {
          order_id: midtransStatus.order_id,
          transaction_status: midtransStatus.transaction_status,
          fraud_status: midtransStatus.fraud_status,
          payment_type: midtransStatus.payment_type,
          transaction_id: midtransStatus.transaction_id,
        });

        let shouldUpdate = false;
        let stockUpdated = false;

        // ✅ Map payment method before saving
        const mappedPaymentMethod = mapPaymentMethod(
          midtransStatus.payment_type
        );

        console.log('🔄 [CHECK] Payment method mapping:', {
          original: midtransStatus.payment_type,
          mapped: mappedPaymentMethod,
        });

        // Handle Settlement Status
        if (
          midtransStatus.transaction_status === 'settlement' &&
          order.paymentStatus !== 'paid'
        ) {
          order.paymentStatus = 'paid';
          order.status = 'processing';
          order.paidAt = new Date();
          order.midtransTransactionId = midtransStatus.transaction_id;
          order.paymentMethod = mappedPaymentMethod; // ✅ Use mapped method
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
        // Handle Capture Status
        else if (midtransStatus.transaction_status === 'capture') {
          if (
            midtransStatus.fraud_status === 'accept' &&
            order.paymentStatus !== 'paid'
          ) {
            order.paymentStatus = 'paid';
            order.status = 'processing';
            order.paidAt = new Date();
            order.midtransTransactionId = midtransStatus.transaction_id;
            order.paymentMethod = mappedPaymentMethod; // ✅ Use mapped method
            shouldUpdate = true;

            // Update stock logic same as settlement
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
        // Handle Authorize Status
        else if (
          midtransStatus.transaction_status === 'authorize' &&
          order.paymentStatus !== 'paid'
        ) {
          order.paymentStatus = 'paid';
          order.status = 'processing';
          order.paidAt = new Date();
          order.midtransTransactionId = midtransStatus.transaction_id;
          order.paymentMethod = mappedPaymentMethod; // ✅ Use mapped method
          shouldUpdate = true;

          // Update stock
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
        // Handle Pending Status
        else if (midtransStatus.transaction_status === 'pending') {
          if (order.paymentStatus !== 'pending') {
            order.paymentStatus = 'pending';
            order.status = 'awaiting_payment';
            shouldUpdate = true;
          }
        }
        // Handle Failed/Cancelled Status
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
          try {
            await order.save();
            console.log('✅ [CHECK] Order status updated successfully:', {
              orderId: order._id,
              newStatus: order.status,
              newPaymentStatus: order.paymentStatus,
              paymentMethod: order.paymentMethod,
              transactionId: order.midtransTransactionId,
              stockUpdated,
            });
          } catch (saveError: any) {
            console.error('❌ [CHECK] Error saving order:', saveError);
            return NextResponse.json(
              {
                error: 'Failed to update order status',
                details: saveError.message,
                order: {
                  _id: order._id,
                  status: order.status,
                  paymentStatus: order.paymentStatus,
                },
              },
              { status: 500 }
            );
          }
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

        // Handle 404 - Transaction doesn't exist
        if (
          midtransError.httpStatusCode === '404' ||
          midtransError.httpStatusCode === 404
        ) {
          console.log('⚠️ [CHECK] Transaction not found in Midtrans');

          const orderAge = Date.now() - new Date(order.createdAt).getTime();
          const hoursAge = orderAge / (1000 * 60 * 60);

          if (hoursAge > 2 && order.paymentStatus === 'pending') {
            order.paymentStatus = 'expired';
            order.status = 'cancelled';
            await order.save();

            return NextResponse.json({
              message: 'Payment has expired',
              order: {
                _id: order._id,
                status: order.status,
                paymentStatus: order.paymentStatus,
                paidAt: order.paidAt,
              },
              error: 'Transaction not found in Midtrans (expired)',
              updated: true,
              reason: 'expired_transaction',
            });
          }

          return NextResponse.json({
            message: 'Transaction not found in Midtrans system',
            order: {
              _id: order._id,
              status: order.status,
              paymentStatus: order.paymentStatus,
              paidAt: order.paidAt,
            },
            error: 'Transaction not found in Midtrans',
            updated: false,
            reason: 'transaction_not_found',
          });
        }

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
