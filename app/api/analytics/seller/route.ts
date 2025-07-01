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
        { error: 'You must be logged in' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '30'; // days
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - parseInt(period));

    // Base filter for seller's orders
    const baseFilter = {
      owner: sessionUser.userId,
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    };

    // Get all orders in period with proper population
    const orders = await Order.find(baseFilter)
      .populate({
        path: 'meal',
        select: 'name price image', // Add specific fields you need
        model: 'Meal', // Explicitly specify the model
      })
      .sort({ createdAt: -1 });

    // Calculate metrics
    const totalOrders = orders.length;
    const completedOrders = orders.filter(
      (order) => order.status === 'completed'
    ).length;
    const processingOrders = orders.filter(
      (order) =>
        order.status === 'processing' || order.status === 'awaiting_payment'
    ).length;
    const cancelledOrders = orders.filter(
      (order) => order.status === 'cancelled'
    ).length;

    const totalRevenue = orders
      .filter((order) => order.paymentStatus === 'paid')
      .reduce((sum, order) => sum + order.totalPrice, 0);

    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Daily sales data for charts
    const dailySales = [];
    const dailyRevenue = [];

    for (let i = parseInt(period) - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const dayOrders = orders.filter((order) => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= date && orderDate < nextDate;
      });

      const dayRevenue = dayOrders
        .filter((order) => order.paymentStatus === 'paid')
        .reduce((sum, order) => sum + order.totalPrice, 0);

      dailySales.push({
        date: date.toISOString().split('T')[0],
        orders: dayOrders.length,
        revenue: dayRevenue,
      });

      dailyRevenue.push({
        date: date.toISOString().split('T')[0],
        revenue: dayRevenue,
      });
    }

    // Top selling meals with null check
    const mealSales: { [key: string]: any } = {};
    orders.forEach((order) => {
      // 🔧 FIX: Add null check for meal
      if (order.meal && order.meal._id && order.paymentStatus === 'paid') {
        const mealId = order.meal._id.toString();
        if (!mealSales[mealId]) {
          mealSales[mealId] = {
            meal: {
              _id: order.meal._id,
              name: order.meal.name || 'Unknown Meal',
              price: order.meal.price || 0,
              image: order.meal.image || [],
            },
            quantity: 0,
            revenue: 0,
            orders: 0,
          };
        }
        mealSales[mealId].quantity += order.quantity || 0;
        mealSales[mealId].revenue += order.totalPrice || 0;
        mealSales[mealId].orders += 1;
      }
    });

    const topMeals = Object.values(mealSales)
      .sort((a: any, b: any) => b.revenue - a.revenue)
      .slice(0, 5);

    // Recent orders with safe population
    const recentOrders = orders.slice(0, 10).map((order) => ({
      ...order.toObject(),
      meal: order.meal
        ? {
            _id: order.meal._id,
            name: order.meal.name || 'Unknown Meal',
            price: order.meal.price || 0,
          }
        : null,
    }));

    // Compare with previous period
    const prevStartDate = new Date(startDate);
    prevStartDate.setDate(prevStartDate.getDate() - parseInt(period));

    const prevOrders = await Order.find({
      owner: sessionUser.userId,
      createdAt: {
        $gte: prevStartDate,
        $lt: startDate,
      },
    });

    const prevRevenue = prevOrders
      .filter((order) => order.paymentStatus === 'paid')
      .reduce((sum, order) => sum + order.totalPrice, 0);

    const revenueChange =
      prevRevenue > 0 ? ((totalRevenue - prevRevenue) / prevRevenue) * 100 : 0;
    const ordersChange =
      prevOrders.length > 0
        ? ((totalOrders - prevOrders.length) / prevOrders.length) * 100
        : 0;

    console.log(
      `📊 [SELLER ANALYTICS] Analytics data for seller ${sessionUser.userId}:`,
      {
        period,
        totalOrders,
        totalRevenue,
        revenueChange: revenueChange.toFixed(2) + '%',
        ordersChange: ordersChange.toFixed(2) + '%',
      }
    );

    return NextResponse.json({
      summary: {
        totalOrders,
        completedOrders,
        processingOrders,
        cancelledOrders,
        totalRevenue,
        averageOrderValue,
        revenueChange,
        ordersChange,
      },
      charts: {
        dailySales,
        dailyRevenue,
      },
      topMeals,
      recentOrders,
      period: parseInt(period),
    });
  } catch (error: any) {
    console.error('❌ [SELLER ANALYTICS] Error:', error);

    return NextResponse.json(
      {
        error: 'Failed to fetch analytics data',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
