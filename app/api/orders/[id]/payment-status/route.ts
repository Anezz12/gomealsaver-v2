// app/api/orders/[id]/payment-status/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/database';
import Order from '@/models/Orders';
import { getSessionUser } from '@/utils/getSessionUser';
import { coreApi } from '@/config/midtrans';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(
  request: NextRequest,
  props: RouteParams
): Promise<NextResponse> {
  const params = await props.params;
  try {
    await connectDB();

    const sessionUser = await getSessionUser();
    if (!sessionUser || !sessionUser.userId) {
      return NextResponse.json(
        { error: 'You must be logged in to check payment status' },
        { status: 401 }
      );
    }

    const order = await Order.findById(params.id);
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Check authorization
    if (
      order.user.toString() !== sessionUser.userId &&
      order.owner.toString() !== sessionUser.userId
    ) {
      return NextResponse.json(
        { error: 'You are not authorized to check this payment' },
        { status: 403 }
      );
    }

    // Check payment status from Midtrans
    let midtransStatus = null;
    if (order.midtransOrderId) {
      try {
        midtransStatus = await coreApi.transaction.status(
          order.midtransOrderId
        );
      } catch (error) {
        console.error('Error checking Midtrans status:', error);
      }
    }

    return NextResponse.json(
      {
        order: {
          _id: order._id,
          status: order.status,
          paymentStatus: order.paymentStatus,
          midtransOrderId: order.midtransOrderId,
          paidAt: order.paidAt,
        },
        midtransStatus,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error checking payment status:', error);
    return NextResponse.json(
      {
        error: 'Failed to check payment status',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
