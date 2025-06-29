// app/api/midtrans/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/database';
import Order from '@/models/Orders';
import Meal from '@/models/Meals';
import crypto from 'crypto';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    await connectDB();

    const body = await request.json();
    const {
      order_id,
      transaction_status,
      fraud_status,
      transaction_id,
      payment_type,
      signature_key,
      gross_amount,
      status_code,
    } = body;

    console.log('🔔 [WEBHOOK] Midtrans notification received:', {
      order_id,
      transaction_status,
      fraud_status,
      transaction_id,
      payment_type,
      status_code,
    });

    // ✅ Verify signature untuk keamanan
    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    const hash = crypto
      .createHash('sha512')
      .update(order_id + status_code + gross_amount + serverKey)
      .digest('hex');

    if (hash !== signature_key) {
      console.error('❌ [WEBHOOK] Invalid signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Find the order
    const order = await Order.findOne({ midtransOrderId: order_id });
    if (!order) {
      console.error('❌ [WEBHOOK] Order not found:', order_id);
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    console.log('📝 [WEBHOOK] Current order status:', {
      orderId: order._id,
      currentStatus: order.status,
      currentPaymentStatus: order.paymentStatus,
    });

    // Update order based on transaction status
    let orderStatus = order.status;
    let paymentStatus = order.paymentStatus;
    let shouldUpdateStock = false;

    switch (transaction_status) {
      case 'capture':
        if (fraud_status === 'challenge') {
          paymentStatus = 'pending';
          orderStatus = 'awaiting_payment';
        } else if (fraud_status === 'accept') {
          paymentStatus = 'paid';
          orderStatus = 'processing';
          order.paidAt = new Date();
          shouldUpdateStock = true;
        }
        break;

      case 'settlement':
        paymentStatus = 'paid';
        orderStatus = 'processing';
        order.paidAt = new Date();
        shouldUpdateStock = true;
        break;

      case 'pending':
        paymentStatus = 'pending';
        orderStatus = 'awaiting_payment';
        break;

      case 'deny':
      case 'cancel':
      case 'expire':
        paymentStatus = 'failed';
        orderStatus = 'cancelled';
        break;

      case 'failure':
        paymentStatus = 'failed';
        orderStatus = 'cancelled';
        break;

      default:
        console.log(
          `🤔 [WEBHOOK] Unhandled transaction status: ${transaction_status}`
        );
        break;
    }

    // Update order
    order.status = orderStatus;
    order.paymentStatus = paymentStatus;
    order.midtransTransactionId = transaction_id;
    order.paymentMethod = payment_type;

    await order.save();

    // Update meal stock if payment successful
    if (shouldUpdateStock) {
      const meal = await Meal.findById(order.meal);
      if (meal && meal.stockQuantity >= order.quantity) {
        meal.stockQuantity -= order.quantity;
        if (meal.stockQuantity === 0) {
          meal.available = false;
        }
        await meal.save();
        console.log('📦 [WEBHOOK] Stock updated for meal:', meal._id);
      }
    }

    console.log('✅ [WEBHOOK] Order updated successfully:', {
      orderId: order._id,
      newStatus: orderStatus,
      newPaymentStatus: paymentStatus,
      transactionId: transaction_id,
      stockUpdated: shouldUpdateStock,
    });

    return NextResponse.json(
      { message: 'Webhook processed successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('💥 [WEBHOOK] Error processing webhook:', error);
    return NextResponse.json(
      {
        error: 'Failed to process webhook',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
