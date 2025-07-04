import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/database';
import Order from '@/models/Orders';
import { getSessionUser } from '@/utils/getSessionUser';

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    await connectDB();

    const sessionUser = await getSessionUser();
    if (!sessionUser || !sessionUser.userId) {
      return NextResponse.json(
        { error: 'You must be logged in to view orders' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Build query
    const query: any = { user: sessionUser.userId };

    if (
      status &&
      ['pending', 'processing', 'completed', 'cancelled'].includes(status)
    ) {
      query.status = status;
    }

    // Get orders with pagination
    const orders = await Order.find(query)
      .populate('owner', 'username email image')
      .populate('meal', 'title price images description')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const totalOrders = await Order.countDocuments(query);
    const totalPages = Math.ceil(totalOrders / limit);

    return NextResponse.json(
      {
        orders,
        pagination: {
          currentPage: page,
          totalPages,
          totalOrders,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error fetching user orders:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch orders',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
