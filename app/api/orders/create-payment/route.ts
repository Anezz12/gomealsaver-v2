// app/api/orders/create-payment/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/database';
import Order from '@/models/Orders';
import Meal from '@/models/Meals';
import { getSessionUser } from '@/utils/getSessionUser';
import { snap } from '@/config/midtrans';

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

    // Validate orderType
    if (!['dine_in', 'takeaway'].includes(orderType)) {
      return NextResponse.json(
        { error: 'Invalid order type. Must be dine_in or takeaway' },
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

    // Check if user is trying to order their own meal
    if (meal.owner._id.toString() === sessionUser.userId) {
      return NextResponse.json(
        { error: 'You cannot order your own meal' },
        { status: 400 }
      );
    }

    // Calculate total price with proper validation
    const itemPrice = Math.round(meal.price * quantity);
    const serviceFee = Math.round(itemPrice * 0.05); // 5% service fee
    const finalAmount = itemPrice + serviceFee;

    // Validate amounts
    if (itemPrice <= 0 || serviceFee < 0 || finalAmount <= 0) {
      return NextResponse.json(
        { error: 'Invalid price calculation' },
        { status: 400 }
      );
    }

    // Generate unique order ID
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substr(2, 9).toUpperCase();
    const midtransOrderId = `GMS-${timestamp}-${randomString}`;

    // Create order first
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
      totalPrice: finalAmount,
      status: 'awaiting_payment',
      paymentStatus: 'pending',
      midtransOrderId,
    });

    await order.save();

    // Generate expiry time (30 minutes from now)
    const currentTime = new Date();

    // Format expiry time for Midtrans (YYYY-MM-DD HH:MM:SS +0700)
    const formatExpiryTime = (date: Date): string => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');

      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds} +0700`;
    };

    // Parse name properly
    const nameParts = name.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || firstName; // Use firstName as fallback

    // Prepare Midtrans transaction parameter with proper validation
    const parameter = {
      transaction_details: {
        order_id: midtransOrderId,
        gross_amount: finalAmount,
      },
      credit_card: {
        secure: true,
      },
      item_details: [
        {
          id: meal._id.toString(),
          price: meal.price,
          quantity: quantity,
          name: meal.name.substring(0, 50), // Limit name length
          category: 'Food',
        },
        {
          id: 'service-fee',
          price: serviceFee,
          quantity: 1,
          name: 'Service Fee (5%)',
          category: 'Fee',
        },
      ],
      customer_details: {
        first_name: firstName.substring(0, 20), // Limit length
        last_name: lastName.substring(0, 20), // Limit length
        email: email,
        phone: phone.replace(/[^\d+]/g, ''), // Clean phone number
        billing_address: {
          first_name: firstName.substring(0, 20),
          last_name: lastName.substring(0, 20),
          email: email,
          phone: phone.replace(/[^\d+]/g, ''),
          address: address.substring(0, 200), // Limit address length
          city: city.substring(0, 20),
          postal_code: postalCode.replace(/[^\d]/g, ''), // Only numbers
          country_code: 'IDN',
        },
        shipping_address: {
          first_name: firstName.substring(0, 20),
          last_name: lastName.substring(0, 20),
          email: email,
          phone: phone.replace(/[^\d+]/g, ''),
          address: address.substring(0, 200),
          city: city.substring(0, 20),
          postal_code: postalCode.replace(/[^\d]/g, ''),
          country_code: 'IDN',
        },
      },
      callbacks: {
        finish: `${process.env.NEXT_PUBLIC_BASE_URL}/orders/${order._id}/payment-success`,
        error: `${process.env.NEXT_PUBLIC_BASE_URL}/orders/${order._id}/payment-failed`,
        pending: `${process.env.NEXT_PUBLIC_BASE_URL}/orders/${order._id}/payment-pending`,
      },
      expiry: {
        start_time: formatExpiryTime(currentTime),
        unit: 'minutes',
        duration: 30,
      },
    };

    // Log parameter for debugging
    console.log(
      '🔧 [DEBUG] Midtrans Parameter:',
      JSON.stringify(parameter, null, 2)
    );

    // Validate item_details total matches gross_amount
    const itemsTotal = parameter.item_details.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);

    if (itemsTotal !== finalAmount) {
      console.error('❌ [ERROR] Price mismatch:', {
        itemsTotal,
        finalAmount,
        difference: itemsTotal - finalAmount,
      });

      return NextResponse.json(
        {
          error: 'Price calculation error',
          details: `Items total (${itemsTotal}) doesn't match final amount (${finalAmount})`,
        },
        { status: 400 }
      );
    }

    // Create Snap token
    const transaction = await snap.createTransaction(parameter);

    console.log('✅ [SUCCESS] Snap token created:', transaction.token);

    // Save snap token to order
    order.snapToken = transaction.token;
    await order.save();

    // Populate the order for response
    const populatedOrder = await Order.findById(order._id)
      .populate('owner', 'username email')
      .populate('user', 'username email')
      .populate('meal', 'title price images');

    return NextResponse.json(
      {
        message: 'Payment created successfully',
        order: populatedOrder,
        snapToken: transaction.token,
        redirectUrl: transaction.redirect_url,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('💥 [ERROR] Error creating payment:', error);

    // Log more details for debugging
    if (error.ApiResponse) {
      console.error('🔍 [DEBUG] Midtrans API Response:', error.ApiResponse);
    }

    if (error.rawHttpClientData) {
      console.error('🔍 [DEBUG] Raw HTTP Data:', error.rawHttpClientData);
    }

    return NextResponse.json(
      {
        error: 'Failed to create payment',
        details: error.message,
        midtransError: error.ApiResponse || null,
      },
      { status: 500 }
    );
  }
}
