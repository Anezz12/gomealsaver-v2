// app/api/orders/create/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/database';
import Order from '@/models/Orders';
import Meal from '@/models/Meals';
import { getSessionUser } from '@/utils/getSessionUser';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    await connectDB();

    const sessionUser = await getSessionUser();
    if (!sessionUser || !sessionUser.userId) {
      return NextResponse.json(
        { error: 'You must be logged in to place an order' },
        { status: 401 }
      );
    }

    const {
      mealId,
      quantity,
      name,
      email,
      phone,
      address,
      city,
      postalCode,
      orderType,
      specialInstructions,
      paymentMethod = 'online', // 'online' or 'cash_on_delivery'
    } = await request.json();

    // Validate required fields
    if (
      !mealId ||
      !quantity ||
      !name ||
      !email ||
      !phone ||
      !address ||
      !city ||
      !postalCode ||
      !orderType
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Find the meal
    const meal = await Meal.findById(mealId).populate('owner');
    if (!meal) {
      return NextResponse.json({ error: 'Meal not found' }, { status: 404 });
    }

    // Check if meal is available
    if (!meal.available) {
      return NextResponse.json(
        { error: 'This meal is currently unavailable' },
        { status: 400 }
      );
    }

    // Check stock quantity
    if (meal.stockQuantity < quantity) {
      return NextResponse.json(
        {
          error: 'Insufficient stock',
          availableStock: meal.stockQuantity,
        },
        { status: 400 }
      );
    }

    // Calculate total price
    const totalPrice = meal.price * quantity;

    // Create order
    const order = new Order({
      owner: meal.owner._id,
      user: sessionUser.userId,
      meal: mealId,
      quantity,
      name,
      email,
      phone,
      address,
      city,
      postalCode,
      orderType,
      specialInstructions: specialInstructions || '',
      totalPrice,
      status:
        paymentMethod === 'cash_on_delivery' ? 'pending' : 'awaiting_payment',
      paymentStatus:
        paymentMethod === 'cash_on_delivery' ? 'pending' : 'pending',
    });

    await order.save();

    const response: any = {
      message: 'Order created successfully',
      order: await Order.findById(order._id)
        .populate('owner', 'username email')
        .populate('user', 'username email')
        .populate('meal', 'title price images'),
    };

    // If online payment, suggest to use create-payment endpoint
    if (paymentMethod === 'online') {
      response.message =
        'Order created. Use /api/orders/create-payment for online payment.';
      response.requiresPayment = true;
    } else {
      // For cash on delivery, update stock immediately
      meal.stockQuantity -= quantity;
      if (meal.stockQuantity === 0) {
        meal.available = false;
      }
      await meal.save();
    }

    return NextResponse.json(response, { status: 201 });
  } catch (error: any) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      {
        error: 'Failed to create order',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
