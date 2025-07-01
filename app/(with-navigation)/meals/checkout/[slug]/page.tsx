import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import connectDB from '@/config/database';
import Meal from '@/models/Meals';
import { getSessionUser } from '@/utils/getSessionUser';
import CheckoutForm from '@/components/Checkout/CheckoutForm';
import CheckoutSkeleton from '@/components/Checkout/CheckoutSkeleton';

interface CheckoutPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    quantity: string;
  }>;
}

async function getMeal(id: string) {
  try {
    await connectDB();
    const meal = await Meal.findById(id).populate(
      'owner',
      'username email phone address'
    );
    return meal ? JSON.parse(JSON.stringify(meal)) : null;
  } catch (error) {
    console.error('Error fetching meal:', error);
    return null;
  }
}

export default async function CheckoutPage({
  params,
  searchParams,
}: CheckoutPageProps) {
  const sessionUser = await getSessionUser();

  if (!sessionUser) {
    redirect('/auth/signin?callbackUrl=/meals/checkout/' + (await params).slug);
  }

  const meal = await getMeal((await params).slug);
  const quantity = parseInt((await searchParams).quantity || '1');

  if (!meal) {
    redirect('/meals');
  }

  // Check if user is trying to checkout their own meal
  if (meal.owner._id === sessionUser.userId) {
    redirect('/meals/' + (await params).slug);
  }

  // Check if meal is available
  if (!meal.available) {
    redirect('/meals/' + (await params).slug + '?error=unavailable');
  }

  // Check stock
  if (meal.stockQuantity < quantity) {
    redirect('/meals/' + (await params).slug + '?error=insufficient_stock');
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Checkout
          </h1>
          <p className="text-gray-400">Complete your order details</p>
        </div>

        <Suspense fallback={<CheckoutSkeleton />}>
          <CheckoutForm
            meal={meal}
            quantity={quantity}
            sessionUser={sessionUser}
          />
        </Suspense>
      </div>
    </div>
  );
}
